<!--
Sync Impact Report

Version change: none → 1.0.0
Modified principles: (added) I. Static & Code-first; II. Component-driven UI; III. Type safety & Test-first; IV. Accessibility & Localization; V. Simplicity, Observability & Versioning
Added sections: Additional Constraints, Development Workflow
Removed sections: none
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated
  - .specify/templates/spec-template.md ✅ checked
  - .specify/templates/tasks-template.md ✅ checked
  - .specify/templates/checklist-template.md ✅ checked
  - .specify/templates/agent-file-template.md ✅ checked
Follow-up TODOs: none
-->

# Garage Sale Constitution

## Core Principles

### I. Static & Code-first (NON-NEGOTIABLE)
The project is a static, client-side website. Content is source-controlled and
deployed via the normal build pipeline. Runtime servers, admin panels, or
long-lived backend services MUST NOT be introduced without a formal
governance amendment. Any change that requires a runtime backend or
persistent service MUST be documented as a MINOR or MAJOR amendment and
justify the added operational cost.

Rationale: keeping the project static preserves simplicity, low operational
overhead, and predictable deploys for this temporal garage-sale site.

### II. Component-driven, Reusable UI
UI MUST be implemented as small, well-documented, and typed React components.
Components MUST have clear props, minimal internal state, and be easily
testable in isolation. Visual or behavioral duplication that can be
componentized SHOULD be refactored into reusable components.

Rationale: component-driven design increases maintainability and makes the
static site easier to evolve and review.

### III. Type Safety & Test-First
TypeScript MUST be used for all application code. New features MUST include
types and at least one automated test that covers the feature's primary
behavior (unit or integration). Tests for critical behavior (sale-window
activation, filtering, sorting, and item status) are REQUIRED and must be
added before or alongside implementation (TDD encouraged).

Rationale: types and tests reduce regressions, clarify contracts between
components, and speed up safe refactors.

### IV. Accessibility & Localization
All UI MUST follow web accessibility best practices: semantic HTML, ARIA
roles where appropriate, keyboard navigation, and sufficient color contrast.
Dates and currency MUST be formatted using the user's locale. Accessibility
and localization considerations MUST be included in PR descriptions when
changes affect user-facing text, layout, or interactive controls.

Rationale: this site is public-facing and temporal; accessible and localized
content ensures it is usable by the broadest audience.

### V. Simplicity, Observability & Versioning
Keep features minimal (YAGNI). Instrument client-side code with lightweight
observability (structured console events or telemetry opt-in) to aid
debugging. Use semantic versioning for releases of the site itself (package
versioning in `package.json` follows MAJOR.MINOR.PATCH). Breaking changes to
project governance or principles require a MAJOR version bump of the
constitution.

Rationale: balance minimal surface area with enough signals to diagnose
issues in production builds and clear rules for breaking changes.

## Additional Constraints

- Tech stack: Vite + React + TypeScript. Use the existing build/runtime in
  `package.json` and `vite.config.ts` unless the change is approved via
  Governance.
- Sale window configuration: `src/constants.ts` is the canonical source for
  sale start/end dates. The UI MUST read from these constants; runtime
  overrides are disallowed without amendment.
- Items data: `src/data/items.ts` is the canonical content source. Editing
  listing content is a code change and follows normal PR and release flows.
- No runtime authentication or persistent backend is permitted without
  explicit governance approval.

## Development Workflow

- Pull Requests MUST include: summary of change, tests added/updated, and any
  accessibility or localization impacts.
- At least one repository maintainer approval is required to merge governance
  changes. Regular feature PRs require one approving reviewer and passing
  CI (lint/typecheck/tests).
- Releases: bump `package.json` version using semantic versioning. Document
  version changes in the PR title (e.g., `chore(release): v1.2.0`).

## Governance

Amendments to this Constitution follow these rules:

1. Propose an amendment via a Pull Request that edits this file in
   `.specify/memory/constitution.md` and includes a migration/compatibility
   note.
2. The PR MUST list the intended version bump type and rationale (MAJOR,
   MINOR, or PATCH) and include any automated checks or tests that verify
   compliance with the new principle(s).
3. Approval: at least two project maintainers OR one maintainer + one
   cross-collaborator must approve MAJOR or MINOR amendments. PATCH-level
   editorial changes may be approved by a single maintainer.
4. After merge, update the `**Version**`, `**Ratified**`, and
   `**Last Amended**` lines below and include the Sync Impact Report in the
   PR description.

Versioning rules for the constitution file:

- MAJOR: Backward-incompatible governance or principle removals/changes.
- MINOR: New principles or material expansions of guidance.
- PATCH: Wording clarifications, typos, or non-semantic refinements.

**Version**: 1.0.0 | **Ratified**: 2025-11-11 | **Last Amended**: 2025-11-11

