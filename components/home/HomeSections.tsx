'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Search,
  ShieldCheck,
  BookOpen,
  Eye,
  AlertTriangle,
  CheckCircle2,
  FileText,
  BarChart3,
  ChevronRight,
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  COMMUNITY_LEDGER,
  EXPLORE_PRODUCTS,
  getResultIdForStatus,
} from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

// =====================================================================
// Value Proposition Strip (immediately below hero)
// Thin horizontal strip — 4 items with minimal line icons
// =====================================================================
export function ValueStrip() {
  const items = [
    { icon: ShieldCheck, label: 'Evidence, Not Opinions', desc: 'Every verdict links to verifiable sources' },
    { icon: Eye, label: 'Transparent Process', desc: 'Open methodology, reproducible scoring' },
    { icon: FileText, label: 'Traceable Results', desc: 'Full audit trail on every claim' },
    { icon: BarChart3, label: 'Better Decisions', desc: 'Compare claims across products and categories' },
  ];

  return (
    <section
      className="bg-[#EFECE4] border-b border-[#D6D3C8]"
      aria-label="Value propositions"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {items.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <item.icon
                size={18}
                className="text-[#315C45] mt-0.5 shrink-0"
                strokeWidth={1.5}
              />
              <div>
                <span className="text-[13px] font-semibold text-[#1B3A2B] leading-tight block">
                  {item.label}
                </span>
                <span className="text-[11px] text-[#718875] leading-snug block mt-0.5">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Section 1: The Problem (LIGHT PAPER — editorial evidence snippets)
// =====================================================================
export function ProblemSection() {
  const claims = [
    { text: '100% Eco-Friendly', warn: 'Vague criterion', level: 'high' },
    { text: 'Carbon Neutral', warn: 'Unverified offset', level: 'mid' },
    { text: 'Fully Sustainable', warn: 'Broad marketing', level: 'high' },
    { text: '100% Recyclable', warn: 'Facility dependent', level: 'mid' },
    { text: 'Biodegradable', warn: 'No standard cited', level: 'high' },
    { text: 'Zero Waste', warn: 'Scope unmeasured', level: 'mid' },
  ];

  return (
    <section
      className="py-28 px-6 bg-[#F7F5F0] border-b border-[#D6D3C8]/60"
      aria-label="The greenwashing problem"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left: editorial copy */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-[#315C45]">
                The Trust Problem
              </span>
            </div>
            <h2
              className="font-serif text-[#1C1C1C] mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.12, letterSpacing: '-0.02em' }}
            >
              Not every green claim
              <br />
              <em className="not-italic text-[#315C45]">tells the whole story.</em>
            </h2>
            <p className="text-[#1C1C1C]/65 text-base leading-relaxed mb-4">
              Every day, thousands of consumer products carry sweeping environmental promises. But shoppers,
              researchers, and sustainability teams have had no open, standardized way to verify whether those
              claims match real scientific evidence.
            </p>
            <p className="text-[#718875] text-sm leading-relaxed">
              Fragmented certifications, inconsistent disclosure standards, and buried reports make it difficult
              to distinguish credible commitments from performative messaging.
            </p>
          </div>

          {/* Right: editorial evidence snippets */}
          <div className="lg:col-span-7" role="list" aria-label="Common vague claims">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#D6D3C8]/40 border border-[#D6D3C8]/60 rounded-xl overflow-hidden">
              {claims.map((claim) => (
                <div
                  key={claim.text}
                  className="bg-[#FCFAF5] p-5 hover:bg-[#EFECE4]/60 transition-colors"
                  role="listitem"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="font-serif text-[#1C1C1C] text-[15px] leading-snug italic">
                      &ldquo;{claim.text}&rdquo;
                    </span>
                    {claim.level === 'high' ? (
                      <AlertTriangle size={13} className="text-[#C1443E] shrink-0 mt-0.5" strokeWidth={1.5} />
                    ) : (
                      <AlertTriangle size={13} className="text-[#C9A227] shrink-0 mt-0.5" strokeWidth={1.5} />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                      claim.level === 'high'
                        ? 'text-[#C1443E] bg-[#C1443E]/6'
                        : 'text-[#C9A227] bg-[#C9A227]/6'
                    }`}
                  >
                    {claim.warn}
                  </span>
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
// Section 2: How It Works (LIGHT — editorial 5-step process)
// =====================================================================
export function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Claim',
      text: 'A product makes an environmental statement.',
      icon: FileText,
    },
    {
      number: '02',
      title: 'Evidence',
      text: 'Sources, certifications, and audits are gathered.',
      icon: Search,
    },
    {
      number: '03',
      title: 'Standards',
      text: 'Claims are evaluated against ISO, FSC, GRS frameworks.',
      icon: BookOpen,
    },
    {
      number: '04',
      title: 'Verification',
      text: 'Rules engine scores evidence strength and assigns a verdict.',
      icon: ShieldCheck,
    },
    {
      number: '05',
      title: 'Public Record',
      text: 'Results are published on the open community ledger.',
      icon: Eye,
    },
  ];

  return (
    <section className="py-28 px-6 bg-[#FCFAF5] border-b border-[#D6D3C8]/60" aria-label="How GreenLedger works">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-[#315C45]">
              The Method
            </span>
            <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
          </div>
          <h2
            className="font-serif text-[#1C1C1C] mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.12, letterSpacing: '-0.02em' }}
          >
            From claim
            <em className="not-italic text-[#315C45]"> to public record</em>
          </h2>
          <p className="text-[#718875] text-base max-w-xl mx-auto">
            A transparent, reproducible pipeline — every step documented, every source traceable.
          </p>
        </div>

        {/* Horizontal process — editorial */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-[38px] left-[10%] right-[10%] h-[1px] bg-[#D6D3C8]" aria-hidden="true" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center group">
                {/* Step number circle */}
                <div className="relative z-10 w-[76px] h-[76px] mx-auto mb-5 bg-[#F7F5F0] border border-[#D6D3C8] rounded-full flex items-center justify-center group-hover:border-[#A9BBA0] group-hover:bg-white transition-all duration-300">
                  <step.icon size={22} className="text-[#315C45]" strokeWidth={1.5} />
                </div>
                {/* Number label */}
                <span className="text-[10px] font-mono font-bold text-[#A8B3AA] tracking-widest uppercase mb-1.5 block">
                  {step.number}
                </span>
                <h3 className="font-serif text-[18px] text-[#1C1C1C] mb-1.5">
                  {step.title}
                </h3>
                <p className="text-[12px] text-[#718875] leading-relaxed max-w-[180px] mx-auto">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Section 3: Verification in Action (LIGHT — editorial split)
// =====================================================================
export function EvidenceSection() {
  return (
    <section className="py-28 px-6 bg-[#F7F5F0] border-b border-[#D6D3C8]/60" aria-label="Verification in action">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-[#315C45]">
                The Pipeline
              </span>
            </div>
            <h2
              className="font-serif text-[#1C1C1C] mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.12, letterSpacing: '-0.02em' }}
            >
              AI helps us understand the claim.
              <br />
              <em className="not-italic text-[#315C45]">Evidence determines what can be verified.</em>
            </h2>
            <p className="text-[#1C1C1C]/65 text-base sm:text-lg leading-relaxed mb-8">
              Every verification follows a reproducible pipeline. Claims are broken down, analyzed against
              multiple evidence sources, scored for strength, and assigned a clear verdict — all with a
              full audit trail you can inspect.
            </p>
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 btn-secondary text-sm group"
            >
              Try it yourself
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="lg:col-span-6">
            {/* Editorial verification log */}
            <div className="bg-[#FCFAF5] border border-[#D6D3C8] rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[#D6D3C8]/60">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#C1443E]" />
                  <div className="w-2 h-2 rounded-full bg-[#C9A227]" />
                  <div className="w-2 h-2 rounded-full bg-[#3E7D4F]" />
                </div>
                <span className="text-[10px] font-mono text-[#718875] ml-1">verification-pipeline.log</span>
              </div>
              <div className="p-5 space-y-0">
                {[
                  { step: 'Parsing claim text', status: 'done', color: 'green' },
                  { step: 'Matching regulatory frameworks', status: 'done', color: 'green' },
                  { step: 'Cross-referencing evidence sources', status: 'done', color: 'green' },
                  { step: 'Computing evidence strength', status: 'done', color: 'green' },
                  { step: 'Assigning verdict', status: 'done', color: 'amber' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-2.5 border-b border-[#D6D3C8]/30 last:border-0"
                  >
                    <span className="text-[10px] font-mono text-[#A8B3AA] w-5 text-right shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[13px] font-mono text-[#718875] flex-1">
                      {item.step}
                    </span>
                    <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${
                      item.color === 'green' ? 'text-[#3E7D4F]' : 'text-[#C9A227]'
                    }`}>
                      {item.status}
                    </span>
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
// Section 4: Sample Claim Card (LIGHT — audit record style)
// =====================================================================
export function SampleClaimSection() {
  return (
    <section className="py-28 px-6 bg-[#EFECE4] border-b border-[#D6D3C8]" aria-label="Sample claim analysis">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-[#315C45]">
              Sample Audit
            </span>
            <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
          </div>
          <h2
            className="font-serif text-[#1C1C1C] mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.12, letterSpacing: '-0.02em' }}
          >
            See a verdict
            <em className="not-italic text-[#315C45]"> in context</em>
          </h2>
          <p className="text-[#718875] text-base max-w-xl mx-auto">
            This is how a real verification looks. Every claim links to its sources and scoring methodology.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-[#FCFAF5] border border-[#D6D3C8] rounded-xl overflow-hidden">
            {/* Card header — audit record style */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#D6D3C8]">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[#718875]">
                Audit Record
              </span>
              <span className="text-[10px] font-mono text-[#A8B3AA]">
                GL-DEMO-2-2024
              </span>
            </div>

            {/* Claim */}
            <div className="px-6 py-5 border-b border-[#D6D3C8]/40">
              <blockquote className="font-serif text-xl text-[#1C1C1C] italic leading-snug mb-2">
                &ldquo;Manufactured with 100% renewable energy&rdquo;
              </blockquote>
              <p className="text-[11px] text-[#718875] font-mono">
                Category: Packaging &amp; Energy · Manufacturing Process Claim
              </p>
            </div>

            {/* Score bar */}
            <div className="px-6 py-4 border-b border-[#D6D3C8]/40">
              <div className="flex items-center justify-between text-xs font-mono mb-2.5">
                <span className="text-[#718875] uppercase tracking-wider text-[11px]">Evidence Strength</span>
                <span className="font-bold text-[#C9A227]">Weak — 46 / 100</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#EFECE4] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#C9A227]"
                  style={{ width: '46%' }}
                />
              </div>
            </div>

            {/* Verdict + sources */}
            <div className="px-6 py-4 border-b border-[#D6D3C8]/40">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#C9A227]/10 text-[#8A6A1E] border border-[#C9A227]/25">
                  <AlertTriangle size={12} />
                  INSUFFICIENT EVIDENCE
                </span>
                <span className="text-[11px] font-mono text-[#718875]">
                  2 Sources Analyzed
                </span>
              </div>
            </div>

            {/* Footer link */}
            <div className="px-6 py-4 group">
              <Link
                href="/result/demo-2"
                className="inline-flex items-center gap-1.5 text-[12px] font-mono font-semibold text-[#1B3A2B] hover:text-[#315C45]"
              >
                View Full Analysis
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Section 5: Metrics (LIGHT PAPER — minimal editorial stat blocks)
// =====================================================================
export function MetricsSection() {
  const metrics = [
    { label: 'Claims Analyzed', value: 12847, format: true },
    { label: 'Evidence Sources', value: 340, format: true },
    { label: 'Verification Accuracy', value: 94, suffix: '%' },
    { label: 'Languages Supported', value: 8 },
  ];

  return (
    <section className="py-20 px-6 bg-[#F7F5F0] border-b border-[#D6D3C8]/60" aria-label="Platform metrics">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-[#315C45]">
              Scale
            </span>
            <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
          </div>
          <h2
            className="font-serif text-[#1C1C1C]"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', lineHeight: 1.12, letterSpacing: '-0.02em' }}
          >
            Built for
            <em className="not-italic text-[#315C45]"> scrutiny</em>
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#D6D3C8]/40 border border-[#D6D3C8]/50 rounded-xl overflow-hidden">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-[#FCFAF5] p-6 text-center hover:bg-[#EFECE4]/50 transition-colors"
            >
              <span className="font-serif text-[32px] lg:text-[38px] text-[#1B3A2B] block mb-1.5">
                {m.format ? m.value.toLocaleString() : m.value}
                {m.suffix && <span className="text-[18px]">{m.suffix}</span>}
              </span>
              <span className="text-[10px] font-mono text-[#718875] uppercase tracking-[0.14em]">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Section 6: Explore Ledger (LIGHT — editorial product showcase)
// =====================================================================
export function ExploreLedgerSection() {
  const featured = EXPLORE_PRODUCTS.slice(0, 3);

  return (
    <section className="py-28 px-6 bg-[#FCFAF5] border-b border-[#D6D3C8]/60" aria-label="Explore the ledger">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-[#315C45]">
                Public Ledger
              </span>
            </div>
            <h2
              className="font-serif text-[#1C1C1C]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.12, letterSpacing: '-0.02em' }}
            >
              Every verified claim
              <em className="not-italic text-[#315C45]"> leaves a trace.</em>
            </h2>
          </div>
          <Link
            href="/explore"
            className="btn-secondary text-sm group shrink-0"
          >
            View all products
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D6D3C8]/40 border border-[#D6D3C8]/50 rounded-xl overflow-hidden">
          {featured.map((p) => (
            <Link
              key={p.id}
              href={`/result/${p.result_id}`}
              className="bg-[#FCFAF5] p-6 hover:bg-[#EFECE4]/40 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-[#718875] uppercase tracking-[0.14em]">
                  {p.category}
                </span>
                <StatusBadge status={p.status} size="sm" />
              </div>
              <h3 className="font-serif text-[17px] text-[#1C1C1C] mb-2 leading-snug">
                {p.product_name}
              </h3>
              <p className="text-[12px] text-[#718875] leading-relaxed mb-4 line-clamp-2">
                {p.claim_text}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#1B3A2B] group-hover:text-[#315C45]">
                View analysis
                <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Section 7: ESG / Business (MID FOREST — premium dark section)
// =====================================================================
export function ESGSection() {
  return (
    <section className="py-28 px-6 bg-[#1B3A2B] border-b border-[#315C45]/40" aria-label="ESG compliance">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#A9BBA0]" aria-hidden="true" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-[#A9BBA0]">
                For Business
              </span>
            </div>
            <h2
              className="font-serif text-[#F7F5F0] mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.12, letterSpacing: '-0.02em' }}
            >
              Make your sustainability claims
              <br />
              <em className="not-italic text-[#A9BBA0]">easier to trust.</em>
            </h2>
            <p className="text-[#F7F5F0]/65 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
              Businesses can submit claims, attach evidence, track verification, manage products, and generate
              public verification records — all backed by GreenLedger&apos;s evidence engine.
            </p>
            <p className="text-[#A9BBA0]/70 text-sm leading-relaxed mb-8 max-w-2xl">
              Verification infrastructure and management tools are paid services.
              A positive verdict is never for sale — every assessment is evidence-based.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/business"
                className="group flex items-center gap-2 bg-[#A9BBA0] text-[#1B3A2B] px-8 py-3.5 rounded-lg font-semibold text-[15px] hover:bg-[#BDCCB2] transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Start Business Portal
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-2 border border-[#A9BBA0]/25 text-[#F7F5F0] px-8 py-3.5 rounded-lg font-medium text-[15px] hover:bg-[#A9BBA0]/10 hover:border-[#A9BBA0]/40 transition-all"
              >
                Methodology &amp; Standards
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-[#122619] border border-[#315C45]/50 rounded-xl p-6">
              <div className="space-y-0">
                {[
                  { label: 'EU Taxonomy', status: 'Ready' },
                  { label: 'SASB Standards', status: 'Ready' },
                  { label: 'GRI Framework', status: 'Ready' },
                  { label: 'TNFD Disclosure', status: 'Ready' },
                  { label: 'CSRD Reporting', status: 'Ready' },
                ].map((std) => (
                  <div key={std.label} className="flex items-center justify-between py-3 border-b border-[#315C45]/30 last:border-0">
                    <span className="text-[13px] text-[#F7F5F0] font-mono">{std.label}</span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#A9BBA0]">
                      <CheckCircle2 size={12} />
                      {std.status}
                    </span>
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
// Section 8: Community Ledger (LIGHT — serious public record)
// =====================================================================
export function CommunityLedgerSection() {
  const entries = COMMUNITY_LEDGER.slice(0, 5);

  return (
    <section className="py-28 px-6 bg-[#F7F5F0] border-b border-[#D6D3C8]/60" aria-label="Community ledger activity">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-[1px] bg-[#315C45]" aria-hidden="true" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-[#315C45]">
                Public Record
              </span>
            </div>
            <h2
              className="font-serif text-[#1C1C1C]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.12, letterSpacing: '-0.02em' }}
            >
              Community
              <em className="not-italic text-[#315C45]"> ledger</em>
            </h2>
          </div>
          <Link
            href="/ledger"
            className="btn-secondary text-sm group shrink-0"
          >
            View full ledger
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="bg-[#FCFAF5] border border-[#D6D3C8] rounded-xl overflow-hidden">
          <div className="divide-y divide-[#D6D3C8]/60">
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={`/result/${getResultIdForStatus(entry.status)}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-[#EFECE4]/60 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-[#1C1C1C] font-medium truncate mb-0.5">
                    {entry.claim_text}
                  </p>
                  <p className="text-[11px] font-mono text-[#718875]">
                    {entry.brand} · {entry.category} · {formatDate(entry.verified_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
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
// Section 9: CTA (FOREST DEEP — editorial closing)
// =====================================================================
export function CTASection() {
  return (
    <section className="py-28 px-6 bg-[#122619]" aria-label="Get started">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2
            className="font-serif text-[#F7F5F0] mb-6"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: 1.12, letterSpacing: '-0.02em' }}
          >
            From Green Claim
            <br />
            <em className="not-italic text-[#A9BBA0]">to Verified Proof.</em>
          </h2>
          <p className="text-[#F7F5F0]/60 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            GreenLedger makes environmental claims easier to understand, investigate and verify.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/verify"
              className="group flex items-center gap-2 bg-[#A9BBA0] text-[#1B3A2B] px-8 py-3.5 rounded-lg font-semibold text-[15px] hover:bg-[#BDCCB2] transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Verify a Claim
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-2 border border-[#A9BBA0]/25 text-[#F7F5F0] px-8 py-3.5 rounded-lg font-medium text-[15px] hover:bg-[#A9BBA0]/10 hover:border-[#A9BBA0]/40 transition-all"
            >
              Explore the Ledger
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
