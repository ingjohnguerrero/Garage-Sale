# Quickstart Guide: i18n Implementation

**Feature**: 002-i18n  
**For**: Developers implementing internationalization  
**Created**: 2025-11-16

## Overview

This guide provides step-by-step instructions for implementing i18n support in the Garage Sale website. Follow these steps in order to add multi-language support with minimal risk.

---

## Prerequisites

- Node.js 18+ and npm installed
- Existing project cloned and dependencies installed (`npm install`)
- Familiarity with React, TypeScript, and React Context API
- Understanding of the project constitution (static-first principle)

---

## Phase 1: Setup i18n Infrastructure (Day 1)

### Step 1.1: Add Locale Constants

**File**: `src/constants.ts`

```typescript
// Add to existing exports
export type LocaleCode = 'en-US' | 'en-GB' | 'es-ES' | 'fr-FR' | 'de-DE';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY';

// Configure site locale and currency
export const LOCALE: LocaleCode = 'en-US';
export const CURRENCY: CurrencyCode = 'USD';
```

**Test**: `npm run build` should succeed with no TypeScript errors.

---

### Step 1.2: Create Type Definitions

**File**: `src/i18n/types.ts`

```typescript
import type { en } from '../locales/en';

// Base translation bundle type from English
export type TranslationBundle = typeof en;

// Flatten nested keys to dot notation for type-safe keys
export type TranslationKey = RecursiveFlattenKeys<TranslationBundle>;

// Helper type to extract all possible key paths
type RecursiveFlattenKeys<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends string
    ? `${Prefix}${K & string}`
    : T[K] extends object
    ? RecursiveFlattenKeys<T[K], `${Prefix}${K & string}.`>
    : never;
}[keyof T];

// Translation function type
export type TranslationFunction = (
  key: TranslationKey,
  variables?: Record<string, string | number>
) => string;
```

---

### Step 1.3: Create English Translation File (Source Language)

**File**: `src/locales/en.ts`

Extract all hardcoded strings from components. Start with a baseline:

```typescript
export const en = {
  common: {
    close: "Close",
    loading: "Loading...",
    error: "An error occurred",
    noItems: "No items match your current filters.",
  },
  filters: {
    status: {
      label: "Status",
      all: "All",
      available: "Available",
      sold: "Sold",
    },
    condition: {
      label: "Condition",
      all: "All Conditions",
      new: "New",
      likeNew: "Like New",
      good: "Good",
      fair: "Fair",
      poor: "Poor",
    },
    sort: {
      label: "Sort by",
      priceLowHigh: "Price: Low to High",
      priceHighLow: "Price: High to Low",
      nameAZ: "Name: A to Z",
      nameZA: "Name: Z to A",
    },
  },
  item: {
    price: "Price",
    condition: "Condition",
    timeOfUse: "Time of Use",
    deliveryTime: "Delivery",
    description: "Description",
    close: "Close",
    sold: "SOLD",
  },
  inactive: {
    title: "Sale Not Active",
    message: "The garage sale is not currently active.",
    saleStarts: "Sale starts:",
    saleEnds: "Sale ends:",
  },
} as const;
```

**Note**: Use `as const` to enable type inference for translation keys.

---

### Step 1.4: Create Utility Functions

**File**: `src/i18n/utils.ts`

```typescript
import type { TranslationBundle, TranslationKey } from './types';
import type { CurrencyCode, LocaleCode } from '../constants';
import { en } from '../locales/en';

/**
 * Get nested value from object using dot notation key
 */
function getNestedValue(obj: any, path: string): string | undefined {
  const keys = path.split('.');
  let current = obj;
  
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
 * Translate a key to text with optional variable interpolation
 */
export function translate(
  key: TranslationKey,
  translations: TranslationBundle,
  locale: string,
  variables?: Record<string, string | number>
): string {
  // Try target language
  let text = getNestedValue(translations, key);
  
  // Fallback to English
  if (text === undefined && locale !== 'en') {
    text = getNestedValue(en, key);
    
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation for key "${key}" in locale "${locale}"`);
    }
  }
  
  // Last resort: return key
  if (text === undefined) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Translation key "${key}" not found in any locale`);
    }
    return key;
  }
  
  // Interpolate variables
  if (variables) {
    Object.entries(variables).forEach(([name, value]) => {
      text = text!.replace(new RegExp(`{{${name}}}`, 'g'), String(value));
    });
  }
  
  return text;
}

/**
 * Format price with currency symbol and locale
 */
export function formatPrice(
  amount: number,
  currency: CurrencyCode,
  locale: LocaleCode
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Format date with locale
 */
export function formatDate(
  date: Date,
  locale: LocaleCode,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return date.toLocaleDateString();
  }
}

/**
 * Format number with locale
 */
export function formatNumber(
  value: number,
  locale: LocaleCode,
  options?: Intl.NumberFormatOptions
): string {
  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch (error) {
    console.error('Number formatting error:', error);
    return value.toString();
  }
}
```

---

### Step 1.5: Create React Context

**File**: `src/i18n/context.tsx`

```typescript
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { TranslationFunction } from './types';
import type { LocaleCode, CurrencyCode } from '../constants';
import { translate, formatPrice, formatDate, formatNumber } from './utils';

interface I18nContextValue {
  locale: LocaleCode;
  currency: CurrencyCode;
  t: TranslationFunction;
  formatPrice: (amount: number) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  locale: LocaleCode;
  currency: CurrencyCode;
  children: ReactNode;
}

export function I18nProvider({ locale, currency, children }: I18nProviderProps) {
  // Lazy load translation bundle for active locale
  const translations = useMemo(() => {
    const lang = locale.split('-')[0]; // 'en-US' -> 'en'
    
    switch (lang) {
      case 'es':
        return import('../locales/es').then(m => m.es);
      case 'fr':
        return import('../locales/fr').then(m => m.fr);
      case 'de':
        return import('../locales/de').then(m => m.de);
      default:
        return import('../locales/en').then(m => m.en);
    }
  }, [locale]);
  
  // Wait for translations to load (in practice, Vite bundles these so it's instant)
  const [bundle, setBundle] = useState<TranslationBundle | null>(null);
  
  useEffect(() => {
    translations.then(setBundle);
  }, [translations]);
  
  const value = useMemo<I18nContextValue | null>(() => {
    if (!bundle) return null;
    
    return {
      locale,
      currency,
      t: (key, variables) => translate(key, bundle, locale, variables),
      formatPrice: (amount) => formatPrice(amount, currency, locale),
      formatDate: (date, options) => formatDate(date, locale, options),
      formatNumber: (value, options) => formatNumber(value, locale, options),
    };
  }, [locale, currency, bundle]);
  
  if (!value) {
    return <div>Loading translations...</div>;
  }
  
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

// Convenience hooks
export function useTranslation() {
  const { t } = useI18n();
  return { t };
}

export function useFormatters() {
  const { formatPrice, formatDate, formatNumber } = useI18n();
  return { formatPrice, formatDate, formatNumber };
}
```

---

### Step 1.6: Create Index File

**File**: `src/i18n/index.ts`

```typescript
export { I18nProvider, useI18n, useTranslation, useFormatters } from './context';
export { translate, formatPrice, formatDate, formatNumber } from './utils';
export type { TranslationKey, TranslationBundle, TranslationFunction } from './types';
```

---

### Step 1.7: Wrap App in Provider

**File**: `src/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { I18nProvider } from './i18n';
import { LOCALE, CURRENCY } from './constants';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider locale={LOCALE} currency={CURRENCY}>
      <App />
    </I18nProvider>
  </React.StrictMode>,
);
```

**Test**: Run `npm run dev` and verify app loads without errors.

---

## Phase 2: Refactor Components (Days 2-3)

### Strategy

Refactor components one at a time to use translations. Start with simple components and progress to complex ones.

### Step 2.1: Refactor ItemCard Component

**File**: `src/components/ItemCard.tsx`

**Before**:
```typescript
<div className="item-price">${item.price.toFixed(2)}</div>
<div className="item-condition">Condition: {item.condition}</div>
```

**After**:
```typescript
import { useTranslation, useFormatters } from '../i18n';

export function ItemCard({ item, onOpen }: ItemCardProps) {
  const { t } = useTranslation();
  const { formatPrice } = useFormatters();
  
  return (
    // ... existing JSX
    <div className="item-price">{formatPrice(item.price)}</div>
    <div className="item-condition">
      {t('item.condition')}: {t(`filters.condition.${item.condition.toLowerCase().replace(' ', '')}`)}
    </div>
    // ... rest of JSX
  );
}
```

**Test**: Verify ItemCard displays prices and conditions correctly.

---

### Step 2.2: Refactor FilterSort Component

**File**: `src/components/FilterSort.tsx`

Replace all hardcoded strings with `t()` calls:

```typescript
import { useTranslation } from '../i18n';

export function FilterSort({ /* props */ }: FilterSortProps) {
  const { t } = useTranslation();
  
  return (
    <div className="filter-sort">
      <div className="filter-group">
        <label htmlFor="status-filter">{t('filters.status.label')}</label>
        <select id="status-filter" value={statusFilter} onChange={/* handler */}>
          <option value="all">{t('filters.status.all')}</option>
          <option value="available">{t('filters.status.available')}</option>
          <option value="sold">{t('filters.status.sold')}</option>
        </select>
      </div>
      {/* Repeat for condition and sort filters */}
    </div>
  );
}
```

---

### Step 2.3: Refactor InactiveNotice Component

**File**: `src/components/InactiveNotice.tsx`

```typescript
import { useTranslation, useFormatters } from '../i18n';
import { SALE_START, SALE_END } from '../constants';

export function InactiveNotice() {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  
  return (
    <div className="inactive-notice">
      <h1>{t('inactive.title')}</h1>
      <p>{t('inactive.message')}</p>
      <p>
        {t('inactive.saleStarts')} {formatDate(SALE_START, { dateStyle: 'long' })}
      </p>
      <p>
        {t('inactive.saleEnds')} {formatDate(SALE_END, { dateStyle: 'long' })}
      </p>
    </div>
  );
}
```

---

### Step 2.4: Refactor ItemDetail Component

Similar process: replace strings with translation keys, format prices/dates.

---

## Phase 3: Add Additional Languages (Day 4)

### Step 3.1: Create Spanish Translations

**File**: `src/locales/es.ts`

```typescript
import type { TranslationBundle } from '../i18n/types';

export const es: TranslationBundle = {
  common: {
    close: "Cerrar",
    loading: "Cargando...",
    error: "Ocurrió un error",
    noItems: "No hay artículos que coincidan con sus filtros.",
  },
  filters: {
    status: {
      label: "Estado",
      all: "Todos",
      available: "Disponible",
      sold: "Vendido",
    },
    condition: {
      label: "Condición",
      all: "Todas las condiciones",
      new: "Nuevo",
      likeNew: "Como Nuevo",
      good: "Bueno",
      fair: "Aceptable",
      poor: "Malo",
    },
    sort: {
      label: "Ordenar por",
      priceLowHigh: "Precio: Bajo a Alto",
      priceHighLow: "Precio: Alto a Bajo",
      nameAZ: "Nombre: A a Z",
      nameZA: "Nombre: Z a A",
    },
  },
  item: {
    price: "Precio",
    condition: "Condición",
    timeOfUse: "Tiempo de uso",
    deliveryTime: "Entrega",
    description: "Descripción",
    close: "Cerrar",
    sold: "VENDIDO",
  },
  inactive: {
    title: "Venta No Activa",
    message: "La venta de garaje no está actualmente activa.",
    saleStarts: "La venta comienza:",
    saleEnds: "La venta termina:",
  },
} as const;
```

### Step 3.2: Create French and German Translations

Follow the same pattern for `src/locales/fr.ts` and `src/locales/de.ts`.

---

## Phase 4: Testing (Day 5)

### Step 4.1: Unit Tests for Utilities

**File**: `tests/i18n/utils.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate, formatNumber } from '../../src/i18n/utils';

describe('formatPrice', () => {
  it('formats USD correctly', () => {
    expect(formatPrice(50, 'USD', 'en-US')).toBe('$50.00');
  });
  
  it('formats EUR correctly', () => {
    expect(formatPrice(50, 'EUR', 'de-DE')).toBe('50,00 €');
  });
  
  it('formats JPY without decimals', () => {
    expect(formatPrice(50, 'JPY', 'ja-JP')).toBe('¥50');
  });
});

describe('formatDate', () => {
  const testDate = new Date('2025-11-15T00:00:00Z');
  
  it('formats en-US date correctly', () => {
    const result = formatDate(testDate, 'en-US', { dateStyle: 'short' });
    expect(result).toMatch(/11\/15\/2025/);
  });
  
  it('formats de-DE date correctly', () => {
    const result = formatDate(testDate, 'de-DE', { dateStyle: 'short' });
    expect(result).toMatch(/15\.11\.2025/);
  });
});
```

### Step 4.2: Integration Tests for Components

**File**: `tests/integration/i18n-components.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nProvider } from '../../src/i18n';
import { ItemCard } from '../../src/components/ItemCard';

describe('ItemCard with i18n', () => {
  const mockItem = {
    id: '1',
    name: 'Test Item',
    price: 50,
    condition: 'Good',
    // ... other fields
  };
  
  it('displays price in USD', () => {
    render(
      <I18nProvider locale="en-US" currency="USD">
        <ItemCard item={mockItem} onOpen={() => {}} />
      </I18nProvider>
    );
    
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });
  
  it('displays price in EUR', () => {
    render(
      <I18nProvider locale="de-DE" currency="EUR">
        <ItemCard item={mockItem} onOpen={() => {}} />
      </I18nProvider>
    );
    
    expect(screen.getByText(/50,00 €/)).toBeInTheDocument();
  });
});
```

### Step 4.3: Accessibility Tests

**File**: `tests/a11y/i18n.a11y.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { I18nProvider } from '../../src/i18n';
import { FilterSort } from '../../src/components/FilterSort';

describe('FilterSort accessibility in multiple languages', () => {
  it('has no a11y violations in English', async () => {
    const { container } = render(
      <I18nProvider locale="en-US" currency="USD">
        <FilterSort /* props */ />
      </I18nProvider>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('has no a11y violations in Spanish', async () => {
    const { container } = render(
      <I18nProvider locale="es-ES" currency="EUR">
        <FilterSort /* props */ />
      </I18nProvider>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## Phase 5: Documentation (Day 5)

### Update README.md

Add section explaining how to change language:

```markdown
## Internationalization

The site supports multiple languages: English, Spanish, French, and German.

### Changing the Language

Edit `src/constants.ts`:

```typescript
export const LOCALE: LocaleCode = 'es-ES'; // Change to desired locale
export const CURRENCY: CurrencyCode = 'EUR'; // Change to desired currency
```

Rebuild and redeploy:

```bash
npm run build
npm run deploy
```

### Supported Locales

- `en-US` - English (United States) + USD
- `en-GB` - English (United Kingdom) + GBP
- `es-ES` - Spanish (Spain) + EUR
- `fr-FR` - French (France) + EUR
- `de-DE` - German (Germany) + EUR

### Adding New Translations

1. Create `src/locales/{lang}.ts` matching the structure of `src/locales/en.ts`
2. Add locale code to `LocaleCode` type in `src/constants.ts`
3. Update dynamic import in `src/i18n/context.tsx`
4. Run tests: `npm test`
```

---

## Troubleshooting

### Issue: TypeScript errors on translation keys

**Solution**: Ensure `en.ts` uses `as const` and types are generated correctly. Run `npm run build` to check for type errors.

### Issue: Translations not showing

**Solution**: Check browser console for missing translation warnings. Verify locale code matches file name.

### Issue: Prices formatting incorrectly

**Solution**: Verify currency code is valid ISO 4217 code. Check browser Intl API support.

### Issue: Build size too large

**Solution**: Verify tree-shaking is working. Check that only active locale is bundled (not all 4).

---

## Performance Checklist

- [ ] Translation bundles <50KB total
- [ ] Only active language bundled (not all 4)
- [ ] Intl formatters memoized (not recreated on every render)
- [ ] No unnecessary re-renders (use React.memo if needed)
- [ ] Development-only logs removed in production build

---

## Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] All components refactored to use i18n
- [ ] All 4 languages have complete translations
- [ ] Accessibility tests passing for all languages
- [ ] README updated with i18n instructions
- [ ] Locale and currency configured in constants.ts
- [ ] Production build tested locally (`npm run preview`)

---

## Next Steps

After completing this quickstart:

1. Run full test suite: `npm test`
2. Test manually in all 4 languages (change LOCALE constant and rebuild)
3. Verify accessibility with screen reader
4. Deploy to staging for review
5. Get translation review from native speakers (optional)
6. Deploy to production

---

## Support

For issues or questions:
- Check `specs/002-i18n/research.md` for implementation decisions
- Review `specs/002-i18n/data-model.md` for type definitions
- Consult project constitution for governance rules
