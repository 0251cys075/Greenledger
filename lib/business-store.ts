// ============================================================
// GreenLedger Business Portal — In-Memory Store
// ============================================================
// Server-side store. Pre-seeded with EcoPure Industries demo.
// Module-level variables persist across requests in the dev server.
// ============================================================

export interface BusinessProduct {
  id: string;
  company_name: string;
  product_name: string;
  brand: string;
  category: string;
  description: string;
  barcode?: string;
  website_url?: string;
  image_url?: string;
  created_at: string;
  is_demo: boolean;
}

export type BusinessClaimStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'INSUFFICIENT_EVIDENCE'
  | 'POTENTIAL_GREENWASHING';

export interface EvidenceFile {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  upload_status: 'UPLOADED' | 'PROCESSING';
  description?: string;
}

export interface BusinessClaim {
  id: string;
  audit_id: string;
  product_id: string;
  product_name: string;
  brand: string;
  company_name: string;
  claim_text: string;
  claim_category: string;
  status: BusinessClaimStatus;
  verdict?: 'VERIFIED' | 'INSUFFICIENT_EVIDENCE' | 'POTENTIAL_GREENWASHING';
  verdict_reason?: string;
  verdict_explanation?: string;
  evidence_strength?: string;
  evidence_files: EvidenceFile[];
  source_url?: string;
  scores?: Record<string, number>;
  evidence_assessment?: Array<{ label: string; status: 'PASS' | 'WARN' | 'FAIL'; detail?: string }>;
  evidence_records?: Array<{
    sourceName: string;
    sourceType: string;
    sourceURL?: string;
    evidenceText: string;
    reliabilityLevel: string;
    claimMatch: string;
    publicationDate: string;
  }>;
  created_at: string;
  submitted_at?: string;
  verified_at?: string;
  is_demo: boolean;
  is_public: boolean;
}

// ── Demo Products ─────────────────────────────────────────────
const DEMO_PRODUCTS: BusinessProduct[] = [
  {
    id: 'biz-prod-1',
    company_name: 'EcoPure Industries',
    product_name: 'EcoBottle',
    brand: 'EcoPure',
    category: 'Beverages & Containers',
    description: 'Reusable water bottle manufactured with post-consumer recycled plastic content. Designed for circular economy principles.',
    barcode: 'ECO-BTL-001',
    website_url: 'https://ecopure.example.com/ecobottle',
    created_at: '2026-08-01T09:00:00Z',
    is_demo: true,
  },
  {
    id: 'biz-prod-2',
    company_name: 'EcoPure Industries',
    product_name: 'EcoPack',
    brand: 'EcoPure',
    category: 'Packaging',
    description: 'Retail packaging solution designed to maximise recyclable material content across cardboard and paper components.',
    barcode: 'ECO-PCK-002',
    website_url: 'https://ecopure.example.com/ecopack',
    created_at: '2026-08-05T11:00:00Z',
    is_demo: true,
  },
  {
    id: 'biz-prod-3',
    company_name: 'EcoPure Industries',
    product_name: 'EcoWash',
    brand: 'EcoPure',
    category: 'Household Products',
    description: 'Biodegradable laundry detergent with plant-based surfactants. Marketed as carbon-neutral by the manufacturer.',
    barcode: 'ECO-WSH-003',
    website_url: 'https://ecopure.example.com/ecowash',
    created_at: '2026-08-10T14:00:00Z',
    is_demo: true,
  },
];

// ── Demo Claims ───────────────────────────────────────────────
const DEMO_CLAIMS: BusinessClaim[] = [
  {
    id: 'biz-claim-1',
    audit_id: 'GL-ECO-8291',
    product_id: 'biz-prod-1',
    product_name: 'EcoBottle',
    brand: 'EcoPure',
    company_name: 'EcoPure Industries',
    claim_text: 'Made with 80% recycled plastic',
    claim_category: 'Recycled Materials',
    status: 'VERIFIED',
    verdict: 'VERIFIED',
    verdict_reason: 'The available evidence sufficiently supports the specific recycled-content claim. A material composition certificate from an accredited laboratory confirms 80% post-consumer recycled PET content. ISO 14021 standards for recycled-content claims are satisfied.',
    verdict_explanation: 'Strong material evidence confirms the stated 80% recycled plastic content.',
    evidence_strength: 'STRONG',
    scores: { claim_specificity: 3, evidence_availability: 3, certification_status: 2, source_reliability: 2, claim_evidence_match: 3, total: 13 },
    evidence_files: [
      { id: 'ef-1-1', filename: 'material-certificate-ecobottle-2026.pdf', file_type: 'PDF', file_size: 245000, upload_status: 'UPLOADED', description: 'Accredited material composition certificate' },
      { id: 'ef-1-2', filename: 'recycled-content-lab-report.pdf', file_type: 'PDF', file_size: 189000, upload_status: 'UPLOADED', description: 'Third-party laboratory analysis report' },
    ],
    source_url: 'https://www.tuv.com/recycled-content-certification',
    evidence_assessment: [
      { label: 'Claim Specificity', status: 'PASS', detail: 'Specific percentage (80%) provided — measurable and verifiable' },
      { label: 'Evidence Availability', status: 'PASS', detail: 'Material certificate + laboratory report provided' },
      { label: 'Certification Status', status: 'PASS', detail: 'ISO 14021 compliant; TÜV material verification referenced' },
      { label: 'Source Reliability', status: 'PASS', detail: 'Tier 1: accredited third-party laboratory confirmation' },
      { label: 'Claim–Evidence Match', status: 'PASS', detail: 'Laboratory report directly confirms 80% post-consumer recycled PET' },
    ],
    evidence_records: [
      {
        sourceName: 'TÜV Material Composition Certificate',
        sourceType: 'laboratory_report',
        sourceURL: 'https://www.tuv.com/recycled-content-certification',
        evidenceText: 'Material analysis confirms 80.2% post-consumer recycled PET (polyethylene terephthalate) content by mass. Certificate valid until December 2027.',
        reliabilityLevel: 'TIER_1_CERTIFIED',
        claimMatch: 'CONFIRMS',
        publicationDate: '2026-06-15',
      },
      {
        sourceName: 'ISO 14021:2016 — Environmental Claims Standard',
        sourceType: 'environmental_standard',
        sourceURL: 'https://www.iso.org/standard/66652.html',
        evidenceText: 'ISO 14021 requires that recycled-content percentage claims be supported by verifiable evidence. A specific percentage claim (e.g., 80%) that is confirmed by an independent laboratory meets the standard.',
        reliabilityLevel: 'TIER_1_CERTIFIED',
        claimMatch: 'CONFIRMS',
        publicationDate: '2016-09-01',
      },
    ],
    created_at: '2026-08-15T10:00:00Z',
    submitted_at: '2026-08-15T10:05:00Z',
    verified_at: '2026-08-15T10:06:00Z',
    is_demo: true,
    is_public: true,
  },
  {
    id: 'biz-claim-2',
    audit_id: 'GL-ECO-8292',
    product_id: 'biz-prod-2',
    product_name: 'EcoPack',
    brand: 'EcoPure',
    company_name: 'EcoPure Industries',
    claim_text: '100% recyclable packaging',
    claim_category: 'Recyclability',
    status: 'INSUFFICIENT_EVIDENCE',
    verdict: 'INSUFFICIENT_EVIDENCE',
    verdict_reason: 'The claim may be legitimate but the submitted evidence does not sufficiently verify "100% recyclable" across all packaging components. No independent recyclability certification was found. Company documentation alone does not meet the threshold for verification.',
    verdict_explanation: 'Recyclability claim requires independent testing or certification. Company self-declaration is insufficient.',
    evidence_strength: 'WEAK',
    scores: { claim_specificity: 2, evidence_availability: 1, certification_status: 0, source_reliability: 1, claim_evidence_match: 1, total: 5 },
    evidence_files: [
      { id: 'ef-2-1', filename: 'ecopack-sustainability-report-2026.pdf', file_type: 'PDF', file_size: 520000, upload_status: 'UPLOADED', description: 'Company sustainability report excerpt' },
    ],
    evidence_assessment: [
      { label: 'Claim Specificity', status: 'PASS', detail: '100% recyclable is a clear, specific claim' },
      { label: 'Evidence Availability', status: 'WARN', detail: 'Only company sustainability report provided — no independent certification' },
      { label: 'Certification Status', status: 'FAIL', detail: 'No third-party recyclability certification (e.g., How2Recycle, OPRL) found' },
      { label: 'Source Reliability', status: 'WARN', detail: 'Tier 3 self-reported only; independent source required' },
      { label: 'Claim–Evidence Match', status: 'WARN', detail: 'Sustainability report mentions recyclability goals but not verified 100% status' },
    ],
    evidence_records: [
      {
        sourceName: 'EcoPure Industries Sustainability Report 2026',
        sourceType: 'esg_sustainability_report',
        sourceURL: '',
        evidenceText: 'EcoPure states that EcoPack is designed for recyclability across all major municipal recycling programmes. No third-party certification is currently held.',
        reliabilityLevel: 'TIER_3_SELF_REPORTED',
        claimMatch: 'PARTIAL',
        publicationDate: '2026-03-01',
      },
    ],
    created_at: '2026-08-20T11:00:00Z',
    submitted_at: '2026-08-20T11:05:00Z',
    verified_at: '2026-08-20T11:06:00Z',
    is_demo: true,
    is_public: true,
  },
  {
    id: 'biz-claim-3',
    audit_id: 'GL-ECO-8293',
    product_id: 'biz-prod-3',
    product_name: 'EcoWash',
    brand: 'EcoPure',
    company_name: 'EcoPure Industries',
    claim_text: 'Carbon neutral product',
    claim_category: 'Carbon Neutrality',
    status: 'POTENTIAL_GREENWASHING',
    verdict: 'POTENTIAL_GREENWASHING',
    verdict_reason: 'The claim "carbon neutral product" is broad and unsubstantiated. No Life Cycle Assessment (LCA), verified carbon offset documentation, or accredited carbon neutrality certification (e.g., PAS 2060, Gold Standard) was provided. The available information is insufficient and the claim is presented without material qualification, creating a potential greenwashing concern under ISO 14021 and FTC Green Guides.',
    verdict_explanation: '"Carbon neutral" requires verified LCA and certified offsets. No such documentation was provided.',
    evidence_strength: 'NONE',
    scores: { claim_specificity: 1, evidence_availability: 0, certification_status: 0, source_reliability: 0, claim_evidence_match: 0, total: 1 },
    evidence_files: [],
    evidence_assessment: [
      { label: 'Claim Specificity', status: 'WARN', detail: '"Carbon neutral" without scope, methodology, or certification is vague' },
      { label: 'Evidence Availability', status: 'FAIL', detail: 'No supporting evidence uploaded' },
      { label: 'Certification Status', status: 'FAIL', detail: 'No PAS 2060, Gold Standard, or equivalent carbon neutrality certification' },
      { label: 'Source Reliability', status: 'FAIL', detail: 'No independent source available' },
      { label: 'Claim–Evidence Match', status: 'FAIL', detail: 'No evidence to assess match against' },
    ],
    evidence_records: [],
    created_at: '2026-08-25T14:00:00Z',
    submitted_at: '2026-08-25T14:05:00Z',
    verified_at: '2026-08-25T14:06:00Z',
    is_demo: true,
    is_public: true,
  },
];

// ── In-Memory Store ───────────────────────────────────────────
const _products: Map<string, BusinessProduct> = new Map(
  DEMO_PRODUCTS.map((p) => [p.id, p])
);
const _claims: Map<string, BusinessClaim> = new Map(
  DEMO_CLAIMS.map((c) => [c.id, c])
);
const _auditIndex: Map<string, string> = new Map(
  DEMO_CLAIMS.map((c) => [c.audit_id, c.id])
);

// ── Product CRUD ──────────────────────────────────────────────
export function getProducts(): BusinessProduct[] {
  return Array.from(_products.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getProduct(id: string): BusinessProduct | undefined {
  return _products.get(id);
}

export function addProduct(data: Omit<BusinessProduct, 'id' | 'created_at' | 'is_demo'>): BusinessProduct {
  const id = `biz-prod-${Date.now()}`;
  const product: BusinessProduct = {
    ...data,
    id,
    created_at: new Date().toISOString(),
    is_demo: false,
  };
  _products.set(id, product);
  return product;
}

// ── Claim CRUD ────────────────────────────────────────────────
export function getClaims(): BusinessClaim[] {
  return Array.from(_claims.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getClaim(id: string): BusinessClaim | undefined {
  return _claims.get(id);
}

export function getClaimByAuditId(auditId: string): BusinessClaim | undefined {
  const claimId = _auditIndex.get(auditId);
  return claimId ? _claims.get(claimId) : undefined;
}

export function addClaim(data: Omit<BusinessClaim, 'id' | 'audit_id' | 'created_at' | 'is_demo' | 'is_public'>): BusinessClaim {
  const id = `biz-claim-${Date.now()}`;
  const auditNum = Math.floor(8300 + Math.random() * 999);
  const audit_id = `GL-BIZ-${auditNum}`;
  const claim: BusinessClaim = {
    ...data,
    id,
    audit_id,
    created_at: new Date().toISOString(),
    is_demo: false,
    is_public: true,
  };
  _claims.set(id, claim);
  _auditIndex.set(audit_id, id);
  return claim;
}

export function updateClaim(id: string, updates: Partial<BusinessClaim>): BusinessClaim | undefined {
  const existing = _claims.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...updates };
  _claims.set(id, updated);
  return updated;
}

// ── Stats ─────────────────────────────────────────────────────
export function getBusinessStats() {
  const claims = getClaims();
  return {
    total_products: _products.size,
    total_claims: claims.length,
    verified: claims.filter((c) => c.verdict === 'VERIFIED').length,
    insufficient_evidence: claims.filter((c) => c.verdict === 'INSUFFICIENT_EVIDENCE').length,
    potential_issues: claims.filter((c) => c.verdict === 'POTENTIAL_GREENWASHING').length,
    pending: claims.filter((c) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length,
  };
}
