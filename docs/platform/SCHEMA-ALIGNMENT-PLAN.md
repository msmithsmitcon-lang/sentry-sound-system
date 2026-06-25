# Schema Alignment Plan

## Purpose

This is the no-code phased plan for aligning Sentry Sound Platform around one canonical operational model.

This document does not authorize schema migrations, destructive changes, official identifier tables, ISWC/ISRC generation, or production submission automation.

## Phase 0 - Current State Lock

- Preserve current Works/Songs UX.
- Preserve current `/dashboard/works/*` pages.
- Preserve current `/api/songs/create` behavior.
- Treat lowercase operational tables as the active canonical seed:
  - `musical_works`
  - `assets`
  - `contributors`
  - `work_contributors`
- Identify `/api/test/get-work` and `/api/test/works/[workId]/intelligence` as temporary TEST read/write support.
- Mark Prisma `MusicalWork` as legacy/parallel pending alignment.

## Phase 1 - Canonical Docs And Ownership

- Maintain `CANONICAL-OPERATIONAL-MODEL-DECISION.md`.
- Maintain `CANONICAL-ENTITY-MAP.md`.
- Maintain `ROUTE-API-OWNERSHIP-PLAN.md`.
- Add source-of-truth declarations to roadmap, field intelligence, persistence direction, and build log.
- Require every backend change to declare canonical data owner.

## Phase 2 - Workspace-Scoped Read/Write APIs

- Replace `/api/test/get-work` with a canonical workspace-scoped `/api/works` read model.
- Preserve current dashboard UX while changing only the backing API.
- Add workspace scoping to create/read/update operations.
- Keep UI thin and backend-owned.
- Do not add official identifiers in this phase.

Phase 2 start status:

- `GET /api/works` exists as a read-only canonical summary endpoint.
- `/dashboard/works` and `/dashboard/works/list` now use `/api/works`.
- `/dashboard/works/new` duplicate-awareness now uses `/api/works`.
- `/dashboard/works/new` create/save behavior still uses `/api/songs/create`.
- `GET /api/works/[workId]` exists as a read-only canonical detail endpoint for one work.
- `/dashboard/works/details/[workId]` now uses `/api/works/[workId]` for its detail read.
- `PATCH /api/works/[workId]/profile` exists as a canonical Song Profile creative-truth update endpoint.
- `/dashboard/works/details/[workId]` now uses `/api/works/[workId]/profile` for its profile save.
- `/api/test/works/[workId]/intelligence` is deprecated for dashboard use and remains temporarily available for TEST/control/backward compatibility.
- Workspace scoping and audit history for canonical profile updates are planned in `WORK-PROFILE-SCOPING-AUDIT-PLAN.md`.
- Workspace ownership alignment has now been implemented for the active Works/Songs seed tables.
- `assets`, `musical_works`, `contributors`, and `work_contributors` now require `workspace_id` and support `created_by_user_id`.
- `/api/songs/create` injects ownership server-side from the authenticated workspace context.
- Canonical works summary, detail, and profile update routes now scope by authenticated workspace.
- The canonical work detail read model now includes read-only contributor/split rows from `work_contributors` joined to `contributors`.
- Song Profile displays contributor/split visibility, split total, and confirmation state from canonical workspace-scoped data.
- Contributor/split editing, approval workflow, royalty logic, payout logic, publishing administration, ISWC/ISRC management, and master/neighbouring rights split support remain out of scope.
- `GET /api/works/[workId]/files` and `POST /api/works/[workId]/files` now provide a canonical workspace-scoped supporting-material reference route for Song Profile.
- Work supporting materials use existing `file_vault_items`, `file_vault_links`, and `file_vault_audit_events` as metadata-only references.
- This does not implement real file upload, storage sync, OCR, evidence verification, legal clearance, readiness scoring, submission automation, or document intelligence.
- `GET /api/works/[workId]/completeness` now provides a canonical workspace-scoped read-only operational completeness route for Song Profile.
- Work completeness computes from current canonical records only: work basics, contributors/splits, Song Profile creative truth, and supporting material references.
- This route does not create schema, persist readiness results, calculate scores, activate `RegistrationEvidence`, change submission gates, or claim legal/regulator/royalty readiness.

## Phase A - Controlled Operational TEST Reset Planning

Current Works/Songs TEST data is structurally pre-canonical and may be reset later after explicit approval.

Planning status:

- `CONTROLLED-TEST-DATA-RESET-STRATEGY.md` defines the preserve list, reset candidates, dependency-order strategy, backup checklist, reseed strategy, and reset phases.
- This is planning only.
- No deletion, truncation, migration, workspace enforcement, identifier implementation, or production cleanup is authorized by the reset strategy.
- Workspace/auth/RBAC foundations, migration tracking, audit foundations, and finance/config/reference tables must be preserved unless separately reviewed.
- Operational TEST records such as unowned works, assets, work contributors, disposable contributors, old Prisma registration rows, and old TEST submission/evidence/escalation rows may be reset later only after backup and exact SQL review.

## Phase 3 - Recording/Master Boundary

- Add or align canonical `recordings`.
- Link recordings to `musical_works` without merging them.
- Keep ISRC at recording/master level.
- Add/align `recording_contributors` for recording participants and master-side roles.
- Preserve composition splits in `work_contributors`.

## Phase 4 - External Identifiers

- Add canonical `external_identifiers` only after canonical entity ownership is confirmed.
- Support work-level identifiers and references:
  - ISWC
  - SAMRO work/reference number
  - CAPASSO work/reference number
  - publisher/admin registration references
- Support recording-level identifiers and references:
  - ISRC
  - distributor track/master references
- Store identifier source, body, status, returned/assigned dates, audit metadata, and linked submission/dispatch evidence.
- Do not generate official identifiers without authority or integration.

## Phase 5 - Submission Return Mapping

- Map industry-body returns to canonical records.
- Use canonical internal IDs as the primary mapping anchor.
- Link returns to submission queue item, export/snapshot, dispatch attempt, body, returned reference, returned status, received date, and raw response.
- Store returned official identifiers in `external_identifiers` when applicable.
- Preserve audit history and override history.

## Phase 6 - AI/System Insights And Actions

- Store generated insights separately from user-entered creative truth.
- Keep `creative_truth` as user-authored factual/creative context.
- Add action recommendations only after canonical work/profile/readiness data is stable.
- Support future service/upsell workflows from generated recommendations without turning AI output into user-entered truth.

Workflow/task and calendar layer status:

- `workspace_calendar_items` now provides an active canonical V1 workspace-owned workflow/action surface with calendar as one date-based view.
- V1 workflow fields include assignment, action status, required-by date, workflow type, priority, approval requirement, and completion timestamp.
- The workflow layer is universal across workspace setup, works, approvals, submissions, releases, finance, CRM, evidence, readiness, academy, and manual tasks.
- Future modules should create or link workflow items instead of inventing isolated reminder tables.
- Future AI/system recommendations may suggest workflow actions, but user approval/review rules still apply; generated recommendations must not silently become user-entered truth or completed actions.
- External Google/Microsoft calendar sync, complex recurrence, and AI-generated calendar actions remain deferred.

Finance/accounting V1 status:

- `workspace_finance_*` tables now provide an active canonical V1 workspace-owned finance/accounting layer.
- V1 supports basic accounts, income/expense transactions, payables, receivables, summary cards, recent transactions, and report placeholders.
- Older unscoped `finance_*` tables remain ERP/reference infrastructure until explicitly aligned to workspace ownership and active product routes.
- Royalties remain separate from accounting. Future royalty flow should be: royalty event -> royalty calculation -> contributor payable -> approved finance posting -> payment/reconciliation -> reports.
- No bank integrations, tax automation, production payouts, payroll, or royalty-to-finance automation are active in V1.

Future Finance V2 operational value tracking direction:

- Finance records must eventually connect expenses and income to the operational reason, asset, workflow, deliverable, and value outcome.
- Future concepts include needs/business cases, analysis, solution options, budgets, allocations, action/deliverables, linked work/song, linked artist, linked recording/session, linked project/release, payment/expense, result, and ROI/value result.
- A studio fee should eventually be traceable to the recording need, artist, song/work, session, contributors/producers/lyricists, deliverable, budget allocation, and commercial/release outcome.
- V2 should connect finance with workflow/actions and reports without turning finance into the royalty calculation engine.
- The canonical V2 field model is defined in `FINANCE-V2-FIELD-MODEL.md`.
- Finance V2 Phase 1 should start with actuals and commitments before forecasts.
- Phase 1 should focus on money in, money out, outstanding commitments, contributor liabilities, compliance reminders, reserve awareness, and simple operational financial education.
- `workspace_finance_commitments` is the first practical Phase 1 implementation slice for obligations/responsibilities before or alongside payment.
- Commitments classify across universal finance category, industry, industry body/external body, and commitment type to preserve reusable finance logic plus industry-specific intelligence.
- Commitments now use a structured framework: commitment domain, domain-valid commitment type, commitment nature, and commitment risk level.
- Nature distinguishes mandatory, operational, strategic, and optional obligations.
- Risk level distinguishes low, medium, high, and critical obligation pressure.
- Backend validation must reject invalid domain/type pairings.
- Commitments support lightweight operational actions: mark paid, cancel, and review later.
- Due, overdue, and review-later commitments should surface into the shared Workspace Actions/Calendar layer as finance reminders through `source_module = finance` and `related_entity_type = finance_commitment`.
- Money has responsibility: income may create tax/compliance awareness, contributor obligations, planned expense needs, and release/project commitments.
- Compliance reminders are educational/operational guidance, not legal, accounting, or tax advice.
- Main transaction fields should stay limited to accounting/money basics, category, source, workspace, creator, status, notes, and canonical source links.
- Operational reason, business cases, budgets, allocations, deliverables, approvals, evidence, and ROI/value results should become linked child entities or workflow-derived state.
- System-generated or workflow-derived fields such as remaining budget, linked revenue, lock status, approval status, verification status, audit reference, and completion timestamp must not become ordinary editable form inputs.
- Later phases should proceed in order: budget planning/allocation, forecasting/projections, ROI/value intelligence, and AI financial coach/guided recommendations.
- Do not add budgets, forecasting, ROI, AI coach, tax automation, or royalty-to-finance automation until explicitly scoped.

## Guardrail

No new parallel work model may be introduced during alignment without explicit architecture approval.
