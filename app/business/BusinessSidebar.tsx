'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FileText,
  Upload,
  ShieldCheck,
  BarChart3,
  ChevronRight,
  Building2,
  X,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { href: '/business', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/business/products', label: 'Products', icon: Package },
  { href: '/business/claims', label: 'Environmental Claims', icon: FileText },
  { href: '/business/claims/new', label: 'Submit Claim', icon: Upload },
  { href: '/business/pricing', label: 'Business Plan', icon: BarChart3 },
];

function SidebarLink({
  href,
  label,
  icon: Icon,
  exact,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href) && pathname !== '/business' || (exact && pathname === href);
  const active = exact ? pathname === href : pathname === href || (pathname.startsWith(href + '/'));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
        active
          ? 'bg-[#63D6A2]/15 text-[#63D6A2] border border-[#63D6A2]/25'
          : 'text-[#F3F0E8]/70 hover:text-[#F3F0E8] hover:bg-white/8'
      )}
    >
      <Icon
        size={16}
        className={cn(
          'shrink-0 transition-colors',
          active ? 'text-[#63D6A2]' : 'text-[#F3F0E8]/50 group-hover:text-[#63D6A2]'
        )}
      />
      <span className="truncate">{label}</span>
      {active && <ChevronRight size={12} className="ml-auto text-[#63D6A2]/60" />}
    </Link>
  );
}

export default function BusinessSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full py-6">
      {/* Company Header */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#12382A]/60 border border-[#63D6A2]/15">
          <div className="w-9 h-9 rounded-lg bg-[#63D6A2]/20 border border-[#63D6A2]/30 flex items-center justify-center shrink-0">
            <Building2 size={16} className="text-[#63D6A2]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#F3F0E8]/50 uppercase tracking-widest font-mono leading-none mb-0.5">Company</p>
            <p className="text-sm font-semibold text-[#F3F0E8] truncate">EcoPure Industries</p>
          </div>
        </div>
        <div className="mt-2 px-1">
          <span className="text-[10px] font-mono text-[#63D6A2]/70 uppercase tracking-widest">
            ⬤ Demo Mode
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <p className="px-1 mb-2 text-[10px] font-mono uppercase tracking-widest text-[#F3F0E8]/30">
          Portal
        </p>
        {navItems.map((item) => (
          <SidebarLink
            key={item.href}
            {...item}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      {/* Trust Principle */}
      <div className="px-4 mt-6">
        <div className="p-3 rounded-lg border border-[#63D6A2]/20 bg-[#12382A]/40">
          <div className="flex items-start gap-2 mb-1.5">
            <ShieldCheck size={12} className="text-[#63D6A2] mt-0.5 shrink-0" />
            <p className="text-[10px] font-semibold text-[#63D6A2] uppercase tracking-wider">Trust Principle</p>
          </div>
          <p className="text-[10px] text-[#F3F0E8]/50 leading-relaxed">
            Verification outcomes are evidence-based and cannot be purchased.
          </p>
        </div>
      </div>

      {/* Back to consumer */}
      <div className="px-4 mt-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider text-[#F3F0E8]/40 hover:text-[#63D6A2] hover:bg-white/5 transition-colors"
        >
          ← Consumer View
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-[72px] left-4 z-40 md:hidden bg-[#0B241A] border border-[#63D6A2]/30 text-[#63D6A2] p-2 rounded-lg shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle business sidebar"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop fixed, mobile slide-in */}
      <aside
        className={cn(
          'fixed top-[72px] left-0 bottom-0 z-35 w-60 bg-[#0B241A] border-r border-[#63D6A2]/15 overflow-y-auto transition-transform duration-300',
          'md:translate-x-0 md:sticky md:top-[72px] md:h-[calc(100vh-72px)] md:shrink-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
