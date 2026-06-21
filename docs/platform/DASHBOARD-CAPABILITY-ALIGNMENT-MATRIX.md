# Sentry Sound Platform - Dashboard Capability Alignment Matrix

## 1. Purpose

This document aligns the intended dashboard command-centre topology with current and future Sentry Sound Platform capabilities.

This is not a visual UI design exercise.

This is an operational systems-alignment exercise.

It should be read together with `docs/platform/PLATFORM-ECOSYSTEM-DOMAIN-ARCHITECTURE.md`, which maps the broader platform domains and their implemented, partial, conceptual, deferred, and recommended status.

It should also follow `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`, which defines the foundation checks required before dashboard cards, quick actions, and workflow mutations can be treated as production-governed.

Workspace plan entitlement, collaborator access, and feature/action allowances are defined conceptually in `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`.

It maps:

- dashboard UX areas
- operational user intents
- existing backend capabilities
- existing workflow capabilities
- existing API support
- missing systems logic
- missing persistence
- missing governance
- future capability direction
- current implementation status

The provided SaaS dashboard image is used only as:

- operational structure reference
- workflow grouping reference
- command-centre reference

Do not copy it literally.

Use its topology to organize operational SaaS behavior around real backend truth.

## 2. Status Definitions

### Working

The capability has a functioning backend/API/workflow path in the current repository.

### Partial

Some backend/API/workflow support exists, but it is incomplete, TEST-only, read-only, or not fully governed.

### Conceptual

The capability is documented or implied by architecture direction but has no reliable operational implementation yet.

### Deferred

The capability is intentionally not active yet and must not be represented as operational.

## 3. Dashboard Alignment Matrix

| Dashboard Section | User Intent | Operational Purpose | Existing Backend Support | Existing Workflow Support | Existing API Support | Missing Logic / Gaps | Missing Persistence | Missing Governance | Future Direction | Current State |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Sidebar / Navigation Domains | Move between operational areas | Stable command-centre navigation across Dashboard, Register Song, Catalogue, Submissions/Lifecycle, Evidence, Files/Projects, Royalties later | Root `app/` exists; isolated workflow routes exist; broad API surface exists | Active route: `app/registration-workflow-test/page.tsx`; TEST shell: `app/codex-ui-test/page.tsx` | Route-level support only; no unified dashboard nav contract | No canonical nav state; undeveloped modules may appear misleading if enabled | No persisted user/workspace navigation preferences | Need rule for disabled/future modules | Sidebar should expose only operational or clearly deferred modules | Partial |
| Operational Overview Cards | See what needs attention quickly | Summarize active works, blockers, readiness, queue, lifecycle | Some data exists in `musical_works`, `work_contributors`, `SubmissionQueue`, `SubmissionQueueEvent` | TEST workflow surfaces show one-work state | `GET /api/test/get-work`, readiness, pending, lifecycle APIs | No aggregate dashboard summary API; no journey summary | No registration journey summary persistence | Need no-fake-metrics enforcement | Build real dashboard summary from backend read models | Partial |
| Quick Actions | Start/continue operational work | Launch safe governed actions | Create song API, readiness API, queue API, lifecycle API | Register workflow route supports original composition path | `POST /api/songs/create`, `GET /api/submissions/readiness`, `POST /api/submissions/create-from-work`, `GET /api/submissions/lifecycle` | No app-level quick-action resolver; no role/permission rules | No persisted task/action queue | Need action availability governance | Quick actions should be generated from backend state and capability readiness | Partial |
| Register New Song / Embedded Intake | Start a new work registration | Create original composition and contributor split foundation | RPC creates `assets`, `musical_works`, `contributors`, `work_contributors` | `app/registration-workflow-test/page.tsx` supports original composition only | `POST /api/songs/create` | No backend draft update; no multi-stage journey persistence | No registration journey/draft table | Need draft lifecycle governance | Add governed registration journey/draft model later | Partial |
| Active Workflows / Active Registrations | Continue in-progress registrations | Keep operational work visible | `musical_works` and queue tables exist | TEST workflow can continue only in current local/session context | `GET /api/test/get-work` lists recent works | No active-registration query; no stage summary | No persisted journey stage state | Need resume rules based on backend truth | Dashboard should show active registration summaries | Conceptual / Partial |
| Incomplete Drafts | Resume unfinished work | Prevent incomplete work from disappearing | Backend work exists only after create; local recovery draft exists in route | Local recovery draft in workflow page | None for backend drafts | Local-only drafts do not travel across devices; no backend draft update | No backend draft persistence | Need local vs persisted governance | Add backend draft persistence and resume API | Conceptual |
| Blocked Items | Fix songs that cannot progress | Surface hard blockers and next safe action | Readiness returns issues; evidence readiness can fail closed | Workflow displays readiness issues and evidence diagnostics in TEST shell | `GET /api/submissions/readiness`, `GET /api/evidence-readiness` | No unified blocker model; no dashboard blocker list | No blocker history/event persistence for journey blockers | Need blocker severity/source rules | Create blocker/readiness summary read model | Partial |
| Readiness Summaries | Know if a work can submit | Show ready/not ready and why | Readiness service checks `musical_works` + `work_contributors`; evidence readiness evaluator exists | Workflow route and TEST shell display readiness | `GET /api/submissions/readiness?work_id=...`, `GET /api/evidence-readiness?work_id=...` | Evidence persistence may be unavailable; no combined readiness summary | No materialized readiness history | Need policy versioning and source tracing | Combine submission/evidence readiness into dashboard summary | Partial |
| Waiting On Contributors / Evidence | Understand external dependencies | Show signatures, contributor confirmation, missing evidence | Contributor `confirmed` field exists in `work_contributors`; evidence models/contracts exist | Contributor confirmation not active; evidence visibility is read-only TEST | Evidence readiness API only; no contributor wait API | No collaborator request/response flow; evidence upload/link deferred | No collaborator event state; evidence DB alignment risk | Need human/collaborator authority rules | Add waiting-state and evidence requirement summaries | Conceptual / Deferred |
| Ready To Submit | Identify works eligible for queue | Let user create queue only when backend readiness allows | Queue route now validates work exists and readiness true | Registration workflow can create queue after readiness | `POST /api/submissions/create-from-work` | Single target/export hardcoded to SAMRO/CWR; no target chooser | No submission intent persistence separate from queue | Need submission intent governance | Add target-specific submission intent model later | Working for TEST slice / Partial |
| Submitted / Lifecycle Tracking | Track queue and submission status | Show real backend submission/lifecycle state | `SubmissionQueue`, `SubmissionQueueEvent` exist | TEST shell and workflow show lifecycle data | `GET /api/submissions/lifecycle?work_id=...`, `GET /api/submissions/pending` | Events may be empty for queued items; processing visibility partial | Lifecycle events exist but not complete across all actions | Need event emission rules for all state changes | Expand lifecycle event coverage and dashboard lifecycle feed | Partial |
| Recent Activity | See recent operational movement | Show real events and actions | Build log/doc history exists; queue events exist; audit patterns exist in registration modules | TEST lifecycle events display if present | Lifecycle API returns events; no app-wide activity feed | No unified operational activity feed | No app-wide event store for all workflow actions | Need audit vs telemetry classification | Create operational activity feed from backend events | Conceptual / Partial |
| File / Evidence Areas | Manage supporting files and proof | Link evidence/files to rights workflow | Evidence contracts/models exist; file/project APIs exist elsewhere | Evidence pack visibility is read-only and fail-closed | `GET /api/evidence-readiness`; other file APIs not governed for this flow | Evidence upload/link not active; evidence persistence alignment risk | `RegistrationEvidence` may not be aligned in DEV/TEST DB | Need evidence authority, review, expiry governance | Govern Evidence Pack workflow before UI upload actions | Deferred / Partial |
| Catalogue / Recent Songs | Browse works and return to tasks | Show works with operational status and next action | `musical_works` exists; `GET /api/test/get-work` lists recent works | TEST shell loads recent works | `GET /api/test/get-work` | No catalogue status summary; no readiness/lifecycle joins | No read model for catalogue operational state | Need catalogue item state rules | Build catalogue read model with work, readiness, blocker, lifecycle state | Partial |
| Projects / Sessions / Production | Organize music work context | Connect songs/files/activities into operational projects | Project/task APIs appear in repo; not tied to registration workflow | Not governed in current registration slice | Existing project APIs may exist but are outside current slice | No proven relationship to rights workflow | Unknown active persistence alignment for production modules | Need project-to-rights governance | Treat as future workspace context layer | Conceptual |
| Artists / Contributors | Manage people and rights participants | Govern contributor identity, roles, affiliations, splits | `contributors`, `work_contributors`; legacy contributor models exist | Contributor entry in registration workflow | Create-song RPC resolves/creates contributors | No contributor profile management; no IPI/society workflow | No canonical contributor identity consolidation | Need identity governance | Identifier Governance / contributor authority slice | Partial |
| Royalties / Statements / Payouts | Track value flow later | Connect rights readiness to money movement | Finance/royalty-related APIs/docs exist, but not governed in current music workflow | Not active in registration slice | Finance APIs exist but not aligned to music-rights lifecycle here | No current royalty/reconciliation integration for works | Missing royalty statement ingestion/read models for this product flow | Need payout/value-flow governance | Future royalty/reconciliation vertical slices | Deferred |
| Calendar / Tasks / Reminders | Know deadlines and operational follow-up | Surface due dates, corrections, review tasks | Some task/project APIs may exist | Not active in current registration workflow | Not used by current workflow | No registration task generation | No task persistence tied to blockers/lifecycle | Need remediation/task governance | Add operational tasks after blocker/remediation model | Conceptual |
| AI Helper / Guidance | Reduce user overwhelm | Explain current screen, blockers, and next safe action | Docs define future helper rules | No implementation | None | No grounded assistant context API | No assistant trace/governance | Must never invent backend truth | Future grounded helper over backend state/docs | Deferred |

## 4. Implemented Capability Inventory

Current implemented or partially implemented capabilities that dashboard work may safely reference:

- static/light customer-facing dashboard shell: `app/dashboard/page.tsx`
- root handoff: `app/page.tsx` redirects to `/dashboard`
- preserved internal TEST Control Panel: `app/test-control-panel/page.tsx`
- Workspace Setup V1 page: `app/dashboard/setup/page.tsx`
- Workspace Setup V1 API: `app/api/workspace-setup/route.ts`
- `POST /api/songs/create`
- `GET /api/test/get-work`
- `GET /api/submissions/readiness?work_id=...`
- `POST /api/submissions/create-from-work`
- `GET /api/submissions/pending`
- `GET /api/submissions/lifecycle?work_id=...`
- `GET /api/evidence-readiness?work_id=...`
- isolated TEST route: `app/registration-workflow-test/page.tsx`
- isolated TEST shell: `app/codex-ui-test/page.tsx`

Safe dashboard references must remain truthful about current limitations.

The current `/dashboard` implementation is a static product shell. It may show future ecosystem modules with `Planned`, `Future`, or `Coming Soon` badges, but it must not be treated as production dashboard data integration.

The dashboard Setup sidebar item, setup checklist action, and Complete Setup quick action link to `/dashboard/setup`. Workspace Setup V1 is a customer-facing operational identity setup flow backed by existing workspace settings persistence. It is not compliance/KYC, billing, production RBAC, or production entitlement activation.

## 5. Major Gaps Before A Real Dashboard

### Missing Dashboard Summary API

No canonical dashboard command-centre API exists yet.

Needed later:

- active registrations
- incomplete drafts
- blocked works
- waiting states
- ready-to-submit works
- lifecycle items
- recent activity

### Missing Registration Journey Persistence

Current workflow has local recovery draft before backend creation.

No backend journey/draft model exists yet.

### Missing Unified Blocker Model

Readiness and evidence blockers exist in separate forms.

No unified blocker summary exists for dashboard display.

### Missing Activity Feed

Lifecycle events exist for submission queue events, but there is no app-wide operational activity feed.

### Missing Evidence Upload / Link Workflow

Evidence readiness exists as read-only/fail-closed visibility.

Evidence upload/link/review is deferred.

### Missing Contributor Authority / Identifier Governance

Contributor rows can be created through the create-song RPC, but full contributor identity, IPI, society affiliation, confirmation, and authority governance are not complete.

### Missing Royalty / Reconciliation Integration

Royalty and reconciliation dashboard areas must remain deferred until backend contracts and workflow slices exist.

## 6. Dashboard Build Order Recommendation

Recommended governed order:

1. Dashboard read-only summary contract
2. Registration journey summary read model
3. Active/incomplete/blocked/ready/lifecycle groupings
4. Operational recent activity feed
5. Safe quick actions wired to existing workflows
6. Evidence read-only summary integration
7. Contributor/waiting-state summary
8. Catalogue operational status view
9. Deferred finance/royalty panels only after value-flow contracts exist

## 7. Governance Rules For Dashboard Implementation

Dashboard implementation must obey:

- no fake metrics
- no decorative operational stats without backend truth
- no active actions for unavailable capabilities
- no active actions for unavailable plan entitlements
- no hidden blockers
- no invented lifecycle states
- no direct DB calls from UI
- no local-only state presented as persisted
- no submission action unless backend readiness allows it
- no evidence upload actions until governed
- no royalty/reconciliation display until backend contracts exist

## 8. Source Of Truth

This document is the canonical operational dashboard-to-backend alignment reference.

Future dashboard, workflow, and backend implementation must consult this matrix before adding dashboard features.

Related docs:

- `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`
- `docs/platform/PLATFORM-FOUNDATION-V1-MINIMUM-REQUIREMENTS.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`
- `docs/platform/PLATFORM-ECOSYSTEM-DOMAIN-ARCHITECTURE.md`
- `docs/platform/APP-LEVEL-USER-JOURNEY-FLOW.md`
- `docs/platform/SENTRY-SOUND-PLATFORM-SERVICE-OFFERING.md`
- `docs/platform/OPERATIONAL-UX-GOVERNANCE.md`
- `docs/platform/APP-USER-EXPERIENCE-FLOW-FRAMEWORK.md`
- `docs/platform/APP-BUILD-EXECUTION-FRAMEWORK.md`
