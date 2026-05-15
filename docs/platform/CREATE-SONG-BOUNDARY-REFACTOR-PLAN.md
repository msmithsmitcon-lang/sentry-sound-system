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
