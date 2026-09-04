// ============================================================
// GreenLedger — Supported Languages Registry
// ============================================================
// Add new Indian / regional languages here without touching
// core application code.
// ============================================================

export type SupportedLanguage =
  | 'en'
  | 'hi'
  | 'hinglish'
  | 'bn'
  | 'mr'
  | 'te'
  | 'ta'
  | 'kn';

export interface LanguageMeta {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  script: string;
  speechCode: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageMeta> = {
  en: {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    script: 'Latin',
    speechCode: 'en-US',
    flag: '🇬🇧',
  },
  hi: {
    code: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिंदी',
    script: 'Devanagari',
    speechCode: 'hi-IN',
    flag: '🇮🇳',
  },
  hinglish: {
    code: 'hinglish',
    label: 'Hinglish',
    nativeLabel: 'Hinglish',
    script: 'Latin (Hindi-English)',
    speechCode: 'hi-IN',
    flag: '🇮🇳',
  },
  bn: {
    code: 'bn',
    label: 'Bengali',
    nativeLabel: 'বাংলা',
    script: 'Bengali',
    speechCode: 'bn-IN',
    flag: '🇮🇳',
  },
  mr: {
    code: 'mr',
    label: 'Marathi',
    nativeLabel: 'मराठी',
    script: 'Devanagari',
    speechCode: 'mr-IN',
    flag: '🇮🇳',
  },
  te: {
    code: 'te',
    label: 'Telugu',
    nativeLabel: 'తెలుగు',
    script: 'Telugu',
    speechCode: 'te-IN',
    flag: '🇮🇳',
  },
  ta: {
    code: 'ta',
    label: 'Tamil',
    nativeLabel: 'தமிழ்',
    script: 'Tamil',
    speechCode: 'ta-IN',
    flag: '🇮🇳',
  },
  kn: {
    code: 'kn',
    label: 'Kannada',
    nativeLabel: 'ಕನ್ನಡ',
    script: 'Kannada',
    speechCode: 'kn-IN',
    flag: '🇮🇳',
  },
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export function isValidLanguage(lang: string): lang is SupportedLanguage {
  return lang in SUPPORTED_LANGUAGES;
}
