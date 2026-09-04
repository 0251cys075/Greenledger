// ============================================================
// GreenLedger — Supabase Client
// ============================================================
// Two client instances:
//   supabaseBrowser  → uses anon key, safe to import in 'use client' components
//   supabaseAdmin    → uses service role key, SERVER-SIDE API routes ONLY
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// ── Graceful degradation flag ────────────────────────────────
// When credentials are missing, DB calls will fail silently and
// the app falls back to mock data.
export const isSupabaseConfigured =
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 10;

// ── Browser client (public, anon key) ───────────────────────
// Safe to use in client components for public reads.
export const supabaseBrowser = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: { persistSession: false },
  }
);

// ── Admin client (service role key) ─────────────────────────
// For server-side API routes only. Bypasses RLS.
// NEVER import this in 'use client' components.
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || supabaseAnonKey || 'placeholder',
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);
