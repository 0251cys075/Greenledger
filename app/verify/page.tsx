'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  Upload,
  Camera,
  Sparkles,
  X,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { DEMO_CLAIMS } from '@/lib/mock-data';
import { classifyEnvironmentalClaim } from '@/lib/claim-classifier';
import ProductCodeScannerModal from '@/components/verify/ProductCodeScannerModal';
import { cn } from '@/lib/utils';

function VerifyFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [claim, setClaim] = useState('');
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<{
    message: string;
    suggestion?: string;
    reason?: string;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Read URL search parameter if user arrived from clicking a sample claim
  useEffect(() => {
    const claimParam = searchParams.get('claim');
    if (claimParam) {
      setClaim(claimParam);
      setValidationError(null);
      const matched = DEMO_CLAIMS.find(
        (d) => d.claim_text.toLowerCase() === claimParam.toLowerCase().trim()
      );
      if (matched) {
        setActiveDemo(matched.id);
      }
    }
  }, [searchParams]);

  function handleDemoClick(demoId: string, claimText: string) {
    setActiveDemo(demoId);
    setClaim(claimText);
    setValidationError(null);
  }

  function handleVerify() {
    const trimmed = claim.trim();
    if (!trimmed) return;

    // STEP 1 & 2: Mandatory Environmental Claim Relevance Check
    // Prevent non-environmental text from entering the verification pipeline
    const classification = classifyEnvironmentalClaim(trimmed);

    if (!classification.isEnvironmentalClaim) {
      setValidationError({
        message: classification.message || 'GreenLedger verifies environmental and sustainability claims only.',
        suggestion: classification.suggestion,
        reason: classification.reason,
      });
      return;
    }

    setValidationError(null);

    const matchedDemo = DEMO_CLAIMS.find(
      (d) => d.claim_text.toLowerCase() === trimmed.toLowerCase()
    );
    const resultId = matchedDemo ? matchedDemo.id : 'custom';
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('gl_claim', trimmed);
      sessionStorage.setItem('gl_demo_id', matchedDemo?.id || '');
    }
    router.push(`/analysis?id=${resultId}`);
  }

  function processFileUpload(file: File) {
    setFileName(file.name);
    setIsScanningOCR(true);
    setTimeout(() => {
      setIsScanningOCR(false);
      setClaim('100% Recyclable & Carbon Neutral Packaging');
      setActiveDemo(null);
    }, 700);
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFileUpload(file);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      processFileUpload(file);
    }
  }



  return (
    <div className="min-h-screen bg-[#F3F0E8] pt-24 pb-20">
      {/* Editorial Header Banner - Dark Forest */}
      <div className="bg-[#0B241A] text-[#F3F0E8] py-16 px-6 border-b border-[#12382A]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-mono font-semibold text-[#63D6A2] uppercase tracking-widest px-3 py-1 rounded bg-[#12382A] border border-[#63D6A2]/25 mb-4 inline-block">
            Verification Terminal
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#F3F0E8] mb-3">
            Verify an Environmental Claim
          </h1>
          <p className="text-base sm:text-lg text-[#F3F0E8]/75 font-light">
            Evidence, not marketing. Enter a product claim to cross-reference with public audit registries.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-6">
        {/* Sample claims pills */}
        <div className="mb-6 p-4 rounded-xl bg-[#FAF8F3] border border-[#C8CEC5] shadow-sm">
          <p className="text-xs font-mono font-semibold text-[#12382A] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#63D6A2]" />
            Quick Demo — Select Sample Claim
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {DEMO_CLAIMS.map((demo) => {
              const isActive = activeDemo === demo.id || claim === demo.claim_text;
              return (
                <button
                  key={demo.id}
                  onClick={() => handleDemoClick(demo.id, demo.claim_text)}
                  className={cn(
                    'text-left p-3 rounded-lg border transition-all text-xs flex flex-col justify-between cursor-pointer',
                    isActive
                      ? 'border-[#0B241A] bg-[#0B241A] text-[#F3F0E8] shadow-md ring-1 ring-[#63D6A2]'
                      : 'border-[#C8CEC5] bg-[#F3F0E8] hover:border-[#0B241A] text-[#102019]'
                  )}
                  aria-pressed={isActive}
                >
                  <p className="font-medium mb-1 line-clamp-1">&ldquo;{demo.claim_text}&rdquo;</p>
                  <span className="text-[10px] font-mono opacity-80 uppercase">
                    {demo.expected_verdict.replace('_', ' ').toLowerCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Verification Card */}
        <div className="bg-[#FAF8F3] border-2 border-[#12382A]/20 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8">
          <label htmlFor="claim-input" className="block text-xs font-mono font-semibold text-[#12382A] uppercase tracking-wider mb-3">
            Product Environmental Claim
          </label>

          <div className="relative mb-6">
            <textarea
              id="claim-input"
              className="claim-textarea"
              value={claim}
              onChange={(e) => {
                setClaim(e.target.value);
                setActiveDemo(null);
                if (validationError) setValidationError(null);
              }}
              placeholder="Paste an environmental claim from product packaging, advertisements, or e-commerce listing (e.g. &quot;100% Eco-Friendly&quot; or &quot;Made with 70% recycled ocean plastic&quot;)..."
              rows={4}
            />
            {claim && (
              <button
                onClick={() => {
                  setClaim('');
                  setActiveDemo(null);
                  setFileName(null);
                  setValidationError(null);
                }}
                className="absolute top-3.5 right-3.5 p-1.5 rounded-lg bg-[#E9E6DC] text-[#718078] hover:text-[#102019] hover:bg-[#C8CEC5] transition-colors"
                aria-label="Clear claim"
                title="Clear input"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Non-environmental claim rejection banner */}
          {validationError && (
            <div className="mb-6 p-4 rounded-xl bg-[#C95C5C]/10 border-2 border-[#C95C5C]/40 text-[#102019] animate-fade-in">
              <div className="flex items-start gap-3 mb-2">
                <AlertCircle size={20} className="text-[#C95C5C] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-[#962A2A]">
                    ⚠️ This doesn&apos;t appear to be an environmental claim.
                  </h3>
                  <p className="text-xs text-[#102019]/90 mt-1 leading-relaxed">
                    GreenLedger verifies sustainability and environmental claims such as recycled content, recyclability, carbon emissions, renewable materials, certifications, and sustainable packaging.
                  </p>
                  {validationError.reason && (
                    <p className="text-[11px] font-mono text-[#718078] mt-1.5">
                      Notice: {validationError.reason}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#C95C5C]/20 flex items-center justify-between flex-wrap gap-2">
                <p className="text-[11px] text-[#718078] italic">
                  Tip: {validationError.suggestion || 'Provide a statement regarding materials, recyclability, or emissions.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setClaim('');
                    setValidationError(null);
                    const textarea = document.getElementById('claim-input');
                    textarea?.focus();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#12382A] text-[#F3F0E8] text-xs font-mono font-semibold hover:bg-[#1B4D3A] transition-colors cursor-pointer"
                >
                  Try Another Claim
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#C8CEC5]" />
            <span className="text-[11px] font-mono font-semibold text-[#718078] tracking-widest">OR ATTACH EVIDENCE</span>
            <div className="flex-1 h-px bg-[#C8CEC5]" />
          </div>

          {/* Image upload zone */}
          <div
            className={cn(
              'border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer mb-6',
              dragOver
                ? 'border-[#63D6A2] bg-[#63D6A2]/10'
                : 'border-[#C8CEC5] bg-[#F3F0E8] hover:border-[#12382A] hover:bg-[#E9E6DC]'
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload product label or photo"
            onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              aria-label="Upload file"
            />
            {isScanningOCR ? (
              <div className="flex flex-col items-center justify-center py-2">
                <Loader2 size={24} className="text-[#12382A] animate-spin mb-2" />
                <p className="text-sm font-semibold text-[#102019]">Extracting text via OCR scan...</p>
                <p className="text-xs font-mono text-[#718078]">Isolating environmental statement from packaging</p>
              </div>
            ) : fileName ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#12382A] text-[#63D6A2] flex items-center justify-center">
                  <CheckCircle2 size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#102019]">{fileName}</p>
                  <p className="text-xs font-mono text-[#4FAF78] font-semibold">
                    ✓ OCR parsed: &ldquo;100% Recyclable &amp; Carbon Neutral Packaging&rdquo;
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Upload size={24} className="text-[#12382A] mx-auto mb-2 opacity-70" />
                <p className="text-sm font-medium text-[#102019] mb-1">
                  Upload Product Image or Package Photo
                </p>
                <p className="text-xs font-mono text-[#718078]">
                  Drag &amp; drop or click · JPG, PNG, WEBP · OCR will isolate environmental claims
                </p>
              </div>
            )}
          </div>

          {/* Unified Scanner Trigger */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3 text-xs font-mono font-semibold text-[#12382A] border border-[#C8CEC5] rounded-xl hover:bg-[#E9E6DC] hover:border-[#12382A] transition-all mb-8 cursor-pointer"
            onClick={() => setQrModalOpen(true)}
          >
            <Camera size={15} />
            Scan Product QR / Barcode
          </button>

          {/* Primary submit */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={!claim.trim()}
            className={cn(
              'w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer',
              claim.trim()
                ? 'btn-mint py-4'
                : 'bg-[#C8CEC5] text-[#718078] cursor-not-allowed border-none shadow-none'
            )}
            aria-disabled={!claim.trim()}
          >
            VERIFY CLAIM NOW
            <ArrowRight size={18} className={claim.trim() ? '' : 'opacity-40'} />
          </button>
        </div>

        {/* Trust disclaimer */}
        <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-[#E9E6DC] border border-[#C8CEC5] text-xs text-[#718078] leading-relaxed">
          <ShieldCheck size={18} className="text-[#12382A] flex-shrink-0 mt-0.5" />
          <p>
            <strong>Auditable Rules Engine:</strong> GreenLedger checks public third-party sustainability databases,
            independent certification registries, and life-cycle disclosures. Results express verified evidence
            availability rather than legal determinations.
          </p>
        </div>
      </div>

      {/* Unified Product Code Scanner Modal (QR & 1D Barcodes) */}
      <ProductCodeScannerModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        onSelectClaim={(scannedClaim, resultId) => {
          setClaim(scannedClaim);
          if (resultId) {
            setActiveDemo(resultId);
          }
          setQrModalOpen(false);
        }}
      />
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F3F0E8] flex items-center justify-center">
          <Loader2 size={32} className="text-[#12382A] animate-spin" />
        </div>
      }
    >
      <VerifyFormContent />
    </Suspense>
  );
}
