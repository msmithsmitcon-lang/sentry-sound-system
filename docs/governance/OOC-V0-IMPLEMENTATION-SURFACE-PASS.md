# OOC V0 Implementation Surface Pass

Date: 2026-05-25

Status: Implementation surface defined. Runtime implementation remains paused pending Markus review.

## 1. Executive Summary

OOC V0 is ready for bounded implementation planning, not broad implementation.

This pass defines the narrowest safe runtime surface for Sentry Sound Outcome Coordination V0. It translates the approved OOC V0 design into a practical implementation boundary: where it may appear, which existing data it may read, what it must not write, and which operational meanings must remain outside scope.

No orchestration, automation, AI coordination, dependency graph, predictive scoring, readiness certification, or workflow enforcement is permitted in OOC V0.

The implementation surface should remain read-only, context-oriented, human-guided, and module-integrity preserving. OOC V0 coordinates visibility around existing operational entities. It does not execute work, decide readiness, mutate source modules, or replace module-local authority.

## 2. Recommended First Runtime Surface

The safest first runtime surface is the existing Work/Song detail page:

- `app/dashboard/works/details/[workId]/page.tsx`

The recommended first visible OOC V0 surface is a read-only `Outcome Context` panel on that page.

Why this is safest:

- The Work/Song detail page already acts as a focused operational context surface for one canonical runtime entity.
- It already reads work detail, contributors/splits, supporting materials, and operational completeness context.
- It avoids introducing platform-wide coordination before the local pattern is proven.
- It preserves module integrity because Works remains the anchor, while related modules only contribute visible context.
- It avoids creating an orchestration hub, command queue, dependency graph, dashboard-wide prioritization model, or AI coordinator.
- It lets OOC V0 start as contextual interpretation around a known object rather than as a new operational authority.

Dashboard-level visibility may be considered later, but it should not be the first implementation surface. Starting at dashboard scope would create pressure to summarize, rank, prioritize, and coordinate across modules too early.

## 3. Existing Data Sources Allowed

Only existing sources should be read. No new schema, API, route, write path, or runtime authority should be created for the first slice.

| Source | Existing file/API | May contribute | Safe for V0? | Notes |
| --- | --- | --- | --- | --- |
| Work detail | `GET /api/works/[workId]`; `app/api/works/[workId]/route.ts`; `src/lib/works/get-work-detail-read-model.ts`; `src/lib/works/work-detail-read-repository.ts` | Work title, asset id, genre, mood, themes, copyright status, registration status, contributor count, split total, work intelligence metadata if already present | Yes | Primary OOC anchor. Read-only detail model already exists. |
| Contributors and splits | Returned through `getWorkDetailReadModel`; repository reads `work_contributors` and `contributors` | Contributor names, roles, ownership splits, confirmation visibility | Yes | Context only. OOC must not validate legal accuracy or resolve splits. |
| Supporting materials | `GET /api/works/[workId]/files`; `app/api/works/[workId]/files/route.ts`; `src/lib/work-files/work-supporting-materials-service.ts`; `src/lib/work-files/work-supporting-materials-repository.ts` | Linked material presence, material categories, filenames, uploaded timestamps | Yes, read-only only | Existing disclaimer says materials are reference only and not verified. OOC should inherit that posture. |
| Operational completeness | `GET /api/works/[workId]/completeness`; `app/api/works/[workId]/completeness/route.ts`; `src/lib/work-readiness/get-work-completeness.ts`; `src/lib/work-readiness/work-completeness-repository.ts` | Contextual completeness, missing items, review notes, category status | Yes | May be surfaced as context, not approval or certification. |
| Existing page state | `app/dashboard/works/details/[workId]/page.tsx` | Existing `work`, `supportingMaterials`, and `completeness` state already loaded by the page | Yes | Preferred first slice should use existing page state and avoid new fetches. |
| Calendar/actions | `GET /api/calendar/items`; `app/api/calendar/items/route.ts`; `src/lib/calendar/workspace-calendar-repository.ts` | Possible linked action references if safely filtered by related entity | Deferred | Route is workspace-level and also supports writes. Do not include in first slice unless a later review confirms safe entity filtering and read-only access. |
| Finance commitments | `GET /api/finance/v1/commitments`; `GET /api/finance/v1/commitments/weighting`; `src/lib/finance-v1/workspace-finance-repository.ts` | Possible commitment awareness if explicitly linked to the work | Deferred | Existing write paths and semantic weighting exist. Do not include in first slice. Finance must remain module-local. |

## 4. Data Sources Excluded For V0

The following sources and concepts should not be included in the first OOC V0 implementation surface:

- AI recommendations, AIL outputs, AI advisory logic, or generated operational decisions.
- Predictive scoring, priority scores, ranking engines, readiness scores, or hidden prioritization.
- Dependency graphs, execution graphs, prerequisite engines, or inferred blocker graphs.
- Cross-system orchestration, Plexicon runtime calls, or external doctrine lookups at runtime.
- MWIS strategic archetype logic unless explicitly localized in a later approved pass.
- Campaign or release orchestration engines not already stabilized as local Sentry Sound runtime surfaces.
- Evidence readiness scoring from `app/api/evidence-readiness/route.ts` because the related readiness logic is marked `TEST_INTERNAL_ADMIN_ONLY`.
- Submission queues, distributor submission status changes, registration status mutations, or worker execution.
- Finance forecasting, cash flow interpretation, ROI logic, or commitment weighting as first-slice OOC behavior.
- External legal, regulatory, rights, distributor, PRO, or clearance data unless already represented as local read-only context.

## 5. Read-Only / No-Authority Guarantees

OOC V0 must guarantee:

- It must not mutate source module state.
- It must not create, edit, delete, submit, approve, reject, resolve, or assign records.
- It must not create supporting materials, update work profiles, alter contributors, edit splits, create calendar actions, or create finance commitments.
- It must not approve readiness or certify release, submission, evidence, legal, financial, or operational truth.
- It must not change registration status, submission status, copyright status, lifecycle state, or queue state.
- It must not create workflow obligations or forced gates.
- It must not rank hidden priorities or calculate predictive scores.
- It must not issue AI decisions or recommendations.
- It must not override module-local truth.
- It must not write to the database.

Any future expansion beyond these guarantees requires a separate reviewed pass.

## 6. Derived State Surface

OOC V0 may display derived or contextual state only when it can be produced from existing read models.

Safe contextual states include:

- Intended outcome label, such as `Prepare this work for review`.
- Related operational context visible for the current work.
- Contextual sufficiency, expressed as visible context rather than certification.
- Visible work basics, such as title, asset id, genre, mood, themes, and current registration/copyright labels.
- Contributor and split visibility.
- Supporting material presence or absence.
- Split-sheet reference presence if already represented through supporting materials.
- Missing context from existing operational completeness `missing_items`.
- Review attention from existing operational completeness `review_notes`.
- Category-level completeness status when phrased as contextual review state.
- Fallback states when context is unavailable.

These states are interpreted, contextual, derived, and informational.

They are not:

- certifications
- approvals
- legal truth
- evidence verification
- readiness authority
- workflow gates
- orchestration instructions
- automation triggers

## 7. UX Surface Boundary

The exact suggested UI pattern is one read-only panel/card on the existing Work/Song detail page.

Recommended label:

- `Outcome Context`

Safe supporting language:

- `Related operational context`
- `Visible context`
- `May need review`
- `Missing context`
- `No linked actions found`
- `No supporting materials linked`
- `Read-only context`
- `Human review`
- `Context unavailable`
- `Reference only`

Safe tone:

- calm
- factual
- low-pressure
- operationally specific
- non-coercive
- clear about uncertainty
- clear about read-only status

Language to avoid:

- `Approved`
- `Certified`
- `Ready for release`
- `Ready for submission`
- `AI recommends`
- `Must complete`
- `Blocked by system`
- `Priority score`
- `Autopilot`
- `Submit now`
- `Fix automatically`
- `Resolve`
- `Compliance passed`

The surface should reduce operational fragmentation. It should not pressure users into rigid flows, imply hidden authority, or turn context into a checklist that captures the module.

## 8. Module Integrity Check

The first OOC V0 implementation surface preserves Independent Module Integrity if it follows these constraints:

- Works remains useful without OOC.
- Contributors and splits remain governed by the work/contributor module, not OOC.
- Supporting Materials remains useful as a reference-material surface without OOC verifying materials.
- Operational Completeness remains the source of completeness context; OOC only displays selected context.
- Calendar/Actions remains useful alone and should not be pulled into first-slice OOC unless later reviewed.
- Finance remains useful alone and should not be pulled into first-slice OOC unless later reviewed.
- Evidence remains useful alone and must not be converted into OOC readiness certification.

OOC V0 should coordinate visibility only. It should never make another module dependent on OOC for its basic usefulness.

## 9. Plexicon Alignment Check

This pass does not modify Plexicon.

OOC V0 implementation should not require a Plexicon runtime dependency. Plexicon remains the reusable semantic, governance, and intelligence authority. Sentry Sound remains the runtime/domain deployment authority.

Implementation should respect the previously inspected doctrine and candidate intelligence, especially:

- read-mostly operational state composition
- contextual sufficiency as weaker than readiness
- module-integrity preserving coordination
- human-guided operational continuity
- non-coercive SaaS behavior

Local discoveries may be logged as candidate intelligence later, but this implementation surface pass does not promote doctrine or universalize Sentry Sound-specific semantics.

No new candidate intelligence entry is required from this pass. The pass narrows an already identified pattern rather than discovering a materially new reusable primitive.

## 10. Implementation Readiness Checklist

Before any implementation prompt is executed, confirm:

- The first route/location is `app/dashboard/works/details/[workId]/page.tsx`.
- The first slice uses existing page state where possible.
- Existing data access is limited to work detail, supporting materials, and operational completeness.
- No new schema is required.
- No new API route is required.
- No mutation path is introduced.
- No AI, dependency graph, automation, prediction, scoring, or orchestration behavior is included.
- Calendar/action and finance/commitment context remain deferred unless separately reviewed.
- Evidence readiness scoring remains excluded.
- Fallback states are defined for missing work data, missing materials, and unavailable completeness context.
- UX language avoids certification, approval, automation, and coercive wording.
- Documentation and build log remain updated.
- Preview/test behavior verifies that the panel renders without creating writes or new fetch requirements.

## 11. Minimal Implementation Slice Recommendation

The smallest safe next implementation slice is:

- Add one read-only `Outcome Context` panel on the existing Work/Song detail page.
- Use only existing page state: `work`, `supportingMaterials`, and `completeness`.
- Display an intended outcome label, such as `Prepare this work for review`.
- Display visible context from work basics, contributors/splits, supporting materials, and completeness notes.
- Display fallback text when context is missing.
- Include a clear read-only note, such as: `This is read-only operational context. It does not approve readiness or verify evidence.`
- Do not add writes, tables, routes, APIs, AI, automation, dependency graphs, hidden scoring, or new runtime authority.

This slice is intentionally small. It should prove that OOC can make context more legible without becoming an execution layer.

## 12. Risks / Drift Warnings

Key risks:

- Adding write actions to the first OOC surface.
- Turning the panel into a workflow engine.
- Introducing AI recommendations before OOC has stable local semantics.
- Creating new tables prematurely.
- Importing MWIS doctrine as product logic.
- Treating derived state as approval.
- Treating completeness as legal, evidence, release, or submission certification.
- Bypassing module-local authority.
- Making other modules dependent on OOC for usefulness.
- Pulling finance, calendar, evidence readiness, and campaign logic into the first implementation slice.
- Creating dependency graphs or inferred blockers before Sentry Sound has explicit governance for them.
- Overloading the first implementation with dashboard scope or platform-wide orchestration.

## 13. Recommended Next Codex Prompt

After Markus review, use a prompt like:

> Implement the minimal OOC V0 runtime slice only. Add one read-only `Outcome Context` panel to `app/dashboard/works/details/[workId]/page.tsx` using only existing page state already loaded by the page: work detail, supporting materials, and operational completeness. Do not create schemas, APIs, routes, UI components outside this page, writes, automation, AI systems, dependency graphs, scoring, or orchestration behavior. Use safe contextual labels only, include a read-only/no-certification note, and run focused verification.
