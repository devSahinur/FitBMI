import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';

export const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  ar: { translation: ar },
  hi: { translation: hi },
  bn: { translation: bn },
} as const;

export const RTL_LANGUAGES = ['ar'];

/** Best-effort device language, falling back to English. */
function deviceLanguage(): string {
  const code = getLocales()[0]?.languageCode ?? 'en';
  return code in resources ? code : 'en';
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources,
    lng: deviceLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}

export function setLanguage(code: string): void {
  void i18n.changeLanguage(code);
}

export default i18n;
