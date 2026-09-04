// ============================================================
// GET /api/explore
// ============================================================
// Returns searchable product + claim records for the Explore page.
// Merges DB results with mock data, falls back to mock-only.
//
// Query params:
//   q        — search text (product, brand, claim)
//   category — product category
//   status   — VERIFIED | INSUFFICIENT_EVIDENCE | POTENTIAL_GREENWASHING
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { EXPLORE_PRODUCTS } from '@/lib/mock-data';
import type { VerificationStatus } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').toLowerCase().trim();
  const category = (searchParams.get('category') || '').trim();
  const status = (searchParams.get('status') || '') as VerificationStatus | '';

  if (isSupabaseConfigured) {
    try {
      let query = supabaseAdmin
        .from('verifications')
        .select('id, claim_text, product_name, brand, category, status, evidence_strength, verified_at')
        .eq('is_public', true)
        .eq('is_demo', false)
        .order('verified_at', { ascending: false })
        .limit(100);

      if (status) query = query.eq('status', status);
      if (category && category !== 'All') query = query.eq('category', category);

      const { data, error } = await query;

      if (!error && data) {
        // Map to ExploreProduct shape
        let dbProducts = data.map((row) => ({
          id: row.id,
          product_name: row.product_name || 'Unknown Product',
          brand: row.brand || 'Unknown Brand',
          category: row.category || 'General',
          claim_text: row.claim_text,
          status: row.status as VerificationStatus,
          evidence_strength: row.evidence_strength,
          verified_at: row.verified_at,
          result_id: row.id,
        }));

        // Apply text search client-side
        if (q) {
          dbProducts = dbProducts.filter(
            (p) =>
              p.product_name.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q) ||
              p.claim_text.toLowerCase().includes(q)
          );
        }

        // Merge with mock data
        const mockFiltered = EXPLORE_PRODUCTS.filter((p) => {
          const matchQ = !q || p.product_name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.claim_text.toLowerCase().includes(q);
          const matchCat = !category || category === 'All' || p.category === category;
          const matchStatus = !status || p.status === status;
          return matchQ && matchCat && matchStatus;
        });

        const combined = [...dbProducts, ...mockFiltered].slice(0, 50);
        return NextResponse.json({ products: combined, source: 'database' });
      }
    } catch (err) {
      console.warn('[GreenLedger] /api/explore DB error (non-fatal):', err);
    }
  }

  // ── Fallback: filter mock data ────────────────────────────
  const filtered = EXPLORE_PRODUCTS.filter((p) => {
    const matchQ = !q || p.product_name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.claim_text.toLowerCase().includes(q);
    const matchCat = !category || category === 'All' || p.category === category;
    const matchStatus = !status || p.status === status;
    return matchQ && matchCat && matchStatus;
  });

  return NextResponse.json({ products: filtered, source: 'mock' });
}
