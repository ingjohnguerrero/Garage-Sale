import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { I18nProvider } from './i18n'
import { LOCALE, CURRENCY } from './constants'
import { en } from './locales/en'
import { es } from './locales/es'
import { fr } from './locales/fr'
import { de } from './locales/de'
import type { LocaleCode } from './types'
import type { TranslationBundle } from './i18n/types'

// Map of available translations
const translations: Record<LocaleCode, TranslationBundle> = {
  'en-US': en,
  'en-GB': en, // Use en-US translations for en-GB
  'es-ES': es,
  'fr-FR': fr,
  'de-DE': de
};

// Get translations for current locale with fallback to English
const currentTranslations = translations[LOCALE] || en;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider
      locale={LOCALE}
      currency={CURRENCY}
      translations={currentTranslations}
      fallbackTranslations={en}
    >
      <App />
    </I18nProvider>
  </React.StrictMode>,
)
