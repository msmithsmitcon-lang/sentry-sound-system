# Controlled TEST Data Reset Strategy

## Purpose

This document defines a controlled reset strategy for disposable operational TEST data.

This is not a full database wipe. The goal is to preserve Sentry Sound's platform foundation, canonical architecture, workspace/auth structure, governance direction, routes, services, contracts, and documentation while clearing low-value TEST/prototype records that may conflict with the future canonical Works flow.

This document does not authorize deletion, truncation, migrations, workspace enforcement, identifier implementation, or production cleanup.

## Why A Controlled Reset Is Being Planned

Inspection confirmed that the current Works/Songs data is structurally pre-canonical:

- `musical_works` has TEST/prototype rows and no workspace ownership column.
- `assets` has TEST/prototype rows and no workspace ownership column.
- `contributors` are not workspace-scoped.
- historical TEST submissions and older Prisma registration rows may point at unowned or drifted work records.
- future workspace scoping, audit history, identifiers, readiness, and submission mapping need clean canonical anchors.

The reset objective is not to preserve fake test songs. The objective is to preserve architectural integrity and avoid future technical debt from unowned or structurally inconsistent TEST data.

## Preserve List

The following tables/data must not be reset as part of an operational TEST data cleanup unless a separate approved review explicitly classifies them as disposable.

Workspace/auth foundation:

- `workspaces`
- `workspace_settings`
- `workspace_members`
- `workspace_user_roles`
- `workspace_invitations`
- `user_profiles`

RBAC/auth foundation:

- `rbac_roles`
- `rbac_permissions`
- `rbac_role_permissions`
- `authorization_audit_events`

Migration/system tracking:

- migration tracking tables
- schema migration tables
- Supabase/system metadata tables

Audit/governance foundation:

- `workspace_activity`
- authorization audit foundations
- operational audit foundations

Finance/config/reference tables unless separately reviewed:

- `finance_accounts`
- `finance_company_settings`
- `finance_country_currency`
- `finance_tax_rates`
- `finance_exchange_rates`
- chart/account/reference/config rows

Platform documentation, source code, routes, services, contracts, and canonical architecture documents must also be preserved.

## Reset Candidate List

The following are likely reset candidates after backup, exact scope review, and explicit approval.

Active operational Works/Songs TEST data:

- `work_contributors`
- `musical_works`
- `assets`
- `contributors`, if confirmed disposable and not needed as canonical contributor seed data

Older/parallel Prisma registration TEST data:

- `MusicalWork`
- `MusicalWorkContributor`
- `Recording`
- `RecordingPerformer`
- `RegistrationAuditEvent`
- `RegistrationDispute`
- `RegistrationAmendment`
- `RegistrationEvidence`

Submission/evidence TEST data:

- `SubmissionQueue`
- `SubmissionQueueEvent`
- `SubmissionSnapshot`
- `SubmissionExport`
- `SubmissionDispatchQueue`
- `SubmissionDispatchAttempt`
- `SubmissionRemediationCase`
- `EvidenceAuditEvent`

Old TEST incident/escalation data:

- `OperationalIncident`
- `OperationalEscalationEvent`
- `EscalationNotificationQueue`
- `EscalationDeadLetterQueue`

Other operational TEST rows should be reviewed table by table before inclusion.

## Dependency Order Strategy

Deletion order must be dependency-aware and verified immediately before execution.

Inspection found that `musical_works` and `assets` have dependent tables. Clearing parent rows first can fail, cascade unexpectedly, or leave orphaned prototype data if constraints differ across environments.

Known dependencies from inspection include:

- `work_contributors` references `musical_works` and `contributors`.
- `musical_works` references `assets`.
- `recordings`, `rights_registrations`, `royalty_events`, `royalty_ledger`, `royalty_distributions`, `splits`, and `workflow_tasks` may reference `musical_works`.
- `asset_files`, `documents`, `licenses`, `recordings`, `usage_logs`, and `musical_works` may reference `assets`.
- contributor-related tables such as `recording_contributors`, `rights_ownership_claims`, `royalty_*`, `settlements`, `splits`, and `work_contributors` may reference `contributors`.

Recommended deletion planning order:

1. Clear submission dispatch/remediation/event rows that reference submission/export rows.
2. Clear submission export/snapshot/queue rows.
3. Clear evidence audit/evidence rows that are confirmed TEST-only.
4. Clear work-dependent operational rows such as `work_contributors`, recordings, rights/royalty/workflow TEST rows if included.
5. Clear `musical_works`.
6. Clear asset-dependent TEST rows if included.
7. Clear `assets`.
8. Clear contributor-dependent TEST rows if included.
9. Clear `contributors` only if confirmed disposable.

Do not execute this order blindly. Before execution, generate and review an exact SQL reset script using live foreign-key inspection.

## Backup Checklist

Before any reset:

- take a full database backup.
- capture a row count snapshot for all public tables.
- capture a table and column snapshot.
- optionally export current TEST works, contributors, and submissions for reference.
- confirm no production-sensitive information exists in reset candidates.
- confirm reset scope table by table.
- confirm dependency order through live foreign-key inspection.
- confirm whether `contributors` are disposable or should become canonical seed data.
- confirm whether any finance, workspace, auth, or audit rows are linked to reset candidates.
- confirm rollback path and restore procedure.

## Reseed Strategy

After reset, reseed only through approved/canonical flows.

Reseed principles:

- wait until the workspace ownership path is implemented or explicitly planned.
- create workspace-owned works after `musical_works` and `assets` ownership is resolved.
- use controlled dropdown values.
- use canonical `/api/songs/create` only if it has been aligned with workspace ownership, or use the future approved create route.
- avoid direct ad hoc inserts except for reviewed seed scripts.

Post-reseed validation:

- verify `/api/works` returns only clean canonical TEST works.
- verify `/api/works/[workId]` loads a specific work.
- verify `/api/works/[workId]/profile` saves creative truth and preserves system insights.
- verify duplicate awareness works on controlled data.
- verify Song Profile reads and saves without TEST route dependency.
- verify future readiness/submission tests use clean internal work IDs.

## Risks

Risks of not resetting:

- old unowned works will pollute workspace-scoping implementation.
- duplicate-awareness tests may be distorted by broad or outdated genre/mood records.
- future identifiers, submissions, royalties, and AI intelligence may attach to structurally bad records.
- historical TEST submissions may keep pointing at non-canonical or unowned work IDs.
- future cleanup becomes harder after more routes depend on current residue.

Risks of resetting too aggressively:

- deleting workspace/auth/RBAC foundation.
- breaking setup, dashboard, invitation, or workspace-context flows.
- losing reference/config rows needed by finance or operational modules.
- damaging migration history or schema tracking.
- deleting audit rows that explain prior controlled tests.
- losing data that contains real user or email context.

Risks of clearing parent tables before dependent tables:

- foreign-key errors.
- unexpected cascades.
- orphaned rows in tables not included in the reset.
- inconsistent submission/evidence/readiness history.

Risks of keeping old unowned works:

- false confidence in workspace security.
- cross-tenant leakage risk once multi-workspace behavior grows.
- unreliable audit and ownership history.
- harder mapping for future official identifiers and registration-body returns.

## Phase Plan

Phase A - Reset strategy doc

- Create this strategy document.
- Record preserve list, reset candidates, dependency concerns, backup checklist, and phased approach.
- No data changes.

Phase B - Backup/export snapshot

- Export full database backup.
- Capture row counts.
- Capture table/column snapshot.
- Optionally export current TEST works/submissions for reference.

Status 2026-05-20:

- Created `docs/db-snapshots/pre-reset-2026-05-20/table-row-counts.md`.
- Created `docs/db-snapshots/pre-reset-2026-05-20/reset-scope-review.md`.
- Created `docs/db-snapshots/pre-reset-2026-05-20/current-test-works-export.json`.
- Counted 136 public tables.
- Exported only limited Works/Songs TEST data: `musical_works`, linked `assets`, `work_contributors`, and contributor display/linkage data.
- Did not export auth, workspace membership, user profile, payment, subscription, secret, or sensitive system data.
- No data was changed.

Phase C - Exact SQL reset script review only

- Generate a candidate reset script.
- Include explicit table order.
- Review foreign-key dependencies.
- Do not execute.

Status 2026-05-20:

- Created `docs/db-snapshots/pre-reset-2026-05-20/review-only-reset-script.sql`.
- Created `docs/db-snapshots/pre-reset-2026-05-20/reset-script-review-notes.md`.
- Script uses explicit `DELETE FROM ...` order for review clarity.
- Script keeps `COMMIT` commented and ends with active `ROLLBACK`.
- Script excludes workspace/auth/RBAC, migration/system, audit foundation, finance/config/reference, `audit_logs`, `accounts`, `companies`, `projects`, and `royalty_events`.
- Contributors remain behind a commented review gate.
- No SQL was executed.

Phase D - Execute reset only after approval

- Execute only after explicit approval.
- Confirm backup exists.
- Capture before/after row counts.

Status 2026-05-20:

- Created and executed `docs/db-snapshots/pre-reset-2026-05-20/approved-reset-script-final-corrected.sql`.
- Guarded optional/legacy `RegistrationEvidence` because it does not exist in the live public schema.
- Included the single linked TEST `royalty_events` row after explicit approval because it referenced current fake/test `musical_works` data.
- Temporarily disabled only the `work_contributors` required-role validation trigger during controlled link cleanup and re-enabled it before commit.
- Cleared approved reset candidate tables to zero rows.
- Preserved workspace/auth/RBAC, user profile, account/company/project, finance/config/reference, and foundation tables.
- `audit_logs` remained intact and increased from 60 to 80 rows because the existing work contributor audit trigger logged 20 controlled TEST link deletions.
- Created `docs/db-snapshots/pre-reset-2026-05-20/post-reset-verification.md`.

Phase E - Reseed clean canonical TEST data

- Reseed through approved canonical flows.
- Prefer workspace-owned create flow once implemented.
- Use controlled test titles, contributors, splits, genre, mood, and profile data.

Status 2026-05-20:

- Seeded 10 clean canonical TEST works after workspace ownership alignment.
- Seeded through the workspace-owned canonical create RPC using the existing authenticated workspace/user context.
- Populated Song Profile creative truth using the canonical `work_intelligence_v1.creative_truth` shape.
- Preserved `work_intelligence_v1.system_insights.status = "not_generated"` and did not create AI/system outputs.
- Did not create fake ISWC, ISRC, SAMRO, CAPASSO, distributor, publisher, or other official industry identifiers.
- Identifier placeholder logic remains documented only for future implementation: ISWC not assigned yet, ISRC belongs to recording/master later, SAMRO/CAPASSO references are returned after registration.
- Verified `assets`, `musical_works`, `contributors`, and `work_contributors` all have `workspace_id`.
- Verified 10 works, 10 assets, 13 contributors, and 13 work contributor links.
- Verified contributor counts, 100% split totals, creative truth, and `system_insights.status = "not_generated"`.

Phase F - Validate Works/Song Profile flow

- Validate create, list, detail read, profile update, duplicate awareness, and future readiness setup on clean data.

## What Not To Do Yet

- Do not delete data.
- Do not truncate tables.
- Do not run migrations.
- Do not enforce workspace ownership.
- Do not implement identifiers.
- Do not activate submission-return logic.
- Do not perform production cleanup.
- Do not reset finance/auth/workspace/RBAC foundations without a separate approved review.
