'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowRight, X, Loader2, Flag, AlertCircle } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { VerificationStatus } from '@/lib/types';
import { formatDate, cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n-context';

const CATEGORIES = ['All', 'Packaging', 'Household', 'Food & Beverage', 'Apparel', 'Electronics', 'Stationery', 'Energy'];
const STATUSES: { labelKey: string; fallback: string; value: VerificationStatus | 'ALL' }[] = [
  { labelKey: 'ledger.filterAll', fallback: 'All Audits', value: 'ALL' },
  { labelKey: 'ledger.filterVerified', fallback: 'Verified', value: 'VERIFIED' },
  { labelKey: 'ledger.filterInsufficient', fallback: 'Insufficient Evidence', value: 'INSUFFICIENT_EVIDENCE' },
  { labelKey: 'ledger.filterGreenwashing', fallback: 'Potential Greenwashing', value: 'POTENTIAL_GREENWASHING' },
];

interface ExploreProduct {
  id: string;
  product_name: string;
  brand: string;
  category: string;
  claim_text: string;
  status: VerificationStatus;
  evidence_strength: string;
  verified_at: string;
  result_id: string;
}

function ExploreContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState<VerificationStatus | 'ALL'>('ALL');
  const [products, setProducts] = useState<ExploreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Read URL params on mount ───────────────────────────────
  useEffect(() => {
    const q = searchParams.get('q') || searchParams.get('search');
    const cat = searchParams.get('category');
    const stat = searchParams.get('status') as VerificationStatus;
    if (q) setSearch(q);
    if (cat && CATEGORIES.includes(cat)) setCategory(cat);
    if (stat && ['VERIFIED', 'INSUFFICIENT_EVIDENCE', 'POTENTIAL_GREENWASHING'].includes(stat)) {
      setStatus(stat);
    }
  }, [searchParams]);

  // ── Fetch from API ─────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/explore');
      if (!res.ok) {
        throw new Error('Unable to load product records.');
      }
      const data = await res.json();
      if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        throw new Error('Invalid format');
      }
    } catch (err) {
      console.error('[GreenLedger] Failed to fetch explore products:', err);
      setError('Unable to load product records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function handleResetFilters() {
    setSearch('');
    setCategory('All');
    setStatus('ALL');
  }

  // ── Client-side multi-dimensional filtering ────────────────
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((p) => {
      // 1. Search checks: product name, brand, category, and claim text
      const matchSearch =
        !query ||
        (p.product_name || '').toLowerCase().includes(query) ||
        (p.brand || '').toLowerCase().includes(query) ||
        (p.category || '').toLowerCase().includes(query) ||
        (p.claim_text || '').toLowerCase().includes(query);

      // 2. Category filter
      const matchCat =
        category === 'All' ||
        (p.category || '').toLowerCase() === category.toLowerCase() ||
        (p.category || '').toLowerCase().includes(category.toLowerCase());

      // 3. Verdict filter
      const matchStatus = status === 'ALL' || p.status === status;

      // 4. Combined: satisfies ALL active conditions
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, search, category, status]);

  return (
    <div className="min-h-screen bg-[#F3F0E8] pt-24 pb-20">
      {/* Header Banner - Dark Forest */}
      <div className="bg-[#0B241A] text-[#F3F0E8] py-16 px-6 border-b border-[#12382A]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-semibold text-[#63D6A2] uppercase tracking-widest px-3 py-1 rounded bg-[#12382A] border border-[#63D6A2]/25 mb-4 inline-block">
              {t('explore.badge', 'Open Product Index')}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#F3F0E8] mb-3">
              {t('explore.title', 'Explore Verified Products')}
            </h1>
            <p className="text-base sm:text-lg text-[#F3F0E8]/75 font-light">
              {t('explore.subtitle', 'Search and inspect environmental claims across consumer goods that have undergone the GreenLedger verification pipeline.')}
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
              id="explore-search"
              name="q"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('explore.searchPlaceholder', 'Search products by name, brand, or category...')}
              className="w-full pl-11 pr-4 py-3 text-sm bg-[#FAF8F3] border border-[#C8CEC5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12382A] text-[#102019] placeholder-[#98A49D]"
              aria-label="Search verified products"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-5 justify-between">
            {/* Status filters */}
            <div>
              <p className="text-xs font-mono font-semibold text-[#12382A] uppercase tracking-wider mb-2">
                {t('explore.filterVerdict', 'Filter by Verdict')}
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
                    {t(s.labelKey, s.fallback)}
                  </button>
                ))}
              </div>
            </div>

            {/* Category filters */}
            <div>
              <p className="text-xs font-mono font-semibold text-[#12382A] uppercase tracking-wider mb-2">
                {t('explore.productCategory', 'Product Category')}
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
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={12} className="inline animate-spin text-[#12382A]" />
                {t('explore.loadingRecords', 'Loading verified records…')}
              </span>
            ) : error ? (
              <span className="text-[#C95C5C]">{t('explore.recordsError', 'Unable to load product records')}</span>
            ) : (
              t('explore.showingRecords', 'Showing {count} record(s)', { count: filtered.length })
            )}
          </span>
          <span>{t('explore.verifiedRegistry', 'Verified against public registries')}</span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20 card-cream border border-[#C8CEC5] rounded-2xl">
            <Loader2 size={32} className="animate-spin text-[#12382A] mx-auto mb-3" />
            <h3 className="font-serif text-xl text-[#102019] mb-1">{t('explore.loadingTitle', 'Loading verified claims directory…')}</h3>
            <p className="text-xs text-[#718078] font-mono">{t('explore.loadingDesc', 'Retrieving public environmental audit records.')}</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16 px-6 card-cream border-2 border-[#C95C5C]/30 rounded-2xl shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#C95C5C]/15 text-[#C95C5C] flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="font-serif text-2xl text-[#102019] mb-2">{t('explore.errorTitle', 'Unable to load product records.')}</h3>
            <p className="text-xs font-mono text-[#718078] max-w-md mx-auto mb-6">
              {error}
            </p>
            <button
              onClick={fetchProducts}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#12382A] text-[#F3F0E8] text-xs font-mono font-semibold hover:bg-[#1B4D3A] transition-colors shadow-sm"
            >
              {t('explore.tryAgain', 'Try Again')}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 card-cream border border-[#C8CEC5] rounded-2xl">
            <Search size={36} className="text-[#718078] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-xl text-[#102019] mb-1">
              {search
                ? t('explore.noSearchResults', 'No products found.')
                : t('explore.noClaims', 'No products match your current filters.')}
            </h3>
            <p className="text-xs text-[#718078] font-mono mb-4 max-w-md mx-auto leading-relaxed">
              {search
                ? t('explore.noSearchDesc', 'No claims matched "{query}". Try adjusting keywords, brand name, or clearing filters.', { query: search })
                : t('explore.noClaimsDesc', 'Try adjusting your keywords or clearing the category and verdict filters.')}
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12382A] text-[#F3F0E8] text-xs font-mono hover:bg-[#1B4D3A] transition-colors font-semibold"
            >
              <X size={14} /> {t('explore.resetFilters', 'Reset all filters')}
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="card-cream p-6 rounded-2xl border border-[#C8CEC5] hover:border-[#12382A] flex flex-col justify-between group transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <StatusBadge status={product.status} size="sm" />
                    <span className="text-[11px] font-mono text-[#718078] uppercase">{product.category}</span>
                  </div>

                  <Link href={`/result/${product.result_id}`} className="block group/title">
                    <h3 className="font-serif text-xl text-[#102019] group-hover/title:text-[#12382A] transition-colors mb-1">
                      {product.product_name}
                    </h3>
                  </Link>
                  <p className="text-xs font-mono text-[#718078] mb-4">
                    {t('explore.brand', 'Brand')}: {product.brand}
                  </p>

                  <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#C8CEC5]/70 mb-5">
                    <p className="text-xs text-[#102019] italic leading-relaxed line-clamp-2">
                      &ldquo;{product.claim_text}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#C8CEC5] flex items-center justify-between text-xs font-mono text-[#718078] gap-2">
                  <span>
                    {t('explore.verifiedDate', 'Verified')}: {formatDate(product.verified_at)}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/report?productId=${encodeURIComponent(product.id)}&brand=${encodeURIComponent(product.brand)}&product=${encodeURIComponent(product.product_name)}&claim=${encodeURIComponent(product.claim_text)}`}
                      className="text-xs font-mono text-[#718078] hover:text-[#C95C5C] flex items-center gap-1 transition-colors"
                      title="Report this claim"
                    >
                      <Flag size={12} />
                      <span>{t('explore.report', 'Report')}</span>
                    </Link>
                    <Link
                      href={`/result/${product.result_id}`}
                      className="text-[#12382A] font-semibold flex items-center gap-1 hover:text-[#0B241A] group-hover:translate-x-0.5 transition-transform"
                      title="Inspect audit details"
                    >
                      <span>{t('explore.inspect', 'Inspect')}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F3F0E8] pt-32 pb-20 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-[#12382A] mb-3" size={32} />
          <p className="text-sm font-mono text-[#718078]">Loading verified claims directory...</p>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
