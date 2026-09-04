'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, ExternalLink, FileText, Filter } from 'lucide-react';
import type { BusinessClaim } from '@/lib/business-store';

function VerdictBadge({ verdict }: { verdict?: string }) {
  if (!verdict) return <span className="text-xs text-[#718078] bg-[#E9E6DC] px-2.5 py-1 rounded-full">Pending</span>;
  if (verdict === 'VERIFIED')
    return <span className="text-xs font-semibold bg-[#4FAF78]/15 text-[#12382A] border border-[#4FAF78]/35 px-2.5 py-1 rounded-full">🟢 Verified</span>;
  if (verdict === 'INSUFFICIENT_EVIDENCE')
    return <span className="text-xs font-semibold bg-[#D3A54A]/15 text-[#8B6414] border border-[#D3A54A]/35 px-2.5 py-1 rounded-full">🟡 Insufficient Evidence</span>;
  return <span className="text-xs font-semibold bg-[#C95C5C]/15 text-[#962A2A] border border-[#C95C5C]/35 px-2.5 py-1 rounded-full">🔴 Potential Greenwashing</span>;
}

function EvidenceStrengthBar({ strength }: { strength?: string }) {
  const map: Record<string, { width: string; color: string }> = {
    STRONG: { width: 'w-full', color: 'bg-[#4FAF78]' },
    MODERATE: { width: 'w-2/3', color: 'bg-[#D3A54A]' },
    WEAK: { width: 'w-1/3', color: 'bg-[#C95C5C]' },
    NONE: { width: 'w-0', color: 'bg-[#C8CEC5]' },
  };
  const cfg = map[strength || 'NONE'] || map.NONE;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#E9E6DC] rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${cfg.width} ${cfg.color}`} />
      </div>
      <span className="text-xs text-[#718078] w-16 text-right">{strength?.replace('_', ' ') || 'None'}</span>
    </div>
  );
}

type FilterType = 'ALL' | 'VERIFIED' | 'INSUFFICIENT_EVIDENCE' | 'POTENTIAL_GREENWASHING';

export default function ClaimsPage() {
  const [claims, setClaims] = useState<BusinessClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('ALL');

  useEffect(() => {
    fetch('/api/business/claims')
      .then((r) => r.json())
      .then((d) => setClaims(d.claims || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? claims : claims.filter((c) => c.verdict === filter);

  const counts = {
    ALL: claims.length,
    VERIFIED: claims.filter((c) => c.verdict === 'VERIFIED').length,
    INSUFFICIENT_EVIDENCE: claims.filter((c) => c.verdict === 'INSUFFICIENT_EVIDENCE').length,
    POTENTIAL_GREENWASHING: claims.filter((c) => c.verdict === 'POTENTIAL_GREENWASHING').length,
  };

  const tabs: { value: FilterType; label: string; emoji: string }[] = [
    { value: 'ALL', label: 'All', emoji: '' },
    { value: 'VERIFIED', label: 'Verified', emoji: '🟢' },
    { value: 'INSUFFICIENT_EVIDENCE', label: 'Needs Evidence', emoji: '🟡' },
    { value: 'POTENTIAL_GREENWASHING', label: 'Issues', emoji: '🔴' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#102019]">Environmental Claims</h1>
          <p className="text-sm text-[#718078] mt-0.5">
            {loading ? '…' : `${claims.length} claim${claims.length !== 1 ? 's' : ''} submitted`}
          </p>
        </div>
        <Link href="/business/claims/new" className="btn-mint text-sm py-2.5 px-5">
          <Plus size={15} /> Submit New Claim
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <Filter size={14} className="text-[#718078] shrink-0" />
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === tab.value
                ? 'bg-[#0B241A] text-[#F3F0E8]'
                : 'bg-[#E9E6DC] text-[#718078] hover:bg-[#C8CEC5]'
            }`}
          >
            {tab.emoji} {tab.label}
            <span className="ml-1.5 text-xs opacity-70">({counts[tab.value]})</span>
          </button>
        ))}
      </div>

      {/* Claims Table */}
      {loading ? (
        <div className="card-cream overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 border-b border-[#C8CEC5] animate-pulse flex gap-4">
              <div className="flex-1 h-4 bg-[#E9E6DC] rounded" />
              <div className="w-28 h-7 bg-[#E9E6DC] rounded-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-cream p-16 text-center">
          <FileText size={36} className="text-[#C8CEC5] mx-auto mb-4" />
          <h2 className="text-base font-semibold text-[#102019] mb-2">
            {filter === 'ALL' ? 'No claims yet' : `No ${filter.replace('_', ' ').toLowerCase()} claims`}
          </h2>
          {filter === 'ALL' && (
            <Link href="/business/claims/new" className="btn-mint mt-4 text-sm">
              Submit First Claim
            </Link>
          )}
        </div>
      ) : (
        <div className="card-cream overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[1fr_140px_140px_110px] gap-4 px-6 py-3 bg-[#E9E6DC] border-b border-[#C8CEC5]">
            <p className="text-xs font-semibold text-[#718078] uppercase tracking-wider">Claim</p>
            <p className="text-xs font-semibold text-[#718078] uppercase tracking-wider">Evidence</p>
            <p className="text-xs font-semibold text-[#718078] uppercase tracking-wider">Verdict</p>
            <p className="text-xs font-semibold text-[#718078] uppercase tracking-wider">Actions</p>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#C8CEC5]">
            {filtered.map((claim) => (
              <div key={claim.id} className="px-6 py-5 hover:bg-[#FAF8F3] transition-colors">
                <div className="md:grid md:grid-cols-[1fr_140px_140px_110px] md:gap-4 md:items-center">
                  {/* Claim Text */}
                  <div className="mb-3 md:mb-0">
                    <p className="text-xs font-semibold text-[#63D6A2] uppercase tracking-wider mb-1">
                      {claim.product_name}
                      {claim.is_demo && <span className="ml-2 text-[#D3A54A] opacity-75">· DEMO</span>}
                    </p>
                    <p className="text-sm font-medium text-[#102019] leading-snug">
                      &ldquo;{claim.claim_text}&rdquo;
                    </p>
                    <p className="text-xs text-[#98A49D] mt-1 font-mono">#{claim.audit_id}</p>
                  </div>

                  {/* Evidence Strength */}
                  <div className="mb-3 md:mb-0">
                    <p className="text-xs text-[#718078] mb-1.5 md:hidden font-semibold">Evidence</p>
                    <EvidenceStrengthBar strength={claim.evidence_strength} />
                    <p className="text-xs text-[#98A49D] mt-1">
                      {claim.evidence_files.length} file{claim.evidence_files.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Verdict */}
                  <div className="mb-3 md:mb-0">
                    <p className="text-xs text-[#718078] mb-1.5 md:hidden font-semibold">Verdict</p>
                    <VerdictBadge verdict={claim.verdict} />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5">
                    <Link
                      href={`/business/records/${claim.audit_id}`}
                      className="flex items-center gap-1 text-xs text-[#63D6A2] font-semibold hover:underline"
                    >
                      View Record <ExternalLink size={10} />
                    </Link>
                    {claim.verdict === 'INSUFFICIENT_EVIDENCE' && (
                      <Link href="/business/claims/new" className="text-xs text-[#D3A54A] hover:underline">
                        Add Evidence
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
