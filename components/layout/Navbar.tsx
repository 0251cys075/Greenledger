'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/verify', label: 'Verify' },
  { href: '/explore', label: 'Explore' },
  { href: '/ledger', label: 'Ledger' },
  { href: '/about', label: 'How It Works' },
  { href: '/about#about', label: 'About' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHero = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // When not on hero or when scrolled, show the deep forest navbar
  const isSolid = !isHero || scrolled || menuOpen;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isSolid
          ? 'bg-[#0B241A]/95 backdrop-blur-md border-b border-[#63D6A2]/20 shadow-md'
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
                  ? 'bg-[#12382A] border border-[#63D6A2]/30 text-[#63D6A2]'
                  : 'bg-white/15 backdrop-blur-sm border border-white/20 text-white'
              )}
            >
              <ShieldCheck className="w-5 h-5 text-[#63D6A2]" size={20} />
            </div>
            <span className="font-serif text-lg tracking-tight text-[#F3F0E8]">
              Green<span className="text-[#63D6A2]">Ledger</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#63D6A2]/15 text-[#63D6A2] border border-[#63D6A2]/25">
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
                    isActive
                      ? 'text-[#63D6A2] bg-[#12382A]'
                      : 'text-[#F3F0E8]/80 hover:text-[#63D6A2] hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/explore"
              aria-label="Search ledger"
              className="p-2 rounded-lg text-[#F3F0E8]/70 hover:text-[#63D6A2] hover:bg-white/5 transition-colors"
            >
              <Search size={18} />
            </Link>
            <Link
              href="/verify"
              className="bg-[#63D6A2] text-[#0B241A] hover:bg-[#7eedb8] px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              Verify a Claim
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-[#F3F0E8] hover:text-[#63D6A2] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0B241A] border-t border-[#63D6A2]/20 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'px-4 py-3 rounded-lg text-sm font-medium transition-all',
                  pathname === link.href
                    ? 'text-[#63D6A2] bg-[#12382A]'
                    : 'text-[#F3F0E8]/85 hover:text-[#63D6A2] hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-[#63D6A2]/20 mt-2">
              <Link
                href="/verify"
                onClick={() => setMenuOpen(false)}
                className="btn-mint w-full justify-center text-center block font-semibold"
              >
                Verify a Claim →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
