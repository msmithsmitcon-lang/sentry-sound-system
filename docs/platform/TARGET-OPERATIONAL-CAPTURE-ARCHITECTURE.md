# Sentry Sound Platform - Target Operational Capture Architecture

## Purpose

This document defines the target architecture for the operational music rights capture lifecycle.

It exists to align the capture pipeline with the governed backend orchestration already present in the platform.

## Current Problem

The current capture flow performs direct UI-driven Supabase writes.

This creates:

- weak transaction boundaries
- duplicated business logic
- partial-save risks
- weak orchestration
- weak auditability
- poor backend alignment

## Current Flow

UI
-> direct Supabase inserts
-> contributor creation
-> split persistence
-> partial validation

## Target Flow

UI
-> API Route
-> Capture Service
-> Validation Layer
-> Repository Layer
-> Transaction Boundary
-> Persistence
-> Readiness Evaluation
-> Workflow Resolution
-> Audit Events

## Target Backend Responsibilities

### UI Layer

Responsible only for:

- form state
- operational interaction
- displaying validation results
- displaying workflow state

UI must not own operational persistence orchestration.

### API Layer

Responsible for:

- authenticated request entry
- request parsing
- request validation
- orchestration entry point

### Capture Service Layer

Responsible for:

- operational orchestration
- contributor reuse
- contributor creation
- split enforcement
- save coordination
- readiness evaluation triggers
- workflow resolution

### Validation Layer

Responsible for:

- work validation
- split validation
- contributor validation
- cross-rights validation
- status transition validation

### Repository Layer

Responsible for:

- database persistence
- database retrieval
- transactional coordination
- query isolation

### Governance Layer

Responsible for:

- audit events
- disputes
- amendments
- operational history
- escalation linkage
- workflow state

## Minimum Stabilized Capture Lifecycle

1. Create Work Request
2. Validate Request
3. Resolve Contributors
4. Enforce Split Integrity
5. Persist Work Transactionally
6. Persist Contributor Links
7. Evaluate Registration Readiness
8. Resolve Workflow Status
9. Create Audit Events
10. Return Operational Result

## Important Rule

The current UI capture flow should be progressively aligned to this architecture rather than rewritten destructively.

## Immediate Goal

Stabilize operational music rights capture before expanding platform scope.
