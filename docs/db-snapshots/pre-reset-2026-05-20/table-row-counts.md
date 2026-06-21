# Pre-Reset Table Row Counts

Snapshot date: 2026-05-20

Purpose: Phase B pre-reset inspection snapshot. This file records live public table row counts before any reset SQL is drafted.

No data was changed.

## Category Legend

- preserve/foundation: workspace, auth, RBAC, audit, or structural foundation to preserve.
- reset candidate: likely operational TEST/prototype data candidate after backup, review, and approval.
- config/reference: reference/configuration or finance setup data to preserve unless separately reviewed.
- migration/system: schema/migration/system tracking data to preserve.
- unknown/review required: do not reset without deeper table-specific review.

## Counts

| Table | Rows | Category |
| --- | ---: | --- |
| `EscalationDeadLetterQueue` | 1 | reset candidate |
| `EscalationNotificationQueue` | 2 | reset candidate |
| `EvidenceAuditEvent` | 1 | reset candidate |
| `MusicalWork` | 4 | reset candidate |
| `OperationalEscalationEvent` | 1 | reset candidate |
| `OperationalIncident` | 1 | reset candidate |
| `SubmissionDispatchAttempt` | 1 | reset candidate |
| `SubmissionDispatchQueue` | 5 | reset candidate |
| `SubmissionExport` | 1 | reset candidate |
| `SubmissionQueue` | 9 | reset candidate |
| `SubmissionQueueEvent` | 10 | reset candidate |
| `SubmissionRemediationCase` | 2 | reset candidate |
| `SubmissionSnapshot` | 3 | reset candidate |
| `accounts` | 1 | unknown/review required |
| `analytics_audit_events` | 0 | preserve/foundation |
| `analytics_metrics` | 0 | preserve/foundation |
| `analytics_report_definitions` | 0 | preserve/foundation |
| `analytics_report_executions` | 0 | preserve/foundation |
| `analytics_report_runs` | 0 | preserve/foundation |
| `analytics_snapshots` | 0 | preserve/foundation |
| `app_users` | 0 | preserve/foundation |
| `approval_audit_events` | 0 | preserve/foundation |
| `approval_requests` | 0 | unknown/review required |
| `approval_responses` | 0 | unknown/review required |
| `approval_steps` | 0 | unknown/review required |
| `artist_aliases` | 0 | unknown/review required |
| `artist_audit_events` | 0 | preserve/foundation |
| `artist_genres` | 0 | unknown/review required |
| `artist_profiles` | 0 | unknown/review required |
| `artist_social_links` | 0 | unknown/review required |
| `asset_files` | 0 | reset candidate |
| `assets` | 30 | reset candidate |
| `audit_logs` | 60 | preserve/foundation |
| `authorization_audit_events` | 3 | preserve/foundation |
| `calendar_events` | 0 | unknown/review required |
| `companies` | 2 | unknown/review required |
| `contract_audit_events` | 0 | preserve/foundation |
| `contract_obligations` | 0 | unknown/review required |
| `contract_parties` | 0 | unknown/review required |
| `contract_rights_links` | 0 | unknown/review required |
| `contracts` | 0 | unknown/review required |
| `contributors` | 19 | reset candidate |
| `crm_contact_audit_events` | 0 | preserve/foundation |
| `crm_contact_emails` | 0 | unknown/review required |
| `crm_contact_notes` | 0 | unknown/review required |
| `crm_contact_phones` | 0 | unknown/review required |
| `crm_contact_relationships` | 0 | unknown/review required |
| `crm_contacts` | 0 | unknown/review required |
| `dashboard_activity_feed` | 0 | preserve/foundation |
| `dashboard_alerts` | 0 | preserve/foundation |
| `dashboard_snapshots` | 0 | preserve/foundation |
| `dashboard_widgets` | 0 | preserve/foundation |
| `departments` | 3 | preserve/foundation |
| `distribution_audit_events` | 0 | preserve/foundation |
| `distribution_channels` | 0 | unknown/review required |
| `distribution_delivery_events` | 0 | unknown/review required |
| `distribution_release_channels` | 0 | unknown/review required |
| `distribution_releases` | 0 | unknown/review required |
| `documents` | 0 | reset candidate |
| `file_vault_audit_events` | 0 | preserve/foundation |
| `file_vault_items` | 0 | unknown/review required |
| `file_vault_links` | 0 | unknown/review required |
| `file_vault_versions` | 0 | unknown/review required |
| `finance_accounts` | 4 | config/reference |
| `finance_approvals` | 1 | unknown/review required |
| `finance_attachments` | 1 | unknown/review required |
| `finance_audit_events` | 3 | preserve/foundation |
| `finance_budgets` | 1 | config/reference |
| `finance_company_settings` | 1 | config/reference |
| `finance_country_currency` | 4 | config/reference |
| `finance_exchange_rates` | 1 | config/reference |
| `finance_notes` | 1 | unknown/review required |
| `finance_notifications` | 1 | unknown/review required |
| `finance_payables` | 1 | unknown/review required |
| `finance_periods` | 1 | config/reference |
| `finance_receivables` | 1 | unknown/review required |
| `finance_report_exports` | 2 | unknown/review required |
| `finance_report_jobs` | 1 | unknown/review required |
| `finance_roles` | 0 | config/reference |
| `finance_scheduled_jobs` | 1 | unknown/review required |
| `finance_snapshots` | 2 | unknown/review required |
| `finance_tax_profiles` | 1 | config/reference |
| `finance_tax_rates` | 1 | config/reference |
| `finance_transactions` | 4 | unknown/review required |
| `finance_year_closes` | 1 | unknown/review required |
| `licenses` | 0 | reset candidate |
| `memberships` | 0 | preserve/foundation |
| `musical_works` | 21 | reset candidate |
| `notification_audit_events` | 0 | preserve/foundation |
| `notification_delivery_attempts` | 0 | unknown/review required |
| `notification_recipients` | 0 | unknown/review required |
| `notification_templates` | 0 | config/reference |
| `notifications` | 0 | unknown/review required |
| `parties` | 0 | unknown/review required |
| `party_roles` | 0 | unknown/review required |
| `payout_batches` | 0 | unknown/review required |
| `payout_items` | 0 | unknown/review required |
| `permissions` | 0 | preserve/foundation |
| `project_members` | 0 | unknown/review required |
| `project_tasks` | 1 | unknown/review required |
| `projects` | 1 | unknown/review required |
| `rbac_permissions` | 29 | preserve/foundation |
| `rbac_role_permissions` | 48 | preserve/foundation |
| `rbac_roles` | 6 | preserve/foundation |
| `recording_contributors` | 0 | reset candidate |
| `recordings` | 0 | reset candidate |
| `release_audit_events` | 0 | preserve/foundation |
| `release_metadata_snapshots` | 0 | unknown/review required |
| `release_tracks` | 0 | unknown/review required |
| `release_versions` | 0 | unknown/review required |
| `releases` | 0 | unknown/review required |
| `rights_assets` | 0 | unknown/review required |
| `rights_audit_events` | 0 | preserve/foundation |
| `rights_lifecycle_events` | 0 | unknown/review required |
| `rights_ownership_claims` | 0 | unknown/review required |
| `rights_registrations` | 0 | unknown/review required |
| `role_permissions` | 0 | preserve/foundation |
| `royalty_distributions` | 0 | unknown/review required |
| `royalty_events` | 1 | unknown/review required |
| `royalty_ledger` | 0 | unknown/review required |
| `scheduled_job_audit_events` | 0 | preserve/foundation |
| `scheduled_job_runs` | 0 | unknown/review required |
| `scheduled_jobs` | 0 | unknown/review required |
| `settlements` | 0 | unknown/review required |
| `splits` | 0 | reset candidate |
| `task_assignments` | 0 | unknown/review required |
| `task_audit_events` | 0 | preserve/foundation |
| `task_comments` | 0 | unknown/review required |
| `task_items` | 0 | unknown/review required |
| `teams` | 0 | preserve/foundation |
| `usage_logs` | 0 | reset candidate |
| `user_profiles` | 2 | preserve/foundation |
| `work_contributors` | 20 | reset candidate |
| `workflow_audit_events` | 0 | preserve/foundation |
| `workflow_events` | 0 | unknown/review required |
| `workflow_queue` | 0 | unknown/review required |
| `workflow_rules` | 0 | config/reference |
| `workflow_runs` | 0 | unknown/review required |
| `workflow_stage_history` | 0 | preserve/foundation |
| `workflow_stages` | 4 | preserve/foundation |
| `workflow_tasks` | 0 | reset candidate |
| `workspace_activity` | 4 | preserve/foundation |
| `workspace_invitations` | 2 | preserve/foundation |
| `workspace_members` | 1 | preserve/foundation |
| `workspace_plan_assignments` | 0 | preserve/foundation |
| `workspace_settings` | 1 | preserve/foundation |
| `workspace_user_roles` | 2 | preserve/foundation |
| `workspaces` | 1 | preserve/foundation |

## Summary

- Total public tables counted: 136.
- Primary active Works/Songs reset candidates currently contain:
  - `musical_works`: 21 rows
  - `assets`: 30 rows
  - `contributors`: 19 rows
  - `work_contributors`: 20 rows
- Workspace/auth/RBAC foundation is present and must be preserved.
