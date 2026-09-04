'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ExternalLink,
  Info,
  Loader2,
} from 'lucide-react';
import type { BusinessProduct, EvidenceFile } from '@/lib/business-store';

const CLAIM_CATEGORIES = [
  'Recycled Materials',
  'Recyclability',
  'Carbon Neutrality',
  'Biodegradability',
  'Energy Efficiency',
  'Renewable Materials',
  'Sustainable Sourcing',
  'Zero Waste',
  'Water Conservation',
  'Other Environmental',
];

const VALID_TYPES: Record<string, boolean> = {
  'application/pdf': true,
  'image/jpeg': true,
  'image/jpg': true,
  'image/png': true,
  'image/webp': true,
};

const EXAMPLE_CLAIMS = [
  'Made with 80% recycled plastic',
  'Packaging contains 70% recycled paper',
  '100% recyclable packaging',
  'Made from renewable materials',
  'Carbon neutral product',
  'FSC certified wood sourcing',
  'Compostable packaging',
  'Uses 40% less plastic than previous version',
];

function FileIconComp({ type }: { type: string }) {
  if (type === 'application/pdf') return <FileText size={16} className="text-[#C1443E]" />;
  return <ImageIcon size={16} className="text-[#A9BBA0]" />;
}

function VerdictResult({
  verdict,
  reason,
  auditId,
  evidenceStrength,
}: {
  verdict: string;
  reason: string;
  auditId: string;
  evidenceStrength: string;
}) {
  const isVerified = verdict === 'VERIFIED';
  const isInsufficient = verdict === 'INSUFFICIENT_EVIDENCE';
  const isGreenwashing = verdict === 'POTENTIAL_GREENWASHING';

  const config = {
    VERIFIED: {
      icon: CheckCircle2,
      title: '🟢 Verified',
      bg: 'bg-[#3E7D4F]/10 border-[#3E7D4F]/40',
      iconColor: 'text-[#3E7D4F]',
      textColor: 'text-[#315C45]',
    },
    INSUFFICIENT_EVIDENCE: {
      icon: AlertCircle,
      title: '🟡 Insufficient Evidence',
      bg: 'bg-[#C9A227]/10 border-[#C9A227]/40',
      iconColor: 'text-[#C9A227]',
      textColor: 'text-[#8A6A1E]',
    },
    POTENTIAL_GREENWASHING: {
      icon: ShieldAlert,
      title: '🔴 Potential Greenwashing',
      bg: 'bg-[#C1443E]/10 border-[#C1443E]/40',
      iconColor: 'text-[#C1443E]',
      textColor: 'text-[#9E3B33]',
    },
  }[verdict] || {
    icon: AlertCircle,
    title: 'Unknown',
    bg: 'bg-[#EFECE4] border-[#D6D3C8]',
    iconColor: 'text-[#718875]',
    textColor: 'text-[#718875]',
  };

  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-6 ${config.bg} animate-fade-in-up`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon size={24} className={config.iconColor} />
        <h3 className={`text-lg font-bold ${config.textColor}`}>{config.title}</h3>
      </div>
      <p className="text-sm text-[#1C1C1C] leading-relaxed mb-4">{reason}</p>
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/business/records/${auditId}`}
          className="btn-primary text-sm py-2 px-4"
        >
          View Public Record <ExternalLink size={14} />
        </Link>
        {isInsufficient && (
          <span className="text-xs text-[#718875] self-center">
            Upload more supporting evidence and resubmit to improve verification
          </span>
        )}
      </div>
      <p className="text-xs font-mono text-[#A8B3AA] mt-4">Audit ID: {auditId}</p>
    </div>
  );
}

function NewClaimForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultProductId = searchParams.get('product_id') || '';

  const [products, setProducts] = useState<BusinessProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    verdict: string;
    reason: string;
    audit_id: string;
    evidence_strength: string;
  } | null>(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    product_id: defaultProductId,
    claim_text: '',
    claim_category: '',
    source_url: '',
  });
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);

  useEffect(() => {
    fetch('/api/business/products')
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .finally(() => setLoadingProducts(false));
  }, []);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const newFiles: EvidenceFile[] = [];
    const errs: string[] = [];

    Array.from(files).forEach((file) => {
      if (!VALID_TYPES[file.type]) {
        errs.push(`"${file.name}" is not a supported type (PDF, JPG, PNG, WEBP only)`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        errs.push(`"${file.name}" exceeds 10MB limit`);
        return;
      }
      newFiles.push({
        id: `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        filename: file.name,
        file_type: file.type === 'application/pdf' ? 'PDF' : file.type.split('/')[1].toUpperCase(),
        file_size: file.size,
        upload_status: 'UPLOADED',
      });
    });

    if (errs.length > 0) setError(errs.join('\n'));
    setEvidenceFiles((prev) => [...prev, ...newFiles]);
  }

  function removeFile(id: string) {
    setEvidenceFiles((prev) => prev.filter((f) => f.id !== id));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.product_id) errs.product_id = 'Please select a product';
    if (!form.claim_text.trim()) errs.claim_text = 'Claim text is required';
    if (!form.claim_category) errs.claim_category = 'Please select a category';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/business/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, evidence_files: evidenceFiles }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'NON_ENVIRONMENTAL_CLAIM') {
          setFieldErrors((prev) => ({
            ...prev,
            claim_text: data.message || 'This does not appear to be an environmental or sustainability claim.',
          }));
          return;
        }
        throw new Error(data.error || 'Submission failed');
      }

      setResult({
        verdict: data.verdict,
        reason: data.reason,
        audit_id: data.audit_id,
        evidence_strength: data.evidence_strength,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls = (field: string) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm text-[#1C1C1C] bg-white outline-none transition-all ${
      fieldErrors[field]
        ? 'border-[#C1443E] focus:ring-2 focus:ring-[#C1443E]/20'
        : 'border-[#D6D3C8] focus:border-[#1B3A2B] focus:ring-2 focus:ring-[#1B3A2B]/10'
    }`;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/business/claims" className="inline-flex items-center gap-1.5 text-sm text-[#718875] hover:text-[#1C1C1C] mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Claims
      </Link>

      <div className="flex items-start gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#315C45]/10 border border-[#315C45]/15 flex items-center justify-center">
          <Upload size={18} className="text-[#315C45]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#1C1C1C]">Submit Environmental Claim</h1>
          <p className="text-xs text-[#718875] mt-0.5">Claims are verified by the GreenLedger evidence engine</p>
        </div>
      </div>

      {/* Verdict result */}
      {result && (
        <div className="mb-6">
          <VerdictResult
            verdict={result.verdict}
            reason={result.reason}
            auditId={result.audit_id}
            evidenceStrength={result.evidence_strength}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="card-cream p-6 space-y-5">
        {/* Product Select */}
        <div>
          <label className="block text-xs font-semibold text-[#1C1C1C] uppercase tracking-wider mb-1.5">
            Product <span className="text-[#C1443E]">*</span>
          </label>
          {loadingProducts ? (
            <div className="h-10 bg-[#EFECE4] animate-pulse rounded-lg" />
          ) : (
            <select
              className={inputCls('product_id')}
              value={form.product_id}
              onChange={(e) => setForm((f) => ({ ...f, product_id: e.target.value }))}
            >
              <option value="">Select product…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.product_name} ({p.brand}){p.is_demo ? ' — Demo' : ''}
                </option>
              ))}
            </select>
          )}
          {fieldErrors.product_id && <p className="text-xs text-[#C1443E] mt-1">{fieldErrors.product_id}</p>}
        </div>

        {/* Claim Text */}
        <div>
          <label className="block text-xs font-semibold text-[#1C1C1C] uppercase tracking-wider mb-1.5">
            Environmental Claim <span className="text-[#C1443E]">*</span>
          </label>
          <textarea
            rows={3}
            className={`claim-textarea text-sm ${fieldErrors.claim_text ? 'border-[#C1443E] focus:ring-2 focus:ring-[#C1443E]/20' : ''}`}
            placeholder={`e.g. "Made with 80% recycled plastic"`}
            value={form.claim_text}
            onChange={(e) => setForm((f) => ({ ...f, claim_text: e.target.value }))}
          />
          {fieldErrors.claim_text ? (
            <p className="text-xs text-[#C1443E] mt-1">{fieldErrors.claim_text}</p>
          ) : (
            <p className="text-xs text-[#A8B3AA] mt-1.5 flex items-start gap-1">
              <Info size={11} className="mt-0.5 shrink-0" />
              Only environmental or sustainability claims can be verified
            </p>
          )}

          {/* Example claims */}
          <div className="mt-2">
            <p className="text-xs text-[#718875] mb-1.5">Examples:</p>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLE_CLAIMS.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, claim_text: ex }))}
                  className="text-xs px-2.5 py-1 rounded-full border border-[#D6D3C8] bg-[#F7F5F0] text-[#718875] hover:border-[#A9BBA0] hover:text-[#315C45] transition-all"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-[#1C1C1C] uppercase tracking-wider mb-1.5">
            Claim Category <span className="text-[#C1443E]">*</span>
          </label>
          <select
            className={inputCls('claim_category')}
            value={form.claim_category}
            onChange={(e) => setForm((f) => ({ ...f, claim_category: e.target.value }))}
          >
            <option value="">Select category…</option>
            {CLAIM_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {fieldErrors.claim_category && <p className="text-xs text-[#C1443E] mt-1">{fieldErrors.claim_category}</p>}
        </div>

        {/* Evidence Upload */}
        <div>
          <label className="block text-xs font-semibold text-[#1C1C1C] uppercase tracking-wider mb-1.5">
            Supporting Evidence
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            className="border-2 border-dashed border-[#D6D3C8] hover:border-[#A9BBA0] rounded-xl p-6 text-center cursor-pointer transition-colors group"
          >
            <Upload size={24} className="text-[#D6D3C8] group-hover:text-[#A9BBA0] mx-auto mb-2 transition-colors" />
            <p className="text-sm text-[#718875]">Drop files here or <span className="text-[#A9BBA0] font-medium">browse</span></p>
            <p className="text-xs text-[#A8B3AA] mt-1">PDF, JPG, PNG, WEBP · Max 10MB each</p>
            <p className="text-xs text-[#A8B3AA] mt-0.5">Certificates, lab reports, sustainability reports, declarations</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {/* Uploaded files */}
          {evidenceFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {evidenceFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg border border-[#D6D3C8] bg-white">
                  <FileIconComp type={file.file_type === 'PDF' ? 'application/pdf' : 'image/png'} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1C1C1C] truncate">{file.filename}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#718875]">{file.file_type}</span>
                      <span className="text-xs text-[#A8B3AA]">
                        {file.file_size > 1024 * 1024
                          ? `${(file.file_size / 1024 / 1024).toFixed(1)} MB`
                          : `${Math.round(file.file_size / 1024)} KB`}
                      </span>
                      <span className="text-xs text-[#3E7D4F] font-medium">✓ Submitted</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="p-1 rounded hover:bg-[#EFECE4] text-[#718875] hover:text-[#C1443E] transition-colors"
                    aria-label="Remove file"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-2 p-2.5 rounded-lg bg-[#EFECE4] flex items-start gap-2">
            <Info size={12} className="text-[#718875] mt-0.5 shrink-0" />
            <p className="text-xs text-[#718875] leading-relaxed">
              Uploading evidence means <strong>Evidence Submitted</strong>, not <strong>Evidence Verified</strong>. 
              Evidence is evaluated by the GreenLedger engine as part of the verification process.
            </p>
          </div>
        </div>

        {/* Source URL */}
        <div>
          <label className="block text-xs font-semibold text-[#1C1C1C] uppercase tracking-wider mb-1.5">
            Additional Source URL <span className="text-[#A8B3AA] font-normal normal-case">(optional)</span>
          </label>
          <input
            type="url"
            className={inputCls('source_url')}
            placeholder="https://certification-registry.org/your-cert"
            value={form.source_url}
            onChange={(e) => setForm((f) => ({ ...f, source_url: e.target.value }))}
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#C1443E]/10 border border-[#C1443E]/30 text-sm text-[#C1443E] whitespace-pre-line">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/business/claims" className="btn-secondary">Cancel</Link>
          <button type="submit" className="btn-mint min-w-[180px] justify-center" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Verifying…
              </>
            ) : (
              'Submit for Verification →'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewClaimPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#718875]">Loading…</div>}>
      <NewClaimForm />
    </Suspense>
  );
}
