'use client';

import { useState, useRef, useEffect, Suspense, useCallback } from 'react';
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
  ImageIcon,
  FileText,
} from 'lucide-react';
import { DEMO_CLAIMS } from '@/lib/mock-data';
import { analyzeMultilingualClaim } from '@/lib/multilingual-nlp';
import { useTranslation } from '@/lib/i18n-context';
import ProductCodeScannerModal from '@/components/verify/ProductCodeScannerModal';
import { cn } from '@/lib/utils';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function VerifyFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useTranslation();

  const [claim, setClaim] = useState('');
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<{
    message: string;
    suggestion?: string;
    reason?: string;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<any>(null);

  // Initialize Tesseract worker
  useEffect(() => {
    let active = true;
    if (typeof window !== 'undefined') {
      import('tesseract.js').then(async ({ createWorker }) => {
        try {
          const worker = await createWorker('eng');
          if (active) {
            workerRef.current = worker;
          } else {
            await worker.terminate().catch(() => {});
          }
        } catch {
          // Worker creation failed - will show error on use
        }
      }).catch(() => {});
    }
    return () => {
      active = false;
      if (workerRef.current && typeof workerRef.current.terminate === 'function') {
        workerRef.current.terminate().catch(() => {});
        workerRef.current = null;
      }
    };
  }, []);

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

    // STEP 1 & 2: Multilingual Environmental Claim Relevance Check
    // Prevent non-environmental text in ANY of the 8 languages from entering pipeline
    const analysis = analyzeMultilingualClaim(trimmed, language);

    if (!analysis.isEnvironmentalClaim) {
      setValidationError({
        message: analysis.message || t('verify.nonEnvMessage'),
        suggestion: analysis.suggestion || t('verify.nonEnvSuggestion'),
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
      sessionStorage.setItem('gl_language', language);
    }
    router.push(`/analysis?id=${resultId}`);
  }

  function removeFile() {
    setFileName(null);
    setFilePreview(null);
    setClaim('');
    setActiveDemo(null);
    setOcrError(null);
    setOcrProgress(0);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  }

  async function processFileUpload(file: File) {
    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setOcrError('Unsupported file type. Please upload JPG, PNG, or WebP images.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setOcrError('File size exceeds 10MB limit. Please upload a smaller image.');
      return;
    }

    setFileName(file.name);
    setOcrError(null);
    setOcrProgress(0);
    setIsScanningOCR(true);

    // Create object URL for preview
    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);

    try {
      if (!workerRef.current || typeof workerRef.current.recognize !== 'function') {
        const { createWorker } = await import('tesseract.js');
        const worker = await createWorker('eng+hin+ben+mar+tel+tam+kan', 1, {
          logger: (m: any) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round((m.progress || 0) * 100));
            }
          },
        });
        workerRef.current = worker;
      }

      const { data: { text } } = await workerRef.current.recognize(file);

      setIsScanningOCR(false);
      setOcrProgress(100);

      const extractedText = text.trim();
      if (extractedText) {
        // Clean up the extracted text - remove excessive whitespace
        const cleanedText = extractedText.replace(/\s+/g, ' ').trim();
        setClaim(cleanedText);
        setActiveDemo(null);
      } else {
        setOcrError('No text could be extracted from the image. Please try a clearer photo.');
      }
    } catch (err) {
      console.error('OCR error:', err);
      setIsScanningOCR(false);
      setOcrError('OCR processing failed. Please try again or enter the claim manually.');
    }
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
    <div className="min-h-screen bg-[#F7F5F0] pt-24 pb-20">
      {/* Editorial Header Banner - Dark Forest */}
      <div className="bg-[#1B3A2B] text-[#F7F5F0] py-16 px-6 border-b border-[#315C45]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-mono font-semibold text-[#A9BBA0] uppercase tracking-widest px-3 py-1 rounded bg-[#315C45] border border-[#A9BBA0]/25 mb-4 inline-block">
            Verification Terminal
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#F7F5F0] mb-3">
            {t('verify.pageTitle')}
          </h1>
          <p className="text-base sm:text-lg text-[#F7F5F0]/75 font-light">
            {t('verify.pageSubtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-6">
        {/* Sample claims pills */}
        <div className="mb-6 p-4 rounded-xl bg-[#FCFAF5] border border-[#D6D3C8] shadow-sm">
          <p className="text-xs font-mono font-semibold text-[#315C45] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#A9BBA0]" />
            {t('verify.sampleClaimsTitle')}
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
                      ? 'border-[#1B3A2B] bg-[#1B3A2B] text-[#F7F5F0] shadow-md ring-1 ring-[#A9BBA0]'
                      : 'border-[#D6D3C8] bg-[#F7F5F0] hover:border-[#1B3A2B] text-[#1C1C1C]'
                  )}
                  aria-pressed={isActive}
                >
                  <p className="font-medium mb-1 line-clamp-1">&ldquo;{demo.claim_text}&rdquo;</p>
                  <span className="text-[10px] font-mono opacity-80 uppercase">
                    {t(`verdict.${demo.expected_verdict}`) || demo.expected_verdict.replace('_', ' ').toLowerCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Verification Card */}
        <div className="bg-[#FCFAF5] border-2 border-[#315C45]/20 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8">
          <label htmlFor="claim-input" className="block text-xs font-mono font-semibold text-[#315C45] uppercase tracking-wider mb-3">
            {t('verify.inputLabel')}
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
              placeholder={t('verify.inputPlaceholder')}
              rows={4}
            />
            {claim && (
              <button
                onClick={() => {
                  setClaim('');
                  setActiveDemo(null);
                  setFileName(null);
                  setFilePreview(null);
                  setValidationError(null);
                  setOcrError(null);
                  setOcrProgress(0);
                  if (fileRef.current) fileRef.current.value = '';
                }}
                className="absolute top-3.5 right-3.5 p-1.5 rounded-lg bg-[#EFECE4] text-[#718875] hover:text-[#1C1C1C] hover:bg-[#D6D3C8] transition-colors"
                aria-label="Clear claim"
                title="Clear input"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Non-environmental claim rejection banner */}
          {validationError && (
            <div className="mb-6 p-4 rounded-xl bg-[#C1443E]/10 border-2 border-[#C1443E]/40 text-[#1C1C1C] animate-fade-in">
              <div className="flex items-start gap-3 mb-2">
                <AlertCircle size={20} className="text-[#C1443E] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-[#9E3B33]">
                    ⚠️ This doesn&apos;t appear to be an environmental claim.
                  </h3>
                  <p className="text-xs text-[#1C1C1C]/90 mt-1 leading-relaxed">
                    GreenLedger verifies sustainability and environmental claims such as recycled content, recyclability, carbon emissions, renewable materials, certifications, and sustainable packaging.
                  </p>
                  {validationError.reason && (
                    <p className="text-[11px] font-mono text-[#718875] mt-1.5">
                      Notice: {validationError.reason}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#C1443E]/20 flex items-center justify-between flex-wrap gap-2">
                <p className="text-[11px] text-[#718875] italic">
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
                  className="px-3 py-1.5 rounded-lg bg-[#315C45] text-[#F7F5F0] text-xs font-mono font-semibold hover:bg-[#2A533F] transition-colors cursor-pointer"
                >
                  Try Another Claim
                </button>
              </div>
            </div>
          )}

          {/* OCR Error banner */}
          {ocrError && (
            <div className="mb-6 p-4 rounded-xl bg-[#C1443E]/10 border-2 border-[#C1443E]/40 text-[#1C1C1C] animate-fade-in">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-[#C1443E] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-[#9E3B33]">OCR Processing Error</h3>
                  <p className="text-xs text-[#1C1C1C]/90 mt-1 leading-relaxed">{ocrError}</p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="px-3 py-1.5 rounded-lg bg-[#315C45] text-[#F7F5F0] text-xs font-mono font-semibold hover:bg-[#2A533F] transition-colors cursor-pointer flex-shrink-0"
                >
                  Remove Image
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#D6D3C8]" />
            <span className="text-[11px] font-mono font-semibold text-[#718875] tracking-widest">OR ATTACH EVIDENCE</span>
            <div className="flex-1 h-px bg-[#D6D3C8]" />
          </div>

          {/* Image upload zone */}
          <div
            className={cn(
              'border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer mb-6',
              dragOver
                ? 'border-[#A9BBA0] bg-[#A9BBA0]/10'
                : 'border-[#D6D3C8] bg-[#F7F5F0] hover:border-[#315C45] hover:bg-[#EFECE4]',
              fileName && 'cursor-default'
            )}
            onDragOver={(e) => {
              e.preventDefault();
              if (!fileName) setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => !fileName && fileRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload product label or photo"
            onKeyDown={(e) => !fileName && e.key === 'Enter' && fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
              aria-label="Upload file"
            />
            {isScanningOCR ? (
              <div className="flex flex-col items-center justify-center py-2">
                <Loader2 size={24} className="text-[#315C45] animate-spin mb-2" />
                <p className="text-sm font-semibold text-[#1C1C1C]">{t('verify.ocrScanning') || 'Extracting text via OCR scan...'}</p>
                <p className="text-xs font-mono text-[#718875]">Progress: {ocrProgress}%</p>
              </div>
            ) : filePreview ? (
              <div className="space-y-4">
                <div className="relative max-w-xs mx-auto">
                  <img
                    src={filePreview}
                    alt="Uploaded packaging"
                    className="w-full h-auto max-h-48 rounded-lg border border-[#D6D3C8] object-contain"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(); }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#1C1C1C]">{fileName}</p>
                  {claim && (
                    <p className="text-xs font-mono text-[#3E7D4F] font-semibold mt-1">
                      ✓ OCR extracted: &ldquo;{claim.length > 80 ? claim.substring(0, 80) + '…' : claim}&rdquo;
                    </p>
                  )}
                </div>
                <button
                  onClick={removeFile}
                  className="px-4 py-2 text-xs font-mono text-[#315C45] border border-[#D6D3C8] rounded-lg hover:bg-[#EFECE4] hover:border-[#315C45] transition-colors cursor-pointer w-full"
                >
                  <X size={12} className="inline mr-1" /> Remove & Replace Image
                </button>
              </div>
            ) : (
              <div>
                <Upload size={24} className="text-[#315C45] mx-auto mb-2 opacity-70" />
                <p className="text-sm font-medium text-[#1C1C1C] mb-1">
                  {t('verify.dragDropTitle')}
                </p>
                <p className="text-xs font-mono text-[#718875]">
                  {t('verify.dragDropSubtitle')}
                </p>
              </div>
            )}
          </div>

          {/* Unified Scanner Trigger */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3 text-xs font-mono font-semibold text-[#315C45] border border-[#D6D3C8] rounded-xl hover:bg-[#EFECE4] hover:border-[#315C45] transition-all mb-8 cursor-pointer"
            onClick={() => setQrModalOpen(true)}
          >
            <Camera size={15} />
            {t('verify.scanProductCode')}
          </button>

          {/* Primary submit */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={!claim.trim()}
            className={cn(
              'w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer uppercase tracking-wider',
              claim.trim()
                ? 'btn-mint py-4'
                : 'bg-[#D6D3C8] text-[#718875] cursor-not-allowed border-none shadow-none'
            )}
            aria-disabled={!claim.trim()}
          >
            {t('verify.verifyClaimNow')}
            <ArrowRight size={18} className={claim.trim() ? '' : 'opacity-40'} />
          </button>
        </div>

        {/* Trust disclaimer */}
        <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-[#EFECE4] border border-[#D6D3C8] text-xs text-[#718875] leading-relaxed">
          <ShieldCheck size={18} className="text-[#315C45] flex-shrink-0 mt-0.5" />
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
        <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
          <Loader2 size={32} className="text-[#315C45] animate-spin" />
        </div>
      }
    >
      <VerifyFormContent />
    </Suspense>
  );
}