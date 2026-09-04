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
  if (!verdict) return <span className="text-xs text-[#718875] bg-[#EFECE4] px-2.5 py-1 rounded-full font-medium">Pending</span>;
  if (verdict === 'VERIFIED')
    return <span className="text-xs font-semibold bg-[#3E7D4F]/15 text-[#315C45] border border-[#3E7D4F]/35 px-2.5 py-1 rounded-full">🟢 Verified</span>;
  if (verdict === 'INSUFFICIENT_EVIDENCE')
    return <span className="text-xs font-semibold bg-[#C9A227]/15 text-[#8A6A1E] border border-[#C9A227]/35 px-2.5 py-1 rounded-full">🟡 Insufficient Evidence</span>;
  return <span className="text-xs font-semibold bg-[#C1443E]/15 text-[#9E3B33] border border-[#C1443E]/35 px-2.5 py-1 rounded-full">🔴 Potential Greenwashing</span>;
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
        <span className="text-2xl font-bold text-[#1C1C1C]">{value}</span>
      </div>
      <p className="text-sm font-semibold text-[#1C1C1C]">{label}</p>
      {sub && <p className="text-xs text-[#718875] mt-0.5">{sub}</p>}
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
            <Building2 size={20} className="text-[#A9BBA0]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#718875]">GreenLedger Business</span>
            <span className="text-xs font-mono text-[#C9A227] bg-[#C9A227]/10 px-2 py-0.5 rounded border border-[#C9A227]/30">Demo Mode</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1C1C1C]">EcoPure Industries</h1>
          <p className="text-sm text-[#718875] mt-0.5">Environmental Claims Dashboard</p>
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
              <div className="w-10 h-10 bg-[#EFECE4] rounded-xl mb-3" />
              <div className="h-6 bg-[#EFECE4] rounded w-8 mb-2" />
              <div className="h-3 bg-[#EFECE4] rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard label="Products" value={stats.total_products} icon={Package} color="bg-[#315C45]/10 text-[#315C45]" />
          <StatCard label="Claims Submitted" value={stats.total_claims} icon={FileText} color="bg-[#1B3A2B]/10 text-[#1B3A2B]" />
          <StatCard label="Verified" value={stats.verified} icon={CheckCircle2} color="bg-[#3E7D4F]/15 text-[#3E7D4F]" sub="Evidence supported" />
          <StatCard label="Needs Evidence" value={stats.insufficient_evidence} icon={AlertCircle} color="bg-[#C9A227]/15 text-[#C9A227]" sub="Upload more docs" />
          <StatCard label="Potential Issues" value={stats.potential_issues} icon={ShieldAlert} color="bg-[#C1443E]/15 text-[#C1443E]" sub="Review required" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Claims */}
        <div className="lg:col-span-2">
          <div className="card-cream overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D6D3C8]">
              <h2 className="text-base font-semibold text-[#1C1C1C]">Recent Claims</h2>
              <Link href="/business/claims" className="text-xs text-[#A9BBA0] hover:underline flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4">
                    <div className="flex-1 h-4 bg-[#EFECE4] rounded" />
                    <div className="w-24 h-6 bg-[#EFECE4] rounded-full" />
                  </div>
                ))}
              </div>
            ) : claims.length === 0 ? (
              <div className="p-12 text-center">
                <FileText size={32} className="text-[#D6D3C8] mx-auto mb-3" />
                <p className="text-sm text-[#718875]">No claims yet</p>
                <Link href="/business/claims/new" className="btn-mint mt-4 text-sm py-2">
                  Submit your first claim
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#D6D3C8]">
                {claims.map((claim) => (
                  <div key={claim.id} className="px-6 py-4 hover:bg-[#F7F5F0]/60 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#718875] uppercase tracking-wider mb-0.5">
                          {claim.product_name}
                        </p>
                        <p className="text-sm font-medium text-[#1C1C1C] leading-snug line-clamp-2">
                          &ldquo;{claim.claim_text}&rdquo;
                        </p>
                        <p className="text-xs text-[#A8B3AA] mt-1 font-mono">#{claim.audit_id}</p>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        <VerdictBadge verdict={claim.verdict} />
                        {claim.is_public && (
                          <Link
                            href={`/business/records/${claim.audit_id}`}
                            className="text-xs text-[#A9BBA0] hover:underline flex items-center gap-1"
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
            <h2 className="text-sm font-semibold text-[#1C1C1C] mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/business/claims/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#EFECE4] transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[#A9BBA0]/15 flex items-center justify-center">
                  <Plus size={14} className="text-[#A9BBA0]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1C1C1C]">Submit Claim</p>
                  <p className="text-xs text-[#718875]">+ Upload evidence</p>
                </div>
                <ArrowRight size={14} className="ml-auto text-[#D6D3C8] group-hover:text-[#1B3A2B] transition-colors" />
              </Link>
              <Link href="/business/products/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#EFECE4] transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[#1B3A2B]/10 flex items-center justify-center">
                  <Package size={14} className="text-[#1B3A2B]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1C1C1C]">Add Product</p>
                  <p className="text-xs text-[#718875]">Register a product</p>
                </div>
                <ArrowRight size={14} className="ml-auto text-[#D6D3C8] group-hover:text-[#1B3A2B] transition-colors" />
              </Link>
              <Link href="/business/pricing" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#EFECE4] transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-[#C9A227]/10 flex items-center justify-center">
                  <BarChart3 size={14} className="text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1C1C1C]">Business Plan</p>
                  <p className="text-xs text-[#718875]">Features & pricing</p>
                </div>
                <ArrowRight size={14} className="ml-auto text-[#D6D3C8] group-hover:text-[#1B3A2B] transition-colors" />
              </Link>
            </div>
          </div>

          {/* Products Preview */}
          <div className="card-cream p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#1C1C1C]">Products</h2>
              <Link href="/business/products" className="text-xs text-[#A9BBA0] hover:underline">
                Manage
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse h-8 bg-[#EFECE4] rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {products.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 py-2">
                    <div className="w-7 h-7 rounded-md bg-[#315C45]/10 flex items-center justify-center shrink-0">
                      <Package size={12} className="text-[#315C45]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1C1C1C] truncate">{p.product_name}</p>
                      <p className="text-xs text-[#718875] truncate">{p.category}</p>
                    </div>
                    {p.is_demo && (
                      <span className="ml-auto shrink-0 text-[9px] font-mono text-[#C9A227] bg-[#C9A227]/10 px-1.5 py-0.5 rounded border border-[#C9A227]/25">
                        DEMO
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="rounded-xl border border-[#A9BBA0]/25 bg-[#A9BBA0]/05 p-4">
            <div className="flex items-start gap-2">
              <Clock size={14} className="text-[#A9BBA0] mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#315C45]">Verification is Automatic</p>
                <p className="text-xs text-[#718875] mt-0.5 leading-relaxed">
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
