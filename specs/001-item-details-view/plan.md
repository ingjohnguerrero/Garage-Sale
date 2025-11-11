# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add a mobile-first Item Details View for the Garage Sale site. When a user
taps or clicks an item in the listing they will see a details view that
shows a multi-image carousel (swipe/tap/keyboard), the item's primary
information (name, price, condition, status, time of use, delivery info,
description), and accessible controls. Images should be progressively
loaded and optimized to limit mobile bandwidth.

## Technical Context

**Language/Version**: TypeScript (>=5.x), React 18, Vite 5  
**Primary Dependencies**: react, react-dom, vite, existing dev tooling from repo (TypeScript)  
**Storage**: N/A (static site — item data compiled into bundle or served as static JSON)  
**Testing**: vitest / testing-library recommended (project currently uses no tests)  
**Target Platform**: Web (mobile-first responsive design)  
**Project Type**: Single-page static web app (Vite + React)  
**Performance Goals**: Fast initial details render on 3G/4G mobile (first meaningful paint within a few seconds). Lazy-load additional images and use optimized variants to keep payload small.  
**Constraints**: Must preserve static, client-first architecture per Constitution. No runtime backend or external persistent store without governance approval.  
**Scale/Scope**: Small site; number of items small (dozens–low hundreds); images are the primary bandwidth concern.

Open decisions / clarifications (require Phase 0 research):

- ROUTING MODE: Should the details view be implemented as a client-side modal overlay (preferred for quick back/forward UX) or as a dedicated route (`/items/:id`) that supports deep-linking and browser navigation? [NEEDS CLARIFICATION]
- IMAGE OPTIMIZATION: Should images be optimized at build/seed time using a local tool (sharp) or should a hosted CDN/service be used for dynamic resizing/format negotiation? This affects build complexity and hosting costs. [NEEDS CLARIFICATION]
- CAROUSEL IMPLEMENTATION: Use a lightweight, accessible carousel library (e.g., Embla Carousel, Swiper) or implement a small custom carousel to avoid adding dependencies? Tradeoffs: accessibility, bundle size, maintenance. [NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

This plan MUST be checked against the project Constitution at
`.specify/memory/constitution.md`. At minimum, the plan MUST declare the
following checks and any deviations:

- Preservation of the static, client-first architecture (no runtime backend)
- Accessibility impact and required accessibility tests
- Type-safety requirements and where TypeScript types/tests will be added
- Any feature that expands scope (e.g., adds a backend, external service,
  or persistent data store) MUST be justified and flagged as a potential
  governance amendment (MINOR/MAJOR).

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: Single `src/` web app. New files/components to add:

- `src/components/ItemDetail.tsx` — details view component (modal or route based on decision)
- `src/components/ImageCarousel.tsx` — accessible carousel wrapper (library or custom)
- `src/pages/ItemDetailPage.tsx` (optional) — route-backed details page if deep-linking chosen
- `src/data/items.ts` (existing) — compiled items data; optionally add `public/data/items.json` if runtime fetch desired

Reference existing project layout under `src/` (App.tsx, components/, data/)
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
