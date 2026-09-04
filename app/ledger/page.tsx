'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck, Database, FileCheck, Loader2 } from 'lucide-react';
import { COMMUNITY_LEDGER, getResultIdForStatus } from '@/lib/mock-data';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { LedgerEntry, VerificationStatus } from '@/lib/types';
import { formatRelativeDate, formatDate, cn } from '@/lib/utils';

const STATUS_FILTERS: { label: string; value: VerificationStatus | 'ALL' }[] = [
  { label: 'All Audits', value: 'ALL' },
  { label: 'Verified', value: 'VERIFIED' },
  { label: 'Insufficient Evidence', value: 'INSUFFICIENT_EVIDENCE' },
  { label: 'Potential Greenwashing', value: 'POTENTIAL_GREENWASHING' },
];

export default function LedgerPage() {
  const [filter, setFilter] = useState<VerificationStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState<LedgerEntry[]>(COMMUNITY_LEDGER);
  const [loading, setLoading] = useState(true);

  // ── Fetch ledger from API ──────────────────────────────────
  useEffect(() => {
    setLoading(true);
    fetch('/api/ledger')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.entries) && data.entries.length > 0) {
          setEntries(data.entries);
        }
      })
      .catch(() => {
        // Silently fall back to mock data already in state
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = entries.filter((entry) => {
    const matchFilter = filter === 'ALL' || entry.status === filter;
    const matchSearch =
      !search ||
      entry.product_name.toLowerCase().includes(search.toLowerCase()) ||
      entry.brand.toLowerCase().includes(search.toLowerCase()) ||
      entry.claim_text.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F3F0E8] pt-24 pb-20">
      {/* Header Banner */}
      <div className="bg-[#0B241A] text-[#F3F0E8] py-16 px-6 border-b border-[#12382A]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-semibold text-[#63D6A2] uppercase tracking-widest px-3 py-1 rounded bg-[#12382A] border border-[#63D6A2]/25 mb-4 inline-block">
              Immutable Transparency Record
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#F3F0E8] mb-3">
              Community Ledger
            </h1>
            <p className="text-base sm:text-lg text-[#F3F0E8]/75 font-light">
              Transparency works better when it&apos;s shared. An auditable, open record of all environmental claim evaluations.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* Filter Controls */}
        <div className="card-cream p-6 rounded-2xl border-2 border-[#C8CEC5] shadow-lg mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718078]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product, brand, or claim phrase..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-[#FAF8F3] border border-[#C8CEC5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12382A] text-[#102019]"
              aria-label="Search ledger entries"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  'text-xs font-mono px-3.5 py-2 rounded-xl border transition-all',
                  filter === f.value
                    ? 'bg-[#0B241A] text-[#63D6A2] border-[#0B241A] font-semibold'
                    : 'border-[#C8CEC5] bg-[#FAF8F3] text-[#718078] hover:border-[#12382A] hover:text-[#102019]'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table Container */}
        <div className="card-cream rounded-2xl border border-[#C8CEC5] shadow-md overflow-hidden">
          {/* Table Header (Desktop) */}
          <div className="hidden md:grid grid-cols-[2.5fr_3fr_2fr_1.5fr_1fr] gap-4 px-6 py-4 bg-[#E9E6DC] text-xs font-mono font-semibold text-[#12382A] uppercase tracking-wider border-b border-[#C8CEC5]">
            <span>Product &amp; Brand</span>
            <span>Claim Under Verification</span>
            <span>Verdict</span>
            <span>Verification Date</span>
            <span className="text-right">Action</span>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="flex items-center justify-center py-16 gap-3">
              <Loader2 size={22} className="text-[#12382A] animate-spin" />
              <p className="text-xs font-mono text-[#718078]">Loading audit records…</p>
            </div>
          )}

          {/* Table Rows */}
          {!loading && filtered.length === 0 ? (
            <div className="text-center py-16">
              <Database size={32} className="text-[#718078] mx-auto mb-2 opacity-50" />
              <p className="font-serif text-lg text-[#102019] mb-1">No matching audit records</p>
              <p className="text-xs font-mono text-[#718078] mb-4">Try another search term or reset filter.</p>
              <button
                onClick={() => {
                  setFilter('ALL');
                  setSearch('');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12382A] text-[#F3F0E8] text-xs font-mono hover:bg-[#1B4D3A] transition-colors"
              >
                Reset all filters
              </button>
            </div>
          ) : !loading ? (
            <div className="divide-y divide-[#C8CEC5]">
              {filtered.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={cn(
                    'grid grid-cols-1 md:grid-cols-[2.5fr_3fr_2fr_1.5fr_1fr] gap-4 px-6 py-5 items-center transition-colors',
                    idx % 2 === 0 ? 'bg-[#FAF8F3]' : 'bg-[#F3F0E8]',
                    'hover:bg-[#E9E6DC]'
                  )}
                >
                  {/* Product */}
                  <div>
                    <p className="font-semibold text-sm text-[#102019]">{entry.product_name}</p>
                    <p className="text-xs font-mono text-[#718078]">{entry.brand} · {entry.category}</p>
                  </div>

                  {/* Claim */}
                  <div>
                    <p className="text-xs text-[#102019] italic leading-relaxed line-clamp-2">
                      &ldquo;{entry.claim_text}&rdquo;
                    </p>
                  </div>

                  {/* Verdict */}
                  <div>
                    <StatusBadge status={entry.status} size="sm" className="mb-1" />
                    <p className="text-[11px] font-mono text-[#718078]">
                      {entry.evidence_strength.toLowerCase()} evidence strength
                    </p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-xs font-mono text-[#102019]" title={formatDate(entry.verified_at)}>
                      {formatRelativeDate(entry.verified_at)}
                    </p>
                    <p className="text-[10px] font-mono text-[#718078]">{formatDate(entry.verified_at)}</p>
                  </div>

                  {/* Link */}
                  <div className="text-left md:text-right">
                    <Link
                      href={`/result/${getResultIdForStatus(entry.status)}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#12382A] hover:text-[#0B241A] group"
                    >
                      Audit Record <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <p className="text-center text-xs font-mono text-[#718078] mt-6">
          Displaying {filtered.length} of {entries.length} verified public entries · Ledger updated continuously
        </p>
      </div>
    </div>
  );
}
