# Song Capture V2 Architecture Alignment Review

Date: 2026-05-28

Mode: Architecture alignment review only. No runtime implementation in this review document.

## 1. Existing Structures Already Aligned

The Song Capture V2 workflow direction already aligns naturally with several Sentry Sound structures:

- Works/Songs area under `/dashboard/works`.
- Existing Add Song flow at `/dashboard/works/new`.
- Existing Song Detail page at `/dashboard/works/details/[workId]`.
- `musical_works` as the canonical song/work anchor.
- Contributor and split capture already represented in song creation/detail workflows.
- Work Supporting Materials attached through the existing work files path.
- File Vault tables and metadata JSON for file/reference records.
- Work Completeness/readiness display logic for contextual review.
- Creative details / Song Profile fields on the Work Detail page.
- Hosted public pages and public-safe concepts as future-facing direction only.

The prototype does not replace these structures. It visualizes how they could be sequenced into a more natural song creation workflow.

## 2. Workflow Stages Already Supported

Song Details:

- Current support exists through Add Song and Song Detail profile fields.
- Likely backed by `musical_works`, work profile APIs, and creative details metadata.

Contributors:

- Current support exists for contributors, roles, splits, and split totals.
- Existing contributor and work contributor services/contracts can support this area.

Files & Assets as references:

- Current support exists for metadata-only supporting material references.
- Existing `GET/POST /api/works/[workId]/files` and Work Supporting Materials service can support basic linked material records.

Review/context visibility:

- Current support exists through Work Completeness and Song Detail progress/context panels.
- This can inform the Workflow Preview concept later.

Song Summary:

- Existing work/song read models can provide title, artist context, status, and created/saved timestamps later.

## 3. Workflow Stages Currently Mock / Prototype Only

The prototype-only areas are:

- Full staged Create New Song wizard.
- Sidebar shell and storage/plan cards inside the prototype page.
- File drag/drop upload surface.
- File/asset category selection buttons.
- Right-side Workflow Preview timeline.
- Right-side What's Next guidance.
- Help Center / tutorial actions.
- Save Draft / Next wizard behavior.
- Final review/save stage.
- Any real storage usage display.

These are frontend-only visual concepts in the prototype.

## 4. Existing Tables / Contracts / Routes Likely Reusable

Song Details:

- `musical_works`
- `/api/works`
- `/api/works/[workId]`
- `/api/works/[workId]/profile`
- existing Add Song orchestration contracts and services

Contributors:

- contributor repository/service contracts
- work contributor linkage contracts
- contributor split validation utilities
- existing create-song contributor orchestration

Files & Assets:

- `file_vault_items`
- `file_vault_links`
- `file_vault_versions`
- `file_vault_audit_events`
- Work Supporting Materials service/repository/types
- `GET/POST /api/works/[workId]/files`

Readiness / Review:

- Work Completeness repository/service
- `/api/works/[workId]/completeness`
- future evidence readiness concepts

Evidence / Registration Later:

- Evidence Vault / RegistrationEvidence concepts
- submission readiness services
- registration/release workflow contracts where already present

Public / Showcase Later:

- Hosted Public Music Pages documentation and future public-safe boundary
- public-safe metadata posture from Asset Intelligence V1 contract

## 5. Missing Operational Pieces

Important gaps remain:

- real upload/storage engine
- file binary handling
- final audio asset lifecycle
- MP3 metadata extraction
- embedded artwork extraction
- staged wizard persistence
- draft/resume behavior for the V2 workflow
- review/save workflow orchestration
- approval/review status transitions
- public-safe approval process
- evidence promotion and evidence review
- release package automation
- registration pipeline automation
- storage usage calculation
- help/tutorial content routing

These gaps should be identified through UX review, not solved inside the prototype.

## 6. Safe Future Implementation Direction

The safest future path is incremental:

1. Validate the Song Capture V2 workflow visually and with user feedback.
2. Decide which stage should become the first real runtime slice.
3. Reuse existing Add Song and Song Detail contracts where possible.
4. Keep files/assets workflow-native rather than exposing File Vault internals.
5. Keep Supporting Materials as the structured/admin view behind the workflow.
6. Add storage/upload only after the final audio/files boundary is clear.
7. Add metadata extraction only after upload/storage has a stable contract.
8. Add evidence/review/public-safe logic only after the basic workflow is proven.

## 7. What Should NOT Be Implemented Yet

Do not implement yet:

- schema expansion
- storage provider integration
- drag/drop upload runtime
- MP3 parsing
- metadata extraction service
- AI assistant
- evidence approval workflow
- release/registration automation
- public publishing
- real storage quota logic
- full workflow orchestration engine
- File Vault admin redesign

The prototype should remain a visual/workflow validation surface.

## 8. Recommended Next Implementation Priorities After UX Review

After UX review, the recommended priorities are:

1. Decide whether Song Capture V2 should replace or complement the current Add Song flow later.
2. Create a bounded Create Song Workflow V1 implementation plan.
3. Select one runtime slice, likely Song Details + Contributors using existing backend support.
4. Keep Files & Assets visual-only until storage/upload direction is ready.
5. Plan a separate final audio upload/storage contract before MP3 metadata extraction.
6. Keep evidence, public-safe approval, and release/registration automation deferred.
