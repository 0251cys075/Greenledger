import { cn, getStatusLabel } from '@/lib/utils';
import type { VerificationStatus, EvidenceStrength } from '@/lib/types';

interface StatusBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
}

export function StatusBadge({ status, size = 'md', showIcon = true, className, theme = 'light' }: StatusBadgeProps) {
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
      aria-label={`Verification status: ${getStatusLabel(status)}`}
    >
      {showIcon && (
        <span className={cn('rounded-full flex-shrink-0', dotSizes[size], cfg.dot)} aria-hidden="true" />
      )}
      {getStatusLabel(status)}
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
  const configs = {
    VERIFIED: {
      wrapper: isDarkTheme
        ? 'bg-[#12382A] border-2 border-[#4FAF78]/50 text-[#F3F0E8]'
        : 'bg-[#4FAF78]/10 border-2 border-[#4FAF78]/40 text-[#0B241A]',
      icon: '✓',
      iconBg: 'bg-[#4FAF78] text-[#0B241A]',
      label: 'Verified',
      description: 'Available reliable public evidence sufficiently supports this claim.',
      textColor: isDarkTheme ? 'text-[#F3F0E8]' : 'text-[#0B241A]',
      labelColor: isDarkTheme ? 'text-[#86efac]' : 'text-[#12382A]',
    },
    INSUFFICIENT_EVIDENCE: {
      wrapper: isDarkTheme
        ? 'bg-[#182c23] border-2 border-[#D3A54A]/50 text-[#F3F0E8]'
        : 'bg-[#D3A54A]/10 border-2 border-[#D3A54A]/40 text-[#102019]',
      icon: '⚠',
      iconBg: 'bg-[#D3A54A] text-[#0B241A]',
      label: 'Insufficient Evidence',
      description: 'There is not enough reliable public evidence to confidently verify this claim.',
      textColor: isDarkTheme ? 'text-[#F3F0E8]' : 'text-[#102019]',
      labelColor: isDarkTheme ? 'text-[#fde047]' : 'text-[#8B6414]',
    },
    POTENTIAL_GREENWASHING: {
      wrapper: isDarkTheme
        ? 'bg-[#211818] border-2 border-[#C95C5C]/50 text-[#F3F0E8]'
        : 'bg-[#C95C5C]/10 border-2 border-[#C95C5C]/40 text-[#102019]',
      icon: '✕',
      iconBg: 'bg-[#C95C5C] text-white',
      label: 'Potential Greenwashing',
      description: 'The claim appears vague, unsupported, or inconsistent with available evidence.',
      textColor: isDarkTheme ? 'text-[#F3F0E8]' : 'text-[#102019]',
      labelColor: isDarkTheme ? 'text-[#fca5a5]' : 'text-[#962A2A]',
    },
  };

  const cfg = configs[status];

  return (
    <div className={cn('rounded-xl p-6 sm:p-8 transition-all', cfg.wrapper, className)}>
      <div className="flex items-start gap-4 sm:gap-5">
        <div
          className={cn(
            'w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-sm',
            cfg.iconBg
          )}
          aria-hidden="true"
        >
          {cfg.icon}
        </div>
        <div>
          <p className={cn('text-xs font-mono font-semibold tracking-widest uppercase mb-1', cfg.labelColor)}>
            Verification Result
          </p>
          <h2 className={cn('text-2xl sm:text-3xl font-bold mb-2', cfg.textColor, 'font-serif')}>
            {cfg.label}
          </h2>
          <p className={cn('text-sm sm:text-base leading-relaxed opacity-90', cfg.textColor)}>
            {cfg.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Evidence Strength Bar ──────────────────────────────────
interface EvidenceStrengthBarProps {
  strength: EvidenceStrength;
  className?: string;
  theme?: 'light' | 'dark';
}

export function EvidenceStrengthBar({ strength, className, theme = 'light' }: EvidenceStrengthBarProps) {
  const configs: Record<EvidenceStrength, { width: string; color: string; label: string }> = {
    STRONG: { width: 'w-full', color: 'bg-[#4FAF78]', label: 'Strong' },
    MODERATE: { width: 'w-2/3', color: 'bg-[#D3A54A]', label: 'Moderate' },
    WEAK: { width: 'w-1/3', color: 'bg-[#C95C5C]', label: 'Weak' },
    NONE: { width: 'w-0', color: 'bg-stone-300', label: 'None' },
  };

  const cfg = configs[strength];
  const isDark = theme === 'dark';

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between text-xs">
        <span className={isDark ? 'text-[#F3F0E8]/70' : 'text-[#718078] font-medium'}>
          Evidence Strength
        </span>
        <span className={cn('font-semibold font-mono', isDark ? 'text-[#63D6A2]' : 'text-[#102019]')}>
          {cfg.label}
        </span>
      </div>
      <div
        className={cn(
          'h-2 rounded-full overflow-hidden',
          isDark ? 'bg-[#071710] border border-white/5' : 'bg-[#E9E6DC]'
        )}
        role="progressbar"
        aria-label={`Evidence strength: ${cfg.label}`}
      >
        <div className={cn('h-full rounded-full transition-all duration-700', cfg.width, cfg.color)} />
      </div>
    </div>
  );
}
