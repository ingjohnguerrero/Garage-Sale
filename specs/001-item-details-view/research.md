# Research: Item Details View (Phase 0)

Date: 2025-11-11

This document resolves the open decisions raised in the implementation plan
and records choices with rationale and alternatives.

## Decision 1 — ROUTING MODE

Decision: Implement the details view initially as a client-side modal overlay
with optional route integration later. The modal will update history (push
state) so back/forward behaves naturally and deep-linking can be added in a
follow-up if required.

Rationale: Modal overlays are faster to implement and provide the best
immediate UX on mobile for quick inspections. Updating browser history when
opening the modal gives a path to deep-linking without forcing route-first
design. This keeps initial scope small while preserving extensibility.

Alternatives considered:
- Dedicated route `/items/:id` (full-page): better for sharable deep links but
  requires router wiring and test coverage; higher scope.

## Decision 2 — IMAGE OPTIMIZATION

Decision: Support optional local optimization using `sharp` during the
seed/build step. The optimization step will be optional — the script will
detect `sharp` and, if available, produce optimized WebP and thumbnail
variants; otherwise it will copy original images. For future scaling,
integrating a CDN (Cloudflare Images / Cloudinary) remains a recommended
path.

Rationale: Local `sharp` enables immediate build-time savings without
adding external costs. Making the optimization optional avoids blocking
developers who can't (or don't want to) install native deps. CDN adoption is
suitable for production scale but is out-of-scope for the MVP.

Alternatives considered:
- Always require a CDN/service — simpler runtime but introduces cost and
  configuration.

## Decision 3 — CAROUSEL IMPLEMENTATION

Decision: Use a small, well-maintained carousel library (Embla Carousel) for
accessibility and touch support, wrapped in a small `ImageCarousel` component
to encapsulate behavior. Keep abstraction so we can replace the implementation
if needed.

Rationale: Embla is lightweight, offers accessibility patterns, and is
engineered for performance; building a custom carousel increases risk and
maintenance burden.

Alternatives considered:
- Custom implementation: minimal dependencies but more QA and accessibility
  testing required.

## Actionable tasks from research

- Implement modal-first details view and push history state on open.
- Add `ImageCarousel` component implemented with Embla (or swap if project
  prefers another small library).
- Add optional `sharp` optimization in `scripts/seed-from-csv.mjs` guarded
  by a runtime check so the script works without sharp.
