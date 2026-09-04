// ============================================================
// GreenLedger — Supabase Client
// ============================================================
// Two client instances:
//   supabaseBrowser  → uses anon key, safe to import in 'use client' components
//   supabaseAdmin    → uses service role key, SERVER-SIDE API routes ONLY
// ============================================================

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const rawSupabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function sanitizeUrl(raw: string | undefined): string {
  if (!raw || typeof raw !== 'string') return 'https://placeholder.supabase.co';
  const clean = raw.trim().replace(/^["']|["']$/g, '');
  try {
    const u = new URL(clean);
    if ((u.protocol === 'http:' || u.protocol === 'https:') && clean.includes('.')) {
      return clean;
    }
  } catch {
    // Malformed URL string
  }
  return 'https://placeholder.supabase.co';
}

function sanitizeKey(raw: string | undefined): string {
  if (!raw || typeof raw !== 'string') return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';
  const clean = raw.trim().replace(/^["']|["']$/g, '');
  if (clean.length > 10 && clean !== 'undefined' && clean !== 'null') {
    return clean;
  }
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';
}

const cleanUrl = sanitizeUrl(rawSupabaseUrl);
const cleanAnonKey = sanitizeKey(rawSupabaseAnonKey);
const cleanServiceKey = sanitizeKey(rawSupabaseServiceKey || rawSupabaseAnonKey);

// ── Graceful degradation flag ────────────────────────────────
// When credentials are missing, DB calls will fail silently and
// the app falls back to mock data.
export const isSupabaseConfigured =
  cleanUrl.startsWith('https://') &&
  !cleanUrl.includes('placeholder.supabase.co') &&
  cleanAnonKey.length > 20 &&
  !cleanAnonKey.includes('placeholder');

function createSafeClient(url: string, key: string, options: Parameters<typeof createClient>[2] = {}): SupabaseClient {
  try {
    return createClient(url, key, options);
  } catch {
    return createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder', options);
  }
}

// ── Browser client (public, anon key) ───────────────────────
// Safe to use in client components for public reads.
export const supabaseBrowser = createSafeClient(cleanUrl, cleanAnonKey, {
  auth: { persistSession: false },
});

// ── Admin client (service role key) ─────────────────────────
// For server-side API routes only. Bypasses RLS.
// NEVER import this in 'use client' components.
export const supabaseAdmin = createSafeClient(cleanUrl, cleanServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
