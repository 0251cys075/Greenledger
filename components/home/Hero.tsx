'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, FileText, QrCode, Scale } from 'lucide-react';
import { useTranslation } from '@/lib/i18n-context';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section
      className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#F7F5F0]"
      aria-label="Hero section"
    >
      {/* Subtle paper texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left: editorial headline */}
          <div className="lg:col-span-6 xl:col-span-6">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8 animate-fade-in">
              <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-[#315C45]">
                {t('hero.badge', 'Environmental Claim Verification')}
              </span>
            </div>

            {/* Headline — editorial serif */}
            <h1
              className="font-serif text-[#1C1C1C] mb-7 animate-fade-in-up"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.025em',
              }}
            >
              {t('hero.titleLine1', 'Green Claims Are Everywhere.')}
              <br />
              <em className="not-italic text-[#315C45]">
                {t('hero.titleLine2', 'Proof Is Harder to Find.')}
              </em>
            </h1>

            {/* Supporting text */}
            <p
              className="text-[#1C1C1C]/65 text-base sm:text-lg leading-relaxed max-w-xl mb-10 animate-fade-in-up delay-200"
              style={{ fontWeight: 400 }}
            >
              {t(
                'hero.subtitle',
                'GreenLedger connects environmental claims to evidence, standards and transparent verification — so consumers and businesses can see what stands behind a green claim.'
              )}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in-up delay-300">
              <Link
                href="/verify"
                className="group flex items-center gap-2.5 bg-[#1B3A2B] text-[#F7F5F0] px-8 py-3.5 rounded-lg font-semibold text-[15px] hover:bg-[#315C45] transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                {t('hero.verifyCta', 'Verify a Claim')}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/explore"
                className="flex items-center gap-2 border border-[#1B3A2B]/20 text-[#1B3A2B] px-8 py-3.5 rounded-lg font-medium text-[15px] hover:bg-[#1B3A2B] hover:text-[#F7F5F0] transition-all"
              >
                {t('hero.exploreCta', 'Explore the Ledger')}
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-9 text-xs font-mono text-[#718875] animate-fade-in-up delay-300">
              {[
                'Evidence-backed',
                'Publicly audited',
                '8 languages',
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <span className="w-[3px] h-[3px] rounded-full bg-[#315C45] shrink-0" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right: editorial verification composition */}
          <div className="lg:col-span-6 xl:col-span-6 animate-fade-in-up delay-200">
            <div className="relative">
              {/* Main composition container */}
              <div className="relative w-full aspect-[4/3] max-w-lg ml-auto">

                {/* Background layer — ESG report page */}
                <div
                  className="absolute top-0 right-0 w-[70%] h-[80%] bg-[#FCFAF5] border border-[#D6D3C8] rounded-sm shadow-sm"
                  aria-hidden="true"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-[#3E7D4F]" />
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#718875]">
                        ESG Report
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      <div className="h-2 bg-[#D6D3C8]/60 rounded-full w-full" />
                      <div className="h-2 bg-[#D6D3C8]/60 rounded-full w-4/5" />
                      <div className="h-2 bg-[#D6D3C8]/60 rounded-full w-full" />
                      <div className="h-2 bg-[#D6D3C8]/60 rounded-full w-3/5" />
                      <div className="h-8" />
                      <div className="h-2 bg-[#D6D3C8]/60 rounded-full w-full" />
                      <div className="h-2 bg-[#D6D3C8]/60 rounded-full w-2/3" />
                    </div>
                    <div className="flex items-center gap-1.5 mt-5">
                      <div className="w-5 h-5 rounded bg-[#3E7D4F]/15 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-[#3E7D4F]">FSC</span>
                      </div>
                      <div className="w-5 h-5 rounded bg-[#C9A227]/15 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-[#C9A227]">ISO</span>
                      </div>
                      <div className="w-5 h-5 rounded bg-[#315C45]/15 flex items-center justify-center">
                        <span className="text-[7px] font-bold text-[#315C45]">GRS</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle layer — certification document */}
                <div
                  className="absolute top-[15%] left-[5%] w-[55%] h-[55%] bg-white border border-[#D6D3C8] rounded-sm shadow-md"
                  aria-hidden="true"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-[#718875]">
                        Certification
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3E7D4F]" />
                        <span className="text-[7px] font-mono text-[#3E7D4F]">Active</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#315C45]/10 rounded-full w-full mb-2" />
                    <div className="h-1.5 bg-[#315C45]/10 rounded-full w-3/4 mb-3" />
                    <div className="flex items-center gap-2 p-2 bg-[#F7F5F0] rounded border border-[#D6D3C8]/50">
                      <ShieldCheck size={14} className="text-[#3E7D4F] shrink-0" />
                      <div>
                        <div className="h-1 bg-[#D6D3C8] rounded-full w-16 mb-1" />
                        <div className="h-1 bg-[#D6D3C8] rounded-full w-10" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Foreground layer — verification verdict stamp */}
                <div
                  className="absolute bottom-[8%] right-[10%] bg-[#1B3A2B] text-[#F7F5F0] rounded-lg p-4 shadow-xl max-w-[200px]"
                  aria-hidden="true"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Scale size={14} className="text-[#A9BBA0]" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#A9BBA0]">
                      Verdict
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#3E7D4F] animate-pulse" />
                    <span className="text-sm font-serif font-semibold text-[#F7F5F0]">
                      Verified
                    </span>
                  </div>
                  <div className="h-[1px] bg-[#315C45] mb-2" />
                  <div className="text-[9px] font-mono text-[#F7F5F0]/60 leading-relaxed">
                    3 independent sources analyzed
                  </div>
                </div>

                {/* Floating evidence snippet */}
                <div
                  className="absolute bottom-[30%] left-0 bg-white border border-[#D6D3C8] rounded-lg px-3 py-2 shadow-sm"
                  aria-hidden="true"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={12} className="text-[#718875]" />
                    <div className="h-1 bg-[#D6D3C8] rounded-full w-14" />
                  </div>
                </div>

                {/* Floating scan indicator */}
                <div
                  className="absolute top-[5%] right-[25%] bg-white border border-[#D6D3C8] rounded-lg px-3 py-2 shadow-sm"
                  aria-hidden="true"
                >
                  <div className="flex items-center gap-2">
                    <QrCode size={12} className="text-[#718875]" />
                    <div className="h-1 bg-[#D6D3C8] rounded-full w-10" />
                  </div>
                </div>

                {/* Decorative rule line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D6D3C8] to-transparent"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
