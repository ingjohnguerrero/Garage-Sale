# Research: Internationalization (i18n) Support

**Feature**: 002-i18n  
**Created**: 2025-11-16  
**Status**: Complete

## Research Questions

### Q1: What i18n approach best fits a static React SPA with TypeScript?

**Decision**: Custom lightweight i18n implementation using browser Intl API and React Context

**Rationale**:
- **Constitution Principle I (Static & Code-first)**: Must avoid runtime backends or external services
- **Simplicity**: No need for heavy libraries (react-i18next, formatjs) that add 50-100KB+ bundle size
- **Type Safety**: Custom implementation allows TypeScript types for translation keys
- **Browser Support**: Intl API supported in all modern browsers (Chrome 24+, Firefox 29+, Safari 10+, Edge 12+)
- **Performance**: Direct object lookups faster than library abstractions
- **Control**: Full control over fallback logic, interpolation, and error handling

**Alternatives Considered**:
- **react-i18next** (most popular): 
  - ❌ 45KB+ bundle size
  - ❌ Adds complexity (namespaces, resources, loading logic)
  - ✅ Mature, well-tested
  - **Rejected**: Overkill for ~100 translation keys; violates simplicity principle
  
- **formatjs (react-intl)**:
  - ❌ 40KB+ bundle size
  - ❌ Requires Babel plugin for message extraction
  - ✅ Strong TypeScript support
  - **Rejected**: Too complex for static site; build tooling overhead
  
- **Custom implementation**:
  - ✅ <5KB bundle size
  - ✅ Full TypeScript integration
  - ✅ Complete control over behavior
  - ✅ Uses browser-native Intl for formatting
  - ❌ No pluralization library (acceptable - can add if needed)
  - **Selected**: Best fit for project requirements

**References**:
- [MDN: Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [Can I Use: Intl](https://caniuse.com/mdn-javascript_builtins_intl)

---

### Q2: How should translation keys be organized and typed?

**Decision**: Nested object structure with TypeScript type generation from English source

**Rationale**:
- **Type Safety**: Generate translation key types from English source file (single source of truth)
- **Organization**: Group keys by feature/component (e.g., `common`, `filters`, `itemDetail`)
- **Autocomplete**: IDE autocomplete for translation keys via TypeScript
- **Validation**: Compile-time errors for typos or missing keys
- **Maintainability**: Easy to see all translations for a component in one place

**Structure**:
```typescript
// src/locales/en.ts (source language)
export const en = {
  common: {
    close: "Close",
    loading: "Loading...",
    error: "An error occurred"
  },
  filters: {
    status: {
      all: "All",
      available: "Available",
      sold: "Sold"
    },
    condition: {
      all: "All Conditions",
      new: "New",
      likeNew: "Like New",
      good: "Good",
      fair: "Fair",
      poor: "Poor"
    }
  },
  // ... more keys
} as const;

// src/i18n/types.ts (auto-generated types)
type TranslationKeys = typeof en;
type FlattenKeys<T> = /* recursive type to flatten nested keys */
```

**Alternatives Considered**:
- **Flat key structure** (`filter_status_all`):
  - ✅ Simple lookups
  - ❌ No logical grouping
  - ❌ Hard to maintain at scale
  - **Rejected**: Poor organization for 50+ keys
  
- **Namespaces with separate files**:
  - ✅ Separation of concerns
  - ❌ Multiple import statements
  - ❌ Type generation more complex
  - **Rejected**: Overhead not justified for small project
  
- **JSON files**:
  - ✅ Standard format
  - ❌ No TypeScript type inference
  - ❌ Requires JSON import configuration
  - **Rejected**: TypeScript modules provide better DX

**References**:
- [TypeScript: Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [React Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context)

---

### Q3: How should currency and number formatting be handled?

**Decision**: Use Intl.NumberFormat and Intl.DateTimeFormat with locale and currency from constants

**Rationale**:
- **Browser Native**: No external libraries needed
- **Automatic Formatting**: Handles all currency symbols, decimal places, separators
- **Locale Aware**: Respects regional conventions (e.g., "1.234,56" in DE vs "1,234.56" in US)
- **Type Safe**: Create typed wrapper utilities

**Implementation Pattern**:
```typescript
// src/i18n/utils.ts
export function formatPrice(
  amount: number,
  currency: Currency,
  locale: string
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatDate(
  date: Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}
```

**Currency Handling**:
- USD: "$50.00" (2 decimals)
- EUR: "50,00 €" (2 decimals, different position/separator)
- GBP: "£50.00" (2 decimals)
- JPY: "¥50" (0 decimals - yen doesn't use fractional currency)

**Date Formatting**:
- en-US: "11/15/2025" (MM/DD/YYYY)
- en-GB: "15/11/2025" (DD/MM/YYYY)
- de-DE: "15.11.2025" (DD.MM.YYYY)
- fr-FR: "15/11/2025" (DD/MM/YYYY)

**Alternatives Considered**:
- **Hardcoded format strings**:
  - ❌ Error-prone (miss edge cases)
  - ❌ Manual maintenance for each locale
  - **Rejected**: Intl API handles this automatically
  
- **date-fns or moment.js**:
  - ❌ Large bundle size (30-70KB)
  - ❌ Requires locale data imports
  - **Rejected**: Intl API sufficient for our needs

**References**:
- [MDN: Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [MDN: Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)

---

### Q4: How should translation context be provided to components?

**Decision**: React Context with custom hooks (useTranslation, useFormatters)

**Rationale**:
- **React Best Practice**: Context ideal for global configuration (locale, translations)
- **Performance**: Minimal re-renders (locale changes are rare, only on rebuild)
- **Developer Experience**: Clean hook-based API familiar to React developers
- **Testing**: Easy to mock context in tests

**API Design**:
```typescript
// Usage in components
function MyComponent() {
  const { t } = useTranslation();
  const { formatPrice, formatDate } = useFormatters();
  
  return (
    <div>
      <h1>{t('common.title')}</h1>
      <p>{formatPrice(50, 'USD')}</p>
    </div>
  );
}

// Provider setup in main.tsx
<I18nProvider locale={LOCALE} currency={CURRENCY}>
  <App />
</I18nProvider>
```

**Alternatives Considered**:
- **Props drilling**:
  - ❌ Verbose (pass through every component)
  - ❌ Refactoring nightmare
  - **Rejected**: Context is the standard solution
  
- **Global singleton**:
  - ✅ Simple implementation
  - ❌ Hard to test (global state)
  - ❌ No React integration
  - **Rejected**: Context provides better React integration
  
- **Higher-Order Component (HOC)**:
  - ❌ Outdated pattern (pre-hooks era)
  - ❌ Wrapper hell with multiple HOCs
  - **Rejected**: Hooks are modern standard

**References**:
- [React: useContext Hook](https://react.dev/reference/react/useContext)
- [Kent C. Dodds: Application State Management with React](https://kentcdodds.com/blog/application-state-management-with-react)

---

### Q5: How should missing translations be handled?

**Decision**: Graceful fallback to English with development-mode logging

**Rationale**:
- **User Experience**: Never show blank UI or translation keys to users
- **Developer Experience**: Log warnings in dev mode to catch missing translations
- **Maintainability**: Easy to identify incomplete translations during development

**Fallback Strategy**:
1. Try configured language (e.g., Spanish)
2. If key missing, try English (source language)
3. If still missing, return key itself as fallback
4. In development: console.warn with missing key details
5. In production: silent fallback (no console spam)

**Implementation**:
```typescript
function translate(key: string, locale: string): string {
  const translations = getTranslations(locale);
  
  // Try target language
  if (hasKey(translations, key)) {
    return getValue(translations, key);
  }
  
  // Fallback to English
  if (locale !== 'en' && hasKey(en, key)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation for key "${key}" in locale "${locale}"`);
    }
    return getValue(en, key);
  }
  
  // Last resort: return key
  if (process.env.NODE_ENV === 'development') {
    console.error(`Translation key "${key}" not found in any locale`);
  }
  return key;
}
```

**Alternatives Considered**:
- **Throw error on missing key**:
  - ❌ Breaks user experience
  - ❌ Requires complete translations before deployment
  - **Rejected**: Too rigid for incremental translation
  
- **Show translation key to users** (e.g., "filters.status.all"):
  - ❌ Unprofessional
  - ❌ Confusing for end users
  - **Rejected**: Fallback to English better UX
  
- **Empty string on missing translation**:
  - ❌ Blank UI elements
  - ❌ Hard to debug
  - **Rejected**: Explicit fallback clearer

**References**:
- [i18n Best Practices: Fallback Strategies](https://www.i18next.com/principles/fallback)

---

### Q6: How should interpolation and dynamic values be handled?

**Decision**: Simple template string replacement with named placeholders

**Rationale**:
- **Simplicity**: No need for complex ICU MessageFormat for initial scope
- **Type Safety**: Can type-check required variables
- **Readable**: Clear what variables are needed in translation strings
- **Extensible**: Can add ICU format later if pluralization needed

**Implementation**:
```typescript
// Translation with placeholders
export const en = {
  itemDetail: {
    priceLabel: "Price: {{price}}",
    timeOfUse: "Used for {{duration}}",
    deliveryInfo: "Delivery: {{time}}"
  }
};

// Translation function with variables
function t(key: string, variables?: Record<string, string | number>): string {
  let text = translate(key);
  
  if (variables) {
    Object.entries(variables).forEach(([name, value]) => {
      text = text.replace(new RegExp(`{{${name}}}`, 'g'), String(value));
    });
  }
  
  return text;
}

// Usage
t('itemDetail.priceLabel', { price: formatPrice(50, 'USD') })
// Returns: "Price: $50.00"
```

**Alternatives Considered**:
- **ICU MessageFormat**:
  - ✅ Handles pluralization, gender, selection
  - ❌ Complex syntax: `{count, plural, one {# item} other {# items}}`
  - ❌ Requires parser library
  - **Deferred**: Can add if pluralization becomes critical
  
- **Template literals**:
  - ❌ Can't store in JSON
  - ❌ Not translatable (code embedded in translations)
  - **Rejected**: Need plain strings for translation files
  
- **React elements as variables**:
  - ✅ Allows styled spans, links inside translations
  - ❌ More complex implementation
  - **Deferred**: String-only sufficient for MVP

**References**:
- [ICU MessageFormat](https://unicode-org.github.io/icu/userguide/format_parse/messages/)
- [i18next Interpolation](https://www.i18next.com/translation-function/interpolation)

---

## Best Practices Summary

### Translation File Organization
- One file per language: `en.ts`, `es.ts`, `fr.ts`, `de.ts`
- Export const object with `as const` for type inference
- Group keys by feature/component
- Use camelCase for key names
- Keep keys short but descriptive

### Component Integration
- Use `useTranslation()` hook in components
- Extract all hardcoded strings to translation files
- Keep translation keys colocated with component usage
- Avoid translation keys in data models (translate at display time)

### Testing Strategy
- Unit test translation lookup and fallback
- Unit test formatters (currency, date, number)
- Integration test components in multiple languages
- Accessibility test ARIA labels in all languages
- Visual regression test (optional) for layout changes

### Performance Considerations
- Lazy load translations (only active language bundled)
- Memoize formatter instances (create once per locale change)
- Avoid re-creating Intl formatters on every render
- Keep translation bundles small (<50KB per language)

### Maintenance Guidelines
- English is source language (always complete)
- Other languages can be partial (fallback to English)
- Add translation keys before using in components
- Review machine translations before committing
- Document translation conventions in README

---

## Technical Decisions Summary

| Decision Area | Choice | Rationale |
|--------------|--------|-----------|
| i18n Library | Custom implementation | Simplicity, type safety, no bundle overhead |
| Translation Storage | TypeScript modules | Type inference, IDE support |
| Key Structure | Nested objects | Logical grouping, maintainability |
| Formatting | Intl API | Browser-native, comprehensive |
| Context Delivery | React Context + Hooks | React best practice, testable |
| Fallback Strategy | English fallback + dev logging | User experience, debuggability |
| Interpolation | Template strings | Simple, extensible |
| Type Safety | Generated from English | Single source of truth |
| Bundle Strategy | Build-time selection | Static, fast, small |
| Testing | Unit + Integration + A11y | Comprehensive coverage |

---

## Implementation Risks and Mitigations

### Risk: Translation incompleteness
- **Impact**: Some UI shows English when other language configured
- **Mitigation**: TypeScript types enforce all keys present, CI check for completeness
- **Fallback**: Graceful English fallback ensures no broken UI

### Risk: Layout breaks with long translations
- **Impact**: UI elements overflow or wrap unexpectedly (German words often longer)
- **Mitigation**: CSS with `overflow-wrap: break-word`, test with longest translations
- **Fallback**: Responsive design should handle variable text lengths

### Risk: Performance overhead
- **Impact**: Translation lookups slow down rendering
- **Mitigation**: Memoize translations, profile with React DevTools
- **Measurement**: Target <10ms per translation, <50ms initialization

### Risk: Accessibility regressions
- **Impact**: ARIA labels not translated, screen reader UX poor
- **Mitigation**: jest-axe tests for all languages, manual screen reader testing
- **Validation**: A11y tests must pass for all supported languages

### Risk: Date/number formatting bugs
- **Impact**: Prices or dates display incorrectly in some locales
- **Mitigation**: Comprehensive unit tests for all locale/currency combinations
- **Testing**: Test matrix: 4 locales × 4 currencies = 16 test cases

---

## Next Steps

Phase 0 research complete. Proceed to Phase 1:
1. Create data-model.md (translation entities)
2. Create quickstart.md (developer setup guide)
3. Create contracts/README.md (no API contracts, note static nature)
4. Update agent context with i18n technology
