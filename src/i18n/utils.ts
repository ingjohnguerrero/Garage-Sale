import type { LocaleCode, CurrencyCode } from '../types';
import type {
  TranslationFunction,
  PriceFormatter,
  DateFormatter,
  NumberFormatter,
  TranslationBundle
} from './types';

/**
 * Get nested value from object using dot notation key
 * @example getValue({a: {b: 'hello'}}, 'a.b') => 'hello'
 */
function getValue(obj: TranslationBundle, path: string): string | undefined {
  const keys = path.split('.');
  let current: any = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return typeof current === 'string' ? current : undefined;
}

/**
 * Create translation function with fallback support
 * @param translations - Current language translations
 * @param fallbackTranslations - English fallback translations
 * @returns Translation function
 */
export function createTranslate(
  translations: TranslationBundle,
  fallbackTranslations: TranslationBundle
): TranslationFunction {
  return (key: string, variables?: Record<string, string | number>): string => {
    // Try to get translation from current language
    let text = getValue(translations, key);
    
    // Fallback to English if not found
    if (text === undefined) {
      text = getValue(fallbackTranslations, key);
      
      // Log missing translation in development (only in non-production builds)
      if (text === undefined && typeof window !== 'undefined') {
        console.warn(`[i18n] Missing translation key: "${key}"`);
      }
    }
    
    // If still not found, return the key itself
    if (text === undefined) {
      return key;
    }
    
    // Replace variables if provided
    if (variables) {
      return Object.entries(variables).reduce((result, [varKey, varValue]) => {
        return result.replace(new RegExp(`\\{${varKey}\\}`, 'g'), String(varValue));
      }, text);
    }
    
    return text;
  };
}

/**
 * Create currency formatter
 * @param currency - Currency code (USD, EUR, GBP, JPY)
 * @param locale - Locale code for formatting
 * @returns Price formatter function
 */
export function createFormatPrice(
  currency: CurrencyCode,
  locale: LocaleCode
): PriceFormatter {
  return (amount: number, options?: Intl.NumberFormatOptions): string => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        ...options
      }).format(amount);
    } catch (error) {
      console.error('[i18n] Error formatting price:', error);
      return `${currency} ${amount.toFixed(2)}`;
    }
  };
}

/**
 * Create date formatter
 * @param locale - Locale code for formatting
 * @returns Date formatter function
 */
export function createFormatDate(locale: LocaleCode): DateFormatter {
  return (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    try {
      return new Intl.DateTimeFormat(locale, options).format(date);
    } catch (error) {
      console.error('[i18n] Error formatting date:', error);
      return date.toLocaleDateString();
    }
  };
}

/**
 * Create number formatter
 * @param locale - Locale code for formatting
 * @returns Number formatter function
 */
export function createFormatNumber(locale: LocaleCode): NumberFormatter {
  return (value: number, options?: Intl.NumberFormatOptions): string => {
    try {
      return new Intl.NumberFormat(locale, options).format(value);
    } catch (error) {
      console.error('[i18n] Error formatting number:', error);
      return value.toString();
    }
  };
}
