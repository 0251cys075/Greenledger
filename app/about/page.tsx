import Link from 'next/link';
import { ArrowRight, ShieldCheck, Database, Zap, Globe, QrCode, BarChart2, CheckCircle2, HelpCircle } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';

export default function AboutPage() {
  const steps = [
    {
      num: '01',
      title: 'Claim Entry & Ingestion',
      desc: 'Users input claim text from advertisements, packaging, or product labels. Alternatively, an image of the packaging is uploaded for OCR text isolation.',
    },
    {
      num: '02',
      title: 'Entity Extraction & Classification',
      desc: 'The NLP classifier identifies the environmental claim domain (e.g., carbon offset, recycled content, biodegradability, freshwater intensity) and maps it to ISO 14021 criteria.',
    },
    {
      num: '03',
      title: 'Evidence Retrieval & Discovery',
      desc: 'The engine crawls verified public records: sustainability reports, third-party Life-Cycle Assessments (LCA), and published ESG filings.',
    },
    {
      num: '04',
      title: 'Certification Registry Check',
      desc: 'Recognised independent certifications (EU Ecolabel, FSC, Global Recycled Standard, GOTS, Cradle to Cradle) are cross-checked for product and brand validity.',
    },
    {
      num: '05',
      title: 'Auditable Rules Engine',
      desc: 'Deterministic verification rules—not black-box AI—evaluate evidence availability, independent corroboration, and metric alignment with the stated claim.',
    },
    {
      num: '06',
      title: 'Transparent Verdict Generation',
      desc: 'A definitive verdict (VERIFIED, INSUFFICIENT EVIDENCE, or POTENTIAL GREENWASHING) is generated alongside the full source provenance and explanation.',
    },
  ];

  const verdicts = [
    {
      status: 'VERIFIED' as const,
      title: 'Verified',
      desc: 'Available reliable public evidence sufficiently substantiates the stated environmental claim. Supported by independent audits or recognized certification schemes.',
      cardBg: 'bg-[#3E7D4F]/10 border-[#3E7D4F]/40 text-[#1B3A2B]',
      accentColor: 'text-[#315C45]',
    },
    {
      status: 'INSUFFICIENT_EVIDENCE' as const,
      title: 'Insufficient Evidence',
      desc: 'Publicly accessible evidence is incomplete or uncorroborated. The claim may be truthful, but lack of independent transparency prevents verification.',
      cardBg: 'bg-[#C9A227]/10 border-[#C9A227]/40 text-[#1C1C1C]',
      accentColor: 'text-[#8A6A1E]',
    },
    {
      status: 'POTENTIAL_GREENWASHING' as const,
      title: 'Potential Greenwashing',
      desc: 'The claim uses broad, vague, or exaggerated environmental language without measurable supporting data, or directly contradicts public disclosures.',
      cardBg: 'bg-[#C1443E]/10 border-[#C1443E]/40 text-[#1C1C1C]',
      accentColor: 'text-[#9E3B33]',
    },
  ];

  const principles = [
    { icon: <ShieldCheck size={20} />, title: 'Evidence-First Architecture', desc: 'AI assists with extraction and summarization, but deterministic rules and external public data decide the verdict.' },
    { icon: <Database size={20} />, title: 'Transparent Provenance', desc: 'Every verdict explicitly lists consulted sources, publication dates, relevance ratings, and whether data is self-reported.' },
    { icon: <Zap size={20} />, title: 'Responsible Communication', desc: 'GreenLedger communicates uncertainty honestly. We never claim a company is intentionally lying — only that evidence is absent or insufficient.' },
    { icon: <Globe size={20} />, title: 'UN SDG Alignment', desc: 'Directly advancing SDG 12 (Responsible Consumption and Production), SDG 13 (Climate Action), and SDG 16 (Transparency).' },
    { icon: <QrCode size={20} />, title: 'Packaging Traceability', desc: 'Lightweight QR identifiers connect physical packages to live GreenLedger audit records without reprinting.' },
    { icon: <BarChart2 size={20} />, title: 'Public Accountability', desc: 'The public community ledger makes evaluations searchable and permanent, raising standards across consumer markets.' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] pt-24 pb-20">
      {/* Hero Section — Dark Forest */}
      <section className="bg-[#1B3A2B] text-[#F7F5F0] py-24 px-6 border-b border-[#315C45] text-center" id="about">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-mono font-semibold text-[#A9BBA0] uppercase tracking-widest px-3 py-1 rounded bg-[#315C45] border border-[#A9BBA0]/25 mb-6 inline-block">
            About GreenLedger
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#F7F5F0] mb-6">
            Making Green Claims
            <br />
            <em className="not-italic text-[#A9BBA0]">Transparent.</em>
          </h1>
          <p className="text-[#F7F5F0]/75 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            GreenLedger is an independent environmental claim verification platform. We transform arbitrary sustainability claims into evidence-backed, traceable verification results.
          </p>
          <Link href="/verify" className="btn-mint font-semibold py-3.5 px-7">
            Verify a Claim Now →
          </Link>
        </div>
      </section>

      {/* Process Section — Warm Cream */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-b border-[#D6D3C8]/70" id="methodology">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-semibold text-[#315C45] uppercase tracking-widest px-3 py-1 rounded bg-[#EFECE4] border border-[#D6D3C8] mb-4 inline-block">
            Verification Methodology
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1C1C]">
            The 6-Step Verification Engine
          </h2>
          <p className="text-[#718875] max-w-xl mx-auto mt-2 text-sm">
            How claims progress from initial ingestion to audited public verdict.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="card-cream p-6 rounded-xl border border-[#D6D3C8] flex flex-col sm:flex-row items-start gap-6 hover:border-[#315C45] transition-all"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#1B3A2B] text-[#A9BBA0] font-mono font-bold text-sm flex items-center justify-center border border-[#A9BBA0]/30">
                {step.num}
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#1C1C1C] mb-1.5">{step.title}</h3>
                <p className="text-sm text-[#718875] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Verdict States — Dark Emerald */}
      <section className="py-24 px-6 bg-[#315C45] text-[#F7F5F0] border-b border-[#1B3A2B]" id="verdicts">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-semibold text-[#A9BBA0] uppercase tracking-widest px-3 py-1 rounded bg-[#1B3A2B] border border-[#A9BBA0]/25 mb-4 inline-block">
              Verdict Semantics
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F5F0] mb-3">
              Three Distinct Verification States
            </h2>
            <p className="text-[#F7F5F0]/70 max-w-xl mx-auto text-sm font-light">
              Green is never an automatic designation — every state carries precise, reproducible criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {verdicts.map((v) => (
              <div
                key={v.title}
                className="bg-[#1B3A2B] border border-[#A9BBA0]/20 rounded-2xl p-7 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4">
                    <StatusBadge status={v.status} theme="dark" size="sm" />
                  </div>
                  <h3 className="font-serif text-xl text-[#F7F5F0] mb-3">{v.title}</h3>
                  <p className="text-xs text-[#F7F5F0]/75 leading-relaxed font-light">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-xl bg-[#1B3A2B]/70 border border-[#A9BBA0]/20">
            <p className="text-xs text-[#F7F5F0]/80 leading-relaxed font-mono">
              <strong>Guiding Principle:</strong> GreenLedger strictly avoids defamatory declarations such as &ldquo;the company is lying.&rdquo; We practice responsible uncertainty communication: &ldquo;insufficient public supporting evidence,&rdquo; &ldquo;potentially misleading without independent audit,&rdquo; and &ldquo;claim could not be substantiated against recognized registries.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Core Principles — Warm Cream */}
      <section className="py-24 px-6 max-w-5xl mx-auto border-b border-[#D6D3C8]/70">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-semibold text-[#315C45] uppercase tracking-widest px-3 py-1 rounded bg-[#EFECE4] border border-[#D6D3C8] mb-4 inline-block">
            Foundations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1C1C]">
            Core Principles of Trust
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((p, i) => (
            <div key={i} className="card-cream p-6 rounded-2xl border border-[#D6D3C8]">
              <div className="w-10 h-10 rounded-lg bg-[#315C45] text-[#A9BBA0] flex items-center justify-center mb-4">
                {p.icon}
              </div>
              <h3 className="font-serif text-lg text-[#1C1C1C] mb-2">{p.title}</h3>
              <p className="text-xs text-[#718875] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QR Traceability — Soft Beige */}
      <section className="py-24 px-6 bg-[#EFECE4] border-b border-[#D6D3C8]/70" id="qr">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-mono font-semibold text-[#315C45] uppercase tracking-widest px-3 py-1 rounded bg-[#FCFAF5] border border-[#D6D3C8] mb-4 inline-block">
                On-Package Verification
              </span>
              <h2 className="font-serif text-3xl text-[#1C1C1C] mb-4">
                Scan to Inspect Evidence
              </h2>
              <p className="text-[#1C1C1C]/80 text-sm sm:text-base leading-relaxed mb-4">
                Physical products registered in GreenLedger carry a minimalist QR code that resolves directly to the live audit record.
              </p>
              <p className="text-xs text-[#718875] leading-relaxed">
                The QR code stores an immutable verification identifier—not static database records. This guarantees that consumers scanning on retail shelves always view the latest verification state and certification renewals without requiring physical packaging reprints.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="card-cream p-8 rounded-2xl text-center border-2 border-[#315C45]/20 shadow-xl bg-[#FCFAF5]">
                <div className="w-32 h-32 bg-[#EFECE4] border-2 border-[#315C45]/30 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <QrCode size={56} className="text-[#315C45]" />
                </div>
                <p className="font-serif text-base text-[#1C1C1C] mb-1 font-semibold">GreenLedger Trace</p>
                <p className="text-xs font-mono text-[#718875] mb-3">Scan with phone camera</p>
                <div className="text-[11px] font-mono text-[#315C45] bg-[#EFECE4] rounded-lg p-2 font-semibold">
                  greenledger.io/v/DEMO-1
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — Warm Cream */}
      <section className="py-24 px-6 max-w-3xl mx-auto" id="faq">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-semibold text-[#315C45] uppercase tracking-widest px-3 py-1 rounded bg-[#EFECE4] border border-[#D6D3C8] mb-4 inline-block">
            Frequently Asked Questions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1C1C]">
            Common Inquiries
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'Is GreenLedger an AI chatbot?',
              a: 'No. GreenLedger is an evidence-checking and verification platform. While machine learning helps parse text and extract structured claims, all verification decisions are made through auditable rules referencing external registries, recognized standards, and published audit reports.',
            },
            {
              q: 'Does a "Potential Greenwashing" verdict mean the company is dishonest?',
              a: 'No. It strictly means that, based on publicly accessible verifiable evidence, the claim could not be independently substantiated. The company may possess private data or uncertified initiatives, but public transparency standards are not met.',
            },
            {
              q: 'Which certification registries does GreenLedger query?',
              a: 'GreenLedger checks against established international standards including EU Ecolabel, FSC (Forest Stewardship Council), GRS (Global Recycled Standard), GOTS (Global Organic Textile Standard), and ISO 14021 environmental claims frameworks.',
            },
            {
              q: 'Is GreenLedger a government regulatory agency?',
              a: 'No. GreenLedger is an open-source and civic climate-tech intelligence tool designed for consumer transparency, academic research, and corporate supply chain accountability.',
            },
          ].map((item, i) => (
            <div key={i} className="card-cream p-6 rounded-xl border border-[#D6D3C8]">
              <h3 className="font-serif text-lg text-[#1C1C1C] mb-2">{item.q}</h3>
              <p className="text-xs sm:text-sm text-[#718875] leading-relaxed font-light">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA — Deepest Forest */}
      <section className="py-20 px-6 bg-[#122619] text-center text-[#F7F5F0] border-t border-[#315C45]">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F5F0] mb-4">
          Ready to verify a claim?
        </h2>
        <p className="text-sm text-[#F7F5F0]/70 max-w-md mx-auto mb-8">
          Check any environmental claim in seconds with open evidence and plain-language explanation.
        </p>
        <Link href="/verify" className="btn-mint font-semibold py-3.5 px-8">
          Verify Claim Now →
        </Link>
      </section>
    </div>
  );
}
