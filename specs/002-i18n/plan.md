# Implementation Plan: Internationalization (i18n) Support

**Branch**: `002-i18n` | **Date**: 2025-11-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-i18n/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add internationalization (i18n) support to the garage sale website, enabling multi-language content display and locale-aware formatting. The site administrator will configure language and currency via constants in `src/constants.ts`. All UI text will be translatable, and prices, dates, and numbers will format according to the configured locale using browser-native Intl APIs. Initial support includes English, Spanish, French, and German with graceful fallback to English for missing translations.

## Technical Context

**Language/Version**: TypeScript 5.2+, React 18  
**Primary Dependencies**: React 18, Vite 5, existing project dependencies (no new i18n libraries required - using browser Intl API)  
**Storage**: Translation files as TypeScript/JSON modules in source code (static, build-time bundled)  
**Testing**: Vitest with jsdom, @testing-library/react, jest-axe for accessibility  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - all support Intl API)  
**Project Type**: Single project (static React SPA)  
**Performance Goals**: <50ms overhead for i18n initialization, <10ms per translation lookup, <200KB total translation bundle size  
**Constraints**: Must remain static (no runtime translation fetching), must preserve accessibility (ARIA labels in all languages), must not break existing functionality  
**Scale/Scope**: ~50-100 translation keys initially, 4 languages baseline (en, es, fr, de), extensible to 10+ languages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

This plan MUST be checked against the project Constitution at
`.specify/memory/constitution.md`. At minimum, the plan MUST declare the
following checks and any deviations:

### ✅ Principle I: Static & Code-first (NON-NEGOTIABLE)
**Status**: COMPLIANT

- Translation files are TypeScript/JSON modules stored in `src/locales/`
- All translations bundled at build time via Vite
- No runtime backend, APIs, or translation services
- Configuration via `src/constants.ts` (build-time constant)
- Deployment remains static Firebase Hosting

**Justification**: i18n implementation uses static translation bundles that are code-committed and bundled during build. No runtime fetching or backend services introduced.

### ✅ Principle II: Component-driven, Reusable UI
**Status**: COMPLIANT

- Create reusable translation hooks (`useTranslation`, `useLocale`)
- Create reusable formatting utilities (`formatPrice`, `formatDate`)
- Existing components remain isolated and testable
- Translation logic centralized in i18n utilities

**Approach**: Refactor existing components to use translation hooks instead of hardcoded strings. Each component remains independently testable with mocked translation context.

### ✅ Principle III: Type Safety & Test-First
**Status**: COMPLIANT

- Translation keys will be TypeScript types (autocomplete + compile-time validation)
- Locale configuration will be strictly typed
- Tests required for:
  - Translation fallback behavior
  - Currency formatting (all 4 currencies)
  - Date formatting (all 4 locales)
  - Missing translation handling
  - Component rendering in each language

**Testing Strategy**: Unit tests for utilities, integration tests for component translation, accessibility tests for ARIA labels in multiple languages.

### ✅ Principle IV: Accessibility & Localization
**Status**: COMPLIANT - This feature IMPLEMENTS this principle

- All ARIA labels will be translatable
- Screen reader text will be localized
- RTL support deferred (out of scope) but architecture allows future addition
- Semantic HTML preserved across translations
- Keyboard navigation unaffected

**A11y Testing**: Add jest-axe tests for translated components to ensure ARIA attributes are present and correct in all languages.

### ✅ Principle V: Simplicity, Observability & Versioning
**Status**: COMPLIANT

- Minimal implementation: No external i18n libraries (use browser Intl API)
- Console logging for missing translations (development mode only)
- Fallback to English prevents blank UI
- Translation keys follow consistent naming convention

**Observability**: Log missing translation keys in development, silent fallback in production.

### Summary

**Gate Status**: ✅ PASS - No Constitution violations  
**Governance Impact**: None (PATCH-level change, no principle amendments needed)  
**Risk Level**: Low (purely additive feature, no breaking changes to existing code)

## Project Structure

### Documentation (this feature)

```text
specs/002-i18n/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── README.md        # No API contracts (static site)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/          # Existing components (will be refactored)
│   ├── FilterSort.tsx
│   ├── InactiveNotice.tsx
│   ├── ItemCard.tsx
│   ├── ItemDetail.tsx
│   ├── ItemGrid.tsx
│   └── ImageCarousel.tsx
├── i18n/                # NEW: i18n infrastructure
│   ├── index.ts         # Main i18n setup and exports
│   ├── context.tsx      # React context for locale/translations
│   ├── hooks.ts         # useTranslation, useLocale hooks
│   ├── types.ts         # TypeScript types for translation keys
│   └── utils.ts         # formatPrice, formatDate, formatNumber utils
├── locales/             # NEW: Translation files
│   ├── en.ts            # English (source language)
│   ├── es.ts            # Spanish
│   ├── fr.ts            # French
│   └── de.ts            # German
├── constants.ts         # MODIFIED: Add LOCALE, CURRENCY constants
├── types.ts             # MODIFIED: Add Locale, Currency types
├── main.tsx             # MODIFIED: Wrap app in i18n provider
└── App.tsx              # Existing (no changes)

tests/
├── i18n/                # NEW: i18n tests
│   ├── hooks.test.tsx
│   ├── utils.test.ts
│   └── translations.test.ts
├── a11y/                # MODIFIED: Add i18n a11y tests
│   └── i18n.a11y.test.tsx
└── integration/         # NEW: Integration tests
    └── i18n-components.test.tsx
```

**Structure Decision**: Single project structure (Option 1). This is a static React SPA with all code in `src/`. New i18n infrastructure added as dedicated directories (`src/i18n/`, `src/locales/`) following existing component organization pattern. Tests organized by type (unit, integration, a11y) in `tests/` directory.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - this section is not applicable.


---

## Phase 0: Research (Complete)

**Status**: ✅ Complete  
**Artifact**: `research.md`

All technical decisions documented:
- Custom i18n implementation (no external libraries)
- TypeScript type generation from English source
- Browser Intl API for formatting
- React Context for delivery
- Graceful fallback strategy
- Simple interpolation for dynamic values

See `research.md` for detailed rationale and alternatives considered.

---

## Phase 1: Design & Contracts (Complete)

**Status**: ✅ Complete  
**Artifacts**: `data-model.md`, `quickstart.md`, `contracts/README.md`

### Data Model
- Locale Configuration types
- Translation Bundle structure
- Translation Context interface
- Type-safe translation keys
- Formatter configurations

See `data-model.md` for complete entity definitions and relationships.

### Quickstart Guide
- 5-phase implementation plan (Days 1-5)
- Step-by-step code examples
- Testing strategy
- Deployment checklist
- Troubleshooting guide

See `quickstart.md` for developer implementation instructions.

### Contracts
- No HTTP API contracts (static architecture)
- Internal TypeScript contracts documented
- Constitution compliance verified

See `contracts/README.md` for contract documentation.

### Agent Context Update
- ✅ GitHub Copilot context file updated with i18n technology
- Technologies: TypeScript 5.2+, React 18, Vite 5, Intl API
- Storage: TypeScript/JSON translation modules

---

## Constitution Re-Check (Post-Phase 1)

**Re-evaluation Status**: ✅ PASS - All principles remain compliant after design

### Detailed Re-Check

#### Principle I: Static & Code-first
**Status**: ✅ COMPLIANT (CONFIRMED)

After completing design phase:
- ✅ All translations stored in `src/locales/*.ts` (TypeScript modules)
- ✅ Zero runtime API calls (confirmed in contracts/README.md)
- ✅ Build-time bundling only (Vite bundles translations)
- ✅ No backend services introduced
- ✅ Firebase Hosting deployment unchanged

**Evidence**: `contracts/README.md` explicitly documents no API contracts exist.

#### Principle II: Component-driven, Reusable UI
**Status**: ✅ COMPLIANT (CONFIRMED)

After completing design phase:
- ✅ Reusable hooks: `useTranslation()`, `useFormatters()`
- ✅ Reusable utilities: `formatPrice()`, `formatDate()`, `formatNumber()`
- ✅ Context pattern for dependency injection
- ✅ Components remain testable in isolation (mock context)

**Evidence**: `quickstart.md` Step 1.5 shows clean hook-based API for components.

#### Principle III: Type Safety & Test-First
**Status**: ✅ COMPLIANT (CONFIRMED)

After completing design phase:
- ✅ Translation keys are TypeScript literal types (autocomplete + validation)
- ✅ Locale and currency codes are typed enums
- ✅ Comprehensive test strategy documented:
  - Unit tests for utilities (`tests/i18n/utils.test.ts`)
  - Integration tests for components (`tests/integration/i18n-components.test.tsx`)
  - Accessibility tests for all languages (`tests/a11y/i18n.a11y.test.tsx`)

**Evidence**: `quickstart.md` Phase 4 documents complete testing approach. `data-model.md` shows strict TypeScript types for all entities.

#### Principle IV: Accessibility & Localization
**Status**: ✅ COMPLIANT (CONFIRMED) - Feature implements this principle

After completing design phase:
- ✅ All ARIA labels translatable (confirmed in quickstart examples)
- ✅ jest-axe tests required for all languages
- ✅ Semantic HTML preserved (translation replaces text only)
- ✅ Keyboard navigation unaffected (no UI structure changes)

**Evidence**: `quickstart.md` Step 4.3 shows accessibility testing for multiple languages. `data-model.md` includes ARIA label translation in requirements.

#### Principle V: Simplicity, Observability & Versioning
**Status**: ✅ COMPLIANT (CONFIRMED)

After completing design phase:
- ✅ Minimal implementation: No external libraries, <25KB total overhead
- ✅ Development logging for missing translations (production silent)
- ✅ Graceful fallback prevents blank UI
- ✅ Simple template interpolation (no complex ICU format needed initially)

**Evidence**: `research.md` Q1 documents decision to use custom implementation (<5KB) vs libraries (40-50KB). Logging strategy documented in `data-model.md`.

### Final Gate Status

**Constitution Compliance**: ✅ PASS  
**Governance Amendment Required**: ❌ NO  
**Risk Level**: Low (additive feature, no breaking changes)  
**Ready for Implementation**: ✅ YES

All five Constitution principles verified compliant after detailed design. No governance amendments needed. Feature ready for task breakdown via `/speckit.tasks`.

---

## Next Steps

Planning phase complete. Proceed to:

1. **Review artifacts**:
   - Read `research.md` for technical decisions
   - Read `data-model.md` for entity definitions
   - Read `quickstart.md` for implementation guide
   - Read `contracts/README.md` for contract documentation

2. **Run task generation**: Execute `/speckit.tasks` to create `tasks.md` with detailed implementation tasks organized by user story.

3. **Begin implementation**: Follow the 5-phase plan in `quickstart.md` or work through tasks in `tasks.md` (once generated).

---

## Summary

**Implementation Plan Status**: ✅ COMPLETE

- ✅ Summary extracted from spec
- ✅ Technical context filled (no NEEDS CLARIFICATION)
- ✅ Constitution check passed (initial + post-design)
- ✅ Project structure defined
- ✅ Phase 0: Research complete (research.md)
- ✅ Phase 1: Design complete (data-model.md, quickstart.md, contracts/)
- ✅ Agent context updated (.github/copilot-instructions.md)

**Ready for**: Task generation (`/speckit.tasks`) and implementation.

