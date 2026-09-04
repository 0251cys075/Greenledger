'use client';

import { cn, getStatusLabel } from '@/lib/utils';
import type { VerificationStatus, EvidenceStrength } from '@/lib/types';
import { useTranslation } from '@/lib/i18n-context';

interface StatusBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
}

export function StatusBadge({ status, size = 'md', showIcon = true, className, theme = 'light' }: StatusBadgeProps) {
  const { t } = useTranslation();
  const label = t(`verdict.${status}`) || getStatusLabel(status);

  const configsLight = {
    VERIFIED: {
      base: 'bg-[#3E7D4F]/15 border border-[#3E7D4F]/40 text-[#315C45]',
      dot: 'bg-[#3E7D4F]',
    },
    INSUFFICIENT_EVIDENCE: {
      base: 'bg-[#C9A227]/15 border border-[#C9A227]/40 text-[#8A6A1E]',
      dot: 'bg-[#C9A227]',
    },
    POTENTIAL_GREENWASHING: {
      base: 'bg-[#C1443E]/15 border border-[#C1443E]/40 text-[#9E3B33]',
      dot: 'bg-[#C1443E]',
    },
  };

  const configsDark = {
    VERIFIED: {
      base: 'bg-[#3E7D4F]/20 border border-[#3E7D4F]/50 text-[#A3C9A9]',
      dot: 'bg-[#3E7D4F]',
    },
    INSUFFICIENT_EVIDENCE: {
      base: 'bg-[#C9A227]/20 border border-[#C9A227]/50 text-[#E4C25C]',
      dot: 'bg-[#C9A227]',
    },
    POTENTIAL_GREENWASHING: {
      base: 'bg-[#C1443E]/20 border border-[#C1443E]/50 text-[#E4A29C]',
      dot: 'bg-[#C1443E]',
    },
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5 rounded-full font-semibold tracking-wider uppercase',
    md: 'text-[11px] px-3 py-1 gap-1.5 rounded-full font-semibold tracking-wider uppercase',
    lg: 'text-xs px-3.5 py-1.5 gap-2 rounded-full font-bold tracking-wider uppercase',
    xl: 'text-sm px-4 py-2 gap-2 rounded-full font-bold tracking-wide uppercase',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2',
    xl: 'w-2 h-2',
  };

  const cfg = theme === 'dark' ? configsDark[status] : configsLight[status];

  return (
    <span
      className={cn('inline-flex items-center font-mono', sizeStyles[size], cfg.base, className)}
      role="status"
      aria-label={`Verification status: ${label}`}
    >
      {showIcon && (
        <span className={cn('rounded-full flex-shrink-0', dotSizes[size], cfg.dot)} aria-hidden="true" />
      )}
      {label}
    </span>
  );
}

// ── Large result status hero block ──────────────────────────
interface StatusHeroProps {
  status: VerificationStatus;
  className?: string;
  isDarkTheme?: boolean;
}

export function StatusHero({ status, className, isDarkTheme = false }: StatusHeroProps) {
  const { t } = useTranslation();
  const label = t(`verdict.${status}`) || getStatusLabel(status);
  const description = t(`verdict.desc_${status}`);

  const configs = {
    VERIFIED: {
      wrapper: isDarkTheme
        ? 'bg-[#315C45] border-2 border-[#3E7D4F]/50 text-[#F7F5F0]'
        : 'bg-[#3E7D4F]/10 border-2 border-[#3E7D4F]/40 text-[#1B3A2B]',
      icon: '✓',
      iconBg: 'bg-[#3E7D4F] text-[#1B3A2B]',
      defaultDesc: 'Available reliable public evidence sufficiently supports this claim.',
      textColor: isDarkTheme ? 'text-[#F7F5F0]' : 'text-[#1B3A2B]',
      labelColor: isDarkTheme ? 'text-[#A3C9A9]' : 'text-[#315C45]',
    },
    INSUFFICIENT_EVIDENCE: {
      wrapper: isDarkTheme
        ? 'bg-[#243F2E] border-2 border-[#C9A227]/50 text-[#F7F5F0]'
        : 'bg-[#C9A227]/10 border-2 border-[#C9A227]/40 text-[#1C1C1C]',
      icon: '⚠',
      iconBg: 'bg-[#C9A227] text-[#1B3A2B]',
      defaultDesc: 'There is not enough reliable public evidence to confidently verify this claim.',
      textColor: isDarkTheme ? 'text-[#F7F5F0]' : 'text-[#1C1C1C]',
      labelColor: isDarkTheme ? 'text-[#E4C25C]' : 'text-[#8A6A1E]',
    },
    POTENTIAL_GREENWASHING: {
      wrapper: isDarkTheme
        ? 'bg-[#3A2420] border-2 border-[#C1443E]/50 text-[#F7F5F0]'
        : 'bg-[#C1443E]/10 border-2 border-[#C1443E]/40 text-[#1C1C1C]',
      icon: '✕',
      iconBg: 'bg-[#C1443E] text-white',
      defaultDesc: 'The claim appears vague, unsupported, or inconsistent with available evidence.',
      textColor: isDarkTheme ? 'text-[#F7F5F0]' : 'text-[#1C1C1C]',
      labelColor: isDarkTheme ? 'text-[#E4A29C]' : 'text-[#9E3B33]',
    },
  };

  const cfg = configs[status];

  return (
    <div className={cn('rounded-xl p-6 sm:p-8 transition-all', cfg.wrapper, className)}>
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-sm',
            cfg.iconBg
          )}
          aria-hidden="true"
        >
          {cfg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={cn('text-xs font-mono font-bold tracking-widest uppercase', cfg.labelColor)}>
              Verdict
            </span>
            <span className="text-xs text-[#718875]">•</span>
            <span className="text-xs font-mono text-[#718875]">Audit Status</span>
          </div>
          <h2 className={cn('text-2xl sm:text-3xl font-serif font-bold tracking-tight mt-1 mb-2', cfg.textColor)}>
            {label}
          </h2>
          <p className={cn('text-sm sm:text-base leading-relaxed', isDarkTheme ? 'text-[#D6D3C8]' : 'text-[#5A6660]')}>
            {description || cfg.defaultDesc}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Evidence Strength Meter ──────────────────────────────────
interface EvidenceStrengthBarProps {
  strength: EvidenceStrength;
  className?: string;
  isDarkTheme?: boolean;
}

export function EvidenceStrengthBar({ strength, className, isDarkTheme = false }: EvidenceStrengthBarProps) {
  const configs: Record<EvidenceStrength, { percentage: number; label: string; color: string; desc: string }> = {
    STRONG: {
      percentage: 85,
      label: 'Strong Evidence',
      color: 'bg-[#3E7D4F]',
      desc: 'Multiple verified independent sources, public databases, or accredited certifications.',
    },
    MODERATE: {
      percentage: 55,
      label: 'Moderate Evidence',
      color: 'bg-[#C9A227]',
      desc: 'Some verified data, but relying partly on self-reported corporate disclosures.',
    },
    WEAK: {
      percentage: 20,
      label: 'Weak Evidence',
      color: 'bg-[#C1443E]',
      desc: 'Unsubstantiated claim, vague terminology, or contradictory public findings.',
    },
    NONE: {
      percentage: 5,
      label: 'No Evidence',
      color: 'bg-[#718875]',
      desc: 'No public records, certifications, or corroborating disclosures found.',
    },
  };

  const cfg = configs[strength] || configs.NONE;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-xs font-mono">
        <span className={isDarkTheme ? 'text-[#D6D3C8]' : 'text-[#718875]'}>Evidence Quality</span>
        <span className={cn('font-bold', isDarkTheme ? 'text-[#F7F5F0]' : 'text-[#1C1C1C]')}>{cfg.label}</span>
      </div>
      <div className={cn('h-2 rounded-full overflow-hidden', isDarkTheme ? 'bg-white/10' : 'bg-[#D6D3C8]/40')}>
        <div
          className={cn('h-full transition-all duration-700 ease-out rounded-full', cfg.color)}
          style={{ width: `${cfg.percentage}%` }}
        />
      </div>
      <p className={cn('text-[11px] leading-relaxed', isDarkTheme ? 'text-[#D6D3C8]/80' : 'text-[#718875]')}>
        {cfg.desc}
      </p>
    </div>
  );
}
