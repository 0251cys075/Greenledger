// ============================================================
// GreenLedger — Mock Data
// All demo claims, products, ledger entries, and metrics
// Replace with real database calls in production
// ============================================================

import type {
  VerificationResult,
  LedgerEntry,
  PlatformMetrics,
  DemoClaim,
  Product,
  EvidenceAssessmentItem,
  Evidence,
} from './types';

// ── Demo Claims (hackathon quick-demo) ────────────────────
export const DEMO_CLAIMS: DemoClaim[] = [
  {
    id: 'demo-1',
    label: '"100% Eco-Friendly"',
    claim_text: '100% Eco-Friendly',
    expected_verdict: 'POTENTIAL_GREENWASHING',
    category: 'Household Products',
    brand: 'EcoHome Co.',
  },
  {
    id: 'demo-2',
    label: '"Made with 70% recycled material"',
    claim_text: 'Made with 70% recycled material',
    expected_verdict: 'INSUFFICIENT_EVIDENCE',
    category: 'Packaging',
    brand: 'PackRight Solutions',
  },
  {
    id: 'demo-3',
    label: '"Product packaging contains 80% recycled paper"',
    claim_text: 'Product packaging contains 80% recycled paper',
    expected_verdict: 'VERIFIED',
    category: 'Packaging',
    brand: 'GreenPack Industries',
  },
];

// ── Shared Evidence Bank ──────────────────────────────────
const evidenceBank: Record<string, Evidence[]> = {
  'demo-1': [
    {
      id: 'ev-1-1',
      claim_id: 'demo-1',
      source_name: 'EcoHome Co. Sustainability Report 2023',
      source_type: 'SUSTAINABILITY_REPORT',
      source_url: '#',
      source_date: '2023-12-01',
      relevance: 'HIGH',
      excerpt: 'The company reports broad environmental commitments but provides no specific metrics for this product line.',
      is_independent: false,
    },
    {
      id: 'ev-1-2',
      claim_id: 'demo-1',
      source_name: 'EU Ecolabel Certification Database',
      source_type: 'CERTIFICATION',
      source_url: '#',
      source_date: '2024-01-15',
      relevance: 'MEDIUM',
      excerpt: 'No active certification found for this product in the EU Ecolabel registry.',
      is_independent: true,
    },
    {
      id: 'ev-1-3',
      claim_id: 'demo-1',
      source_name: 'ISO 14021 Environmental Claims Standard',
      source_type: 'ENVIRONMENTAL_STANDARD',
      source_url: '#',
      source_date: '2021-06-01',
      relevance: 'HIGH',
      excerpt: 'ISO 14021 requires that broad claims such as "eco-friendly" be supported by specific, verifiable evidence.',
      is_independent: true,
    },
  ],
  'demo-2': [
    {
      id: 'ev-2-1',
      claim_id: 'demo-2',
      source_name: 'PackRight Solutions Annual Report 2023',
      source_type: 'SUSTAINABILITY_REPORT',
      source_url: '#',
      source_date: '2023-11-20',
      relevance: 'MEDIUM',
      excerpt: 'Report references recycled material use, but product-specific breakdowns are not disclosed.',
      is_independent: false,
    },
    {
      id: 'ev-2-2',
      claim_id: 'demo-2',
      source_name: 'GRS (Global Recycled Standard) Registry',
      source_type: 'CERTIFICATION',
      source_url: '#',
      source_date: '2024-02-10',
      relevance: 'HIGH',
      excerpt: 'No active GRS certification found for PackRight Solutions as of the verification date.',
      is_independent: true,
    },
    {
      id: 'ev-2-3',
      claim_id: 'demo-2',
      source_name: 'ISO 14021 Recycled Content Claims',
      source_type: 'ENVIRONMENTAL_STANDARD',
      source_url: '#',
      source_date: '2021-06-01',
      relevance: 'MEDIUM',
      excerpt: 'Recycled content claims must be verifiable and based on actual post-consumer or pre-consumer material composition.',
      is_independent: true,
    },
  ],
  'demo-3': [
    {
      id: 'ev-3-1',
      claim_id: 'demo-3',
      source_name: 'GreenPack Industries Sustainability Report 2024',
      source_type: 'SUSTAINABILITY_REPORT',
      source_url: '#',
      source_date: '2024-01-30',
      relevance: 'HIGH',
      excerpt: 'Product packaging is certified to contain 80% post-consumer recycled paper, validated by FSC certification.',
      is_independent: false,
    },
    {
      id: 'ev-3-2',
      claim_id: 'demo-3',
      source_name: 'FSC Chain of Custody Certification',
      source_type: 'CERTIFICATION',
      source_url: '#',
      source_date: '2024-03-01',
      relevance: 'HIGH',
      excerpt: 'GreenPack Industries holds an active FSC Chain of Custody certificate (FSC-C123456) covering this product line.',
      is_independent: true,
    },
    {
      id: 'ev-3-3',
      claim_id: 'demo-3',
      source_name: 'Third-Party Material Composition Audit',
      source_type: 'THIRD_PARTY_AUDIT',
      source_url: '#',
      source_date: '2023-12-15',
      relevance: 'HIGH',
      excerpt: 'Independent laboratory analysis confirmed 82% recycled paper content by weight, consistent with the 80% claim.',
      is_independent: true,
    },
  ],
};

const assessmentsBank: Record<string, EvidenceAssessmentItem[]> = {
  'demo-1': [
    { label: 'Specific environmental criteria', status: 'FAIL', detail: 'Claim uses broad language without defining measurable environmental criteria' },
    { label: 'Supporting evidence', status: 'FAIL', detail: 'No product-specific evidence found to substantiate the claim' },
    { label: 'Certification', status: 'WARN', detail: 'No relevant environmental certification identified' },
    { label: 'Source reliability', status: 'PASS', detail: 'Company sustainability report available, but self-reported' },
    { label: 'Claim-evidence match', status: 'FAIL', detail: 'Available evidence does not support the breadth of the claim' },
  ],
  'demo-2': [
    { label: 'Specific environmental criteria', status: 'PASS', detail: 'Claim references a specific percentage (70%)' },
    { label: 'Supporting evidence', status: 'WARN', detail: 'Company report mentions recycled materials but lacks product-level data' },
    { label: 'Certification', status: 'FAIL', detail: 'No GRS or equivalent certification found' },
    { label: 'Source reliability', status: 'WARN', detail: 'Existing sources are self-reported with limited independent verification' },
    { label: 'Claim-evidence match', status: 'WARN', detail: 'Partial alignment — specific percentage cannot be independently confirmed' },
  ],
  'demo-3': [
    { label: 'Specific environmental criteria', status: 'PASS', detail: 'Claim clearly specifies material type (paper) and percentage (80%)' },
    { label: 'Supporting evidence', status: 'PASS', detail: 'Third-party audit confirms 82% recycled paper content' },
    { label: 'Certification', status: 'PASS', detail: 'Active FSC Chain of Custody certification confirmed' },
    { label: 'Source reliability', status: 'PASS', detail: 'Independent certification and third-party audit available' },
    { label: 'Claim-evidence match', status: 'PASS', detail: 'Evidence closely aligns with and supports the stated claim' },
  ],
};

// ── Full Verification Results ──────────────────────────────
export const MOCK_RESULTS: Record<string, VerificationResult> = {
  'demo-1': {
    id: 'result-demo-1',
    claim_id: 'demo-1',
    claim_text: '100% Eco-Friendly',
    status: 'POTENTIAL_GREENWASHING',
    evidence_strength: 'WEAK',
    scores: {
      claim_specificity: 0,
      evidence_availability: 1,
      certification_status: 0,
      source_reliability: 1,
      claim_evidence_match: 0,
      total: 2,
    },
    reason:
      'The claim uses broad environmental language ("eco-friendly") without defining measurable criteria or providing specific evidence of environmental benefit. Under ISO 14021 standards, such unqualified claims require substantiated, product-specific evidence to be considered reliable. No independent certification or third-party validation was identified for this product.',
    what_is_missing:
      'To move toward a verified status, the company would need to: (1) specify which environmental aspects the claim refers to (e.g., materials, emissions, packaging), (2) provide measurable metrics such as lifecycle analysis data, (3) obtain independent certification from a recognised body such as EU Ecolabel, and (4) make supporting evidence publicly accessible.',
    evidence_assessment: assessmentsBank['demo-1'],
    sources: evidenceBank['demo-1'],
    verified_at: new Date().toISOString(),
  },
  'demo-2': {
    id: 'result-demo-2',
    claim_id: 'demo-2',
    claim_text: 'Made with 70% recycled material',
    status: 'INSUFFICIENT_EVIDENCE',
    evidence_strength: 'MODERATE',
    scores: {
      claim_specificity: 2,
      evidence_availability: 2,
      certification_status: 0,
      source_reliability: 1,
      claim_evidence_match: 1,
      total: 6,
    },
    reason:
      'While the claim includes a specific percentage, which is a positive sign of measurability, GreenLedger could not locate sufficient independent evidence to confirm the stated 70% recycled material content. The company\'s own sustainability report references recycled material use, but does not provide product-level composition data. No relevant third-party certification (e.g., GRS) was identified. The claim cannot be independently verified with currently available evidence.',
    what_is_missing:
      'To verify this claim, the following evidence is needed: (1) Global Recycled Standard (GRS) or equivalent certification covering this product, (2) product-specific material composition disclosure, (3) a third-party material audit, and (4) supply chain documentation tracing recycled input materials.',
    evidence_assessment: assessmentsBank['demo-2'],
    sources: evidenceBank['demo-2'],
    verified_at: new Date().toISOString(),
  },
  'demo-3': {
    id: 'result-demo-3',
    claim_id: 'demo-3',
    claim_text: 'Product packaging contains 80% recycled paper',
    status: 'VERIFIED',
    evidence_strength: 'STRONG',
    scores: {
      claim_specificity: 3,
      evidence_availability: 3,
      certification_status: 2,
      source_reliability: 2,
      claim_evidence_match: 3,
      total: 13,
    },
    reason:
      'This claim is supported by strong, multi-source evidence. An active FSC Chain of Custody certification was confirmed for this product line, and an independent third-party laboratory audit found 82% recycled paper content by weight — consistent with and slightly exceeding the stated 80% claim. The claim is specific, measurable, independently verified, and backed by a recognised environmental certification. All available evidence aligns with the claim.',
    what_is_missing:
      'No significant gaps identified. For continued verification, periodic re-auditing of material composition and maintenance of FSC certification renewal is recommended.',
    evidence_assessment: assessmentsBank['demo-3'],
    sources: evidenceBank['demo-3'],
    verified_at: new Date().toISOString(),
  },
};

// ── Sample Products ────────────────────────────────────────
export const SAMPLE_PRODUCTS: Product[] = [
  { id: 'prod-1', brand: 'GreenPack Industries', product_name: 'EcoPack Mailer Box', category: 'Packaging' },
  { id: 'prod-2', brand: 'SolarBrew Co.', product_name: 'Bamboo Coffee Capsule', category: 'Food & Beverage' },
  { id: 'prod-3', brand: 'CleanSurface Ltd.', product_name: 'All-Purpose Cleaner', category: 'Household' },
  { id: 'prod-4', brand: 'EcoHome Co.', product_name: 'Biodegradable Bin Bags', category: 'Household' },
  { id: 'prod-5', brand: 'AquaPure Systems', product_name: 'Refillable Water Filter', category: 'Appliances' },
  { id: 'prod-6', brand: 'TextileForward', product_name: 'Organic Cotton T-Shirt', category: 'Apparel' },
  { id: 'prod-7', brand: 'PackRight Solutions', product_name: 'Recycled Bubble Wrap', category: 'Packaging' },
  { id: 'prod-8', brand: 'BrightSource Energy', product_name: 'Solar Panel Kit', category: 'Energy' },
  { id: 'prod-9', brand: 'ForestWise Paper', product_name: 'FSC Notebook', category: 'Stationery' },
  { id: 'prod-10', brand: 'NaturaCare', product_name: 'Compostable Phone Case', category: 'Electronics' },
];

// ── Community Ledger ───────────────────────────────────────
export const COMMUNITY_LEDGER: LedgerEntry[] = [
  {
    id: 'ledger-1',
    product_name: 'EcoPack Mailer Box',
    brand: 'GreenPack Industries',
    claim_text: 'Product packaging contains 80% recycled paper',
    status: 'VERIFIED',
    evidence_strength: 'STRONG',
    verified_at: '2024-08-10T09:15:00Z',
    category: 'Packaging',
  },
  {
    id: 'ledger-2',
    product_name: 'Bamboo Coffee Capsule',
    brand: 'SolarBrew Co.',
    claim_text: '30% lower carbon emissions vs conventional capsules',
    status: 'VERIFIED',
    evidence_strength: 'STRONG',
    verified_at: '2024-08-09T14:22:00Z',
    category: 'Food & Beverage',
  },
  {
    id: 'ledger-3',
    product_name: 'All-Purpose Cleaner',
    brand: 'CleanSurface Ltd.',
    claim_text: '100% Eco-Friendly Formula',
    status: 'POTENTIAL_GREENWASHING',
    evidence_strength: 'WEAK',
    verified_at: '2024-08-08T11:05:00Z',
    category: 'Household',
  },
  {
    id: 'ledger-4',
    product_name: 'Recycled Bubble Wrap',
    brand: 'PackRight Solutions',
    claim_text: 'Made with 70% recycled material',
    status: 'INSUFFICIENT_EVIDENCE',
    evidence_strength: 'MODERATE',
    verified_at: '2024-08-07T16:45:00Z',
    category: 'Packaging',
  },
  {
    id: 'ledger-5',
    product_name: 'Organic Cotton T-Shirt',
    brand: 'TextileForward',
    claim_text: 'Certified organic cotton — GOTS certified',
    status: 'VERIFIED',
    evidence_strength: 'STRONG',
    verified_at: '2024-08-06T10:30:00Z',
    category: 'Apparel',
  },
  {
    id: 'ledger-6',
    product_name: 'Biodegradable Bin Bags',
    brand: 'EcoHome Co.',
    claim_text: '100% Biodegradable in 12 months',
    status: 'INSUFFICIENT_EVIDENCE',
    evidence_strength: 'MODERATE',
    verified_at: '2024-08-05T08:20:00Z',
    category: 'Household',
  },
  {
    id: 'ledger-7',
    product_name: 'FSC Notebook',
    brand: 'ForestWise Paper',
    claim_text: 'Sustainably sourced paper — FSC certified',
    status: 'VERIFIED',
    evidence_strength: 'STRONG',
    verified_at: '2024-08-04T13:10:00Z',
    category: 'Stationery',
  },
  {
    id: 'ledger-8',
    product_name: 'Compostable Phone Case',
    brand: 'NaturaCare',
    claim_text: '100% Compostable in home composting conditions',
    status: 'POTENTIAL_GREENWASHING',
    evidence_strength: 'WEAK',
    verified_at: '2024-08-03T15:55:00Z',
    category: 'Electronics',
  },
];

// ── Explore Products (with verification data) ──────────────
export interface ExploreProduct {
  id: string;
  product_name: string;
  brand: string;
  category: string;
  claim_text: string;
  status: import('./types').VerificationStatus;
  evidence_strength: import('./types').EvidenceStrength;
  verified_at: string;
  result_id: string;
}

export const EXPLORE_PRODUCTS: ExploreProduct[] = [
  {
    id: 'exp-1',
    product_name: 'EcoPack Mailer Box',
    brand: 'GreenPack Industries',
    category: 'Packaging',
    claim_text: 'Product packaging contains 80% recycled paper',
    status: 'VERIFIED',
    evidence_strength: 'STRONG',
    verified_at: '2024-08-10T09:15:00Z',
    result_id: 'demo-3',
  },
  {
    id: 'exp-2',
    product_name: 'Bamboo Coffee Capsule',
    brand: 'SolarBrew Co.',
    category: 'Food & Beverage',
    claim_text: '30% lower carbon emissions vs conventional capsules',
    status: 'VERIFIED',
    evidence_strength: 'STRONG',
    verified_at: '2024-08-09T14:22:00Z',
    result_id: 'demo-3',
  },
  {
    id: 'exp-3',
    product_name: 'FSC Notebook',
    brand: 'ForestWise Paper',
    category: 'Stationery',
    claim_text: 'Sustainably sourced paper — FSC certified',
    status: 'VERIFIED',
    evidence_strength: 'STRONG',
    verified_at: '2024-08-04T13:10:00Z',
    result_id: 'demo-3',
  },
  {
    id: 'exp-4',
    product_name: 'Recycled Bubble Wrap',
    brand: 'PackRight Solutions',
    category: 'Packaging',
    claim_text: 'Made with 70% recycled material',
    status: 'INSUFFICIENT_EVIDENCE',
    evidence_strength: 'MODERATE',
    verified_at: '2024-08-07T16:45:00Z',
    result_id: 'demo-2',
  },
  {
    id: 'exp-5',
    product_name: 'Biodegradable Bin Bags',
    brand: 'EcoHome Co.',
    category: 'Household',
    claim_text: '100% Biodegradable in 12 months',
    status: 'INSUFFICIENT_EVIDENCE',
    evidence_strength: 'MODERATE',
    verified_at: '2024-08-05T08:20:00Z',
    result_id: 'demo-2',
  },
  {
    id: 'exp-6',
    product_name: 'All-Purpose Cleaner',
    brand: 'CleanSurface Ltd.',
    category: 'Household',
    claim_text: '100% Eco-Friendly Formula',
    status: 'POTENTIAL_GREENWASHING',
    evidence_strength: 'WEAK',
    verified_at: '2024-08-08T11:05:00Z',
    result_id: 'demo-1',
  },
  {
    id: 'exp-7',
    product_name: 'Compostable Phone Case',
    brand: 'NaturaCare',
    category: 'Electronics',
    claim_text: '100% Compostable in home composting conditions',
    status: 'POTENTIAL_GREENWASHING',
    evidence_strength: 'WEAK',
    verified_at: '2024-08-03T15:55:00Z',
    result_id: 'demo-1',
  },
  {
    id: 'exp-8',
    product_name: 'Organic Cotton T-Shirt',
    brand: 'TextileForward',
    category: 'Apparel',
    claim_text: 'Certified organic cotton — GOTS certified',
    status: 'VERIFIED',
    evidence_strength: 'STRONG',
    verified_at: '2024-08-06T10:30:00Z',
    result_id: 'demo-3',
  },
];

// ── Platform Metrics (mock — replace with real DB aggregation) ──
export const PLATFORM_METRICS: PlatformMetrics = {
  claims_checked: 1247,
  verified_claims: 423,
  insufficient_evidence: 518,
  potential_issues: 306,
  last_updated: new Date().toISOString(),
};
