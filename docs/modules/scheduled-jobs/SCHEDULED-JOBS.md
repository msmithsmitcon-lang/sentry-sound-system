# Scheduled Job Module

## Purpose
Scheduled Jobs are the platform automation heartbeat for recurring/background execution.

## Core principle
Scheduled jobs trigger existing service-layer functions. They must not duplicate business logic.

## Core entities
- scheduled_jobs
- scheduled_job_runs
- scheduled_job_audit_events

## Design rules
- workspace-scoped
- retry-aware
- async-ready
- audit-ready
- workflow-aware
- notification-ready
- international-ready

## Job categories
- workflow_queue_processing
- approval_escalation
- notification_retry
- dashboard_snapshot
- contract_expiry_check
- release_schedule_check
- payout_cycle
- royalty_settlement_cycle

## Strategic flow
Schedule
  ?
Job Run
  ?
Existing Service Layer
  ?
Audit / Workflow / Notification / Dashboard

## Next build unit
Create Scheduled Job database schema.

# Scheduled Job Schema Status

## Completed
- scheduled_jobs
- scheduled_job_runs
- scheduled_job_audit_events

## Strategic architecture
Scheduled Jobs now support:
- recurring automation jobs
- run tracking
- retry/error visibility
- schedule configuration
- auditability

## Strategic role
Scheduled jobs act as the operational heartbeat for:
- workflow processing
- escalations
- notification retries
- settlement cycles
- reporting
- compliance checks

## Next build unit
Scheduled Job service layer.

## Service layer

### Services added
- createScheduledJob
- createScheduledJobRun
- processScheduledJobs

## Current supported job types
- workflow_queue_processing
- approval_escalation

## Backend rules
- Scheduled jobs are workspace-scoped.
- Jobs trigger existing service-layer functions.
- Job runs track status, payloads, errors, and completion.
- Scheduled jobs do not duplicate workflow or approval logic.

## Next build unit
Scheduled Job API routes.
