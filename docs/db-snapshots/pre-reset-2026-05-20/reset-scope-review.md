# Pre-Reset Scope Review

Snapshot date: 2026-05-20

No data was changed. This is a review artifact only.

## Likely Reset Candidates

Primary Works/Songs TEST data:

- `work_contributors` - 20 rows
- `musical_works` - 21 rows
- `assets` - 30 rows
- `contributors` - 19 rows, only if confirmed disposable

Older/parallel Prisma registration TEST data:

- `MusicalWork` - 4 rows
- `EvidenceAuditEvent` - 1 row
- `SubmissionQueue` - 9 rows
- `SubmissionQueueEvent` - 10 rows
- `SubmissionSnapshot` - 3 rows
- `SubmissionExport` - 1 row
- `SubmissionDispatchQueue` - 5 rows
- `SubmissionDispatchAttempt` - 1 row
- `SubmissionRemediationCase` - 2 rows

Old TEST incident/escalation data:

- `OperationalIncident` - 1 row
- `OperationalEscalationEvent` - 1 row
- `EscalationNotificationQueue` - 2 rows
- `EscalationDeadLetterQueue` - 1 row

Asset/work dependency tables with zero rows but included in reset planning:

- `asset_files`
- `documents`
- `licenses`
- `recordings`
- `recording_contributors`
- `splits`
- `usage_logs`
- `workflow_tasks`

## Preserve Tables

Workspace/auth/RBAC foundation:

- `workspaces` - 1 row
- `workspace_settings` - 1 row
- `workspace_members` - 1 row
- `workspace_user_roles` - 2 rows
- `workspace_invitations` - 2 rows
- `user_profiles` - 2 rows
- `rbac_roles` - 6 rows
- `rbac_permissions` - 29 rows
- `rbac_role_permissions` - 48 rows

Audit/governance foundation:

- `workspace_activity` - 4 rows
- `authorization_audit_events` - 3 rows
- `audit_logs` - 60 rows
- module audit tables with zero rows should preserve schema and remain untouched unless separately reviewed.

Config/reference foundations:

- `finance_accounts` - 4 rows
- `finance_company_settings` - 1 row
- `finance_country_currency` - 4 rows
- `finance_exchange_rates` - 1 row
- `finance_periods` - 1 row
- `finance_tax_profiles` - 1 row
- `finance_tax_rates` - 1 row
- `workflow_stages` - 4 rows
- `departments` - 3 rows

## Tables Requiring Further Review

Do not reset these without separate module-level review:

- `accounts` - 1 row
- `companies` - 2 rows
- `projects` - 1 row
- `project_tasks` - 1 row
- finance operational rows such as `finance_transactions`, `finance_approvals`, `finance_attachments`, `finance_notes`, `finance_notifications`, `finance_payables`, `finance_receivables`, `finance_report_exports`, `finance_report_jobs`, `finance_scheduled_jobs`, `finance_snapshots`, and `finance_year_closes`
- rights/royalty/project tables, even when row counts are low or zero, until the dependency script classifies them in the exact reset order.

## FK / Dependency Warnings

Known dependency warnings from inspection:

- `work_contributors` references `musical_works` and `contributors`.
- `musical_works` references `assets`.
- tables such as `recordings`, `rights_registrations`, `royalty_events`, `royalty_ledger`, `royalty_distributions`, `splits`, and `workflow_tasks` may reference `musical_works`.
- `asset_files`, `documents`, `licenses`, `recordings`, `usage_logs`, and `musical_works` may reference `assets`.
- contributor-dependent tables can include `recording_contributors`, `rights_ownership_claims`, `royalty_*`, `settlements`, `splits`, and `work_contributors`.

Phase C must produce an exact SQL reset script and dependency order for review only. Do not execute parent table deletes before dependent rows are explicitly handled.

## Unexpected Row Counts / Notes

- `musical_works` has 21 rows but no workspace ownership column.
- `assets` has 30 rows but no workspace ownership column.
- `contributors` has 19 rows and no workspace ownership column.
- `audit_logs` has 60 rows and should be preserved unless separately reviewed.
- Finance module tables contain nonzero rows; they should not be included in the Works/Songs operational reset without separate finance review.
- `accounts` and `companies` contain rows and may be part of older ownership foundations. Preserve until separately reviewed.
- `royalty_events` has 1 row. Do not delete without dependency review.

## Current TEST Works Export

`current-test-works-export.json` captures a limited non-sensitive export of current `musical_works`, linked `assets`, `work_contributors`, and contributor display/linkage data.

It intentionally excludes auth, workspace membership, user profiles, payment, subscription, secrets, and sensitive system data.

## Recommendation

Proceed to Phase C only after confirming this snapshot is sufficient:

- generate exact SQL reset script for review only.
- include dependency order and row-count assertions.
- do not execute the script until explicit approval.
