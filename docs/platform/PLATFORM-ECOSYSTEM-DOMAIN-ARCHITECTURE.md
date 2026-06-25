# Sentry Sound Platform - Platform Ecosystem Domain Architecture

## 1. Purpose

This document maps the major operational domains of Sentry Sound Platform and records what the current repository actually supports.

It is a system-alignment document, not an implementation plan.

It distinguishes:

- `[implemented]` working code/API/workflow support exists in the current repo
- `[partial]` some support exists, but it is incomplete, TEST-only, not integrated, or has persistence/alignment risk
- `[conceptual]` the domain is documented or implied, but not operational
- `[deferred]` the domain is intentionally not active yet
- `[recommendation]` aligned next development guidance

Do not use this document to claim that conceptual or deferred systems are live.

## 2. Inspection Sources

Inspection covered:

- `docs/platform/`
- `docs/build-log/BUILD-LOG.md`
- `app/api/`
- `app/registration-workflow-test/page.tsx`
- `src/lib/registration/`
- `src/lib/evidence-vault/`
- `src/lib/rights-lifecycle/`
- `src/lib/release*`
- `src/lib/distribution/`
- `src/lib/royalties/`
- `src/lib/finance/`
- `src/lib/crm/`
- `src/lib/calendar-tasks/`
- `src/lib/notifications/`
- `src/lib/operational-analytics/`
- `src/lib/authz/`, `src/lib/rbac/`, workspace context and invitation helpers
- `sql/platform/rpc_create_song_with_contributors.sql`
- `prisma/schema.prisma`

## 3. Current Foundational Vertical Slice

Platform Foundation sits below this ecosystem map and is documented separately in `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`.

Foundation answers who the actor is, which workspace/entity they operate under, which permissions apply, which legal/commercial terms govern the action, and how audit traceability is preserved.

Operational ownership, actor accountability, and music rights ownership are separate architecture layers documented in `docs/platform/OPERATIONAL-OWNERSHIP-VS-RIGHTS-OWNERSHIP.md`. A platform user or workspace owner must not be treated as an automatic copyright, publishing, master, or royalty owner.

Current strongest operational slice:

`capture -> contributors -> readiness -> queue -> lifecycle`

Current support:

- `[implemented]` `POST /api/songs/create` creates a work through `rpc_create_song_with_contributors`.
- `[implemented]` the RPC writes `assets`, `musical_works`, `contributors`, and `work_contributors`.
- `[implemented]` `GET /api/submissions/readiness?work_id=...` validates work existence, contributor presence, and split total.
- `[implemented]` `POST /api/submissions/create-from-work` validates work existence and readiness before queue creation.
- `[partial]` `GET /api/submissions/lifecycle?work_id=...` exposes `SubmissionQueue` and `SubmissionQueueEvent`.
- `[partial]` `GET /api/evidence-readiness?work_id=...` exposes read-only evidence readiness and fails closed if `RegistrationEvidence` persistence is unavailable.
- `[partial]` `app/registration-workflow-test/page.tsx` is the isolated TEST workflow for original composition registration.

This slice should remain the near-term build anchor.

## 4. Domain Architecture

### 1. Rights & Ownership Domain

**A. Domain purpose**

- `[implemented]` Capture original composition identity and contributor split information in the active TEST slice.
- `[conceptual]` Govern publishers, mandates, authority, ownership disputes, and chain-of-title over time.

**B. User problems solved**

- `[implemented]` A user can create an original composition with named contributors and composition split percentages.
- `[partial]` A user can see whether contributor split total supports readiness.
- `[conceptual]` A user should later know who controls rights, who must confirm, and what authority is missing.

**C. Core capabilities**

- `[implemented]` work capture, contributor capture, split-total validation.
- `[partial]` contributor confirmation fields exist in current persistence direction, but no active collaborator confirmation workflow is present.
- `[conceptual]` publisher share governance, IPI/society validation, mandate authority, dispute lifecycle, chain-of-title.

**D. Existing backend/code support**

- `[implemented]` `sql/platform/rpc_create_song_with_contributors.sql`.
- `[implemented]` `src/lib/registration/contracts/create-song-contract.ts`.
- `[implemented]` `src/lib/registration/services/create-song-with-contributors.ts`.
- `[implemented]` `src/lib/registration/submission-engine/readiness/get-submission-readiness.ts`.
- `[partial]` `src/lib/registration/contracts/musical-work-contract.ts`, contributor repositories, workflow/status contracts.
- `[partial]` `src/lib/rights-lifecycle/` contains rights asset and ownership claim helpers, but they are not integrated into the active registration workflow.

**E. Existing docs support**

- `[implemented]` service offering, dashboard matrix, app-level journey, operational UX governance, create-song stabilization docs.

**F. Existing UI/workflow support**

- `[partial]` `app/registration-workflow-test/page.tsx` supports original composition capture and contributor split visibility.

**G. Missing backend logic**

- `[partial]` no governed contributor update/edit after backend creation in the current route.
- `[conceptual]` no active contributor confirmation, IPI/society resolution, publisher administration, mandate validation, or chain-of-title resolution.

**H. Missing persistence/entities**

- `[partial]` active SQL tables cover works and contributors, while Prisma registration models differ from active SQL table shape.
- `[conceptual]` canonical rights ownership claims, mandates, publisher shares, society affiliations, and contributor authority records are not yet unified for the active slice.

**I. Missing governance rules**

- `[conceptual]` identity authority, contributor confirmation, publisher authority, mandate expiry, and split-change audit rules.
- `[conceptual]` explicit separation between platform users, workspace/account ownership, and rights entities/rightsholders.

**J. Missing dashboard/workflow entry points**

- `[partial]` workflow route exists; no production dashboard card/list for rights ownership status exists.

**K. Cross-domain dependencies**

- Registration & Compliance, Asset & Evidence, Legal & Dispute, Notification & Communication, Financial & Royalty.

**L. Recommended next aligned developments**

- `[recommendation]` Strengthen contributor identity and split-governance around the existing capture/readiness slice before broader rights features.

**M. Maturity status**

- `[partial]`

### 2. Registration & Compliance Domain

**A. Domain purpose**

- `[implemented]` Determine whether captured work data can enter a governed submission queue.
- `[partial]` Expose submission lifecycle and evidence readiness diagnostics.
- `[conceptual]` Support regulator-specific SAMRO/CAPASSO/neighbouring-rights compliance over time.

**B. User problems solved**

- `[implemented]` User can know whether work exists, has contributors, and has 100 percent splits.
- `[implemented]` User is blocked from queue creation when work does not exist or readiness fails.
- `[partial]` User can view queue/lifecycle rows when available.

**C. Core capabilities**

- `[implemented]` readiness validation, queue creation guard, duplicate prevention, lifecycle fetch.
- `[partial]` submission processing, regulator response handling, remediation cases, SAMRO export builders.
- `[conceptual]` CAPASSO and neighbouring-rights submission logic.

**D. Existing backend/code support**

- `[implemented]` `app/api/submissions/readiness/route.ts`.
- `[implemented]` `app/api/submissions/create-from-work/route.ts`.
- `[implemented]` `src/lib/registration/submission-engine/repositories/create-submission-queue-item.ts`.
- `[implemented]` `src/lib/registration/submission-engine/utils/generate-submission-fingerprint.ts`.
- `[partial]` `process-submission-queue.service.ts`, `process-submission-queue-item.ts`, SAMRO adapter/export contracts.
- `[partial]` `SubmissionQueue`, `SubmissionQueueEvent`, `SubmissionRemediationCase` models exist in Prisma.

**E. Existing docs support**

- `[implemented]` create-song refactor/stabilization docs, transaction RPC contract, submission lifecycle governance note, build log.

**F. Existing UI/workflow support**

- `[partial]` isolated TEST workflow can create queue items and display lifecycle state.

**G. Missing backend logic**

- `[partial]` processing visibility is incomplete; not every status change emits a complete operational event.
- `[conceptual]` regulator-specific response normalization, amendment/resubmission flows, production enforcement.

**H. Missing persistence/entities**

- `[partial]` `SubmissionQueueEvent` exists; complete event coverage and normalized timestamps remain incomplete.
- `[conceptual]` submission intent as a separate object is not yet present.

**I. Missing governance rules**

- `[partial]` initial readiness guard exists; target-specific submission authority, regulator response, and remediation governance are not complete.

**J. Missing dashboard/workflow entry points**

- `[partial]` no aggregate dashboard section for ready/queued/submitted work yet.

**K. Cross-domain dependencies**

- Rights & Ownership, Asset & Evidence, Workflow & Operations, Legal & Dispute, Notification & Communication.

**L. Recommended next aligned developments**

- `[recommendation]` Add read-only registration journey/dashboard summaries over the existing readiness/queue/lifecycle data before adding new submission actions.

**M. Maturity status**

- `[partial]`

### 3. Asset & Evidence Domain

**A. Domain purpose**

- `[implemented]` Create a basic asset row when a song/work is captured.
- `[partial]` Evaluate evidence readiness from `RegistrationEvidence` when available, with fail-closed handling when persistence is not aligned.
- `[conceptual]` Manage audio, lyrics, split sheets, contracts, mandates, authority documents, and file vault links.

**B. User problems solved**

- `[implemented]` Work capture creates a linked asset identity.
- `[partial]` Evidence readiness reports missing/unavailable persistence instead of faking readiness.

**C. Core capabilities**

- `[implemented]` asset creation through create-song RPC.
- `[partial]` evidence readiness evaluator, evidence constants, policy rules, transition validation, audit event helpers.
- `[partial]` file-vault helpers exist but are not integrated into the active registration workflow.

**D. Existing backend/code support**

- `[implemented]` `assets` insert in `rpc_create_song_with_contributors`.
- `[partial]` `src/lib/evidence-vault/*`.
- `[partial]` `src/lib/registration/evidence/registration-evidence-registry.ts`.
- `[partial]` `RegistrationEvidence` and `EvidenceAuditEvent` Prisma models exist, but live DEV/TEST alignment has been a known risk.
- `[partial]` `src/lib/file-vault/*` helpers exist.

**E. Existing docs support**

- `[implemented]` Evidence Pack Readiness milestones in tracker and build log; operational UX rules for blockers and persistence.

**F. Existing UI/workflow support**

- `[partial]` `app/codex-ui-test/page.tsx` and the guided TEST journey can display evidence readiness diagnostics.
- `[deferred]` no governed upload/link/review UI.

**G. Missing backend logic**

- `[conceptual]` evidence upload, document linking, verification workflow, supersession review, expiry renewal, authority review.

**H. Missing persistence/entities**

- `[partial]` evidence models exist; active database alignment is not guaranteed.
- `[conceptual]` evidence pack as materialized operational view, file-to-evidence linkage, storage metadata.

**I. Missing governance rules**

- `[partial]` evidence readiness rules are defined in docs; real verification authority and review/override workflows are deferred.

**J. Missing dashboard/workflow entry points**

- `[partial]` only read-only evidence diagnostics in TEST shell; no dashboard evidence queue.

**K. Cross-domain dependencies**

- Registration & Compliance, Legal & Dispute, Workflow & Operations, Financial & Royalty.

**L. Recommended next aligned developments**

- `[recommendation]` Resolve evidence persistence alignment and add read-only evidence requirement summary before any evidence upload controls.

**M. Maturity status**

- `[partial]`

### 4. Workflow & Operations Domain

**A. Domain purpose**

- `[partial]` Coordinate tasks, blockers, queues, readiness state, lifecycle, and operational next actions.

**B. User problems solved**

- `[partial]` User can follow the isolated TEST route from local draft through queue/lifecycle visibility.
- `[conceptual]` User should later see all active work, incomplete drafts, blockers, waiting states, and reminders in one command centre.

**C. Core capabilities**

- `[implemented]` queue item creation and pending/lifecycle APIs.
- `[partial]` project/task APIs, runtime worker, operational incidents, remediation cases, escalation notification queue.
- `[conceptual]` unified work queue, blocker model, task routing, reminders, approvals.

**D. Existing backend/code support**

- `[implemented]` `SubmissionQueue`/`SubmissionQueueEvent`.
- `[partial]` `app/api/projects`, `app/api/project-tasks`, runtime worker route, `OperationalIncident`, `SubmissionRemediationCase`.
- `[partial]` `src/lib/calendar-tasks/*`, `src/lib/operations/escalation/*`.

**E. Existing docs support**

- `[implemented]` app-build framework, milestone tracker, operational UX governance, dashboard capability matrix.

**F. Existing UI/workflow support**

- `[partial]` `app/registration-workflow-test/page.tsx` provides a guided operational workflow.
- `[partial]` `app/codex-ui-test/page.tsx` provides TEST control/visibility panels.

**G. Missing backend logic**

- `[conceptual]` registration journey persistence, stage completion model, unified blocker/task generation, resume model.

**H. Missing persistence/entities**

- `[conceptual]` registration journey/draft, operational blocker, activity feed, workflow stage summary.

**I. Missing governance rules**

- `[partial]` UX governance exists; action authority and transition audit for all workflows are not complete.

**J. Missing dashboard/workflow entry points**

- `[partial]` no production dashboard command centre yet.

**K. Cross-domain dependencies**

- All operational domains.

**L. Recommended next aligned developments**

- `[recommendation]` Build read-only dashboard summary and registration journey summary after the current workflow route is reviewed.

**M. Maturity status**

- `[partial]`

### 5. Financial & Royalty Domain

**A. Domain purpose**

- `[conceptual]` Connect rights, evidence, usage, statements, settlements, liabilities, payouts, and accounting.

**B. User problems solved**

- `[conceptual]` Users should later know whether royalties are payable, held, reconciled, disputed, or ready for payout.

**C. Core capabilities**

- `[partial]` broad finance API surface exists.
- `[partial]` royalty calculation, royalty event processing, ledger helpers, payout batch logic, and royalty eligibility helper exist.
- `[deferred]` integration with the music-rights registration lifecycle is not active.

**D. Existing backend/code support**

- `[partial]` `app/api/finance/*`, `src/lib/finance/*`.
- `[partial]` `src/lib/royalties/*`, `src/lib/royalty-control-alignment/*`.
- `[partial]` evidence readiness includes royalty and payout workflow impact fields.

**E. Existing docs support**

- `[conceptual]` service offering and UX docs mark royalties/reconciliation as future.

**F. Existing UI/workflow support**

- `[deferred]` not active in the current registration workflow.

**G. Missing backend logic**

- `[conceptual]` royalty statement ingestion connected to works, usage matching, ownership-based allocation, reconciliation, payout holds/releases tied to evidence readiness.

**H. Missing persistence/entities**

- `[partial]` finance/royalty tables may be referenced by code, but canonical music-rights value-flow read models are not proven in this slice.

**I. Missing governance rules**

- `[conceptual]` payout authority, hold/freeze, deduction stack, tax/VAT, settlement approval.

**J. Missing dashboard/workflow entry points**

- `[deferred]` no active royalty dashboard for the rights workflow.

**K. Cross-domain dependencies**

- Rights & Ownership, Asset & Evidence, Registration & Compliance, Analytics & Intelligence, Notification & Communication.

**L. Recommended next aligned developments**

- `[recommendation]` Keep finance/royalty disconnected from the active registration UI until registration/evidence readiness and ownership governance are stronger.

**M. Maturity status**

- `[partial]` as code inventory, `[deferred]` for the active music-rights workflow.

### 6. Artist / CRM Domain

**A. Domain purpose**

- `[conceptual]` Manage artists, contacts, collaborators, managers, labels, publishers, onboarding, and communication history.

**B. User problems solved**

- `[partial]` Contributor names can be captured for works.
- `[conceptual]` Users should later manage people and organizations as reusable operational identities.

**C. Core capabilities**

- `[partial]` CRM contact create/list/channel/lifecycle helpers exist.
- `[implemented]` create-song RPC resolves or creates basic `contributors`.
- `[conceptual]` artist profiles, collaborator onboarding, manager/label/publisher relationships.

**D. Existing backend/code support**

- `[partial]` `src/lib/crm/*`.
- `[implemented]` `contributors` and `work_contributors` in create-song RPC.

**E. Existing docs support**

- `[conceptual]` service offering names artist/project operations as a support pillar.

**F. Existing UI/workflow support**

- `[partial]` contributor entry exists in registration workflow.
- `[deferred]` no CRM/artist profile surface in active root app workflow.

**G. Missing backend logic**

- `[conceptual]` contributor-to-CRM linking, artist identity resolution, communication history tied to rights actions.

**H. Missing persistence/entities**

- `[partial]` CRM tables are referenced; canonical contributor/artist identity consolidation is not complete.

**I. Missing governance rules**

- `[conceptual]` identity matching, duplicate prevention across contributors/contacts/artists, authority roles.

**J. Missing dashboard/workflow entry points**

- `[deferred]` no active artist/CRM command-centre entry point.

**K. Cross-domain dependencies**

- Rights & Ownership, Notification & Communication, Legal & Dispute, Release & Distribution.

**L. Recommended next aligned developments**

- `[recommendation]` Treat contributor identity governance as the bridge before broad CRM expansion.

**M. Maturity status**

- `[partial]`

### 7. Release & Distribution Domain

**A. Domain purpose**

- `[conceptual]` Manage recordings, releases, ISRC, UPC/EAN, DSP metadata, release schedules, territories, and distribution readiness.

**B. User problems solved**

- `[conceptual]` Users should later connect compositions to recordings and releases before distribution.

**C. Core capabilities**

- `[partial]` recording contracts/models, release helpers, distribution helpers.
- `[deferred]` no active distribution workflow in the registration slice.

**D. Existing backend/code support**

- `[partial]` `Recording` and `RecordingPerformer` Prisma models.
- `[partial]` `src/lib/registration/contracts/recording-contract.ts`.
- `[partial]` `src/lib/releases/*`.
- `[partial]` `src/lib/distribution/*`.

**E. Existing docs support**

- `[conceptual]` service offering and dashboard matrix identify release/distribution as future operations.

**F. Existing UI/workflow support**

- `[deferred]` active registration workflow explicitly defers recording/release flows.

**G. Missing backend logic**

- `[conceptual]` DSP delivery contracts, territory rules, release readiness, ISRC/UPC governance, DDEX/export pipeline.

**H. Missing persistence/entities**

- `[partial]` release/distribution tables are referenced by helpers; active alignment with registration workflow is not proven.

**I. Missing governance rules**

- `[conceptual]` release authority, delivery status transitions, territory restrictions, takedown/remediation.

**J. Missing dashboard/workflow entry points**

- `[deferred]` no governed release/distribution dashboard path yet.

**K. Cross-domain dependencies**

- Rights & Ownership, Asset & Evidence, Calendar / Scheduling, Marketing & Promotion, Financial & Royalty.

**L. Recommended next aligned developments**

- `[recommendation]` Defer until original composition registration and evidence readiness are stable.

**M. Maturity status**

- `[partial]` as code inventory, `[deferred]` for current product workflow.

### 8. Marketing & Promotion Domain

**A. Domain purpose**

- `[conceptual]` Support release campaigns, promotional planning, content calendars, audience operations, EPKs, and campaign assets.

**B. User problems solved**

- `[conceptual]` Users should later coordinate promotion around registered/released music.

**C. Core capabilities**

- `[conceptual]` campaign planning, asset checklists, promotional calendar, EPK materials.

**D. Existing backend/code support**

- `[partial]` project/task and file-vault helpers could support future marketing work, but no governed marketing system is present.

**E. Existing docs support**

- `[conceptual]` service offering mentions project/file/artist operations, but marketing is not a current vertical slice.

**F. Existing UI/workflow support**

- `[deferred]` none in active root app workflow.

**G. Missing backend logic**

- `[conceptual]` campaign objects, audience channels, content calendar, EPK workflow.

**H. Missing persistence/entities**

- `[conceptual]` campaigns, campaign assets, promotional tasks, channel plans.

**I. Missing governance rules**

- `[conceptual]` rights-cleared asset use, approval, release-date gating.

**J. Missing dashboard/workflow entry points**

- `[deferred]` none.

**K. Cross-domain dependencies**

- Release & Distribution, Calendar / Scheduling, Asset & Evidence, Artist / CRM.

**L. Recommended next aligned developments**

- `[recommendation]` Do not build marketing before registration, evidence, release, and asset foundations are governed.

**M. Maturity status**

- `[deferred]`

### 9. Calendar / Scheduling Domain

**A. Domain purpose**

- `[conceptual]` Track submission deadlines, contributor follow-ups, release dates, bookings, reminders, and operational timing.

**B. User problems solved**

- `[conceptual]` Users should know what is due, overdue, scheduled, or waiting.

**C. Core capabilities**

- `[partial]` task and calendar helper functions exist.
- `[partial]` queue/remediation models include scheduled/due timestamps.
- `[deferred]` no registration-specific reminder system.

**D. Existing backend/code support**

- `[partial]` `src/lib/calendar-tasks/*`.
- `[partial]` `SubmissionQueue.scheduledAt`, `SubmissionRemediationCase.dueAt`.
- `[partial]` `app/api/project-tasks`.

**E. Existing docs support**

- `[conceptual]` dashboard matrix includes tasks/reminders as future command-centre behavior.

**F. Existing UI/workflow support**

- `[deferred]` no active calendar panel tied to registration workflow.

**G. Missing backend logic**

- `[conceptual]` reminder creation from blockers, due-date escalation, lifecycle scheduling, contributor follow-up reminders.

**H. Missing persistence/entities**

- `[partial]` task tables are referenced by helpers; registration-specific task/read model is missing.

**I. Missing governance rules**

- `[conceptual]` reminder authority, escalation timing, retry policies, user notification rules.

**J. Missing dashboard/workflow entry points**

- `[deferred]` no governed calendar/reminder dashboard section yet.

**K. Cross-domain dependencies**

- Workflow & Operations, Registration & Compliance, Notification & Communication, Release & Distribution, Booking & Performance.

**L. Recommended next aligned developments**

- `[recommendation]` Generate read-only due/waiting state only after blockers and registration journey persistence exist.

**M. Maturity status**

- `[partial]`

### 10. Legal & Dispute Domain

**A. Domain purpose**

- `[conceptual]` Govern ownership disputes, mandate disputes, takedowns, chain-of-title, legal evidence, and review/approval workflows.

**B. User problems solved**

- `[conceptual]` Users should know when a work cannot progress because rights authority is contested or legally unresolved.

**C. Core capabilities**

- `[partial]` registration dispute/amendment models, repositories, and services exist.
- `[partial]` evidence contracts include legal/authority evidence types.
- `[deferred]` no active dispute UI or legal review workflow.

**D. Existing backend/code support**

- `[partial]` `RegistrationDispute`, `RegistrationAmendment`, `RegistrationAuditEvent`.
- `[partial]` `src/lib/registration/services/open-registration-dispute.ts`, `request-registration-amendment.ts`.
- `[partial]` `src/lib/contracts/*`.

**E. Existing docs support**

- `[conceptual]` evidence and governance milestones define dispute/blocking principles.

**F. Existing UI/workflow support**

- `[deferred]` no active dispute workflow.

**G. Missing backend logic**

- `[conceptual]` dispute intake, resolution authority, legal evidence review, takedown processing, legal holds.

**H. Missing persistence/entities**

- `[partial]` basic dispute/amendment models exist; production legal case model and chain-of-title evidence graph are not complete.

**I. Missing governance rules**

- `[conceptual]` human review, override limits, legal authority, retention, irreversible transitions.

**J. Missing dashboard/workflow entry points**

- `[deferred]` no legal/dispute queue.

**K. Cross-domain dependencies**

- Rights & Ownership, Asset & Evidence, Registration & Compliance, Workflow & Operations, Notification & Communication.

**L. Recommended next aligned developments**

- `[recommendation]` Keep dispute controls deferred; expose only read-only blocker/dispute indicators once evidence and ownership state exist.

**M. Maturity status**

- `[partial]`

### 11. Booking & Performance Domain

**A. Domain purpose**

- `[conceptual]` Manage bookings, venues, performance dates, contracts, setlists, settlements, and performance royalty links.

**B. User problems solved**

- `[conceptual]` Users should later connect performance activity to rights, calendars, contracts, and royalty evidence.

**C. Core capabilities**

- `[conceptual]` booking intake, venue/contact management, setlist reporting, performance settlement, performance royalty linkage.

**D. Existing backend/code support**

- `[partial]` calendar, CRM, contracts, finance, and royalties helpers could support future booking operations.
- `[deferred]` no booking-specific backend system was identified in the active app/API surface.

**E. Existing docs support**

- `[conceptual]` not a current governed capability.

**F. Existing UI/workflow support**

- `[deferred]` none.

**G. Missing backend logic**

- `[conceptual]` booking lifecycle, venue data, performance evidence, setlists, settlement generation.

**H. Missing persistence/entities**

- `[conceptual]` bookings, venues, performance events, setlists, booking contracts, settlement records.

**I. Missing governance rules**

- `[conceptual]` booking approval, settlement authority, performance evidence requirements.

**J. Missing dashboard/workflow entry points**

- `[deferred]` none.

**K. Cross-domain dependencies**

- Calendar / Scheduling, Artist / CRM, Legal & Dispute, Financial & Royalty, Marketing & Promotion.

**L. Recommended next aligned developments**

- `[recommendation]` Defer until core rights, registration, release, and financial value-flow foundations are stable.

**M. Maturity status**

- `[deferred]`

### 12. Analytics & Intelligence Domain

**A. Domain purpose**

- `[partial]` Support operational analytics, catalogue insights, bottleneck detection, revenue analytics, and future grounded recommendations.

**B. User problems solved**

- `[conceptual]` Users should understand workflow bottlenecks, readiness blockers, lifecycle aging, revenue variance, and recommended next actions.

**C. Core capabilities**

- `[partial]` analytics report execution helpers and operational analytics metric/snapshot helpers exist.
- `[partial]` finance analytics APIs exist.
- `[deferred]` music-rights operational intelligence dashboard is not active.

**D. Existing backend/code support**

- `[partial]` `app/api/analytics/execute-report/route.ts`.
- `[partial]` `src/lib/analytics-report-engine/*`.
- `[partial]` `src/lib/operational-analytics/*`.
- `[partial]` finance report/KPI endpoints.

**E. Existing docs support**

- `[conceptual]` dashboard matrix defines no-fake-metrics and real backend summary requirements.

**F. Existing UI/workflow support**

- `[deferred]` no active operational analytics dashboard for registration workflow.

**G. Missing backend logic**

- `[conceptual]` registration bottleneck summaries, evidence blocker frequency, lifecycle aging, readiness trend metrics.

**H. Missing persistence/entities**

- `[partial]` analytics execution/snapshot helpers exist; domain-specific read models are missing.

**I. Missing governance rules**

- `[conceptual]` analytics truth boundaries, metric freshness, recommendation grounding, privacy/scope.

**J. Missing dashboard/workflow entry points**

- `[deferred]` no governed metrics panels.

**K. Cross-domain dependencies**

- Workflow & Operations, Registration & Compliance, Financial & Royalty, Dashboard, AI Assistant.

**L. Recommended next aligned developments**

- `[recommendation]` Start with read-only operational summary counts from the current vertical slice; avoid decorative analytics.

**M. Maturity status**

- `[partial]`

### 13. Notification & Communication Domain

**A. Domain purpose**

- `[conceptual]` Send contributor requests, reminders, lifecycle updates, readiness warnings, system notifications, and user communications.

**B. User problems solved**

- `[conceptual]` Users should not manually chase every contributor, blocker, deadline, or lifecycle update.

**C. Core capabilities**

- `[partial]` notification creation, recipients, delivery attempts, escalation queue.
- `[partial]` finance notifications API exists.
- `[deferred]` no registration-specific notification flow.

**D. Existing backend/code support**

- `[partial]` `src/lib/notifications/*`.
- `[partial]` `src/lib/operations/escalation/*`.
- `[partial]` `EscalationNotificationQueue` Prisma model.
- `[partial]` `app/api/finance/notifications`.

**E. Existing docs support**

- `[conceptual]` dashboard matrix and UX governance describe lifecycle/update/reminder needs.

**F. Existing UI/workflow support**

- `[deferred]` no active registration notifications UI.

**G. Missing backend logic**

- `[conceptual]` contributor confirmation requests, evidence reminder routing, submission status notifications, blocker reminders.

**H. Missing persistence/entities**

- `[partial]` notification tables/models exist in places; domain-specific notification preferences and routing are not unified.

**I. Missing governance rules**

- `[conceptual]` notification scope, consent, retry, delivery failure, escalation rules.

**J. Missing dashboard/workflow entry points**

- `[deferred]` no operational notification centre tied to registration.

**K. Cross-domain dependencies**

- Workflow & Operations, Rights & Ownership, Registration & Compliance, Calendar / Scheduling, Legal & Dispute.

**L. Recommended next aligned developments**

- `[recommendation]` Add notifications only after the triggering backend states and blocker/task models are stable.

**M. Maturity status**

- `[partial]`

### 14. Identity & Access Domain

**A. Domain purpose**

- `[partial]` Govern users, workspaces, teams, roles, permissions, organizations, and access control.

**B. User problems solved**

- `[partial]` Workspace and role context can be resolved for some routes.
- `[conceptual]` Users should later see only authorized works, workflows, evidence, finance, and payout actions.

**C. Core capabilities**

- `[partial]` workspace APIs, workspace invitations, RBAC permission definitions, authz sync/me routes.
- `[partial]` protected finance route context exists.
- `[deferred]` registration workflow route is still isolated TEST and not fully workspace-scoped.

**D. Existing backend/code support**

- `[partial]` `app/api/workspaces`, `workspace-members`, `workspace-invitations`, `workspace-context`, `authz`.
- `[partial]` `src/lib/authz/*`, `src/lib/rbac/*`, `src/lib/workspace-context/*`.
- `[partial]` `SubmissionQueue.workspaceId` exists but is optional.

**E. Existing docs support**

- `[conceptual]` governance docs require backend truth and future auth/scope boundaries.

**F. Existing UI/workflow support**

- `[deferred]` no full workspace-scoped operational UI for registration route.

**G. Missing backend logic**

- `[conceptual]` registration/evidence/queue permissions, team roles for contributor/reviewer/admin, production auth enforcement for all music-rights actions.

**H. Missing persistence/entities**

- `[partial]` workspace/role tables are referenced; active registration records are not fully workspace-owned in current TEST slice.

**I. Missing governance rules**

- `[conceptual]` permission matrix for registration, evidence, submission, dispute, payout, and overrides.

**J. Missing dashboard/workflow entry points**

- `[partial]` settings/team future entry points are conceptual for the active product flow.

**K. Cross-domain dependencies**

- All domains.

**L. Recommended next aligned developments**

- `[recommendation]` Before productionizing the registration route, define workspace ownership and permissions for works, evidence, queue items, and lifecycle visibility.

**M. Maturity status**

- `[partial]`

### 15. Education / Guidance / AI Assistant Domain

**A. Domain purpose**

- `[conceptual]` Provide guided workflow help, plain-language explanations, AI helper/avatar, onboarding guidance, and operational education.

**B. User problems solved**

- `[conceptual]` Users should understand what is missing, blocked, saved, local-only, persisted, and safe to do next.

**C. Core capabilities**

- `[partial]` UX governance requires next-action guidance, plain-language blockers, and visible persistence.
- `[conceptual]` grounded assistant/avatar in far-right corner, documentation-grounded explanations, workflow help.

**D. Existing backend/code support**

- `[deferred]` no active AI helper backend or grounded assistant context API was identified.

**E. Existing docs support**

- `[implemented]` `APP-USER-EXPERIENCE-FLOW-FRAMEWORK.md`, `OPERATIONAL-UX-GOVERNANCE.md`, app-level journey, service offering.

**F. Existing UI/workflow support**

- `[partial]` registration workflow provides plain-language operational guidance without AI.

**G. Missing backend logic**

- `[conceptual]` assistant grounding context, state/doc retrieval boundary, no-invention rules enforced in code.

**H. Missing persistence/entities**

- `[conceptual]` assistant interaction logs, guidance state, onboarding progress.

**I. Missing governance rules**

- `[partial]` docs define high-level rules; production guardrails and response grounding are not implemented.

**J. Missing dashboard/workflow entry points**

- `[deferred]` no AI helper UI yet.

**K. Cross-domain dependencies**

- Workflow & Operations, Analytics & Intelligence, Identity & Access, all user-facing workflows.

**L. Recommended next aligned developments**

- `[recommendation]` Keep AI helper deferred until dashboard/workflow state APIs can supply reliable backend truth.

**M. Maturity status**

- `[conceptual]`

## 5. Cross-Domain Event Mapping

| Key event | Connected domains | Current support | Missing/gap | Aligned recommendation |
| --- | --- | --- | --- | --- |
| Song captured | Rights & Ownership, Asset & Evidence, Workflow & Operations, Dashboard | `[implemented]` create-song RPC writes `assets`, `musical_works`, `contributors`, `work_contributors` | `[partial]` no dashboard summary/read model | `[recommendation]` create read-only dashboard summary over captured works |
| Contributor split saved | Rights & Ownership, Registration & Compliance, Workflow & Operations, Notification & Communication | `[implemented]` create-song RPC stores initial split rows | `[partial]` no contributor update/confirmation workflow or notifications | `[recommendation]` add contributor identity/split governance before collaborator messaging |
| Work ready for submission | Registration & Compliance, Workflow & Operations, Dashboard | `[implemented]` readiness API checks contributors and 100 percent split | `[partial]` no aggregate ready-to-submit dashboard | `[recommendation]` expose ready-to-submit read model before more submission controls |
| Submission queued | Registration & Compliance, Workflow & Operations, Calendar / Scheduling, Notification & Communication | `[implemented]` queue item creation after readiness; duplicate prevention | `[partial]` lifecycle events and notifications are incomplete | `[recommendation]` expand lifecycle event coverage before notifications |
| Evidence missing | Asset & Evidence, Registration & Compliance, Workflow & Operations, Dashboard | `[partial]` evidence readiness API returns blockers/fail-closed diagnostics | `[partial]` persistence alignment and upload/link workflows deferred | `[recommendation]` align `RegistrationEvidence` persistence before upload actions |
| Royalty statement received | Financial & Royalty, Rights & Ownership, Analytics & Intelligence, Notification & Communication | `[partial]` royalty/finance helpers exist | `[deferred]` not connected to works/readiness/lifecycle | `[recommendation]` defer until evidence/ownership governance is reliable |
| Booking confirmed | Booking & Performance, Calendar / Scheduling, Financial & Royalty, Marketing & Promotion | `[deferred]` no booking-specific system identified | `[conceptual]` booking entities, venue, contract, settlement missing | `[recommendation]` defer until core music-rights operations are stable |
| Dispute opened | Legal & Dispute, Registration & Compliance, Workflow & Operations, Notification & Communication | `[partial]` dispute models/services exist | `[deferred]` no active dispute UI or governed legal review | `[recommendation]` expose read-only dispute/blocker indicators before controls |

## 6. Foundational vs Future Expansion

Foundational domains for the current build:

- `[partial]` Platform Foundation
- `[partial]` Rights & Ownership
- `[partial]` Registration & Compliance
- `[partial]` Asset & Evidence
- `[partial]` Workflow & Operations
- `[partial]` Identity & Access

Near-term support domains:

- `[partial]` Notification & Communication
- `[partial]` Analytics & Intelligence
- `[partial]` Calendar / Scheduling
- `[partial]` Artist / CRM
- `[partial]` Legal & Dispute

Future expansion domains:

- `[deferred]` Financial & Royalty integration into rights workflows
- `[deferred]` Release & Distribution production workflow
- `[deferred]` Marketing & Promotion
- `[deferred]` Booking & Performance
- `[conceptual]` Education / Guidance / AI Assistant

## 7. Drift Warnings

- `[recommendation]` Do not build decorative dashboard stats before backend summary APIs exist.
- `[recommendation]` Do not expose royalty or payout controls from the current registration workflow.
- `[recommendation]` Do not add evidence upload/review controls before persistence alignment and governance rules are confirmed.
- `[recommendation]` Do not build broad CRM, marketing, booking, or AI helper surfaces before the core registration workflow has durable backend summaries.
- `[recommendation]` Do not treat existing broad finance/distribution/CRM helper code as product-ready inside the music-rights workflow until integration has been explicitly tested and governed.

## 8. Recommended Sequencing

Recommended next sequence should strengthen the current working vertical slice:

1. `[implemented]` Define Platform Foundation V1 minimum requirements before productionizing dashboard access or song capture: `docs/platform/PLATFORM-FOUNDATION-V1-MINIMUM-REQUIREMENTS.md`.
2. `[recommendation]` Review and stabilize `app/registration-workflow-test/page.tsx` as the original composition TEST workflow.
3. `[recommendation]` Add a read-only registration journey/work summary API for dashboard use.
4. `[recommendation]` Add dashboard command-centre summaries for active, incomplete, blocked, ready, queued, and lifecycle states.
5. `[recommendation]` Resolve evidence persistence alignment and keep evidence UI read-only until then.
6. `[recommendation]` Define contributor identity and split-governance as the next rights foundation.
7. `[recommendation]` Expand lifecycle events and activity feed from real backend events.
8. `[recommendation]` Add notifications only after blocker/task/lifecycle triggers are stable.
9. `[recommendation]` Keep royalties, release distribution, marketing, booking, and AI assistant as future expansion until core operational state is reliable.

## 9. Source Of Truth

This document is the canonical ecosystem-domain alignment reference.

It complements:

- `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`
- `docs/platform/PLATFORM-FOUNDATION-V1-MINIMUM-REQUIREMENTS.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- `docs/platform/OPERATIONAL-OWNERSHIP-VS-RIGHTS-OWNERSHIP.md`
- `docs/platform/SENTRY-SOUND-PLATFORM-SERVICE-OFFERING.md`
- `docs/platform/APP-LEVEL-USER-JOURNEY-FLOW.md`
- `docs/platform/DASHBOARD-CAPABILITY-ALIGNMENT-MATRIX.md`
- `docs/platform/OPERATIONAL-UX-GOVERNANCE.md`
- `docs/platform/APP-BUILD-EXECUTION-FRAMEWORK.md`
- `docs/platform/APP-BUILD-MILESTONE-TRACKER.md`
- `docs/build-log/BUILD-LOG.md`
