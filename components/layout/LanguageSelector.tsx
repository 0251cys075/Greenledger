'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/lib/i18n-context';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/lib/locales/registry';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  className?: string;
  isDarkNavbar?: boolean;
}

export default function LanguageSelector({ className, isDarkNavbar = true }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useLanguage();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const currentMeta = SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES.en;

  return (
    <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 border',
          isOpen
            ? 'bg-[#12382A] text-[#63D6A2] border-[#63D6A2]/40 shadow-sm'
            : isDarkNavbar
            ? 'bg-white/5 hover:bg-white/10 text-[#F3F0E8]/90 hover:text-[#63D6A2] border-white/15'
            : 'bg-[#FAF8F3] hover:bg-[#E9E6DC] text-[#102019] border-[#C8CEC5]'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
      >
        <Globe size={14} className="text-[#63D6A2]" />
        <span className="font-semibold uppercase tracking-wider">{currentMeta.code}</span>
        <ChevronDown size={12} className={cn('transition-transform duration-200 opacity-70', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-44 rounded-xl bg-[#0B241A]/98 backdrop-blur-md border border-[#63D6A2]/25 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#63D6A2]/70 border-b border-white/10 mb-1">
            Language / भाषा
          </div>
          {(Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]).map((langKey) => {
            const meta = SUPPORTED_LANGUAGES[langKey];
            const isSelected = language === langKey;
            return (
              <button
                key={langKey}
                type="button"
                onClick={() => {
                  setLanguage(langKey);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-1.5 text-xs transition-colors text-left',
                  isSelected
                    ? 'bg-[#12382A] text-[#63D6A2] font-semibold'
                    : 'text-[#F3F0E8]/85 hover:text-white hover:bg-white/5'
                )}
                role="menuitem"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-sans">{meta.nativeLabel}</span>
                  {meta.code !== 'en' && meta.code !== 'hinglish' && (
                    <span className="text-[10px] font-mono text-[#F3F0E8]/40 uppercase">({meta.code})</span>
                  )}
                </div>
                {isSelected && <Check size={14} className="text-[#63D6A2]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
