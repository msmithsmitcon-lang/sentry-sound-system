# Academy Runtime Constraints Registry

STATUS: ACTIVE

## Purpose

This document records discovered runtime database constraints and integration rules that affect Academy runtime execution.

These constraints must be checked before adding or modifying Academy persistence logic.

---

## runtime_telemetry_events

### UUID Requirements

The following fields expect UUID values:

- tenant_id
- learner_id
- competency_id
- lesson_id
- slb_id
- audit_reference_id

Human-readable values such as SLB-01.01 must NOT be inserted directly into UUID columns.

Temporary bridge:

- store academySlbId in event_payload.academySlbId

---

### Event Type Constraint

The table has a check constraint on event_type.

Confirmed valid value:

- competency_progressed

Invalid tested value:

- runtime_persistence_test

Rule:

Do not invent new event types without first inspecting or updating the runtime event-type constraint.

---

## runtime_learner_states

### Unique Constraint

Existing unique constraint:

- learner_id + competency_id

Repository must upsert using:

- onConflict: learner_id,competency_id

---

### Mastery Level Constraint

The table has a check constraint on mastery_level.

Confirmed valid sample value:

- advanced

Invalid tested value:

- foundation

Rule:

Do not invent mastery levels without inspecting the existing constraint or updating schema intentionally.

---

### Current Working Mapping

For Academy runtime:

- competency_achieved -> mastery_level advanced
- remediation_required -> remediation_state required
- competency_achieved -> readiness_state ready
- non-achieved -> readiness_state not_ready

---

## Environment Loading

Runtime scripts must load environment variables explicitly using:

import "dotenv/config"

Reason:

tsx scripts do not automatically load Next.js environment variables the same way app runtime does.

Required variables:

- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

---

## Pitfall Register

Avoid:

- inserting non-UUID human IDs into UUID fields
- inventing event_type values
- inventing mastery_level values
- creating duplicate academy tables
- creating duplicate Supabase clients
- assuming schema from code alone
- skipping constraint inspection
- allowing academy runtime to drift from platform runtime

STATUS: ACTIVE
