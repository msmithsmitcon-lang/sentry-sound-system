# Sentry Sound Platform - Canonical Persistence Direction

## Purpose

This document defines the intended long-term persistence direction for Sentry Sound Platform.

It exists to prevent dual-domain architectural drift between lightweight operational capture tables and governed registration lifecycle models.

## Current Architectural Reality

The repository currently contains two partially-separated persistence domains.

### Domain A - Operational Capture Tables

Current UI capture flow primarily writes to:

- assets
- musical_works
- contributors
- work_contributors

These tables currently support lightweight operational capture workflows.

### Domain B - Governed Registration Domain

The registration engine and orchestration layer primarily operate through governed Prisma lifecycle models including:

- MusicalWork
- MusicalWorkContributor
- Recording
- RegistrationAuditEvent
- RegistrationDispute
- RegistrationAmendment
- SubmissionQueue
- SubmissionSnapshot
- SubmissionDispatch
- OperationalIncident
- Escalation systems

These models already support:

- workflow orchestration
- readiness evaluation
- auditability
- disputes
- amendments
- submission packaging
- governance workflows

## Strategic Direction

The governed registration lifecycle domain will become the long-term canonical operational persistence direction.

This is because it already aligns more closely to:

- governed rights operations
- operational lifecycle orchestration
- auditability requirements
- compliance workflows
- submission infrastructure
- long-term platform scalability

## Important Rule

The platform should NOT introduce additional parallel persistence systems.

## Immediate Stabilization Strategy

The operational capture layer should progressively align upward into the governed orchestration domain.

This means:

- no destructive rewrites
- no immediate migration shock
- no uncontrolled schema replacement

Instead:

1. stabilize capture pipeline
2. introduce backend orchestration boundaries
3. centralize validation
4. centralize persistence orchestration
5. progressively align models
6. progressively align workflows
7. progressively align readiness lifecycle

## Current Engineering Priority

Immediate priority remains:

- operational capture stabilization
- contributor governance stabilization
- split governance stabilization
- transactional integrity
- orchestration alignment

before major persistence migrations occur.

## Immediate Restriction

No new major operational tables should be introduced until persistence alignment direction is stabilized.
