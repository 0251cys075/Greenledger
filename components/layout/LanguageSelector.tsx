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
            ? 'bg-[#315C45] text-[#A9BBA0] border-[#A9BBA0]/40 shadow-sm'
            : isDarkNavbar
            ? 'bg-white/5 hover:bg-white/10 text-[#F7F5F0]/90 hover:text-[#A9BBA0] border-white/15'
            : 'bg-[#FCFAF5] hover:bg-[#EFECE4] text-[#1C1C1C] border-[#D6D3C8]'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select language"
      >
        <Globe size={14} className="text-[#A9BBA0]" />
        <span className="font-semibold uppercase tracking-wider">{currentMeta.code}</span>
        <ChevronDown size={12} className={cn('transition-transform duration-200 opacity-70', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1.5 w-44 rounded-xl bg-[#1B3A2B]/98 backdrop-blur-md border border-[#A9BBA0]/25 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#A9BBA0]/70 border-b border-white/10 mb-1">
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
                    ? 'bg-[#315C45] text-[#A9BBA0] font-semibold'
                    : 'text-[#F7F5F0]/85 hover:text-white hover:bg-white/5'
                )}
                role="menuitem"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-sans">{meta.nativeLabel}</span>
                  {meta.code !== 'en' && meta.code !== 'hinglish' && (
                    <span className="text-[10px] font-mono text-[#F7F5F0]/40 uppercase">({meta.code})</span>
                  )}
                </div>
                {isSelected && <Check size={14} className="text-[#A9BBA0]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
