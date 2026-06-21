# Academy Runtime Persistence Alignment

STATUS: LOCKED

## Purpose

This document records the canonical persistence alignment between Sentry Sound Academy runtime and the existing Sentry Sound platform runtime.

The Academy must NOT create duplicate runtime persistence systems where platform runtime systems already exist.

## Canonical Decision

Academy runtime must reuse existing platform runtime tables and services wherever structurally appropriate.

## Confirmed Existing Runtime Tables

### Telemetry

Use:

- runtime_telemetry_events

Do NOT use:

- academy_telemetry_events

Reason:

The platform already has a canonical runtime telemetry table with tenant, learner, competency, event payload, confidence, remediation, progression, audit, and runtime-generation fields.

Academy SLB telemetry must write into this table.

Current temporary mapping:

- academy SLB identifier is stored in event_payload.academySlbId
- runtimeState is stored in event_payload.runtimeState
- slb_id remains null until formal SLB UUID mapping exists

Future requirement:

Create formal SLB UUID registry/mapping before assigning slb_id.

---

### Learner State

Use:

- runtime_learner_states

Do NOT use:

- academy_learner_competency_states

Reason:

The platform already has a canonical learner runtime state table with mastery, confidence, remediation, readiness, evidence strength, decay, velocity, attempts, and timestamps.

Academy learner competency state must map into this table.

Current temporary mapping:

- competencyState competency_achieved maps to mastery_level advanced
- competencyState remediation_required maps to remediation_state required
- readiness_state reflects progression readiness
- evidence_strength provides basic competency evidence signal

Future requirement:

Create formal competency UUID registry/mapping before scaling beyond demo competency IDs.

---

## Supabase Client Alignment

Use:

- src/lib/supabaseAdmin.ts

Do NOT create separate academy Supabase clients.

Reason:

The platform already has a canonical server/admin Supabase client using:

- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

Academy server-side persistence must use the same admin client pattern.

## Critical Rule

Before creating any new table, repository, runtime service, migration, or persistence structure:

1. inspect existing system files
2. inspect existing repositories
3. inspect existing services
4. inspect existing Supabase clients
5. inspect existing tables
6. inspect constraints and allowed values
7. patch existing structures where correct
8. only create new structures where no suitable canonical structure exists

## Confirmed Working

Telemetry persistence to runtime_telemetry_events confirmed.

Learner state persistence to runtime_learner_states confirmed.

STATUS: LOCKED
