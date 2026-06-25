# Academy Runtime Architecture Snapshot V2

STATUS: LOCKED

## Snapshot Purpose

This snapshot records the corrected runtime architecture after persistence alignment testing.

The major correction from V1 is that Academy runtime must integrate with existing platform runtime tables rather than create duplicate Academy-specific runtime persistence.

---

## Current Runtime State

The Academy runtime now has:

- SLB contracts
- SLB interaction definitions
- runtime orchestration
- telemetry generation
- telemetry persistence
- remediation routing
- competency validation
- learner state persistence
- runtime health testing
- Supabase admin alignment
- existing platform runtime table alignment

---

## Confirmed Persistence Alignment

Telemetry:

- runtime_telemetry_events
- confirmed working

Learner state:

- runtime_learner_states
- confirmed working

Supabase admin access:

- src/lib/supabaseAdmin.ts
- confirmed working when scripts load dotenv/config

---

## No-Duplicate-System Policy

Academy must not create separate runtime persistence systems where platform runtime systems already exist.

Rejected duplicate paths:

- academy_telemetry_events
- academy_learner_competency_states
- academy-specific Supabase client patterns

---

## Current Temporary Bridges

### SLB Identity Bridge

Current:

- academySlbId stored in event_payload

Reason:

- existing slb_id expects UUID

Future:

- create formal SLB UUID registry/mapping

---

### Competency Identity Bridge

Current:

- demo competency UUID used for testing

Future:

- create formal Academy competency registry linked to existing runtime competency_id

---

## Working Validation Results

Confirmed:

- runtime health code test passes
- telemetry persistence test passes
- learner state persistence test passes
- existing runtime table constraints are active and must be respected

---

## Next Recommended Phase

1. Create formal Academy SLB UUID mapping layer.
2. Create formal Academy competency UUID mapping layer.
3. Document runtime event type allowed values.
4. Document mastery/readiness/remediation allowed values.
5. Build persistence tests for remediation and evidence.
6. Keep UI minimal until runtime persistence is stable.

STATUS: LOCKED
