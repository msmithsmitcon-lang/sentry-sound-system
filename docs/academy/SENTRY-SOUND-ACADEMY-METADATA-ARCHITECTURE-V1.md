# Sentry Sound Academy Metadata Architecture V1

## Purpose

This document defines the academy metadata architecture.

Academy metadata must align with the existing Sentry Sound system patterns for:
- workspace context
- entities
- workflows
- events
- evidence
- auditability
- statuses
- versions
- runtime execution
- governance

The academy must not become a disconnected LMS metadata system.

---

# Core Principle

Academy metadata is an extension of the existing Sentry Sound operational/runtime architecture.

The academy should follow the same system logic:
- entity-driven
- event-aware
- workflow-aware
- evidence-aware
- audit-ready
- runtime-compatible
- tenant/workspace-aware
- version-controlled

---

# Primary Academy Entities

## 1. Academy Module

Represents a structured training module.

Required metadata:
- module_id
- module_code
- module_name
- academy_layer
- competency_level
- version
- status
- target_learner_profile
- estimated_duration
- prerequisites
- standards_alignment
- platform_alignment
- created_at
- updated_at

---

## 2. Academy SLB

Represents a small competency execution block.

Required metadata:
- slb_id
- slb_code
- module_id
- slb_name
- slb_type
- competency_level
- primary_outcome
- evidence_required
- assessment_required
- remediation_supported
- platform_entity_reference
- runtime_ready
- version
- status
- created_at
- updated_at

---

## 3. Academy Lesson

Represents instructional content attached to one or more SLBs.

Required metadata:
- lesson_id
- module_id
- slb_id
- lesson_name
- lesson_sequence
- lesson_type
- learning_outcomes
- content_status
- version
- estimated_duration
- created_at
- updated_at

---

## 4. Academy Assessment

Represents a competency validation activity.

Required metadata:
- assessment_id
- module_id
- slb_id
- assessment_type
- competency_tested
- pass_criteria
- evidence_required
- remediation_trigger
- version
- status
- created_at
- updated_at

---

## 5. Academy Evidence

Represents proof of competency.

Required metadata:
- evidence_id
- learner_id
- module_id
- slb_id
- assessment_id
- evidence_type
- evidence_format
- evidence_status
- verification_status
- audit_reference
- storage_reference
- submitted_at
- verified_at

---

## 6. Learner Execution Session

Represents a learner’s active execution journey through a module, lesson, SLB, or assessment.

Required metadata:
- session_id
- learner_id
- workspace_id
- module_id
- slb_id
- lesson_id
- assessment_id
- session_status
- current_state
- started_at
- completed_at
- last_event_at

---

## 7. Academy Competency Event

Represents learner progress, failure, assessment, remediation, or evidence activity.

Required metadata:
- event_id
- session_id
- learner_id
- module_id
- slb_id
- event_type
- event_status
- event_payload
- competency_state
- remediation_required
- created_at

---

## 8. Academy Remediation

Represents structured correction of weak or failed competency areas.

Required metadata:
- remediation_id
- learner_id
- module_id
- slb_id
- triggering_event_id
- remediation_type
- remediation_status
- remediation_path
- reassessment_required
- created_at
- completed_at

---

# Shared Metadata Rules

All academy entities should support where applicable:

- workspace_id
- tenant/workspace context
- version
- status
- created_at
- updated_at
- created_by
- updated_by
- audit_reference
- workflow_reference
- runtime_reference
- evidence_reference

---

# Status Principles

Statuses must be controlled and meaningful.

Example status groups:

## Content Status
- draft
- under_review
- approved
- active
- retired

## Execution Status
- not_started
- in_progress
- completed
- failed
- remediating
- reassessed

## Evidence Status
- pending
- submitted
- verified
- rejected
- archived

## Governance Status
- unchecked
- reviewed
- approved
- flagged
- escalated

---

# Runtime Alignment

Academy metadata must support future runtime execution.

Runtime-compatible academy flows may include:

learner starts module
→ execution session created
→ lesson/SLB event recorded
→ assessment event recorded
→ evidence submitted
→ competency state updated
→ remediation triggered if needed
→ verification event recorded
→ reporting output generated

---

# Platform Alignment

Where academy content teaches Sentry Sound Platform operations, metadata must link to:

- platform entity
- platform workflow
- platform status
- platform metadata field
- platform compliance process
- platform evidence object
- platform governance rule

Do not create fake platform logic in academy modules.

---

# Standards Alignment

Every academy entity should support future standards mapping:

- SAQA reference
- SETA reference
- NQF level consideration
- notional hours
- proposed credits
- outcomes
- assessment criteria
- evidence criteria
- moderation relevance

Formal mapping happens later.

---

# Architecture Boundary

Do not build database tables yet unless required.

This document defines the metadata architecture.

Backend schema changes should only be recommended when critical.

---

# Current Status

Academy Metadata Architecture V1 is locked.

Next step:
Create the canonical academy entity relationship map.
