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

  const isHero = pathname === '/';

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      setScrolled(y > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // When not on hero or when scrolled, show the solid paper navbar
  const isSolid = !isHero || scrolled || menuOpen;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isSolid
          ? 'bg-[#FCFAF5]/95 backdrop-blur-md border-b border-[#D6D3C8] shadow-sm'
          : 'bg-transparent border-b border-white/10'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="GreenLedger Home">
            <div
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300',
                isSolid
                  ? 'bg-[#315C45] border border-[#A9BBA0]/30 text-[#A9BBA0]'
                  : 'bg-white/15 backdrop-blur-sm border border-white/20 text-white'
              )}
            >
              <ShieldCheck className="w-5 h-5 text-[#A9BBA0]" size={20} />
            </div>
            <span
              className={cn(
                'font-serif text-lg tracking-tight transition-colors',
                isSolid ? 'text-[#1B3A2B]' : 'text-[#F7F5F0]'
              )}
            >
              Green<span className={isSolid ? 'text-[#315C45]' : 'text-[#A9BBA0]'}>Ledger</span>
            </span>
            <span
              className={cn(
                'hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border',
                isSolid
                  ? 'bg-[#EFECE4] text-[#718875] border-[#D6D3C8]'
                  : 'bg-[#A9BBA0]/15 text-[#A9BBA0] border-[#A9BBA0]/25'
              )}
            >
              Trust
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200',
                    isSolid
                      ? cn(
                          isActive
                            ? 'text-[#1B3A2B] bg-[#EFECE4]'
                            : 'text-[#1C1C1C]/80 hover:text-[#1B3A2B] hover:bg-[#EFECE4]'
                        )
                      : cn(
                          isActive
                            ? 'text-[#A9BBA0] bg-[#315C45]/80'
                            : 'text-[#F7F5F0]/80 hover:text-[#A9BBA0] hover:bg-white/5'
                        )
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-2.5">
            <LanguageSelector isDarkNavbar={!isSolid} />
            <Link
              href="/explore"
              aria-label={t('navbar.search')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isSolid
                  ? 'text-[#1C1C1C]/60 hover:text-[#1B3A2B] hover:bg-[#EFECE4]'
                  : 'text-[#F7F5F0]/70 hover:text-[#A9BBA0] hover:bg-white/5'
              )}
            >
              <Search size={18} />
            </Link>
            <Link
              href={businessLink.href}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all duration-200 border',
                isSolid
                  ? cn(
                      pathname.startsWith('/business')
                        ? 'text-[#1B3A2B] bg-[#EFECE4] border-[#315C45]/30'
                        : 'text-[#1C1C1C]/70 hover:text-[#1B3A2B] hover:bg-[#EFECE4] border-transparent'
                    )
                  : cn(
                      pathname.startsWith('/business')
                        ? 'text-[#A9BBA0] bg-[#315C45]/80 border-[#A9BBA0]/30'
                        : 'text-[#F7F5F0]/70 hover:text-[#A9BBA0] hover:bg-white/5 border-transparent'
                    )
              )}
            >
              <Building2 size={14} />
              {businessLink.label}
            </Link>
            <Link
              href="/verify"
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm',
                isSolid
                  ? 'bg-[#1B3A2B] text-[#F7F5F0] hover:bg-[#315C45] hover:shadow-md hover:-translate-y-0.5'
                  : 'bg-[#A9BBA0] text-[#1B3A2B] hover:bg-[#BDCCB2] hover:shadow-md hover:-translate-y-0.5'
              )}
            >
              {t('navbar.verifyClaim')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSelector isDarkNavbar={!isSolid} />
            <button
              className={cn(
                'p-2 rounded-lg transition-colors',
                isSolid ? 'text-[#1B3A2B] hover:text-[#315C45]' : 'text-[#F7F5F0] hover:text-[#A9BBA0]'
              )}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#FCFAF5] border-t border-[#D6D3C8] shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'px-4 py-3 rounded-lg text-sm font-medium transition-all',
                  pathname === link.href
                    ? 'text-[#1B3A2B] bg-[#EFECE4]'
                    : 'text-[#1C1C1C]/85 hover:text-[#1B3A2B] hover:bg-[#EFECE4]'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={businessLink.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                pathname.startsWith('/business')
                  ? 'text-[#1B3A2B] bg-[#EFECE4]'
                  : 'text-[#1C1C1C]/85 hover:text-[#1B3A2B] hover:bg-[#EFECE4]'
              )}
            >
              <Building2 size={14} /> {businessLink.label}
            </Link>
            <div className="pt-4 border-t border-[#D6D3C8] mt-2">
              <Link
                href="/verify"
                onClick={() => setMenuOpen(false)}
                className="btn-mint w-full justify-center text-center block font-semibold"
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