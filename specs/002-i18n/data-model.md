# Data Model: Internationalization (i18n) Support

**Feature**: 002-i18n  
**Created**: 2025-11-16  
**Status**: Complete

## Overview

This document defines the data structures for i18n support. Since this is a static, client-side implementation, there are no database schemas or API models. All entities are TypeScript types representing in-memory data structures.

---

## Core Entities

### 1. Locale Configuration

Represents the site's language and regional settings configured in `src/constants.ts`.

**Purpose**: Single source of truth for locale and currency configuration

**Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `locale` | `LocaleCode` | Yes | BCP 47 locale code (e.g., "en-US", "es-ES") |
| `currency` | `CurrencyCode` | Yes | ISO 4217 currency code (e.g., "USD", "EUR") |

**TypeScript Definition**:
```typescript
// src/types.ts
export type LocaleCode = 'en-US' | 'en-GB' | 'es-ES' | 'fr-FR' | 'de-DE';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface LocaleConfig {
  locale: LocaleCode;
  currency: CurrencyCode;
}
```

**Validation Rules**:
- `locale` must be one of the supported locales
- `currency` must be one of the supported currencies
- Invalid values fallback to `en-US` and `USD`

**Example**:
```typescript
// src/constants.ts
export const LOCALE: LocaleCode = 'es-ES';
export const CURRENCY: CurrencyCode = 'EUR';
```

---

### 2. Translation Bundle

Collection of translation key-value pairs for a single language.

**Purpose**: Store all UI text for one language in a structured, type-safe format

**Structure**:
```typescript
// src/locales/en.ts (source language example)
export const en = {
  common: {
    close: string;
    loading: string;
    error: string;
    noItems: string;
  };
  filters: {
    status: {
      label: string;
      all: string;
      available: string;
      sold: string;
    };
    condition: {
      label: string;
      all: string;
      new: string;
      likeNew: string;
      good: string;
      fair: string;
      poor: string;
    };
    sort: {
      label: string;
      priceLowHigh: string;
      priceHighLow: string;
      nameAZ: string;
      nameZA: string;
    };
  };
  item: {
    price: string;
    condition: string;
    timeOfUse: string;
    deliveryTime: string;
    description: string;
    close: string;
    sold: string;
  };
  inactive: {
    title: string;
    message: string;
    saleStarts: string;
    saleEnds: string;
  };
} as const;

export type TranslationBundle = typeof en;
```

**TypeScript Definition**:
```typescript
// src/i18n/types.ts
import type { en } from '../locales/en';

// Base translation bundle type from English
export type TranslationBundle = typeof en;

// Ensure all languages match English structure
export type TranslationFile<T extends TranslationBundle> = T;

// Flatten nested keys to dot notation
export type TranslationKey = RecursiveFlattenKeys<TranslationBundle>;

// Helper type to extract all possible key paths
type RecursiveFlattenKeys<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends string
    ? `${Prefix}${K & string}`
    : T[K] extends object
    ? RecursiveFlattenKeys<T[K], `${Prefix}${K & string}.`>
    : never;
}[keyof T];
```

**Validation Rules**:
- All language files must match English structure (enforced by TypeScript)
- Keys can be missing (fallback to English), but structure must align
- String values only (no functions, components, or complex types)
- No HTML in translation strings (security: prevent XSS)

**Relationships**:
- Each language file exports a `TranslationBundle`
- English (`en.ts`) is the source of truth for type generation
- Other languages (`es.ts`, `fr.ts`, `de.ts`) must conform to `TranslationBundle` type

**Example Translation Files**:
```typescript
// src/locales/es.ts
import type { TranslationFile, TranslationBundle } from '../i18n/types';

export const es: TranslationFile<TranslationBundle> = {
  common: {
    close: "Cerrar",
    loading: "Cargando...",
    error: "Ocurrió un error",
    noItems: "No hay artículos que coincidan con sus filtros."
  },
  filters: {
    status: {
      label: "Estado",
      all: "Todos",
      available: "Disponible",
      sold: "Vendido"
    },
    // ... rest of translations
  }
} as const;
```

---

### 3. Translation Context

React context value providing access to translations and locale configuration.

**Purpose**: Deliver translations and formatters to components via React Context API

**Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `locale` | `LocaleCode` | Current active locale |
| `currency` | `CurrencyCode` | Current active currency |
| `t` | `TranslationFunction` | Translation function |
| `formatPrice` | `PriceFormatter` | Currency formatter |
| `formatDate` | `DateFormatter` | Date formatter |
| `formatNumber` | `NumberFormatter` | Number formatter |

**TypeScript Definition**:
```typescript
// src/i18n/context.tsx
export interface I18nContextValue {
  locale: LocaleCode;
  currency: CurrencyCode;
  t: TranslationFunction;
  formatPrice: PriceFormatter;
  formatDate: DateFormatter;
  formatNumber: NumberFormatter;
}

export type TranslationFunction = (
  key: TranslationKey,
  variables?: Record<string, string | number>
) => string;

export type PriceFormatter = (
  amount: number,
  options?: Intl.NumberFormatOptions
) => string;

export type DateFormatter = (
  date: Date,
  options?: Intl.DateTimeFormatOptions
) => string;

export type NumberFormatter = (
  value: number,
  options?: Intl.NumberFormatOptions
) => string;
```

**Lifecycle**:
1. Context created once at app initialization
2. Values derived from `LOCALE` and `CURRENCY` constants
3. Remains static for entire session (no runtime changes)
4. Consumed via `useTranslation()` and `useFormatters()` hooks

---

### 4. Translation Key

Type-safe string literal representing a path to a translation value.

**Purpose**: Provide autocomplete and compile-time validation for translation keys

**TypeScript Definition**:
```typescript
// src/i18n/types.ts

// Valid translation keys (auto-generated from English)
export type TranslationKey =
  | 'common.close'
  | 'common.loading'
  | 'common.error'
  | 'common.noItems'
  | 'filters.status.label'
  | 'filters.status.all'
  | 'filters.status.available'
  | 'filters.status.sold'
  | 'filters.condition.label'
  | 'filters.condition.all'
  | 'filters.condition.new'
  | 'filters.condition.likeNew'
  | 'filters.condition.good'
  | 'filters.condition.fair'
  | 'filters.condition.poor'
  | 'filters.sort.label'
  | 'filters.sort.priceLowHigh'
  | 'filters.sort.priceHighLow'
  | 'filters.sort.nameAZ'
  | 'filters.sort.nameZA'
  | 'item.price'
  | 'item.condition'
  | 'item.timeOfUse'
  | 'item.deliveryTime'
  | 'item.description'
  | 'item.close'
  | 'item.sold'
  | 'inactive.title'
  | 'inactive.message'
  | 'inactive.saleStarts'
  | 'inactive.saleEnds';
```

**Usage**:
```typescript
// ✅ Valid - TypeScript autocomplete works
t('filters.status.all')

// ❌ Invalid - TypeScript compile error
t('filters.status.invalid')
```

---

## Formatter Configuration

### Currency Formatter Options

**Intl.NumberFormat Configuration**:
```typescript
interface CurrencyFormatterConfig {
  style: 'currency';
  currency: CurrencyCode;
  currencyDisplay?: 'symbol' | 'code' | 'name'; // default: 'symbol'
  minimumFractionDigits?: number; // auto-determined by currency
  maximumFractionDigits?: number; // auto-determined by currency
}
```

**Currency-Specific Behavior**:
| Currency | Symbol | Decimals | Example Output |
|----------|--------|----------|----------------|
| USD | $ | 2 | $50.00 |
| EUR | € | 2 | 50,00 € (de-DE) |
| GBP | £ | 2 | £50.00 |
| JPY | ¥ | 0 | ¥50 |

### Date Formatter Options

**Intl.DateTimeFormat Configuration**:
```typescript
interface DateFormatterConfig {
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  // Or custom:
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
  // ... more options
}
```

**Locale-Specific Date Formats**:
| Locale | Short Date | Long Date |
|--------|-----------|-----------|
| en-US | 11/15/2025 | November 15, 2025 |
| en-GB | 15/11/2025 | 15 November 2025 |
| es-ES | 15/11/2025 | 15 de noviembre de 2025 |
| fr-FR | 15/11/2025 | 15 novembre 2025 |
| de-DE | 15.11.2025 | 15. November 2025 |

---

## Type Safety Guarantees

### Compile-Time Checks

1. **Translation Key Validation**: All `t()` calls validate keys at compile time
2. **Bundle Structure**: All language files must match English structure
3. **Locale Code Validation**: Only supported locales allowed
4. **Currency Code Validation**: Only supported currencies allowed

### Runtime Checks

1. **Missing Translation Fallback**: Falls back to English if key missing
2. **Invalid Locale Handling**: Falls back to `en-US` if locale invalid
3. **Formatter Error Handling**: Returns unformatted value if Intl API fails

---

## Data Flow Diagram

```
┌─────────────────┐
│ constants.ts    │
│ LOCALE, CURRENCY│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ I18nProvider    │
│ (Context Setup) │
└────────┬────────┘
         │
         ├─────────────────┬─────────────────┐
         ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Translation     │ │ Locale Loaders  │ │ Formatters      │
│ Bundles (en,es,.│ │ (select active) │ │ (Intl API)      │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┴───────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Context Value   │
                    │ {t, formatters} │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Components      │
                    │ (via hooks)     │
                    └─────────────────┘
```

---

## Migration Notes

### Existing Data Impact

**No breaking changes to existing data structures**:
- `Item` type unchanged (prices remain numbers)
- `constants.ts` extended with new exports (additive)
- No database migrations (static site)

### Backward Compatibility

- All changes are additive (no removals)
- Default locale `en-US` preserves current behavior
- Existing hardcoded English strings become translation keys
- Components refactored incrementally (no big-bang rewrite)

---

## Testing Considerations

### Unit Test Data

**Mock Translation Bundle**:
```typescript
export const mockTranslations = {
  common: { close: "Close", loading: "Loading..." },
  filters: { status: { all: "All", available: "Available" } }
};
```

**Mock Context Value**:
```typescript
export const mockI18nContext: I18nContextValue = {
  locale: 'en-US',
  currency: 'USD',
  t: (key) => key, // Return key as value for testing
  formatPrice: (amount) => `$${amount.toFixed(2)}`,
  formatDate: (date) => date.toLocaleDateString('en-US'),
  formatNumber: (value) => value.toString(),
};
```

### Test Scenarios

1. **Translation Lookup**: Verify `t()` returns correct string for each locale
2. **Missing Key Fallback**: Verify English fallback when key missing
3. **Currency Formatting**: Verify all 4 currencies format correctly
4. **Date Formatting**: Verify all 5 locales format dates correctly
5. **Invalid Locale**: Verify graceful fallback to `en-US`
6. **Interpolation**: Verify variable substitution works correctly

---

## Performance Considerations

### Memory Usage

- **Translation Bundles**: ~5KB per language (4 languages = 20KB total)
- **Formatter Instances**: Minimal (reused across renders)
- **Context Value**: Single object, memoized

### Lookup Performance

- **Translation Lookup**: O(1) object property access
- **Nested Key Resolution**: O(n) where n = key depth (typically 2-3)
- **Formatting**: Native Intl API (optimized by browser)

### Bundle Size

- **Custom i18n Code**: ~3KB (utils + context + hooks)
- **Translations**: ~5KB per language
- **Total Overhead**: <25KB (all 4 languages)

---

## Summary

All data entities defined for i18n implementation:

1. ✅ **Locale Configuration** - Site language/currency config
2. ✅ **Translation Bundle** - Key-value pairs per language
3. ✅ **Translation Context** - React context for components
4. ✅ **Translation Key** - Type-safe key paths
5. ✅ **Formatter Configuration** - Intl API options

All entities are type-safe, validated, and documented for implementation.
