# Post-Reset Verification

Date: 2026-05-20

Phase D completed against the configured controlled DEV/TEST Supabase/Postgres target.

## Execution Script

- `approved-reset-script-final-corrected.sql`

## Corrections Applied Before Successful Execution

- Guarded optional/legacy `public."RegistrationEvidence"` with `pg_temp.reset_row_count_if_exists` and `pg_temp.reset_delete_if_exists`.
- Included the single linked TEST `royalty_events` row after explicit approval because it referenced current fake/test `musical_works` data.
- Temporarily disabled only `trigger_validate_required_roles` on `work_contributors` during controlled link cleanup, then re-enabled it before commit.
- Did not expand reset scope beyond the approved controlled TEST data reset.

## Reset Candidate Tables After Execution

All reset candidate tables verified at zero rows:

- `SubmissionDispatchAttempt` - 0
- `SubmissionDispatchQueue` - 0
- `SubmissionQueueEvent` - 0
- `SubmissionRemediationCase` - 0
- `SubmissionExport` - 0
- `SubmissionQueue` - 0
- `SubmissionSnapshot` - 0
- `EvidenceAuditEvent` - 0
- `EscalationDeadLetterQueue` - 0
- `EscalationNotificationQueue` - 0
- `OperationalEscalationEvent` - 0
- `OperationalIncident` - 0
- `recording_contributors` - 0
- `recordings` - 0
- `workflow_tasks` - 0
- `splits` - 0
- `work_contributors` - 0
- `musical_works` - 0
- `asset_files` - 0
- `documents` - 0
- `licenses` - 0
- `usage_logs` - 0
- `assets` - 0
- `contract_parties` - 0
- `payout_items` - 0
- `rights_ownership_claims` - 0
- `royalty_distributions` - 0
- `royalty_events` - 0
- `royalty_ledger` - 0
- `settlements` - 0
- `contributors` - 0

`RegistrationEvidence` does not exist in the live public schema and was safely skipped.

## Preserved Tables Confirmed

- `workspaces` - 1
- `workspace_settings` - 1
- `workspace_members` - 1
- `workspace_user_roles` - 2
- `workspace_invitations` - 2
- `user_profiles` - 2
- `rbac_roles` - 6
- `rbac_permissions` - 29
- `rbac_role_permissions` - 48
- `workspace_activity` - 4
- `authorization_audit_events` - 3
- `accounts` - 1
- `companies` - 2
- `projects` - 1
- `project_tasks` - 1
- `finance_accounts` - 4
- `finance_company_settings` - 1
- `finance_country_currency` - 4
- `finance_exchange_rates` - 1
- `finance_periods` - 1
- `finance_tax_profiles` - 1
- `finance_tax_rates` - 1

`audit_logs` remains intact and now contains 80 rows. It increased from the pre-reset count of 60 because the existing `work_contributors` audit trigger logged 20 controlled TEST link deletions.

## Trigger Verification

- `trigger_validate_required_roles` on `work_contributors` was re-enabled after execution.

## Boundary

- No schema migrations were run.
- No UX or application code was changed.
- Workspace/auth/RBAC, user profile, finance/config/reference, account/company/project, and foundation tables were not cleared.

