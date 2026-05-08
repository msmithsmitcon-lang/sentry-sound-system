# Operational Analytics & Reporting Module

## Purpose
Operational Analytics converts ERP activity into KPIs, reporting snapshots, operational metrics, trend visibility, and executive reporting.

## Core principle
Analytics must aggregate existing system data without duplicating operational business logic.

## Core entities
- analytics_metrics
- analytics_snapshots
- analytics_report_definitions
- analytics_report_runs
- analytics_audit_events

## Design rules
- workspace-scoped
- aggregation-focused
- report-ready
- async-ready
- dashboard-ready
- export-ready
- audit-ready
- international-ready

## Analytics domains
- workflow performance
- approval bottlenecks
- notification delivery
- task completion
- release readiness
- distribution status
- royalty processing
- payout visibility
- contract risk
- finance health

## Strategic flow
Operational Data
  ?
Metrics / Snapshots
  ?
Reports / Dashboards
  ?
Executive Visibility

## Next build unit
Create Operational Analytics database schema.

# Operational Analytics Schema Status

## Completed
- analytics_metrics
- analytics_snapshots
- analytics_report_definitions
- analytics_report_runs
- analytics_audit_events

## Strategic architecture
Operational Analytics now supports:
- KPI metric storage
- reporting snapshots
- reusable report definitions
- async report execution
- auditability

## Strategic role
Analytics now acts as the executive visibility layer for:
- workflows
- approvals
- notifications
- royalties
- releases
- finance
- operational activity

## Next build unit
Operational Analytics service layer.

## Service layer

### Services added
- createAnalyticsMetric
- createAnalyticsSnapshot
- createAnalyticsReportDefinition

## Backend rules
- Analytics records are workspace-scoped.
- Metrics store KPI values.
- Snapshots store generated reporting states.
- Report definitions store reusable report configurations.

## Next build unit
Analytics report run / execution service.
