// ============================================================
// GET/POST /api/business/claims
// ============================================================
// POST: Validates claim, calls the existing /api/verify pipeline,
//       stores result, returns full verdict.
// GET:  Lists all business claims.
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { getClaims, addClaim, getProduct } from '@/lib/business-store';
import { analyzeMultilingualClaim } from '@/lib/multilingual-nlp';
import { runVerification } from '@/lib/verification-engine';
import type { EvidenceFile } from '@/lib/business-store';

export async function GET() {
  try {
    const claims = getClaims();
    return NextResponse.json({ claims });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      product_id,
      claim_text,
      claim_category,
      source_url,
      evidence_files = [],
    }: {
      product_id: string;
      claim_text: string;
      claim_category: string;
      source_url?: string;
      evidence_files?: EvidenceFile[];
    } = body;

    if (!product_id || !claim_text?.trim()) {
      return NextResponse.json(
        { error: 'product_id and claim_text are required' },
        { status: 400 }
      );
    }

    // ── 1. Environmental Relevance Gate ──────────────────────
    const analysis = analyzeMultilingualClaim(claim_text.trim());
    if (!analysis.isEnvironmentalClaim) {
      return NextResponse.json(
        {
          error: 'NON_ENVIRONMENTAL_CLAIM',
          message:
            analysis.message ||
            'This does not appear to be an environmental or sustainability claim.',
          suggestion: analysis.suggestion,
        },
        { status: 422 }
      );
    }

    // ── 2. Get product details ────────────────────────────────
    const product = getProduct(product_id);
    const product_name = product?.product_name || 'Unknown Product';
    const brand = product?.brand || 'Unknown Brand';
    const company_name = product?.company_name || brand;

    // ── 3. Run verification pipeline ─────────────────────────
    const result = await runVerification(analysis.normalizedClaim);

    // ── 4. Store claim with verdict ───────────────────────────
    const now = new Date().toISOString();
    const claim = addClaim({
      product_id,
      product_name,
      brand,
      company_name,
      claim_text: analysis.originalClaim,
      claim_category: claim_category || 'Environmental',
      status: result.status as 'VERIFIED' | 'INSUFFICIENT_EVIDENCE' | 'POTENTIAL_GREENWASHING',
      verdict: result.status as 'VERIFIED' | 'INSUFFICIENT_EVIDENCE' | 'POTENTIAL_GREENWASHING',
      verdict_reason: result.reason,
      verdict_explanation: result.reason,
      evidence_strength: result.evidence_strength,
      evidence_files: evidence_files,
      source_url: source_url || undefined,
      scores: result.scores as unknown as Record<string, number>,
      evidence_assessment: result.evidence_assessment,
      evidence_records: result.evidence_records || [],
      submitted_at: now,
      verified_at: now,
    });

    return NextResponse.json(
      {
        claim,
        verdict: result.status,
        audit_id: claim.audit_id,
        reason: result.reason,
        evidence_strength: result.evidence_strength,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Business Claims API] Error:', error);
    return NextResponse.json({ error: 'Failed to submit claim' }, { status: 500 });
  }
}
