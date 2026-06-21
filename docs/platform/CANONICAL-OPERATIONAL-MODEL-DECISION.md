# Canonical Operational Model Decision

## Purpose

This document records the approved canonical operational data model decision for Sentry Sound Platform.

It is an architecture decision only. It does not add schema, run migrations, change UX behavior, activate production governance, add official identifier tables, or generate ISWC/ISRC values.

## Approved Decision

Sentry Sound will use the current lowercase operational model as the living product seed and formalize it into the canonical operational schema.

Supabase/Postgres is the database. Prisma is a backend/developer access and modelling layer. Prisma must conform to the canonical operational model and must not remain a competing business reality.

Current lowercase operational tables are the active canonical seed:

- `musical_works`
- `assets`
- `contributors`
- `work_contributors`

Older Prisma duplicate work models, especially `MusicalWork`, are legacy/parallel until aligned to the canonical operational schema.

## Why This Decision Was Made

The platform is early-stage, with no production users, no live catalog dependency, no irreversible industry integrations, and no real royalty history. This is the safest time to align the model before the system accumulates expensive data and workflow dependencies.

The active Works/Songs UX has discovered the practical operational shape of the product:

- Works are captured through `/dashboard/works/new`.
- Captured works are shown through `/dashboard/works`, `/dashboard/works/list`, and `/dashboard/works/details/[workId]`.
- Current draft persistence uses `/api/songs/create` and `rpc_create_song_with_contributors`.
- Current Song Profile creative truth persists against `musical_works`.
- Current duplicate awareness reads the existing lowercase work records.

Future identifiers, submission returns, royalty/compliance workflows, reporting, and AI intelligence all require one operational truth. Leaving parallel work models in place would create expensive drift later.

## Canonical Now

The active canonical seed is the current Works/Songs operational path:

- `musical_works`
- `assets`
- `contributors`
- `work_contributors`
- `/api/songs/create`
- `rpc_create_song_with_contributors`
- `/dashboard/works`
- `/dashboard/works/new`
- `/dashboard/works/list`
- `/dashboard/works/details/[workId]`
- Step 0 duplicate awareness
- Song Profile / creative truth

This is still a TEST/V1 product surface, but it is the living source used by the active UX and should be treated as the seed for canonical production alignment.

## Not Yet Canonical

The following are not canonical active product truth yet:

- Prisma `MusicalWork`: legacy/parallel pending alignment.
- Prisma duplicate work creation through `/api/works/create`: non-active for the current dashboard unless explicitly proven otherwise.
- `/api/test/get-work`: temporary TEST read model, not the final production Works read API.
- Recording/master model: not yet active in the current Works/Songs UX.
- Official identifier table: not yet implemented.
- Real submission-return-to-identifier automation: not yet implemented.
- AI commercial insight persistence beyond current structured TEST metadata: not yet canonical.

## Future Canonical Target Entities

The canonical model should evolve toward these entities:

- `workspaces`: tenant/account/operational container.
- `assets`: broad operational asset/file/catalog anchor.
- `musical_works`: composition/work-level rights and catalog entity.
- `recordings`: master/sound recording entity linked to works.
- `contributors`: canonical person/entity contributor identity.
- `work_contributors`: work-level composition, writing, publisher/admin roles and splits.
- `recording_contributors`: recording/master performers, producers, master owners, and neighboring-rights participants.
- `song_profile` / `creative_truth`: user-entered factual and creative context.
- `system_insights`: generated commercial intelligence, not user-entered truth.
- `external_identifiers`: official/body/distributor references and identifiers.
- `submission_queue`: operational submission lifecycle queue.
- `evidence`: evidence records and supporting documents/files.
- `readiness`: readiness results, blockers, warnings, and snapshots.
- `audit_events`: operational history and source tracking.
- `action_recommendations`: future AI/service recommendations.
- service/upsell workflows: operational service execution and follow-up actions.

## Entity Boundaries

`musical_works` represents the composition/work. It is the home for work-level identity, creative truth, composition contributors, composition splits, work registration posture, and ISWC/SAMRO/CAPASSO work references when implemented.

`recordings` represents the master/sound recording. It is separate from the composition and will carry recording-level metadata, master contributors, master ownership, and ISRC/distributor references when implemented.

ISWC belongs to the work/composition layer.

ISRC belongs to the recording/master layer.

Official identifiers and registration-body references must not live only in `metadata`. Metadata can carry supporting context, but durable identifiers require a structured table with source, assignment/return date, status, audit linkage, and entity ownership.

Generated AI recommendations are not user-entered creative truth. User-entered creative truth and system-generated commercial intelligence must remain separate.

Permanent platform principle:

AI/system outputs are not editable user truth. AI recommendations must not overwrite user-provided facts. Commercial intelligence must be generated and stored as system output, while user fields remain factual and creative inputs. Future AI outputs may be reviewed, accepted, rejected, or converted into actions, but they must not silently become user-entered truth.

## Immediate Do Not Do Yet

- Do not add an official identifier table yet.
- Do not add ISWC/ISRC UI capture yet.
- Do not generate ISWC or ISRC values.
- Do not build real submission-return automation yet.
- Do not expand AI insight persistence beyond the current approved TEST/V1 shape.
- Do not activate production governance through this alignment pass.
- Do not run destructive migrations.
- Do not let Prisma models create competing business truth.

## Decision Status

Approved as the current architecture direction for future platform alignment.
