# Tasks: Item Details View

Feature: Item Details View
Path: `specs/001-item-details-view`
Generated from: `plan.md`, `spec.md`, `data-model.md`, `research.md`

---

Phase 1 — Setup

- [ ] T001 Install project dependencies (run `npm install`) — repo root (`package.json`)
- [x] T002 [P] Add Embla carousel dependency in `package.json` and install (`embla-carousel` / `embla-carousel-react`) — repo root (`package.json`)

Phase 2 — Foundational (blocking prerequisites)

- [x] T003 Add `src/components/ImageCarousel.tsx` file scaffold (empty component + prop types) — `src/components/ImageCarousel.tsx`
-- [x] T004 Update `scripts/seed-from-csv.mjs` to detect optional `sharp` and generate thumb/med variants when present — `scripts/seed-from-csv.mjs`
-- [x] T005 [P] Ensure `src/types.ts` contains Item and Image types (id,name,price,condition,status,timeOfUse,deliveryTime,description,images[],hidden) — `src/types.ts`

Phase 3 — User Story 1 (US1) — View Item Details (Priority: P1)

Story goal: Tap an item in the listing and open a mobile-first details view (modal-first) showing images, primary info, and description. Independent test: open any item and confirm details view shows image carousel, name, price, condition, status, timeOfUse, deliveryTime and description.

-- [x] T006 [US1] Create `src/components/ItemDetail.tsx` (modal-first details view implementing pushState on open) — `src/components/ItemDetail.tsx`
-- [x] T007 [US1] Implement image display and controls in `src/components/ItemDetail.tsx` using `ImageCarousel` — `src/components/ItemDetail.tsx`
-- [x] T008 [US1] Wire `ItemGrid` to open `ItemDetail` on item click/tap and pass selected item (modal open/close + history push) — `src/components/ItemGrid.tsx`
-- [x] T009 [US1] Add responsive styles for the details view (mobile-first) — `src/styles.css` (or `src/components/item-detail.css`)
-- [x] T010 [US1] Add a small smoke test for details view render (vitest + testing-library) — `tests/item-detail.spec.tsx`

Phase 4 — User Story 2 (US2) — Image Navigation & Performance (Priority: P2)

Story goal: Smooth, responsive image navigation (swipe/tap/controls) with progressive loading and preloading of adjacent images.

-- [x] T011 [US2] Implement `src/components/ImageCarousel.tsx` using Embla; support touch swipe, click/tap controls, keyboard left/right navigation and visible position indicator — `src/components/ImageCarousel.tsx`
-- [~] T012 [US2] Implement lazy-loading and adjacent-image preloading in `ImageCarousel` (use `loading="lazy"` + IntersectionObserver preloader) — `src/components/ImageCarousel.tsx` (in-progress)
-- [~] T013 [US2] Ensure first image placeholder → image transition is implemented (use CSS placeholder + progressive loading) — `src/components/ImageCarousel.tsx` & `src/styles.css` (in-progress)

Phase 5 — User Story 3 (US3) — Accessibility & Localization (Priority: P3)

Story goal: Details view is screen-reader friendly, keyboard navigable, and formats prices/dates according to locale.

-- [ ] T014 [US3] Ensure each image has `alt` text (derive from item name or description) in `ImageCarousel` and image elements include aria attributes (role, aria-label) — `src/components/ImageCarousel.tsx`
-- [ ] T015 [US3] Add aria-live announcements for current image position (e.g., "Image 2 of 4") in `ImageCarousel` — `src/components/ImageCarousel.tsx`
-- [ ] T016 [US3] Format prices/dates using `Intl.NumberFormat` / `Intl.DateTimeFormat` in `ItemDetail` — `src/components/ItemDetail.tsx`
-- [ ] T017 [US3] Add an automated accessibility smoke-check (axe-core or testing-library/axe) for details view — `tests/a11y/item-detail.a11y.test.tsx`

Phase 6 — Polish & Cross-cutting Concerns

-- [x] T018 Update `specs/001-item-details-view/quickstart.md` with new setup steps and how to seed images (confirm `sharp` optional path) — `specs/001-item-details-view/quickstart.md`
-- [x] T019 Add documentation entry in `README.md` describing the Item Details View and developer notes (`README.md`)
-- [x] T020 [P] Add small end-to-end manual test checklist in `specs/001-item-details-view/checklists/requirements.md` (ensure items like zero-image fallback, long descriptions, hidden items are validated) — `specs/001-item-details-view/checklists/requirements.md`

Dependencies (story completion order)

1. Foundational tasks (T003,T004,T005) MUST be completed before US1 (T006–T010) and US2 (T011–T013).
2. US1 (T006–T010) should be delivered as the MVP for user validation.
3. US2 (T011–T013) can be worked in parallel with later US1 polishing tasks (T009), but requires the `ImageCarousel` scaffold (T003).
4. US3 tasks (T014–T017) depend on `ImageCarousel` (T011) and `ItemDetail` (T006).

Parallel execution examples

- Example A: T002 (add Embla) and T004 (seed script sharp detection) are independent and can be done in parallel.
- Example B: T011 (implement carousel logic) and T013 (placeholder transition CSS) are parallelizable as long as the `ImageCarousel` API contract is preserved.

Implementation strategy (MVP first)

- MVP scope: Deliver US1 (T006–T010) with a working modal-first details view using a basic `ImageCarousel` scaffold (no optimization). This provides immediate user value.
- Iteration 1: Add US2 performance improvements (T011–T013) — enable lazy-loading + preloading, then verify speed on mobile throttled network.
- Iteration 2: Add US3 accessibility & localization checks (T014–T017) and automated tests.
- Optional: Enable `sharp`-based optimization in the seed script (T004) and document the developer opt-in path in `quickstart.md`.

Estimated task counts

- Total tasks: 20
- Tasks per story: US1:5, US2:3, US3:4, Foundational:3, Setup:2, Polish:3

Validation: All tasks follow the required checklist format with Task IDs and file paths.

---

Generated by speckit.tasks rules on 2025-11-11.```markdown
# Tasks: Item Details View

Feature: Item Details View
Path: `specs/001-item-details-view`
Generated from: `plan.md`, `spec.md`, `data-model.md`, `research.md`

---

Phase 1 — Setup

- [x] T001 Install project dependencies (run `npm install`) — repo root (`package.json`)
- [x] T002 [P] Add Embla carousel dependency in `package.json` and install (`embla-carousel` / `embla-carousel-react`) — repo root (`package.json`)

Phase 2 — Foundational (blocking prerequisites)

- [x] T003 Add `src/components/ImageCarousel.tsx` file scaffold (empty component + prop types) — `src/components/ImageCarousel.tsx`
- [ ] T004 Update `scripts/seed-from-csv.mjs` to detect optional `sharp` and generate thumb/med variants when present — `scripts/seed-from-csv.mjs`
- [ ] T005 [P] Ensure `src/types.ts` contains Item and Image types (id,name,price,condition,status,timeOfUse,deliveryTime,description,images[],hidden) — `src/types.ts`

Phase 3 — User Story 1 (US1) — View Item Details (Priority: P1)

Story goal: Tap an item in the listing and open a mobile-first details view (modal-first) showing images, primary info, and description. Independent test: open any item and confirm details view shows image carousel, name, price, condition, status, timeOfUse, deliveryTime and description.

- [x] T006 [US1] Create `src/components/ItemDetail.tsx` (modal-first details view implementing pushState on open) — `src/components/ItemDetail.tsx`
- [x] T007 [US1] Implement image display and controls in `src/components/ItemDetail.tsx` using `ImageCarousel` — `src/components/ItemDetail.tsx`
- [x] T008 [US1] Wire `ItemGrid` to open `ItemDetail` on item click/tap and pass selected item (modal open/close + history push) — `src/components/ItemGrid.tsx`
- [x] T009 [US1] Add responsive styles for the details view (mobile-first) — `src/styles.css` (or `src/components/item-detail.css`)
- [x] T010 [US1] Add a small smoke test for details view render (vitest + testing-library) — `tests/item-detail.spec.tsx`

Phase 4 — User Story 2 (US2) — Image Navigation & Performance (Priority: P2)

Story goal: Smooth, responsive image navigation (swipe/tap/controls) with progressive loading and preloading of adjacent images.

- [x] T011 [US2] Implement `src/components/ImageCarousel.tsx` using Embla; support touch swipe, click/tap controls, keyboard left/right navigation and visible position indicator — `src/components/ImageCarousel.tsx`
- [x] T012 [US2] Implement lazy-loading and adjacent-image preloading in `ImageCarousel` (use `loading="lazy"` + IntersectionObserver preloader) — `src/components/ImageCarousel.tsx`
- [x] T013 [US2] Ensure first image placeholder → image transition is implemented (use CSS placeholder + progressive loading) — `src/components/ImageCarousel.tsx` & `src/styles.css`

Phase 5 — User Story 3 (US3) — Accessibility & Localization (Priority: P3)

Story goal: Details view is screen-reader friendly, keyboard navigable, and formats prices/dates according to locale.

- [x] T014 [US3] Ensure each image has `alt` text (derive from item name or description) in `ImageCarousel` and image elements include aria attributes (role, aria-label) — `src/components/ImageCarousel.tsx`
- [x] T015 [US3] Add aria-live announcements for current image position (e.g., "Image 2 of 4") in `ImageCarousel` — `src/components/ImageCarousel.tsx`
- [x] T016 [US3] Format prices/dates using `Intl.NumberFormat` / `Intl.DateTimeFormat` in `ItemDetail` — `src/components/ItemDetail.tsx`
- [x] T017 [US3] Add an automated accessibility smoke-check (axe-core or testing-library/axe) for details view — `tests/a11y/item-detail.a11y.test.tsx`

Phase 6 — Polish & Cross-cutting Concerns

-- [x] T018 Update `specs/001-item-details-view/quickstart.md` with new setup steps and how to seed images (confirm `sharp` optional path) — `specs/001-item-details-view/quickstart.md`
-- [x] T019 Add documentation entry in `README.md` describing the Item Details View and developer notes (`README.md`)
-- [x] T020 [P] Add small end-to-end manual test checklist in `specs/001-item-details-view/checklists/requirements.md` (ensure items like zero-image fallback, long descriptions, hidden items are validated) — `specs/001-item-details-view/checklists/requirements.md`

Dependencies (story completion order)

1. Foundational tasks (T003,T004,T005) MUST be completed before US1 (T006–T010) and US2 (T011–T013).
2. US1 (T006–T010) should be delivered as the MVP for user validation.
3. US2 (T011–T013) can be worked in parallel with later US1 polishing tasks (T009), but requires the `ImageCarousel` scaffold (T003).
4. US3 tasks (T014–T017) depend on `ImageCarousel` (T011) and `ItemDetail` (T006).

Parallel execution examples

- Example A: T002 (add Embla) and T004 (seed script sharp detection) are independent and can be done in parallel.
- Example B: T011 (implement carousel logic) and T013 (placeholder transition CSS) are parallelizable as long as the `ImageCarousel` API contract is preserved.

Implementation strategy (MVP first)

- MVP scope: Deliver US1 (T006–T010) with a working modal-first details view using a basic `ImageCarousel` scaffold (no optimization). This provides immediate user value.
- Iteration 1: Add US2 performance improvements (T011–T013) — enable lazy-loading + preloading, then verify speed on mobile throttled network.
- Iteration 2: Add US3 accessibility & localization checks (T014–T017) and automated tests.
- Optional: Enable `sharp`-based optimization in the seed script (T004) and document the developer opt-in path in `quickstart.md`.

Estimated task counts

- Total tasks: 20
- Tasks per story: US1:5, US2:3, US3:4, Foundational:3, Setup:2, Polish:3

Validation: All tasks follow the required checklist format with Task IDs and file paths.

---

Generated by speckit.tasks rules on 2025-11-11.
```
