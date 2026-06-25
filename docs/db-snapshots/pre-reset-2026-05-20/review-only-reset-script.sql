/*
  REVIEW ONLY
  DO NOT EXECUTE WITHOUT EXPLICIT APPROVAL.
  BACKUP REQUIRED FIRST.
  CHECK TARGET DATABASE BEFORE RUNNING.
  INTENDED ONLY FOR CONTROLLED DEV/TEST RESET.

  This script is drafted for review in Phase C of the controlled operational
  TEST reset process. It is not authorized for execution.

  Default safety behavior:
  - COMMIT is commented out.
  - ROLLBACK is active.

  If this file is reviewed and later approved for execution, create a separate
  execution copy after confirming backup, target database, table scope, and
  dependency order.
*/

-- ============================================================
-- 0. PRESERVE EXCLUSIONS - DO NOT TOUCH IN THIS RESET
-- ============================================================
--
-- Do NOT reset these without separate explicit review:
--
-- Workspace/auth/RBAC:
-- - workspaces
-- - workspace_settings
-- - workspace_members
-- - workspace_user_roles
-- - workspace_invitations
-- - user_profiles
-- - rbac_roles
-- - rbac_permissions
-- - rbac_role_permissions
--
-- Migration/system:
-- - migration tables
-- - schema migration tables
-- - Supabase/system metadata tables
--
-- Audit/governance foundations:
-- - workspace_activity
-- - authorization_audit_events
-- - audit_logs
-- - module audit foundation tables unless separately reviewed
--
-- Finance/config/reference:
-- - finance_accounts
-- - finance_company_settings
-- - finance_country_currency
-- - finance_exchange_rates
-- - finance_periods
-- - finance_tax_profiles
-- - finance_tax_rates
-- - other finance/config/reference tables unless separately reviewed
--
-- Review-required tables:
-- - accounts
-- - companies
-- - projects
-- - project_tasks
-- - royalty_events
-- - finance operational rows
--
-- Contributors:
-- - contributors are included as a REVIEW GATE only.
-- - do not delete contributors unless they are explicitly confirmed disposable.

-- ============================================================
-- 1. PREFLIGHT DATABASE IDENTITY CHECKS
-- ============================================================

SELECT
  current_database() AS current_database,
  current_schema() AS current_schema,
  current_user AS current_user,
  now() AS inspected_at;

-- Confirm this is the intended DEV/TEST database before continuing.

-- ============================================================
-- 2. PRE-RESET ROW COUNT CHECKS
-- ============================================================

SELECT 'SubmissionDispatchAttempt' AS table_name, COUNT(*) AS row_count FROM public."SubmissionDispatchAttempt"
UNION ALL SELECT 'SubmissionDispatchQueue', COUNT(*) FROM public."SubmissionDispatchQueue"
UNION ALL SELECT 'SubmissionQueueEvent', COUNT(*) FROM public."SubmissionQueueEvent"
UNION ALL SELECT 'SubmissionRemediationCase', COUNT(*) FROM public."SubmissionRemediationCase"
UNION ALL SELECT 'SubmissionExport', COUNT(*) FROM public."SubmissionExport"
UNION ALL SELECT 'SubmissionQueue', COUNT(*) FROM public."SubmissionQueue"
UNION ALL SELECT 'SubmissionSnapshot', COUNT(*) FROM public."SubmissionSnapshot"
UNION ALL SELECT 'EvidenceAuditEvent', COUNT(*) FROM public."EvidenceAuditEvent"
UNION ALL SELECT 'RegistrationEvidence', COUNT(*) FROM public."RegistrationEvidence"
UNION ALL SELECT 'EscalationDeadLetterQueue', COUNT(*) FROM public."EscalationDeadLetterQueue"
UNION ALL SELECT 'EscalationNotificationQueue', COUNT(*) FROM public."EscalationNotificationQueue"
UNION ALL SELECT 'OperationalEscalationEvent', COUNT(*) FROM public."OperationalEscalationEvent"
UNION ALL SELECT 'OperationalIncident', COUNT(*) FROM public."OperationalIncident"
UNION ALL SELECT 'recording_contributors', COUNT(*) FROM public.recording_contributors
UNION ALL SELECT 'recordings', COUNT(*) FROM public.recordings
UNION ALL SELECT 'asset_files', COUNT(*) FROM public.asset_files
UNION ALL SELECT 'documents', COUNT(*) FROM public.documents
UNION ALL SELECT 'licenses', COUNT(*) FROM public.licenses
UNION ALL SELECT 'usage_logs', COUNT(*) FROM public.usage_logs
UNION ALL SELECT 'workflow_tasks', COUNT(*) FROM public.workflow_tasks
UNION ALL SELECT 'splits', COUNT(*) FROM public.splits
UNION ALL SELECT 'work_contributors', COUNT(*) FROM public.work_contributors
UNION ALL SELECT 'musical_works', COUNT(*) FROM public.musical_works
UNION ALL SELECT 'assets', COUNT(*) FROM public.assets
UNION ALL SELECT 'contributors_REVIEW_GATE', COUNT(*) FROM public.contributors
ORDER BY table_name;

-- ============================================================
-- 3. REVIEW-ONLY RESET TRANSACTION
-- ============================================================

BEGIN;

-- ============================================================
-- A. OLD TEST SUBMISSION / QUEUE / DISPATCH / REMEDIATION ROWS
-- ============================================================

DELETE FROM public."SubmissionDispatchAttempt";
DELETE FROM public."SubmissionDispatchQueue";
DELETE FROM public."SubmissionQueueEvent";
DELETE FROM public."SubmissionRemediationCase";
DELETE FROM public."SubmissionExport";
DELETE FROM public."SubmissionQueue";
DELETE FROM public."SubmissionSnapshot";

-- ============================================================
-- B. OLD TEST EVIDENCE / EVIDENCE AUDIT ROWS
-- ============================================================

DELETE FROM public."EvidenceAuditEvent";
DELETE FROM public."RegistrationEvidence";

-- ============================================================
-- C. OLD TEST INCIDENT / ESCALATION ROWS
-- ============================================================

DELETE FROM public."EscalationDeadLetterQueue";
DELETE FROM public."EscalationNotificationQueue";
DELETE FROM public."OperationalEscalationEvent";
DELETE FROM public."OperationalIncident";

-- ============================================================
-- D. WORKS/SONGS OPERATIONAL TEST ROWS
-- ============================================================

-- Work-dependent rows first.
-- These were zero-row or reset-candidate dependency tables in the snapshot,
-- but they are included before parent work/asset deletes for dependency safety.
-- Do NOT include royalty_events, projects, accounts, companies, or finance tables
-- in this reset without separate review.

DELETE FROM public.recording_contributors;
DELETE FROM public.recordings;
DELETE FROM public.workflow_tasks;
DELETE FROM public.splits;

-- Active Works/Songs link rows.
DELETE FROM public.work_contributors;

-- Parent works.
DELETE FROM public.musical_works;

-- Asset-dependent rows before assets.
DELETE FROM public.asset_files;
DELETE FROM public.documents;
DELETE FROM public.licenses;
DELETE FROM public.usage_logs;

-- Parent assets.
DELETE FROM public.assets;

-- ============================================================
-- E. CONTRIBUTOR REVIEW GATE
-- ============================================================
--
-- Contributors are not workspace-scoped and appear to contain TEST/prototype
-- records, but they may become canonical seed data or may be referenced by
-- other modules. Do not enable this section unless contributors are explicitly
-- confirmed disposable and dependent tables have been reviewed.
--
-- Potential dependent tables include:
-- - contract_parties
-- - payout_items
-- - recording_contributors
-- - rights_ownership_claims
-- - royalty_distributions
-- - royalty_ledger
-- - settlements
-- - splits
-- - work_contributors
--
-- DELETE FROM public.contributors;

-- ============================================================
-- 4. POST-RESET VERIFICATION QUERIES
-- ============================================================

SELECT 'SubmissionDispatchAttempt' AS table_name, COUNT(*) AS row_count FROM public."SubmissionDispatchAttempt"
UNION ALL SELECT 'SubmissionDispatchQueue', COUNT(*) FROM public."SubmissionDispatchQueue"
UNION ALL SELECT 'SubmissionQueueEvent', COUNT(*) FROM public."SubmissionQueueEvent"
UNION ALL SELECT 'SubmissionRemediationCase', COUNT(*) FROM public."SubmissionRemediationCase"
UNION ALL SELECT 'SubmissionExport', COUNT(*) FROM public."SubmissionExport"
UNION ALL SELECT 'SubmissionQueue', COUNT(*) FROM public."SubmissionQueue"
UNION ALL SELECT 'SubmissionSnapshot', COUNT(*) FROM public."SubmissionSnapshot"
UNION ALL SELECT 'EvidenceAuditEvent', COUNT(*) FROM public."EvidenceAuditEvent"
UNION ALL SELECT 'RegistrationEvidence', COUNT(*) FROM public."RegistrationEvidence"
UNION ALL SELECT 'EscalationDeadLetterQueue', COUNT(*) FROM public."EscalationDeadLetterQueue"
UNION ALL SELECT 'EscalationNotificationQueue', COUNT(*) FROM public."EscalationNotificationQueue"
UNION ALL SELECT 'OperationalEscalationEvent', COUNT(*) FROM public."OperationalEscalationEvent"
UNION ALL SELECT 'OperationalIncident', COUNT(*) FROM public."OperationalIncident"
UNION ALL SELECT 'recording_contributors', COUNT(*) FROM public.recording_contributors
UNION ALL SELECT 'recordings', COUNT(*) FROM public.recordings
UNION ALL SELECT 'asset_files', COUNT(*) FROM public.asset_files
UNION ALL SELECT 'documents', COUNT(*) FROM public.documents
UNION ALL SELECT 'licenses', COUNT(*) FROM public.licenses
UNION ALL SELECT 'usage_logs', COUNT(*) FROM public.usage_logs
UNION ALL SELECT 'workflow_tasks', COUNT(*) FROM public.workflow_tasks
UNION ALL SELECT 'splits', COUNT(*) FROM public.splits
UNION ALL SELECT 'work_contributors', COUNT(*) FROM public.work_contributors
UNION ALL SELECT 'musical_works', COUNT(*) FROM public.musical_works
UNION ALL SELECT 'assets', COUNT(*) FROM public.assets
UNION ALL SELECT 'contributors_REVIEW_GATE_NOT_DELETED', COUNT(*) FROM public.contributors
ORDER BY table_name;

-- Preserve-table sanity checks.
SELECT 'workspaces' AS preserved_table, COUNT(*) AS row_count FROM public.workspaces
UNION ALL SELECT 'workspace_settings', COUNT(*) FROM public.workspace_settings
UNION ALL SELECT 'workspace_members', COUNT(*) FROM public.workspace_members
UNION ALL SELECT 'workspace_user_roles', COUNT(*) FROM public.workspace_user_roles
UNION ALL SELECT 'workspace_invitations', COUNT(*) FROM public.workspace_invitations
UNION ALL SELECT 'user_profiles', COUNT(*) FROM public.user_profiles
UNION ALL SELECT 'rbac_roles', COUNT(*) FROM public.rbac_roles
UNION ALL SELECT 'rbac_permissions', COUNT(*) FROM public.rbac_permissions
UNION ALL SELECT 'rbac_role_permissions', COUNT(*) FROM public.rbac_role_permissions
UNION ALL SELECT 'workspace_activity', COUNT(*) FROM public.workspace_activity
UNION ALL SELECT 'authorization_audit_events', COUNT(*) FROM public.authorization_audit_events
UNION ALL SELECT 'audit_logs', COUNT(*) FROM public.audit_logs
ORDER BY preserved_table;

-- ============================================================
-- 5. TRANSACTION END - DEFAULT SAFETY IS ROLLBACK
-- ============================================================

-- COMMIT; -- DO NOT UNCOMMENT WITHOUT EXPLICIT APPROVAL AND BACKUP.
ROLLBACK;
