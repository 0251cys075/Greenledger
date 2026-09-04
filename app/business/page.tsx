'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Plus,
  ArrowRight,
  BarChart3,
  Clock,
  ExternalLink,
  Building2,
} from 'lucide-react';
import type { BusinessClaim, BusinessProduct } from '@/lib/business-store';

// ── Status helpers ────────────────────────────────────────────
function VerdictBadge({ verdict }: { verdict?: string }) {
  if (!verdict) return <span className="text-xs text-[#718078] bg-[#E9E6DC] px-2.5 py-1 rounded-full font-medium">Pending</span>;
  if (verdict === 'VERIFIED')
    return <span className="text-xs font-semibold bg-[#4FAF78]/15 text-[#12382A] border border-[#4FAF78]/35 px-2.5 py-1 rounded-full">🟢 Verified</span>;
  if (verdict === 'INSUFFICIENT_EVIDENCE')
    return <span className="text-xs font-semibold bg-[#D3A54A]/15 text-[#8B6414] border border-[#D3A54A]/35 px-2.5 py-1 rounded-full">🟡 Insufficient Evidence</span>;
  return <span className="text-xs font-semibold bg-[#C95C5C]/15 text-[#962A2A] border border-[#C95C5C]/35 px-2.5 py-1 rounded-full">🔴 Potential Greenwashing</span>;
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <div className="card-cream p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} />
        </div>
        <span className="text-2xl font-bold text-[#102019]">{value}</span>
      </div>
      <p className="text-sm font-semibold text-[#102019]">{label}</p>
      {sub && <p className="text-xs text-[#718078] mt-0.5">{sub}</p>}
    </div>
  );
}

export default function BusinessDashboard() {
  const [claims, setClaims] = useState<BusinessClaim[]>([]);
  const [products, setProducts] = useState<BusinessProduct[]>([]);
  const [stats, setStats] = useState({
    total_products: 0,
    total_claims: 0,
    verified: 0,
    insufficient_evidence: 0,
    potential_issues: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [claimsRes, productsRes] = await Promise.all([
          fetch('/api/business/claims'),
          fetch('/api/business/products'),
        ]);
        const claimsData = await claimsRes.json();
        const productsData = await productsRes.json();
        const c: BusinessClaim[] = claimsData.claims || [];
        const p: BusinessProduct[] = productsData.products || [];
        setClaims(c.slice(0, 5));
        setProducts(p);
        setStats({
          total_products: p.length,
          total_claims: c.length,
          verified: c.filter((x) => x.verdict === 'VERIFIED').length,
          insufficient_evidence: c.filter((x) => x.verdict === 'INSUFFICIENT_EVIDENCE').length,
          potential_issues: c.filter((x) => x.verdict === 'POTENTIAL_GREENWASHING').length,
          pending: c.filter((x) => x.status === 'SUBMITTED' || x.status === 'UNDER_REVIEW').length,
        });
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={20} className="text-[#63D6A2]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#718078]">GreenLedger Business</span>
            <span className="text-xs font-mono text-[#D3A54A] bg-[#D3A54A]/10 px-2 py-0.5 rounded border border-[#D3A54A]/30">Demo Mode</span>
          </div>
          <h1 className="text-2xl font-bold text-[#102019]">EcoPure Industries</h1>
          <p className="text-sm text-[#718078] mt-0.5">Environmental Claims Dashboard</p>
        </div>
        <div className="flex gap-3">
          <Link href="/business/products/new" className="btn-secondary text-sm py-2 px-4">
            <Plus size={14} /> Add Product
          </Link>
          <Link href="/business/claims/new" className="btn-mint text-sm py-2 px-4">
            <Plus size={14} /> Submit Claim
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card-cream p-5 animate-pulse">
              <div className="w-10 h-10 bg-[#E9E6DC] rounded-xl mb-3" />
              <div className="h-6 bg-[#E9E6DC] rounded w-8 mb-2" />
              <div className="h-3 bg-[#E9E6DC] rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard label="Products" value={stats.total_products} icon={Package} color="bg-[#12382A]/10 text-[#12382A]" />
          <StatCard label="Claims Submitted" value={stats.total_claims} icon={FileText} color="bg-[#0B241A]/10 text-[#0B241A]" />
          <StatCard label="Verified" value={stats.verified} icon={CheckCircle2} color="bg-[#4FAF78]/15 text-[#4FAF78]" sub="Evidence supported" />
          <StatCard label="Needs Evidence" value={stats.insufficient_evidence} icon={AlertCircle} color="bg-[#D3A54A]/15 text-[#D3A54A]" sub="Upload more docs" />
          <StatCard label="Potential Issues" value={stats.potential_issues} icon={ShieldAlert} color="bg-[#C95C5C]/15 text-[#C95C5C]" sub="Review required" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Claims */}
        <div className="lg:col-span-2">
          <div className="card-cream overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#C8CEC5]">
              <h2 className="text-base font-semibold text-[#102019]">Recent Claims</h2>
              <Link href="/business/claims" className="text-xs text-[#63D6A2] hover:underline flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4">
                    <div className="flex-1 h-4 bg-[#E9E6DC] rounded" />
                    <div className="w-24 h-6 bg-[#E9E6DC] rounded-full" />
                  </div>
                ))}
              </div>
            ) : claims.length === 0 ? (
              <div className="p-12 text-center">
                <FileText size={32} className="text-[#C8CEC5] mx-auto mb-3" />
                <p className="text-sm text-[#718078]">No claims yet</p>
                <Link href="/business/claims/new" className="btn-mint mt-4 text-sm py-2">
                  Submit your first claim
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#C8CEC5]">
                {claims.map((claim) => (
                  <div key={claim.id} className="px-6 py-4 hover:bg-[#F3F0E8]/60 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#718078] uppercase tracking-wider mb-0.5">
                          {claim.product_name}
                        </p>
                        <p className="text-sm font-medium text-[#102019] leading-snug line-clamp-2">
                          &ldquo;{claim.claim_text}&rdquo;
                        </p>
                        <p className="text-xs text-[#98A49D] mt-1 font-mono">#{claim.audit_id}</p>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        <VerdictBadge verdict={claim.verdict} />
                        {claim.is_public && (
                          <Link
                            href={`/business/records/${claim.audit_id}`}
                            className="text-xs text-[#63D6A2] hover:underline flex items-center gap-1"
                          >
                            View Record <ExternalLink size={10} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions + Products */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="card-cream p-5">
            <h2 className="text-sm font-semibold text-[#102019] mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/business/claims/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#E9E6DC] transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[#63D6A2]/15 flex items-center justify-center">
                  <Plus size={14} className="text-[#63D6A2]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#102019]">Submit Claim</p>
                  <p className="text-xs text-[#718078]">+ Upload evidence</p>
                </div>
                <ArrowRight size={14} className="ml-auto text-[#C8CEC5] group-hover:text-[#0B241A] transition-colors" />
              </Link>
              <Link href="/business/products/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#E9E6DC] transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[#0B241A]/10 flex items-center justify-center">
                  <Package size={14} className="text-[#0B241A]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#102019]">Add Product</p>
                  <p className="text-xs text-[#718078]">Register a product</p>
                </div>
                <ArrowRight size={14} className="ml-auto text-[#C8CEC5] group-hover:text-[#0B241A] transition-colors" />
              </Link>
              <Link href="/business/pricing" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#E9E6DC] transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[#D3A54A]/10 flex items-center justify-center">
                  <BarChart3 size={14} className="text-[#D3A54A]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#102019]">Business Plan</p>
                  <p className="text-xs text-[#718078]">Features & pricing</p>
                </div>
                <ArrowRight size={14} className="ml-auto text-[#C8CEC5] group-hover:text-[#0B241A] transition-colors" />
              </Link>
            </div>
          </div>

          {/* Products Preview */}
          <div className="card-cream p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#102019]">Products</h2>
              <Link href="/business/products" className="text-xs text-[#63D6A2] hover:underline">
                Manage
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse h-8 bg-[#E9E6DC] rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {products.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 py-2">
                    <div className="w-7 h-7 rounded-md bg-[#12382A]/10 flex items-center justify-center shrink-0">
                      <Package size={12} className="text-[#12382A]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#102019] truncate">{p.product_name}</p>
                      <p className="text-xs text-[#718078] truncate">{p.category}</p>
                    </div>
                    {p.is_demo && (
                      <span className="ml-auto shrink-0 text-[9px] font-mono text-[#D3A54A] bg-[#D3A54A]/10 px-1.5 py-0.5 rounded border border-[#D3A54A]/25">
                        DEMO
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="rounded-xl border border-[#63D6A2]/25 bg-[#63D6A2]/05 p-4">
            <div className="flex items-start gap-2">
              <Clock size={14} className="text-[#63D6A2] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#12382A]">Verification is Automatic</p>
                <p className="text-xs text-[#718078] mt-0.5 leading-relaxed">
                  Claims are evaluated by the GreenLedger evidence engine. Verdicts cannot be purchased or manually overridden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
