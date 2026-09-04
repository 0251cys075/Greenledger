'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Download, Flag, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle, Share2, Check, Volume2 } from 'lucide-react';
import { MOCK_RESULTS } from '@/lib/mock-data';
import type { VerificationResult } from '@/lib/types';
import { StatusHero, EvidenceStrengthBar, StatusBadge } from '@/components/shared/StatusBadge';
import { getAssessmentIcon, formatDate, cn } from '@/lib/utils';
import { useTranslation, useLanguage } from '@/lib/i18n-context';

function SourceTypeBadge({ type }: { type: string }) {
  const norm = type.toLowerCase();
  const configs: Record<string, { label: string; className: string }> = {
    certification_registry: { label: 'Certification Registry', className: 'bg-[#3E7D4F]/15 text-[#315C45] border border-[#3E7D4F]/40' },
    certification: { label: 'Certification Registry', className: 'bg-[#3E7D4F]/15 text-[#315C45] border border-[#3E7D4F]/40' },
    third_party_audit: { label: 'Third-Party Audit', className: 'bg-[#1B3A2B] text-[#F7F5F0] border border-white/20' },
    laboratory_report: { label: 'Laboratory Report', className: 'bg-[#315C45] text-[#A9BBA0] border border-[#A9BBA0]/30' },
    esg_sustainability_report: { label: 'ESG / Sustainability Report', className: 'bg-[#315C45]/10 text-[#315C45] border border-[#315C45]/30' },
    sustainability_report: { label: 'Sustainability Report', className: 'bg-[#315C45]/10 text-[#315C45] border border-[#315C45]/30' },
    government_public_database: { label: 'Gov / Public Database', className: 'bg-[#C9A227]/15 text-[#8A6A1E] border border-[#C9A227]/40' },
    environmental_standard: { label: 'Env. Standard', className: 'bg-[#C9A227]/15 text-[#8A6A1E] border border-[#C9A227]/40' },
    regulatory: { label: 'Regulatory Database', className: 'bg-[#C9A227]/15 text-[#8A6A1E] border border-[#C9A227]/40' },
    company_documentation: { label: 'Company Documentation', className: 'bg-[#EFECE4] text-[#718875] border border-[#D6D3C8]' },
    company_claim: { label: 'Company Documentation', className: 'bg-[#EFECE4] text-[#718875] border border-[#D6D3C8]' },
    marketing_material: { label: 'Marketing Material', className: 'bg-[#C1443E]/15 text-[#9E3B33] border border-[#C1443E]/40' },
  };
  const cfg = configs[norm] || { label: type.replace(/_/g, ' '), className: 'bg-[#EFECE4] text-[#718875] border border-[#D6D3C8]' };
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
          ? 'bg-[#3E7D4F]/15 text-[#315C45] border-[#3E7D4F]/40'
          : isTier2
          ? 'bg-[#315C45] text-[#A9BBA0] border-[#A9BBA0]/30'
          : 'bg-[#EFECE4] text-[#718875] border-[#D6D3C8]'
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
          ? 'bg-[#3E7D4F]/15 text-[#315C45] border-[#3E7D4F]/40'
          : isContra
          ? 'bg-[#C1443E]/15 text-[#9E3B33] border-[#C1443E]/40'
          : isPartial
          ? 'bg-[#C9A227]/15 text-[#8A6A1E] border-[#C9A227]/40'
          : 'bg-[#EFECE4] text-[#718875] border-[#D6D3C8]'
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
          ? 'bg-[#3E7D4F]/15 text-[#315C45] border-[#3E7D4F]/40'
          : 'bg-[#C9A227]/15 text-[#8A6A1E] border-[#C9A227]/40'
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
  const { t, language } = useTranslation();
  const { meta } = useLanguage();

  const [result, setResult] = useState<VerificationResult>(() => MOCK_RESULTS[id] || MOCK_RESULTS['demo-1']);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  function handleShare() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  function handleSpeak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = meta?.speechCode || 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } catch {
      setSpeaking(false);
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
    <div className="min-h-screen bg-[#F7F5F0] pt-24 pb-24">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-[#EFECE4] border-b border-[#D6D3C8] py-4 px-6 mb-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#315C45] hover:text-[#1B3A2B] transition-colors"
          >
            <ArrowLeft size={14} />
            {t('result.backToVerify')}
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-[#718875]">
            <span>{t('result.recordId')}</span>
            <span className="font-semibold text-[#1C1C1C] uppercase bg-[#FCFAF5] px-2 py-0.5 rounded border border-[#D6D3C8]">
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
            <div className="card-cream p-7 border-2 border-[#D6D3C8] shadow-sm">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#315C45] bg-[#EFECE4] px-2 py-1 rounded inline-block mb-4">
                {t('result.verifiedStatement')}
              </span>
              <blockquote className="font-serif text-2xl sm:text-3xl text-[#1C1C1C] italic leading-snug mb-4">
                &ldquo;{result.claim_text}&rdquo;
              </blockquote>
              <div className="space-y-2 pt-4 border-t border-[#D6D3C8] text-xs font-mono text-[#718875]">
                <div className="flex justify-between">
                  <span>{t('result.product')}</span>
                  <span className="font-semibold text-[#1C1C1C]">{result.product_name || 'Verified Consumer Item'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('result.brand')}</span>
                  <span className="font-semibold text-[#1C1C1C]">{result.brand || 'EcoHome Co.'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('result.category')}</span>
                  <span className="font-semibold text-[#1C1C1C]">{result.category || 'Household & Packaging'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('result.verifiedOn')}</span>
                  <span className="font-semibold text-[#1C1C1C]">{formatDate(result.verified_at)}</span>
                </div>
              </div>
            </div>

            {/* Structured Claim Dimensions */}
            {result.structured_claim && (
              <div className="card-cream p-5 border border-[#D6D3C8] space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#D6D3C8]">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#315C45]">
                    {t('result.dimensionsTitle')}
                  </span>
                  <span className="text-[10px] font-mono text-[#718875]">Claim Extraction</span>
                </div>
                <div className="space-y-1.5 text-xs font-mono">
                  {result.structured_claim.material && (
                    <div className="flex justify-between">
                      <span className="text-[#718875]">{t('result.material')}</span>
                      <span className="font-semibold text-[#1C1C1C] capitalize">{result.structured_claim.material}</span>
                    </div>
                  )}
                  {result.structured_claim.percentage !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-[#718875]">{t('result.percentage')}</span>
                      <span className="font-semibold text-[#315C45]">{result.structured_claim.percentage}%</span>
                    </div>
                  )}
                  {result.structured_claim.environmentalAttribute && (
                    <div className="flex justify-between">
                      <span className="text-[#718875]">{t('result.attribute')}</span>
                      <span className="font-semibold text-[#1C1C1C] capitalize">{result.structured_claim.environmentalAttribute}</span>
                    </div>
                  )}
                  {result.structured_claim.scope && (
                    <div className="flex justify-between">
                      <span className="text-[#718875]">{t('result.scope')}</span>
                      <span className="font-semibold text-[#1C1C1C] capitalize">{result.structured_claim.scope}</span>
                    </div>
                  )}
                  {result.structured_claim.certificationMentioned && (
                    <div className="flex justify-between">
                      <span className="text-[#718875]">{t('result.certification')}</span>
                      <span className="font-semibold text-[#1C1C1C]">{result.structured_claim.certificationMentioned}</span>
                    </div>
                  )}
                  {result.structured_claim.measurableMetric && (
                    <div className="flex justify-between">
                      <span className="text-[#718875]">{t('result.measurableMetric')}</span>
                      <span className="font-semibold text-[#315C45]">{result.structured_claim.measurableMetric}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Evidence Strength Meter */}
            <div className="card-cream p-6 border border-[#D6D3C8]">
              <EvidenceStrengthBar strength={result.evidence_strength} />
            </div>

            {/* Actions card */}
            <div className="card-cream p-6 border border-[#D6D3C8] space-y-3">
              <Link href={`/evidence/${id}`} className="btn-primary w-full justify-center">
                <BookOpen size={16} />
                {t('result.viewEsgEvidence')}
              </Link>
              <button onClick={handleSave} className="btn-secondary w-full justify-center">
                <Download size={16} />
                {saved ? 'Audit Record Saved!' : t('result.savePdf')}
              </button>
              <button onClick={handleShare} className="btn-secondary w-full justify-center">
                {copied ? <Check size={16} className="text-[#3E7D4F]" /> : <Share2 size={16} />}
                {copied ? 'Verification Link Copied!' : t('result.share')}
              </button>
              <Link
                href={`/report?claim=${encodeURIComponent(result.claim_text)}&brand=${encodeURIComponent(result.brand || result.product_name || '')}`}
                className="btn-ghost w-full justify-center text-xs"
              >
                <Flag size={14} />
                {t('result.reportInaccuracy')}
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: The Verdict & Evidence Analysis */}
          <div className="lg:col-span-8 space-y-6">
            {/* Main Status Hero */}
            <StatusHero status={result.status} />

            {/* Evidence Assessment Table */}
            <div className="card-cream p-6 sm:p-8 border border-[#D6D3C8]">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#D6D3C8]">
                <h2 className="font-serif text-xl text-[#1C1C1C]">Evidence Assessment</h2>
                <span className="text-xs font-mono text-[#718875]">Audit Dimensions</span>
              </div>

              <div className="space-y-4">
                {result.evidence_assessment.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between p-4 rounded-xl bg-[#FCFAF5] border border-[#D6D3C8] gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1C1C1C] mb-1">{item.label}</p>
                      {item.detail && (
                        <p className="text-xs text-[#718875] leading-relaxed">{item.detail}</p>
                      )}
                    </div>
                    <span
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono flex-shrink-0',
                        item.status === 'PASS'
                          ? 'bg-[#3E7D4F]/20 text-[#315C45]'
                          : item.status === 'WARN'
                          ? 'bg-[#C9A227]/20 text-[#8A6A1E]'
                          : 'bg-[#C1443E]/20 text-[#9E3B33]'
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
              <div className="card-cream p-6 sm:p-8 border border-[#D6D3C8]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#D6D3C8]">
                  <div>
                    <h3 className="font-serif text-xl text-[#1C1C1C] flex items-center gap-2">
                      <ShieldCheck size={20} className="text-[#315C45]" />
                      Audit Trail: Rules Triggered
                    </h3>
                    <p className="text-xs text-[#718875] mt-0.5">
                      Deterministic verification — zero AI opinion, strictly rules-based evaluation
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#EFECE4] text-[#315C45]">
                    {result.audit_trail.rulesTriggered.length} Rules Evaluated
                  </span>
                </div>

                <div className="space-y-3">
                  {result.audit_trail.rulesTriggered.map((rule) => (
                    <div
                      key={rule.ruleId}
                      className="p-3.5 rounded-xl bg-[#FCFAF5] border border-[#D6D3C8] flex items-start justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#EFECE4] text-[#1C1C1C]">
                            {rule.ruleId}
                          </span>
                          <span className="text-xs font-semibold text-[#1C1C1C]">{rule.ruleName}</span>
                        </div>
                        <p className="text-xs text-[#718875] leading-relaxed">{rule.description}</p>
                      </div>
                      <span
                        className={cn(
                          'text-[10px] font-mono font-semibold px-2 py-1 rounded flex-shrink-0 uppercase',
                          rule.passed
                            ? 'bg-[#3E7D4F]/15 text-[#315C45] border border-[#3E7D4F]/30'
                            : rule.severity === 'CRITICAL'
                            ? 'bg-[#C1443E]/15 text-[#9E3B33] border border-[#C1443E]/30'
                            : 'bg-[#C9A227]/15 text-[#8A6A1E] border border-[#C9A227]/30'
                        )}
                      >
                        {rule.passed ? '✓ PASSED' : '✕ FLAGGED'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-[#D6D3C8] flex items-center justify-between text-[10px] font-mono text-[#718875]">
                  <span>Defensible Audit Trail Recorded</span>
                  <span>Timestamp: {formatDate(result.audit_trail.timestamp)}</span>
                </div>
              </div>
            )}

            {/* Why this result & What is missing */}
            {(() => {
              const localizedExplanation =
                (result as any).explanation_localized ||
                t(`verdict.explanation_${result.status}`) ||
                result.reason;

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-[#FCFAF5] border border-[#D6D3C8]">
                    <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                      <h3 className="font-serif text-lg text-[#1C1C1C] flex items-center gap-2">
                        <ShieldCheck size={18} className="text-[#315C45]" />
                        Why GreenLedger Gave This Result
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleSpeak(localizedExplanation)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#315C45] hover:text-[#1B3A2B] font-semibold bg-[#EFECE4] px-2.5 py-1 rounded-lg border border-[#D6D3C8] transition-colors cursor-pointer"
                        title="Listen to localized explanation"
                      >
                        <Volume2 size={13} className={cn("text-[#315C45]", speaking && "animate-pulse text-[#3E7D4F]")} />
                        {t('result.listenAudio')}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-[#1C1C1C]/90 leading-relaxed font-light">
                      {localizedExplanation}
                    </p>
                    {result.reason && result.reason !== localizedExplanation && (
                      <p className="text-[11px] text-[#718875] mt-3 pt-2.5 border-t border-[#D6D3C8]/50 italic">
                        Original audit rationale: {result.reason}
                      </p>
                    )}
                  </div>

                  <div className="p-6 rounded-xl bg-[#FCFAF5] border border-[#D6D3C8]">
                    <h3 className="font-serif text-lg text-[#1C1C1C] mb-2 flex items-center gap-2">
                      <AlertCircle size={18} className="text-[#C9A227]" />
                      What Would Change This?
                    </h3>
                    <p className="text-xs sm:text-sm text-[#1C1C1C]/85 leading-relaxed font-light">
                      {result.what_is_missing}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Sources Consulted */}
            {(evidenceRecords.length > 0 || result.sources.length > 0) && (
              <div className="card-cream p-6 sm:p-8 border border-[#D6D3C8]">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#D6D3C8]">
                  <h3 className="font-serif text-xl text-[#1C1C1C]">Audited Evidence Sources</h3>
                  <span className="text-xs font-mono text-[#718875]">
                    {evidenceRecords.length || result.sources.length} Evidence Records
                  </span>
                </div>

                <div className="space-y-4">
                  {evidenceRecords.length > 0
                    ? evidenceRecords.map((record) => (
                        <div
                          key={record.id || record.sourceName}
                          className="p-4 rounded-xl bg-[#FCFAF5] border border-[#D6D3C8] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-semibold text-sm text-[#1C1C1C]">{record.sourceName}</span>
                              <SourceTypeBadge type={record.sourceType} />
                              <ReliabilityBadge level={record.reliabilityLevel} />
                              <ClaimMatchBadge match={record.claimMatch} />
                            </div>
                            {record.evidenceText && (
                              <p className="text-xs text-[#718875] italic leading-relaxed border-l-2 border-[#315C45]/30 pl-2.5 my-1.5">
                                &ldquo;{record.evidenceText}&rdquo;
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-[#718875] mt-1">
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
                                className="text-xs text-[#315C45] hover:text-[#1B3A2B] font-semibold flex items-center gap-1 underline"
                              >
                                {t('result.viewOriginalSource')} <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    : result.sources.map((source) => (
                        <div
                          key={source.id}
                          className="p-4 rounded-xl bg-[#FCFAF5] border border-[#D6D3C8] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-semibold text-sm text-[#1C1C1C]">{source.source_name}</span>
                              <SourceTypeBadge type={source.source_type} />
                              <IndependentBadge isIndependent={source.is_independent} />
                            </div>
                            {source.excerpt && (
                              <p className="text-xs text-[#718875] italic leading-relaxed border-l-2 border-[#315C45]/30 pl-2.5 my-1.5">
                                &ldquo;{source.excerpt}&rdquo;
                              </p>
                            )}
                            <span className="text-[10px] font-mono text-[#718875]">
                              Published / Verified: {formatDate(source.source_date)}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-[#EFECE4] text-[#315C45]">
                              {source.relevance} Relevance
                            </span>
                            {source.source_url && source.source_url !== '#' && (
                              <a
                                href={source.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#315C45] hover:text-[#1B3A2B] font-semibold flex items-center gap-1 underline"
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
