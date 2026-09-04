'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, FileText, Search, BookOpen, ShieldCheck, Eye, QrCode } from 'lucide-react';
import { useTranslation } from '@/lib/i18n-context';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#F7F5F0] pt-28 pb-16 lg:pt-32 lg:pb-20 border-b border-[#D6D3C8]/70"
      aria-label="Hero section"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          {/* Left Column: Asymmetric Editorial Typography */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-[#315C45]">
                Independent Verification Infrastructure
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-serif text-[#1C1C1C] mb-6 tracking-tight text-balance"
              style={{
                fontSize: 'clamp(2.75rem, 5.4vw, 4.4rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.025em',
              }}
            >
              Green Claims
              <br />
              Are Everywhere.
              <br />
              <span className="text-[#315C45]">
                Proof Is Harder to
                <br />
                Find.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-[#1C1C1C]/75 text-base sm:text-[17px] leading-relaxed max-w-xl mb-9 font-normal">
              GreenLedger evaluates environmental claims using scientific evidence, independent audits, and transparent standards — so you can separate real impact from greenwashing.
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
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-10 pt-7 border-t border-[#D6D3C8]/60 text-xs font-mono text-[#718875]">
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

          {/* Right Column: Environmental Claim Audit Scene */}
          <div className="lg:col-span-7 xl:col-span-7">
            <div className="relative mx-auto max-w-2xl lg:max-w-none">
              {/* Main Visual Frame */}
              <div className="relative bg-[#FCFAF5] p-2.5 sm:p-3.5 rounded-xl border border-[#D6D3C8] shadow-[0_12px_44px_rgba(27,58,43,0.06)] overflow-hidden">
                <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-[#EFECE4]">
                  <Image
                    src="/audit-hero.jpg"
                    alt="Environmental claim audit desk with product package under review, magnifying glass, verification process document, and evidence QR code"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />

                  {/* Overlay 1: Tag on Box — Claim Under Review */}
                  <div className="absolute top-[32%] left-[41%] hidden sm:block bg-[#DFC8AD]/95 backdrop-blur-xs text-[#2F2116] border border-[#BAA185] rounded-xs p-2.5 shadow-md font-mono text-[9px] w-36 rotate-[-1.5deg] pointer-events-none">
                    <span className="font-bold block uppercase tracking-wider text-[8.5px] text-[#1E140C] border-b border-[#BAA185]/70 pb-1 mb-1">
                      Claim Under Review
                    </span>
                    <span className="text-[9.5px] leading-tight block font-medium">
                      &ldquo;Made with 40% recycled material&rdquo;
                    </span>
                    <span className="text-[7.5px] text-[#503824] block mt-1 pt-1 border-t border-[#BAA185]/50 uppercase tracking-wide">
                      Evidence Matters. Not Opinions.
                    </span>
                  </div>

                  {/* Overlay 2: Verification Process Document (Right) */}
                  <div className="absolute top-[8%] right-[3%] hidden sm:block bg-[#FAF8F5]/96 backdrop-blur-xs border border-[#D6D3C8] rounded-xs p-3.5 shadow-md w-44 pointer-events-none">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#718875] font-bold block mb-2 pb-1 border-b border-[#D6D3C8]">
                      Verification Process
                    </span>
                    <div className="space-y-1.5 text-[10.5px] text-[#1C1C1C]">
                      <div className="flex items-center gap-1.5">
                        <FileText size={11} className="text-[#315C45] shrink-0" />
                        <span><strong className="font-mono text-[9.5px]">1</strong> Claim Submitted</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Search size={11} className="text-[#315C45] shrink-0" />
                        <span><strong className="font-mono text-[9.5px]">2</strong> Evidence Collected</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={11} className="text-[#315C45] shrink-0" />
                        <span><strong className="font-mono text-[9.5px]">3</strong> Standards Check</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck size={11} className="text-[#315C45] shrink-0" />
                        <span><strong className="font-mono text-[9.5px]">4</strong> Verification</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Eye size={11} className="text-[#315C45] shrink-0" />
                        <span><strong className="font-mono text-[9.5px]">5</strong> Public Record</span>
                      </div>
                    </div>
                  </div>

                  {/* Overlay 3: Sources & Evidence with QR Code (Bottom Right) */}
                  <div className="absolute bottom-[6%] right-[3%] hidden sm:flex items-center gap-2.5 bg-[#FAF8F5]/96 backdrop-blur-xs border border-[#D6D3C8] rounded-xs p-2.5 shadow-md pointer-events-none">
                    <div>
                      <span className="text-[8.5px] font-mono uppercase tracking-widest text-[#718875] font-bold block mb-1">
                        Sources &amp; Evidence
                      </span>
                      <ul className="text-[9.5px] text-[#1C1C1C]/85 space-y-0.5 font-sans leading-tight">
                        <li>• Scientific Studies</li>
                        <li>• Certifications</li>
                        <li>• Government Databases</li>
                        <li>• Industry Reports</li>
                        <li>• Field Data</li>
                      </ul>
                    </div>
                    <div className="w-13 h-13 bg-white border border-[#D6D3C8] p-1 rounded-xs shrink-0 flex items-center justify-center">
                      <QrCode size={42} className="text-[#1B3A2B]" />
                    </div>
                  </div>

                  {/* Audit Badge */}
                  <div className="absolute top-3 left-3 bg-[#FCFAF5]/90 backdrop-blur-md px-2.5 py-1 rounded border border-[#D6D3C8]/80 text-[9.5px] font-mono uppercase tracking-[0.16em] text-[#1B3A2B]">
                    Audit Dossier · In Progress
                  </div>
                </div>

                {/* Editorial caption strip */}
                <div className="mt-3 px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-[#718875]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                    <span>Target Claim: &ldquo;Made with 40% recycled material&rdquo;</span>
                  </div>
                  <span className="text-[#315C45] font-semibold">Status: Under Review (ISO 14021 Check)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


