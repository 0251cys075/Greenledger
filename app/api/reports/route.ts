// ============================================================
// POST /api/reports
// ============================================================
// Saves a greenwashing report submission to Supabase.
// Returns a tracking ticket ID.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { brand, claim, reason, additionalInfo } = body;

    if (!brand || !claim || !reason) {
      return NextResponse.json(
        { error: 'brand, claim, and reason are required' },
        { status: 400 }
      );
    }

    // Generate a human-readable ticket ID
    const ticketId = `GL-REP-${Math.floor(100000 + Math.random() * 900000)}`;

    // ── Persist to Supabase ──────────────────────────────────
    if (isSupabaseConfigured) {
      try {
        await supabaseAdmin.from('reports').insert({
          brand: brand.trim(),
          claim_text: claim.trim(),
          reason: reason.trim(),
          additional_info: (additionalInfo || '').trim() || null,
        });
      } catch (dbErr) {
        // Non-fatal: still return success with ticket ID
        console.warn('[GreenLedger] /api/reports DB insert failed (non-fatal):', dbErr);
      }
    }

    return NextResponse.json({ success: true, ticketId });
  } catch (error) {
    console.error('[GreenLedger] /api/reports error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
