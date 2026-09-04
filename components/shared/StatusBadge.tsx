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
      base: 'bg-[#4FAF78]/15 border border-[#4FAF78]/40 text-[#12382A]',
      dot: 'bg-[#4FAF78]',
    },
    INSUFFICIENT_EVIDENCE: {
      base: 'bg-[#D3A54A]/15 border border-[#D3A54A]/40 text-[#8B6414]',
      dot: 'bg-[#D3A54A]',
    },
    POTENTIAL_GREENWASHING: {
      base: 'bg-[#C95C5C]/15 border border-[#C95C5C]/40 text-[#962A2A]',
      dot: 'bg-[#C95C5C]',
    },
  };

  const configsDark = {
    VERIFIED: {
      base: 'bg-[#4FAF78]/20 border border-[#4FAF78]/50 text-[#86efac]',
      dot: 'bg-[#4FAF78]',
    },
    INSUFFICIENT_EVIDENCE: {
      base: 'bg-[#D3A54A]/20 border border-[#D3A54A]/50 text-[#fde047]',
      dot: 'bg-[#D3A54A]',
    },
    POTENTIAL_GREENWASHING: {
      base: 'bg-[#C95C5C]/20 border border-[#C95C5C]/50 text-[#fca5a5]',
      dot: 'bg-[#C95C5C]',
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
        ? 'bg-[#12382A] border-2 border-[#4FAF78]/50 text-[#F3F0E8]'
        : 'bg-[#4FAF78]/10 border-2 border-[#4FAF78]/40 text-[#0B241A]',
      icon: '✓',
      iconBg: 'bg-[#4FAF78] text-[#0B241A]',
      defaultDesc: 'Available reliable public evidence sufficiently supports this claim.',
      textColor: isDarkTheme ? 'text-[#F3F0E8]' : 'text-[#0B241A]',
      labelColor: isDarkTheme ? 'text-[#86efac]' : 'text-[#12382A]',
    },
    INSUFFICIENT_EVIDENCE: {
      wrapper: isDarkTheme
        ? 'bg-[#182c23] border-2 border-[#D3A54A]/50 text-[#F3F0E8]'
        : 'bg-[#D3A54A]/10 border-2 border-[#D3A54A]/40 text-[#102019]',
      icon: '⚠',
      iconBg: 'bg-[#D3A54A] text-[#0B241A]',
      defaultDesc: 'There is not enough reliable public evidence to confidently verify this claim.',
      textColor: isDarkTheme ? 'text-[#F3F0E8]' : 'text-[#102019]',
      labelColor: isDarkTheme ? 'text-[#fde047]' : 'text-[#8B6414]',
    },
    POTENTIAL_GREENWASHING: {
      wrapper: isDarkTheme
        ? 'bg-[#211818] border-2 border-[#C95C5C]/50 text-[#F3F0E8]'
        : 'bg-[#C95C5C]/10 border-2 border-[#C95C5C]/40 text-[#102019]',
      icon: '✕',
      iconBg: 'bg-[#C95C5C] text-white',
      defaultDesc: 'The claim appears vague, unsupported, or inconsistent with available evidence.',
      textColor: isDarkTheme ? 'text-[#F3F0E8]' : 'text-[#102019]',
      labelColor: isDarkTheme ? 'text-[#fca5a5]' : 'text-[#962A2A]',
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
            <span className="text-xs text-[#718078]">•</span>
            <span className="text-xs font-mono text-[#718078]">Audit Status</span>
          </div>
          <h2 className={cn('text-2xl sm:text-3xl font-serif font-bold tracking-tight mt-1 mb-2', cfg.textColor)}>
            {label}
          </h2>
          <p className={cn('text-sm sm:text-base leading-relaxed', isDarkTheme ? 'text-[#C8CEC5]' : 'text-[#4A5550]')}>
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
      color: 'bg-[#4FAF78]',
      desc: 'Multiple verified independent sources, public databases, or accredited certifications.',
    },
    MODERATE: {
      percentage: 55,
      label: 'Moderate Evidence',
      color: 'bg-[#D3A54A]',
      desc: 'Some verified data, but relying partly on self-reported corporate disclosures.',
    },
    WEAK: {
      percentage: 20,
      label: 'Weak Evidence',
      color: 'bg-[#C95C5C]',
      desc: 'Unsubstantiated claim, vague terminology, or contradictory public findings.',
    },
    NONE: {
      percentage: 5,
      label: 'No Evidence',
      color: 'bg-[#718078]',
      desc: 'No public records, certifications, or corroborating disclosures found.',
    },
  };

  const cfg = configs[strength] || configs.NONE;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-xs font-mono">
        <span className={isDarkTheme ? 'text-[#C8CEC5]' : 'text-[#718078]'}>Evidence Quality</span>
        <span className={cn('font-bold', isDarkTheme ? 'text-[#F3F0E8]' : 'text-[#102019]')}>{cfg.label}</span>
      </div>
      <div className={cn('h-2 rounded-full overflow-hidden', isDarkTheme ? 'bg-white/10' : 'bg-[#C8CEC5]/40')}>
        <div
          className={cn('h-full transition-all duration-700 ease-out rounded-full', cfg.color)}
          style={{ width: `${cfg.percentage}%` }}
        />
      </div>
      <p className={cn('text-[11px] leading-relaxed', isDarkTheme ? 'text-[#C8CEC5]/80' : 'text-[#718078]')}>
        {cfg.desc}
      </p>
    </div>
  );
}
