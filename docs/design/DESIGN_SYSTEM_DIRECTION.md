# Design System Direction

## Status

Early direction only. Not a rewrite.

## Purpose

Sentry Sound needs reusable UI direction without slowing product progress.

The near-term design system should emerge from working product surfaces such as Song Capture V2, Artist Capture, Works/Songs, and supporting operational pages.

## Current Stance

Build practical product UX now while remaining compatible with future governance maturity.

This means:

- continue frontend implementation
- continue UX refinement
- continue reusable component work
- continue visual direction workflows
- standardize repeated patterns quietly
- avoid throwaway frontend patterns where practical

## Reusable Pattern Priorities

Prioritize reusable conventions for:

- page shells
- side navigation
- workflow steppers
- section cards
- right rails
- summary panels
- status badges
- forms and field groups
- locked/unlocked workflow states
- save/review actions
- help/tips panels
- upload/reference areas

## Product Language

Prefer user-facing product language:

- Song Capture
- Add Song
- Continue Song
- Supporting Materials
- Files & Assets
- Save Song Foundation
- Mark contributors reviewed

Avoid exposing internal governance language to normal users unless the surface is explicitly admin/back-office.

## Authority Boundary

Frontend components can represent state.

Frontend components must not own operational truth.

Backend/source-of-truth remains authoritative for:

- workflow state
- persistence
- evidence posture
- public/private boundaries
- readiness/completeness
- approval status

## Future Compatibility

This direction should remain compatible with:

- future governed asset systems
- future design-system alignment
- future Design Agent governance contracts
- future Figma/design-source integration
- future local retrieval or SLM-compatible pattern lookup

## Anti-Patterns

Avoid:

- frontend paralysis
- frozen component bureaucracy
- token-system obsession
- design-only architecture work
- Figma-first dependency
- visual systems overriding operational truth

