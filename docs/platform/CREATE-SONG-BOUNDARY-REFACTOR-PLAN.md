# Sentry Sound Platform - Create Song Boundary Refactor Plan

## Purpose

This document defines the first bounded stabilization implementation target for the operational music capture lifecycle.

## Current Problem

The current create-song page directly performs:

- asset persistence
- musical work persistence
- contributor lookup
- contributor creation
- split persistence
- duplicate handling
- partial validation

inside the UI layer.

## Refactor Objective

Move orchestration responsibility from UI into governed backend boundaries without changing operational behavior.

## Current Flow

UI
-> direct Supabase inserts
-> contributor creation
-> split persistence

## Target Refactor Flow

UI
-> POST /api/works/create
-> create-work service
-> validation layer
-> repository layer
-> persistence
-> readiness evaluation

## Refactor Rules

- preserve current business behavior
- no destructive migration
- no schema replacement
- no frontend redesign
- preserve contributor reuse behavior
- preserve split validation behavior
- preserve current operational output

## Initial Refactor Scope

### Move From UI

- work creation orchestration
- contributor orchestration
- split orchestration
- duplicate contributor resolution
- persistence coordination

### Keep In UI

- form state
- user interaction
- displaying validation errors
- displaying save status

## Initial Backend Targets

### API Route

Target:

src/app/api/works/create/route.ts

### Service

Target:

src/lib/registration/services/create-musical-work.ts

### Repository Alignment

Initial persistence may continue using existing operational tables during stabilization phase.

## Immediate Engineering Goal

Introduce clean operational boundaries before deeper persistence convergence begins.

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

