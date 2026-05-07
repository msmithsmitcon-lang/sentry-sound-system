# Workflow Orchestration Module

## Purpose
Workflow Orchestration is the cross-module automation layer for events, triggers, approvals, notifications, activity propagation, and operational workflows.

## Core principle
Workflow orchestration coordinates existing modules. It must not duplicate module-specific business logic.

## Core entities
- workflow_events
- workflow_rules
- workflow_actions
- workflow_runs
- workflow_audit_events

## Design rules
- workspace-scoped
- event-driven
- module-agnostic
- approval-ready
- notification-ready
- async-ready
- audit-ready
- international-ready

## Strategic responsibilities
- capture operational events
- evaluate workflow rules
- queue workflow actions
- record workflow runs
- support future approvals and automation
- propagate dashboard activity
- support future AI orchestration hooks

## Strategic flow
Operational Modules
  ?
Workflow Events
  ?
Rules
  ?
Actions
  ?
Runs / Notifications / Dashboard / Tasks

## Next build unit
Create Workflow Orchestration database schema.

# Workflow Orchestration Schema Status

## Completed
- workflow_events
- workflow_rules
- workflow_runs
- workflow_audit_events

## Strategic architecture
Workflow Orchestration now supports:
- cross-module event capture
- workflow rule definitions
- workflow execution tracking
- workflow auditability
- async-ready orchestration

## Future orchestration targets
- notifications
- approvals
- dashboard propagation
- task automation
- release automation
- payout workflows
- AI orchestration hooks

## Next build unit
Workflow service layer.

## Service layer

### Services added
- createWorkflowEvent
- createWorkflowRule
- createWorkflowRun

## Backend rules
- Workflow events are workspace-scoped.
- Workflow rules define trigger/action configuration.
- Workflow runs track execution state.
- Workflow layer coordinates modules without duplicating module logic.

## Next build unit
Workflow event dispatch / rule matching.

## Dispatch layer

### dispatchWorkflowEvent

Responsible for:
- loading workflow event
- matching active workflow rules
- creating workflow runs
- marking events as processed

## Matching logic
Rules currently match by:
- source_module
- event_type

Null values act as wildcards.

## Strategic importance
This establishes the foundation for:
- automation pipelines
- notifications
- approvals
- async processing
- dashboard propagation
- AI orchestration hooks

## Next build unit
Workflow action execution layer.

## Action execution layer

### executeWorkflowRun

Responsible for:
- loading workflow run
- executing workflow actions
- updating workflow run status
- marking completion timestamps

## Current supported actions
- dashboard_alert
- dashboard_activity
- create_task

## Strategic importance
This establishes the first operational automation layer across:
- dashboard system
- task system
- workflow orchestration

## Future expansion
- notifications
- approvals
- report generation
- payout workflows
- release automation
- AI orchestration
- external webhooks

## Next build unit
Workflow queue/async processing architecture.

## Queue / async layer

### Tables added
- workflow_queue

### Services added
- enqueueWorkflowRun
- processWorkflowQueue

## Backend rules
- Workflow runs can be queued for async execution.
- Queue items support priority levels.
- Queue items support delayed availability.
- Queue items support retry attempts.
- Failed jobs store last_error.
- Processing uses executeWorkflowRun.

## Strategic importance
Workflow orchestration now supports safe background-style execution for:
- automation
- dashboard alerts
- task creation
- future notifications
- future approvals
- future AI orchestration
