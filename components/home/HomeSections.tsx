'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Eye,
  AlertTriangle,
  CheckCircle2,
  FileText,
  BarChart3,
  ChevronRight,
  Cpu,
  FileCheck2,
  Layers,
  Sparkles,
  Search,
  ScanLine,
  Building2,
  QrCode,
  Lock,
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  COMMUNITY_LEDGER,
  EXPLORE_PRODUCTS,
  getResultIdForStatus,
} from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

// =====================================================================
// 1. Trust Information Strip (Immediately below hero)
// Refined, thin horizontal editorial strip with 4 key tenets
// =====================================================================
export function ValueStrip() {
  const items = [
    {
      icon: ShieldCheck,
      label: 'Evidence, Not Opinions',
      desc: 'Every verdict links directly to verifiable source documentation',
    },
    {
      icon: Eye,
      label: 'Transparent Process',
      desc: 'Open methodology, reproducible scores, zero black-box verdicts',
    },
    {
      icon: FileText,
      label: 'Traceable Results',
      desc: 'Immutable audit records published openly for consumers and industry',
    },
    {
      icon: BarChart3,
      label: 'Better Decisions',
      desc: 'Objective standards to distinguish genuine impact from marketing',
    },
  ];

  return (
    <section
      className="bg-[#FCFAF5] border-b border-[#D6D3C8]/70 py-7"
      aria-label="Core principles"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#D6D3C8]/50">
          {items.map((item, idx) => (
            <div
              key={item.label}
              className={`flex items-start gap-3.5 ${idx > 0 ? 'sm:pl-6 pt-4 sm:pt-0' : ''}`}
            >
              <div className="w-8 h-8 rounded bg-[#EFECE4] border border-[#D6D3C8] flex items-center justify-center shrink-0 mt-0.5">
                <item.icon size={16} className="text-[#1B3A2B]" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-[13px] font-semibold text-[#1C1C1C] tracking-tight">
                  {item.label}
                </h2>
                <p className="text-[12px] text-[#718875] leading-relaxed mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// 2. Trust Problem Section: Investigative Claims Dossier
// "Not every green claim tells the whole story."
// =====================================================================
export function ProblemSection() {
  const claims = [
    { text: '100% Eco-Friendly', annotation: 'Vague criterion · No scientific definition in ISO 14021', level: 'high' },
    { text: 'Carbon Neutral', annotation: 'Unverified offset · Scope 1–3 boundaries unmeasured', level: 'mid' },
    { text: 'Fully Sustainable', annotation: 'Broad marketing · Lacks life-cycle assessment proof', level: 'high' },
    { text: '100% Recyclable', annotation: 'Facility dependent · Municipal infrastructure not cited', level: 'mid' },
    { text: 'Biodegradable', annotation: 'No standard cited · Disintegration timeline unspecified', level: 'high' },
    { text: 'Zero Waste', annotation: 'Scope unmeasured · Factory supply chain excluded', level: 'mid' },
  ];

  return (
    <section
      className="py-24 lg:py-32 px-6 lg:px-8 bg-[#F7F5F0] border-b border-[#D6D3C8]/70"
      aria-label="The greenwashing problem"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Editorial Narrative */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[#315C45]">
                The Trust Problem
              </span>
            </div>
            <h2
              className="font-serif text-[#1C1C1C] mb-6 tracking-tight text-balance"
              style={{ fontSize: 'clamp(2.1rem, 4vw, 3.25rem)', lineHeight: 1.1 }}
            >
              Not every green claim
              <br />
              <em className="not-italic text-[#315C45]">tells the whole story.</em>
            </h2>
            <p className="text-[#1C1C1C]/75 text-base leading-relaxed mb-5 font-normal">
              Every day, thousands of consumer goods hit shelves with sweeping environmental pledges.
              Without independent, standardized verification, shoppers and ESG compliance teams are left
              to decipher marketing jargon on faith alone.
            </p>
            <p className="text-[#718875] text-[13.5px] leading-relaxed">
              GreenLedger conducts rigorous investigations: matching on-pack text against international
              disclosure frameworks, third-party laboratory records, and recognized certification registries.
            </p>
          </div>

          {/* Right: Investigative Annotation Grid */}
          <div className="lg:col-span-7">
            <div className="bg-[#FCFAF5] border border-[#D6D3C8] rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#EFECE4]/60 border-b border-[#D6D3C8] text-[11px] font-mono text-[#718875]">
                <span>Dossier: Common Vague Environmental Marketing</span>
                <span className="uppercase tracking-wider text-[#315C45] font-semibold">6 Case Studies</span>
              </div>
              <div className="divide-y divide-[#D6D3C8]/60">
                {claims.map((claim) => (
                  <div
                    key={claim.text}
                    className="p-5 sm:p-6 hover:bg-[#EFECE4]/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-serif text-[18px] text-[#1C1C1C] tracking-tight block mb-1">
                        &ldquo;{claim.text}&rdquo;
                      </span>
                      <p className="text-[12px] font-mono text-[#718875]">
                        {claim.annotation}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5 self-start sm:self-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-medium ${
                          claim.level === 'high'
                            ? 'bg-[#C1443E]/10 text-[#C1443E] border border-[#C1443E]/20'
                            : 'bg-[#C9A227]/10 text-[#8A6A1E] border border-[#C9A227]/25'
                        }`}
                      >
                        <AlertTriangle size={11} />
                        {claim.level === 'high' ? 'High Risk' : 'Ambiguous'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// 3. Methodology Section: 5-Step Editorial Process
// 01 Claim -> 02 Evidence -> 03 Standards -> 04 Verification -> 05 Public Record
// =====================================================================
export function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Claim Extraction',
      text: 'A product environmental claim is submitted via text, barcode, photo OCR, or voice.',
      icon: FileText,
    },
    {
      number: '02',
      title: 'Evidence Gathering',
      text: 'Independent lab test reports, supply chain audits, and certificates are cataloged.',
      icon: Search,
    },
    {
      number: '03',
      title: 'Standards Benchmark',
      text: 'Claims are evaluated against ISO 14021, FSC, GRS, and EU Green Claims frameworks.',
      icon: BookOpen,
    },
    {
      number: '04',
      title: 'Verification Engine',
      text: 'Deterministic scoring engine calculates evidence strength and issues a clear verdict.',
      icon: ShieldCheck,
    },
    {
      number: '05',
      title: 'Public Audit Record',
      text: 'The immutable result is registered with a unique Audit ID and public QR code.',
      icon: Eye,
    },
  ];

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-[#FCFAF5] border-b border-[#D6D3C8]/70" aria-label="How GreenLedger works">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[#315C45]">
              Methodology
            </span>
          </div>
          <h2
            className="font-serif text-[#1C1C1C] tracking-tight"
            style={{ fontSize: 'clamp(2.1rem, 4vw, 3.25rem)', lineHeight: 1.1 }}
          >
            From raw claim
            <em className="not-italic text-[#315C45]"> to verified public record.</em>
          </h2>
          <p className="text-[#1C1C1C]/75 text-base sm:text-lg leading-relaxed mt-4 font-normal">
            A transparent, five-stage audit sequence ensuring every claim is anchored to verifiable scientific reality.
          </p>
        </div>

        {/* Linear editorial process strip */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 lg:gap-8 pt-4 border-t border-[#D6D3C8]">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col justify-between pt-4">
              <div>
                <span className="font-serif text-[38px] text-[#315C45]/80 font-normal leading-none block mb-3">
                  {step.number}
                </span>
                <h3 className="font-serif text-[18px] text-[#1C1C1C] mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-[12.5px] text-[#718875] leading-relaxed">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// 4. Core USP Section: AI ASSISTS vs VERIFICATION REQUIRES
// "AI helps us understand the claim. Evidence determines what can be verified."
// =====================================================================
export function EvidenceSection() {
  const aiItems = [
    { title: 'Optical Character Recognition (OCR)', desc: 'Extracts claims directly from packaging photos' },
    { title: 'Claim Segmentation & Classification', desc: 'Identifies specific category, scope, and metric type' },
    { title: 'Multilingual Processing', desc: 'Parses claims across 8 languages including Indian vernaculars' },
    { title: 'Plain-Language Summaries', desc: 'Demystifies corporate disclosures into clear explanations' },
  ];

  const verificationItems = [
    { title: 'Third-Party Laboratory Records', desc: 'Testing documentation, chemical assays, LCAs' },
    { title: 'Certified Authority Registries', desc: 'Cross-checks with FSC, ISO, GRS, and national databases' },
    { title: 'Deterministic Rules Engine', desc: 'Zero hallucinated verdicts; scores rely solely on proven data' },
    { title: 'Immutable Public Ledger', desc: 'Permanent audit record that cannot be bought or overwritten' },
  ];

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-[#F7F5F0] border-b border-[#D6D3C8]/70" aria-label="AI and Verification Architecture">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[#315C45]">
              Core Architecture
            </span>
            <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
          </div>
          <h2
            className="font-serif text-[#1C1C1C] tracking-tight text-balance"
            style={{ fontSize: 'clamp(2.1rem, 4vw, 3.25rem)', lineHeight: 1.12 }}
          >
            AI helps us understand the claim.
            <br />
            <em className="not-italic text-[#315C45]">
              Evidence determines what can be verified.
            </em>
          </h2>
          <p className="text-[#1C1C1C]/75 text-base sm:text-lg leading-relaxed mt-4 font-normal">
            We clearly separate intelligent claim ingestion from rigorous evidentiary auditing.
            AI accelerates understanding; only verified evidence decides the verdict.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI ASSISTS Column */}
          <div className="bg-[#FCFAF5] border border-[#D6D3C8] rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-5 border-b border-[#D6D3C8] mb-6">
              <div className="w-9 h-9 rounded bg-[#EFECE4] flex items-center justify-center text-[#315C45]">
                <Cpu size={18} strokeWidth={1.75} />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#718875] block">
                  Ingestion &amp; Understanding
                </span>
                <h3 className="font-serif text-[20px] text-[#1C1C1C]">AI Assists</h3>
              </div>
            </div>

            <div className="space-y-4">
              {aiItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#EFECE4] text-[11px] font-mono font-semibold text-[#315C45] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#1C1C1C]">{item.title}</h4>
                    <p className="text-[12.5px] text-[#718875] leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VERIFICATION REQUIRES Column */}
          <div className="bg-[#FCFAF5] border border-[#D6D3C8] rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-5 border-b border-[#D6D3C8] mb-6">
              <div className="w-9 h-9 rounded bg-[#1B3A2B] flex items-center justify-center text-[#A9BBA0]">
                <FileCheck2 size={18} strokeWidth={1.75} />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#315C45] block font-semibold">
                  Auditing &amp; Integrity
                </span>
                <h3 className="font-serif text-[20px] text-[#1C1C1C]">Verification Requires</h3>
              </div>
            </div>

            <div className="space-y-4">
              {verificationItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-[#315C45] shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#1C1C1C]">{item.title}</h4>
                    <p className="text-[12.5px] text-[#718875] leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// 5. Verification Result: Official Audit Report Format
// =====================================================================
export function SampleClaimSection() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-[#FCFAF5] border-b border-[#D6D3C8]/70" aria-label="Sample Verification Record">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[#315C45]">
              Sample Record
            </span>
            <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
          </div>
          <h2
            className="font-serif text-[#1C1C1C] tracking-tight"
            style={{ fontSize: 'clamp(2.1rem, 4vw, 3.25rem)', lineHeight: 1.1 }}
          >
            An official audit record.
          </h2>
          <p className="text-[#718875] text-base mt-3 font-normal">
            Every verification produces a structured, public certification certificate backed by primary evidence.
          </p>
        </div>

        {/* Audit Report Document Style */}
        <div className="max-w-3xl mx-auto bg-white border border-[#D6D3C8] rounded-xl shadow-[0_4px_24px_rgba(27,58,43,0.04)] overflow-hidden">
          {/* Official Audit Header */}
          <div className="bg-[#1B3A2B] text-[#F7F5F0] px-7 py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="text-[#A9BBA0]" size={18} />
              <span className="text-[12px] font-mono uppercase tracking-[0.2em] text-[#A9BBA0]">
                GreenLedger Verification Certificate
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#F7F5F0]/70">
              Audit ID: GL-ECO-8291
            </span>
          </div>

          <div className="p-7 sm:p-9 space-y-7">
            {/* Target Claim & Product */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#718875]">
                  Target Environmental Claim
                </span>
                <span className="text-[11px] font-mono text-[#315C45] font-semibold">
                  Product: EcoBottle Classic 750ml
                </span>
              </div>
              <blockquote className="font-serif text-2xl sm:text-[26px] text-[#1C1C1C] tracking-tight leading-snug">
                &ldquo;Made with 80% post-consumer recycled plastic.&rdquo;
              </blockquote>
            </div>

            {/* Evidence Strength Bar */}
            <div className="pt-5 border-t border-[#D6D3C8]/60">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-[#718875] uppercase tracking-wider text-[11px]">Evidence Strength Score</span>
                <span className="font-bold text-[#1B3A2B]">Strong · 88 / 100</span>
              </div>
              <div className="h-2 rounded-full bg-[#EFECE4] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#3E7D4F] transition-all duration-1000"
                  style={{ width: '88%' }}
                />
              </div>
            </div>

            {/* Structured Audit Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-[#D6D3C8]/60">
              <div className="bg-[#F7F5F0] p-4 rounded-lg border border-[#D6D3C8]/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#718875] block mb-1">
                  Sources Analyzed
                </span>
                <span className="text-sm font-semibold text-[#1C1C1C] block">
                  3 Independent Audits
                </span>
                <span className="text-[11px] text-[#718875] font-mono mt-0.5 block">
                  Lab assay, GRS, LCA
                </span>
              </div>

              <div className="bg-[#F7F5F0] p-4 rounded-lg border border-[#D6D3C8]/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#718875] block mb-1">
                  Standards Applied
                </span>
                <span className="text-sm font-semibold text-[#1C1C1C] block">
                  ISO 14021 · GRS 4.0
                </span>
                <span className="text-[11px] text-[#718875] font-mono mt-0.5 block">
                  EU Green Claims Directive
                </span>
              </div>

              <div className="bg-[#F7F5F0] p-4 rounded-lg border border-[#D6D3C8]/60">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#718875] block mb-1">
                  Official Verdict
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#3E7D4F]">
                  <CheckCircle2 size={15} />
                  VERIFIED
                </span>
                <span className="text-[11px] text-[#718875] font-mono mt-0.5 block">
                  Valid until Dec 2026
                </span>
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#D6D3C8]/60">
              <span className="text-[11px] font-mono text-[#718875]">
                Publicly verifiable via QR code on product packaging
              </span>
              <Link
                href="/business/records/GL-ECO-8291"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B3A2B] hover:text-[#315C45] transition-colors"
              >
                Inspect Full Public Record
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// 6. Metrics Section: Platform Scale & Scrutiny
// =====================================================================
export function MetricsSection() {
  const metrics = [
    { label: 'Claims Analyzed', value: '12,847', desc: 'Cross-referenced with registries' },
    { label: 'Evidence Sources', value: '340+', desc: 'Certifications, lab tests & databases' },
    { label: 'Verification Accuracy', value: '94%', desc: 'Audited against ISO frameworks' },
    { label: 'Languages Supported', value: '8', desc: 'Indian vernacular & global tongues' },
  ];

  return (
    <section className="py-20 px-6 lg:px-8 bg-[#F7F5F0] border-b border-[#D6D3C8]/70" aria-label="Platform metrics">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-[#FCFAF5] p-6 lg:p-8 rounded-xl border border-[#D6D3C8] text-center shadow-sm"
            >
              <span className="font-serif text-[34px] lg:text-[42px] text-[#1B3A2B] block tracking-tight mb-1">
                {m.value}
              </span>
              <h3 className="text-[12px] font-mono font-bold text-[#1C1C1C] uppercase tracking-wider mb-1">
                {m.label}
              </h3>
              <p className="text-[11px] text-[#718875] font-mono">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// 7. Explore Products Showcase: "Every verified claim leaves a trace."
// =====================================================================
export function ExploreLedgerSection() {
  const featured = EXPLORE_PRODUCTS.slice(0, 3);

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-[#FCFAF5] border-b border-[#D6D3C8]/70" aria-label="Explore verified products">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[#315C45]">
                Verified Showcase
              </span>
            </div>
            <h2
              className="font-serif text-[#1C1C1C] tracking-tight"
              style={{ fontSize: 'clamp(2.1rem, 4vw, 3.25rem)', lineHeight: 1.1 }}
            >
              Every verified claim
              <em className="not-italic text-[#315C45]"> leaves a trace.</em>
            </h2>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 bg-[#EFECE4] border border-[#D6D3C8] text-[#1B3A2B] hover:bg-[#D6D3C8]/60 px-5 py-2.5 rounded-md text-sm font-medium tracking-wide transition-colors"
          >
            Explore all products
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((p) => (
            <Link
              key={p.id}
              href={`/result/${p.result_id}`}
              className="bg-[#F7F5F0] p-6 rounded-xl border border-[#D6D3C8] hover:border-[#315C45]/50 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono text-[#718875] uppercase tracking-wider">
                    {p.category}
                  </span>
                  <StatusBadge status={p.status} size="sm" />
                </div>
                <h3 className="font-serif text-[19px] text-[#1C1C1C] mb-2 tracking-tight group-hover:text-[#315C45] transition-colors">
                  {p.product_name}
                </h3>
                <p className="text-[13px] text-[#718875] leading-relaxed mb-6 line-clamp-2">
                  &ldquo;{p.claim_text}&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-[#D6D3C8]/60 flex items-center justify-between text-xs font-mono text-[#1B3A2B] font-semibold">
                <span>View evidence dossier</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// 8. Business Section: B2B2C Verification Architecture
// "Make sustainability claims easier to trust."
// =====================================================================
export function ESGSection() {
  const lifecycleSteps = [
    { label: 'Business', sub: 'Brands & Producers' },
    { label: 'Product', sub: 'Catalog Entry' },
    { label: 'Claim', sub: 'Environmental Statement' },
    { label: 'Evidence', sub: 'Certificates & Assays' },
    { label: 'Verification', sub: 'Deterministic Audit' },
    { label: 'Public Record', sub: 'Immutable Certificate' },
    { label: 'QR On-Pack', sub: 'Physical Label' },
    { label: 'Consumer', sub: 'Instant Transparency' },
  ];

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-[#1B3A2B] text-[#F7F5F0]" aria-label="For Business & B2B2C">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#A9BBA0]" aria-hidden="true" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-[#A9BBA0]">
              Business Infrastructure &amp; B2B2C
            </span>
          </div>
          <h2
            className="font-serif text-[#F7F5F0] tracking-tight"
            style={{ fontSize: 'clamp(2.1rem, 4vw, 3.25rem)', lineHeight: 1.1 }}
          >
            Make sustainability claims
            <br />
            <em className="not-italic text-[#A9BBA0]">easier to trust.</em>
          </h2>
          <p className="text-[#F7F5F0]/80 text-base sm:text-lg leading-relaxed mt-4 font-normal">
            GreenLedger equips manufacturers, brands, and ESG teams with institutional verification infrastructure.
            Submit claims, attach evidence, manage certifications, and provide consumers with physical QR transparency.
          </p>
        </div>

        {/* B2B2C Lifecycle Flow */}
        <div className="bg-[#122619] border border-[#315C45]/70 rounded-xl p-6 lg:p-8 mb-10 shadow-lg">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#A9BBA0] block mb-6">
            End-to-End B2B2C Verification Lifecycle
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
            {lifecycleSteps.map((s, idx) => (
              <div key={s.label} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#1B3A2B] border border-[#A9BBA0]/40 flex items-center justify-center text-xs font-mono font-bold text-[#A9BBA0] mb-2">
                  0{idx + 1}
                </div>
                <span className="text-[13px] font-semibold text-[#F7F5F0] leading-tight block">
                  {s.label}
                </span>
                <span className="text-[11px] text-[#A9BBA0]/75 font-mono mt-0.5 block">
                  {s.sub}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ethical Verification Callout & Actions */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pt-6 border-t border-[#315C45]/60">
          <div className="max-w-2xl flex items-start gap-3">
            <Lock size={18} className="text-[#A9BBA0] shrink-0 mt-1" />
            <p className="text-sm text-[#F7F5F0]/80 leading-relaxed">
              <strong className="text-white font-semibold">Integrity Principle:</strong> Businesses pay for verification infrastructure, compliance workflows, and API tooling — <em>never for a favorable verdict</em>. If evidence is lacking, GreenLedger marks the claim Insufficient or Greenwashing regardless of sponsor.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href="/business"
              className="inline-flex items-center gap-2 bg-[#A9BBA0] text-[#1B3A2B] hover:bg-white px-7 py-3 rounded-md text-sm font-semibold tracking-wide transition-colors"
            >
              <Building2 size={16} />
              Open Business Portal
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-[#A9BBA0]/30 text-[#F7F5F0] hover:bg-[#315C45]/50 px-6 py-3 rounded-md text-sm font-medium tracking-wide transition-colors"
            >
              Methodology Standards
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// 9. Community Ledger: Public Record Activity
// =====================================================================
export function CommunityLedgerSection() {
  const entries = COMMUNITY_LEDGER.slice(0, 5);

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-[#F7F5F0] border-b border-[#D6D3C8]/70" aria-label="Community ledger activity">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[#315C45]">
                Public Ledger
              </span>
            </div>
            <h2
              className="font-serif text-[#1C1C1C] tracking-tight"
              style={{ fontSize: 'clamp(2.1rem, 4vw, 3.25rem)', lineHeight: 1.1 }}
            >
              Community ledger.
            </h2>
          </div>
          <Link
            href="/ledger"
            className="inline-flex items-center gap-2 bg-[#FCFAF5] border border-[#D6D3C8] text-[#1B3A2B] hover:bg-[#EFECE4] px-5 py-2.5 rounded-md text-sm font-medium tracking-wide transition-colors"
          >
            Inspect full public ledger
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Clean Editorial Table */}
        <div className="bg-[#FCFAF5] border border-[#D6D3C8] rounded-xl overflow-hidden shadow-sm">
          <div className="hidden sm:grid grid-cols-12 px-6 py-3.5 bg-[#EFECE4]/60 border-b border-[#D6D3C8] text-[11px] font-mono uppercase tracking-wider text-[#718875]">
            <span className="col-span-5">Product &amp; Claim</span>
            <span className="col-span-3">Brand &amp; Category</span>
            <span className="col-span-2">Date Verified</span>
            <span className="col-span-2 text-right">Verdict</span>
          </div>

          <div className="divide-y divide-[#D6D3C8]/60">
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={`/result/${getResultIdForStatus(entry.status)}`}
                className="grid grid-cols-1 sm:grid-cols-12 px-6 py-4.5 hover:bg-[#EFECE4]/30 transition-colors items-center group gap-2 sm:gap-0"
              >
                <div className="col-span-5 pr-4">
                  <p className="text-[14px] text-[#1C1C1C] font-medium group-hover:text-[#315C45] transition-colors">
                    {entry.claim_text}
                  </p>
                </div>
                <div className="col-span-3 text-[12px] font-mono text-[#718875]">
                  {entry.brand} · {entry.category}
                </div>
                <div className="col-span-2 text-[12px] font-mono text-[#718875]">
                  {formatDate(entry.verified_at)}
                </div>
                <div className="col-span-2 flex items-center justify-start sm:justify-end gap-2">
                  <StatusBadge status={entry.status} size="sm" />
                  <ChevronRight size={14} className="text-[#A9BBA0] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// 10. CTA Section: Editorial Closing Statement
// =====================================================================
export function CTASection() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-[#122619] text-[#F7F5F0]" aria-label="Get started with GreenLedger">
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className="font-serif text-[#F7F5F0] tracking-tight text-balance mb-6"
          style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)', lineHeight: 1.08 }}
        >
          From Unchecked Marketing
          <br />
          <em className="not-italic text-[#A9BBA0]">to Verified Proof.</em>
        </h2>
        <p className="text-[#F7F5F0]/75 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10 font-normal">
          Whether you are a conscious consumer investigating a label or a business standardizing proof,
          GreenLedger provides the tools to build verifiable trust.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/verify"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#A9BBA0] text-[#1B3A2B] hover:bg-white px-8 py-3.5 rounded-md text-sm font-semibold tracking-wide transition-all shadow-sm hover:shadow"
          >
            Verify a Claim Now
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/business"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#A9BBA0]/30 text-[#F7F5F0] hover:bg-[#315C45]/50 px-7 py-3.5 rounded-md text-sm font-medium tracking-wide transition-colors"
          >
            Explore Business Infrastructure
          </Link>
        </div>
      </div>
    </section>
  );
}
