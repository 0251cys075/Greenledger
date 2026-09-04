// ============================================================
// GET /api/result/[id]
// ============================================================
// Fetches a single verification result by ID.
// Priority order:
//   1. Mock data (for demo IDs like 'demo-1', 'demo-2', 'demo-3')
//   2. Supabase database (for real user submission IDs)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { MOCK_RESULTS } from '@/lib/mock-data';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  // ── 1. Check mock results first (demo claims) ─────────────
  if (MOCK_RESULTS[id]) {
    return NextResponse.json({ result: MOCK_RESULTS[id], source: 'mock' });
  }

  // ── 2. Query Supabase ─────────────────────────────────────
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabaseAdmin
        .from('verifications')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        // Reshape to match VerificationResult interface
        const result = {
          id: data.id,
          claim_id: data.claim_id || data.id,
          claim_text: data.claim_text,
          status: data.status,
          evidence_strength: data.evidence_strength,
          scores: data.scores,
          reason: data.reason,
          what_is_missing: data.what_is_missing,
          evidence_assessment: data.evidence_assessment || [],
          sources: [],
          verified_at: data.verified_at,
          product_name: data.product_name,
          brand: data.brand,
          category: data.category,
          structured_claim: data.audit_trail?.claim,
          evidence_records: data.evidence_records || [],
          audit_trail: data.audit_trail,
        };
        return NextResponse.json({ result, source: 'database' });
      }
    } catch (err) {
      console.warn('[GreenLedger] DB lookup failed for id:', id, err);
    }
  }

  // ── 3. Not found ──────────────────────────────────────────
  return NextResponse.json({ error: 'Result not found' }, { status: 404 });
}
