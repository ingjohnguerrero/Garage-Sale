import { createContext, type ReactNode } from 'react';
import type { LocaleCode, CurrencyCode } from '../types';
import type { I18nContextValue, TranslationBundle } from './types';
import {
  createTranslate,
  createFormatPrice,
  createFormatDate,
  createFormatNumber
} from './utils';

// Default context value (will be overridden by provider)
const defaultContextValue: I18nContextValue = {
  locale: 'en-US',
  currency: 'USD',
  t: (key: string) => key,
  formatPrice: (amount: number) => `$${amount.toFixed(2)}`,
  formatDate: (date: Date) => date.toLocaleDateString(),
  formatNumber: (value: number) => value.toString()
};

export const I18nContext = createContext<I18nContextValue>(defaultContextValue);

interface I18nProviderProps {
  locale: LocaleCode;
  currency: CurrencyCode;
  translations: TranslationBundle;
  fallbackTranslations: TranslationBundle;
  children: ReactNode;
}

/**
 * I18n Provider component
 * Provides translations and formatters to all child components
 */
export function I18nProvider({
  locale,
  currency,
  translations,
  fallbackTranslations,
  children
}: I18nProviderProps) {
  const contextValue: I18nContextValue = {
    locale,
    currency,
    t: createTranslate(translations, fallbackTranslations),
    formatPrice: createFormatPrice(currency, locale),
    formatDate: createFormatDate(locale),
    formatNumber: createFormatNumber(locale)
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}
