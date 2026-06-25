# Sentry Sound Platform - Production Mutation Governance Pattern

## 1. Purpose

This document defines the standard backend governance pattern that all production-sensitive mutations must follow.

It translates Platform Foundation requirements into a route/service execution pattern for production-safe backend changes.

This is design and governance documentation only.

It does not define code changes, UI changes, schema changes, migrations, or implementation work.

## 2. Definition Of Production-Sensitive Mutation

A production-sensitive mutation is any backend action that can create, change, submit, approve, reject, transfer, expose, or financially affect operational or rights-bearing state.

Production-sensitive mutations include:

- creating production assets, songs, works, recordings, releases, or rights records
- adding, editing, confirming, or removing contributors, splits, publishers, mandates, or rightsholders
- linking, uploading, verifying, rejecting, superseding, or deleting evidence
- creating submission intent or submission queue records
- changing submission, evidence, dispute, approval, royalty, payout, or lifecycle status
- approving reviews, overrides, corrections, transfers, or governed workflow actions
- opening, updating, resolving, or closing disputes
- changing workspace legal/entity, role, permission, member, country, currency, tax, or billing settings
- creating finance, royalty, settlement, tax, payout, or reconciliation records
- exporting regulated, financial, legal, or rights-sensitive data

If a route can affect downstream legal, rights, registration, finance, audit, or workflow state, it must be treated as production-sensitive unless explicitly marked TEST-only.

## 3. Standard Mutation Chain

Canonical chain:

Request
-> auth
-> profile
-> workspace
-> role/permission
-> subscription entitlement
-> terms
-> ownership/scope
-> business validation
-> mutation
-> audit
-> response

Expanded backend route/service chain:

1. Receive request.
2. Authenticate actor.
3. Sync or verify user profile.
4. Resolve active workspace context.
5. Verify workspace membership.
6. Verify role and permission for the requested resource/action.
7. Verify workspace subscription entitlement where required.
8. Verify accepted legal/terms framework and minimum onboarding gates.
9. Verify target entity belongs to the resolved workspace or is valid for creation in that workspace.
10. Preserve separation between operational actor, workspace/account, and rights entity/rightsholder.
11. Run business validation.
12. Execute mutation through a governed service boundary.
13. Write audit/activity/lifecycle event.
14. Return backend truth, including success, blocker, lifecycle, or validation result.

If any required step fails, the route must block the mutation and return a clear error, blocker, or read-only diagnostic response.

## 4. TEST vs Production Route Separation

TEST routes may bypass parts of the production chain only when they are:

- explicitly named, documented, and labeled TEST
- isolated from production dashboard or production navigation
- bounded to prototype validation or operational diagnostics
- prevented from being represented as production-safe
- not reused silently as production routes

Production routes must not rely on:

- local-only UI state
- unscoped `work_id` or `entity_id` parameters
- service-role writes without route-level actor/workspace governance
- hard-coded workspace or admin role assumptions
- TEST route names or TEST workflow contracts
- client-side validation as the only gate

Current TEST song capture may remain isolated while a production-safe capture wrapper or route is built.

## 5. Future Guard / Wrapper Concept

A future backend helper such as `withProductionMutationGuard` may standardize production route enforcement.

Conceptual responsibilities:

- require authenticated actor
- sync or verify user profile
- resolve workspace context
- verify active workspace membership
- check RBAC permission
- verify subscription entitlement where required
- verify terms/onboarding gates
- verify workspace-scoped target ownership
- attach actor/workspace/permission context to the handler
- require business validation result before mutation
- write audit or require the handler to return audit details
- return consistent blocked/forbidden/validation responses

Conceptual shape:

```text
withProductionMutationGuard(
  {
    resource,
    action,
    targetResolver,
    requireTerms: true,
    requireWorkspaceScope: true,
  },
  async (context, input) => {
    validate business rules
    perform governed mutation
    return auditable response
  }
)
```

This is a future pattern recommendation, not an implementation requirement in this document.

Current implementation position:

- A pure injected production mutation guard contract exists in `src/lib/authz/guards/production-mutation-guard-contract.ts`.
- The injected runner exists in `src/lib/authz/guards/with-production-mutation-guard-contract.ts`.
- The contract proves gate order, fail-closed behavior, handler blocking, thrown-gate handling, structured errors, and audit handoff shape.
- It does not resolve real auth, profile, workspace, RBAC, entitlement, terms, ownership/scope, business validation, or audit persistence.
- It is not wired to any route and must not be treated as production activation.
- Current song, submission, and evidence routes remain TEST-only, partial, or unsafe until a later approved production wrapper enforces the complete chain.

## 6. Workspace Ownership / Scoping Rules

Production records must be scoped to a workspace or explicitly proven safe as global reference data.

Workspace-scoped records include:

- works and rights-bearing assets
- contributors attached to workspace-managed works
- evidence and file references
- submission queue records
- lifecycle events
- blocker/readiness summaries
- disputes and amendments
- workflow tasks and approvals
- finance, royalty, payout, and settlement records
- dashboard summaries and activity rows

Route rules:

- Creation must write workspace context where applicable.
- Reads must filter by workspace unless the data is confirmed public/reference-only.
- Updates must verify the target belongs to the resolved workspace.
- Submission and lifecycle actions must verify the work and queue item belong to the workspace.
- Dashboard APIs must not aggregate global operational data into production cards.

Workspace ownership is operational scoping. It is not proof of copyright, publishing, master, or royalty ownership.

## 7. Operational Ownership vs Rights Ownership Implications

Production mutation governance must preserve the separation defined in `docs/platform/OPERATIONAL-OWNERSHIP-VS-RIGHTS-OWNERSHIP.md`.

Required distinction:

- actor: authenticated platform user or approved system actor
- workspace: operational account/environment where the action occurs
- rights entity: person or legal entity that owns, controls, administers, or receives rights/royalties
- authority: evidence, mandate, terms, or legal basis that allows the workspace or actor to act
- audit event: operational accountability for what happened in the platform

Rules:

- Do not treat the capture user as the rightsholder.
- Do not treat the workspace owner as the copyright owner.
- Do not treat a platform role as royalty entitlement.
- Do not treat an audit event as chain-of-title proof.
- Do not treat submission action as proof of submission authority.
- Do not make rights transfer a simple metadata edit.

## 8. Audit Event Requirements

Every production-sensitive mutation must produce or trigger a durable audit/activity/lifecycle event appropriate to the action.

Minimum audit envelope:

- event type
- actor id
- actor type where available
- workspace id
- permission/resource/action context
- target entity type
- target entity id
- route/service/source
- request correlation id where available
- before state where applicable
- after state where applicable
- validation result or blocker result where applicable
- authority/evidence reference where applicable
- server timestamp

Audit requirements by route type:

- create mutations must record actor, workspace, entity, and created state
- update mutations must record actor, workspace, target, and before/after where practical
- submission mutations must record readiness result, submission target, authority basis, and queue/lifecycle state
- approval/override mutations must record reviewer authority and reason
- rights transfer mutations must record affected rights, evidence, approval/review state, and lifecycle state
- failed authorization should be logged through authorization audit where practical
- TEST preview events must be clearly labeled as preview or non-production

Audit logs are not rights ownership records. They are operational accountability records.

Current durable audit handoff position:

- A pure durable audit event contract exists in `src/lib/authz/audit/production-mutation-audit-contract.ts`.
- A pure builder exists in `src/lib/authz/audit/build-production-mutation-audit-event.ts`.
- The builder maps Phase 7A `ProductionMutationAuditHandoff` output into blocked, executed, or failed production mutation audit event shapes.
- It preserves gate trail, entitlement metadata, mutation metadata, and TEST/non-production markers.
- It validates required audit fields and fails closed when required handoff data is missing.
- It does not write to the database, create schema, run migrations, create middleware, wire routes, activate an event bus/outbox, or make any route production-safe.

## 9. Business Validation Requirements

Foundation checks answer whether the actor may attempt the action.

Business validation answers whether the action is valid for the domain.

Examples:

- song capture must validate required metadata and contributor/split rules
- contributor changes must validate roles, percentages, totals, and affected readiness state
- readiness checks must validate work existence, contributor completeness, split totals, and evidence impact where applicable
- submission queue creation must validate work readiness, duplicate guard, target/regulator compatibility, authority, and evidence blockers
- lifecycle transitions must validate allowed transition and source of truth
- evidence actions must validate evidence type, related entity, persistence availability, verification state, and supersession rules
- finance/royalty actions must validate currency, tax, period, entitlement, approval, and hold/release rules
- dispute actions must validate standing, affected rights, evidence, review state, and immutable history

Business validation must run server-side and must not be replaced by UI validation.

## 10. Route Classification Statuses

Use these statuses when classifying routes:

| Status | Meaning |
| --- | --- |
| `TEST-only` | Explicit prototype or diagnostic route. May support real backend testing but must not be treated as production-safe. |
| `partial` | Some foundation or business logic exists, but required production checks are incomplete. |
| `production-candidate` | Route mostly follows the governance chain but has known final gaps such as terms, audit detail, or ownership check refinement. |
| `production-safe` | Route enforces auth, profile, workspace, membership, permission, terms where required, workspace scope, business validation, mutation boundary, audit, and truthful response. |
| `unsafe for production` | Route performs or exposes sensitive behavior without required foundation or scope enforcement. |

Status must be based on implementation reality, not intended future design.

## 11. Current Known Route Classifications

| Route/action | Current classification | Reason |
| --- | --- | --- |
| `app/registration-workflow-test/page.tsx` | `TEST-only` | Isolated guided TEST workflow for original composition capture/readiness/queue/lifecycle. |
| `POST /api/songs/create` | `TEST-only / unsafe for production` | Creates rights-bearing records without auth, workspace, permission, terms, workspace ownership, or audit. |
| `GET /api/submissions/readiness` | `partial / TEST-only` | Performs useful readiness validation, but does not enforce actor/workspace visibility. |
| `POST /api/submissions/create-from-work` | `unsafe for production until guarded` | Mutates submission queue after readiness, but lacks auth, workspace, permission, terms, authority, and audit chain. |
| `GET /api/submissions/lifecycle` | `partial / unsafe until scoped` | Reads lifecycle state, but is not workspace-scoped or permission-gated. |
| `GET /api/evidence-readiness` | `TEST-only / partial` | Read-only evidence readiness exists and fails closed, but lacks production auth/workspace/scope enforcement. |
| Workspace invitation create | `partial / close to production` | Uses workspace context and permission checks, but still needs full production terms/audit alignment. |
| Finance test guard | `partial / best current reference pattern` | Uses a permission guard pattern and authorization audit, but remains a reference pattern rather than full production finance governance. |

These classifications should be revisited when routes are wrapped in a production mutation guard or otherwise aligned with the standard chain.

## 12. Do-Not-Rebuild Rule

Do not rebuild existing foundation systems.

Production mutation alignment must reuse:

- Clerk authentication helpers
- user profile sync patterns
- workspace context helpers
- workspace membership and role tables
- RBAC permission helpers
- workspace invitation helpers
- authorization audit helpers
- existing registration/readiness/queue business validation where applicable

New work should close missing gates and route integration gaps. It should not create a parallel auth, workspace, RBAC, invitation, or audit system.

## 13. Recommended First Production Alignment Target

The recommended first production alignment target is a production-safe song capture wrapper or route.

Reason:

- song capture is the start of the operational chain
- captured works create downstream readiness, evidence, submission, lifecycle, royalty, and dispute implications
- current TEST capture works as a useful prototype but lacks production foundation enforcement
- production-safe capture creates the workspace-scoped base for later dashboard, readiness, evidence, and submission alignment

Minimum target behavior:

- require authenticated actor
- sync/verify user profile
- resolve workspace
- verify membership
- verify create-work permission
- verify workspace plan entitlement for production capture
- verify terms/onboarding gates
- create workspace-scoped asset/work records
- preserve contributor/rightsholder separation
- run existing song/contributor business validation
- write audit/activity event
- return backend truth with work id, asset id, workspace id, and readiness-relevant summary

This should be a wrapper or production route around existing logic where possible, not a rewrite of the whole registration system.

## 14. Source Of Truth Relationship

This document complements:

- `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`
- `docs/platform/PLATFORM-FOUNDATION-V1-MINIMUM-REQUIREMENTS.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- `docs/platform/OPERATIONAL-OWNERSHIP-VS-RIGHTS-OWNERSHIP.md`
- `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`
- `docs/platform/PLATFORM_ENTITLEMENT_BACKEND_CONTRACT_V1.md`
- `docs/platform/PLATFORM-ECOSYSTEM-DOMAIN-ARCHITECTURE.md`
- `docs/platform/APP-LEVEL-USER-JOURNEY-FLOW.md`
- `docs/platform/DASHBOARD-CAPABILITY-ALIGNMENT-MATRIX.md`

Use it when evaluating, designing, or implementing any production-sensitive route, service, job, workflow action, dashboard quick action, or backend mutation.
