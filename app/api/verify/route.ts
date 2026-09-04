// ============================================================
// POST /api/verify
// ============================================================
// Main verification endpoint. Runs the full 7-step pipeline
// server-side, then persists the result to Supabase.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { classifyEnvironmentalClaim } from '@/lib/claim-classifier';
import { runVerification } from '@/lib/verification-engine';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_RESULTS, DEMO_CLAIMS } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const claimText: string = (body.claimText || body.claim || '').trim();
    const demoId: string = (body.demoId || '').trim();

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

    // ── Relevance gate ───────────────────────────────────────────
    const classification = classifyEnvironmentalClaim(claimText);
    if (!classification.isEnvironmentalClaim) {
      return NextResponse.json(
        {
          error: 'NOT_ENVIRONMENTAL_CLAIM',
          message:
            classification.message ||
            'GreenLedger verifies environmental and sustainability claims only.',
          suggestion: classification.suggestion,
          reason: classification.reason,
        },
        { status: 422 }
      );
    }

    // ── Run full verification pipeline ───────────────────────────
    const result = await runVerification(claimText);

    // ── Persist to Supabase (fire-and-forget if DB unavailable) ──
    if (isSupabaseConfigured) {
      try {
        // 1. Upsert claim record
        const { data: claimRow } = await supabaseAdmin
          .from('claims')
          .insert({
            claim_text: claimText,
            claim_type: result.audit_trail?.claim?.environmentalAttribute || 'OTHER',
            is_measurable: !!result.structured_claim?.percentage,
            specificity_level: result.scores.claim_specificity >= 3 ? 'HIGH' : result.scores.claim_specificity >= 2 ? 'MEDIUM' : 'LOW',
            keywords: result.audit_trail?.claim ? Object.values(result.audit_trail.claim).filter(Boolean) : [],
          })
          .select('id')
          .single();

        // 2. Insert verification record
        await supabaseAdmin.from('verifications').insert({
          id: result.id.startsWith('result-') ? undefined : result.id,
          claim_id: claimRow?.id || null,
          claim_text: result.claim_text,
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
        // Non-fatal: pipeline result is still returned
        console.warn('[GreenLedger] DB persist failed (non-fatal):', dbErr);
      }
    }

    return NextResponse.json({ result, isDemo: false });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Verification failed';

    // If the pipeline threw because of non-environmental input
    if (msg.includes('environmental')) {
      return NextResponse.json({ error: 'NOT_ENVIRONMENTAL_CLAIM', message: msg }, { status: 422 });
    }

    console.error('[GreenLedger] /api/verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
