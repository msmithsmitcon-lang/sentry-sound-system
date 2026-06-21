# Sentry Sound Platform - Entitlement Implementation Plan V1

## 1. Implementation Objective

This document defines the governed implementation plan for the Sentry Sound Platform entitlement subsystem.

The objective is to implement entitlement as a modular operational layer that can safely evaluate workspace plan access, feature gates, quota/usage limits, rollout states, enterprise overrides, dashboard visibility, and future request-scoped invited contributor access.

This plan does not authorize implementation.

Current song capture, submission, evidence, lifecycle, dashboard, finance, royalty, API, AI, workflow, marketing, booking, and enterprise capabilities must remain in their current maturity state until the relevant phase is approved, implemented, tested, and reviewed.

## 2. Non-Goals

This plan does not include:

- code changes in this step
- UI changes
- schema changes
- migrations
- route implementation
- production activation
- middleware implementation
- billing provider integration
- Stripe, Paystack, checkout, or payment webhooks
- turning TEST routes into production routes
- replacing Clerk auth
- replacing workspace context
- replacing RBAC
- replacing rights ownership validation
- replacing business validation
- replacing legal/terms acceptance
- building a monolithic subscription manager

Entitlement must remain separate from billing, RBAC, rights ownership, and business validation.

## 3. Required Phases

Implementation should proceed through these phases:

1. Entitlement constants/registry contract
2. Workspace plan/status read model
3. Entitlement decision service
4. Quota/usage read model
5. Entitlement guard helper
6. Dashboard read-only entitlement summary
7. Production mutation integration
8. Invited contributor access model
9. Billing/payment provider integration later

Each phase requires manual approval before implementation starts.

Each phase must preserve future subsystem extensibility.

## 4. Phase 1 - Entitlement Constants / Registry Contract

Purpose:

Define the internal constants and registry shape before any runtime enforcement exists.

Scope:

- plan keys
- access/subscription statuses
- feature keys
- action keys
- quota keys
- decision statuses
- reason codes
- rollout states
- beta/experimental states
- enterprise override source types
- deferred/test-only statuses

Implemented Phase 1 files:

- `src/lib/entitlements/types.ts`
- `src/lib/entitlements/plan-registry.ts`
- `src/lib/entitlements/capability-registry.ts`
- `src/lib/entitlements/index.ts`
- `src/lib/entitlements/entitlement-registry.test.ts`

Rules:

- no route changes
- no schema changes
- no billing
- no production enforcement
- registry must support future subsystem onboarding
- current platform features must not be treated as the final feature universe

Required tests:

- registry contains all current matrix tiers
- registry supports deferred, beta, experimental, enterprise-only, and TEST-only capability states
- unknown feature/action fails closed
- registry can accept future subsystem categories without changing evaluator logic

Docs to update:

- `docs/platform/PLATFORM_ENTITLEMENT_BACKEND_CONTRACT_V1.md`
- `docs/platform/PLATFORM_ENTITLEMENT_SYSTEM_ARCHITECTURE_V1.md`
- `docs/build-log/BUILD-LOG.md`

Approval gate:

Phase 1 approval has been used for the registry contract only.

Phase 1 does not approve workspace plan/status persistence, runtime entitlement resolution, quota read models, guards, middleware, billing, UI, route integration, or production mutation activation.

Phase 1 verification command:

```powershell
npx tsx src/lib/entitlements/entitlement-registry.test.ts
```

## 5. Phase 2 - Workspace Plan / Status Read Model

Purpose:

Create the read model that resolves a workspace's plan and entitlement status without billing provider dependency.

Scope:

- workspace id input
- plan key resolution
- status resolution
- production eligibility
- test/demo plan handling
- not-configured handling
- future override source slot
- future billing adapter slot

Implemented Phase 2 files:

- `src/lib/entitlements/resolve-workspace-plan.ts`
- `src/lib/entitlements/workspace-plan-context.ts`
- `src/lib/entitlements/workspace-plan-status.ts`
- `src/lib/entitlements/workspace-plan-context.test.ts`

Schema decision point:

No schema or migration was created for Phase 2.

Later production plan persistence may still need one of:

- explicit fields on `workspaces`
- a separate `workspace_plan_assignments` table
- a separate `workspace_subscriptions` table

No schema/migration should be created until a future persistence decision is approved.

Required tests:

- demo/test workspace resolves to `TEST_DEMO_PLAN`
- missing plan returns `not_configured`
- suspended/cancelled/not-configured states fail closed for production-sensitive actions
- resolver does not call billing provider
- resolver does not infer rights ownership

Docs to update:

- readiness audit if schema decision changes
- backend contract with final resolver shape
- build log

Approval gate:

Manual approval required for any schema decision.

Phase 2 implementation status:

- implemented typed `WorkspacePlanContext`
- implemented explicit `"Sentry Sound Demo Workspace"` fallback to `TEST_DEMO_PLAN`
- implemented fail-closed `not_configured` for non-demo workspaces without persisted plan
- implemented fail-closed suspended/inactive/unknown handling
- did not add DB persistence, schema, migration, middleware, route guard, workspace-context integration, billing, or production activation

Phase 2 verification command:

```powershell
npx tsx src/lib/entitlements/workspace-plan-context.test.ts
```

## 6. Phase 3 - Entitlement Decision Service

Purpose:

Implement a pure service that evaluates entitlement and returns a structured decision.

Scope:

- accepts actor/workspace/access context
- accepts feature key and action key
- accepts plan/status context
- accepts optional quota result
- accepts rollout/override context where available
- returns `EntitlementDecision`

Implemented Phase 3 files:

- `src/lib/entitlements/check-entitlement.ts`
- `src/lib/entitlements/entitlement-decision.ts`
- `src/lib/entitlements/entitlement-decision.test.ts`

Rules:

- pure decision service first
- no route mutation
- no production enforcement
- no billing
- no UI
- no direct business mutation

Required tests:

- allowed feature returns allowed decision
- unavailable feature returns blocked decision
- TEST-only feature blocks production context
- deferred feature blocks active production mutation
- unknown feature/action fails closed
- quota exceeded blocks or limits according to registry
- enterprise override can allow configured enterprise feature
- decision includes reason code and audit metadata

Docs to update:

- backend contract
- architecture if decision shape changes
- build log

Approval gate:

Manual approval required before the decision service is used by route guards.

Phase 3 implementation status:

- implemented `EntitlementDecision` types
- implemented `EntitlementDecisionStatus`
- implemented `EntitlementDecisionMode`
- implemented `CheckEntitlementInput`
- implemented pure deterministic `checkEntitlement()`
- implemented feature/action validation
- implemented fail-closed unknown feature/action handling
- implemented fail-closed workspace plan handling
- implemented rollout override behavior for `test_only` and `future_deferred`
- implemented limited/quota placeholder behavior
- implemented audit metadata shape
- did not add DB reads, schema, migrations, middleware, route guards, RBAC integration, workspace-context integration, Clerk/Supabase imports, dashboard APIs, billing, quota persistence, or production activation

Phase 3 verification command:

```powershell
cmd /c "npx tsx src/lib/entitlements/entitlement-decision.test.ts"
```

## 7. Phase 4 - Quota / Usage Read Model

Purpose:

Create read-only usage evaluation for allowance-backed entitlements.

Initial low-risk quota candidates:

- active works
- monthly submission queue items
- team users
- invited collaborators
- report exports later
- evidence item/storage usage later

Implemented Phase 4 files:

- `src/lib/entitlements/get-usage-counters.ts`
- `src/lib/entitlements/check-quota.ts`
- `src/lib/entitlements/quota-types.ts`
- `src/lib/entitlements/quota-read-model.test.ts`

Schema decision point:

Start with read-only count queries where safe. Add persisted counters only after performance, consistency, and reset-period needs are known.

Potential future schema:

- `workspace_usage_counters`
- `workspace_quota_events`
- materialized read models

Required tests:

- usage count returns current value and limit
- missing usage source fails closed for production mutation where required
- unlimited/custom quotas are handled explicitly
- request-scoped invited contributors are not counted as team users unless configured
- quota result is included in entitlement decision metadata

Docs to update:

- implementation readiness audit if schema/counter approach changes
- entitlement contract if quota shape changes
- build log

Approval gate:

Manual approval required before persistent counters or migrations.

Phase 4 implementation status:

- implemented quota types
- implemented quota periods
- implemented quota limit types
- implemented usage counter shape
- implemented pure deterministic `checkQuota()`
- implemented fail-closed unknown/missing behavior
- implemented unlimited/custom handling
- implemented injectable future provider boundary
- preserved compatibility with current `checkEntitlement()` quota input
- did not add DB reads, schema, migrations, Supabase imports, Prisma imports, middleware, route guards, billing, dashboard APIs, production activation, quota persistence, or song/submission/evidence route changes

Phase 4 verification command:

```powershell
cmd /c "npx tsx src/lib/entitlements/quota-read-model.test.ts"
```

## 8. Phase 5 - Entitlement Guard Helper

Purpose:

Create a reusable helper that composes workspace context, RBAC, entitlement, and audit metadata for future guarded actions.

Scope:

- not a production mutation guard yet
- may be read-only first
- should accept feature/action/quota configuration
- should return context and entitlement decision
- should fail closed on missing required entitlement context

Implemented Phase 5 files:

- `src/lib/entitlements/entitlement-guard.ts`
- `src/lib/entitlements/with-entitlement-guard.ts`
- `src/lib/entitlements/entitlement-guard.test.ts`
- `src/lib/entitlements/index.ts`

Deferred file:

- `src/lib/authz/guards/with-production-mutation-guard.ts`

Rules:

- do not replace `withPermissionGuard` abruptly
- do not mix entitlement directly into RBAC internals
- do not apply to TEST routes as production activation
- do not skip terms/ownership/business validation

Required tests:

- guard executes handler when entitlement allows
- guard blocks when entitlement denies
- guard blocks when optional prechecked RBAC denies
- guard blocks unknown feature
- guard blocks missing plan/status for production-sensitive action
- guard blocks demo workspace production mutation
- guard attaches structured decision metadata
- guard does not execute handler when blocked
- guard supports explicit TEST mode for TEST-only capability

Phase 5 implementation status:

- implemented `EntitlementGuardContext`
- implemented `EntitlementGuardConfig`
- implemented `EntitlementGuardResult`
- implemented pure `withEntitlementGuard()` helper
- implemented handler execution blocking
- implemented structured result handling
- implemented audit metadata handoff
- implemented fail-closed behavior through `checkEntitlement()`
- implemented optional RBAC prechecked input support
- did not add DB reads, Clerk imports, Supabase imports, Prisma imports, route wiring, middleware, schema, migrations, RBAC resolution, workspace-context resolution, billing, dashboard APIs, production activation, or song/submission/evidence route changes

Phase 5 verification command:

```powershell
cmd /c "npx tsx src/lib/entitlements/entitlement-guard.test.ts"
```

Approval gate:

Manual approval required before guard is applied to any route.

## 9. Phase 6 - Dashboard Read-Only Entitlement Summary

Purpose:

Expose read-only entitlement summaries for dashboard planning and visibility.

Scope:

- no production quick actions
- no mutation
- no fake metrics
- no global data aggregation
- returns capability/card/action statuses

Implemented Phase 6 files:

- `src/lib/entitlements/dashboard-entitlement-summary.ts`
- `src/lib/entitlements/dashboard-entitlement-summary.test.ts`
- `src/lib/entitlements/index.ts`

Deferred file:

- future read-only API route after approval

Dashboard status examples:

- `available`
- `limited`
- `upgrade_required`
- `permission_denied`
- `deferred`
- `test_only`
- `not_configured`
- `unavailable`
- `unknown`

Required tests:

- dashboard summary returns items
- unknown feature maps to `unknown` and disabled
- missing plan maps to `not_configured`
- deferred capability maps to `deferred`
- TEST-only capability is never production-ready
- limited production-sensitive item without quota is disabled
- allowed read-only item is visible
- audit metadata is included
- `productionReady` is always false

Phase 6 implementation status:

- implemented `DashboardEntitlementSummary` types
- implemented `DashboardEntitlementItem` types
- implemented display status mapping
- implemented pure `buildDashboardEntitlementSummary()`
- implemented default dashboard capability request list
- implemented decision-to-display mapper
- implemented audit metadata shape
- implemented fail-closed unknown handling
- implemented TEST/demo-safe behavior
- implemented `productionReady: false` for every item
- did not add UI, API routes, DB reads, Supabase imports, Prisma imports, Clerk imports, middleware, schema, migrations, billing, dashboard operational metrics, production activation, route wiring, or song/submission/evidence route changes

Phase 6 verification command:

```powershell
cmd /c "npx tsx src/lib/entitlements/dashboard-entitlement-summary.test.ts"
```

Approval gate:

Manual approval required before any dashboard UI consumes entitlement summary.

## 10. Phase 7 - Production Mutation Integration

Purpose:

Integrate entitlement into the production mutation chain after it has been proven through read-only and guard-level tests.

Initial production candidate:

- production-safe song capture wrapper or route

Must not:

- convert `POST /api/songs/create` TEST route into production silently
- bypass workspace context
- bypass RBAC
- bypass terms
- bypass ownership/scope validation
- bypass business validation
- bypass audit

Required chain:

```text
request
-> auth
-> profile
-> workspace context
-> RBAC
-> entitlement
-> terms/onboarding
-> ownership/scope
-> business validation
-> governed mutation
-> audit/event
-> response
```

Required tests:

- unauthenticated request blocked
- missing workspace blocked
- missing RBAC permission blocked
- missing/blocked entitlement blocked
- terms missing blocked where required
- target scope mismatch blocked
- invalid metadata/contributor split blocked
- successful mutation writes workspace-scoped record
- audit/event includes entitlement metadata
- TEST route remains isolated and unchanged unless explicitly approved

Implemented Phase 7A contract files:

- `src/lib/authz/guards/production-mutation-guard-contract.ts`
- `src/lib/authz/guards/with-production-mutation-guard-contract.ts`
- `src/lib/authz/guards/production-mutation-guard-contract.test.ts`

Phase 7A implementation status:

- implemented gate contract types
- implemented injected gate runner
- implemented strict gate-order execution
- implemented fail-closed behavior
- implemented thrown-gate handling
- implemented mutation-handler blocking
- implemented structured result/error shape
- implemented audit handoff envelope
- implemented deterministic tests
- did not add route edits, middleware, DB reads/writes, Clerk imports, Supabase imports, Prisma imports, schema, migrations, production activation, song/submission/evidence route changes, durable audit writes, or real auth/workspace/RBAC integrations

Phase 7A verification command:

```powershell
cmd /c "npx tsx src/lib/authz/guards/production-mutation-guard-contract.test.ts"
```

Implemented Phase 7B audit handoff files:

- `src/lib/authz/audit/production-mutation-audit-contract.ts`
- `src/lib/authz/audit/build-production-mutation-audit-event.ts`
- `src/lib/authz/audit/production-mutation-audit-contract.test.ts`

Phase 7B implementation status:

- implemented `ProductionMutationAuditEvent` types
- implemented durable gate-trail contract
- implemented pure `buildProductionMutationAuditEvent()`
- implemented blocked/executed/failed event mapping
- implemented entitlement metadata preservation
- implemented TEST/non-production marker support
- implemented fail-closed required field validation
- implemented deterministic tests
- did not add DB writes, schema, migrations, route integration, middleware, Clerk imports, Supabase imports, Prisma imports, production activation, event bus/outbox, durable audit persistence, or song/submission/evidence route changes

Phase 7B verification command:

```powershell
cmd /c "npx tsx src/lib/authz/audit/production-mutation-audit-contract.test.ts"
```

Docs to update:

- production mutation governance pattern
- foundation enforcement chain
- dashboard matrix if production summaries become available
- build log

Approval gate:

Manual approval required before any production route is created or wrapped.

## 11. Phase 8 - Invited Contributor Access Model

Purpose:

Design and implement request-scoped free invited contributor/rightsholder access separately from workspace membership.

Scope:

- target-specific access
- action-specific access
- expiry/revocation
- status
- terms acceptance
- audit
- evidence/split approval workflows later

Must not reuse workspace invitations as the full contributor access model.

Possible future files:

- `src/lib/entitlements/contributor-access/`
- future contributor access routes/services after approval

Schema decision point:

Likely needs a separate table from `workspace_invitations`.

Required tests:

- contributor can access only the target request
- contributor cannot access workspace dashboard
- contributor cannot access unrelated works/evidence/files
- expired/revoked access is blocked
- accepted/rejected action is audited
- access does not imply rights ownership beyond the request action

Docs to update:

- ownership separation doc
- subscription/access model
- entitlement architecture
- build log

Approval gate:

Manual approval required before schema design or route implementation.

## 12. Phase 9 - Billing / Payment Provider Integration Later

Purpose:

Integrate billing providers only after internal entitlement logic is stable.

Scope later:

- provider adapter
- customer/subscription mapping
- payment status mapping
- invoice/checkout integration
- webhook ingestion
- plan/status normalization

Provider state must flow through:

```text
billing provider
-> billing adapter
-> internal plan/status state
-> entitlement resolver
-> entitlement decision
```

Required tests later:

- provider status maps to internal status
- failed payments do not erase access records
- suspended/cancelled status fails closed for new production actions
- billing provider outage does not make capability logic inconsistent
- manual enterprise override remains auditable

Docs to update:

- subscription/access model
- entitlement architecture
- billing/provider-specific docs later
- build log

Approval gate:

Manual approval required before any billing provider dependency is added.

## 13. Required Docs Updates Per Phase

Every phase must update:

- `docs/build-log/BUILD-LOG.md`
- this implementation plan if sequencing changes

Phase-specific docs:

| Phase | Required docs to update |
| --- | --- |
| Phase 1 | Backend contract, system architecture |
| Phase 2 | Backend contract, readiness audit |
| Phase 3 | Backend contract, system architecture |
| Phase 4 | Backend contract, readiness audit |
| Phase 5 | Foundation enforcement chain, production mutation governance |
| Phase 6 | Dashboard capability matrix, app-level journey flow |
| Phase 7 | Production mutation governance, foundation enforcement chain |
| Phase 8 | Ownership separation, subscription/access model |
| Phase 9 | Subscription/access model, billing/provider docs later |

## 14. Required Tests Per Phase

Testing principles:

- test pure logic before route integration
- test fail-closed behavior
- test TEST-only separation
- test unknown/deferred/beta states
- test audit metadata shape
- test no billing dependency before Phase 9
- test no rights ownership inference from plan status

Minimum test categories:

- type/registry tests
- plan resolver tests
- decision service tests
- quota read-model tests
- guard behavior tests
- dashboard summary tests
- production mutation integration tests
- invited contributor scope tests
- billing adapter tests later

No phase is complete until tests prove both allowed and blocked paths.

## 15. Files Likely To Be Touched Later

Likely new files:

- `src/lib/entitlements/types.ts`
- `src/lib/entitlements/plan-registry.ts`
- `src/lib/entitlements/capability-registry.ts`
- `src/lib/entitlements/resolve-workspace-plan.ts`
- `src/lib/entitlements/check-entitlement.ts`
- `src/lib/entitlements/check-quota.ts`
- `src/lib/entitlements/get-usage-counters.ts`
- `src/lib/entitlements/with-entitlement-guard.ts`
- `src/lib/entitlements/dashboard-entitlement-summary.ts`
- `src/lib/authz/guards/with-production-mutation-guard.ts`

Likely existing files to review later:

- `src/lib/authz/workspace-context/resolve-workspace-context.ts`
- `src/lib/workspace-context/get-authenticated-workspace-context.ts`
- `src/lib/rbac/types.ts`
- `src/lib/rbac/permissions.ts`
- `src/lib/authz/guards/with-permission-guard.ts`
- `src/lib/authz/log-authorization-event.ts`
- `src/lib/onboarding/bootstrap-authenticated-user.ts`
- future production song capture route/service
- future production dashboard summary route/service
- future production submission route/service

Routes that should remain isolated unless explicitly approved:

- `app/api/songs/create/route.ts`
- `app/api/submissions/create-from-work/route.ts`
- `app/api/submissions/readiness/route.ts`
- `app/api/submissions/lifecycle/route.ts`
- `app/api/evidence-readiness/route.ts`
- `app/registration-workflow-test/page.tsx`
- `app/codex-ui-test/page.tsx`

## 16. Schema / Migration Decision Points

No schema or migration is approved by this plan.

Schema and persistence decisions must follow `docs/platform/PLATFORM_ENTITLEMENT_DATA_MODEL_DECISION_V1.md`.

Potential future decision points:

1. Workspace plan/status source:
   - workspace columns vs separate plan assignment table vs subscription table.

2. Quota/usage counters:
   - read-time counting vs persisted counters vs event-sourced quota records.

3. Invited contributor access:
   - likely separate table from `workspace_invitations`.

4. Entitlement audit:
   - use `authorization_audit_events.metadata` initially vs dedicated entitlement audit table later.

5. Billing integration:
   - provider mapping tables only after Phase 9 approval.

Every schema decision requires:

- design note
- migration proposal
- rollback plan
- test plan
- manual approval

## 17. Manual Approval Gates

Manual approval is required before:

- creating `src/lib/entitlements/*`
- changing workspace context behavior
- adding plan/status persistence
- creating any migration
- adding quota counters
- adding an entitlement guard
- applying a guard to any route
- exposing dashboard entitlement summaries to UI
- creating a production song capture route
- designing invited contributor access schema
- adding billing provider dependencies
- enabling any production mutation

Approval must state:

- active phase
- allowed files
- prohibited files
- test requirements
- rollback expectations
- whether schema is allowed
- whether routes may be touched

## 18. Rollback And Safety Rules

Safety rules:

- build pure contracts before guards
- build read-only decisions before mutations
- never modify TEST routes into production behavior without explicit approval
- keep billing isolated
- fail closed for unknown production-sensitive entitlement states
- preserve existing auth/workspace/RBAC/audit foundations
- do not infer rights ownership from plan status
- do not infer submission authority from plan status
- do not hide legal/compliance records during downgrade

Rollback principles:

- registry changes should be reversible constants/config changes
- read-only services should be removable without data mutation
- route guards should be applied behind clear phase approval
- schema changes require explicit rollback migration strategy
- billing adapters must be removable without breaking entitlement decisions

## 19. TEST-Only Boundaries

The following remain TEST-only or partial until full production enforcement is proven:

- current song capture
- submission readiness
- submission queue creation
- submission lifecycle read
- evidence readiness
- registration workflow TEST page
- codex UI TEST page
- finance test/contract diagnostic routes

TEST route rule:

Do not rely on entitlement alone to production-enable any TEST workflow.

Production readiness requires:

- auth
- profile
- workspace context
- RBAC
- entitlement
- terms/onboarding
- ownership/scope
- business validation
- governed mutation
- audit/event
- truthful response

## 20. Definition Of Done

The entitlement subsystem implementation is done only when:

1. Entitlement types and registries are implemented and tested.
2. Workspace plan/status resolution is implemented and tested.
3. Entitlement decision service returns structured decisions and fails closed.
4. Quota/usage read model exists for approved quotas.
5. Entitlement guard helper is tested without production route activation.
6. Dashboard entitlement summaries are read-only, workspace-scoped, and truthful.
7. First production mutation integration is explicitly approved and tested.
8. TEST routes remain isolated.
9. Invited contributor access is modeled separately from workspace membership when implemented.
10. Billing remains isolated until Phase 9.
11. Audit metadata captures entitlement decisions.
12. Documentation and build log are updated for every phase.
13. No capability is represented as production-safe unless the complete enforcement chain is active.

## 21. Current V1 Position

This plan is active as an implementation guide.

Phase 1 entitlement constants and registry contract are implemented and tested.

Phase 2 workspace plan/status read model is implemented and tested.

Phase 3 entitlement decision service is implemented and tested.

Phase 4 quota/usage read model is implemented and tested.

Phase 5 entitlement guard helper is implemented and tested.

Phase 6 dashboard read-only entitlement summary is implemented and tested.

Phase 7A production mutation guard contract is implemented and tested as a pure injected contract only.

Phase 7B durable audit handoff contract is implemented and tested as a pure builder only.

No production activation is approved.

The next safe step, if approved later, is Phase 7C: durable audit persistence design or real production mutation guard composition prep.
