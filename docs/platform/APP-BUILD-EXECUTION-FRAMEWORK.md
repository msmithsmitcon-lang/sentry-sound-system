# Sentry Sound Platform - App Build Execution Framework

## Purpose

This document hardlocks the app-build methodology for Sentry Sound Platform.

It exists as the project execution framework for Codex sessions, future chats, governed implementation work, and app-build drift prevention.

## 1. Core Principle

The Sentry Sound Platform app is the objective build.

Development must proceed through governed operational vertical slices, not random pages, isolated APIs, disconnected backend features, or frontend polish.

Every build task must strengthen the operational platform lifecycle:

- capture
- readiness
- queueing
- processing
- lifecycle visibility
- evidence
- governance
- telemetry
- remediation
- audit
- value flow

The app is not page-first.

The app is an operational rights-management control plane.

Every operational capability must also define the practical user-facing journey before UI expansion:

1. What the user sees
2. What the system knows
3. What the system prevents
4. What the user can safely do
5. What the user should do next
6. What must be tested visually and operationally

The user experience must remain a simple SaaS workflow:

- low intimidation
- plain-language status
- clear next action
- incomplete work visible
- blockers written in human language
- return user to the last incomplete action
- UI as an operational guide, not just a data screen

Backend/API behavior remains the source of truth.

The UI must not invent workflow logic.

Operational UX behavior must also align with `docs/platform/OPERATIONAL-UX-GOVERNANCE.md`.

This means every workflow surface must preserve backend truth, visible persistence, safe progression, progressive disclosure, blocker visibility, and explicit confirmation.

App-level product flow must align with:

- `docs/platform/SENTRY-SOUND-PLATFORM-SERVICE-OFFERING.md`
- `docs/platform/APP-LEVEL-USER-JOURNEY-FLOW.md`

These documents define what the platform offers and how users enter, navigate, and act inside the app before feature expansion.

## 2. The 15-Step Executable Pattern

For every operational capability, use this pattern:

1. Define operational capability
2. Define lifecycle
3. Define metadata/entities
4. Define governance rules
5. Define evidence requirements
6. Define states/transitions
7. Define backend contracts
8. Define processing/workflow logic
9. Define telemetry/audit events
10. Test operational logic
11. Expose read-only operational visibility
12. Add controlled operational actions
13. Validate end-to-end flow
14. Sign off
15. Move to next capability

## 3. Milestone Structure

Each of the 15 steps is a milestone and deliverable.

Each milestone may contain subitems, test cases, documentation updates, API contracts, service boundaries, UI visibility work, and governance review.

No operational capability is complete until all 15 steps are either:

- completed, or
- explicitly deferred with a documented reason

Deferrals must not be silent.

A deferred milestone must identify:

- what is deferred
- why it is deferred
- what risk remains
- what future task should complete it

## 4. Current Completed / Active Slice

The first operational vertical slice is:

Create Song
-> Readiness
-> Queue
-> Process
-> Lifecycle Visibility

This slice establishes the governed TEST pipeline for moving a captured musical work into submission lifecycle visibility.

Current slice status:

- create song boundary stabilized through backend/API orchestration
- readiness endpoint operational
- submission queue creation operational
- duplicate prevention operational
- queue processing operational
- submitted rows no longer depend on pending-only visibility
- lifecycle visibility added through read-only TEST API
- lifecycle visibility rendered in `app/codex-ui-test/page.tsx`

Lifecycle visibility was added through:

- `GET /api/submissions/lifecycle?work_id=...`
- read-only lifecycle history and event panels in `app/codex-ui-test/page.tsx`

This remains a TEST operational slice.

Backend/API/code behavior remains the source of truth.

## 5. Drift Guard Rules

The following rules apply to all future platform build work:

- No random frontend polishing
- No overwhelming dashboards that hide the next operational action
- No backend-only rabbit holes
- No direct DB access from UI
- No fake UI statuses
- No UI-invented workflow logic
- No silent form clearing or hidden persistence changes
- No hiding blockers behind generic success/error messages
- No `src/app` active work
- No uncontrolled schema changes
- No mutation controls before read-only visibility
- Backend/API remains source of truth
- UI is an operational visibility/control shell
- TEST/FIX/DESIGN mode must be declared before work

Additional guardrails:

- Inspect docs before implementation.
- Inspect current files before editing.
- Do not invent schema.
- Do not invent statuses.
- Do not invent workflows.
- Do not treat prototype routes as final governance.
- Do not expand UI beyond approved backend contracts.
- Keep changes bounded to the active capability and milestone.

## 6. Capability Backlog

Initial governed capability backlog:

- Evidence Pack Readiness
- Identifier Governance
- Registration Submission Lifecycle
- Distribution / DSP Delivery
- Licensing / Sync Clearance
- Usage Telemetry
- Royalty Statement Ingestion
- Reconciliation Workbench
- Remediation / Claims
- Royalty Settlement / Payout
- Governance / Audit / Institutional Memory

Backlog order may change only through explicit DESIGN or governance review.

Each backlog item must use the 15-step executable pattern before being considered complete.

## 7. Execution Rule

Before any future build task, Codex must identify:

- active mode
- active capability
- current 15-step milestone
- files allowed to touch
- files prohibited
- expected output

If these are not clear from the user request, Codex must infer conservatively from repository source of truth or ask for clarification before implementing.

No task should begin as open-ended coding.

Every task must be tied to:

- one active capability
- one current milestone
- one bounded file scope
- one expected deliverable

## 8. Build Log Requirement

Any governed app-build milestone must update `docs/build-log/BUILD-LOG.md` with a short entry that records:

- date
- capability
- milestone
- files changed
- verification performed
- remaining governance risks

Build log updates are part of institutional memory.

They are not optional when a governed platform milestone changes repo behavior or source-of-truth direction.

## 9. Framework Authority

This document is a source-of-truth project execution framework.

Future implementation must align with:

- `docs/platform/MASTER-DIRECTION-AND-SYSTEM-IDENTITY.md`
- `docs/platform/MASTER-SYSTEM-REFERENCE.md`
- `docs/platform/SENTRY-SOUND-PLATFORM-SERVICE-OFFERING.md`
- `docs/platform/APP-LEVEL-USER-JOURNEY-FLOW.md`
- `docs/platform/OPERATIONAL-UX-GOVERNANCE.md`
- `docs/platform/APP-USER-EXPERIENCE-FLOW-FRAMEWORK.md`
- `docs/platform/UI-GENERATION-GOVERNANCE.md`
- `docs/platform/SUBMISSION-LIFECYCLE-GOVERNANCE-NOTE.md`
- `docs/build-log/BUILD-LOG.md`

If implementation conflicts with this framework, stop and perform DESIGN review before continuing.
