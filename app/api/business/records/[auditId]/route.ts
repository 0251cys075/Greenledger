// ============================================================
// GET /api/business/records/[auditId]
// ============================================================
// Public — no auth required. Returns verification record by audit ID.
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { getClaimByAuditId } from '@/lib/business-store';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ auditId: string }> }
) {
  try {
    const { auditId } = await params;
    const claim = getClaimByAuditId(auditId);

    if (!claim || !claim.is_public) {
      return NextResponse.json({ error: 'Verification record not found' }, { status: 404 });
    }

    // Return public-safe subset — no internal IDs or private files
    return NextResponse.json({
      audit_id: claim.audit_id,
      product_name: claim.product_name,
      brand: claim.brand,
      company_name: claim.company_name,
      claim_text: claim.claim_text,
      claim_category: claim.claim_category,
      verdict: claim.verdict,
      verdict_reason: claim.verdict_reason,
      evidence_strength: claim.evidence_strength,
      scores: claim.scores,
      evidence_assessment: claim.evidence_assessment,
      evidence_records: claim.evidence_records,
      evidence_file_count: claim.evidence_files.length,
      evidence_file_names: claim.evidence_files.map((f) => f.filename),
      verified_at: claim.verified_at,
      is_demo: claim.is_demo,
      methodology_url: '/about#methodology',
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
