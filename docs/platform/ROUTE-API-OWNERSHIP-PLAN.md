# Route/API Ownership Plan

## Purpose

This plan documents current and future ownership for active Works/Songs and registration routes. It prevents route-level drift while the canonical operational model is aligned.

No behavior changes are made by this document.

## Route Ownership

| Route/API | Current status | Source of truth touched | Decision | Future canonical replacement/direction |
| --- | --- | --- | --- | --- |
| `/api/songs/create` | Active V1 capture route | `rpc_create_song_with_contributors` writes `assets`, `musical_works`, `contributors`, `work_contributors` | Keep as current active capture route until a deliberate route consolidation is approved | Either retain as canonical create route or replace with workspace-scoped `/api/works` create endpoint without UX breakage |
| `/api/works` | Active canonical summary read route | Reads `musical_works` and `work_contributors` through canonical read model boundary | Keep as product-facing Works summary read model | Add workspace scoping, pagination, and richer operational summaries later |
| `/api/works/[workId]` | Active canonical detail read route | Reads one `musical_works` record and `work_contributors` aggregate through canonical detail read model boundary | Keep as product-facing Song Profile detail read model | Add workspace scoping and richer profile/readiness/identifier joins only when canonical owners exist |
| `/api/works/[workId]/profile` | Active canonical Song Profile update route | Writes `musical_works.themes` and `musical_works.metadata.work_intelligence_v1.creative_truth`; preserves `system_insights` and unrelated metadata | Keep as product-facing creative-truth save route | Add workspace scoping and audit history later without mixing AI/system outputs into user truth |
| `/api/works/[workId]/files` | Active canonical supporting-material reference route | Reads/writes `file_vault_items`, `file_vault_links`, and `file_vault_audit_events` after confirming `musical_works.workspace_id` | Keep as product-facing metadata-reference route for work supporting materials | Add real upload/storage governance, verification, evidence authority, and readiness integration only when explicitly scoped |
| `/api/works/[workId]/completeness` | Active canonical operational completeness read route | Reads `musical_works`, `work_contributors`, `contributors`, `file_vault_items`, `file_vault_links`, and creative-truth metadata after confirming workspace ownership | Keep as product-facing read-only completeness visibility route | Add governed readiness, legal/evidence verification, submission gates, regulator checks, or scoring only when explicitly scoped |
| `/api/works/create` | Legacy/parallel/non-active for current dashboard unless proven otherwise | Prisma `MusicalWork` through `createMusicalWork` | Do not use for current dashboard work creation | Deprecate or realign to canonical lowercase operational schema |
| `/api/test/get-work` | Temporary TEST read model | Raw query over `musical_works` and `work_contributors` | Keep only as TEST/V1 read support for current pages | Replace with real workspace-scoped `/api/works` read model |
| `/api/test/works/[workId]/intelligence` | Deprecated TEST Song Profile save route | `musical_works.themes`, `musical_works.metadata.work_intelligence_v1` | Retain temporarily for TEST/control/backward compatibility only; new product code must use `/api/works/[workId]/profile` | Remove or archive after TEST compatibility is no longer needed |
| `/api/submissions/readiness` | Active TEST/prototype readiness route | Reads `musical_works` and `work_contributors` | Keep as prototype until canonical readiness service is designed | Canonical readiness endpoint using workspace-scoped work/recording/evidence/identifier checks |
| `/api/submissions/create-from-work` | Active TEST/prototype queue route | Validates `musical_works.id`; creates Prisma `SubmissionQueue` | Keep as prototype; document entity id contract | Canonical submission intent route mapped to canonical work/recording IDs and immutable submission snapshots |
| `/api/submissions/pending` | Active TEST/prototype queue read | Prisma `SubmissionQueue` | Keep as prototype/read-only support | Workspace-scoped submission queue read model |
| `/dashboard/works` | Active Works landing UX | Reads canonical `/api/works` as of Phase 2 continuation | Preserve UX | Continue using canonical Works read model; later add workspace scoping and richer operational summaries |
| `/dashboard/works/new` | Active Add Work UX | Duplicate-awareness read uses canonical `/api/works`; writes `/api/songs/create` | Preserve UX | Keep create/save on current V1 route until a deliberate canonical write route is approved |
| `/dashboard/works/list` | Active Existing Works UX | Reads canonical `/api/works` as of Phase 2 start | Preserve UX | Continue using canonical Works read model; later add workspace scoping, pagination, and richer operational summaries |
| `/dashboard/works/details/[workId]` | Active Song Profile TEST/V1 UX | Reads canonical `/api/works/[workId]`; writes canonical `/api/works/[workId]/profile` | Preserve UX | Add workspace scoping and audit history later |

## Expected Direction

`/api/songs/create` is the current active capture route.

`/api/works/create` is legacy/parallel for current dashboard work creation unless a future inspection proves it has become active.

`/api/test/get-work` is temporary and must not become the permanent product read model.

Future production alignment should introduce a real workspace-scoped `/api/works` read model and, later, a canonical create/update route that preserves the current UX while replacing TEST internals.

Phase 2 transition status:

- `/dashboard/works`, `/dashboard/works/list`, and `/dashboard/works/new` duplicate-awareness now read from `/api/works`.
- `/dashboard/works/details/[workId]` now reads one work from `/api/works/[workId]`.
- `/dashboard/works/details/[workId]` now saves creative truth through `/api/works/[workId]/profile`.
- `/dashboard/works/new` create/save behavior still uses `/api/songs/create`.
- TEST control surfaces and registration workflow TEST pages still use `/api/test/get-work`.
- `/api/test/get-work` remains temporarily available for TEST compatibility.
- `/api/test/works/[workId]/intelligence` is deprecated for dashboard use and retained only for TEST/control/backward compatibility.
- Workspace scoping and audit history for profile updates are planned in `docs/platform/WORK-PROFILE-SCOPING-AUDIT-PLAN.md`.

## Route Change Rule

Any future route change must declare:

- canonical data owner
- source tables/models touched
- whether the route is active, test-only, legacy/reference, or future target
- migration/compatibility impact on current dashboard pages
