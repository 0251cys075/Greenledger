import Link from 'next/link';
import { Check, X as XIcon, ShieldCheck, Building2, Users, Building, ArrowRight } from 'lucide-react';

function PlanFeature({ text, included }: { text: string; included: boolean }) {
  return (
    <li className="flex items-start gap-2.5 py-1.5">
      {included ? (
        <Check size={15} className="text-[#3E7D4F] mt-0.5 shrink-0" />
      ) : (
        <span className="text-[#A8B3AA] text-sm shrink-0 mt-0.5 select-none">—</span>
      )}
      <span className={`text-xs sm:text-sm leading-snug ${included ? 'text-[#1C1C1C]' : 'text-[#A8B3AA]'}`}>
        {text}
      </span>
    </li>
  );
}

export default function PricingPage() {
  const comparisonRows = [
    { feature: 'Claim verification', consumer: true, pro: true, enterprise: true },
    { feature: 'QR verification', consumer: true, pro: true, enterprise: true },
    { feature: 'Public records', consumer: true, pro: true, enterprise: true },
    { feature: 'Product management', consumer: false, pro: true, enterprise: true },
    { feature: 'Evidence upload', consumer: false, pro: true, enterprise: true },
    { feature: 'Claim dashboard', consumer: false, pro: true, enterprise: true },
    { feature: 'Evidence analysis', consumer: false, pro: true, enterprise: true },
    { feature: 'Analytics', consumer: false, pro: true, enterprise: true },
    { feature: 'API', consumer: false, pro: true, enterprise: true },
    { feature: 'White-label', consumer: false, pro: false, enterprise: true },
    { feature: 'Multiple brands', consumer: false, pro: false, enterprise: true },
    { feature: 'Custom integrations', consumer: false, pro: false, enterprise: true },
    { feature: 'Dedicated support', consumer: false, pro: false, enterprise: true },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#718875] bg-[#315C45]/10 border border-[#315C45]/20 px-3 py-1.5 rounded-full mb-3">
          GREENLEDGER BUSINESS
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1C1C] mb-3">
          Choose the plan that fits your needs.
        </h1>
        <p className="text-base text-[#718875] max-w-2xl mx-auto leading-relaxed">
          Transparent pricing for evidence-based verification. Businesses pay for verification infrastructure — never for a positive verdict.
        </p>
      </div>

      {/* Trust Principle Banner */}
      <div className="rounded-xl bg-[#1B3A2B] border border-[#A9BBA0]/20 p-5 mb-10 flex items-start gap-4">
        <ShieldCheck size={22} className="text-[#A9BBA0] mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold text-[#F7F5F0] mb-1">GreenLedger Trust Principle</p>
          <p className="text-sm text-[#F7F5F0]/80 leading-relaxed">
            <strong className="text-[#A9BBA0]">Businesses pay for the infrastructure — never for a positive verdict.</strong>{' '}
            Verification outcomes are determined by available evidence and verification rules, not by the customer&apos;s subscription tier.
          </p>
        </div>
      </div>

      {/* Plans Grid (3 Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 mb-12 items-stretch">
        {/* Plan 1: CONSUMER */}
        <div className="card-cream p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="h-4 -mt-2 mb-2.5" />
            <div className="mb-2.5">
              <p className="text-xs font-mono uppercase tracking-widest text-[#718875]">Consumers</p>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#315C45]/10 border border-[#315C45]/15 flex items-center justify-center shrink-0">
                <Users size={18} className="text-[#315C45]" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1C1C1C] whitespace-nowrap">Consumer</h2>
            </div>

            <div className="mb-4">
              <span className="text-3xl sm:text-4xl font-bold text-[#1C1C1C]">€0</span>
              <span className="text-sm text-[#718875] ml-2">forever</span>
            </div>

            <p className="text-xs text-[#718875] mb-5 min-h-[32px] leading-relaxed">
              For individuals who want to make informed, sustainable choices.
            </p>

            {/* Why choose this? */}
            <div className="mb-5 p-3.5 rounded-lg bg-[#EFECE4]/50 border border-[#D6D3C8]/60 text-xs">
              <p className="font-semibold text-[#1C1C1C] mb-1">Make sustainability part of everyday decisions.</p>
              <p className="text-[#718875] leading-relaxed">
                Consumers shouldn&apos;t have to trust a green label blindly. GreenLedger helps you check environmental claims, understand the evidence behind them, and make more informed choices before you buy.
              </p>
            </div>

            <div className="border-t border-[#D6D3C8] pt-4">
              <p className="text-xs font-semibold text-[#1C1C1C] uppercase tracking-wider mb-2">Features</p>
              <ul className="space-y-0.5">
                <PlanFeature text="Scan product QR codes" included />
                <PlanFeature text="Search and verify environmental claims" included />
                <PlanFeature text="View public verification records" included />
                <PlanFeature text="Access the community ledger" included />
                <PlanFeature text="Report suspicious claims" included />
                <PlanFeature text="8-language interface" included />
                <PlanFeature text="Understand supporting evidence" included />
                <PlanFeature text="View verification results" included />
              </ul>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#D6D3C8]">
            <Link href="/verify" className="btn-secondary w-full justify-center text-center">
              Verify a Claim
            </Link>
            <p className="text-[11px] text-[#718875] text-center mt-2">
              This plan remains completely FREE.
            </p>
          </div>
        </div>

        {/* Plan 2: BUSINESS PRO */}
        <div className="card-cream p-5 sm:p-6 border-2 border-[#315C45] flex flex-col justify-between shadow-md relative">
          <div>
            <div className="flex justify-center -mt-2 mb-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F7F5F0] bg-[#1B3A2B] px-3 py-0.5 rounded-full border border-[#315C45] shrink-0">
                Most Popular
              </span>
            </div>

            <div className="mb-2.5">
              <p className="text-xs font-mono uppercase tracking-widest text-[#718875]">Businesses</p>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#315C45]/15 border border-[#315C45]/30 flex items-center justify-center shrink-0">
                <Building2 size={18} className="text-[#315C45]" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1C1C1C] whitespace-nowrap">Business Pro</h2>
            </div>

            <div className="mb-4">
              <span className="text-3xl sm:text-4xl font-bold text-[#1C1C1C]">€149</span>
              <span className="text-sm text-[#718875] ml-2">/ month</span>
            </div>

            <p className="text-xs text-[#718875] mb-5 min-h-[32px] leading-relaxed">
              For growing brands that want to prove sustainability claims with evidence.
            </p>

            {/* Why choose this? */}
            <div className="mb-5 p-3.5 rounded-lg bg-[#315C45]/5 border border-[#315C45]/20 text-xs">
              <p className="font-semibold text-[#1C1C1C] mb-1">Turn sustainability claims into verifiable proof.</p>
              <p className="text-[#718875] leading-relaxed mb-2.5">
                GreenLedger gives businesses a structured way to submit environmental claims, attach supporting evidence, track verification status, and publish transparent verification records that consumers can check.
              </p>
              <p className="text-[11px] font-medium text-[#1B3A2B] bg-[#315C45]/10 px-2 py-1 rounded border border-[#315C45]/15">
                Businesses pay for verification infrastructure — never for a positive verdict.
              </p>
            </div>

            <div className="border-t border-[#D6D3C8] pt-4">
              <p className="text-xs font-semibold text-[#1C1C1C] uppercase tracking-wider mb-2">Features</p>
              <ul className="space-y-0.5">
                <PlanFeature text="Everything in Consumer" included />
                <PlanFeature text="Product registration & management" included />
                <PlanFeature text="Environmental claim submission" included />
                <PlanFeature text="Evidence upload (PDF, images, certificates)" included />
                <PlanFeature text="Evidence-backed claim verification" included />
                <PlanFeature text="GreenLedger verification engine" included />
                <PlanFeature text="Public verification records" included />
                <PlanFeature text="Verification QR code generation" included />
                <PlanFeature text="Claim status dashboard" included />
                <PlanFeature text="Evidence strength analysis" included />
                <PlanFeature text="Verification history" included />
                <PlanFeature text="Analytics & reporting" included />
                <PlanFeature text="Basic API access" included />
              </ul>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#D6D3C8]">
            <Link href="/business/claims/new" className="btn-primary w-full justify-center text-center">
              Get Started
            </Link>
            <p className="text-[11px] text-[#718875] text-center mt-2">
              Pay for infrastructure, not verdict
            </p>
          </div>
        </div>

        {/* Plan 3: ENTERPRISE */}
        <div className="card-cream p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="h-4 -mt-2 mb-2.5" />
            <div className="mb-2.5">
              <p className="text-xs font-mono uppercase tracking-widest text-[#718875]">Organizations</p>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#A9BBA0]/20 border border-[#A9BBA0]/30 flex items-center justify-center shrink-0">
                <Building size={18} className="text-[#1B3A2B]" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1C1C1C] whitespace-nowrap">Enterprise</h2>
            </div>

            <div className="mb-4">
              <span className="text-3xl sm:text-4xl font-bold text-[#1C1C1C]">€599</span>
              <span className="text-sm text-[#718875] ml-2">/ month</span>
            </div>

            <p className="text-xs text-[#718875] mb-5 min-h-[32px] leading-relaxed">
              For organizations managing sustainability claims across multiple products, brands and markets.
            </p>

            {/* Why choose this? */}
            <div className="mb-5 p-3.5 rounded-lg bg-[#EFECE4]/50 border border-[#D6D3C8]/60 text-xs">
              <p className="font-semibold text-[#1C1C1C] mb-1">Scale trusted sustainability verification across your organization.</p>
              <p className="text-[#718875] leading-relaxed mb-2.5">
                Enterprise customers get the infrastructure needed to manage large volumes of environmental claims, evidence, verification records and consumer-facing proof across products, brands and integrations.
              </p>
              <p className="text-[11px] font-medium text-[#1B3A2B] italic">
                Built for scale. Evidence-based by design.
              </p>
            </div>

            <div className="border-t border-[#D6D3C8] pt-4">
              <p className="text-xs font-semibold text-[#1C1C1C] uppercase tracking-wider mb-2">Features</p>
              <ul className="space-y-0.5">
                <PlanFeature text="Everything in Business Pro" included />
                <PlanFeature text="Multiple products & brands" included />
                <PlanFeature text="High-volume claim verification" included />
                <PlanFeature text="Advanced evidence management" included />
                <PlanFeature text="Advanced evidence-strength analysis" included />
                <PlanFeature text="Advanced analytics & reporting" included />
                <PlanFeature text="Enterprise API access" included />
                <PlanFeature text="White-label verification widget" included />
                <PlanFeature text="Custom integrations" included />
                <PlanFeature text="Bulk verification workflows" included />
                <PlanFeature text="Exportable audit reports" included />
                <PlanFeature text="Priority support" included />
                <PlanFeature text="Dedicated account management" included />
              </ul>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#D6D3C8]">
            <a
              href="mailto:sales@greenledger.org?subject=GreenLedger%20Enterprise%20Inquiry"
              className="btn-secondary w-full justify-center text-center"
            >
              Talk to Sales
            </a>
            <p className="text-[11px] text-[#718875] text-center mt-2 leading-tight">
              €599/month. Final pricing depends on verification volume, products, brands and integrations.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="card-cream p-6 mb-12">
        <h2 className="text-base font-bold text-[#1C1C1C] mb-4">
          Feature Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#D6D3C8] text-xs font-mono uppercase tracking-wider text-[#718875]">
                <th className="py-3 pr-4 font-semibold">Capability</th>
                <th className="py-3 px-4 text-center font-semibold">Consumer</th>
                <th className="py-3 px-4 text-center font-semibold text-[#315C45] whitespace-nowrap">Business Pro</th>
                <th className="py-3 px-4 text-center font-semibold">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6D3C8]/60">
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="hover:bg-[#EFECE4]/30 transition-colors">
                  <td className="py-3 pr-4 text-xs sm:text-sm font-medium text-[#1C1C1C]">
                    {row.feature}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.consumer ? (
                      <Check size={16} className="text-[#3E7D4F] mx-auto" />
                    ) : (
                      <span className="text-[#A8B3AA] select-none">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center bg-[#315C45]/5">
                    {row.pro ? (
                      <Check size={16} className="text-[#3E7D4F] mx-auto" />
                    ) : (
                      <span className="text-[#A8B3AA] select-none">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.enterprise ? (
                      <Check size={16} className="text-[#3E7D4F] mx-auto" />
                    ) : (
                      <span className="text-[#A8B3AA] select-none">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Value Proposition Below Pricing */}
      <div className="card-cream p-8 mb-12 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-[#718875] bg-[#315C45]/10 border border-[#315C45]/20 px-3 py-1 rounded-full">
          Why GreenLedger?
        </span>
        <h2 className="text-2xl font-bold text-[#1C1C1C] mt-3 mb-2">
          One platform. Three ways to build trust.
        </h2>
        <p className="text-sm text-[#718875] max-w-2xl mx-auto leading-relaxed mb-8">
          GreenLedger connects environmental claims with evidence, standards and transparent verification records — helping sustainability move from marketing language to verifiable information.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-5 rounded-xl bg-[#F7F5F0] border border-[#D6D3C8]">
            <p className="text-xs font-mono uppercase tracking-widest text-[#315C45] font-bold mb-1">
              Consumer
            </p>
            <h3 className="text-lg font-bold text-[#1C1C1C] mb-1">VERIFY</h3>
            <p className="text-xs text-[#718875] leading-relaxed">
              Consumers get transparency. Check claims against authentic evidence before buying.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#F7F5F0] border border-[#315C45]/30 shadow-sm">
            <p className="text-xs font-mono uppercase tracking-widest text-[#315C45] font-bold mb-1">
              Business
            </p>
            <h3 className="text-lg font-bold text-[#1C1C1C] mb-1">PROVE</h3>
            <p className="text-xs text-[#718875] leading-relaxed">
              Businesses get verification infrastructure. Turn legitimate green efforts into independently verified proof.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#F7F5F0] border border-[#D6D3C8]">
            <p className="text-xs font-mono uppercase tracking-widest text-[#315C45] font-bold mb-1">
              Enterprise
            </p>
            <h3 className="text-lg font-bold text-[#1C1C1C] mb-1">SCALE</h3>
            <p className="text-xs text-[#718875] leading-relaxed">
              Enterprises get scale. Manage high-volume claims across multi-brand catalogs and international channels.
            </p>
          </div>
        </div>
      </div>

      {/* What Businesses Do NOT Get */}
      <div className="rounded-xl bg-[#C1443E]/08 border border-[#C1443E]/25 p-6 mb-10">
        <h2 className="text-base font-bold text-[#9E3B33] mb-3 flex items-center gap-2">
          <XIcon size={16} /> What businesses do NOT get
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'The ability to purchase a positive verification',
            'Influence over the verification verdict',
            'The ability to hide or suppress negative verdicts',
            'Access to override the evidence engine',
            'Anonymous or unaccountable submissions',
            'Guaranteed "Verified" status',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-[#9E3B33]">
              <XIcon size={13} className="mt-0.5 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* How Verification Works */}
      <div className="card-cream p-6 mb-12">
        <h2 className="text-base font-bold text-[#1C1C1C] mb-5 flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#A9BBA0]" />
          How Verification Works
        </h2>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#D6D3C8]" />
          {[
            { step: '1', label: 'Business submits claim', desc: 'Submits a specific environmental claim for a registered product' },
            { step: '2', label: 'Environmental gate', desc: 'Non-environmental claims are automatically rejected' },
            { step: '3', label: 'Evidence evaluation', desc: 'Uploaded evidence and independent sources are analysed' },
            { step: '4', label: 'Rules engine', desc: 'ISO 14021, FTC Green Guides, and GreenLedger rules are applied' },
            { step: '5', label: 'Verdict issued', desc: 'Verified · Insufficient Evidence · Potential Greenwashing' },
            { step: '6', label: 'Public record created', desc: 'A permanent, public verification record and QR code are generated' },
          ].map((s) => (
            <div key={s.step} className="relative pl-12 pb-6 last:pb-0">
              <div className="absolute left-0 w-10 h-10 rounded-full bg-[#1B3A2B] border-2 border-[#A9BBA0]/30 flex items-center justify-center z-10">
                <span className="text-xs font-bold text-[#A9BBA0]">{s.step}</span>
              </div>
              <p className="text-sm font-semibold text-[#1C1C1C]">{s.label}</p>
              <p className="text-xs text-[#718875] mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final Brand Message & CTA */}
      <div className="text-center py-8 border-t border-[#D6D3C8]">
        <h2 className="text-2xl font-bold text-[#1C1C1C] mb-2 font-serif">
          &ldquo;Green claims shouldn&apos;t depend on trust alone.&rdquo;
        </h2>
        <p className="text-sm text-[#718875] max-w-xl mx-auto mb-6">
          GreenLedger makes the evidence behind environmental claims easier to understand, verify and share.
        </p>
        <Link href="/verify" className="btn-primary inline-flex items-center gap-2">
          Start verifying <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

