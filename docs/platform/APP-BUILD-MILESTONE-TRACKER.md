# Sentry Sound Platform - App Build Milestone Tracker

## 1. Purpose

This file tracks governed operational vertical-slice development so work can continue even if Codex or AI credits are limited.

It is the manual continuation surface for app-build execution.

Use this tracker with:

- `docs/platform/APP-BUILD-EXECUTION-FRAMEWORK.md`
- `docs/platform/APP-USER-EXPERIENCE-FLOW-FRAMEWORK.md`
- `docs/platform/SENTRY-SOUND-PLATFORM-SERVICE-OFFERING.md`
- `docs/platform/APP-LEVEL-USER-JOURNEY-FLOW.md`
- `docs/platform/DASHBOARD-CAPABILITY-ALIGNMENT-MATRIX.md`
- `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`
- `docs/platform/PLATFORM-FOUNDATION-V1-MINIMUM-REQUIREMENTS.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- `docs/platform/PRODUCTION-MUTATION-GOVERNANCE-PATTERN.md`
- `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`
- `docs/platform/PLATFORM_SUBSCRIPTION_ENTITLEMENT_MATRIX_V1.md`
- `docs/platform/PLATFORM_ENTITLEMENT_BACKEND_CONTRACT_V1.md`
- `docs/platform/OPERATIONAL-OWNERSHIP-VS-RIGHTS-OWNERSHIP.md`
- `docs/platform/PLATFORM-ECOSYSTEM-DOMAIN-ARCHITECTURE.md`
- `docs/platform/OPERATIONAL-UX-GOVERNANCE.md`
- `docs/platform/MASTER-DIRECTION-AND-SYSTEM-IDENTITY.md`
- `docs/platform/MASTER-SYSTEM-REFERENCE.md`
- `docs/build-log/BUILD-LOG.md`

## 2. Manual Fallback Process

If Codex is unavailable:

1. Use the 15-step framework manually.
2. Complete one milestone at a time.
3. Record decisions in this tracker.
4. Do not skip governance or design steps.
5. Do not implement without declaring:
   - active mode
   - active capability
   - current milestone
   - allowed files
   - prohibited files
   - expected output

Manual work must remain bounded to the active capability and milestone.

Do not use manual fallback as permission to:

- skip design
- change schema casually
- add uncontrolled UI
- invent backend workflows
- bypass existing contracts
- work inside `src/app` as active surface

## 3. Current Active Capability

Evidence Pack Readiness

## 4. Current Progress

- Step 1 complete: Define operational capability
- Step 2 complete: Define lifecycle
- Step 3 complete: Define metadata/entities
- Step 4 complete: Define governance rules
- Step 5 complete: Define evidence requirements
- Step 6 complete: Define states/transitions
- Step 7 complete: Define backend contracts
- Step 8 complete: Define processing/workflow logic
- Step 9 complete: Define telemetry/audit events
- Step 10 complete: Test operational logic
- Step 11 complete: Expose read-only operational visibility
- Step 12 complete: Add controlled operational actions
- Step 13 complete: Validate end-to-end flow
- Step 14 complete: Sign off
- First bounded TEST implementation slice complete: read-only evidence readiness evaluation and TEST shell visibility
- Step 15 started: Guided TEST Journey Panel added as read-only UX visibility layer
- First guided original-composition registration workflow slice started in isolated TEST route
- Step 15 next: Move to next capability after implementation review/signoff

## 5. Evidence Pack Readiness Summary

### Step 1 - Define Operational Capability

Evidence Pack Readiness is the governed capability that determines whether a rights-bearing operational asset has enough trusted supporting proof to move safely through downstream workflows.

Initial target:

WORK
-> evidence requirements
-> evidence readiness result
-> submission readiness impact
-> read-only visibility

It is not evidence upload, document storage, AI verification, or UI design.

It answers:

- Does this work have the required evidence pack?
- Which proof is missing?
- Which evidence blocks submission?
- Which evidence creates downstream royalty risk?
- Does human review or remediation need to occur?

### Step 2 - Define Lifecycle

Canonical Evidence Pack Readiness lifecycle states:

- `not_assessed`
- `incomplete`
- `pending_review`
- `conditionally_ready`
- `ready`
- `blocked`
- `disputed`
- `expired`
- `superseded`

Primary happy path:

not_assessed
-> incomplete
-> pending_review
-> ready

Controlled warning path:

not_assessed
-> incomplete
-> pending_review
-> conditionally_ready
-> ready

Governance/remediation path:

pending_review
-> blocked/disputed/expired
-> remediation
-> pending_review
-> ready

Lifecycle rule:

Evidence Pack Readiness states sit above individual evidence verification statuses such as `PENDING`, `UNDER_REVIEW`, `VERIFIED`, `REJECTED`, `SUPERSEDED`, and `EXPIRED`.

### Step 3 - Define Metadata/Entities

Core entities:

- Evidence Pack
- Registration Evidence
- Evidence Policy
- Evidence Requirement
- Evidence Readiness Result
- Evidence Readiness Evaluation
- Evidence Lifecycle Event

Canonical relationship direction:

WORK / RECORDING / RELEASE / CONTRIBUTOR / SUBMISSION / ROYALTY_PERIOD
-> derived Evidence Pack
-> RegistrationEvidence[]
-> EvidenceAuditEvent[]
-> Evidence Readiness Result

Current canonical persisted entities:

- `RegistrationEvidence`
- `EvidenceAuditEvent`

Current reusable constants and logic:

- evidence types
- verification statuses
- requirement levels
- related entity types
- audit event types
- evidence readiness evaluation
- missing evidence detection
- required evidence policy resolution
- evidence transition validation
- evidence supersession validation
- evidence audit logging

Architecture decision:

Evidence Pack should initially be treated as a derived operational view over evidence records and policy rules.

Evidence readiness should initially be computed, not persisted, unless a later milestone approves caching/materialization.

## 6. 15-Step Checklist

| Step | Milestone | Status | Notes |
| --- | --- | --- | --- |
| 1 | Define operational capability | complete | Evidence Pack Readiness defined as proof/readiness gate for rights-bearing assets. |
| 2 | Define lifecycle | complete | Canonical readiness states defined. |
| 3 | Define metadata/entities | complete | Core entities, relationships, ownership rules, and computed/persisted boundaries defined. |
| 4 | Define governance rules | complete | Blocking, warning, payout-risk, review, override, and escalation rules defined. |
| 5 | Define evidence requirements | complete | Entity/workflow/regulator/payout requirement model defined. |
| 6 | Define states/transitions | complete | Formal state and transition model defined. |
| 7 | Define backend contracts | complete | Readiness, requirement, workflow impact, governance, and diagnostic contract architecture defined. |
| 8 | Define processing/workflow logic | complete | Backend-owned read-only processing flow defined. |
| 9 | Define telemetry/audit events | complete | Audit/telemetry event taxonomy and diagnostic preview rules defined. |
| 10 | Test operational logic | complete | TEST scenario strategy and expected outcomes defined. |
| 11 | Expose read-only operational visibility | complete | Read-only visibility model defined. |
| 12 | Add controlled operational actions | complete | Safe TEST actions limited to reassessment/diagnostic refresh; real actions deferred. |
| 13 | Validate end-to-end flow | complete | End-to-end validation path and success criteria defined. |
| 14 | Sign off | complete | Bounded TEST implementation authorized. |
| 15 | Move to next capability | active | Remains active until implementation review/signoff decides whether to continue Evidence Pack Readiness or move to Identifier Governance. |

Status values:

- complete
- active
- pending
- deferred

## 7. Update Rule

After each Codex or manual milestone step:

1. Update this tracker.
2. Update `docs/build-log/BUILD-LOG.md`.
3. Record active mode, capability, milestone, files changed, verification performed, and remaining risks.
4. Do not proceed to implementation milestones until preceding governance/design milestones are complete or explicitly deferred.

Current next step:

Step 15 - Review the bounded TEST implementation slice, then decide whether to continue Evidence Pack Readiness implementation hardening or move to the next capability.

## 8. User Experience Flow Requirement

Every capability must now include a practical user-facing journey checkpoint alongside backend-contract governance.

For each capability, record:

1. What the user sees
2. What the system knows
3. What the system prevents
4. What the user can safely do
5. What the user should do next
6. What must be tested visually and operationally

User-facing surfaces must follow this initial app journey:

Create Song
-> Check Readiness
-> Check Evidence Pack
-> Understand Blockers
-> Queue / Submit when allowed
-> Track Lifecycle
-> Fix Problems
-> Later: Track Royalties / Reconciliation

UX guardrails:

- simple SaaS workflow
- low intimidation
- plain-language status
- clear next action
- return user to the last incomplete action
- show incomplete work clearly
- show blockers in human language
- avoid overwhelming dashboards
- UI is an operational guide, not just a data screen
- backend remains source of truth
- UI must not invent workflow logic

Future assistant requirement:

- a small AI helper/avatar may appear in the far-right corner with wording such as `Ask me anything`
- it may explain screens, blockers, and next actions
- it must be grounded in system state, backend responses, and approved docs
- it must never invent backend truth or approve governance actions

This is a workflow clarity requirement, not fancy UI work.

## 9. First Bounded TEST Implementation Slice

Completed implementation:

- read-only backend evidence readiness evaluation service
- read-only API route for `work_id`
- isolated TEST shell visibility
- blockers, warnings, requirement summaries, workflow impacts, governance flags, and diagnostic event previews

Changed files:

- `src/lib/evidence-vault/evaluateEvidencePackReadiness.ts`
- `app/api/evidence-readiness/route.ts`
- `app/codex-ui-test/page.tsx`
- `docs/platform/APP-BUILD-MILESTONE-TRACKER.md`
- `docs/build-log/BUILD-LOG.md`

Preserved constraints:

- TEST only
- read-only only
- no queue mutation
- no submission mutation
- no payout mutation
- no real audit event persistence
- no `src/app` usage
- `app/page.tsx` untouched
- diagnostic events clearly treated as preview only

## 10. TEST Runtime Failure And Fail-Closed Fix

Observed runtime issue:

- `GET /api/evidence-readiness?work_id=1d6de1ff-540d-4ad4-8212-2a3371d4bb66`
- returned `{"success":false,"error":"Failed to evaluate evidence readiness"}`

Likely cause:

- `prisma.registrationEvidence.findMany` attempted to read `RegistrationEvidence`
- live DEV/TEST database may not contain aligned `RegistrationEvidence` persistence yet

Applied minimal fix:

- evaluator now catches evidence persistence lookup failures
- endpoint should return deterministic TEST read-only fail-closed result
- `readinessState` remains `not_assessed`
- `ready` remains `false`
- submission, queue, and payout workflow impacts are not allowed
- diagnostic message states evidence persistence is unavailable / `RegistrationEvidence` table unavailable or not aligned
- diagnostic event remains `PREVIEW ONLY`

No schema migration was performed.

Deferred risk:

- `RegistrationEvidence` DB alignment remains unresolved and must be handled in a later governed schema/persistence milestone.

## 11. Step 15 Guided TEST Journey Panel

Started Step 15 read-only UX visibility layer:

- added compact Guided TEST Journey panel to `app/codex-ui-test/page.tsx`
- journey shown as Create Song -> Readiness -> Evidence Pack -> Queue -> Lifecycle
- panel uses existing backend state only
- panel fetches only approved read-only APIs:
  - `GET /api/test/get-work`
  - `GET /api/submissions/readiness?work_id=...`
  - `GET /api/evidence-readiness?work_id=...`
  - `GET /api/submissions/pending`
- no mutation controls were added
- queue/submission step remains informational only
- evidence persistence unavailability is shown in plain language as a blocker
- lifecycle step describes currently visible lifecycle state only

Governance status:

- TEST only
- read-only only
- backend/API remains source of truth
- no direct DB access from UI
- no fake statuses
- no app/page.tsx change
- no `src/app` usage

## 12. Original Composition Registration Workflow Slice

Started first true guided registration workflow slice:

Start Song
-> Contributors & Splits
-> Readiness
-> Submission Intent
-> Queue Created
-> Lifecycle Tracking

Implemented as isolated TEST route:

- `app/registration-workflow-test/page.tsx`

Scope:

- original composition registration only
- progressive disclosure
- local recovery draft before backend creation
- backend work creation through existing `POST /api/songs/create`
- readiness through existing `GET /api/submissions/readiness?work_id=...`
- queue creation through existing `POST /api/submissions/create-from-work`
- lifecycle tracking through existing `GET /api/submissions/lifecycle?work_id=...`

Governance preserved:

- no `app/page.tsx` redesign
- no `src/app` usage
- no direct DB calls from UI
- no fake lifecycle state
- no schema changes
- no new backend APIs

Deferred:

- advanced evidence persistence
- recording/release flows
- CAPASSO advanced mandates
- neighboring rights
- payout systems
- disputes
- human-review tooling

## 13. Submission Queue Guard And Workflow Confirmation Fix

Applied small targeted workflow hardening:

- `POST /api/submissions/create-from-work` now validates `work_id` exists in `musical_works`
- missing `work_id` remains `400`
- unknown `work_id` returns `404` with `WORK_NOT_FOUND`
- readiness is evaluated server-side before queue creation
- failed readiness returns `400` with `READINESS_BLOCKED` and readiness issues
- queue item creation only proceeds when the work exists and `readiness.ready === true`
- isolated workflow page now shows clearer backend confirmation:
  - work title
  - `work_id`
  - `asset_id`
  - contributor count
  - split total
  - readiness state/issues
  - queue state
  - lifecycle state/counts

Governance preserved:

- no schema changes
- no `app/page.tsx` changes
- no `src/app` usage
- no direct DB calls from UI
- no fake lifecycle state
- no backend draft persistence added

## 14. Operational UX Governance Framework

Created canonical Operational UX Governance source of truth:

- `docs/platform/OPERATIONAL-UX-GOVERNANCE.md`

Purpose:

- define governed UX behavior rules for current and future generated UI/workflows
- preserve backend operational truth
- enforce progressive disclosure
- require visible persistence and explicit confirmation
- prevent fake statuses, hidden blockers, silent state changes, and unsafe workflow progression
- constrain AI-generated interfaces to backend-governed operational state

Framework links updated:

- `docs/platform/APP-BUILD-EXECUTION-FRAMEWORK.md`
- `docs/platform/APP-USER-EXPERIENCE-FLOW-FRAMEWORK.md`
- `docs/platform/APP-BUILD-MILESTONE-TRACKER.md`
- `docs/build-log/BUILD-LOG.md`

Governance preserved:

- documentation only
- no UI redesign
- no schema changes
- no backend changes

## 15. Platform Service Offering And App-Level Journey Flow

Created canonical product/app-flow references:

- `docs/platform/SENTRY-SOUND-PLATFORM-SERVICE-OFFERING.md`
- `docs/platform/APP-LEVEL-USER-JOURNEY-FLOW.md`

Purpose:

- define what Sentry Sound Platform offers
- define who it serves
- define the operational problems it solves
- define primary user outcomes
- define the dashboard as the operational command centre
- define user intent paths from dashboard into workflow routes
- define dashboard UX rules before future app expansion

Framework links updated:

- `docs/platform/APP-BUILD-EXECUTION-FRAMEWORK.md`
- `docs/platform/APP-USER-EXPERIENCE-FLOW-FRAMEWORK.md`
- `docs/platform/APP-BUILD-MILESTONE-TRACKER.md`
- `docs/build-log/BUILD-LOG.md`

Governance preserved:

- documentation only
- no code
- no UI implementation
- no schema changes

## 16. Dashboard Capability Alignment Matrix

Created canonical dashboard-to-backend alignment reference:

- `docs/platform/DASHBOARD-CAPABILITY-ALIGNMENT-MATRIX.md`

Purpose:

- align dashboard UX areas with operational user intents
- classify existing backend/API/workflow support
- identify missing logic, persistence, and governance
- distinguish working, partial, conceptual, and deferred capabilities
- guide future dashboard/workflow implementation without fake metrics or unsupported operational UI

Framework links updated:

- `docs/platform/APP-LEVEL-USER-JOURNEY-FLOW.md`
- `docs/platform/APP-USER-EXPERIENCE-FLOW-FRAMEWORK.md`
- `docs/platform/APP-BUILD-MILESTONE-TRACKER.md`
- `docs/build-log/BUILD-LOG.md`

Governance preserved:

- documentation only
- no visual UI design
- no code
- no schema changes
- no backend changes

## 17. Platform Ecosystem Domain Architecture

Created canonical platform ecosystem domain architecture reference:

- `docs/platform/PLATFORM-ECOSYSTEM-DOMAIN-ARCHITECTURE.md`

Purpose:

- document the major operational domains of Sentry Sound Platform
- inspect existing docs, APIs, backend services, SQL, Prisma models, and current TEST workflow support
- separate implemented, partial, conceptual, deferred, and recommended domain support
- prevent future platform work from overclaiming maturity
- keep future development sequenced around the current working vertical slice:
  - capture
  - contributors
  - readiness
  - queue
  - lifecycle

Governance preserved:

- documentation/system inspection only
- no app UI changes
- no schema changes
- no migrations
- no backend logic changes

## 18. Platform Foundation Domain Architecture

Created canonical Platform Foundation domain architecture reference:

- `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`

Purpose:

- document Platform Foundation as the base layer before song capture, rights, registration, evidence, submissions, royalties, finance, legal, marketing, booking, and workflow execution
- define the foundation question: who is acting, for which workspace/entity, under what authority, under which legal/commercial terms, and with what audit trail
- document workspace/organization model, workspace types, core fields, onboarding flow, dependency rules, legal protection principle, and current maturity status
- classify current support as implemented, partial, conceptual, deferred, or recommendation

Governance preserved:

- documentation only
- no app UI changes
- no schema changes
- no migrations
- no backend logic changes

## 19. Platform Foundation V1 Minimum Requirements

Created canonical Platform Foundation V1 minimum requirements reference:

- `docs/platform/PLATFORM-FOUNDATION-V1-MINIMUM-REQUIREMENTS.md`

Purpose:

- define minimum workspace/organization, user identity, role/access, legal/entity profile, onboarding, jurisdiction/country/currency/VAT, audit/governance, and operational dependency requirements
- classify what is implemented now, partial, and deferred
- define what blocks song capture from becoming production-ready
- convert Platform Foundation architecture into production-readiness gates for downstream operational domains

Governance preserved:

- documentation only
- no code changes
- no app UI changes
- no schema changes
- no migrations
- no backend logic changes

## 20. Platform Foundation Enforcement Chain

Created canonical Platform Foundation enforcement chain reference:

- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`

Purpose:

- define the required foundation enforcement order before production-sensitive mutations
- bridge existing Clerk, user profile, workspace, membership, RBAC, onboarding, terms, audit, notification, approval, and finance-context foundations into app/dashboard and rights/registration workflows
- document enforcement chains for dashboard access, song capture, contributors, readiness, submissions, evidence, approvals, lifecycle actions, finance/royalty actions, legal/dispute actions, and admin/settings actions
- lock the TEST vs production boundary for current song capture

Governance preserved:

- documentation only
- no code changes
- no app UI changes
- no schema changes
- no migrations
- no backend logic changes

## 21. Operational Ownership vs Rights Ownership

Created canonical ownership-separation architecture reference:

- `docs/platform/OPERATIONAL-OWNERSHIP-VS-RIGHTS-OWNERSHIP.md`

Purpose:

- define the distinction between platform operational ownership, user/action accountability, and music rights ownership
- prevent workspace owners or capture users from being treated as automatic rightsholders
- clarify that contributors/rightsholders may not be platform users
- define submission authority as separate from workspace access and user action
- establish future rights transfer as a governed workflow, not a simple field edit
- guide future modeling around `PlatformUser`, `Workspace`, `WorkspaceMembership` / `Role`, `RightsEntity`, `ContributorRole` / `WorkContributor`, `RightsShare`, `Authority` / `Mandate`, `SubmissionActor`, and `AuditEvent`

Governance preserved:

- documentation only
- no code changes
- no app UI changes
- no schema changes
- no migrations
- no backend logic changes

## 22. Production Mutation Governance Pattern

Created canonical production mutation governance reference:

- `docs/platform/PRODUCTION-MUTATION-GOVERNANCE-PATTERN.md`

Purpose:

- define production-sensitive mutations
- define the standard backend chain from request through auth, profile, workspace, permission, subscription entitlement where required, terms, ownership/scope, business validation, mutation, audit, and response
- define TEST vs production route separation
- document future `withProductionMutationGuard` style wrapper concept
- classify current known routes by production readiness
- preserve the do-not-rebuild rule for Clerk, workspace, RBAC, invitation, and audit foundations
- identify production-safe song capture wrapper/route as the recommended first alignment target

Governance preserved:

- documentation only
- no code changes
- no app UI changes
- no schema changes
- no migrations
- no backend logic changes

## 23. Platform Subscription and Access Model

Created canonical platform subscription and access model reference:

- `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`

Purpose:

- define workspace plan, user role, collaborator access, feature entitlement, usage allowance, action gate, and upgrade path concepts
- define conceptual plan categories: TEST / Demo Plan, Free / Invited Contributor Access, Artist Starter, Artist Pro, Producer / Studio, Label / Publisher, and Enterprise / Admin Company
- define allowance categories for works, submissions, team users, collaborators, evidence storage, file vault, royalties/finance, marketing, booking, reports/exports, AI help, and workflow automation
- define action gate expectations across plan categories
- clarify that invited contributors/rightsholders should have limited free access for basic approval/evidence actions
- preserve the distinction between subscription access and music rights ownership
- place subscription entitlement after workspace/role and before terms/action execution in production mutation governance
- mark billing/provider implementation as deferred

## 24. Platform Subscription Entitlement Matrix V1

Created canonical subscription entitlement matrix and backend existence analysis:

- `docs/platform/PLATFORM_SUBSCRIPTION_ENTITLEMENT_MATRIX_V1.md`

Purpose:

- define the first tier-by-tier subscription entitlement matrix for `TEST_DEMO_PLAN`, `FREE_INVITED_CONTRIBUTOR_ACCESS`, `ARTIST_STARTER`, `ARTIST_PRO`, `PRODUCER_STUDIO`, `LABEL_PUBLISHER`, and `ENTERPRISE_ADMIN_COMPANY`
- include South African affordability positioning and conceptual pricing bands without implementing billing
- map workspace, team, catalogue, submission, evidence, collaborator, dashboard, AI, API, report, finance, automation, governance, production readiness, upgrade, and deferred/future dimensions
- inspect existing backend support for subscription plans, entitlement, quotas, feature gates, billing, usage counters, dashboard checks, production mutation entitlement steps, and invited contributor access
- confirm that backend subscription/entitlement enforcement is not yet implemented
- preserve current song capture, submission, lifecycle, and evidence workflows as TEST-only or partial until foundation plus subscription entitlement enforcement exists

## 25. Platform Entitlement Backend Contract V1

Created canonical backend entitlement contract design:

- `docs/platform/PLATFORM_ENTITLEMENT_BACKEND_CONTRACT_V1.md`

Purpose:

- define entitlement contract purpose and scope before build
- define workspace plan/status resolution concepts
- preserve user role vs workspace plan separation
- separate invited contributor access from paid workspace plans and normal workspace invitations
- define feature entitlement categories, quota/usage read-model concepts, action gate statuses, and entitlement decision result shape
- place entitlement after auth/workspace/RBAC and before terms/ownership/validation/mutation/audit
- define production mutation guard integration, dashboard read-only use, TEST mode behavior, deferred billing boundaries, missing backend components, and recommended future implementation sequence
- preserve current song capture, submission, evidence, and lifecycle workflows as TEST-only or partial

Governance preserved:

- documentation only
- no code changes
- no app UI changes
- no schema changes
- no migrations
- no billing implementation
