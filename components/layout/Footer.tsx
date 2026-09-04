'use client';

import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n-context';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#122619] text-[#F7F5F0]/80 pt-20 pb-12 border-t border-[#315C45]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#315C45] border border-[#A9BBA0]/30 flex items-center justify-center">
                <ShieldCheck className="text-[#A9BBA0]" size={18} />
              </div>
              <span className="font-serif text-xl font-semibold text-[#F7F5F0]">
                Green<span className="text-[#A9BBA0]">Ledger</span>
              </span>
            </div>
            <p className="text-sm font-serif italic text-[#A9BBA0] mb-3">
              Verify. Understand. Choose Better.
            </p>
            <p className="text-sm text-[#F7F5F0]/70 leading-relaxed max-w-sm mb-6">
              {t('footer.tagline', 'The open, evidence-backed environmental verification network.')}
            </p>

            {/* SDG badges */}
            <div className="flex flex-wrap gap-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#315C45] text-[#A9BBA0] border border-[#A9BBA0]/20">
                SDG 12: Responsible Consumption
              </span>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#315C45] text-[#A9BBA0] border border-[#A9BBA0]/20">
                SDG 13: Climate Action
              </span>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#315C45] text-[#A9BBA0] border border-[#A9BBA0]/20">
                SDG 16: Transparency
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono font-semibold text-[#A9BBA0] uppercase tracking-wider mb-5">
              Verification Platform
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/verify', label: t('nav.verify', 'Verify a Claim') },
                { href: '/explore', label: t('nav.explore', 'Explore Verified Products') },
                { href: '/ledger', label: t('nav.ledger', 'Public Community Ledger') },
                { href: '/report', label: t('report.title', 'Report Suspicious Claim') },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[#F7F5F0]/70 hover:text-[#A9BBA0] transition-colors flex items-center gap-1.5 group">
                    <span>{label}</span>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#A9BBA0]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Methodology & Info */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono font-semibold text-[#A9BBA0] uppercase tracking-wider mb-5">
              Trust &amp; Governance
            </h4>
            <ul className="space-y-3 text-sm mb-6">
              {[
                { href: '/about', label: 'How It Works & Methodology' },
                { href: '/about#methodology', label: 'Rules Engine & Source Evidence' },
                { href: '/about#verdicts', label: 'Three Verdict States Standard' },
                { href: '/about#faq', label: 'Frequently Asked Questions' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-[#F7F5F0]/70 hover:text-[#A9BBA0] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="p-4 rounded-xl bg-[#1B3A2B] border border-[#A9BBA0]/20">
              <p className="text-xs text-[#F7F5F0]/80 leading-relaxed">
                Open Climate Intelligence: Claims are evaluated based on public traceability and certified criteria, not marketing claims.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#F7F5F0]/50">
            © {new Date().getFullYear()} GreenLedger. Environmental claim verification and traceability prototype.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#F7F5F0]/60">
            <span className="w-2 h-2 rounded-full bg-[#A9BBA0] animate-pulse" aria-hidden="true" />
            <span>Public Verification Engine Live</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
