'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Filter, ShieldCheck } from 'lucide-react';
import { EXPLORE_PRODUCTS } from '@/lib/mock-data';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { VerificationStatus } from '@/lib/types';
import { formatDate, cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Packaging', 'Household', 'Food & Beverage', 'Apparel', 'Electronics', 'Stationery', 'Energy'];
const STATUSES: { label: string; value: VerificationStatus | 'ALL' }[] = [
  { label: 'All Verdicts', value: 'ALL' },
  { label: 'Verified', value: 'VERIFIED' },
  { label: 'Insufficient Evidence', value: 'INSUFFICIENT_EVIDENCE' },
  { label: 'Potential Greenwashing', value: 'POTENTIAL_GREENWASHING' },
];

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState<VerificationStatus | 'ALL'>('ALL');

  const filtered = EXPLORE_PRODUCTS.filter((p) => {
    const matchSearch =
      !search ||
      p.product_name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.claim_text.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    const matchStatus = status === 'ALL' || p.status === status;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#F3F0E8] pt-24 pb-20">
      {/* Header Banner - Dark Forest */}
      <div className="bg-[#0B241A] text-[#F3F0E8] py-16 px-6 border-b border-[#12382A]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-semibold text-[#63D6A2] uppercase tracking-widest px-3 py-1 rounded bg-[#12382A] border border-[#63D6A2]/25 mb-4 inline-block">
              Open Product Index
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#F3F0E8] mb-3">
              Explore Verified Products
            </h1>
            <p className="text-base sm:text-lg text-[#F3F0E8]/75 font-light">
              Search and inspect environmental claims across consumer goods that have undergone the GreenLedger verification pipeline.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* Search & Filter Bar */}
        <div className="card-cream p-6 border-2 border-[#C8CEC5] rounded-2xl shadow-lg mb-8">
          {/* Search Input */}
          <div className="relative mb-5">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718078]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, brand, or environmental claim keyword..."
              className="w-full pl-11 pr-4 py-3 text-sm bg-[#FAF8F3] border border-[#C8CEC5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12382A] text-[#102019] placeholder-[#98A49D]"
              aria-label="Search verified products"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-5 justify-between">
            {/* Status filters */}
            <div>
              <p className="text-xs font-mono font-semibold text-[#12382A] uppercase tracking-wider mb-2">
                Filter by Verdict
              </p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStatus(s.value)}
                    className={cn(
                      'text-xs font-mono px-3 py-1.5 rounded-lg border transition-all',
                      status === s.value
                        ? 'bg-[#0B241A] text-[#63D6A2] border-[#0B241A] shadow-sm font-semibold'
                        : 'border-[#C8CEC5] bg-[#FAF8F3] text-[#718078] hover:border-[#12382A] hover:text-[#102019]'
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category filters */}
            <div>
              <p className="text-xs font-mono font-semibold text-[#12382A] uppercase tracking-wider mb-2">
                Product Category
              </p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      'text-xs px-3 py-1.5 rounded-lg border transition-all',
                      category === cat
                        ? 'bg-[#12382A] text-[#F3F0E8] border-[#12382A] font-semibold'
                        : 'border-[#C8CEC5] bg-[#FAF8F3] text-[#718078] hover:border-[#12382A] hover:text-[#102019]'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs font-mono text-[#718078]">
          <span>
            Showing <strong>{filtered.length}</strong> record{filtered.length !== 1 ? 's' : ''}
          </span>
          <span>Verified against public registries</span>
        </div>

        {/* Product Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 card-cream border border-[#C8CEC5] rounded-2xl">
            <Search size={36} className="text-[#718078] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-xl text-[#102019] mb-1">No matching claims found</h3>
            <p className="text-xs text-[#718078] font-mono">Try adjusting your keywords or clearing the category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <Link
                key={product.id}
                href={`/result/${product.result_id}`}
                className="card-cream p-6 rounded-2xl border border-[#C8CEC5] hover:border-[#12382A] flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <StatusBadge status={product.status} size="sm" />
                    <span className="text-[11px] font-mono text-[#718078] uppercase">{product.category}</span>
                  </div>

                  <h3 className="font-serif text-xl text-[#102019] group-hover:text-[#12382A] transition-colors mb-1">
                    {product.product_name}
                  </h3>
                  <p className="text-xs font-mono text-[#718078] mb-4">Brand: {product.brand}</p>

                  <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#C8CEC5]/70 mb-5">
                    <p className="text-xs text-[#102019] italic leading-relaxed line-clamp-2">
                      &ldquo;{product.claim_text}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#C8CEC5] flex items-center justify-between text-xs font-mono text-[#718078]">
                  <span>Verified: {formatDate(product.verified_at)}</span>
                  <span className="text-[#12382A] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Inspect Report <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
