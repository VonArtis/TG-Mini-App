import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from '../locales/en/common.json';
import enDashboard from '../locales/en/dashboard.json';
import enProfile from '../locales/en/profile.json';

import esCommon from '../locales/es/common.json';
import esDashboard from '../locales/es/dashboard.json';
import esProfile from '../locales/es/profile.json';

import frCommon from '../locales/fr/common.json';
import frProfile from '../locales/fr/profile.json';

// Define supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano (Italian)', flag: '🇮🇹' },
  { code: 'pt', name: 'Português (Portuguese)', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский (Russian)', flag: '🇷🇺' },
  { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe (Turkish)', flag: '🇹🇷' },
  { code: 'pl', name: 'Polski (Polish)', flag: '🇵🇱' },
  { code: 'nl', name: 'Nederlands (Dutch)', flag: '🇳🇱' }
];

// Define translation resources
const resources = {
  en: {
    common: enCommon,
    dashboard: enDashboard,
    profile: enProfile
  },
  es: {
    common: esCommon,
    dashboard: esDashboard,
    profile: esProfile
  },
  fr: {
    common: frCommon,
    dashboard: enDashboard, // Fallback to English
    profile: frProfile
  }
  // Other languages will fallback to English for now
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'dashboard', 'profile'],
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    react: {
      useSuspense: false
    }
  });

export default i18n;