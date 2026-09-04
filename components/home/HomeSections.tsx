'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Search,
  Upload,
  ShieldCheck,
  BookOpen,
  Eye,
  AlertTriangle,
  CheckCircle2,
  FileText,
  BarChart3,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PLATFORM_METRICS, COMMUNITY_LEDGER, EXPLORE_PRODUCTS, getResultIdForStatus } from '@/lib/mock-data';
import { formatNumber, formatDate } from '@/lib/utils';

// =====================================================================
// Section 1: The Problem (WARM CREAM / SOFT BEIGE BACKGROUND)
// =====================================================================
export function ProblemSection() {
  const claims = [
    { text: '"100% Eco-Friendly"', warn: 'Vague criterion', level: 'high' },
    { text: '"Carbon Neutral"', warn: 'Unverified offset', level: 'mid' },
    { text: '"Fully Sustainable"', warn: 'Broad marketing', level: 'high' },
    { text: '"100% Recyclable"', warn: 'Facility dependent', level: 'mid' },
    { text: '"Biodegradable"', warn: 'No standard cited', level: 'high' },
    { text: '"Zero Waste"', warn: 'Scope unmeasured', level: 'mid' },
  ];

  return (
    <section className="py-28 px-6 bg-[#F3F0E8] border-b border-[#C8CEC5]/60" aria-label="The greenwashing problem">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left: Editorial content */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#12382A] px-3 py-1 rounded bg-[#E9E6DC] border border-[#C8CEC5] mb-6">
              The Trust Problem
            </div>
            <h2
              className="font-serif text-[#102019] mb-6"
              style={{ fontSize: 'clamp(2.25rem, 4vw, 3.25rem)', lineHeight: 1.15, letterSpacing: '-0.02em' }}
            >
              Sustainability claims
              <br />
              <em className="not-italic text-[#12382A] underline decoration-[#63D6A2] decoration-4 underline-offset-8">
                shouldn&apos;t require detective work.
              </em>
            </h2>
            <p className="text-[#102019]/80 text-base sm:text-lg leading-relaxed mb-6">
              Every day, thousands of consumer products carry sweeping environmental promises. But shoppers,
              researchers, and sustainability teams have had no open, standardized way to verify whether those
              claims match real scientific evidence or are just carefully worded marketing.
            </p>
            <p className="text-[#718078] text-sm leading-relaxed mb-8">
              GreenLedger replaces blind trust with structured evidence. We trace claims against verified
              sustainability disclosures, independent audits, and recognized environmental registries.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/verify" className="btn-primary">
                Verify a Claim <ArrowRight size={16} />
              </Link>
              <Link href="/about" className="btn-ghost">
                Read Our Methodology
              </Link>
            </div>
          </div>

          {/* Right: Floating Claim chips + Verdict preview */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {claims.map((item, i) => (
                <Link
                  key={i}
                  href={`/verify?claim=${encodeURIComponent(item.text.replace(/"/g, ''))}`}
                  className="card-cream p-4 flex items-start gap-3 border border-[#C8CEC5] shadow-sm hover:shadow-md hover:border-[#12382A] transition-all group cursor-pointer"
                  title="Click to test verification for this claim"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      item.level === 'high' ? 'bg-[#C95C5C]/15 text-[#C95C5C]' : 'bg-[#D3A54A]/15 text-[#D3A54A]'
                    }`}
                  >
                    <AlertTriangle size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-medium text-[#102019] group-hover:text-[#12382A] block leading-snug truncate">
                        {item.text}
                      </span>
                      <span className="text-[10px] text-[#12382A] opacity-0 group-hover:opacity-100 transition-opacity font-mono font-semibold flex-shrink-0">
                        Test →
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#718078] mt-0.5 block">{item.warn}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Overlaid preview badge */}
            <Link
              href="/result/demo-1"
              className="mt-4 sm:absolute sm:-bottom-6 sm:-right-4 card-cream p-5 rounded-xl max-w-xs shadow-xl border-2 border-[#12382A]/20 bg-[#FAF8F3] block hover:border-[#12382A] hover:shadow-2xl transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase text-[#718078]">GreenLedger Verdict</span>
                <span className="w-2 h-2 rounded-full bg-[#C95C5C] animate-ping" />
              </div>
              <StatusBadge status="POTENTIAL_GREENWASHING" size="sm" />
              <p className="text-xs text-[#102019] mt-2.5 leading-snug">
                <strong>No independent evidence:</strong> &ldquo;100% Eco-Friendly&rdquo; lacks third-party life-cycle certification.
              </p>
              <div className="pt-2 border-t border-[#C8CEC5] mt-2 flex items-center justify-between text-[11px] font-mono text-[#12382A] font-semibold">
                <span>Inspect Audit Case</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Section 2: How It Works (DARK FOREST GREEN BACKGROUND)
// =====================================================================
export function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      icon: <Upload size={20} />,
      title: 'Scan / Upload',
      desc: 'Enter claim text, paste advertising copy, or upload product label photo.',
      href: '/verify',
    },
    {
      num: '02',
      icon: <Search size={20} />,
      title: 'Extract Claim',
      desc: 'Classifier isolates specific environmental attributes, scope, and metric units.',
      href: '/verify',
    },
    {
      num: '03',
      icon: <BookOpen size={20} />,
      title: 'Check Evidence',
      desc: 'Disclosures, EU Ecolabel, FSC, GRS, and verified life-cycle data are cross-referenced.',
      href: '/explore',
    },
    {
      num: '04',
      icon: <ShieldCheck size={20} />,
      title: 'Verify',
      desc: 'Deterministic rules engine evaluates evidence relevance, match, and independence.',
      href: '/about#methodology',
    },
    {
      num: '05',
      icon: <Eye size={20} />,
      title: 'Understand',
      desc: 'Receive transparent verdict with complete audit trail, reasons, and missing proof.',
      href: '/result/demo-1',
    },
  ];

  return (
    <section className="py-28 px-6 bg-[#0B241A] text-[#F3F0E8] border-b border-[#12382A]" aria-label="How GreenLedger works">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-xs font-mono font-semibold text-[#63D6A2] uppercase tracking-widest px-3 py-1 rounded bg-[#12382A] border border-[#63D6A2]/25 mb-4 inline-block">
            Step-by-Step Architecture
          </span>
          <h2 className="font-serif text-[2.5rem] sm:text-[3.25rem] text-[#F3F0E8] mb-4">
            From claim to evidence.
          </h2>
          <p className="text-[#F3F0E8]/70 max-w-2xl mx-auto text-base sm:text-lg">
            A five-stage verification pipeline transforming arbitrary marketing claims into transparent, reproducible trust decisions.
          </p>
        </div>

        {/* 5 connected cards with visual flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 relative">
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col">
              <Link
                href={step.href}
                className="card-dark p-6 flex-1 flex flex-col justify-between relative overflow-hidden group hover:border-[#63D6A2]/50 hover:bg-[#0e2f23] transition-all cursor-pointer block"
                title={`Learn about Stage ${i + 1}: ${step.title}`}
              >
                {/* Glowing top line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#63D6A2]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xs text-[#63D6A2] font-semibold tracking-wider">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-[#0B241A] border border-[#63D6A2]/25 text-[#63D6A2] flex items-center justify-center group-hover:border-[#63D6A2]/60 transition-colors">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="font-serif text-lg text-[#F3F0E8] group-hover:text-[#63D6A2] transition-colors mb-2">{step.title}</h3>
                  <p className="text-xs text-[#F3F0E8]/70 leading-relaxed">{step.desc}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#63D6A2]/80">
                  <span>Stage {i + 1}</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform text-[#63D6A2]" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Section 3: Evidence, Not Just AI (WARM CREAM BACKGROUND)
// =====================================================================
export function EvidenceSection() {
  const aiRoles = [
    'Claim language parsing & entity extraction',
    'OCR for product package label reading',
    'ESG report structural summarization',
    'Multi-criteria taxonomy classification',
    'Plain-language verdict explainability',
  ];

  const rulesRoles = [
    'Verifiable evidence existence & provenance check',
    'Third-party vs. self-reported source scoring',
    'Recognized registry verification (EU, FSC, GRS)',
    'Threshold matching of measurable criteria',
    'Deterministic, auditable verification status',
  ];

  return (
    <section className="py-28 px-6 bg-[#F3F0E8] border-b border-[#C8CEC5]/60" aria-label="Evidence not just AI">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left: Philosophy */}
          <div className="lg:col-span-6">
            <span className="text-xs font-mono font-semibold text-[#12382A] uppercase tracking-widest px-3 py-1 rounded bg-[#E9E6DC] border border-[#C8CEC5] mb-6 inline-block">
              Methodological Integrity
            </span>
            <h2 className="font-serif text-[2.5rem] sm:text-[3.25rem] text-[#102019] mb-6 leading-tight">
              Evidence,
              <br />
              <em className="not-italic text-[#12382A]">not just AI guesswork.</em>
            </h2>
            <p className="text-[#102019]/80 text-base leading-relaxed mb-6">
              Language models often hallucinate or validate persuasive marketing copy. GreenLedger is strictly designed
              as an evidence-first engine: AI accelerates extraction, but <strong>rules and external data decide truth</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="p-5 rounded-xl bg-[#FAF8F3] border border-[#C8CEC5]">
                <h4 className="text-xs font-mono font-semibold uppercase text-[#12382A] tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#12382A]" />
                  AI Assists With
                </h4>
                <ul className="space-y-2.5">
                  {aiRoles.map((item, idx) => (
                    <li key={idx} className="text-xs text-[#718078] flex items-start gap-2">
                      <span className="text-[#12382A] font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-[#12382A] text-[#F3F0E8] border border-[#63D6A2]/30">
                <h4 className="text-xs font-mono font-semibold uppercase text-[#63D6A2] tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#63D6A2]" />
                  Verification Requires
                </h4>
                <ul className="space-y-2.5">
                  {rulesRoles.map((item, idx) => (
                    <li key={idx} className="text-xs text-[#F3F0E8]/80 flex items-start gap-2">
                      <span className="text-[#63D6A2] font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Realistic verification pipeline audit card */}
          <div className="lg:col-span-6">
            <div className="card-cream p-7 rounded-2xl border-2 border-[#12382A]/20 shadow-xl bg-[#FAF8F3]">
              <div className="flex items-center justify-between pb-4 border-b border-[#C8CEC5] mb-5">
                <div>
                  <p className="text-xs font-mono uppercase text-[#718078]">Audit Trace</p>
                  <h3 className="font-serif text-lg text-[#102019]">Engine Pipeline</h3>
                </div>
                <span className="text-xs font-mono text-[#12382A] bg-[#63D6A2]/20 border border-[#63D6A2]/40 px-2.5 py-1 rounded">
                  8 / 8 Checks Complete
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Claim extracted & disambiguated', detail: '"100% Eco-Friendly Formula"' },
                  { label: 'OCR package scan processed', detail: 'Text parsed with 99.4% confidence' },
                  { label: 'Claim classification applied', detail: 'Taxonomy: General Environmental Benefit' },
                  { label: 'Public disclosures searched', detail: 'Found corporate sustainability overview' },
                  { label: 'Certification registries queried', detail: '0 active certificates identified' },
                  { label: 'Source reliability weighted', detail: 'Self-reported only (Reliability: 0.35)' },
                  { label: 'ISO 14021 rules checked', detail: 'Violates Clause 5.7: Broad vague claims' },
                  { label: 'Verdict & explanation compiled', detail: 'Result: Potential Greenwashing' },
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#F3F0E8] border border-[#C8CEC5]/50">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-[#12382A] flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-[#102019]">{step.label}</p>
                        <p className="text-[11px] text-[#718078] font-mono">{step.detail}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#718078]">PASS</span>
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
// Section 4: Live Verification Card (DARK EMERALD BACKGROUND)
// =====================================================================
export function SampleVerificationCard() {
  const assessments = [
    { label: 'Specific environmental criteria', status: 'FAIL', icon: '✕', color: 'text-[#C95C5C]', bg: 'bg-[#C95C5C]/20' },
    { label: 'Supporting evidence', status: 'FAIL', icon: '✕', color: 'text-[#C95C5C]', bg: 'bg-[#C95C5C]/20' },
    { label: 'Certification', status: 'WARN', icon: '△', color: 'text-[#D3A54A]', bg: 'bg-[#D3A54A]/20' },
    { label: 'Source reliability', status: 'PASS', icon: '✓', color: 'text-[#4FAF78]', bg: 'bg-[#4FAF78]/20' },
  ];

  return (
    <section className="py-28 px-6 bg-[#12382A] text-[#F3F0E8] border-b border-[#0B241A]" aria-label="Live verification result">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-mono font-semibold text-[#63D6A2] uppercase tracking-widest px-3 py-1 rounded bg-[#0B241A] border border-[#63D6A2]/25 mb-4 inline-block">
            Interactive Verification Model
          </span>
          <h2 className="font-serif text-[2.5rem] sm:text-[3.25rem] text-[#F3F0E8] mb-4">
            See GreenLedger in Action
          </h2>
          <p className="text-[#F3F0E8]/70 max-w-xl mx-auto text-base">
            Every verdict is traceable to verified sources with plain-language explanations of what is missing.
          </p>
        </div>

        {/* Central impressive card */}
        <div className="bg-[#0B241A] border-2 border-[#63D6A2]/30 rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto">
          {/* Header banner */}
          <div className="bg-[#C95C5C]/15 border-b border-[#C95C5C]/30 p-6 sm:p-8 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#C95C5C] text-white flex items-center justify-center text-xl font-bold">
                ✕
              </div>
              <div>
                <p className="text-xs font-mono font-semibold text-[#fca5a5] uppercase tracking-wider mb-1">
                  Verification Verdict
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl text-white">
                  &ldquo;100% Eco-Friendly&rdquo;
                </h3>
              </div>
            </div>
            <StatusBadge status="POTENTIAL_GREENWASHING" theme="dark" size="lg" />
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            <p className="text-xs font-mono uppercase text-[#63D6A2] tracking-wider mb-4">
              Evidence Assessment Breakdown
            </p>
            <div className="space-y-3 mb-8">
              {assessments.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#12382A] border border-white/5"
                >
                  <span className="text-sm text-[#F3F0E8]">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-lg ${item.bg} ${item.color} flex items-center justify-center font-bold text-sm`}>
                      {item.icon}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Why this result */}
            <div className="bg-[#12382A]/90 rounded-xl p-5 border border-[#63D6A2]/20 mb-8">
              <p className="text-xs font-mono font-semibold text-[#63D6A2] uppercase tracking-wider mb-2">
                Why This Result?
              </p>
              <p className="text-sm text-[#F3F0E8]/90 leading-relaxed">
                The claim uses broad environmental language but does not provide sufficient measurable evidence
                supporting the environmental benefit. No recognized independent certification (e.g. EU Ecolabel) was identified.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/result/demo-1" className="btn-mint">
                View Full Evidence <ArrowRight size={15} />
              </Link>
              <Link href="/verify" className="btn-secondary-dark">
                Try Your Own Claim
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Section 5: Built for Transparency Metrics (DEEP FOREST BACKGROUND)
// =====================================================================
export function MetricsSection() {
  const [metricValues, setMetricValues] = useState({
    claims_checked: PLATFORM_METRICS.claims_checked,
    verified_claims: PLATFORM_METRICS.verified_claims,
    insufficient_evidence: PLATFORM_METRICS.insufficient_evidence,
    potential_issues: PLATFORM_METRICS.potential_issues,
  });

  useEffect(() => {
    fetch('/api/metrics')
      .then((r) => r.json())
      .then((data) => {
        if (data.metrics) setMetricValues(data.metrics);
      })
      .catch(() => {
        // Silently keep static values
      });
  }, []);

  const metrics = [
    { label: 'Claims Checked', value: metricValues.claims_checked },
    { label: 'Verified Claims', value: metricValues.verified_claims },
    { label: 'Insufficient Evidence', value: metricValues.insufficient_evidence },
    { label: 'Potential Issues Found', value: metricValues.potential_issues },
  ];

  return (
    <section className="py-28 px-6 bg-[#071710] text-[#F3F0E8] border-b border-[#12382A]" aria-label="Platform metrics">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-semibold text-[#63D6A2] uppercase tracking-widest px-3 py-1 rounded bg-[#12382A] border border-[#63D6A2]/25 mb-4 inline-block">
            Continuous Environmental Ledger
          </span>
          <h2 className="font-serif text-[2.5rem] sm:text-[3.25rem] text-[#F3F0E8] mb-4">
            Built for Transparency
          </h2>
          <p className="text-[#F3F0E8]/70 max-w-xl mx-auto text-base">
            Every verification is recorded in an open, searchable record. These numbers reflect verified claims across consumer products.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className="p-8 rounded-2xl bg-[#0B241A] border border-[#63D6A2]/20 text-center relative overflow-hidden group hover:border-[#63D6A2]/50 transition-all"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#63D6A2]/40 to-transparent" />
              <p className="font-serif text-4xl sm:text-5xl text-[#63D6A2] mb-2 tracking-tight">
                {formatNumber(m.value)}
              </p>
              <p className="text-xs sm:text-sm font-mono text-[#F3F0E8]/70 uppercase tracking-wider">{m.label}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs font-mono text-[#F3F0E8]/50">
          * Demo metrics — replace with live database aggregation in production environment.
        </p>
      </div>
    </section>
  );
}

// =====================================================================
// Section 6: Explore Verified Products (SOFT BEIGE BACKGROUND)
// =====================================================================
export function ExploreLedgerSection() {
  const featured = EXPLORE_PRODUCTS.slice(0, 3);

  return (
    <section className="py-28 px-6 bg-[#E9E6DC] border-b border-[#C8CEC5]/70" aria-label="Explore verified claims">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4">
          <div>
            <span className="text-xs font-mono font-semibold text-[#12382A] uppercase tracking-widest px-3 py-1 rounded bg-[#FAF8F3] border border-[#C8CEC5] mb-4 inline-block">
              Public Catalog
            </span>
            <h2 className="font-serif text-[2.5rem] sm:text-[3rem] text-[#102019]">
              Explore verified claims.
            </h2>
            <p className="text-[#718078] text-base max-w-xl mt-2">
              Recent product evaluations conducted against verified environmental standards.
            </p>
          </div>
          <Link href="/explore" className="btn-primary">
            View All Products <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((product) => (
            <Link
              key={product.id}
              href={`/result/${product.result_id}`}
              className="card-cream p-7 flex flex-col justify-between group border border-[#C8CEC5] hover:border-[#12382A] hover:shadow-xl transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <StatusBadge status={product.status} size="sm" />
                  <span className="text-xs font-mono text-[#718078] uppercase">{product.category}</span>
                </div>

                <h3 className="font-serif text-xl text-[#102019] group-hover:text-[#12382A] transition-colors mb-1">
                  {product.product_name}
                </h3>
                <p className="text-xs font-mono text-[#718078] mb-4">Brand: {product.brand}</p>

                <div className="p-3.5 rounded-lg bg-[#FAF8F3] border border-[#C8CEC5]/60 mb-5">
                  <p className="text-xs text-[#102019] italic leading-relaxed">
                    &ldquo;{product.claim_text}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#C8CEC5] flex items-center justify-between text-xs font-mono text-[#718078]">
                <span>Verified: {formatDate(product.verified_at)}</span>
                <span className="text-[#12382A] font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Section 7: ESG / Evidence (DARK EMERALD BACKGROUND)
// =====================================================================
export function ESGSection() {
  return (
    <section className="py-28 px-6 bg-[#12382A] text-[#F3F0E8] border-b border-[#0B241A]" aria-label="Complex ESG Data">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-mono font-semibold text-[#63D6A2] uppercase tracking-widest px-3 py-1 rounded bg-[#0B241A] border border-[#63D6A2]/25 mb-6 inline-block">
              Data Intelligence
            </span>
            <h2 className="font-serif text-[2.5rem] sm:text-[3.25rem] text-[#F3F0E8] mb-6 leading-tight">
              Complex ESG data.
              <br />
              <em className="not-italic text-[#63D6A2]">Made understandable.</em>
            </h2>
            <p className="text-[#F3F0E8]/80 text-base leading-relaxed mb-6">
              Sustainability reports often span hundreds of pages filled with unstandardized jargon.
              GreenLedger strips out greenwashing and distills verifiable performance indicators into plain language.
            </p>
            <div className="space-y-3">
              {[
                { title: 'Company Self-Reports', desc: 'Direct corporate ESG disclosures flagged as self-reported data' },
                { title: 'Independent Certification', desc: 'Registry lookups via EU Ecolabel, FSC, GOTS, and ISO 14021' },
                { title: 'Audit Trail Provenance', desc: 'Every data point is cited with date, relevance score, and source link' },
              ].map((item, i) => (
                <div key={i} className="p-3.5 rounded-lg bg-[#0B241A]/70 border border-[#63D6A2]/20">
                  <h4 className="text-sm font-semibold text-[#63D6A2] mb-0.5">{item.title}</h4>
                  <p className="text-xs text-[#F3F0E8]/70 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bloomberg-style Climate-Tech Data Visualizer */}
          <div className="lg:col-span-7">
            <div className="bg-[#0B241A] border-2 border-[#63D6A2]/30 rounded-2xl p-7 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#12382A] mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#63D6A2] tracking-wider">Environmental Benchmark</span>
                  <h3 className="font-serif text-xl text-[#F3F0E8]">Key Climate Metrics</h3>
                </div>
                <span className="text-xs font-mono text-[#F3F0E8]/60">Source: Verified Disclosures</span>
              </div>

              {/* Stat grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-5 rounded-xl bg-[#12382A] border border-[#63D6A2]/20 text-center">
                  <p className="font-serif text-3xl font-bold text-[#63D6A2] mb-1">12% ↓</p>
                  <p className="text-xs font-semibold text-[#F3F0E8]">Scope 1-2 Emissions</p>
                  <p className="text-[10px] font-mono text-[#F3F0E8]/60 mt-1">vs. 2020 Baseline</p>
                </div>

                <div className="p-5 rounded-xl bg-[#12382A] border border-[#63D6A2]/20 text-center">
                  <p className="font-serif text-3xl font-bold text-[#63D6A2] mb-1">38%</p>
                  <p className="text-xs font-semibold text-[#F3F0E8]">Recycled Material</p>
                  <p className="text-[10px] font-mono text-[#F3F0E8]/60 mt-1">Post-Consumer Content</p>
                </div>

                <div className="p-5 rounded-xl bg-[#12382A] border border-[#63D6A2]/20 text-center">
                  <p className="font-serif text-3xl font-bold text-[#63D6A2] mb-1">8% ↓</p>
                  <p className="text-xs font-semibold text-[#F3F0E8]">Freshwater Withdrawal</p>
                  <p className="text-[10px] font-mono text-[#F3F0E8]/60 mt-1">Year-over-Year</p>
                </div>
              </div>

              {/* Source comparison table */}
              <div className="space-y-2.5">
                {[
                  { name: 'Corporate Sustainability Report 2023', type: 'Self-Reported', status: 'UNVERIFIED INDEPENDENTLY', badge: 'bg-[#D3A54A]/20 text-[#fde047]' },
                  { name: 'Global Recycled Standard (GRS v4.0)', type: 'Third-Party Audit', status: 'CERTIFIED & ACTIVE', badge: 'bg-[#4FAF78]/20 text-[#86efac]' },
                  { name: 'ISO 14021 Self-Declaration Matrix', type: 'Environmental Standard', status: 'METHODOLOGY MATCH', badge: 'bg-[#63D6A2]/20 text-[#63D6A2]' },
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[#12382A]/70 border border-white/5 text-xs flex-wrap gap-2">
                    <div>
                      <p className="font-medium text-[#F3F0E8]">{row.name}</p>
                      <p className="text-[10px] font-mono text-[#F3F0E8]/60">{row.type}</p>
                    </div>
                    <span className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded ${row.badge}`}>
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Working CTA link to full ESG evidence page */}
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
                <span className="text-xs font-mono text-[#F3F0E8]/70">Sample Dataset: EcoPack Mailer Box</span>
                <Link href="/evidence/demo-3" className="btn-mint text-xs py-2 px-3.5 flex items-center gap-1.5 font-semibold">
                  Inspect Complete ESG Dossier <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Section 8: Community Ledger (WARM CREAM BACKGROUND)
// =====================================================================
export function CommunityLedgerSection() {
  const recent = COMMUNITY_LEDGER.slice(0, 4);

  return (
    <section className="py-28 px-6 bg-[#F3F0E8] border-b border-[#C8CEC5]/70" aria-label="Community ledger">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4">
          <div>
            <span className="text-xs font-mono font-semibold text-[#12382A] uppercase tracking-widest px-3 py-1 rounded bg-[#E9E6DC] border border-[#C8CEC5] mb-4 inline-block">
              Open Verification Records
            </span>
            <h2 className="font-serif text-[2.5rem] sm:text-[3rem] text-[#102019]">
              Transparency works better when it&apos;s shared.
            </h2>
            <p className="text-[#718078] text-base max-w-xl mt-2">
              Every verification made on GreenLedger is recorded into the public audit log for community accountability.
            </p>
          </div>
          <Link href="/ledger" className="btn-secondary">
            View Complete Ledger <ArrowRight size={15} />
          </Link>
        </div>

        {/* Alternating ledger table rows */}
        <div className="divide-y divide-[#C8CEC5] border border-[#C8CEC5] rounded-2xl overflow-hidden shadow-sm bg-[#FAF8F3]">
          {recent.map((entry, idx) => (
            <div
              key={entry.id}
              className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                idx % 2 === 0 ? 'bg-[#FAF8F3]' : 'bg-[#F3F0E8]'
              } hover:bg-[#E9E6DC]`}
            >
              <div className="flex items-start sm:items-center gap-4">
                <StatusBadge status={entry.status} size="sm" className="flex-shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <p className="font-semibold text-sm text-[#102019]">
                    {entry.product_name}
                    <span className="text-[#718078] font-normal"> · {entry.brand}</span>
                  </p>
                  <p className="text-xs text-[#718078] italic mt-0.5">
                    &ldquo;{entry.claim_text}&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono text-[#718078]">
                <span className="hidden md:inline">{entry.evidence_strength.toLowerCase()} evidence</span>
                <span>{formatDate(entry.verified_at)}</span>
                <Link
                  href={`/result/${getResultIdForStatus(entry.status)}`}
                  className="text-[#12382A] font-semibold hover:text-[#0B241A] flex items-center gap-1 group"
                >
                  Inspect <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// Section 9: Final Call to Action (DARK FOREST GREEN BACKGROUND)
// =====================================================================
export function CTABanner() {
  return (
    <section className="relative py-28 px-6 bg-[#0B241A] text-white overflow-hidden text-center" aria-label="Call to action">
      {/* Texture accent */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #63D6A2 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <span className="text-xs font-mono font-semibold text-[#63D6A2] uppercase tracking-widest px-3 py-1 rounded bg-[#12382A] border border-[#63D6A2]/25 mb-8 inline-block">
          Start Verifying
        </span>

        <h2
          className="font-serif text-[#F3F0E8] mb-6"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4.25rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
        >
          Don&apos;t just trust a green claim.
          <br />
          <em className="not-italic text-[#63D6A2]">Verify it.</em>
        </h2>

        <p className="text-[#F3F0E8]/75 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-light">
          Make sustainability claims transparent. Enter a product claim in seconds and view the complete evidence trail.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/verify" className="btn-mint text-base py-4 px-8 font-semibold">
            Verify a Claim Now →
          </Link>
          <Link href="/explore" className="btn-secondary-dark text-base py-4 px-8">
            Explore Verified Ledger
          </Link>
        </div>
      </div>
    </section>
  );
}
