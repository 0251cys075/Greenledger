'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Shield,
  ExternalLink,
  Share2,
  ArrowLeft,
  Calendar,
  FileText,
  Check,
  X as XIcon,
  AlertTriangle,
  Building2,
  QrCode,
  Copy,
  Download,
} from 'lucide-react';

interface PublicRecord {
  audit_id: string;
  product_name: string;
  brand: string;
  company_name: string;
  claim_text: string;
  claim_category: string;
  verdict?: string;
  verdict_reason?: string;
  evidence_strength?: string;
  scores?: Record<string, number>;
  evidence_assessment?: Array<{ label: string; status: string; detail?: string }>;
  evidence_records?: Array<{
    sourceName: string;
    sourceType: string;
    sourceURL?: string;
    evidenceText: string;
    reliabilityLevel: string;
    claimMatch: string;
    publicationDate: string;
  }>;
  evidence_file_count?: number;
  evidence_file_names?: string[];
  verified_at?: string;
  is_demo?: boolean;
  methodology_url?: string;
}

function VerdictConfig(verdict?: string) {
  if (verdict === 'VERIFIED')
    return { title: 'Verified', emoji: '🟢', bg: 'bg-[#3E7D4F]/12 border-[#3E7D4F]/40', iconBg: 'bg-[#3E7D4F]/15', Icon: CheckCircle2, iconColor: 'text-[#3E7D4F]', textColor: 'text-[#315C45]' };
  if (verdict === 'INSUFFICIENT_EVIDENCE')
    return { title: 'Insufficient Evidence', emoji: '🟡', bg: 'bg-[#C9A227]/12 border-[#C9A227]/40', iconBg: 'bg-[#C9A227]/15', Icon: AlertCircle, iconColor: 'text-[#C9A227]', textColor: 'text-[#8A6A1E]' };
  if (verdict === 'POTENTIAL_GREENWASHING')
    return { title: 'Potential Greenwashing', emoji: '🔴', bg: 'bg-[#C1443E]/12 border-[#C1443E]/40', iconBg: 'bg-[#C1443E]/15', Icon: ShieldAlert, iconColor: 'text-[#C1443E]', textColor: 'text-[#9E3B33]' };
  return { title: 'Under Review', emoji: '⏳', bg: 'bg-[#EFECE4] border-[#D6D3C8]', iconBg: 'bg-[#EFECE4]', Icon: Shield, iconColor: 'text-[#718875]', textColor: 'text-[#718875]' };
}

function AssessmentIcon({ status }: { status: string }) {
  if (status === 'PASS') return <Check size={14} className="text-[#3E7D4F]" />;
  if (status === 'FAIL') return <XIcon size={14} className="text-[#C1443E]" />;
  return <AlertTriangle size={14} className="text-[#C9A227]" />;
}

function SourceTypeBadge({ type }: { type: string }) {
  const norm = type.toLowerCase();
  const map: Record<string, string> = {
    laboratory_report: 'bg-[#315C45] text-[#A9BBA0] border-[#A9BBA0]/30',
    certification_registry: 'bg-[#3E7D4F]/15 text-[#315C45] border-[#3E7D4F]/40',
    environmental_standard: 'bg-[#C9A227]/15 text-[#8A6A1E] border-[#C9A227]/40',
    esg_sustainability_report: 'bg-[#315C45]/10 text-[#315C45] border-[#315C45]/30',
    third_party_audit: 'bg-[#1B3A2B] text-[#F7F5F0] border-white/20',
    company_documentation: 'bg-[#EFECE4] text-[#718875] border-[#D6D3C8]',
  };
  return (
    <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${map[norm] || 'bg-[#EFECE4] text-[#718875] border-[#D6D3C8]'}`}>
      {norm.replace(/_/g, ' ')}
    </span>
  );
}

function ReliabilityBadge({ level }: { level?: string }) {
  if (!level) return null;
  const cfg =
    level === 'TIER_1_CERTIFIED'
      ? 'bg-[#3E7D4F]/15 text-[#315C45] border-[#3E7D4F]/40'
      : level === 'TIER_2_AUDITED'
      ? 'bg-[#315C45] text-[#A9BBA0] border-[#A9BBA0]/30'
      : 'bg-[#EFECE4] text-[#718875] border-[#D6D3C8]';
  const label =
    level === 'TIER_1_CERTIFIED' ? 'Tier 1 Certified' : level === 'TIER_2_AUDITED' ? 'Tier 2 Audited' : 'Tier 3 Self-Reported';
  return <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${cfg}`}>{label}</span>;
}

export default function PublicVerificationRecord() {
  const { auditId } = useParams<{ auditId: string }>();
  const [record, setRecord] = useState<PublicRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/business/records/${auditId}` : '';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=0B241A&bgcolor=F3F0E8&data=${encodeURIComponent(publicUrl)}`;

  useEffect(() => {
    fetch(`/api/business/records/${auditId}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((d) => { if (d) setRecord(d); })
      .finally(() => setLoading(false));
  }, [auditId]);

  function copyUrl() {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-[#EFECE4] rounded w-1/3" />
          <div className="h-32 bg-[#EFECE4] rounded-xl" />
          <div className="h-48 bg-[#EFECE4] rounded-xl" />
        </div>
      </div>
    );
  }

  if (notFound || !record) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Shield size={40} className="text-[#D6D3C8] mx-auto mb-4" />
        <h1 className="text-xl font-bold text-[#1C1C1C] mb-2">Verification Record Not Found</h1>
        <p className="text-sm text-[#718875] mb-6">No public record found for audit ID <code className="font-mono bg-[#EFECE4] px-1.5 py-0.5 rounded text-[#1C1C1C]">{auditId}</code></p>
        <Link href="/business" className="btn-primary">← Business Portal</Link>
      </div>
    );
  }

  const cfg = VerdictConfig(record.verdict);
  const { Icon } = cfg;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back + Share row */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/business/claims" className="inline-flex items-center gap-1.5 text-sm text-[#718875] hover:text-[#1C1C1C] transition-colors">
          <ArrowLeft size={14} /> Claims
        </Link>
        <div className="flex items-center gap-2">
          {record.is_demo && (
            <span className="text-xs font-mono text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-1 rounded-full border border-[#C9A227]/30 uppercase tracking-wider">
              Demo Data
            </span>
          )}
          <button onClick={copyUrl} className="btn-ghost text-xs py-1.5 px-3">
            {copied ? <><Check size={12} className="text-[#3E7D4F]" /> Copied!</> : <><Copy size={12} /> Copy Link</>}
          </button>
          <button onClick={() => setQrVisible(!qrVisible)} className="btn-ghost text-xs py-1.5 px-3">
            <QrCode size={12} /> {qrVisible ? 'Hide QR' : 'QR Code'}
          </button>
        </div>
      </div>

      {/* Public header banner */}
      <div className="bg-[#1B3A2B] text-[#F7F5F0] rounded-xl px-5 py-3 mb-6 flex items-center gap-3 text-sm">
        <Shield size={16} className="text-[#A9BBA0] shrink-0" />
        <span>This is a <strong className="text-[#A9BBA0]">public GreenLedger verification record</strong>. No login required to view.</span>
      </div>

      {/* QR Code panel */}
      {qrVisible && (
        <div className="card-cream p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt={`QR code for verification record ${auditId}`}
              width={140}
              height={140}
              className="rounded-lg border border-[#D6D3C8]"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <QrCode size={16} className="text-[#A9BBA0]" />
              <h3 className="text-sm font-bold text-[#1C1C1C]">Verification QR Code</h3>
            </div>
            <p className="text-xs text-[#718875] leading-relaxed mb-3">
              This QR links directly to this public verification record. Display it on product packaging, marketing materials, or digital catalogues. Consumers who scan it will see this exact record.
            </p>
            <div className="flex items-center gap-2 p-2.5 bg-[#EFECE4] rounded-lg">
              <code className="text-xs text-[#1C1C1C] break-all flex-1">{publicUrl}</code>
              <button onClick={copyUrl} className="shrink-0 p-1.5 rounded hover:bg-[#D6D3C8] transition-colors">
                {copied ? <Check size={12} className="text-[#3E7D4F]" /> : <Copy size={12} className="text-[#718875]" />}
              </button>
            </div>
            <a
              href={qrUrl}
              download={`GL-QR-${auditId}.png`}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#A9BBA0] hover:underline"
            >
              <Download size={12} /> Download QR Image
            </a>
          </div>
        </div>
      )}

      {/* Main Record Card */}
      <div className="card-cream overflow-hidden mb-6">
        {/* Verdict Hero */}
        <div className={`px-6 py-6 border-b ${cfg.bg} border`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
                <Icon size={24} className={cfg.iconColor} />
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[#718875] mb-1">GreenLedger Verdict</p>
                <h1 className={`text-2xl font-bold ${cfg.textColor}`}>
                  {cfg.emoji} {cfg.title}
                </h1>
              </div>
            </div>
          </div>
          {record.verdict_reason && (
            <p className="text-sm text-[#1C1C1C] leading-relaxed mt-4 bg-white/50 rounded-lg p-3">
              {record.verdict_reason}
            </p>
          )}
        </div>

        {/* Product & Claim Details */}
        <div className="px-6 py-6 border-b border-[#D6D3C8]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#718875] mb-1">Product</p>
              <p className="text-base font-bold text-[#1C1C1C]">{record.product_name}</p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#718875] mb-1">Brand</p>
              <div className="flex items-center gap-2">
                <Building2 size={14} className="text-[#718875]" />
                <p className="text-base font-semibold text-[#1C1C1C]">{record.brand}</p>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs font-mono uppercase tracking-widest text-[#718875] mb-1.5">Environmental Claim</p>
            <div className="p-3 bg-[#F7F5F0] rounded-lg border border-[#D6D3C8]">
              <p className="text-sm font-medium text-[#1C1C1C] italic">&ldquo;{record.claim_text}&rdquo;</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#718875] mb-0.5">Category</p>
              <p className="text-sm text-[#1C1C1C]">{record.claim_category}</p>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#718875] mb-0.5">Verified</p>
              <div className="flex items-center gap-1.5 text-sm text-[#1C1C1C]">
                <Calendar size={12} className="text-[#718875]" />
                {record.verified_at ? new Date(record.verified_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'}
              </div>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#718875] mb-0.5">Audit ID</p>
              <p className="font-mono text-sm text-[#A9BBA0] font-semibold">{record.audit_id}</p>
            </div>
          </div>
        </div>

        {/* Evidence Assessment */}
        {record.evidence_assessment && record.evidence_assessment.length > 0 && (
          <div className="px-6 py-6 border-b border-[#D6D3C8]">
            <h2 className="text-sm font-bold text-[#1C1C1C] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Shield size={14} className="text-[#A9BBA0]" />
              Evidence Assessment
            </h2>
            <div className="space-y-3">
              {record.evidence_assessment.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-white border border-[#D6D3C8]">
                    <AssessmentIcon status={item.status} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1C1C1C]">{item.label}</p>
                    {item.detail && <p className="text-xs text-[#718875] mt-0.5 leading-relaxed">{item.detail}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidence Sources */}
        {record.evidence_records && record.evidence_records.length > 0 && (
          <div className="px-6 py-6 border-b border-[#D6D3C8]">
            <h2 className="text-sm font-bold text-[#1C1C1C] uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText size={14} className="text-[#A9BBA0]" />
              Evidence Sources
            </h2>
            <div className="space-y-4">
              {record.evidence_records.map((ev, i) => (
                <div key={i} className="p-4 rounded-xl border border-[#D6D3C8] bg-[#FCFAF5]">
                  <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                    <p className="text-sm font-semibold text-[#1C1C1C]">{ev.sourceName}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <SourceTypeBadge type={ev.sourceType} />
                      <ReliabilityBadge level={ev.reliabilityLevel} />
                    </div>
                  </div>
                  <p className="text-xs text-[#718875] leading-relaxed mb-3">{ev.evidenceText}</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                      ev.claimMatch === 'CONFIRMS' ? 'bg-[#3E7D4F]/15 text-[#315C45] border-[#3E7D4F]/40' :
                      ev.claimMatch === 'CONTRADICTS' ? 'bg-[#C1443E]/15 text-[#9E3B33] border-[#C1443E]/40' :
                      ev.claimMatch === 'PARTIAL' ? 'bg-[#C9A227]/15 text-[#8A6A1E] border-[#C9A227]/40' :
                      'bg-[#EFECE4] text-[#718875] border-[#D6D3C8]'
                    }`}>
                      {ev.claimMatch === 'CONFIRMS' ? '✓ Confirms Claim' : ev.claimMatch === 'CONTRADICTS' ? '✕ Contradicts Claim' : ev.claimMatch === 'PARTIAL' ? '⚠ Partial Match' : '○ Insufficient'}
                    </span>
                    <span className="text-xs text-[#A8B3AA] font-mono">{ev.publicationDate}</span>
                    {ev.sourceURL && (
                      <a href={ev.sourceURL} target="_blank" rel="noopener noreferrer" className="text-xs text-[#A9BBA0] hover:underline flex items-center gap-1">
                        Source <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submitted Evidence Files */}
        {(record.evidence_file_count ?? 0) > 0 && (
          <div className="px-6 py-6 border-b border-[#D6D3C8]">
            <h2 className="text-sm font-bold text-[#1C1C1C] uppercase tracking-wider mb-4">
              Company-Submitted Evidence ({record.evidence_file_count} file{record.evidence_file_count !== 1 ? 's' : ''})
            </h2>
            <div className="p-3 rounded-lg bg-[#EFECE4] mb-3">
              <p className="text-xs text-[#718875]">
                <strong>Note:</strong> The following files were submitted by the company. Private documents are not exposed publicly. File names are listed for reference only.
              </p>
            </div>
            <div className="space-y-2">
              {(record.evidence_file_names || []).map((name, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#718875]">
                  <FileText size={12} className="text-[#718875] shrink-0" />
                  <span className="font-mono">{name}</span>
                  <span className="text-[#A8B3AA]">— Company submitted</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Methodology */}
        <div className="px-6 py-5">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#718875] mb-1">Verification Methodology</p>
              <p className="text-xs text-[#718875] leading-relaxed max-w-lg">
                GreenLedger uses a 7-step evidence-based pipeline: claim extraction → normalization → evidence retrieval → source reliability → claim-evidence matching → rules engine → verdict.
                <strong className="text-[#1C1C1C]"> Verdicts are determined solely by evidence and cannot be purchased.</strong>
              </p>
            </div>
            <Link href="/about" className="text-xs text-[#A9BBA0] hover:underline flex items-center gap-1 shrink-0">
              How It Works <ExternalLink size={10} />
            </Link>
          </div>
        </div>
      </div>

      {/* Consumer CTA */}
      <div className="rounded-xl bg-[#1B3A2B] text-[#F7F5F0] p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[#A9BBA0] mb-1">Consumer</p>
            <h2 className="text-base font-bold">Scanning this QR as a consumer?</h2>
            <p className="text-sm text-[#F7F5F0]/70 mt-1">
              This record was generated by GreenLedger's independent verification engine. The verdict above is what the available evidence supports.
            </p>
          </div>
          <Link href="/verify" className="btn-mint text-sm shrink-0">
            Verify Another Claim
          </Link>
        </div>
      </div>
    </div>
  );
}
