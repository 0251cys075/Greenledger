'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ShieldCheck, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n-context';
import LanguageSelector from './LanguageSelector';

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: t('navbar.home') },
    { href: '/verify', label: t('navbar.verify') },
    { href: '/explore', label: t('navbar.explore') },
    { href: '/ledger', label: t('navbar.ledger') },
    { href: '/about', label: t('navbar.howItWorks') },
    { href: '/about#about', label: t('navbar.about') },
  ];

  const businessLink = { href: '/business', label: 'Business' };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      setScrolled(y > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled || menuOpen
          ? 'bg-[#F7F5F0]/92 backdrop-blur-md border-b border-[#D6D3C8]/80 shadow-[0_2px_12px_rgba(27,58,43,0.03)]'
          : 'bg-[#F7F5F0]/80 backdrop-blur-sm border-b border-[#D6D3C8]/50'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="GreenLedger Home">
            <div className="w-8 h-8 rounded-md bg-[#1B3A2B] text-[#F7F5F0] flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
              <ShieldCheck className="w-4.5 h-4.5 text-[#A9BBA0]" size={18} strokeWidth={2} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-[20px] text-[#1B3A2B] tracking-tight">
                Green<span className="text-[#315C45]">Ledger</span>
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono uppercase tracking-[0.2em] text-[#718875] px-1.5 py-0.5 border border-[#D6D3C8] rounded">
                Audit
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-1.5 rounded text-[13px] tracking-wide transition-all duration-150',
                    isActive
                      ? 'text-[#1B3A2B] font-semibold bg-[#EFECE4]'
                      : 'text-[#1C1C1C]/75 font-medium hover:text-[#1B3A2B] hover:bg-[#EFECE4]/60'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector isDarkNavbar={false} />

            <Link
              href="/explore"
              aria-label={t('navbar.search')}
              className="p-2 text-[#1C1C1C]/60 hover:text-[#1B3A2B] hover:bg-[#EFECE4]/70 rounded transition-colors"
            >
              <Search size={16} strokeWidth={1.75} />
            </Link>

            <Link
              href={businessLink.href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded text-[13px] font-medium transition-all duration-150 border',
                pathname.startsWith('/business')
                  ? 'text-[#1B3A2B] bg-[#EFECE4] border-[#D6D3C8]'
                  : 'text-[#1C1C1C]/75 hover:text-[#1B3A2B] hover:bg-[#EFECE4]/50 border-transparent'
              )}
            >
              <Building2 size={13} strokeWidth={1.75} />
              {businessLink.label}
            </Link>

            <Link
              href="/verify"
              className="inline-flex items-center gap-1.5 bg-[#1B3A2B] text-[#F7F5F0] hover:bg-[#315C45] px-4.5 py-2 rounded-md text-[13px] font-medium tracking-wide transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
            >
              <span>{t('navbar.verifyClaim')}</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSelector isDarkNavbar={false} />
            <button
              className="p-2 text-[#1B3A2B] hover:bg-[#EFECE4] rounded transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#F7F5F0] border-t border-[#D6D3C8] shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'px-3 py-2.5 rounded text-sm font-medium transition-all',
                  pathname === link.href
                    ? 'text-[#1B3A2B] bg-[#EFECE4] font-semibold'
                    : 'text-[#1C1C1C]/80 hover:text-[#1B3A2B] hover:bg-[#EFECE4]/60'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={businessLink.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'px-3 py-2.5 rounded text-sm font-medium transition-all flex items-center gap-2',
                pathname.startsWith('/business')
                  ? 'text-[#1B3A2B] bg-[#EFECE4] font-semibold'
                  : 'text-[#1C1C1C]/80 hover:text-[#1B3A2B] hover:bg-[#EFECE4]/60'
              )}
            >
              <Building2 size={15} /> {businessLink.label}
            </Link>
            <div className="pt-3 border-t border-[#D6D3C8] mt-2">
              <Link
                href="/verify"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center block bg-[#1B3A2B] text-[#F7F5F0] py-2.5 rounded-md text-sm font-medium"
              >
                {t('navbar.verifyClaim')} →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}