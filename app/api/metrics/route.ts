// ============================================================
// GET /api/metrics
// ============================================================
// Returns live platform statistics aggregated from Supabase.
// Falls back to mock metrics if DB is unavailable.
// ============================================================

import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { PLATFORM_METRICS } from '@/lib/mock-data';
import type { PlatformMetrics } from '@/lib/types';

export async function GET() {
  if (isSupabaseConfigured) {
    try {
      // Aggregate counts with a single query using filter on status
      const [totalRes, verifiedRes, insufficientRes, greenwashingRes] = await Promise.all([
        supabaseAdmin.from('verifications').select('id', { count: 'exact', head: true }).eq('is_demo', false),
        supabaseAdmin.from('verifications').select('id', { count: 'exact', head: true }).eq('status', 'VERIFIED').eq('is_demo', false),
        supabaseAdmin.from('verifications').select('id', { count: 'exact', head: true }).eq('status', 'INSUFFICIENT_EVIDENCE').eq('is_demo', false),
        supabaseAdmin.from('verifications').select('id', { count: 'exact', head: true }).eq('status', 'POTENTIAL_GREENWASHING').eq('is_demo', false),
      ]);

      const totalFromDB = totalRes.count ?? 0;
      const verifiedFromDB = verifiedRes.count ?? 0;
      const insufficientFromDB = insufficientRes.count ?? 0;
      const greenwashingFromDB = greenwashingRes.count ?? 0;

      // Add DB counts on top of the mock baseline numbers
      const metrics: PlatformMetrics = {
        claims_checked: PLATFORM_METRICS.claims_checked + totalFromDB,
        verified_claims: PLATFORM_METRICS.verified_claims + verifiedFromDB,
        insufficient_evidence: PLATFORM_METRICS.insufficient_evidence + insufficientFromDB,
        potential_issues: PLATFORM_METRICS.potential_issues + greenwashingFromDB,
        last_updated: new Date().toISOString(),
      };

      return NextResponse.json({ metrics, source: 'database' });
    } catch (err) {
      console.warn('[GreenLedger] /api/metrics DB error (non-fatal):', err);
    }
  }

  // ── Fallback ──────────────────────────────────────────────
  return NextResponse.json({
    metrics: { ...PLATFORM_METRICS, last_updated: new Date().toISOString() },
    source: 'mock',
  });
}
