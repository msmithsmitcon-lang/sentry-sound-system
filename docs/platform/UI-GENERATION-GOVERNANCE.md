# Sentry Sound Platform - UI Generation Governance

## Purpose

This document defines how future UI development should be approached for Sentry Sound Platform.

UI development is not the current phase, but this document preserves the intended future approach so the platform does not drift into traditional slow UI troubleshooting or AI-invented frontend logic.

## Core Rule

The UI must be generated or accelerated from approved backend contracts, API endpoints, system states, and platform workflows.

The UI must not invent operational truth.

## Intended Future UI Approach

Future UI development may use AI-assisted visual-to-code workflows such as:

- v0.dev
- Cursor
- Lovable
- Bolt
- similar React/Tailwind/shadcn generation tools

These tools may be used to generate interface layouts, components, dashboards, cards, workflows, and visual polish.

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

1. Backend contract exists
2. API endpoint exists
3. State model exists
4. UI generation prompt is written
5. AI generates visual/component layer
6. UI is wired to existing backend endpoints
7. Runtime behavior is tested
8. Documentation is updated

## Design Direction

The UI should support the platform identity:

- governed music rights operations
- operational clarity
- rights lifecycle visibility
- contributor/split management
- registration readiness
- royalty/finance visibility
- workflow status
- audit and governance visibility

## Current Rule

Do not start UI development until backend stabilization and operational capture boundaries are complete.

## Future UI Principle

The backend is the skeleton.

The UI is the operational interface.

AI can help generate the skin, but it must not design the engine.
