import { Check, X as XIcon, ShieldCheck, Building2, Users } from 'lucide-react';

function PlanFeature({ text, included }: { text: string; included: boolean }) {
  return (
    <li className="flex items-start gap-3 py-2">
      {included ? (
        <Check size={15} className="text-[#3E7D4F] mt-0.5 shrink-0" />
      ) : (
        <XIcon size={15} className="text-[#D6D3C8] mt-0.5 shrink-0" />
      )}
      <span className={`text-sm ${included ? 'text-[#1C1C1C]' : 'text-[#A8B3AA]'}`}>{text}</span>
    </li>
  );
}

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#A9BBA0] bg-[#A9BBA0]/10 border border-[#A9BBA0]/25 px-3 py-1.5 rounded-full mb-4">
          Business Plan
        </span>
        <h1 className="text-3xl font-bold text-[#1C1C1C] mb-3">
          Transparent Pricing. <span className="text-[#315C45]">Evidence-Based Verification.</span>
        </h1>
        <p className="text-base text-[#718875] max-w-xl mx-auto leading-relaxed">
          Businesses pay for verification infrastructure and management tools — not for a positive verdict.
          Verification outcomes are always determined by evidence.
        </p>
      </div>

      {/* Trust Principle Banner */}
      <div className="rounded-xl bg-[#1B3A2B] border border-[#A9BBA0]/20 p-5 mb-10 flex items-start gap-4">
        <ShieldCheck size={22} className="text-[#A9BBA0] mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold text-[#F7F5F0] mb-1">GreenLedger Trust Principle</p>
          <p className="text-sm text-[#F7F5F0]/70 leading-relaxed">
            <strong className="text-[#A9BBA0]">Businesses pay for verification infrastructure and management tools — not for a positive verdict.</strong>{' '}
            Verification outcomes are evidence-based and cannot be purchased. A company that submits false or insufficient evidence will receive the correct verdict regardless of their plan.
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Consumer Plan */}
        <div className="card-cream p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#315C45]/10 border border-[#315C45]/15 flex items-center justify-center">
              <Users size={18} className="text-[#315C45]" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#718875]">Consumers</p>
              <h2 className="text-lg font-bold text-[#1C1C1C]">Always Free</h2>
            </div>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-[#1C1C1C]">£0</span>
            <span className="text-sm text-[#718875] ml-2">forever</span>
          </div>
          <ul className="space-y-0.5 border-t border-[#D6D3C8] pt-4">
            <PlanFeature text="Scan product QR codes" included />
            <PlanFeature text="Search and verify claims" included />
            <PlanFeature text="View public verification records" included />
            <PlanFeature text="Access community ledger" included />
            <PlanFeature text="Report suspicious claims" included />
            <PlanFeature text="8-language interface" included />
          </ul>
        </div>

        {/* Business Plan */}
        <div className="card-cream p-6 border-2 border-[#A9BBA0]/40 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="text-xs font-semibold text-[#1B3A2B] bg-[#A9BBA0] px-2.5 py-1 rounded-full">
              Hackathon Demo
            </span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#A9BBA0]/15 border border-[#A9BBA0]/30 flex items-center justify-center">
              <Building2 size={18} className="text-[#A9BBA0]" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#718875]">Businesses</p>
              <h2 className="text-lg font-bold text-[#1C1C1C]">Business SaaS</h2>
            </div>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-[#1C1C1C]">£299</span>
            <span className="text-sm text-[#718875] ml-2">/ month</span>
            <p className="text-xs text-[#A8B3AA] mt-1">No payment required for prototype demo</p>
          </div>
          <ul className="space-y-0.5 border-t border-[#D6D3C8] pt-4">
            <PlanFeature text="Everything in Consumer" included />
            <PlanFeature text="Product registration & management" included />
            <PlanFeature text="Environmental claim submission" included />
            <PlanFeature text="Evidence upload (PDF, images, certificates)" included />
            <PlanFeature text="GreenLedger verification engine access" included />
            <PlanFeature text="Public verification records" included />
            <PlanFeature text="Verification QR code generation" included />
            <PlanFeature text="Claim status dashboard" included />
            <PlanFeature text="Evidence strength analysis" included />
            <PlanFeature text="API access for integrations" included />
            <PlanFeature text="White-label verification widget" included />
            <PlanFeature text="Analytics & reporting" included />
            <PlanFeature text="Dedicated account support" included />
          </ul>
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
      <div className="card-cream p-6 mb-10">
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
    </div>
  );
}
