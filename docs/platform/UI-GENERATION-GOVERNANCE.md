# Sentry Sound Platform - UI Generation Governance

## Purpose

This document defines how future UI development should be approached for Sentry Sound Platform.

UI development is not the current phase, but this document preserves the intended future approach so the platform does not drift into traditional slow UI troubleshooting or AI-invented frontend logic.

## Core Rule

The UI must be generated or accelerated from approved backend contracts, API endpoints, system states, and platform workflows.

The UI must not invent operational truth.

AI-generated visual mockups are Visual Direction Artifacts, not executable UI systems.

They may guide hierarchy, tone, spacing, product intuition, and stakeholder alignment, but they must not be treated as component architecture, frontend truth, reusable assets, final layout systems, or executable design systems.

## Intended Future UI Approach

Future UI development may use AI-assisted visual-to-code workflows such as:

- v0.dev
- Cursor
- Lovable
- Bolt
- similar React/Tailwind/shadcn generation tools

These tools may be used to generate interface layouts, components, dashboards, cards, workflows, and visual polish.

Visual outputs from these tools must pass through AI Visual Extraction before implementation. The extraction step translates the mockup into:

- layout hierarchy
- spacing relationships
- UX intent
- interaction feel
- emotional tone
- product priority
- reusable asset candidates

The extraction output informs implementation, but it is not itself implementation authority.

## AI Visual Systems Doctrine

Sentry Sound adopts the Plexicon AI Visual Systems principle:

AI-generated UI mockups are Visual Direction Artifacts, not executable UI systems.

Validated production workflow:

Visual Direction Artifact
->
AI Visual Extraction
->
Production Asset Pack
->
Codex Asset Integration
->
Executable frontend system

Use AI visuals for:

- UX direction
- emotional tone
- hierarchy
- premium feel
- product intuition
- stakeholder alignment

Do not use AI visuals as:

- component architecture
- frontend truth
- reusable assets
- final layout systems
- executable design systems

Any AI visual mockup used for Sentry Sound frontend work must first be interpreted into practical development guidance. The implementation must then be built through approved Next.js/Tailwind patterns and reusable local components where appropriate.

## Production Asset Pack Pipeline

When a visual direction requires reusable imagery, icons, textures, brand marks, or product media, create or collect those assets separately from the flattened mockup.

Preferred asset structure:

```text
public/assets/
  branding/
  hero/
  catalogue/
  icons/
  textures/
```

Production assets must be:

- intentionally generated, exported, or sourced as standalone files
- named clearly enough for future reuse
- stored in the approved asset structure
- integrated by Codex through reusable Next.js/Tailwind components
- reviewed as part of the product UX implementation, not assumed from the mockup

Do not:

- extract assets from flattened AI images
- treat screenshots as frontend architecture
- treat mockup pixels as asset truth
- let cinematic visuals override SaaS usability
- let Plexicon doctrine dominate Sentry Sound UX execution

## Critical Boundary

AI-generated UI must only render existing backend truth.

It must map to:

- approved API endpoints
- backend contracts
- workflow states
- role/permission rules
- validation outputs
- operational metrics
- readiness results
- audit/governance records

## Forbidden

AI-generated UI must not:

- invent backend logic
- create new operational workflows
- invent database fields
- bypass validation
- bypass RBAC
- duplicate business rules
- create direct database persistence from UI
- become the source of system truth

## Required Workflow

Future UI development must follow this sequence:

1. Backend contract, source-of-truth state, or approved existing route is identified.
2. If an AI visual/mockup is used, treat it as direction only.
3. Perform AI Visual Extraction: layout hierarchy, spacing, UX intent, tone, interaction feel, and product priority.
4. Generate, collect, or approve real reusable production assets separately from the mockup.
5. Store production assets in `/public/assets` or the current approved asset structure, preferably under `branding/`, `hero/`, `catalogue/`, `icons/`, or `textures/`.
6. Build executable UI through reusable Next.js/Tailwind components and existing app patterns.
7. Wire UI only to existing approved backend endpoints or existing local state for purely visual/product changes.
8. Keep backend/source-of-truth and operational workflow logic authoritative.
9. Test runtime behavior in the browser or with targeted lint/tests as appropriate.
10. Update documentation and build log.

## Design Direction

The UI should support the platform identity:

- product-first song and workspace management
- calm operational clarity
- human-readable guidance
- contributor/split management
- rights lifecycle visibility when relevant
- registration readiness only when backend-supported and contextually useful
- royalty/finance visibility only in the right product area
- audit and governance visibility without doctrine-heavy UX

Backend and doctrine semantics should support the UX quietly. They should not dominate the user's first mental model.

## Current Rule

Do not start UI development until backend stabilization and operational capture boundaries are complete.

## Future UI Principle

The backend is the skeleton.

The UI is the operational interface.

AI can help generate the skin, but it must not design the engine.
