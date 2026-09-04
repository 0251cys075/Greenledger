// ============================================================
// GreenLedger — Verification Engine
// ============================================================
// Modular pipeline: each function can be swapped for a real
// AI/backend service call without touching the UI layer.
// ============================================================

import type {
  Claim,
  ClaimType,
  VerificationResult,
  VerificationStatus,
  EvidenceStrength,
  VerificationScores,
} from './types';
import { MOCK_RESULTS, DEMO_CLAIMS } from './mock-data';
import { classifyEnvironmentalClaim } from './claim-classifier';

// ── STEP 1: Claim Extraction ───────────────────────────────
// In production: replace with OCR + LLM extraction API call
export function extractClaim(rawText: string): Partial<Claim> {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  // Classify claim type based on keywords
  let claim_type: ClaimType = 'OTHER';
  if (lower.includes('carbon neutral') || lower.includes('net zero') || lower.includes('carbon offset')) {
    claim_type = 'CARBON_NEUTRAL';
  } else if (lower.includes('recyclable')) {
    claim_type = 'RECYCLABLE';
  } else if (lower.includes('recycled material') || lower.includes('recycled content') || lower.includes('recycled paper')) {
    claim_type = 'RECYCLED_MATERIALS';
  } else if (lower.includes('biodegradable') || lower.includes('compostable')) {
    claim_type = 'BIODEGRADABLE';
  } else if (lower.includes('eco-friendly') || lower.includes('eco friendly')) {
    claim_type = 'ECO_FRIENDLY';
  } else if (lower.includes('sustainable') || lower.includes('sustainability')) {
    claim_type = 'SUSTAINABLE';
  } else if (lower.includes('energy efficient') || lower.includes('lower emission') || lower.includes('zero emission')) {
    claim_type = 'ENERGY_EFFICIENT';
  } else if (lower.includes('zero waste')) {
    claim_type = 'ZERO_WASTE';
  }

  // Detect measurability (contains a %)
  const percentMatch = text.match(/(\d+)\s*%/);
  const is_measurable = !!percentMatch;

  // Detect specificity level
  const specificKeywords = ['%', 'certified', 'fsc', 'grs', 'gots', 'eu ecolabel', 'iso', 'verified', 'audited'];
  const broadKeywords = ['eco-friendly', '100% sustainable', '100% green', 'all-natural', 'clean', 'pure'];
  const specificCount = specificKeywords.filter((k) => lower.includes(k)).length;
  const broadCount = broadKeywords.filter((k) => lower.includes(k)).length;

  let specificity_level: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
  if (specificCount >= 2 || (is_measurable && specificCount >= 1)) specificity_level = 'HIGH';
  else if (broadCount >= 1 && specificCount === 0) specificity_level = 'LOW';

  // Extract keywords
  const allKeywords = [
    'eco-friendly', 'sustainable', 'recyclable', 'recycled', 'biodegradable',
    'compostable', 'carbon neutral', 'net zero', 'organic', 'certified', 'fsc',
    'grs', 'gots', 'energy efficient', 'zero waste', 'paper', 'packaging',
  ].filter((k) => lower.includes(k));

  return {
    claim_text: text,
    claim_type,
    is_measurable,
    specificity_level,
    keywords: allKeywords,
    created_at: new Date().toISOString(),
  };
}

// ── STEP 2: Evidence Retrieval ─────────────────────────────
// In production: query vector DB / ESG API / certification registries
export function retrieveEvidence(claim: Partial<Claim>): {
  evidence_availability: number;
  certification_status: number;
  source_reliability: number;
} {
  // Base scores derived from claim type and specificity
  // These would come from real API calls in production

  const { claim_type, is_measurable, specificity_level } = claim;

  let evidence_availability = 1;
  let certification_status = 0;
  let source_reliability = 1;

  // Specific + measurable claims are more likely to have verifiable evidence
  if (specificity_level === 'HIGH') {
    evidence_availability = 3;
    certification_status = 2;
    source_reliability = 2;
  } else if (specificity_level === 'MEDIUM') {
    evidence_availability = 2;
    certification_status = is_measurable ? 1 : 0;
    source_reliability = 1;
  } else {
    // LOW specificity
    evidence_availability = 1;
    certification_status = 0;
    source_reliability = 1;
  }

  // Adjust for claim types that commonly have established certification schemes
  const wellCertifiedTypes: ClaimType[] = ['RECYCLED_MATERIALS', 'CARBON_NEUTRAL', 'RECYCLABLE'];
  if (wellCertifiedTypes.includes(claim_type!)) {
    // These claim types have established third-party certification schemes
    // Bump potential for certification IF the claim is specific
    if (specificity_level === 'HIGH') certification_status = Math.min(2, certification_status + 1);
  }

  return { evidence_availability, certification_status, source_reliability };
}

// ── STEP 3: Claim-Evidence Matching ───────────────────────
// In production: LLM-assisted claim/evidence alignment scoring
export function matchClaimToEvidence(claim: Partial<Claim>): {
  claim_specificity: number;
  claim_evidence_match: number;
} {
  const { specificity_level, is_measurable } = claim;

  let claim_specificity = 1;
  let claim_evidence_match = 1;

  if (specificity_level === 'HIGH') {
    claim_specificity = 3;
    claim_evidence_match = 3;
  } else if (specificity_level === 'MEDIUM') {
    claim_specificity = 2;
    claim_evidence_match = is_measurable ? 2 : 1;
  } else {
    claim_specificity = 0;
    claim_evidence_match = 0;
  }

  return { claim_specificity, claim_evidence_match };
}

// ── STEP 4: Apply Verification Rules ──────────────────────
// Structured logic — NOT an LLM decision
// ── STEP 4: Apply Verification Rules ──────────────────────
// Structured logic — strictly controls status
export function applyVerificationRules(scores: VerificationScores, claim: Partial<Claim>): VerificationStatus {
  const { total } = scores;
  const lower = (claim.claim_text || '').toLowerCase();

  // Check for greenwashing red flags: vague buzzwords or absolute claims without qualification
  const vagueBuzzwords = ['100% eco-friendly', 'eco-friendly', 'all-natural', 'planet friendly', 'pure green', '100% sustainable'];
  const hasVagueBuzzword = vagueBuzzwords.some((bw) => lower.includes(bw));
  const isAbsolute = lower.includes('100%') || lower.includes('completely') || lower.includes('zero impact');

  // VERIFIED requires: specific/measurable claim + reliable supporting evidence + certification/audit alignment
  if (total >= 9 && claim.specificity_level === 'HIGH' && (claim.is_measurable || lower.includes('certified') || lower.includes('fsc') || lower.includes('grs') || lower.includes('renewable'))) {
    return 'VERIFIED';
  }

  // POTENTIAL GREENWASHING is ONLY assigned when the claim has active misleading/vague indicators
  if (hasVagueBuzzword || (isAbsolute && !claim.is_measurable && scores.certification_status === 0)) {
    return 'POTENTIAL_GREENWASHING';
  }

  // STEP 4 Standard: Environmental claim but insufficient/unconfirmed supporting evidence
  return 'INSUFFICIENT_EVIDENCE';
}

// ── STEP 5: Calculate Evidence Strength ───────────────────
export function calculateEvidenceStrength(scores: VerificationScores): EvidenceStrength {
  const { total } = scores;
  if (total >= 10) return 'STRONG';
  if (total >= 6) return 'MODERATE';
  if (total >= 3) return 'WEAK';
  return 'NONE';
}

// ── STEP 6: Generate AI Explanation ───────────────────────
// In production: call LLM with structured prompt using verified evidence
export function generateExplanation(
  status: VerificationStatus,
  claim: Partial<Claim>,
  scores: VerificationScores
): { reason: string; what_is_missing: string } {
  const claimText = claim.claim_text || '';

  const reasonTemplates: Record<VerificationStatus, string> = {
    VERIFIED: `This claim has been assessed against available evidence and found to be sufficiently supported. The claim "${claimText}" is specific, measurable, and backed by independent certification and third-party validation. Available sources are consistent with the stated claim, and no major contradictions were identified.`,
    INSUFFICIENT_EVIDENCE: `The claim "${claimText}" is environmental in nature, but GreenLedger could not find sufficient reliable independent evidence to verify it. The statement may be truthful, but lack of publicly accessible third-party audit reports or certification registry records prevents verification at this time.`,
    POTENTIAL_GREENWASHING: `The claim "${claimText}" uses broad or unqualified environmental language without providing measurable criteria or verifiable evidence. Under ISO 14021 environmental claims standards, unqualified statements of generic eco-friendliness are classified as potentially misleading without comprehensive life-cycle disclosures and independent certification.`,
  };

  const missingTemplates: Record<VerificationStatus, string> = {
    VERIFIED: `No significant evidence gaps identified. For continued verification, periodic re-auditing and certification maintenance is recommended.`,
    INSUFFICIENT_EVIDENCE: `To verify this claim, the following evidence is needed: (1) relevant third-party certification from a recognised body, (2) product-specific composition or lifecycle data, (3) independent audit or test report, and (4) publicly accessible evidence chain.`,
    POTENTIAL_GREENWASHING: `To move toward a verified status, the company would need to: (1) specify measurable environmental criteria, (2) provide verifiable product-specific data, (3) obtain independent certification, and (4) make supporting evidence publicly accessible.`,
  };

  return {
    reason: reasonTemplates[status],
    what_is_missing: missingTemplates[status],
  };
}

import {
  extractStructuredClaim,
  identifyProduct,
  retrieveAuditedEvidence,
  validateSources,
  runRulesEngine,
  buildAuditTrail,
  convertToLegacyEvidence,
} from './evidence-engine';

// ── MASTER: Run Full Verification Pipeline ────────────────
// In demo mode: return pre-computed mock results for demo claims
// In production mode: run each step against real APIs
export async function runVerification(
  claimText: string,
  demoId?: string
): Promise<VerificationResult> {
  // Simulate async pipeline delay (visual effect)
  await new Promise((resolve) => setTimeout(resolve, 100));

  // DEMO MODE: return pre-computed result for demo claims
  if (demoId && MOCK_RESULTS[demoId]) {
    return MOCK_RESULTS[demoId];
  }

  // Check if claim matches a demo preset
  const normalized = claimText.toLowerCase().trim();
  for (const demo of DEMO_CLAIMS) {
    if (demo.claim_text.toLowerCase() === normalized) {
      return MOCK_RESULTS[demo.id];
    }
  }

  // MANDATORY GATE: Claim Relevance Classification
  // Stop immediately if input is not an environmental claim
  const classification = classifyEnvironmentalClaim(claimText);
  if (!classification.isEnvironmentalClaim) {
    throw new Error(
      classification.message ||
        'GreenLedger verifies environmental and sustainability claims only.'
    );
  }

  // ARCHITECTURE STEP 1: Structured Claim Extraction
  const structured_claim = extractStructuredClaim(claimText);

  // ARCHITECTURE STEP 2: Product Identification
  const productInfo = identifyProduct(claimText);

  // ARCHITECTURE STEP 3: Audited Evidence Retrieval
  // NEVER fill missing evidence with AI-generated assumptions!
  const retrievedEvidence = retrieveAuditedEvidence(structured_claim);

  // ARCHITECTURE STEP 4: Source Validation & Reliability Classification
  const validatedEvidence = validateSources(retrievedEvidence);

  // ARCHITECTURE STEP 5: Defensible Rules Engine Evaluation
  // Strictly rules-driven: LLM provides structured analysis; Rules Engine determines final verdict
  const rulesResult = runRulesEngine(structured_claim, validatedEvidence);

  // ARCHITECTURE STEP 6: Defensible Audit Trail Construction
  const audit_trail = buildAuditTrail(structured_claim, validatedEvidence, rulesResult);

  const resultId = `result-${Date.now()}`;
  const legacySources = convertToLegacyEvidence(validatedEvidence, resultId);

  const hasTier1 = validatedEvidence.some((e) => e.reliabilityLevel === 'TIER_1_CERTIFIED');
  const hasTier2 = validatedEvidence.some((e) => e.reliabilityLevel === 'TIER_2_AUDITED');
  const hasCert = validatedEvidence.some((e) => e.sourceType === 'certification_registry');

  const scores: VerificationScores = {
    claim_specificity: structured_claim.percentage !== undefined ? 3 : structured_claim.material ? 2 : 1,
    evidence_availability: validatedEvidence.length >= 3 ? 3 : validatedEvidence.length > 0 ? 2 : 0,
    certification_status: hasCert ? 2 : 0,
    source_reliability: hasTier1 ? 2 : hasTier2 ? 1 : 0,
    claim_evidence_match: rulesResult.verdict === 'VERIFIED' ? 3 : rulesResult.verdict === 'INSUFFICIENT_EVIDENCE' ? 1 : 0,
    total: 0,
  };
  scores.total =
    scores.claim_specificity +
    scores.evidence_availability +
    scores.certification_status +
    scores.source_reliability +
    scores.claim_evidence_match;

  return {
    id: resultId,
    claim_id: `claim-${Date.now()}`,
    claim_text: claimText,
    status: rulesResult.verdict,
    evidence_strength: rulesResult.evidenceStrength,
    scores,
    reason: rulesResult.explanation,
    what_is_missing: rulesResult.whatIsMissing,
    evidence_assessment: [
      {
        label: 'Specific environmental criteria',
        status: structured_claim.percentage !== undefined ? 'PASS' : structured_claim.material ? 'PASS' : 'FAIL',
        detail: structured_claim.measurableMetric
          ? `Claim specifies concrete measurable metric: ${structured_claim.measurableMetric}`
          : 'Claim uses broad language without measurable criteria',
      },
      {
        label: 'Audited evidence availability',
        status: validatedEvidence.length >= 2 ? 'PASS' : validatedEvidence.length === 1 ? 'WARN' : 'FAIL',
        detail: validatedEvidence.length > 0
          ? `${validatedEvidence.length} public records evaluated against registry benchmarks`
          : 'No third-party audited evidence found in public registers',
      },
      {
        label: 'Certification registry status',
        status: hasCert ? 'PASS' : 'FAIL',
        detail: hasCert
          ? 'Verified against accredited certification registry'
          : 'No active third-party certification scope found',
      },
      {
        label: 'Source reliability rating',
        status: hasTier1 ? 'PASS' : hasTier2 ? 'WARN' : 'FAIL',
        detail: hasTier1
          ? 'Tier 1 certified independent laboratory or official registry'
          : hasTier2
          ? 'Tier 2 third-party audit documentation'
          : 'Sources are self-reported company claims',
      },
      {
        label: 'Rules Engine claim-evidence match',
        status: rulesResult.verdict === 'VERIFIED' ? 'PASS' : rulesResult.verdict === 'POTENTIAL_GREENWASHING' ? 'FAIL' : 'WARN',
        detail: rulesResult.rulesTriggered.map((r) => `${r.ruleId}: ${r.passed ? 'PASS' : 'FAIL'}`).join(' | '),
      },
    ],
    sources: legacySources,
    product_name: productInfo.product,
    brand: productInfo.brand,
    category: productInfo.category,
    structured_claim,
    evidence_records: validatedEvidence,
    audit_trail,
    verified_at: new Date().toISOString(),
  };
}
