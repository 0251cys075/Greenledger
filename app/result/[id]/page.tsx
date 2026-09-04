'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Download, Flag, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle, Share2, Check } from 'lucide-react';
import { MOCK_RESULTS } from '@/lib/mock-data';
import type { VerificationResult } from '@/lib/types';
import { StatusHero, EvidenceStrengthBar, StatusBadge } from '@/components/shared/StatusBadge';
import { getAssessmentIcon, formatDate, cn } from '@/lib/utils';

function SourceTypeBadge({ type }: { type: string }) {
  const norm = type.toLowerCase();
  const configs: Record<string, { label: string; className: string }> = {
    certification_registry: { label: 'Certification Registry', className: 'bg-[#4FAF78]/15 text-[#12382A] border border-[#4FAF78]/40' },
    certification: { label: 'Certification Registry', className: 'bg-[#4FAF78]/15 text-[#12382A] border border-[#4FAF78]/40' },
    third_party_audit: { label: 'Third-Party Audit', className: 'bg-[#0B241A] text-[#F3F0E8] border border-white/20' },
    laboratory_report: { label: 'Laboratory Report', className: 'bg-[#12382A] text-[#63D6A2] border border-[#63D6A2]/30' },
    esg_sustainability_report: { label: 'ESG / Sustainability Report', className: 'bg-[#12382A]/10 text-[#12382A] border border-[#12382A]/30' },
    sustainability_report: { label: 'Sustainability Report', className: 'bg-[#12382A]/10 text-[#12382A] border border-[#12382A]/30' },
    government_public_database: { label: 'Gov / Public Database', className: 'bg-[#D3A54A]/15 text-[#8B6414] border border-[#D3A54A]/40' },
    environmental_standard: { label: 'Env. Standard', className: 'bg-[#D3A54A]/15 text-[#8B6414] border border-[#D3A54A]/40' },
    regulatory: { label: 'Regulatory Database', className: 'bg-[#D3A54A]/15 text-[#8B6414] border border-[#D3A54A]/40' },
    company_documentation: { label: 'Company Documentation', className: 'bg-[#E9E6DC] text-[#718078] border border-[#C8CEC5]' },
    company_claim: { label: 'Company Documentation', className: 'bg-[#E9E6DC] text-[#718078] border border-[#C8CEC5]' },
    marketing_material: { label: 'Marketing Material', className: 'bg-[#C95C5C]/15 text-[#962A2A] border border-[#C95C5C]/40' },
  };
  const cfg = configs[norm] || { label: type.replace(/_/g, ' '), className: 'bg-[#E9E6DC] text-[#718078] border border-[#C8CEC5]' };
  return (
    <span className={cn('text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded', cfg.className)}>
      {cfg.label}
    </span>
  );
}

function ReliabilityBadge({ level }: { level?: string }) {
  if (!level) return null;
  const isTier1 = level === 'TIER_1_CERTIFIED';
  const isTier2 = level === 'TIER_2_AUDITED';
  return (
    <span
      className={cn(
        'text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded border',
        isTier1
          ? 'bg-[#4FAF78]/15 text-[#12382A] border-[#4FAF78]/40'
          : isTier2
          ? 'bg-[#12382A] text-[#63D6A2] border-[#63D6A2]/30'
          : 'bg-[#E9E6DC] text-[#718078] border-[#C8CEC5]'
      )}
    >
      {isTier1 ? 'Tier 1 Certified' : isTier2 ? 'Tier 2 Audited' : 'Tier 3 Self-Reported'}
    </span>
  );
}

function ClaimMatchBadge({ match }: { match?: string }) {
  if (!match) return null;
  const isConfirm = match === 'CONFIRMS';
  const isContra = match === 'CONTRADICTS';
  const isPartial = match === 'PARTIAL';
  return (
    <span
      className={cn(
        'text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded border',
        isConfirm
          ? 'bg-[#4FAF78]/15 text-[#12382A] border-[#4FAF78]/40'
          : isContra
          ? 'bg-[#C95C5C]/15 text-[#962A2A] border-[#C95C5C]/40'
          : isPartial
          ? 'bg-[#D3A54A]/15 text-[#8B6414] border-[#D3A54A]/40'
          : 'bg-[#E9E6DC] text-[#718078] border-[#C8CEC5]'
      )}
    >
      {isConfirm ? '✓ Confirms Claim' : isContra ? '✕ Contradicts Claim' : isPartial ? '⚠ Partial Match' : '○ Insufficient Match'}
    </span>
  );
}

function IndependentBadge({ isIndependent }: { isIndependent: boolean }) {
  return (
    <span
      className={cn(
        'text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded border',
        isIndependent
          ? 'bg-[#4FAF78]/15 text-[#12382A] border-[#4FAF78]/40'
          : 'bg-[#D3A54A]/15 text-[#8B6414] border-[#D3A54A]/40'
      )}
    >
      {isIndependent ? '✓ Third-Party Independent' : '⚠️ Self-Reported'}
    </span>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || 'demo-1';
  const [result, setResult] = useState<VerificationResult>(() => MOCK_RESULTS[id] || MOCK_RESULTS['demo-1']);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleShare() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  useEffect(() => {
    if (!id) return;

    // ── 1. Demo IDs: use mock data immediately ────────────────
    if (MOCK_RESULTS[id]) {
      setResult(MOCK_RESULTS[id]);
      return;
    }

    // ── 2. Custom claim: check sessionStorage first ───────────
    if (typeof window !== 'undefined') {
      const storedResultJson = sessionStorage.getItem('gl_result');
      const storedResultId = sessionStorage.getItem('gl_result_id');

      if (storedResultJson && (storedResultId === id || id === 'custom')) {
        try {
          const parsed = JSON.parse(storedResultJson);
          setResult({
            ...parsed,
            product_name: parsed.product_name || 'Custom Product Submission',
            brand: parsed.brand || 'Self-Submitted Claim',
            category: parsed.category || 'General Consumer Good',
            sources: parsed.sources?.length > 0 ? parsed.sources : MOCK_RESULTS['demo-1'].sources,
          });
          return;
        } catch {
          // Invalid JSON — fall through to API fetch
        }
      }
    }

    // ── 3. Fetch from API by ID ───────────────────────────────
    fetch(`/api/result/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        if (data.result) {
          setResult({
            ...data.result,
            product_name: data.result.product_name || 'Verified Product',
            brand: data.result.brand || 'Unknown Brand',
            category: data.result.category || 'General Consumer Good',
            sources: data.result.sources?.length > 0 ? data.result.sources : MOCK_RESULTS['demo-1'].sources,
          });
        } else {
          router.replace('/verify');
        }
      })
      .catch(() => {
        router.replace('/verify');
      });
  }, [id, router]);

  function handleSave() {
    setSaved(true);
    if (typeof window !== 'undefined') {
      window.print();
    }
    setTimeout(() => setSaved(false), 3000);
  }

  const evidenceRecords = result.evidence_records || [];

  return (
    <div className="min-h-screen bg-[#F3F0E8] pt-24 pb-24">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-[#E9E6DC] border-b border-[#C8CEC5] py-4 px-6 mb-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#12382A] hover:text-[#0B241A] transition-colors"
          >
            <ArrowLeft size={14} />
            BACK TO VERIFY TERMINAL
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-[#718078]">
            <span>Verification Record ID:</span>
            <span className="font-semibold text-[#102019] uppercase bg-[#FAF8F3] px-2 py-0.5 rounded border border-[#C8CEC5]">
              GL-{result.id.toUpperCase()}-2024
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Split Layout: Left Info, Right Verdict Report */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT COLUMN: Product & Claim Information */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card-cream p-7 border-2 border-[#C8CEC5] shadow-sm">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#12382A] bg-[#E9E6DC] px-2 py-1 rounded inline-block mb-4">
                Verified Statement
              </span>
              <blockquote className="font-serif text-2xl sm:text-3xl text-[#102019] italic leading-snug mb-4">
                &ldquo;{result.claim_text}&rdquo;
              </blockquote>
              <div className="space-y-2 pt-4 border-t border-[#C8CEC5] text-xs font-mono text-[#718078]">
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span className="font-semibold text-[#102019]">{result.product_name || 'Verified Consumer Item'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Brand:</span>
                  <span className="font-semibold text-[#102019]">{result.brand || 'EcoHome Co.'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-semibold text-[#102019]">{result.category || 'Household & Packaging'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verified On:</span>
                  <span className="font-semibold text-[#102019]">{formatDate(result.verified_at)}</span>
                </div>
              </div>
            </div>

            {/* Structured Claim Dimensions */}
            {result.structured_claim && (
              <div className="card-cream p-5 border border-[#C8CEC5] space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#C8CEC5]">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#12382A]">
                    Structured Claim Dimensions
                  </span>
                  <span className="text-[10px] font-mono text-[#718078]">Claim Extraction</span>
                </div>
                <div className="space-y-1.5 text-xs font-mono">
                  {result.structured_claim.material && (
                    <div className="flex justify-between">
                      <span className="text-[#718078]">Material:</span>
                      <span className="font-semibold text-[#102019] capitalize">{result.structured_claim.material}</span>
                    </div>
                  )}
                  {result.structured_claim.percentage !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-[#718078]">Percentage:</span>
                      <span className="font-semibold text-[#12382A]">{result.structured_claim.percentage}%</span>
                    </div>
                  )}
                  {result.structured_claim.environmentalAttribute && (
                    <div className="flex justify-between">
                      <span className="text-[#718078]">Attribute:</span>
                      <span className="font-semibold text-[#102019] capitalize">{result.structured_claim.environmentalAttribute}</span>
                    </div>
                  )}
                  {result.structured_claim.scope && (
                    <div className="flex justify-between">
                      <span className="text-[#718078]">Scope:</span>
                      <span className="font-semibold text-[#102019] capitalize">{result.structured_claim.scope}</span>
                    </div>
                  )}
                  {result.structured_claim.certificationMentioned && (
                    <div className="flex justify-between">
                      <span className="text-[#718078]">Certification:</span>
                      <span className="font-semibold text-[#102019]">{result.structured_claim.certificationMentioned}</span>
                    </div>
                  )}
                  {result.structured_claim.measurableMetric && (
                    <div className="flex justify-between">
                      <span className="text-[#718078]">Measurable Metric:</span>
                      <span className="font-semibold text-[#12382A]">{result.structured_claim.measurableMetric}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Evidence Strength Meter */}
            <div className="card-cream p-6 border border-[#C8CEC5]">
              <EvidenceStrengthBar strength={result.evidence_strength} />
            </div>

            {/* Actions card */}
            <div className="card-cream p-6 border border-[#C8CEC5] space-y-3">
              <Link href={`/evidence/${id}`} className="btn-primary w-full justify-center">
                <BookOpen size={16} />
                View Detailed ESG Evidence
              </Link>
              <button onClick={handleSave} className="btn-secondary w-full justify-center">
                <Download size={16} />
                {saved ? 'Audit Record Saved!' : 'Save Verification PDF'}
              </button>
              <button onClick={handleShare} className="btn-secondary w-full justify-center">
                {copied ? <Check size={16} className="text-[#4FAF78]" /> : <Share2 size={16} />}
                {copied ? 'Verification Link Copied!' : 'Share Audit Record'}
              </button>
              <Link
                href={`/report?claim=${encodeURIComponent(result.claim_text)}&brand=${encodeURIComponent(result.brand || result.product_name || '')}`}
                className="btn-ghost w-full justify-center text-xs"
              >
                <Flag size={14} />
                Report Inaccuracy to Governance
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: The Verdict & Evidence Analysis */}
          <div className="lg:col-span-8 space-y-6">
            {/* Main Status Hero */}
            <StatusHero status={result.status} />

            {/* Evidence Assessment Table */}
            <div className="card-cream p-6 sm:p-8 border border-[#C8CEC5]">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#C8CEC5]">
                <h2 className="font-serif text-xl text-[#102019]">Evidence Assessment</h2>
                <span className="text-xs font-mono text-[#718078]">Audit Dimensions</span>
              </div>

              <div className="space-y-4">
                {result.evidence_assessment.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between p-4 rounded-xl bg-[#FAF8F3] border border-[#C8CEC5] gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#102019] mb-1">{item.label}</p>
                      {item.detail && (
                        <p className="text-xs text-[#718078] leading-relaxed">{item.detail}</p>
                      )}
                    </div>
                    <span
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono flex-shrink-0',
                        item.status === 'PASS'
                          ? 'bg-[#4FAF78]/20 text-[#12382A]'
                          : item.status === 'WARN'
                          ? 'bg-[#D3A54A]/20 text-[#8B6414]'
                          : 'bg-[#C95C5C]/20 text-[#962A2A]'
                      )}
                      aria-label={`${item.label}: ${item.status}`}
                    >
                      {getAssessmentIcon(item.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Defensible Rules Engine Audit Trail */}
            {result.audit_trail && (
              <div className="card-cream p-6 sm:p-8 border border-[#C8CEC5]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#C8CEC5]">
                  <div>
                    <h3 className="font-serif text-xl text-[#102019] flex items-center gap-2">
                      <ShieldCheck size={20} className="text-[#12382A]" />
                      Audit Trail: Rules Triggered
                    </h3>
                    <p className="text-xs text-[#718078] mt-0.5">
                      Deterministic verification — zero AI opinion, strictly rules-based evaluation
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#E9E6DC] text-[#12382A]">
                    {result.audit_trail.rulesTriggered.length} Rules Evaluated
                  </span>
                </div>

                <div className="space-y-3">
                  {result.audit_trail.rulesTriggered.map((rule) => (
                    <div
                      key={rule.ruleId}
                      className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#C8CEC5] flex items-start justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#E9E6DC] text-[#102019]">
                            {rule.ruleId}
                          </span>
                          <span className="text-xs font-semibold text-[#102019]">{rule.ruleName}</span>
                        </div>
                        <p className="text-xs text-[#718078] leading-relaxed">{rule.description}</p>
                      </div>
                      <span
                        className={cn(
                          'text-[10px] font-mono font-semibold px-2 py-1 rounded flex-shrink-0 uppercase',
                          rule.passed
                            ? 'bg-[#4FAF78]/15 text-[#12382A] border border-[#4FAF78]/30'
                            : rule.severity === 'CRITICAL'
                            ? 'bg-[#C95C5C]/15 text-[#962A2A] border border-[#C95C5C]/30'
                            : 'bg-[#D3A54A]/15 text-[#8B6414] border border-[#D3A54A]/30'
                        )}
                      >
                        {rule.passed ? '✓ PASSED' : '✕ FLAGGED'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-[#C8CEC5] flex items-center justify-between text-[10px] font-mono text-[#718078]">
                  <span>Defensible Audit Trail Recorded</span>
                  <span>Timestamp: {formatDate(result.audit_trail.timestamp)}</span>
                </div>
              </div>
            )}

            {/* Why this result & What is missing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-[#FAF8F3] border border-[#C8CEC5]">
                <h3 className="font-serif text-lg text-[#102019] mb-2 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#12382A]" />
                  Why GreenLedger Gave This Result
                </h3>
                <p className="text-xs sm:text-sm text-[#102019]/85 leading-relaxed font-light">
                  {result.reason}
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#FAF8F3] border border-[#C8CEC5]">
                <h3 className="font-serif text-lg text-[#102019] mb-2 flex items-center gap-2">
                  <AlertCircle size={18} className="text-[#D3A54A]" />
                  What Would Change This?
                </h3>
                <p className="text-xs sm:text-sm text-[#102019]/85 leading-relaxed font-light">
                  {result.what_is_missing}
                </p>
              </div>
            </div>

            {/* Sources Consulted */}
            {(evidenceRecords.length > 0 || result.sources.length > 0) && (
              <div className="card-cream p-6 sm:p-8 border border-[#C8CEC5]">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#C8CEC5]">
                  <h3 className="font-serif text-xl text-[#102019]">Audited Evidence Sources</h3>
                  <span className="text-xs font-mono text-[#718078]">
                    {evidenceRecords.length || result.sources.length} Evidence Records
                  </span>
                </div>

                <div className="space-y-4">
                  {evidenceRecords.length > 0
                    ? evidenceRecords.map((record) => (
                        <div
                          key={record.id || record.sourceName}
                          className="p-4 rounded-xl bg-[#FAF8F3] border border-[#C8CEC5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-semibold text-sm text-[#102019]">{record.sourceName}</span>
                              <SourceTypeBadge type={record.sourceType} />
                              <ReliabilityBadge level={record.reliabilityLevel} />
                              <ClaimMatchBadge match={record.claimMatch} />
                            </div>
                            {record.evidenceText && (
                              <p className="text-xs text-[#718078] italic leading-relaxed border-l-2 border-[#12382A]/30 pl-2.5 my-1.5">
                                &ldquo;{record.evidenceText}&rdquo;
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-[#718078] mt-1">
                              <span>Published: {formatDate(record.publicationDate)}</span>
                              <span>Verified: {formatDate(record.verificationDate)}</span>
                              {record.productMatch && (
                                <span>Product Match: {record.productMatch}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            {record.sourceURL && record.sourceURL !== '#' && (
                              <a
                                href={record.sourceURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#12382A] hover:text-[#0B241A] font-semibold flex items-center gap-1 underline"
                              >
                                View Source <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    : result.sources.map((source) => (
                        <div
                          key={source.id}
                          className="p-4 rounded-xl bg-[#FAF8F3] border border-[#C8CEC5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-semibold text-sm text-[#102019]">{source.source_name}</span>
                              <SourceTypeBadge type={source.source_type} />
                              <IndependentBadge isIndependent={source.is_independent} />
                            </div>
                            {source.excerpt && (
                              <p className="text-xs text-[#718078] italic leading-relaxed border-l-2 border-[#12382A]/30 pl-2.5 my-1.5">
                                &ldquo;{source.excerpt}&rdquo;
                              </p>
                            )}
                            <span className="text-[10px] font-mono text-[#718078]">
                              Published / Verified: {formatDate(source.source_date)}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-[#E9E6DC] text-[#12382A]">
                              {source.relevance} Relevance
                            </span>
                            {source.source_url && source.source_url !== '#' && (
                              <a
                                href={source.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#12382A] hover:text-[#0B241A] font-semibold flex items-center gap-1 underline"
                              >
                                View Source <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
