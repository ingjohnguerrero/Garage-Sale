import { useContext } from 'react';
import { I18nContext } from './context';
import type { I18nContextValue } from './types';

/**
 * Hook to access full i18n context
 * @returns I18n context value with locale, currency, and all formatters
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  
  return context;
}

/**
 * Hook to access translation function
 * @returns Translation function
 */
export function useTranslation() {
  const { t } = useI18n();
  return { t };
}

/**
 * Hook to access formatter functions
 * @returns Formatter functions (formatPrice, formatDate, formatNumber)
 */
export function useFormatters() {
  const { formatPrice, formatDate, formatNumber } = useI18n();
  return { formatPrice, formatDate, formatNumber };
}
