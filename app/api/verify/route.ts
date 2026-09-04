// ============================================================
// POST /api/verify
// ============================================================
// Main verification endpoint. Supports 8 multilingual inputs.
// Runs the full 7-step pipeline server-side on normalized claim semantics,
// then persists the result to Supabase.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  analyzeMultilingualClaim,
  LOCALIZED_VERDICT_EXPLANATIONS,
} from '@/lib/multilingual-nlp';
import { runVerification } from '@/lib/verification-engine';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_RESULTS, DEMO_CLAIMS } from '@/lib/mock-data';
import { isValidLanguage, SupportedLanguage } from '@/lib/locales/registry';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const claimText: string = (body.claimText || body.claim || '').trim();
    const demoId: string = (body.demoId || '').trim();
    const languageHint: SupportedLanguage | undefined =
      body.language && isValidLanguage(body.language) ? body.language : undefined;

    if (!claimText) {
      return NextResponse.json(
        { error: 'claimText is required' },
        { status: 400 }
      );
    }

    // ── Demo claims: return pre-computed mock result immediately ──
    if (demoId && MOCK_RESULTS[demoId]) {
      return NextResponse.json({ result: MOCK_RESULTS[demoId], isDemo: true });
    }

    // Check if it matches a demo claim by text
    const normalised = claimText.toLowerCase();
    for (const demo of DEMO_CLAIMS) {
      if (demo.claim_text.toLowerCase() === normalised) {
        return NextResponse.json({
          result: MOCK_RESULTS[demo.id],
          isDemo: true,
        });
      }
    }

    // ── Multilingual Relevance & Normalization Gate ──────────────
    const analysis = analyzeMultilingualClaim(claimText, languageHint);
    if (!analysis.isEnvironmentalClaim) {
      return NextResponse.json(
        {
          error: 'NOT_ENVIRONMENTAL_CLAIM',
          message: analysis.message || 'GreenLedger verifies environmental and sustainability claims only.',
          suggestion: analysis.suggestion,
          language: analysis.language,
        },
        { status: 422 }
      );
    }

    // ── Run full verification pipeline on Normalized Claim ───────
    const result = await runVerification(analysis.normalizedClaim);

    // Keep user's original claim text on the result object for display
    result.claim_text = analysis.originalClaim;

    // Attach localized explanation
    const localizedExplanation =
      LOCALIZED_VERDICT_EXPLANATIONS[analysis.language]?.[result.status] ||
      LOCALIZED_VERDICT_EXPLANATIONS.en[result.status];
    (result as any).explanation_localized = localizedExplanation;
    (result as any).claim_language = analysis.language;
    (result as any).original_claim_text = analysis.originalClaim;
    (result as any).normalized_claim = analysis.normalizedClaim;

    // ── Persist to Supabase (fire-and-forget if DB unavailable) ──
    if (isSupabaseConfigured) {
      try {
        // 1. Upsert claim record
        const { data: claimRow } = await supabaseAdmin
          .from('claims')
          .insert({
            claim_text: analysis.originalClaim,
            original_claim_text: analysis.originalClaim,
            claim_language: analysis.language,
            normalized_claim: analysis.normalizedClaim,
            claim_type: analysis.claimType || result.audit_trail?.claim?.environmentalAttribute || 'OTHER',
            is_measurable: !!analysis.attributes?.percentage || !!result.structured_claim?.percentage,
            specificity_level: result.scores.claim_specificity >= 3 ? 'HIGH' : result.scores.claim_specificity >= 2 ? 'MEDIUM' : 'LOW',
            keywords: result.audit_trail?.claim ? Object.values(result.audit_trail.claim).filter(Boolean) : [],
          })
          .select('id')
          .single();

        // 2. Insert verification record
        await supabaseAdmin.from('verifications').insert({
          id: result.id.startsWith('result-') ? undefined : result.id,
          claim_id: claimRow?.id || null,
          claim_text: analysis.originalClaim,
          original_claim_text: analysis.originalClaim,
          claim_language: analysis.language,
          normalized_claim: analysis.normalizedClaim,
          explanation_localized: localizedExplanation,
          product_name: result.product_name || null,
          brand: result.brand || null,
          category: result.category || null,
          status: result.status,
          evidence_strength: result.evidence_strength,
          scores: result.scores,
          reason: result.reason,
          what_is_missing: result.what_is_missing,
          evidence_assessment: result.evidence_assessment,
          evidence_records: result.evidence_records || [],
          audit_trail: result.audit_trail || {},
          is_demo: false,
          is_public: true,
        });
      } catch (dbErr) {
        console.warn('[GreenLedger] DB persist failed (non-fatal):', dbErr);
      }
    }

    return NextResponse.json({ result, isDemo: false });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Verification failed';

    if (msg.includes('environmental')) {
      return NextResponse.json({ error: 'NOT_ENVIRONMENTAL_CLAIM', message: msg }, { status: 422 });
    }

    console.error('[GreenLedger] /api/verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
