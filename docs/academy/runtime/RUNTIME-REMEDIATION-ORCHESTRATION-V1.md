# Runtime Remediation Orchestration V1

Status: VALIDATED

## Summary

SLB execution now supports persistent remediation orchestration.

When competency validation fails, the runtime now persists:

- remediation telemetry
- learner state update
- remediation evidence
- runtime_remediations record
- runtime_remediation_queue_items record

## Validated Flow

SLB execution
→ remediation_triggered telemetry
→ runtime_learner_states update
→ runtime_evidence_records insert
→ runtime_remediations insert
→ runtime_remediation_queue_items insert

## Canonical Queue

default-remediation-queue

## Validated Statuses

runtime_remediations.remediation_status = active  
runtime_remediation_queue_items.status = queued  
runtime_remediation_queue_items.severity = medium

## Notes

Older remediation rows may not have queue linkage because they were created before queue injection was implemented.

## Next Phase

Runtime remediation lifecycle automation:

- assignment
- in_progress transition
- resolution
- escalation
- recommendation linkage

---

## Stabilization Update

Repository cleanup completed and validated.

The remediation repository now uses:

- contract-safe queue status
- contract-safe severity
- explicit telemetry linkage
- source_event_type
- source_event_id
- active queue lookup
- constants for tenant and default queue

Validated test:

npx tsx scripts\academy\test-execute-slb-remediation-flow.ts

Result:

- competencyAchieved: false
- remediationRequired: true
- runtime_remediations created
- runtime_remediation_queue_items created

---

## RPC Governance Alignment

Remediation queue insertion was migrated from direct table inserts
to canonical SQL RPC orchestration.

Canonical RPC:

create_runtime_remediation_queue_item()

Reason:

- preserves audit logging
- preserves governance rules
- preserves escalation compatibility
- centralizes lifecycle contracts
- avoids duplicate TS lifecycle logic

Validated:

TS Runtime
→ SQL RPC
→ runtime_remediation_queue_items
→ runtime_audit_logs

Validated audit output:

entity_type = remediation
action_type = created
originating_event_type = runtime_remediation
created_by = runtime_system

## Architectural Direction

Lifecycle authority belongs to SQL governance/RPC layer.

TypeScript acts as:

- orchestration adapter
- runtime coordinator
- workflow initiator

NOT the canonical lifecycle authority.

---

## Lifecycle RPC Validation

Validated remediation queue lifecycle transitions through SQL RPC governance layer.

Validated transitions:

queued → assigned → resolved

Validated RPCs:

- assign_runtime_remediation_queue_item()
- resolve_runtime_remediation_queue_item()

Audit alignment corrected to existing runtime_audit_logs constraints:

- entity_type = remediation
- action_type = updated / resolved
- originating_event_type stores the detailed runtime action

Confirmed resolved queue item state:

- status = resolved
- assigned_to retained
- resolved_at populated
- notes persisted

## Architecture Confirmation

Lifecycle transition authority remains in SQL RPC layer.

TypeScript should call RPCs and should not duplicate lifecycle transition logic.

---

## Escalation Lifecycle Validation

Validated escalation governance through canonical SQL RPC layer.

Validated RPC:

create_runtime_escalation_event()

Validated escalation flow:

queued → escalated

Confirmed behavior:

- runtime_escalation_events created
- remediation queue item status updated to escalated
- escalated_at populated
- runtime_audit_logs entry created
- escalation rule linkage validated

Validated escalation rule structure:

- severity_based rules
- queue-type targeting
- remediation-type targeting
- role escalation targeting

## Governance Direction

Escalation policy belongs to SQL governance layer.

Runtime orchestration should trigger escalation RPCs,
not implement escalation policy internally.
