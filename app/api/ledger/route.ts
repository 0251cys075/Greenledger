// ============================================================
// GET /api/ledger
// ============================================================
// Returns the community ledger — real verifications from DB,
// falling back to mock data if Supabase is not configured.
// ============================================================

import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { COMMUNITY_LEDGER } from '@/lib/mock-data';
import type { LedgerEntry } from '@/lib/types';

export async function GET() {
  // ── Try Supabase first ────────────────────────────────────
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabaseAdmin
        .from('verifications')
        .select('id, claim_text, product_name, brand, category, status, evidence_strength, verified_at')
        .eq('is_public', true)
        .eq('is_demo', false)
        .order('verified_at', { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        const entries: LedgerEntry[] = data.map((row) => ({
          id: row.id,
          product_name: row.product_name || 'Unknown Product',
          brand: row.brand || 'Unknown Brand',
          claim_text: row.claim_text,
          status: row.status,
          evidence_strength: row.evidence_strength,
          verified_at: row.verified_at,
          category: row.category || 'General',
        }));

        // Merge with mock entries for richness while DB is sparse
        const combined = [...entries, ...COMMUNITY_LEDGER].slice(0, 50);
        return NextResponse.json({ entries: combined, source: 'database' });
      }
    } catch (err) {
      console.warn('[GreenLedger] /api/ledger DB error (non-fatal):', err);
    }
  }

  // ── Fallback to mock data ─────────────────────────────────
  return NextResponse.json({ entries: COMMUNITY_LEDGER, source: 'mock' });
}
