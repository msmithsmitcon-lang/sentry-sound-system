# Sentry Sound Platform - App User Experience Flow Framework

## 1. Purpose

This document locks the practical user-facing app development approach for Sentry Sound Platform.

The governed backend-contract-first framework remains active. This framework adds the user journey layer that every operational capability must define before visual implementation expands.

The app must feel like a simple SaaS workflow that guides music operators through operational work without overwhelming them.

## 2. Core Principle

Every operational slice must define both:

- the backend truth the platform governs
- the practical journey the user experiences

The UI is not just a data screen.

The UI is an operational guide that helps the user understand:

- what is complete
- what is incomplete
- what is blocked
- what the system knows
- what the system prevents
- what the next safe action is

Backend/API behavior remains the source of truth.

The UI must never invent workflow logic, statuses, readiness, lifecycle movement, evidence conclusions, payout eligibility, or governance outcomes.

Detailed operational behavior rules are governed by `docs/platform/OPERATIONAL-UX-GOVERNANCE.md`.

This UX framework defines the journey. Operational UX Governance defines how the journey must behave when state is saved, blocked, resumed, confirmed, or progressed.

The broader product offering and app-level entry flow are governed by:

- `docs/platform/SENTRY-SOUND-PLATFORM-SERVICE-OFFERING.md`
- `docs/platform/APP-LEVEL-USER-JOURNEY-FLOW.md`
- `docs/platform/DASHBOARD-CAPABILITY-ALIGNMENT-MATRIX.md`

These documents define what the platform offers, what the dashboard is responsible for, and how workflow routes relate to the dashboard command centre.

## 3. Required Capability UX Questions

For every governed capability, define these six questions before implementation:

1. What the user sees
   - The visible screen, status, message, incomplete work, blocker, or next-action prompt.

2. What the system knows
   - The backend-owned facts, contracts, lifecycle state, readiness result, evidence state, queue state, or workflow impact.

3. What the system prevents
   - Unsafe progression, fake readiness, invalid submission, hidden mutation, premature payout, unsupported regulator action, or unresolved blocker bypass.

4. What the user can safely do
   - Read-only inspection, safe refresh, controlled reassessment, allowed submission, guided correction, or another governed action backed by an API contract.

5. What the user should do next
   - The plain-language next step the app recommends based on backend truth.

6. What must be tested visually and operationally
   - The UI state, backend response, disabled or allowed actions, blocker language, incomplete-work recovery, and no invented local workflow logic.

## 4. User Experience Direction

Sentry Sound Platform should use a calm, simple SaaS workflow:

- low intimidation
- plain-language status
- clear next action
- return user to the last incomplete action
- show incomplete work clearly
- show blockers in human language
- avoid overwhelming dashboards
- keep operational context visible without flooding the user
- guide the user through the lifecycle instead of making them hunt for state
- keep backend truth above UI convenience

Screens should help users finish operational work.

Dashboards should not become decorative summaries that hide unfinished rights, evidence, lifecycle, queue, or payout problems.

## 5. Initial App Journey

The initial user-facing journey should support:

Create Song
-> Check Readiness
-> Check Evidence Pack
-> Understand Blockers
-> Queue / Submit when allowed
-> Track Lifecycle
-> Fix Problems
-> Later: Track Royalties / Reconciliation

### Create Song

The user sees a simple create-song flow.

The system knows captured work metadata, contributors, splits, related assets, and backend creation outcome.

The system prevents unsupported or invalid progression from becoming fake readiness.

The user can safely create or return to incomplete work through approved backend routes.

The next step is readiness review.

### Check Readiness

The user sees whether the work is ready, incomplete, blocked, or needs review in plain language.

The system knows readiness from backend contracts.

The system prevents queue/submission actions when readiness does not allow them.

The user can safely refresh or inspect the readiness result.

The next step is evidence pack review when readiness depends on proof.

### Check Evidence Pack

The user sees evidence readiness, missing evidence, blockers, warnings, governance flags, and diagnostic previews.

The system knows evidence persistence, requirement matching, workflow impact, and whether evidence data is unavailable.

The system prevents fake evidence readiness and fails closed when persistence is unavailable.

The user can safely refresh/reassess read-only TEST output until controlled actions are approved.

The next step is resolving blockers or returning to submission readiness.

### Understand Blockers

The user sees blockers in human language, with the operational reason and affected workflow.

The system knows whether the blocker affects submission, queueing, royalty eligibility, payout readiness, remediation, or governance review.

The system prevents hidden bypass of blockers.

The user can safely inspect what is missing or unresolved.

The next step is the smallest correction required to move forward.

### Queue / Submit When Allowed

The user sees whether queue/submission is allowed.

The system knows queue eligibility, duplicate prevention, pending/submitted state, and lifecycle history.

The system prevents submission mutation when readiness or governance state blocks progression.

The user can safely create a submission only through approved backend routes when allowed.

The next step is lifecycle tracking.

### Track Lifecycle

The user sees queue history, lifecycle events, processing state, submission status, and regulator messages when present.

The system knows persisted queue rows and lifecycle events.

The system prevents pending-only visibility from hiding completed lifecycle history.

The user can safely inspect lifecycle history without mutating status.

The next step is either wait, fix a problem, or review downstream response.

### Fix Problems

The user sees what is incomplete, blocked, disputed, expired, or failed.

The system knows the authoritative reason and affected workflow.

The system prevents unsafe edits, fake status changes, and unsupported remediation.

The user can safely perform only approved corrective actions when those actions are added under governance.

The next step is reassessment or lifecycle review.

### Later: Track Royalties / Reconciliation

The user will eventually see royalty eligibility, usage telemetry, reconciliation issues, payout holds, and value-flow status.

The system will know settlement, usage, identifier, authority, and reconciliation state.

The system must prevent premature payout claims, ungrounded revenue displays, and unresolved authority bypass.

This is deferred until the royalty and reconciliation capabilities are governed.

## 6. AI Helper / Assistant Direction

A future small AI helper/avatar should appear in the far-right corner with wording such as:

Ask me anything

Purpose:

- reduce user overwhelm
- explain the current screen
- explain blockers
- guide the next action
- help the user understand incomplete steps
- summarize lifecycle state in plain language

Rules:

- it must never invent backend truth
- it must never invent workflow status
- it must never approve actions
- it must never bypass governance
- answers must be grounded in system state, backend responses, and approved docs
- uncertainty must be stated plainly
- any action guidance must point back to approved platform flows

This is not a fancy UI requirement.

It is a future operational guidance requirement.

## 7. Visual And Operational Test Requirements

Every capability with a user-facing surface must be tested for both visual clarity and operational truth.

Minimum checks:

- user can tell what state they are in
- incomplete work is visible
- blockers are written in human language
- next action is clear
- disabled or unavailable actions match backend truth
- UI does not invent readiness or lifecycle state
- backend response and visible state match
- diagnostic-only data is labeled clearly
- TEST-only views remain marked as TEST
- no direct database access exists in UI
- no hidden mutation happens from read-only surfaces
- local-only state is clearly distinguished from persisted backend state
- backend actions show explicit confirmation
- blockers remain visible until backend conditions change
- unavailable actions are not displayed as active

## 8. Relationship To App Build Execution Framework

This framework extends `APP-BUILD-EXECUTION-FRAMEWORK.md`.

It also works with `OPERATIONAL-UX-GOVERNANCE.md`.

It also works with `SENTRY-SOUND-PLATFORM-SERVICE-OFFERING.md` and `APP-LEVEL-USER-JOURNEY-FLOW.md`.

Dashboard/workflow expansion must also consult `DASHBOARD-CAPABILITY-ALIGNMENT-MATRIX.md` before showing dashboard areas, metrics, actions, or lifecycle panels as operational.

The 15-step operational pattern remains the governing execution model.

This UX framework adds a required user-facing journey checkpoint to each capability so the app becomes usable as an operational product, not only correct as a backend system.

## 9. Deferred Scope

This framework does not authorize:

- UI redesign
- animation work
- chatbot implementation
- direct database access from UI
- fake operational dashboards
- uncontrolled mutation controls
- payout views without governed backend contracts
- regulator or finance actions before their capabilities are governed
