'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Camera,
  QrCode,
  Barcode,
  ScanLine,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Search,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  inferBarcodeFormat,
  DEMO_SCAN_PRODUCTS,
  type BarcodeLookupResult,
} from '@/lib/barcode-registry';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n-context';

interface ProductCodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClaim: (claimText: string, resultId?: string) => void;
}

export default function ProductCodeScannerModal({
  isOpen,
  onClose,
  onSelectClaim,
}: ProductCodeScannerModalProps) {
  const { t } = useTranslation();
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<BarcodeLookupResult | null>(null);
  const [detectorSupported, setDetectorSupported] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setIsScanning(false);
  }, []);

  // Perform backend product lookup
  const performLookup = useCallback(async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;

    setLookupLoading(true);
    setLookupResult(null);

    try {
      const res = await fetch(`/api/products/barcode/${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        throw new Error(`Lookup failed with status ${res.status}`);
      }
      const data: BarcodeLookupResult = await res.json();
      setLookupResult(data);
    } catch (err: any) {
      setLookupResult({
        found: false,
        barcode: trimmed,
        detectedFormat: inferBarcodeFormat(trimmed),
        error: 'Network or backend error during product lookup. Please check connection and retry.',
      });
    } finally {
      setLookupLoading(false);
    }
  }, []);

  // Start camera stream & BarcodeDetector
  const startCamera = useCallback(async () => {
    setCameraError(null);
    setLookupResult(null);

    if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is not supported in this browser environment.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraActive(true);
      setIsScanning(true);

      // Check BarcodeDetector web standard
      if ('BarcodeDetector' in window) {
        setDetectorSupported(true);
        try {
          const detector = new (window as any).BarcodeDetector({
            formats: [
              'qr_code',
              'ean_13',
              'ean_8',
              'upc_a',
              'upc_e',
              'code_128',
              'code_39',
              'itf',
            ],
          });

          // Detection loop
          scanIntervalRef.current = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
              try {
                const barcodes = await detector.detect(videoRef.current);
                if (barcodes && barcodes.length > 0) {
                  const detected = barcodes[0];
                  stopCamera();
                  await performLookup(detected.rawValue);
                }
              } catch {
                // Keep scanning
              }
            }
          }, 350);
        } catch {
          setDetectorSupported(false);
        }
      } else {
        setDetectorSupported(false);
      }
    } catch (err: any) {
      setCameraActive(false);
      setIsScanning(false);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera permissions in your browser settings, or enter the code manually below.');
      } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
        setCameraError('No video camera was found on this device. You can enter the product code manually below.');
      } else {
        setCameraError('Camera could not be initialized. You can enter the product code manually below.');
      }
    }
  }, [stopCamera, performLookup]);

  // Handle lifecycle of modal opening/closing
  useEffect(() => {
    if (isOpen) {
      setLookupResult(null);
      setManualCode('');
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      stopCamera();
      performLookup(manualCode.trim());
    }
  };

  const handleDemoClick = (demoCode: string) => {
    stopCamera();
    setManualCode(demoCode);
    performLookup(demoCode);
  };

  const handleApplyResult = () => {
    if (lookupResult?.found && lookupResult.product) {
      onSelectClaim(
        lookupResult.product.claim_text,
        lookupResult.greenledgerRecord?.id
      );
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scanner-modal-title"
    >
      <div className="card-cream max-w-lg w-full p-6 sm:p-7 rounded-2xl border-2 border-[#315C45]/30 shadow-2xl relative my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#EFECE4] text-[#718875] hover:text-[#1C1C1C] hover:bg-[#D6D3C8] transition-colors cursor-pointer z-20"
          aria-label="Close product code scanner"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#315C45] text-[#A9BBA0] text-xs font-mono mb-3">
            <Barcode size={15} />
            <QrCode size={15} />
            <span>Unified Code Scanner</span>
          </div>
          <h2 id="scanner-modal-title" className="font-serif text-2xl text-[#1C1C1C]">
            {t('scanner.modalTitle')}
          </h2>
          <p className="text-xs text-[#718875] font-light mt-1 max-w-sm mx-auto">
            {t('scanner.modalSubtitle')}
          </p>
        </div>

        {/* Camera Viewfinder / Frame */}
        <div className="relative w-full max-w-[280px] h-[220px] mx-auto mb-6 bg-[#1B3A2B] rounded-2xl border-2 border-[#A9BBA0]/40 overflow-hidden flex items-center justify-center shadow-inner">
          <video
            ref={videoRef}
            playsInline
            muted
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              cameraActive ? 'opacity-100' : 'opacity-0 absolute'
            )}
          />

          {/* Scanning frame overlay */}
          <div className="absolute inset-3 border-2 border-[#A9BBA0]/50 rounded-xl pointer-events-none">
            {/* Viewfinder corner accents */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#A9BBA0]" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#A9BBA0]" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#A9BBA0]" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#A9BBA0]" />
          </div>

          {/* Laser Scanning Animation */}
          {cameraActive && isScanning && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#A9BBA0] shadow-[0_0_12px_#A9BBA0] animate-bounce pointer-events-none" />
          )}

          {/* Placeholder or Status indicator */}
          {!cameraActive && (
            <div className="text-center p-4 z-10">
              <Camera size={36} className="text-[#A9BBA0] opacity-60 mx-auto mb-2" />
              <p className="text-xs font-mono text-[#F7F5F0]/70">
                {cameraError ? 'Camera offline' : 'Initializing camera...'}
              </p>
            </div>
          )}

          {/* Scanning badge */}
          {cameraActive && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-mono text-[#A9BBA0] border border-[#A9BBA0]/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#A9BBA0] animate-pulse" />
              <span>{detectorSupported ? 'Detecting QR & Barcodes' : 'Align code in frame'}</span>
            </div>
          )}
        </div>

        {/* Camera error notification if any */}
        {cameraError && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#C1443E]/10 border border-[#C1443E]/30 flex items-start gap-2.5 text-xs text-[#9E3B33]">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-0.5">Camera Unavailable</p>
              <p className="text-[11px] leading-relaxed opacity-90">{cameraError}</p>
            </div>
          </div>
        )}

        {/* Lookup Loading state */}
        {lookupLoading && (
          <div className="mb-5 p-4 rounded-xl bg-[#1B3A2B] text-[#F7F5F0] text-center border border-[#A9BBA0]/30">
            <Loader2 size={24} className="animate-spin text-[#A9BBA0] mx-auto mb-2" />
            <p className="text-xs font-mono text-[#A9BBA0] font-semibold">
              Querying GreenLedger Product Registry...
            </p>
            <p className="text-[11px] text-[#F7F5F0]/70 mt-0.5">Resolving barcode to auditable verification record</p>
          </div>
        )}

        {/* Lookup Result Display */}
        {lookupResult && !lookupLoading && (
          <div className="mb-5">
            {lookupResult.found && lookupResult.product ? (
              <div className="p-4 rounded-xl bg-[#FCFAF5] border-2 border-[#3E7D4F] shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#315C45] text-[#A9BBA0]">
                    {lookupResult.detectedFormat} DETECTED
                  </span>
                  {lookupResult.isDemo && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#C9A227]/20 text-[#8A6A1E] border border-[#C9A227]/40">
                      DEMO PRODUCT
                    </span>
                  )}
                  {lookupResult.greenledgerRecord && (
                    <StatusBadge status={lookupResult.greenledgerRecord.verificationStatus} size="sm" />
                  )}
                </div>

                <h3 className="font-serif text-lg text-[#1C1C1C] mb-1">
                  {lookupResult.product.name}
                </h3>
                <p className="text-xs font-mono text-[#718875] mb-2.5">
                  Brand: {lookupResult.product.brand} · {lookupResult.product.category}
                </p>

                <div className="p-3 rounded-lg bg-[#EFECE4] border border-[#D6D3C8] mb-3">
                  <span className="text-[10px] font-mono uppercase text-[#718875] block mb-0.5">
                    Verified Statement on Packaging:
                  </span>
                  <p className="text-xs text-[#1C1C1C] italic font-medium">
                    &ldquo;{lookupResult.product.claim_text}&rdquo;
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleApplyResult}
                  className="btn-mint w-full justify-center text-xs py-2.5 font-semibold cursor-pointer"
                >
                  <CheckCircle2 size={15} />
                  {t('scanner.applyClaim')}
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#C1443E]/10 border border-[#C1443E]/40 text-xs text-[#9E3B33]">
                <div className="flex items-start gap-2.5 mb-2">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Product not found in GreenLedger</h4>
                    <p className="text-[11px] font-mono mt-0.5">
                      Code: <span className="font-bold">{lookupResult.barcode}</span> ({lookupResult.detectedFormat})
                    </p>
                  </div>
                </div>

                <p className="text-[11px] leading-relaxed text-[#1C1C1C]/80 mb-3">
                  {lookupResult.error ||
                    'This product or barcode has not yet been registered or audited in GreenLedger. You can manually enter the environmental statement below.'}
                </p>

                {lookupResult.isExternalUrl && lookupResult.externalUrl && (
                  <div className="p-2.5 rounded bg-white/60 border border-[#C1443E]/20 text-[11px] font-mono text-[#1C1C1C] break-all mb-2">
                    External URL: {lookupResult.externalUrl}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Manual Fallback: Enter Product Code Manually */}
        <div className="pt-4 border-t border-[#D6D3C8] mb-5">
          <p className="text-xs font-mono font-semibold text-[#315C45] uppercase tracking-wider mb-2">
            Enter Product Code Manually
          </p>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="e.g. 8901234567890 or greenledger.io/v/DEMO-3"
              className="flex-1 px-3.5 py-2 text-xs bg-[#FCFAF5] border border-[#D6D3C8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#315C45] text-[#1C1C1C] font-mono"
            />
            <button
              type="submit"
              disabled={!manualCode.trim() || lookupLoading}
              className="px-4 py-2 bg-[#315C45] text-[#F7F5F0] text-xs font-mono font-semibold rounded-xl hover:bg-[#2A533F] transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <Search size={14} />
              Look Up Product
            </button>
          </form>
        </div>

        {/* Demo Mode: Demo Products clearly labeled */}
        <div>
          <p className="text-xs font-mono font-semibold text-[#718875] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#315C45]" />
            {t('scanner.simulatedTitle')}
          </p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {DEMO_SCAN_PRODUCTS.map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => handleDemoClick(demo.code)}
                className="w-full text-left p-2.5 rounded-xl bg-[#FCFAF5] border border-[#D6D3C8] hover:border-[#315C45] hover:bg-[#EFECE4] transition-all text-xs flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-semibold text-[#1C1C1C]">{demo.name}</span>
                    <span className="text-[9px] font-mono px-1 rounded bg-[#C9A227]/20 text-[#8A6A1E]">
                      DEMO
                    </span>
                  </div>
                  <p className="text-[10px] text-[#718875] font-mono">
                    {demo.type} · {demo.code}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#315C45] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Scan <ArrowRight size={11} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
