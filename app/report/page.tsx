'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Upload, CheckCircle2, ShieldAlert, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const REASONS = [
  'Claim is vague, generic, or lacks measurable metrics',
  'Claim appears exaggerated or unverified by third parties',
  'Product lacks the specific certification it advertises',
  'Public environmental reports directly contradict statement',
  'Claim uses restricted terms under ISO 14021 guidelines',
  'Other governance or transparency concern',
];

function ReportFormContent() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    brand: '',
    claim: '',
    reason: '',
    additionalInfo: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    const claimParam = searchParams.get('claim') || '';
    const brandParam = searchParams.get('brand') || '';
    if (claimParam || brandParam) {
      setForm((prev) => ({
        ...prev,
        claim: claimParam || prev.claim,
        brand: brandParam || prev.brand,
      }));
    }
  }, [searchParams]);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F3F0E8] pt-28 pb-20 flex items-center justify-center px-6">
        <div className="max-w-md w-full card-cream p-8 rounded-2xl border-2 border-[#12382A]/30 text-center shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#12382A] text-[#63D6A2] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#102019] mb-3">
            Report Submitted to Review
          </h2>
          <p className="text-xs sm:text-sm text-[#718078] leading-relaxed mb-6">
            Thank you for strengthening environmental transparency. Your report has been added to our public audit queue.
          </p>
          <div className="p-3.5 rounded-xl bg-[#E9E6DC] text-xs font-mono text-[#102019] mb-8 text-left">
            <p><strong>Tracking Ticket:</strong> GL-REP-{Math.floor(100000 + Math.random() * 900000)}</p>
            <p className="mt-1 text-[#718078]">Audit review timeline: 3–5 business days</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <Link href="/ledger" className="btn-primary w-full justify-center">
              View Community Ledger <ArrowRight size={14} />
            </Link>
            <Link href="/" className="btn-ghost w-full justify-center text-xs">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F0E8] pt-24 pb-20">
      {/* Header Banner */}
      <div className="bg-[#0B241A] text-[#F3F0E8] py-16 px-6 border-b border-[#12382A]">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/ledger"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#63D6A2] hover:underline mb-4"
          >
            <ArrowLeft size={13} /> BACK TO LEDGER
          </Link>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#F3F0E8] mb-3">
            Report a Suspicious Claim
          </h1>
          <p className="text-base sm:text-lg text-[#F3F0E8]/75 font-light">
            Help verify the marketplace. Flag vague or unsubstantiated environmental marketing claims for structured review.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-6">
        <form onSubmit={handleSubmit} className="card-cream p-7 sm:p-9 rounded-2xl border-2 border-[#C8CEC5] shadow-xl space-y-6">
          {/* Brand/Product */}
          <div>
            <label htmlFor="brand" className="block text-xs font-mono font-semibold text-[#12382A] uppercase tracking-wider mb-2">
              Product &amp; Brand Name <span className="text-[#C95C5C]">*</span>
            </label>
            <input
              id="brand"
              type="text"
              required
              value={form.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
              placeholder="e.g. EcoSpark Co. — Natural Liquid Laundry Detergent"
              className="w-full px-4 py-3 text-sm bg-[#FAF8F3] border border-[#C8CEC5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12382A] text-[#102019]"
            />
          </div>

          {/* Claim */}
          <div>
            <label htmlFor="claim" className="block text-xs font-mono font-semibold text-[#12382A] uppercase tracking-wider mb-2">
              Exact Environmental Claim Phrase <span className="text-[#C95C5C]">*</span>
            </label>
            <textarea
              id="claim"
              required
              value={form.claim}
              onChange={(e) => handleChange('claim', e.target.value)}
              placeholder="Paste the exact claim statement as it appears on the label or digital advertisement..."
              rows={3}
              className="w-full px-4 py-3 text-sm bg-[#FAF8F3] border border-[#C8CEC5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12382A] text-[#102019] resize-y"
            />
          </div>

          {/* Supporting photo */}
          <div>
            <p className="block text-xs font-mono font-semibold text-[#12382A] uppercase tracking-wider mb-2">
              Photo / Package Evidence (Optional)
            </p>
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center gap-3 border-2 border-dashed border-[#C8CEC5] bg-[#FAF8F3] rounded-xl p-5 cursor-pointer hover:border-[#12382A] hover:bg-[#E9E6DC] transition-all"
            >
              <Upload size={20} className="text-[#12382A]" />
              <div>
                <p className="text-sm font-medium text-[#102019]">
                  {fileName ? fileName : 'Upload packaging photo or advert screenshot'}
                </p>
                <p className="text-xs font-mono text-[#718078]">JPG, PNG, WEBP up to 10MB</p>
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
              aria-label="Upload packaging photo"
            />
          </div>

          {/* Reason selection */}
          <div>
            <p className="block text-xs font-mono font-semibold text-[#12382A] uppercase tracking-wider mb-2.5">
              Reason for Review <span className="text-[#C95C5C]">*</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleChange('reason', r)}
                  className={cn(
                    'text-left text-xs p-3.5 rounded-xl border transition-all',
                    form.reason === r
                      ? 'border-[#0B241A] bg-[#0B241A] text-[#63D6A2] font-semibold shadow-sm'
                      : 'border-[#C8CEC5] bg-[#FAF8F3] text-[#102019] hover:border-[#12382A]'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Additional context */}
          <div>
            <label htmlFor="additional" className="block text-xs font-mono font-semibold text-[#12382A] uppercase tracking-wider mb-2">
              Additional Context or Link (Optional)
            </label>
            <textarea
              id="additional"
              value={form.additionalInfo}
              onChange={(e) => handleChange('additionalInfo', e.target.value)}
              placeholder="Provide web links to product listings, manufacturer website, or additional observations..."
              rows={3}
              className="w-full px-4 py-3 text-sm bg-[#FAF8F3] border border-[#C8CEC5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12382A] text-[#102019] resize-y"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!form.brand || !form.claim || !form.reason}
            className={cn(
              'w-full py-4 rounded-xl font-semibold text-base transition-all shadow-md',
              form.brand && form.claim && form.reason
                ? 'btn-mint py-4'
                : 'bg-[#C8CEC5] text-[#718078] cursor-not-allowed border-none shadow-none'
            )}
          >
            SUBMIT CLAIM FOR VERIFICATION REVIEW
          </button>

          <p className="text-[11px] font-mono text-[#718078] text-center leading-relaxed">
            All reports are queued for structured audit against ISO 14021 criteria. Submissions do not automatically label any product.
          </p>
        </form>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F3F0E8] flex items-center justify-center">
          <Loader2 size={32} className="text-[#12382A] animate-spin" />
        </div>
      }
    >
      <ReportFormContent />
    </Suspense>
  );
}
