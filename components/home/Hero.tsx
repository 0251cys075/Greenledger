'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import { useTranslation } from '@/lib/i18n-context';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#F7F5F0] pt-28 pb-20 lg:pt-32 lg:pb-24 border-b border-[#D6D3C8]/70"
      aria-label="Hero section"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Asymmetric Editorial Typography */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
            {/* Small Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-[#315C45]">
                {t('hero.badge', 'Evidence. Transparency. Real Impact.')}
              </span>
            </div>

            {/* Large Serif Headline */}
            <h1
              className="font-serif text-[#1C1C1C] mb-6 tracking-tight text-balance"
              style={{
                fontSize: 'clamp(2.65rem, 5.2vw, 4.25rem)',
                lineHeight: 1.06,
                letterSpacing: '-0.025em',
              }}
            >
              Green Claims Are Everywhere.
              <br />
              <em className="not-italic text-[#315C45]">
                Proof Is Harder to Find.
              </em>
            </h1>

            {/* Concise Editorial Narrative */}
            <p className="text-[#1C1C1C]/75 text-base sm:text-lg leading-relaxed max-w-xl mb-10 font-normal">
              {t(
                'hero.subtitle',
                'GreenLedger connects environmental claims to evidence, standards and transparent verification — helping consumers and businesses understand what actually stands behind a green claim.'
              )}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/verify"
                className="group inline-flex items-center justify-center gap-2.5 bg-[#1B3A2B] text-[#F7F5F0] hover:bg-[#315C45] px-8 py-3.5 rounded-md text-[14px] font-medium tracking-wide transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
              >
                <span>{t('hero.verifyCta', 'Verify a Claim')}</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 bg-[#FCFAF5] border border-[#D6D3C8] text-[#1B3A2B] hover:bg-[#EFECE4] px-7 py-3.5 rounded-md text-[14px] font-medium tracking-wide transition-all"
              >
                <span>{t('hero.exploreCta', 'Explore the Ledger')}</span>
              </Link>
            </div>

            {/* Subtle Editorial Trust Footnote */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-12 pt-8 border-t border-[#D6D3C8]/60 text-xs font-mono text-[#718875]">
              <span className="inline-flex items-center gap-1.5">
                <Check size={13} className="text-[#315C45]" strokeWidth={2.2} />
                Open Standards Alignment
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={13} className="text-[#315C45]" strokeWidth={2.2} />
                Full Source Traceability
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={13} className="text-[#315C45]" strokeWidth={2.2} />
                Multilingual Audit Engine
              </span>
            </div>
          </div>

          {/* Right Column: High-End Editorial Environmental Photograph */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Museum-grade matte frame */}
              <div className="relative bg-[#FCFAF5] p-3 sm:p-4 rounded-xl border border-[#D6D3C8] shadow-[0_12px_40px_rgba(27,58,43,0.06)] overflow-hidden">
                <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#EFECE4]">
                  <Image
                    src="/editorial-hero.jpg"
                    alt="Sustainable certified packaging audit and physical traceability sample"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  />
                  {/* Subtle vignette / natural lighting accent */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/25 via-transparent to-transparent pointer-events-none" />

                  {/* Corner audit label */}
                  <div className="absolute top-3 right-3 bg-[#FCFAF5]/90 backdrop-blur-md px-2.5 py-1 rounded border border-[#D6D3C8]/80 text-[10px] font-mono uppercase tracking-[0.16em] text-[#1B3A2B]">
                    Plate 01 · Physical Audit
                  </div>
                </div>

                {/* Editorial caption strip below photograph */}
                <div className="mt-3.5 px-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-[#718875]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#315C45]" />
                    <span>Certified Recycled Packaging &amp; Origin Traceability</span>
                  </div>
                  <span className="text-[#315C45] font-semibold">ISO 14021 · FSC Registered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

