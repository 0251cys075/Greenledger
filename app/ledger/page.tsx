'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck, Database, FileCheck, Loader2 } from 'lucide-react';
import { COMMUNITY_LEDGER, getResultIdForStatus } from '@/lib/mock-data';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { LedgerEntry, VerificationStatus } from '@/lib/types';
import { formatRelativeDate, formatDate, cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n-context';

export default function LedgerPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<VerificationStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState<LedgerEntry[]>(COMMUNITY_LEDGER);
  const [loading, setLoading] = useState(true);

  const statusFilterOptions: { label: string; value: VerificationStatus | 'ALL' }[] = [
    { label: t('ledger.filterAll'), value: 'ALL' },
    { label: t('ledger.filterVerified'), value: 'VERIFIED' },
    { label: t('ledger.filterInsufficient'), value: 'INSUFFICIENT_EVIDENCE' },
    { label: t('ledger.filterGreenwashing'), value: 'POTENTIAL_GREENWASHING' },
  ];

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
    <div className="min-h-screen bg-[#F7F5F0] pt-24 pb-20">
      {/* Header Banner */}
      <div className="bg-[#1B3A2B] text-[#F7F5F0] py-16 px-6 border-b border-[#315C45]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-semibold text-[#A9BBA0] uppercase tracking-widest px-3 py-1 rounded bg-[#315C45] border border-[#A9BBA0]/25 mb-4 inline-block">
              {t('ledger.badge')}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#F7F5F0] mb-3">
              {t('ledger.title')}
            </h1>
            <p className="text-base sm:text-lg text-[#F7F5F0]/75 font-light">
              {t('ledger.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* Filter Controls */}
        <div className="card-cream p-6 rounded-2xl border-2 border-[#D6D3C8] shadow-lg mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718875]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('ledger.searchPlaceholder')}
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-[#FCFAF5] border border-[#D6D3C8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#315C45] text-[#1C1C1C]"
              aria-label="Search ledger entries"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {statusFilterOptions.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  'text-xs font-mono px-3.5 py-2 rounded-xl border transition-all',
                  filter === f.value
                    ? 'bg-[#1B3A2B] text-[#A9BBA0] border-[#1B3A2B] font-semibold'
                    : 'border-[#D6D3C8] bg-[#FCFAF5] text-[#718875] hover:border-[#315C45] hover:text-[#1C1C1C]'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table Container */}
        <div className="card-cream rounded-2xl border border-[#D6D3C8] shadow-md overflow-hidden">
          {/* Table Header (Desktop) */}
          <div className="hidden md:grid grid-cols-[2.5fr_3fr_2fr_1.5fr_1fr] gap-4 px-6 py-4 bg-[#EFECE4] text-xs font-mono font-semibold text-[#315C45] uppercase tracking-wider border-b border-[#D6D3C8]">
            <span>{t('ledger.tableProduct')}</span>
            <span>{t('ledger.tableClaim')}</span>
            <span>{t('ledger.tableStatus')}</span>
            <span>{t('ledger.tableDate')}</span>
            <span className="text-right">{t('ledger.tableAction')}</span>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="flex items-center justify-center py-16 gap-3">
              <Loader2 size={22} className="text-[#315C45] animate-spin" />
              <p className="text-xs font-mono text-[#718875]">Loading audit records…</p>
            </div>
          )}

          {/* Table Rows */}
          {!loading && filtered.length === 0 ? (
            <div className="text-center py-16">
              <Database size={32} className="text-[#718875] mx-auto mb-2 opacity-50" />
              <p className="font-serif text-lg text-[#1C1C1C] mb-1">{t('ledger.noEntries')}</p>
              <p className="text-xs font-mono text-[#718875] mb-4">Try another search term or reset filter.</p>
              <button
                onClick={() => {
                  setFilter('ALL');
                  setSearch('');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#315C45] text-[#F7F5F0] text-xs font-mono hover:bg-[#2A533F] transition-colors"
              >
                Reset all filters
              </button>
            </div>
          ) : !loading ? (
            <div className="divide-y divide-[#D6D3C8]">
              {filtered.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={cn(
                    'grid grid-cols-1 md:grid-cols-[2.5fr_3fr_2fr_1.5fr_1fr] gap-4 px-6 py-5 items-center transition-colors',
                    idx % 2 === 0 ? 'bg-[#FCFAF5]' : 'bg-[#F7F5F0]',
                    'hover:bg-[#EFECE4]'
                  )}
                >
                  {/* Product */}
                  <div>
                    <p className="font-semibold text-sm text-[#1C1C1C]">{entry.product_name}</p>
                    <p className="text-xs font-mono text-[#718875]">{entry.brand} · {entry.category}</p>
                  </div>

                  {/* Claim */}
                  <div>
                    <p className="text-xs text-[#1C1C1C] italic leading-relaxed line-clamp-2">
                      &ldquo;{entry.claim_text}&rdquo;
                    </p>
                  </div>

                  {/* Verdict */}
                  <div>
                    <StatusBadge status={entry.status} size="sm" className="mb-1" />
                    <p className="text-[11px] font-mono text-[#718875]">
                      {entry.evidence_strength.toLowerCase()} evidence strength
                    </p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-xs font-mono text-[#1C1C1C]" title={formatDate(entry.verified_at)}>
                      {formatRelativeDate(entry.verified_at)}
                    </p>
                    <p className="text-[10px] font-mono text-[#718875]">{formatDate(entry.verified_at)}</p>
                  </div>

                  {/* Link */}
                  <div className="text-left md:text-right">
                    <Link
                      href={`/result/${getResultIdForStatus(entry.status)}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#315C45] hover:text-[#1B3A2B] group"
                    >
                      {t('ledger.viewRecord')} <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <p className="text-center text-xs font-mono text-[#718875] mt-6">
          Displaying {filtered.length} of {entries.length} verified public entries · Ledger updated continuously
        </p>
      </div>
    </div>
  );
}
