import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useI18n, useTranslation, useFormatters } from '../../src/i18n/hooks';
import { I18nProvider } from '../../src/i18n/context';
import { en } from '../../src/locales/en';

describe('i18n hooks', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <I18nProvider
      locale="en-US"
      currency="USD"
      translations={en}
      fallbackTranslations={en}
    >
      {children}
    </I18nProvider>
  );

  describe('useI18n', () => {
    it('should provide full i18n context', () => {
      const { result } = renderHook(() => useI18n(), { wrapper });
      
      expect(result.current.locale).toBe('en-US');
      expect(result.current.currency).toBe('USD');
      expect(typeof result.current.t).toBe('function');
      expect(typeof result.current.formatPrice).toBe('function');
      expect(typeof result.current.formatDate).toBe('function');
      expect(typeof result.current.formatNumber).toBe('function');
    });

    it('should provide context when used inside provider', () => {
      // This test verifies the hook works within provider
      // The error case is handled by the hook throwing
      const { result } = renderHook(() => useI18n(), { wrapper });
      expect(result.current).toBeDefined();
    });
  });

  describe('useTranslation', () => {
    it('should provide translation function', () => {
      const { result } = renderHook(() => useTranslation(), { wrapper });
      
      expect(typeof result.current.t).toBe('function');
      expect(result.current.t('common.close')).toBe('Close');
    });
  });

  describe('useFormatters', () => {
    it('should provide formatter functions', () => {
      const { result } = renderHook(() => useFormatters(), { wrapper });
      
      expect(typeof result.current.formatPrice).toBe('function');
      expect(typeof result.current.formatDate).toBe('function');
      expect(typeof result.current.formatNumber).toBe('function');
    });

    it('should format prices correctly', () => {
      const { result } = renderHook(() => useFormatters(), { wrapper });
      const formatted = result.current.formatPrice(12.5);
      expect(formatted).toMatch(/\$12\.50/);
    });
  });
});
