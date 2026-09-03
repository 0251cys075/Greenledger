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
export function applyVerificationRules(scores: VerificationScores): VerificationStatus {
  const { total } = scores;

  // Score thresholds
  if (total >= 9) return 'VERIFIED';
  if (total >= 5) return 'INSUFFICIENT_EVIDENCE';
  return 'POTENTIAL_GREENWASHING';
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
    INSUFFICIENT_EVIDENCE: `While the claim "${claimText}" contains specific language, GreenLedger could not locate sufficient independent evidence to confirm it. The claim may be factually accurate, but it cannot currently be independently verified with available sources. This assessment reflects the state of available evidence, not necessarily the company's actual practices.`,
    POTENTIAL_GREENWASHING: `The claim "${claimText}" uses broad environmental language without providing measurable criteria or specific evidence. Under ISO 14021 environmental claims standards, unqualified or vague environmental claims require substantiated, product-specific evidence. No independent certification or third-party validation was identified to support this claim. GreenLedger cannot confirm the claim's accuracy based on available evidence.`,
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

  // LIVE MODE: run the modular pipeline
  const claim = extractClaim(claimText);
  const evidence = retrieveEvidence(claim);
  const matching = matchClaimToEvidence(claim);

  const scores: VerificationScores = {
    ...matching,
    ...evidence,
    total:
      matching.claim_specificity +
      evidence.evidence_availability +
      evidence.certification_status +
      evidence.source_reliability +
      matching.claim_evidence_match,
  };

  const status = applyVerificationRules(scores);
  const evidence_strength = calculateEvidenceStrength(scores);
  const { reason, what_is_missing } = generateExplanation(status, claim, scores);

  const resultId = `result-${Date.now()}`;

  return {
    id: resultId,
    claim_id: `claim-${Date.now()}`,
    claim_text: claimText,
    status,
    evidence_strength,
    scores,
    reason,
    what_is_missing,
    evidence_assessment: [
      {
        label: 'Specific environmental criteria',
        status: claim.specificity_level === 'HIGH' ? 'PASS' : claim.specificity_level === 'MEDIUM' ? 'WARN' : 'FAIL',
        detail: claim.specificity_level === 'HIGH'
          ? 'Claim includes specific, measurable criteria'
          : claim.specificity_level === 'MEDIUM'
          ? 'Claim contains some specificity but may need further detail'
          : 'Claim uses broad language without measurable criteria',
      },
      {
        label: 'Supporting evidence',
        status: scores.evidence_availability >= 3 ? 'PASS' : scores.evidence_availability >= 2 ? 'WARN' : 'FAIL',
        detail: scores.evidence_availability >= 3
          ? 'Supporting evidence identified from multiple sources'
          : scores.evidence_availability >= 2
          ? 'Limited evidence available; gaps remain'
          : 'No sufficient supporting evidence found',
      },
      {
        label: 'Certification',
        status: scores.certification_status >= 2 ? 'PASS' : scores.certification_status >= 1 ? 'WARN' : 'FAIL',
        detail: scores.certification_status >= 2
          ? 'Active independent certification confirmed'
          : scores.certification_status >= 1
          ? 'Partial certification information available'
          : 'No relevant certification identified',
      },
      {
        label: 'Source reliability',
        status: scores.source_reliability >= 2 ? 'PASS' : scores.source_reliability >= 1 ? 'WARN' : 'FAIL',
        detail: scores.source_reliability >= 2
          ? 'Sources include independent verification'
          : 'Sources primarily self-reported',
      },
      {
        label: 'Claim-evidence match',
        status: scores.claim_evidence_match >= 3 ? 'PASS' : scores.claim_evidence_match >= 1 ? 'WARN' : 'FAIL',
        detail: scores.claim_evidence_match >= 3
          ? 'Evidence closely aligns with the stated claim'
          : scores.claim_evidence_match >= 1
          ? 'Partial alignment between evidence and claim'
          : 'Evidence does not support the stated claim',
      },
    ],
    sources: [],
    verified_at: new Date().toISOString(),
  };
}
