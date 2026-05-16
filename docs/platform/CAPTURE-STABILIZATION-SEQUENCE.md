# Sentry Sound Platform - Capture Stabilization Sequence

## Purpose

This document defines the ordered stabilization sequence for aligning the operational music capture pipeline to the governed orchestration architecture.

## Stabilization Objective

Progressively align:

UI direct persistence
-> governed backend orchestration

without destructive migration or operational instability.

## Current Problem

The current capture pipeline bypasses:

- orchestration services
- repository boundaries
- transaction boundaries
- audit orchestration
- readiness workflows
- governed lifecycle management

## Stabilization Principles

- no destructive rewrites
- no large migrations first
- preserve working operational value
- backend-first
- progressive alignment
- bounded implementation
- preserve operational continuity

## Ordered Stabilization Sequence

### Phase 1 - Operational Boundary Stabilization

Goal:

Move orchestration responsibility out of UI layer.

Targets:

- create-song flow
- contributor resolution
- split validation
- save orchestration

Required outcomes:

- API-driven persistence
- service orchestration
- centralized validation

### Phase 2 - Transaction Integrity Stabilization

Goal:

Introduce transactional persistence boundaries.

Targets:

- work creation
- contributor creation
- contributor linkage
- split persistence

Required outcomes:

- rollback-safe operations
- no partial-save corruption
- persistence consistency

### Phase 3 - Registration Lifecycle Alignment

Goal:

Connect capture pipeline into governed registration lifecycle.

Targets:

- readiness evaluation
- workflow resolution
- audit events
- lifecycle state

Required outcomes:

- automatic readiness evaluation
- governed status transitions
- audit integrity

### Phase 4 - Persistence Convergence

Goal:

Progressively converge lightweight operational persistence toward governed lifecycle persistence.

Targets:

- schema alignment
- repository alignment
- lifecycle alignment
- orchestration alignment

Required outcomes:

- reduced dual-domain drift
- canonical lifecycle persistence
- operational consistency

### Phase 5 - Advanced Operational Governance

Goal:

Extend advanced governance safely.

Targets:

- disputes
- amendments
- evidence workflows
- escalations
- compliance workflows

Required outcomes:

- enterprise-grade operational governance
- full lifecycle orchestration

## Immediate Current Phase

The platform is currently entering:

Phase 1 - Operational Boundary Stabilization

## Immediate Engineering Focus

Current focus remains:

- create-song orchestration
- contributor governance
- split governance
- save/update stabilization
- API/service boundary introduction

# Create Song Boundary Refactor - Stabilized Framework

## Current Status

The Create Song flow has been stabilized into the correct governed backend boundary pattern.

Current flow:

UI
-> API Route
-> Contract Validation
-> Orchestration Service
-> Existing Operational Tables

Implemented boundaries:

- app/api/songs/create/route.ts
- src/lib/registration/contracts/create-song-contract.ts
- src/lib/registration/services/create-song-with-contributors.ts
- src/lib/supabase-server.ts

The UI page no longer directly creates:

- assets
- musical_works
- contributors
- work_contributors

Instead, the UI sends one payload to:

POST /api/songs/create

## Important Environment Alignment Finding

A previous issue was caused by Supabase project mismatch / key confusion.

Correct environment rule:

- DATABASE_URL, DIRECT_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY must all belong to the same Supabase project.
- Current intended project ref:
  ykagnyfkwlxcuqxpkkma

Do not mix publishable/secret keys from another Supabase project.

## Stabilization Rules Going Forward

Any new chat must follow this framework:

1. Inspect existing docs first.
2. Inspect existing files before editing.
3. Do not invent schema.
4. Do not use Prisma db push unless explicitly approved.
5. Prefer manual SQL inspection before schema changes.
6. Keep UI thin.
7. Keep orchestration in backend service boundaries.
8. Preserve existing operational tables unless source-of-truth docs say otherwise.
9. Do not mix Academy/runtime/unrelated files into Platform stabilization commits.
10. Commit only bounded task files.

## What Was Completed

- Create Song UI persistence was removed.
- Backend API route was introduced.
- Contract validation was introduced.
- Asset creation moved to backend.
- Musical work creation moved to backend.
- Contributor lookup/creation moved to backend.
- Work contributor linking moved to backend.
- Split validation centralized in backend contract.
- Server Supabase client added.
- API test returned 200 OK after full backend orchestration.

## What Must NOT Be Done Next

Do not immediately build:

- large new backend modules
- new Prisma contributor models
- audit automation
- lifecycle engine
- transaction system
- dashboard UI
- unrelated Academy/runtime work

## Correct Next Step

The next step is a small stabilization step:

Add transaction safety / rollback protection around the current Create Song orchestration.

Layman explanation:

Right now the backend creates the song in steps. If step 1 succeeds but step 3 fails, the database could have a half-saved song. The next small improvement is to make the save process safer so it either completes properly or fails cleanly.

This is aligned with:

- Phase 2 - Transaction Integrity Stabilization
- no destructive rewrite
- no new major backend expansion
- preserving operational continuity

