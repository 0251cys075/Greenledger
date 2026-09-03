// ============================================================
// GreenLedger — Utility Functions
// ============================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { VerificationStatus, EvidenceStrength } from './types';

// ── Tailwind class merging ─────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Status helpers ─────────────────────────────────────────
export function getStatusColor(status: VerificationStatus): string {
  switch (status) {
    case 'VERIFIED':
      return 'text-emerald-700';
    case 'INSUFFICIENT_EVIDENCE':
      return 'text-amber-600';
    case 'POTENTIAL_GREENWASHING':
      return 'text-red-600';
  }
}

export function getStatusBgColor(status: VerificationStatus): string {
  switch (status) {
    case 'VERIFIED':
      return 'bg-emerald-50 border-emerald-200';
    case 'INSUFFICIENT_EVIDENCE':
      return 'bg-amber-50 border-amber-200';
    case 'POTENTIAL_GREENWASHING':
      return 'bg-red-50 border-red-200';
  }
}

export function getStatusLabel(status: VerificationStatus): string {
  switch (status) {
    case 'VERIFIED':
      return 'Verified';
    case 'INSUFFICIENT_EVIDENCE':
      return 'Insufficient Evidence';
    case 'POTENTIAL_GREENWASHING':
      return 'Potential Greenwashing';
  }
}

export function getStatusEmoji(status: VerificationStatus): string {
  switch (status) {
    case 'VERIFIED':
      return '✓';
    case 'INSUFFICIENT_EVIDENCE':
      return '⚠';
    case 'POTENTIAL_GREENWASHING':
      return '✕';
  }
}

export function getStatusDot(status: VerificationStatus): string {
  switch (status) {
    case 'VERIFIED':
      return 'bg-emerald-500';
    case 'INSUFFICIENT_EVIDENCE':
      return 'bg-amber-500';
    case 'POTENTIAL_GREENWASHING':
      return 'bg-red-500';
  }
}

export function getEvidenceStrengthLabel(strength: EvidenceStrength): string {
  switch (strength) {
    case 'STRONG':
      return 'Strong';
    case 'MODERATE':
      return 'Moderate';
    case 'WEAK':
      return 'Weak';
    case 'NONE':
      return 'None';
  }
}

export function getEvidenceStrengthColor(strength: EvidenceStrength): string {
  switch (strength) {
    case 'STRONG':
      return 'text-emerald-700';
    case 'MODERATE':
      return 'text-amber-600';
    case 'WEAK':
      return 'text-red-600';
    case 'NONE':
      return 'text-stone-500';
  }
}

// ── Date formatting ────────────────────────────────────────
export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatRelativeDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

// ── Number formatting ──────────────────────────────────────
export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

// ── Assessment status helpers ──────────────────────────────
export function getAssessmentIcon(status: 'PASS' | 'WARN' | 'FAIL'): string {
  switch (status) {
    case 'PASS':
      return '✓';
    case 'WARN':
      return '⚠';
    case 'FAIL':
      return '✕';
  }
}

export function getAssessmentColor(status: 'PASS' | 'WARN' | 'FAIL'): string {
  switch (status) {
    case 'PASS':
      return 'text-emerald-600';
    case 'WARN':
      return 'text-amber-500';
    case 'FAIL':
      return 'text-red-500';
  }
}

// ── Truncate text ──────────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}
