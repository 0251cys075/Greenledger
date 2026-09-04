import { Check, X as XIcon, ShieldCheck, Building2, Users } from 'lucide-react';

function PlanFeature({ text, included }: { text: string; included: boolean }) {
  return (
    <li className="flex items-start gap-3 py-2">
      {included ? (
        <Check size={15} className="text-[#4FAF78] mt-0.5 shrink-0" />
      ) : (
        <XIcon size={15} className="text-[#C8CEC5] mt-0.5 shrink-0" />
      )}
      <span className={`text-sm ${included ? 'text-[#102019]' : 'text-[#98A49D]'}`}>{text}</span>
    </li>
  );
}

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#63D6A2] bg-[#63D6A2]/10 border border-[#63D6A2]/25 px-3 py-1.5 rounded-full mb-4">
          Business Plan
        </span>
        <h1 className="text-3xl font-bold text-[#102019] mb-3">
          Transparent Pricing. <span className="text-[#12382A]">Evidence-Based Verification.</span>
        </h1>
        <p className="text-base text-[#718078] max-w-xl mx-auto leading-relaxed">
          Businesses pay for verification infrastructure and management tools — not for a positive verdict.
          Verification outcomes are always determined by evidence.
        </p>
      </div>

      {/* Trust Principle Banner */}
      <div className="rounded-xl bg-[#0B241A] border border-[#63D6A2]/20 p-5 mb-10 flex items-start gap-4">
        <ShieldCheck size={22} className="text-[#63D6A2] mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold text-[#F3F0E8] mb-1">GreenLedger Trust Principle</p>
          <p className="text-sm text-[#F3F0E8]/70 leading-relaxed">
            <strong className="text-[#63D6A2]">Businesses pay for verification infrastructure and management tools — not for a positive verdict.</strong>{' '}
            Verification outcomes are evidence-based and cannot be purchased. A company that submits false or insufficient evidence will receive the correct verdict regardless of their plan.
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Consumer Plan */}
        <div className="card-cream p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#12382A]/10 border border-[#12382A]/15 flex items-center justify-center">
              <Users size={18} className="text-[#12382A]" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#718078]">Consumers</p>
              <h2 className="text-lg font-bold text-[#102019]">Always Free</h2>
            </div>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-[#102019]">£0</span>
            <span className="text-sm text-[#718078] ml-2">forever</span>
          </div>
          <ul className="space-y-0.5 border-t border-[#C8CEC5] pt-4">
            <PlanFeature text="Scan product QR codes" included />
            <PlanFeature text="Search and verify claims" included />
            <PlanFeature text="View public verification records" included />
            <PlanFeature text="Access community ledger" included />
            <PlanFeature text="Report suspicious claims" included />
            <PlanFeature text="8-language interface" included />
          </ul>
        </div>

        {/* Business Plan */}
        <div className="card-cream p-6 border-2 border-[#63D6A2]/40 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="text-xs font-semibold text-[#0B241A] bg-[#63D6A2] px-2.5 py-1 rounded-full">
              Hackathon Demo
            </span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#63D6A2]/15 border border-[#63D6A2]/30 flex items-center justify-center">
              <Building2 size={18} className="text-[#63D6A2]" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#718078]">Businesses</p>
              <h2 className="text-lg font-bold text-[#102019]">Business SaaS</h2>
            </div>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-[#102019]">£299</span>
            <span className="text-sm text-[#718078] ml-2">/ month</span>
            <p className="text-xs text-[#98A49D] mt-1">No payment required for prototype demo</p>
          </div>
          <ul className="space-y-0.5 border-t border-[#C8CEC5] pt-4">
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
      <div className="rounded-xl bg-[#C95C5C]/08 border border-[#C95C5C]/25 p-6 mb-10">
        <h2 className="text-base font-bold text-[#962A2A] mb-3 flex items-center gap-2">
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
            <div key={item} className="flex items-start gap-2 text-sm text-[#962A2A]">
              <XIcon size={13} className="mt-0.5 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* How Verification Works */}
      <div className="card-cream p-6 mb-10">
        <h2 className="text-base font-bold text-[#102019] mb-5 flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#63D6A2]" />
          How Verification Works
        </h2>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#C8CEC5]" />
          {[
            { step: '1', label: 'Business submits claim', desc: 'Submits a specific environmental claim for a registered product' },
            { step: '2', label: 'Environmental gate', desc: 'Non-environmental claims are automatically rejected' },
            { step: '3', label: 'Evidence evaluation', desc: 'Uploaded evidence and independent sources are analysed' },
            { step: '4', label: 'Rules engine', desc: 'ISO 14021, FTC Green Guides, and GreenLedger rules are applied' },
            { step: '5', label: 'Verdict issued', desc: 'Verified · Insufficient Evidence · Potential Greenwashing' },
            { step: '6', label: 'Public record created', desc: 'A permanent, public verification record and QR code are generated' },
          ].map((s) => (
            <div key={s.step} className="relative pl-12 pb-6 last:pb-0">
              <div className="absolute left-0 w-10 h-10 rounded-full bg-[#0B241A] border-2 border-[#63D6A2]/30 flex items-center justify-center z-10">
                <span className="text-xs font-bold text-[#63D6A2]">{s.step}</span>
              </div>
              <p className="text-sm font-semibold text-[#102019]">{s.label}</p>
              <p className="text-xs text-[#718078] mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
