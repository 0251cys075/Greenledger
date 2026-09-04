'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  isValidLanguage,
} from './locales/registry';

import en from './locales/en.json';
import hi from './locales/hi.json';
import hinglish from './locales/hinglish.json';
import bn from './locales/bn.json';
import mr from './locales/mr.json';
import te from './locales/te.json';
import ta from './locales/ta.json';
import kn from './locales/kn.json';

const dictionaries: Record<SupportedLanguage, Record<string, any>> = {
  en,
  hi,
  hinglish,
  bn,
  mr,
  te,
  ta,
  kn,
};

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (
    key: string,
    fallbackOrParams?: string | Record<string, string | number>,
    params?: Record<string, string | number>
  ) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: (key: string, fallbackOrParams?: any) => (typeof fallbackOrParams === 'string' ? fallbackOrParams : key),
});

const STORAGE_KEY = 'preferredLanguage';

// Helper to look up a dot-delimited key in an object
function getNestedValue(obj: Record<string, any>, path: string): string | undefined {
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore language from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && isValidLanguage(stored)) {
          setLanguageState(stored);
        }
      } catch {
        // LocalStorage unavailable (e.g. private mode)
      }
      setIsInitialized(true);
    }
  }, []);

  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    if (!isValidLanguage(newLang)) return;
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
      } catch {
        // LocalStorage unavailable
      }
    }
  }, []);

  const t = useCallback(
    (
      key: string,
      fallbackOrParams?: string | Record<string, string | number>,
      params?: Record<string, string | number>
    ): string => {
      let fallback: string | undefined;
      let actualParams: Record<string, string | number> | undefined;

      if (typeof fallbackOrParams === 'string') {
        fallback = fallbackOrParams;
        actualParams = params;
      } else {
        actualParams = fallbackOrParams;
      }

      const activeDict = dictionaries[language] || dictionaries[DEFAULT_LANGUAGE];
      const fallbackDict = dictionaries[DEFAULT_LANGUAGE];

      let value = getNestedValue(activeDict, key);
      if (value === undefined) {
        value = getNestedValue(fallbackDict, key);
      }
      if (value === undefined) {
        value = fallback !== undefined ? fallback : key;
      }

      // Replace interpolated variables: {var}
      if (actualParams) {
        return Object.entries(actualParams).reduce((str, [k, v]) => {
          return str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        }, value);
      }

      return value;
    },
    [language]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}

export function useLanguage() {
  const { language, setLanguage } = useContext(I18nContext);
  return { language, setLanguage, meta: SUPPORTED_LANGUAGES[language] };
}
