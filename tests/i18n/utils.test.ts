import { describe, it, expect } from 'vitest';
import { createTranslate, createFormatPrice, createFormatDate, createFormatNumber } from '../../src/i18n/utils';

describe('i18n utils', () => {
  describe('createTranslate', () => {
    const englishTranslations = {
      common: {
        hello: 'Hello',
        goodbye: 'Goodbye'
      },
      nested: {
        deep: {
          value: 'Deep value'
        }
      }
    };

    const spanishTranslations = {
      common: {
        hello: 'Hola'
        // goodbye is missing - should fallback to English
      },
      nested: {
        deep: {
          value: 'Valor profundo'
        }
      }
    };

    it('should translate existing keys', () => {
      const t = createTranslate(spanishTranslations, englishTranslations);
      expect(t('common.hello')).toBe('Hola');
    });

    it('should fallback to English for missing keys', () => {
      const t = createTranslate(spanishTranslations, englishTranslations);
      expect(t('common.goodbye')).toBe('Goodbye');
    });

    it('should handle nested keys', () => {
      const t = createTranslate(spanishTranslations, englishTranslations);
      expect(t('nested.deep.value')).toBe('Valor profundo');
    });

    it('should return key itself if not found in any language', () => {
      const t = createTranslate(spanishTranslations, englishTranslations);
      expect(t('nonexistent.key')).toBe('nonexistent.key');
    });

    it('should interpolate variables', () => {
      const translations = {
        greeting: 'Hello {name}!',
        multi: '{count} items for {price}'
      };
      const t = createTranslate(translations, translations);
      
      expect(t('greeting', { name: 'John' })).toBe('Hello John!');
      expect(t('multi', { count: 5, price: '$10' })).toBe('5 items for $10');
    });

    it('should handle multiple instances of same variable', () => {
      const translations = {
        repeat: '{word} {word} {word}'
      };
      const t = createTranslate(translations, translations);
      
      expect(t('repeat', { word: 'test' })).toBe('test test test');
    });
  });

  describe('createFormatPrice', () => {
    it('should format USD correctly', () => {
      const formatPrice = createFormatPrice('USD', 'en-US');
      const result = formatPrice(12.5);
      expect(result).toMatch(/\$12\.50/);
    });

    it('should format EUR correctly', () => {
      const formatPrice = createFormatPrice('EUR', 'de-DE');
      const result = formatPrice(12.5);
      // German locale uses comma as decimal separator
      expect(result).toMatch(/12[,.]50/);
      expect(result).toContain('€');
    });

    it('should format GBP correctly', () => {
      const formatPrice = createFormatPrice('GBP', 'en-GB');
      const result = formatPrice(12.5);
      expect(result).toMatch(/£12\.50/);
    });

    it('should format JPY correctly (no decimals)', () => {
      const formatPrice = createFormatPrice('JPY', 'en-US');
      const result = formatPrice(1250);
      expect(result).toContain('1,250');
      expect(result).not.toContain('.00');
    });

    it('should handle custom options', () => {
      const formatPrice = createFormatPrice('USD', 'en-US');
      const result = formatPrice(12.5, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      expect(result).toBe('$12.50');
    });
  });

  describe('createFormatDate', () => {
    const testDate = new Date('2025-11-16T12:00:00Z');

    it('should format date for en-US locale', () => {
      const formatDate = createFormatDate('en-US');
      const result = formatDate(testDate, { year: 'numeric', month: 'long', day: 'numeric' });
      expect(result).toContain('November');
      expect(result).toContain('16');
      expect(result).toContain('2025');
    });

    it('should format date for de-DE locale', () => {
      const formatDate = createFormatDate('de-DE');
      const result = formatDate(testDate, { year: 'numeric', month: 'long', day: 'numeric' });
      expect(result).toContain('November');
      expect(result).toContain('16');
      expect(result).toContain('2025');
    });

    it('should use default formatting if no options provided', () => {
      const formatDate = createFormatDate('en-US');
      const result = formatDate(testDate);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('createFormatNumber', () => {
    it('should format number for en-US locale', () => {
      const formatNumber = createFormatNumber('en-US');
      expect(formatNumber(1234567.89)).toBe('1,234,567.89');
    });

    it('should format number for de-DE locale', () => {
      const formatNumber = createFormatNumber('de-DE');
      const result = formatNumber(1234567.89);
      // German uses period for thousands, comma for decimals
      expect(result).toMatch(/1[.]234[.]567[,]89/);
    });

    it('should handle custom options', () => {
      const formatNumber = createFormatNumber('en-US');
      const result = formatNumber(0.123, { style: 'percent', minimumFractionDigits: 1 });
      expect(result).toContain('12.3');
      expect(result).toContain('%');
    });
  });
});
