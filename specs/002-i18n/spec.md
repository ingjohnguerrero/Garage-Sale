# Feature Specification: Internationalization (i18n) Support

**Feature Branch**: `002-i18n`  
**Created**: 2025-11-16  
**Status**: Draft  
**Input**: User description: "Add i18n implementation for website controller, based on a variable in constants.ts for language and currency"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Language Selection (Priority: P1)

Visitors can view the garage sale website content in their preferred language. The site administrator configures the default language in constants.ts, and all UI text, labels, buttons, and messages appear in that language.

**Why this priority**: Language support is foundational for international audiences. Without it, non-English speakers cannot effectively use the site, directly impacting accessibility and reach.

**Independent Test**: Can be fully tested by changing the language constant and verifying all UI text renders in the selected language. Delivers immediate value by making the site accessible to speakers of the configured language.

**Acceptance Scenarios**:

1. **Given** the language constant is set to "en-US", **When** a visitor loads the site, **Then** all UI text displays in English
2. **Given** the language constant is set to "es-ES", **When** a visitor loads the site, **Then** all UI text displays in Spanish
3. **Given** the language constant is set to "fr-FR", **When** a visitor loads the site, **Then** all UI text displays in French
4. **Given** an unsupported language code is configured, **When** the site loads, **Then** it falls back to English as the default

---

### User Story 2 - Currency Formatting (Priority: P1)

Visitors see prices formatted according to the configured currency and locale. The site administrator sets the currency in constants.ts, and all monetary values display with the correct currency symbol, decimal places, and formatting conventions.

**Why this priority**: Correct currency display is critical for a sale website. Incorrect or ambiguous pricing creates confusion and erodes trust. This is essential for the core business function.

**Independent Test**: Can be fully tested by changing the currency constant and verifying all prices format correctly with proper symbols and conventions. Delivers immediate value by showing accurate, localized pricing.

**Acceptance Scenarios**:

1. **Given** the currency constant is set to "USD", **When** a visitor views item prices, **Then** prices display as "$50.00" format
2. **Given** the currency constant is set to "EUR", **When** a visitor views item prices, **Then** prices display as "50,00 €" format
3. **Given** the currency constant is set to "GBP", **When** a visitor views item prices, **Then** prices display as "£50.00" format
4. **Given** the currency constant is set to "JPY", **When** a visitor views item prices, **Then** prices display as "¥50" format (no decimal places)

---

### User Story 3 - Date and Number Formatting (Priority: P2)

Visitors see dates and numbers formatted according to the configured locale. Sale window dates, time-of-use descriptions, and any numeric values follow the locale's formatting conventions.

**Why this priority**: While not blocking core functionality, consistent locale-aware formatting improves user experience and professionalism. This builds on P1 stories to provide complete localization.

**Independent Test**: Can be fully tested by changing the locale constant and verifying dates and numbers follow locale conventions. Delivers value by providing familiar, readable formatting for international users.

**Acceptance Scenarios**:

1. **Given** the locale is set to "en-US", **When** a visitor views the sale window dates, **Then** dates display as "11/15/2025" format
2. **Given** the locale is set to "en-GB", **When** a visitor views the sale window dates, **Then** dates display as "15/11/2025" format
3. **Given** the locale is set to "de-DE", **When** a visitor views the sale window dates, **Then** dates display as "15.11.2025" format
4. **Given** the locale is set to "fr-FR", **When** a visitor views large numbers, **Then** numbers display as "1 234,56" format

---

### User Story 4 - Translation Coverage (Priority: P3)

All user-facing text elements are translatable, including item conditions, delivery options, filter labels, sort options, button text, and system messages.

**Why this priority**: Complete translation coverage ensures a professional, fully localized experience. This is a refinement that can be added incrementally after core i18n infrastructure is in place.

**Independent Test**: Can be fully tested by auditing all UI text for hardcoded strings and verifying each has a translation key. Delivers value by eliminating any English-only text that breaks the localized experience.

**Acceptance Scenarios**:

1. **Given** the site is configured for Spanish, **When** a visitor uses the condition filter, **Then** condition options display as "Nuevo", "Como Nuevo", "Bueno", etc.
2. **Given** the site is configured for French, **When** a visitor views sort options, **Then** options display as "Prix: Bas à Élevé", "Prix: Élevé à Bas", etc.
3. **Given** the site is configured for German, **When** a visitor sees no results, **Then** the empty state message displays in German
4. **Given** the site is configured for any language, **When** a visitor interacts with the item detail modal, **Then** all buttons and labels display in that language

---

### Edge Cases

- What happens when a translation key is missing for the configured language?
- How does the system handle incomplete translations (some keys translated, others not)?
- What happens if the locale constant contains an invalid or malformed locale code?
- How are pluralization rules handled (e.g., "1 item" vs "2 items" in different languages)?
- What happens to dynamically generated content that includes interpolated values?
- How are right-to-left (RTL) languages handled if that becomes a future requirement?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST read language configuration from a constant in `src/constants.ts`
- **FR-002**: System MUST read currency configuration from a constant in `src/constants.ts`
- **FR-003**: System MUST support multiple languages including English, Spanish, French, and German as a baseline
- **FR-004**: System MUST format all prices according to the configured currency and locale conventions
- **FR-005**: System MUST format all dates according to the configured locale conventions
- **FR-006**: System MUST provide translation keys for all user-facing text (UI labels, buttons, messages, filters, sort options)
- **FR-007**: System MUST provide translation keys for item metadata (conditions, delivery options, status labels)
- **FR-008**: System MUST fall back to English translations when a translation key is missing in the configured language
- **FR-009**: System MUST handle currency symbols correctly for each supported currency (USD, EUR, GBP, JPY)
- **FR-010**: System MUST handle number formatting according to locale (decimal separators, thousands separators)
- **FR-011**: System MUST maintain existing functionality for date range checking (sale window active/inactive)
- **FR-012**: System MUST preserve accessibility attributes (ARIA labels) in all languages

### Key Entities *(include if feature involves data)*

- **Locale Configuration**: Represents the site's language and regional settings
  - Language code (e.g., "en-US", "es-ES", "fr-FR")
  - Currency code (e.g., "USD", "EUR", "GBP")
  - Determines all formatting conventions

- **Translation Bundle**: Collection of translation keys and their localized values
  - Organized by language code
  - Covers UI text, labels, messages, and system strings
  - Supports interpolation for dynamic content

- **Formatted Value**: Localized representation of prices, dates, and numbers
  - Uses Intl API for browser-native formatting
  - Respects locale conventions automatically
  - No hardcoded format strings

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All UI text elements are translatable with no hardcoded strings remaining
- **SC-002**: Currency formatting matches native conventions for each supported currency (verified by comparing output to Intl.NumberFormat standard)
- **SC-003**: Date formatting matches native conventions for each supported locale (verified by comparing output to Intl.DateTimeFormat standard)
- **SC-004**: Site administrator can switch languages by changing a single constant and rebuilding
- **SC-005**: Missing translations gracefully fall back to English without errors or blank UI elements
- **SC-006**: All existing functionality (filtering, sorting, sale window, item details) works identically across all supported languages
- **SC-007**: Page load time increases by no more than 50ms with i18n implementation (translations are lightweight)
- **SC-008**: At least 4 languages fully supported with 100% translation coverage (English, Spanish, French, German)

## Assumptions

- **Translation source**: English is the source language; all other languages are translations from English
- **Translation management**: Translations are maintained in code (JSON/TypeScript files) and updated via code changes (no external translation management system required per static-first principle)
- **Supported languages**: Initial implementation focuses on major European languages; additional languages can be added incrementally
- **Single language per visit**: The entire site displays in one language; no dynamic language switching during a session (configuration is build-time only)
- **Translation quality**: Translations are provided by the project maintainer or contributors; machine translation may be used as a starting point but should be reviewed
- **RTL support**: Right-to-left languages (Arabic, Hebrew) are out of scope for initial implementation; can be added in future if needed
- **Pluralization**: Complex pluralization rules can be handled with simple interpolation or multiple translation keys initially
- **Browser compatibility**: Use native Intl API (supported in all modern browsers as documented in project constitution)

## Dependencies

- **Constitution Principle I (Static & Code-first)**: i18n implementation must remain static; translations are bundled at build time, not fetched at runtime
- **Constitution Principle III (Type Safety)**: Translation keys and locale configurations must be typed
- **Constitution Principle IV (Accessibility & Localization)**: This feature directly implements the localization requirement
- **Existing constants.ts**: File structure and export pattern must be preserved
- **Existing date formatting**: Current `Intl.DateTimeFormat` usage should be centralized and extended

## Out of Scope

- Dynamic language switching via UI controls (future enhancement; static-first principle requires build-time configuration)
- Translation management UI or admin panel (violates static-first principle)
- Automatic translation via external APIs (violates static-first principle; translations are code-controlled)
- User-specific language preferences with cookies/localStorage (build-time configuration only for MVP)
- Content translation for item descriptions (assumes item descriptions remain in original language or are manually translated in data source)
- SEO optimization with multiple language versions of the site (single language per deployment for MVP)
