// ============================================================
// POST /api/claims/analyze
// ============================================================
// Multilingual claim analysis endpoint.
// Detects language, gates environmental relevance, normalizes
// claim semantics into canonical English, and evaluates evidence.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  analyzeMultilingualClaim,
  LOCALIZED_VERDICT_EXPLANATIONS,
} from '@/lib/multilingual-nlp';
import { runVerification } from '@/lib/verification-engine';
import { isValidLanguage, SupportedLanguage } from '@/lib/locales/registry';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const claimText: string = (body.claim || body.claimText || '').trim();
    const languageHint: SupportedLanguage | undefined =
      body.language && isValidLanguage(body.language) ? body.language : undefined;

    if (!claimText) {
      return NextResponse.json(
        {
          valid: false,
          isEnvironmentalClaim: false,
          language: languageHint || 'en',
          errorType: 'EMPTY_INPUT',
          message: 'Claim text is required',
        },
        { status: 400 }
      );
    }

    // ── 1. Multilingual Analysis & Relevance Gating ─────────────
    const analysis = analyzeMultilingualClaim(claimText, languageHint);

    // If not environmental, reject and return localized response
    if (!analysis.isEnvironmentalClaim) {
      return NextResponse.json({
        valid: false,
        isEnvironmentalClaim: false,
        language: analysis.language,
        errorType: 'NON_ENVIRONMENTAL_CLAIM',
        message: analysis.message,
        suggestion: analysis.suggestion,
      });
    }

    // ── 2. Run Verification Pipeline on Normalized Claim ─────────
    // The engine runs deterministically on the normalized English claim representation
    const result = await runVerification(analysis.normalizedClaim);

    // ── 3. Build Localized Explanation ───────────────────────────
    const localizedExplanation =
      LOCALIZED_VERDICT_EXPLANATIONS[analysis.language]?.[result.status] ||
      result.reason ||
      LOCALIZED_VERDICT_EXPLANATIONS.en[result.status];

    // ── 4. Format Evidence Records ───────────────────────────────
    const evidence = (result.evidence_records || []).map((record) => ({
      sourceName: record.sourceName,
      sourceType: record.sourceType,
      sourceURL: record.sourceURL || null,
      originalText: record.evidenceText,
      originalLanguage: 'en',
      reliabilityLevel: record.reliabilityLevel,
      claimMatch: record.claimMatch,
      publicationDate: record.publicationDate,
    }));

    return NextResponse.json({
      valid: true,
      language: analysis.language,
      isEnvironmentalClaim: true,
      originalClaim: analysis.originalClaim,
      normalizedClaim: analysis.normalizedClaim,
      claimType: analysis.claimType,
      attributes: analysis.attributes,
      status: result.status,
      explanation: localizedExplanation,
      evidence,
      scores: result.scores,
      evidenceStrength: result.evidence_strength,
    });
  } catch (error) {
    console.error('Error in /api/claims/analyze:', error);
    return NextResponse.json(
      {
        valid: false,
        errorType: 'SERVER_ERROR',
        message: 'Internal error processing multilingual claim.',
      },
      { status: 500 }
    );
  }
}
