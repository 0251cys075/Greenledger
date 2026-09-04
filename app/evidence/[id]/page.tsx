'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Info, ShieldCheck, ExternalLink } from 'lucide-react';
import { MOCK_RESULTS } from '@/lib/mock-data';
import { runVerification } from '@/lib/verification-engine';
import type { VerificationResult } from '@/lib/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate, cn } from '@/lib/utils';

function ESGMetricCard({
  label,
  value,
  unit,
  direction,
}: {
  label: string;
  value: string;
  unit: string;
  direction?: 'up' | 'down' | 'neutral';
}) {
  const dirStyle =
    direction === 'down'
      ? 'text-[#4FAF78]'
      : direction === 'up'
      ? 'text-[#C95C5C]'
      : 'text-[#D3A54A]';

  return (
    <div className="card-cream p-5 text-center border border-[#C8CEC5]">
      <p className={cn('font-serif text-3xl sm:text-4xl font-bold mb-1', dirStyle)}>{value}</p>
      <p className="text-xs font-semibold text-[#102019]">{label}</p>
      <p className="text-[11px] font-mono text-[#718078] mt-1">{unit}</p>
    </div>
  );
}

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

export default function EvidencePage() {
  const params = useParams();
  const id = (params?.id as string) || 'demo-1';
  const [result, setResult] = useState<VerificationResult>(() => MOCK_RESULTS[id] || MOCK_RESULTS['demo-1']);

  useEffect(() => {
    if (id && MOCK_RESULTS[id]) {
      setResult(MOCK_RESULTS[id]);
    } else {
      const claim = typeof window !== 'undefined' ? sessionStorage.getItem('gl_claim') : null;
      if (claim) {
        runVerification(claim).then((res) => {
          setResult({
            ...res,
            product_name: res.product_name || 'Custom Product Submission',
            brand: res.brand || 'Verified Consumer Submission',
            category: res.category || 'General Consumer Goods',
          });
        });
      }
    }
  }, [id]);

  const isVerified = result.status === 'VERIFIED';
  const isInsufficient = result.status === 'INSUFFICIENT_EVIDENCE';
  const evidenceRecords = result.evidence_records || [];

  return (
    <div className="min-h-screen bg-[#F3F0E8] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Back Link */}
        <Link
          href={`/result/${id}`}
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#12382A] hover:text-[#0B241A] transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          BACK TO VERIFICATION RESULT
        </Link>

        {/* Header Banner */}
        <div className="p-8 rounded-2xl bg-[#0B241A] text-[#F3F0E8] mb-10 border border-[#12382A] shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <StatusBadge status={result.status} theme="dark" size="md" />
            <span className="text-xs font-mono text-[#63D6A2]">Audit Evidence Dossier</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F3F0E8] mb-2">
            Evidence &amp; ESG Summary
          </h1>
          <blockquote className="text-[#F3F0E8]/75 italic text-lg font-light">
            &ldquo;{result.claim_text}&rdquo;
          </blockquote>
        </div>

        {/* Environmental Highlights */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono font-semibold text-[#12382A] uppercase tracking-widest">
              Environmental Indicators (Company vs. Independent Audit)
            </h2>
            <span className="text-[11px] font-mono text-[#718078]">Scope 1, 2 &amp; Material Content</span>
          </div>

          {isVerified ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ESGMetricCard label="Emissions Reduction" value="12% ↓" unit="Independent Audit Verified" direction="down" />
              <ESGMetricCard label="Recycled Materials" value="82%" unit="FSC / GRS Certified" direction="down" />
              <ESGMetricCard label="Water Usage" value="8% ↓" unit="Life-Cycle Assessment (LCA)" direction="down" />
            </div>
          ) : isInsufficient ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ESGMetricCard label="Recycled Content" value="70%" unit="Self-Reported by Brand" direction="neutral" />
              <ESGMetricCard label="Independent Audit" value="None" unit="No public report found" direction="up" />
              <ESGMetricCard label="Certification Registry" value="Pending" unit="Registry check incomplete" direction="up" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ESGMetricCard label="Measurable Criteria" value="0" unit="Broad unverified wording" direction="up" />
              <ESGMetricCard label="Independent Proof" value="None" unit="No verifiable LCA cited" direction="up" />
              <ESGMetricCard label="Third-Party Scheme" value="None" unit="Unrecognized claim" direction="up" />
            </div>
          )}
        </div>

        {/* Provenance Guide */}
        <div className="card-cream p-5 mb-10 flex items-start gap-3.5 border border-[#C8CEC5]">
          <Info size={18} className="text-[#12382A] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#102019] leading-relaxed space-y-1.5">
            <p>
              <strong>Tier 1 Certified (Highest Reliability):</strong> Official certification registries (FSC, GRS, EU Ecolabel), accredited laboratory test reports (Intertek, SGS), or government/public databases.
            </p>
            <p>
              <strong>Tier 2 Audited (High Reliability):</strong> Independent third-party audit reports and externally assured life-cycle assessments (LCA).
            </p>
            <p className="text-[#718078]">
              <strong>Tier 3 Self-Reported (Evaluated):</strong> Unaudited corporate ESG reports, internal technical specifications, and marketing statements.
            </p>
          </div>
        </div>

        {/* Sources Examined */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono font-semibold text-[#12382A] uppercase tracking-widest">
              Audited Evidence Sources &amp; Registries
            </h2>
            <span className="text-[11px] font-mono text-[#718078]">
              {evidenceRecords.length || result.sources.length} Records Evaluated
            </span>
          </div>

          <div className="space-y-4">
            {evidenceRecords.length > 0
              ? evidenceRecords.map((record) => (
                  <div key={record.id || record.sourceName} className="card-cream p-6 border border-[#C8CEC5]">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <SourceTypeBadge type={record.sourceType} />
                          <ReliabilityBadge level={record.reliabilityLevel} />
                          <ClaimMatchBadge match={record.claimMatch} />
                          <span className="text-xs font-mono text-[#718078]">
                            Verified: {formatDate(record.verificationDate)}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg text-[#102019] mb-2">{record.sourceName}</h3>
                        {record.evidenceText && (
                          <p className="text-xs text-[#718078] italic leading-relaxed border-l-2 border-[#12382A]/40 pl-3 my-2">
                            &ldquo;{record.evidenceText}&rdquo;
                          </p>
                        )}
                        {record.findings?.standardReferenced && (
                          <p className="text-[11px] font-mono text-[#12382A] mt-1.5">
                            Standard Cited: <strong>{record.findings.standardReferenced}</strong>
                          </p>
                        )}
                        {record.findings?.confirmedPercentage !== undefined && (
                          <p className="text-[11px] font-mono text-[#4FAF78] mt-0.5">
                            Laboratory Confirmed Metric: <strong>{record.findings.confirmedPercentage}%</strong>
                          </p>
                        )}
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                        {record.productMatch && (
                          <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-[#E9E6DC] text-[#12382A]">
                            Match: {record.productMatch}
                          </span>
                        )}
                        {record.sourceURL && record.sourceURL !== '#' && (
                          <a
                            href={record.sourceURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#12382A] hover:underline flex items-center gap-1 font-semibold"
                          >
                            Source Link <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              : result.sources.map((source) => (
                  <div key={source.id} className="card-cream p-6 border border-[#C8CEC5]">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <SourceTypeBadge type={source.source_type} />
                          <span
                            className={cn(
                              'text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded border',
                              source.is_independent
                                ? 'bg-[#4FAF78]/15 text-[#12382A] border-[#4FAF78]/40'
                                : 'bg-[#D3A54A]/15 text-[#8B6414] border-[#D3A54A]/40'
                            )}
                          >
                            {source.is_independent ? 'Independent Source' : 'Self-Reported Corporate'}
                          </span>
                          <span className="text-xs font-mono text-[#718078]">
                            Date: {formatDate(source.source_date)}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg text-[#102019] mb-2">{source.source_name}</h3>
                        {source.excerpt && (
                          <p className="text-xs text-[#718078] italic leading-relaxed border-l-2 border-[#12382A]/40 pl-3 my-2">
                            &ldquo;{source.excerpt}&rdquo;
                          </p>
                        )}
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                        <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-[#E9E6DC] text-[#12382A]">
                          {source.relevance} Relevance
                        </span>
                        {source.source_url && source.source_url !== '#' && (
                          <a
                            href={source.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#12382A] hover:underline flex items-center gap-1 font-semibold"
                          >
                            Source Link <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Audit Trail Summary Box */}
        {result.audit_trail && (
          <div className="card-cream p-6 mb-8 border border-[#C8CEC5]">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#C8CEC5]">
              <span className="font-serif text-lg text-[#102019]">Defensible Audit Trail Record</span>
              <span className="text-xs font-mono text-[#12382A] font-semibold">
                Status: {result.audit_trail.finalVerdict}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-[#718078]">
              <div>
                <span>Rules Evaluated:</span>
                <p className="font-semibold text-[#102019] mt-0.5">{result.audit_trail.rulesTriggered.length} Standard Rules</p>
              </div>
              <div>
                <span>Evidence Strength:</span>
                <p className="font-semibold text-[#102019] mt-0.5">{result.audit_trail.evidenceStrength}</p>
              </div>
              <div>
                <span>Verification Timestamp:</span>
                <p className="font-semibold text-[#102019] mt-0.5">{formatDate(result.audit_trail.timestamp)}</p>
              </div>
            </div>
          </div>
        )}

        {/* What This Means Analysis Banner */}
        <div className="p-8 rounded-2xl bg-[#12382A] text-[#F3F0E8] border border-[#63D6A2]/30 mb-8 shadow-xl">
          <h2 className="font-serif text-2xl text-[#F3F0E8] mb-3 flex items-center gap-2">
            <ShieldCheck size={22} className="text-[#63D6A2]" />
            What This Means
          </h2>
          <p className="text-[#F3F0E8]/85 leading-relaxed text-sm sm:text-base font-light">
            {isVerified
              ? 'The available public evidence reliably substantiates the claim. Independent third-party audit reports confirm specific criteria matching recognised standards. Consumers can rely on this claim, while checking periodic renewal status.'
              : isInsufficient
              ? 'While the company may implement positive sustainability measures, publicly available independent evidence is currently insufficient to verify the exact statement. This reflects transparency gaps rather than confirmed intent to mislead.'
              : 'The claim relies on broad, non-specific environmental claims without published life-cycle data or third-party certification. Under ISO 14021 standards, unsubstantiated statements of generic eco-friendliness are classified as potentially misleading.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <Link href={`/result/${id}`} className="btn-primary">
            Back to Result Summary
          </Link>
          <Link
            href={`/report?claim=${encodeURIComponent(result.claim_text)}`}
            className="btn-secondary"
          >
            Report Inaccuracy to Governance
          </Link>
        </div>
      </div>
    </div>
  );
}
