import type { LocaleCode, CurrencyCode } from '../types';

// Translation function type with optional variable interpolation
export type TranslationFunction = (
  key: string,
  variables?: Record<string, string | number>
) => string;

// Currency formatter type
export type PriceFormatter = (
  amount: number,
  options?: Intl.NumberFormatOptions
) => string;

// Date formatter type
export type DateFormatter = (
  date: Date,
  options?: Intl.DateTimeFormatOptions
) => string;

// Number formatter type
export type NumberFormatter = (
  value: number,
  options?: Intl.NumberFormatOptions
) => string;

// Translation bundle structure (will be extended by actual translation files)
export interface TranslationBundle {
  [key: string]: string | TranslationBundle;
}

// Context value interface
export interface I18nContextValue {
  locale: LocaleCode;
  currency: CurrencyCode;
  t: TranslationFunction;
  formatPrice: PriceFormatter;
  formatDate: DateFormatter;
  formatNumber: NumberFormatter;
}
