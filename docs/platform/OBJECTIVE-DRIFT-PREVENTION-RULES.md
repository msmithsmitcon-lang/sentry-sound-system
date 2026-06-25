# Objective Drift Prevention Rules

## Purpose

These rules prevent Sentry Sound Platform from accumulating competing models, disconnected routes, or backend features that do not support the approved operational product direction.

## Rules

1. Every backend change must declare its canonical data owner.

2. Before schema changes, inspect the active UI path and the current source-of-truth docs.

3. Build log entries must mark work as one of:
   - active
   - test-only
   - legacy/reference
   - future target

4. Codex must flag proposed changes touching non-canonical paths before implementing them.

5. No identifier or submission-return logic may be added unless the canonical entity owner is confirmed.

6. No new parallel work model may be introduced without explicit architecture approval.

7. UX discovery can update architecture, but docs must be updated before backend expansion.

8. Prisma models must not create competing business truth. Prisma should model/access the canonical Postgres schema.

9. Metadata JSON is not a dumping ground. Use structured metadata only for approved interim contracts and graduate fields to durable columns/tables when they become searchable, reportable, compliance-critical, or integration-critical.

10. AI outputs must be separated from user-entered creative truth.

## Current Canonical Reminder

The active Works/Songs canonical seed is:

- `musical_works`
- `assets`
- `contributors`
- `work_contributors`
- `/api/songs/create`
- current Works/Songs dashboard pages

Prisma `MusicalWork` is legacy/parallel until aligned.
