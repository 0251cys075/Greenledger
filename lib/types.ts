// ============================================================
// GreenLedger — Core TypeScript Types
// ============================================================

export type VerificationStatus = 'VERIFIED' | 'INSUFFICIENT_EVIDENCE' | 'POTENTIAL_GREENWASHING';

export type ClaimType =
  | 'CARBON_NEUTRAL'
  | 'RECYCLABLE'
  | 'RECYCLED_MATERIALS'
  | 'BIODEGRADABLE'
  | 'ECO_FRIENDLY'
  | 'SUSTAINABLE'
  | 'ENERGY_EFFICIENT'
  | 'ZERO_WASTE'
  | 'OTHER';

export type SourceType =
  | 'SUSTAINABILITY_REPORT'
  | 'CERTIFICATION'
  | 'ENVIRONMENTAL_STANDARD'
  | 'REGULATORY'
  | 'THIRD_PARTY_AUDIT'
  | 'COMPANY_CLAIM'
  | 'certification_registry'
  | 'third_party_audit'
  | 'laboratory_report'
  | 'esg_sustainability_report'
  | 'government_public_database'
  | 'company_documentation'
  | 'marketing_material';

export type EvidenceSourceType =
  | 'certification_registry'
  | 'third_party_audit'
  | 'laboratory_report'
  | 'esg_sustainability_report'
  | 'government_public_database'
  | 'company_documentation'
  | 'marketing_material'
  | SourceType;

export type SourceReliabilityLevel =
  | 'TIER_1_CERTIFIED'       // Independent certification registry, neutral public database, ISO accredited lab
  | 'TIER_2_AUDITED'         // Independent third-party audit, accredited LCA
  | 'TIER_3_SELF_REPORTED';   // Corporate ESG report, internal declaration, marketing material

export interface StructuredClaim {
  claimText: string;
  product?: string;
  brand?: string;
  material?: string;
  percentage?: number;
  environmentalAttribute: string;
  certificationMentioned?: string;
  measurableMetric?: string;
  scope?: 'packaging' | 'product' | 'manufacturing' | 'company-wide';
}

export interface EvidenceRecord {
  id?: string;
  sourceName: string;
  sourceType: EvidenceSourceType;
  sourceURL?: string;
  evidenceText: string;
  publicationDate: string;
  verificationDate: string;
  reliabilityLevel: SourceReliabilityLevel;
  productMatch: 'EXACT' | 'PRODUCT_LINE' | 'BRAND_LEVEL' | 'UNMATCHED';
  claimMatch: 'CONFIRMS' | 'PARTIAL' | 'CONTRADICTS' | 'INSUFFICIENT';
  findings?: {
    confirmedPercentage?: number;
    standardReferenced?: string;
  };
}

export interface VerificationRuleTrigger {
  ruleId: string;
  ruleName: string;
  passed: boolean;
  severity: 'CRITICAL' | 'MAJOR' | 'INFO';
  description: string;
}

export interface AuditTrail {
  claim: StructuredClaim;
  evidenceSources: EvidenceRecord[];
  rulesTriggered: VerificationRuleTrigger[];
  evidenceStrength: EvidenceStrength;
  finalVerdict: VerificationStatus;
  timestamp: string;
}

export type EvidenceStrength = 'STRONG' | 'MODERATE' | 'WEAK' | 'NONE';

// ── User ───────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

// ── Product ────────────────────────────────────────────────
export interface Product {
  id: string;
  brand: string;
  product_name: string;
  category: string;
  image_url?: string;
  description?: string;
}

// ── Claim ──────────────────────────────────────────────────
export interface Claim {
  id: string;
  product_id?: string;
  claim_text: string;
  claim_type: ClaimType;
  created_at: string;
  // Derived from extraction
  is_measurable: boolean;
  specificity_level: 'HIGH' | 'MEDIUM' | 'LOW';
  keywords: string[];
}

// ── Evidence ───────────────────────────────────────────────
export interface Evidence {
  id: string;
  claim_id: string;
  source_name: string;
  source_type: SourceType;
  source_url?: string;
  source_date: string;
  relevance: 'HIGH' | 'MEDIUM' | 'LOW';
  excerpt?: string;
  is_independent: boolean;
}

// ── Verification ───────────────────────────────────────────
export interface VerificationScores {
  claim_specificity: number;     // 0–3
  evidence_availability: number; // 0–3
  certification_status: number;  // 0–2
  source_reliability: number;    // 0–2
  claim_evidence_match: number;  // 0–3
  total: number;                 // 0–13
}

export interface VerificationResult {
  id: string;
  claim_id: string;
  claim_text: string;
  status: VerificationStatus;
  evidence_strength: EvidenceStrength;
  scores: VerificationScores;
  reason: string;
  what_is_missing: string;
  evidence_assessment: EvidenceAssessmentItem[];
  sources: Evidence[];
  verified_at: string;
  product_name?: string;
  brand?: string;
  category?: string;
  structured_claim?: StructuredClaim;
  evidence_records?: EvidenceRecord[];
  audit_trail?: AuditTrail;
}

export interface EvidenceAssessmentItem {
  label: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  detail?: string;
}

// ── Report ─────────────────────────────────────────────────
export interface Report {
  id: string;
  claim_id?: string;
  product_brand?: string;
  claim_text: string;
  reason: string;
  additional_info?: string;
  submitted_at: string;
}

// ── Community Ledger Entry ─────────────────────────────────
export interface LedgerEntry {
  id: string;
  product_name: string;
  brand: string;
  claim_text: string;
  status: VerificationStatus;
  evidence_strength: EvidenceStrength;
  verified_at: string;
  category: string;
}

// ── Platform Metrics ───────────────────────────────────────
export interface PlatformMetrics {
  claims_checked: number;
  verified_claims: number;
  insufficient_evidence: number;
  potential_issues: number;
  last_updated: string;
}

// ── Verification Pipeline Step ─────────────────────────────
export interface PipelineStep {
  id: string;
  label: string;
  description: string;
  status: 'PENDING' | 'ACTIVE' | 'DONE';
  duration_ms: number;
}

// ── Demo Claim Preset ──────────────────────────────────────
export interface DemoClaim {
  id: string;
  label: string;
  claim_text: string;
  expected_verdict: VerificationStatus;
  category: string;
  brand: string;
}
