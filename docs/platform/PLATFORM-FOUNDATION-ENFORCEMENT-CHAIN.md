# Sentry Sound Platform - Platform Foundation Enforcement Chain

## 1. Purpose

This document defines how existing Platform Foundation systems must be enforced before production-sensitive workflows are allowed.

The standard backend route/service mutation pattern for those actions is defined in `docs/platform/PRODUCTION-MUTATION-GOVERNANCE-PATTERN.md`.

Workspace subscription and entitlement gates are defined conceptually in `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`. The backend-facing entitlement contract is defined in `docs/platform/PLATFORM_ENTITLEMENT_BACKEND_CONTRACT_V1.md`.

It bridges:

- existing authentication, workspace, RBAC, onboarding, invitation, audit, finance-context, notification, and approval foundations
- app and dashboard workflows
- rights, registration, evidence, submission, royalty, finance, legal, and admin workflows
- production-safe mutations
- operational ownership, actor accountability, and music rights ownership separation

This is design and governance documentation only.

It does not define code changes, UI changes, schema changes, or migrations.

## 2. Existing Foundation Systems To Reuse

Do not rebuild auth, workspace, or RBAC systems.

Reuse and align the implemented foundation systems already present in the repo:

| Foundation system | Existing support | Current status |
| --- | --- | --- |
| Clerk authentication | `src/lib/authz/get-current-clerk-user.ts`, `app/api/authz/me/route.ts` | `[partial]` |
| User profile sync | `src/lib/authz/clerk-sync/sync-clerk-user.ts`, `user_profiles` | `[partial]` |
| Workspace model | `workspaces`, `workspace_settings`, `workspace_activity`, `app/api/workspaces/route.ts` | `[partial]` |
| Workspace membership / role assignment | `workspace_user_roles`, `workspace_members`, workspace invitation helpers | `[partial]` |
| RBAC permission map | `src/lib/rbac/*`, `src/lib/authz/require-permission.ts`, `rbac_roles`, `rbac_permissions`, `rbac_role_permissions` | `[partial]` |
| Workspace context | `src/lib/workspace-context/get-authenticated-workspace-context.ts`, `src/lib/authz/workspace-context/resolve-workspace-context.ts` | `[partial]` |
| Onboarding bootstrap | `src/lib/onboarding/bootstrap-authenticated-user.ts`, `app/api/onboarding/bootstrap/route.ts` | `[partial]` |
| Authorization audit | `authorization_audit_events`, `src/lib/authz/log-authorization-event.ts` | `[partial]` |
| Country/currency/tax support | workspace `country_code` / `base_currency`, finance country/currency/tax routes and tables | `[partial]` |
| Notifications | notification migrations and `src/lib/notifications/*` | `[partial]` |
| Approvals | approval workflow migrations and `src/lib/approval-workflows/*` | `[partial]` |

Current limitation:

- These systems exist, but they are not yet uniformly enforced across production-sensitive music-rights routes.
- The current create/capture song path remains a TEST workflow until it requires foundation context.

## 3. Core Enforcement Principle

Before any production-sensitive mutation, the platform must enforce:

1. authenticated user
2. synced user profile
3. resolved workspace
4. verified workspace membership
5. verified role/permission
6. verified subscription entitlement where required
7. accepted legal/terms framework
8. workspace ownership/context
9. audit actor/event
10. governed mutation

The chain must also preserve the ownership separation defined in `docs/platform/OPERATIONAL-OWNERSHIP-VS-RIGHTS-OWNERSHIP.md`: the authenticated actor, workspace/account, and rights entity/rightsholder are related but separate concepts.

If any required step is missing, the platform must block the mutation, keep the action read-only, or explicitly label the workflow as TEST-only.

## 4. Foundation Enforcement Chain Diagram

Canonical enforcement chain:

Clerk session
-> `user_profiles`
-> selected/resolved workspace
-> `workspace_user_roles`
-> role + permission check
-> legal/terms acceptance
-> workspace-scoped entity context
-> audit actor/event envelope
-> governed mutation
-> lifecycle/readiness/activity result

Expanded route-level chain:

Request
-> authenticate actor
-> sync/verify user profile
-> resolve workspace context
-> verify active workspace
-> verify workspace membership
-> verify permission for resource/action
-> verify subscription entitlement where required
-> verify onboarding and terms gates
-> verify target record belongs to workspace
-> verify actor/workspace authority is not being confused with rights ownership
-> execute mutation through governed service
-> write audit/activity/lifecycle event
-> return backend truth to UI

## 5. TEST vs Production Boundary

The current original-composition song capture flow is valid as a TEST workflow only.

Current TEST support:

- `POST /api/songs/create`
- `src/lib/registration/services/create-song-with-contributors.ts`
- `sql/platform/rpc_create_song_with_contributors.sql`
- `GET /api/submissions/readiness?work_id=...`
- `POST /api/submissions/create-from-work`
- `GET /api/submissions/lifecycle?work_id=...`
- `app/registration-workflow-test/page.tsx`

Production boundary:

- Production song capture must not bypass authentication.
- Production song capture must not create unscoped assets or works.
- Production submission queue creation must not bypass workspace ownership, permission, terms, jurisdiction, readiness, and audit checks.
- TEST workflows may continue only when explicitly labeled and isolated.

## 6. Dashboard Rule

Dashboard must not show production operational cards unless data is workspace-scoped and foundation-governed.

Dashboard cards, counts, quick actions, blockers, lifecycle rows, readiness summaries, and recent activity must be derived from:

- authenticated actor context
- selected workspace context
- workspace-owned records
- authorized visibility
- real backend state
- auditable or traceable workflow events where applicable

Dashboard must not present:

- local-only draft data as backend truth
- global/unscoped song rows as production catalogue data
- fake metrics
- unsupported modules as live operations
- production quick actions that bypass foundation enforcement

## 7. Reuse Rule

Do not rebuild auth, workspace, RBAC, onboarding, invitation, audit, notification, approval, or finance-context systems.

Production alignment must reuse the existing foundation systems first, then close enforcement gaps around them.

New foundation work should be limited to missing gates that do not currently exist, especially:

- legal/terms acceptance
- explicit production onboarding completion
- workspace-scoped ownership for active rights records
- standard actor/workspace audit envelopes for production-sensitive mutations

## 8. Song Capture Rule

Production capture must require:

- authenticated actor
- synced user profile
- selected/resolved workspace
- active workspace membership
- create-work or create-rights-asset permission
- workspace plan entitlement for production capture
- accepted legal/terms framework
- workspace-scoped asset/work persistence
- separately modeled contributor/rightsholder identity
- actor/workspace audit event
- governed backend mutation

Until those checks are enforced, capture remains TEST-only or pre-production.

## 9. Action Enforcement Matrix

### 1. Dashboard Access

| Item | Definition |
| --- | --- |
| Required foundation checks | Authenticated user, synced profile, resolved workspace, active membership, onboarding state, terms acceptance for production surfaces, role-based visibility. |
| Existing system support | Clerk auth helper, `user_profiles`, workspace context resolvers, `workspace_user_roles`, RBAC permission map, app-level journey docs. |
| Current gap | No confirmed production dashboard gate; no workspace-scoped registration summary API yet. |
| Production risk if missing | User may see global or unsupported operational state, fake readiness, or records outside their workspace. |
| Recommended alignment step | Make dashboard data access depend on workspace context, then build read-only workspace-scoped summaries. |
| Current status | `[partial]` |

### 2. Create / Capture Song

| Item | Definition |
| --- | --- |
| Required foundation checks | Authenticated user, synced profile, workspace context, active membership, create-work permission, terms accepted, workspace-scoped asset/work, audit event. |
| Existing system support | `POST /api/songs/create`, create-song RPC, Clerk helper, workspace context helpers, RBAC helpers, authorization audit helper. |
| Current gap | Active capture route does not enforce auth, workspace, permission, terms, workspace ownership, or audit actor/event. |
| Production risk if missing | Rights-bearing records can be created without owner, actor authority, legal accountability, or audit traceability. |
| Recommended alignment step | Wrap production capture in the foundation chain before calling the existing create-song service/RPC. |
| Current status | `[TEST-only / partial]` |

### 3. Add / Edit Contributors

| Item | Definition |
| --- | --- |
| Required foundation checks | Authenticated user, workspace-owned work, contributor/split permission, split validation, terms/authority context, rights-entity separation, audit event. |
| Existing system support | `contributors`, `work_contributors`, create-song RPC initial contributor write, readiness split validation. |
| Current gap | Initial contributor creation exists, but governed post-create add/edit, collaborator confirmation, and explicit separation between system collaborator and song rightsholder are not active. |
| Production risk if missing | Split changes may be unauthorised, unaudited, or legally indefensible. |
| Recommended alignment step | Define contributor/split permission, rights-entity identity, and audit requirements before adding edit controls. |
| Current status | `[partial]` |

### 4. Check Readiness

| Item | Definition |
| --- | --- |
| Required foundation checks | Authenticated user for production views, workspace-owned work, visibility permission, backend readiness evaluation, traceable result. |
| Existing system support | `GET /api/submissions/readiness?work_id=...`, `getSubmissionReadiness`, readiness blockers. |
| Current gap | Readiness checks do not enforce workspace visibility or actor context. |
| Production risk if missing | Users may inspect readiness for records outside their workspace or rely on unscoped validation. |
| Recommended alignment step | Require workspace ownership and visibility permission before returning production readiness. |
| Current status | `[partial]` |

### 5. Queue Submission

| Item | Definition |
| --- | --- |
| Required foundation checks | Authenticated user, workspace-owned ready work, submission permission, accepted terms, jurisdiction/regulator context, duplicate guard, audit event. |
| Existing system support | `POST /api/submissions/create-from-work`, readiness guard, duplicate fingerprint, `SubmissionQueue.workspaceId` field. |
| Current gap | `workspaceId` is optional and not passed by current queue creation; route does not enforce actor/workspace/permission/terms. |
| Production risk if missing | Submission queue can contain unowned or unauthorised work with weak regulator defensibility. |
| Recommended alignment step | Require workspace context and persist `workspaceId` on queue items before production submission. |
| Current status | `[TEST-only / partial]` |

### 6. Upload / Link Evidence

| Item | Definition |
| --- | --- |
| Required foundation checks | Authenticated user, workspace-owned entity, evidence permission, evidence policy, storage/persistence availability, audit event. |
| Existing system support | `GET /api/evidence-readiness?work_id=...`, `RegistrationEvidence`, `EvidenceAuditEvent`, evidence readiness fail-closed behavior. |
| Current gap | Upload/link/review workflow is deferred; evidence persistence alignment has known risk. |
| Production risk if missing | Evidence could be linked to the wrong owner, accepted without authority, or used despite storage mismatch. |
| Recommended alignment step | Keep evidence read-only until persistence and workspace-scoped upload/link authority are confirmed. |
| Current status | `[partial / deferred for mutation]` |

### 7. Approve / Review Workflow

| Item | Definition |
| --- | --- |
| Required foundation checks | Authenticated reviewer, workspace context, review/approval permission, target entity ownership, approval state, audit/event emission. |
| Existing system support | approval workflow migrations, `src/lib/approval-workflows/*`, RBAC `approvals` permissions. |
| Current gap | Approval services are not integrated into active registration/capture flows; production review routes are not established. |
| Production risk if missing | Overrides or reviews may happen without authority, traceability, or consistent lifecycle state. |
| Recommended alignment step | Reuse approval workflow foundation later for explicit overrides/reviews after capture and submission are workspace-governed. |
| Current status | `[partial]` |

### 8. Lifecycle / Status Action

| Item | Definition |
| --- | --- |
| Required foundation checks | Authenticated user/system actor, workspace-owned queue/entity, transition permission, valid lifecycle transition, audit/lifecycle event. |
| Existing system support | `SubmissionQueue`, `SubmissionQueueEvent`, lifecycle API, update-status prototype route, registration lifecycle contracts. |
| Current gap | Lifecycle event coverage is incomplete; manual status update is not final production governance. |
| Production risk if missing | Status can drift from real regulator/workflow state, weakening audit and user trust. |
| Recommended alignment step | Treat manual status movement as prototype only; emit lifecycle events from governed backend transitions. |
| Current status | `[partial]` |

### 9. Financial / Royalty Action

| Item | Definition |
| --- | --- |
| Required foundation checks | Authenticated user, workspace/entity context, finance/royalty permission, country/currency/tax profile, ownership/split authority, audit event. |
| Existing system support | broad finance APIs, protected finance patterns, finance country/currency/tax tables, royalty helpers. |
| Current gap | Finance/royalty operations are not integrated into the active music-rights workflow; some protected finance context is still placeholder-like. |
| Production risk if missing | Money movement, payout holds, VAT, and royalty allocation may run without legal or ownership basis. |
| Recommended alignment step | Keep finance/royalty disconnected from registration production until ownership, evidence, and foundation context are enforced. |
| Current status | `[partial / deferred for rights workflow]` |

### 10. Legal / Dispute Action

| Item | Definition |
| --- | --- |
| Required foundation checks | Authenticated user, legal/review permission, workspace/legal entity context, evidence references, immutable audit trail. |
| Existing system support | `RegistrationDispute`, `RegistrationAmendment`, contract/legal helpers, evidence types. |
| Current gap | No active legal/dispute workflow is exposed in the current registration route. |
| Production risk if missing | Disputes or legal holds may be opened or resolved without authority or chain-of-title defensibility. |
| Recommended alignment step | Keep dispute controls deferred; first expose read-only blocker/dispute indicators once evidence and ownership state are reliable. |
| Current status | `[partial / deferred for active UI]` |

### 11. Admin / Settings Action

| Item | Definition |
| --- | --- |
| Required foundation checks | Authenticated user, workspace context, active membership, admin/settings permission, audit event. |
| Existing system support | `requirePermission`, `settings` RBAC resource, workspace invitations require `settings:admin`, workspace APIs/settings tables. |
| Current gap | Some workspace/admin APIs use service-role operations without confirmed route-level auth/permission guards. |
| Production risk if missing | Workspace settings, members, or legal defaults may be changed without accountable authority. |
| Recommended alignment step | Apply the same workspace + RBAC + audit chain to production admin/settings routes. |
| Current status | `[partial]` |

## 10. Production-Sensitive Mutation Definition

Production-sensitive mutations include:

- creating production assets or musical works
- changing contributor identity or splits
- linking, uploading, verifying, superseding, or rejecting evidence
- creating submission intent or queue items
- changing submission lifecycle status
- approving overrides or reviews
- opening, updating, or resolving disputes
- changing workspace legal/entity settings
- inviting or changing user roles
- creating finance, royalty, payout, tax, or settlement records
- exporting regulated or financial data

These actions must go through the foundation enforcement chain.

## 11. Recommended Alignment Order

1. Consolidate the canonical workspace context contract.
2. Define the music-rights permission resources/actions using existing RBAC primitives.
3. Add legal/terms acceptance as a required gate for production mutations.
4. Make production song capture workspace-scoped.
5. Persist audit events for capture, contributor mutation, queue creation, and lifecycle movement.
6. Make readiness, lifecycle, and dashboard summaries workspace-filtered.
7. Keep evidence upload, finance/royalty actions, legal/dispute controls, and notifications deferred until their triggering states are workspace-governed.

## 12. Source Of Truth Relationship

This document operationalizes:

- `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`
- `docs/platform/PLATFORM-FOUNDATION-V1-MINIMUM-REQUIREMENTS.md`
- `docs/platform/PLATFORM-ECOSYSTEM-DOMAIN-ARCHITECTURE.md`
- `docs/platform/APP-LEVEL-USER-JOURNEY-FLOW.md`
- `docs/platform/DASHBOARD-CAPABILITY-ALIGNMENT-MATRIX.md`
- `docs/platform/OPERATIONAL-OWNERSHIP-VS-RIGHTS-OWNERSHIP.md`
- `docs/platform/PRODUCTION-MUTATION-GOVERNANCE-PATTERN.md`
- `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`

It defines the enforcement chain that production app, dashboard, rights, registration, evidence, submission, finance, royalty, legal, workflow, and admin actions must follow.
