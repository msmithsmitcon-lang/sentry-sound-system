# Reset Script Review Notes

Snapshot folder: `docs/db-snapshots/pre-reset-2026-05-20/`

Script: `review-only-reset-script.sql`

Status: REVIEW ONLY. Not executed.

## Purpose

This note explains the review-only SQL reset script drafted in Phase C.

The script is intended to be read, reviewed, and revised before any execution copy is created. It must not be executed without explicit approval, a confirmed backup, and target database verification.

## Safety Posture

The script includes:

- strong warning comments.
- database identity checks.
- pre-reset row count checks.
- explicit `DELETE FROM ...` statements in dependency-aware order.
- post-reset verification queries.
- preserve-table sanity checks.
- `COMMIT` commented out.
- active `ROLLBACK` as the default transaction ending.

No `TRUNCATE ... CASCADE` is used.

## Preserve Exclusions

The script explicitly excludes:

- `workspaces`
- `workspace_settings`
- `workspace_members`
- `workspace_user_roles`
- `workspace_invitations`
- `user_profiles`
- `rbac_roles`
- `rbac_permissions`
- `rbac_role_permissions`
- migration/schema tracking tables
- `workspace_activity`
- `authorization_audit_events`
- `audit_logs`
- finance/config/reference tables
- `accounts`
- `companies`
- `projects`
- `project_tasks`
- `royalty_events`

These tables must not be reset without separate review.

## Reset Groups

The script separates reset candidates into:

1. old TEST submission / queue / dispatch / remediation rows.
2. old TEST evidence / evidence audit rows.
3. old TEST incident / escalation rows.
4. Works/Songs operational TEST rows.
5. contributor review gate.

## Contributor Review Gate

`contributors` is not actively deleted in the script.

Reason:

- contributor rows are not workspace-scoped and appear test-like.
- however, contributors may be reused as seed data or referenced by other modules.
- dependent tables must be reviewed before any contributor deletion.

The contributor delete line is present only as a commented review gate:

```sql
-- DELETE FROM public.contributors;
```

## Dependency Notes

The script clears known child/dependent rows before parent tables:

- submission attempts/dispatch/events/remediation before queue/snapshot cleanup.
- evidence audit rows before evidence rows.
- work contributor/dependent rows before `musical_works`.
- asset-dependent rows before `assets`.

Tables that require separate review are not included even if they may reference works:

- `royalty_events`
- rights/royalty operational rows
- project rows
- finance rows
- accounts/companies

## Known Review Risks

- `RegistrationEvidence` may not exist in all environments if migrations differ; confirm table presence before execution.
- `contributors` remains populated unless explicitly approved for deletion.
- `royalty_events` has 1 row and is intentionally excluded.
- `audit_logs` has 60 rows and is intentionally excluded.
- finance tables contain nonzero rows and are intentionally excluded.
- if a target database has additional FK dependencies not seen in the snapshot, the script may require updates.

## Required Before Any Execution Copy

Before an executable reset script is created:

- confirm full DB backup exists.
- confirm target database is DEV/TEST.
- rerun table counts.
- rerun FK inspection.
- confirm exact reset scope table by table.
- decide whether `contributors` should be reset or preserved.
- decide whether zero-row dependency tables should remain in the script.
- confirm no production-sensitive data is in reset candidates.
- create a separate execution copy; do not execute the review artifact directly.

## Phase D Gate

Phase D can only proceed after explicit approval.

Until then, this script remains a review-only artifact.
