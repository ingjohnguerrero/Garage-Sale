# API Contracts: i18n Feature

**Feature**: 002-i18n  
**Created**: 2025-11-16

## No API Contracts

This feature has **no API contracts** because it is a client-side-only implementation that complies with Constitution Principle I (Static & Code-first).

### Why No APIs?

**i18n implementation is entirely client-side**:
- Translation files are TypeScript modules bundled at build time
- No runtime fetching of translations
- No translation management API
- No backend services
- No external API integrations

### Static Architecture Compliance

Per the project constitution:

> **Principle I: Static & Code-first (NON-NEGOTIABLE)**  
> The project is a static, client-side website. Content is source-controlled and deployed via the normal build pipeline. Runtime servers, admin panels, or long-lived backend services MUST NOT be introduced.

**This feature maintains static architecture**:
- ✅ Translations stored in source code (`src/locales/*.ts`)
- ✅ Build-time bundling via Vite
- ✅ No runtime API calls
- ✅ No backend dependencies
- ✅ Deployed as static files to Firebase Hosting

### Internal Contracts (Type Definitions)

While there are no HTTP API contracts, internal TypeScript contracts exist:

**Translation Function Contract**:
```typescript
type TranslationFunction = (
  key: TranslationKey,
  variables?: Record<string, string | number>
) => string;
```

**Formatter Contracts**:
```typescript
type PriceFormatter = (
  amount: number,
  options?: Intl.NumberFormatOptions
) => string;

type DateFormatter = (
  date: Date,
  options?: Intl.DateTimeFormatOptions
) => string;

type NumberFormatter = (
  value: number,
  options?: Intl.NumberFormatOptions
) => string;
```

**Context Contract**:
```typescript
interface I18nContextValue {
  locale: LocaleCode;
  currency: CurrencyCode;
  t: TranslationFunction;
  formatPrice: PriceFormatter;
  formatDate: DateFormatter;
  formatNumber: NumberFormatter;
}
```

These contracts are enforced by TypeScript at compile time, not through HTTP APIs at runtime.

### References

- **Constitution**: `.specify/memory/constitution.md` (Principle I)
- **Type Definitions**: `specs/002-i18n/data-model.md`
- **Implementation**: `specs/002-i18n/quickstart.md`

---

## Future Considerations

If the project were to add runtime translation capabilities (violates constitution without amendment), potential API contracts would include:

### Hypothetical Translation API (NOT IMPLEMENTED)

**⚠️ This would require a governance amendment (MAJOR version bump)**

```yaml
# NOT IMPLEMENTED - For reference only
GET /api/translations/{locale}
  Response: { translations: TranslationBundle }
  
POST /api/translations/{locale}/{key}
  Body: { value: string }
  Response: { success: boolean }
```

**Why this is not implemented**:
- Violates static-first principle
- Adds operational complexity (backend required)
- Requires authentication/authorization
- Increases deployment cost
- Not needed for MVP scope

---

## Summary

**No HTTP API contracts exist for this feature** because it is a pure client-side implementation using build-time translation bundling. All contracts are TypeScript interfaces enforced at compile time.
