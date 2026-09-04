-- ============================================================
-- GreenLedger — Supabase PostgreSQL Schema
-- ============================================================
-- Run this ONCE in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/YOUR_REF/sql/new
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Products ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand       TEXT NOT NULL,
  product_name TEXT NOT NULL,
  category    TEXT NOT NULL,
  image_url   TEXT,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Claims ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS claims (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       UUID REFERENCES products(id) ON DELETE SET NULL,
  claim_text       TEXT NOT NULL,
  claim_type       TEXT NOT NULL DEFAULT 'OTHER',
  is_measurable    BOOLEAN DEFAULT FALSE,
  specificity_level TEXT DEFAULT 'LOW',
  keywords         TEXT[],
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── Verifications ───────────────────────────────────────────
-- Stores the full VerificationResult for every non-demo claim.
CREATE TABLE IF NOT EXISTS verifications (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id            UUID REFERENCES claims(id) ON DELETE SET NULL,
  claim_text          TEXT NOT NULL,
  product_name        TEXT,
  brand               TEXT,
  category            TEXT,
  status              TEXT NOT NULL CHECK (status IN ('VERIFIED','INSUFFICIENT_EVIDENCE','POTENTIAL_GREENWASHING')),
  evidence_strength   TEXT NOT NULL CHECK (evidence_strength IN ('STRONG','MODERATE','WEAK','NONE')),
  scores              JSONB NOT NULL DEFAULT '{}',
  reason              TEXT NOT NULL,
  what_is_missing     TEXT NOT NULL,
  evidence_assessment JSONB DEFAULT '[]',
  evidence_records    JSONB DEFAULT '[]',
  audit_trail         JSONB DEFAULT '{}',
  is_demo             BOOLEAN DEFAULT FALSE,
  is_public           BOOLEAN DEFAULT TRUE,
  verified_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ── Reports ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand           TEXT NOT NULL,
  claim_text      TEXT NOT NULL,
  reason          TEXT NOT NULL,
  additional_info TEXT,
  submitted_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ───────────────────────────────────────
-- verifications: anyone can read public ones; only service role can write
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_verifications_select" ON verifications;
CREATE POLICY "public_verifications_select"
  ON verifications FOR SELECT
  USING (is_public = TRUE);

DROP POLICY IF EXISTS "service_role_insert_verification" ON verifications;
CREATE POLICY "service_role_insert_verification"
  ON verifications FOR INSERT
  TO service_role
  WITH CHECK (TRUE);

-- reports: only service role can insert; no public read
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_insert_report" ON reports;
CREATE POLICY "service_role_insert_report"
  ON reports FOR INSERT
  TO service_role
  WITH CHECK (TRUE);

-- products/claims: fully public read
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_products_select" ON products FOR SELECT USING (TRUE);

ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_claims_select" ON claims FOR SELECT USING (TRUE);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_verifications_status      ON verifications(status);
CREATE INDEX IF NOT EXISTS idx_verifications_verified_at ON verifications(verified_at DESC);
CREATE INDEX IF NOT EXISTS idx_verifications_brand       ON verifications(brand);
CREATE INDEX IF NOT EXISTS idx_verifications_is_public   ON verifications(is_public);
CREATE INDEX IF NOT EXISTS idx_reports_submitted_at      ON reports(submitted_at DESC);
