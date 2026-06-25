# Sentry Sound Platform - Entitlement And Production Governance Handover V1

## 1. Purpose

This is the compact source-of-truth handover for entitlement and production mutation governance work completed through the Phase 9 TEST/admin backend slices.

Use this before continuing entitlement, audit, dashboard, or production mutation work.

## 2. Current Completed Phases

| Phase | Status | Boundary |
| --- | --- | --- |
| Phase 1 - Entitlement registry contract | Implemented and tested | Pure constants/registry only |
| Phase 2 - Workspace plan/status read model | Implemented and tested | Pure fail-closed resolver only |
| Phase 3 - Entitlement decision service | Implemented and tested | Pure deterministic decision logic only |
| Phase 4 - Quota/usage read model | Implemented and tested | Pure quota contracts/checks only |
| Phase 5 - Entitlement guard helper | Implemented and tested | Pure helper only, no route integration |
| Phase 6 - Dashboard entitlement summary | Implemented and tested | Pure read-only summary only |
| Phase 7A - Production mutation guard contract | Implemented and tested | Pure injected guard contract only |
| Phase 7B - Durable audit handoff contract | Implemented and tested | Pure audit-event builder only |
| Phase 8C - Workspace plan assignments migration draft | Drafted and reviewed | Supabase SQL draft, later approved for application |
| Phase 8D - Migration review findings | Documented | Draft-comment/documentation hardening only |
| Phase 8E - Workspace plan assignment mapper | Implemented and tested | Pure row mapper/validator only, no DB reads |
| Phase 8F - Workspace plan assignments migration | Applied and verified | Supabase table only, no route/adapter activation |
| Phase 9 - DB-backed workspace plan resolver adapter | Implemented and tested | Injected adapter only, no route activation |
| Phase 9 TEST/admin backend slice | Implemented and tested | `/api/test/*` support only, no production activation |
| TEST workspace onboarding backend slice | Implemented and tested | `/api/test/*` onboarding mockup support only, no production activation |
| TEST workspace admin overview backend slice | Implemented and tested | Combined `/api/test/*` mockup overview only, no production activation |
| TEST operational audit event system slice | Implemented and tested | `/api/test/*` audit mockup support only, no production audit activation |
| TEST workflow lifecycle engine slice | Implemented and tested | `/api/test/*` lifecycle mockup support only, no production workflow activation |
| TEST asset/file governance backend slice | Implemented and tested | `/api/test/*` asset mockup support only, no production storage activation |
| TEST contributor identity split governance backend slice | Implemented and tested | `/api/test/*` contributor mockup support only, no production contributor activation |
| TEST create song orchestration backend slice | Implemented and tested | `/api/test/*` create-song mockup orchestration only, no production song activation |
| TEST evidence readiness aggregator slice | Implemented and tested | `/api/test/*` read-model aggregation only, no production evidence/submission activation |

No production route integration exists yet.

## 3. Files By Subsystem

### Entitlement Core

- `src/lib/entitlements/types.ts`
- `src/lib/entitlements/plan-registry.ts`
- `src/lib/entitlements/capability-registry.ts`
- `src/lib/entitlements/index.ts`
- `src/lib/entitlements/entitlement-registry.test.ts`

### Workspace Plan Read Model

- `src/lib/entitlements/workspace-plan-status.ts`
- `src/lib/entitlements/workspace-plan-context.ts`
- `src/lib/entitlements/resolve-workspace-plan.ts`
- `src/lib/entitlements/workspace-plan-context.test.ts`

### Workspace Plan Assignment Mapper

- `src/lib/entitlements/workspace-plan-assignment-row.ts`
- `src/lib/entitlements/resolve-workspace-plan-from-assignment.ts`
- `src/lib/entitlements/workspace-plan-assignment-row.test.ts`

### Workspace Plan DB Adapter

- `src/lib/entitlements/resolve-workspace-plan-db-adapter.ts`
- `src/lib/entitlements/workspace-plan-db-adapter.test.ts`

Status: injected adapter only. It accepts assignment rows or an injected fetcher, delegates to the pure mapper, and does not import Supabase or Prisma.

### TEST/Admin Workspace Subscription Backend

- `src/lib/entitlements/workspace-subscription-admin.ts`
- `src/lib/entitlements/workspace-subscription-admin-supabase.ts`
- `src/lib/entitlements/workspace-subscription-admin.test.ts`
- `app/api/test/workspace-subscription-summary/route.ts`
- `app/api/test/workspace-plan-assignment/route.ts`
- `app/api/test/workspace-entitlement-summary/route.ts`

Status: TEST/internal/admin support only for future onboarding/subscription UI mockups. These routes are not production entitlement enforcement and must not be wired into production workflows.

### TEST/Admin Workspace Onboarding Backend

- `src/lib/workspace-onboarding/workspace-onboarding-admin.ts`
- `src/lib/workspace-onboarding/workspace-onboarding-admin-supabase.ts`
- `src/lib/workspace-onboarding/workspace-onboarding-admin.test.ts`
- `app/api/test/workspace-onboarding-summary/route.ts`
- `app/api/test/workspace-onboarding/route.ts`

Status: TEST/internal/admin support only for future Workspace Onboarding UI mockups. These routes use existing `workspaces` identity columns and `workspace_settings.settings.workspace_onboarding`; they do not activate production onboarding, entitlement enforcement, billing, or production mutations.

### TEST/Admin Workspace Admin Overview Backend

- `src/lib/workspace-admin/workspace-admin-overview.ts`
- `src/lib/workspace-admin/workspace-admin-overview-supabase.ts`
- `src/lib/workspace-admin/workspace-admin-overview.test.ts`
- `app/api/test/workspace-admin-overview/route.ts`

Status: TEST/internal/admin support only for future Workspace Onboarding and Subscription Management UI mockups. This route composes the existing onboarding, subscription, and entitlement summary services; it does not duplicate business logic and does not activate production onboarding, entitlement enforcement, billing, middleware, or production mutations.

### TEST/Admin Operational Audit Event System

- `src/lib/audit/operational-audit-event.ts`
- `src/lib/audit/operational-audit-event-builder.ts`
- `src/lib/audit/operational-audit-event-supabase.ts`
- `src/lib/audit/operational-audit-event.test.ts`
- `app/api/test/audit-events/route.ts`
- `app/api/test/audit-events-summary/route.ts`

Status: TEST/internal/admin support only for future Audit Log UI mockups and platform activity tracking. This slice reuses existing `workspace_activity` persistence and stores the canonical event under `metadata.operationalAuditEvent`; it is not durable production mutation audit persistence and is not wired into production routes or guards.

### TEST/Admin Workflow Lifecycle Engine

- `src/lib/workflow/lifecycle-state.ts`
- `src/lib/workflow/lifecycle-transition.ts`
- `src/lib/workflow/lifecycle-event-builder.ts`
- `src/lib/workflow/lifecycle-admin.ts`
- `src/lib/workflow/lifecycle-admin-supabase.ts`
- `src/lib/workflow/lifecycle-admin.test.ts`
- `app/api/test/lifecycle-summary/route.ts`
- `app/api/test/lifecycle-transition/route.ts`

Status: TEST/internal/admin support only for future guided workflow UI mockups. This slice reuses existing `workspace_activity` persistence and stores canonical lifecycle events under `metadata.lifecycleEvent` with an embedded operational audit event shape; it is not production workflow automation and is not wired into song/submission/evidence production routes or guards.

### TEST/Admin Asset File Governance Backend

- `src/lib/assets/asset-governance.ts`
- `src/lib/assets/asset-event-builder.ts`
- `src/lib/assets/asset-admin.ts`
- `src/lib/assets/asset-admin-supabase.ts`
- `src/lib/assets/asset-admin.test.ts`
- `app/api/test/assets/route.ts`
- `app/api/test/assets-summary/route.ts`

Status: TEST/internal/admin support only for future File Vault, evidence file, artwork, reusable media asset, template, and image library UI mockups. This slice reuses existing `file_vault_items` persistence and stores canonical asset governance under `metadata.assetEvent` with embedded operational audit and lifecycle shapes; it does not implement real file upload, storage movement, production file governance, or production evidence workflows.

### TEST/Admin Contributor Identity Split Governance Backend

- `src/lib/contributors/contributor-governance.ts`
- `src/lib/contributors/contributor-admin.ts`
- `src/lib/contributors/contributor-admin-supabase.ts`
- `src/lib/contributors/contributor-admin.test.ts`
- `app/api/test/contributors/route.ts`
- `app/api/test/contributors-summary/route.ts`
- `app/api/test/splits/validate/route.ts`

Status: TEST/internal/admin support only for future Contributor Management and Create Song UI mockups. This slice reuses existing `workspace_activity` persistence and stores canonical contributor governance under `metadata.contributorEvent` with embedded operational audit and lifecycle shapes; it does not write to existing `contributors`, `work_contributors`, or `recording_contributors`, and it does not alter create-song, submission, evidence, or production routes.

### TEST/Admin Create Song Orchestration Backend

- `src/lib/songs/test-create-song-orchestration.ts`
- `src/lib/songs/test-create-song-orchestration-supabase.ts`
- `src/lib/songs/test-create-song-orchestration.test.ts`
- `app/api/test/songs/create-orchestration/route.ts`

Status: TEST/internal/admin support only for future Create Song Flow UI mockups. This slice reuses existing `workspace_activity` persistence and stores the orchestration envelope under `metadata.testCreateSongOrchestration` with embedded operational audit and lifecycle shapes; it does not call or replace `POST /api/songs/create`, does not write to `musical_works`, `contributors`, `work_contributors`, submission, asset, or evidence tables, and does not claim production readiness.

### TEST/Admin Evidence Readiness Aggregator

- `src/lib/evidence/evidence-readiness.ts`
- `src/lib/evidence/evidence-readiness-aggregator.ts`
- `src/lib/evidence/evidence-readiness-supabase.ts`
- `src/lib/evidence/evidence-readiness.test.ts`
- `app/api/test/evidence-readiness/route.ts`
- `app/api/test/evidence-readiness-summary/route.ts`

Status: TEST/internal/admin support only for future Evidence Readiness, submission gating, and dashboard readiness mockups. This slice is a read-model aggregator over existing operational graph metadata including `workspace_activity.metadata.testCreateSongOrchestration`, `metadata.contributorEvent`, `metadata.lifecycleEvent`, `metadata.operationalAuditEvent`, and TEST asset metadata in `file_vault_items.metadata.assetEvent`; it does not create a separate evidence engine, new table, production evidence route, production submission gate, or production readiness authority.

### Workspace Plan Assignment Migration Draft

- `supabase/migrations/20260517180000_workspace_plan_assignments.sql`

Status: approved, renamed from `_draft.sql`, applied, verified with row count `0`, and not consumed by routes or adapters.

### Entitlement Decision Service

- `src/lib/entitlements/entitlement-decision.ts`
- `src/lib/entitlements/check-entitlement.ts`
- `src/lib/entitlements/entitlement-decision.test.ts`

### Quota / Usage Contracts

- `src/lib/entitlements/quota-types.ts`
- `src/lib/entitlements/check-quota.ts`
- `src/lib/entitlements/get-usage-counters.ts`
- `src/lib/entitlements/quota-read-model.test.ts`

### Entitlement Guard Helper

- `src/lib/entitlements/entitlement-guard.ts`
- `src/lib/entitlements/with-entitlement-guard.ts`
- `src/lib/entitlements/entitlement-guard.test.ts`

### Dashboard Summary

- `src/lib/entitlements/dashboard-entitlement-summary.ts`
- `src/lib/entitlements/dashboard-entitlement-summary.test.ts`

### Production Mutation Guard Contract

- `src/lib/authz/guards/production-mutation-guard-contract.ts`
- `src/lib/authz/guards/with-production-mutation-guard-contract.ts`
- `src/lib/authz/guards/production-mutation-guard-contract.test.ts`

### Durable Audit Handoff Contract

- `src/lib/authz/audit/production-mutation-audit-contract.ts`
- `src/lib/authz/audit/build-production-mutation-audit-event.ts`
- `src/lib/authz/audit/production-mutation-audit-contract.test.ts`

## 4. Test Commands And Passing Results

```powershell
cmd /c "npx tsx src/lib/entitlements/entitlement-registry.test.ts"
```

Result: `Entitlement registry contract tests passed`

```powershell
cmd /c "npx tsx src/lib/entitlements/workspace-plan-context.test.ts"
```

Result: `Workspace plan context tests passed`

```powershell
cmd /c "npx tsx src/lib/entitlements/workspace-plan-assignment-row.test.ts"
```

Result: `Workspace plan assignment row mapper tests passed`

```powershell
cmd /c "npx tsx src/lib/entitlements/workspace-plan-db-adapter.test.ts"
```

Result: `Workspace plan DB adapter tests passed`

```powershell
cmd /c "npx tsx src/lib/entitlements/workspace-subscription-admin.test.ts"
```

Result: `Workspace subscription admin service tests passed`

```powershell
cmd /c "npx tsx src/lib/workspace-onboarding/workspace-onboarding-admin.test.ts"
```

Result: `Workspace onboarding admin service tests passed`

```powershell
cmd /c "npx tsx src/lib/workspace-admin/workspace-admin-overview.test.ts"
```

Result: `Workspace admin overview service tests passed`

```powershell
cmd /c "npx tsx src/lib/audit/operational-audit-event.test.ts"
```

Result: `Operational audit event tests passed`

```powershell
cmd /c "npx tsx src/lib/workflow/lifecycle-admin.test.ts"
```

Result: `Lifecycle admin tests passed`

```powershell
cmd /c "npx tsx src/lib/assets/asset-admin.test.ts"
```

Result: `Asset admin tests passed`

```powershell
cmd /c "npx tsx src/lib/contributors/contributor-admin.test.ts"
```

Result: `Contributor admin tests passed`

```powershell
cmd /c "npx tsx src/lib/songs/test-create-song-orchestration.test.ts"
```

Result: `Test create song orchestration tests passed`

```powershell
cmd /c "npx tsx src/lib/evidence/evidence-readiness.test.ts"
```

Result: `Evidence readiness tests passed`

```powershell
cmd /c "npx tsx src/lib/entitlements/entitlement-decision.test.ts"
```

Result: `Entitlement decision service tests passed`

```powershell
cmd /c "npx tsx src/lib/entitlements/quota-read-model.test.ts"
```

Result: `Quota read model tests passed`

```powershell
cmd /c "npx tsx src/lib/entitlements/entitlement-guard.test.ts"
```

Result: `Entitlement guard helper tests passed`

```powershell
cmd /c "npx tsx src/lib/entitlements/dashboard-entitlement-summary.test.ts"
```

Result: `Dashboard entitlement summary tests passed`

```powershell
cmd /c "npx tsx src/lib/authz/guards/production-mutation-guard-contract.test.ts"
```

Result: `Production mutation guard contract tests passed`

```powershell
cmd /c "npx tsx src/lib/authz/audit/production-mutation-audit-contract.test.ts"
```

Result: `Production mutation audit contract tests passed`

## 5. Current Architecture Chain

Production-sensitive mutation governance chain:

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
-> governed mutation handler
-> audit handoff
-> future durable audit persistence
-> response
```

Entitlement is consistently placed after RBAC and before terms, ownership/scope, and business validation.

## 6. What Is Implemented

- Plan keys and capability registry.
- Pure workspace plan/status context and demo fallback.
- Applied empty `workspace_plan_assignments` persistence table.
- Pure workspace plan assignment row mapper/validator.
- Injected workspace plan resolver adapter.
- TEST/internal/admin workspace subscription summary, assignment, and entitlement-summary backend slice.
- TEST/internal/admin workspace onboarding summary/save backend slice.
- TEST/internal/admin workspace admin overview backend slice.
- TEST/internal/admin operational audit event contract, builder, routes, and `workspace_activity` repository.
- TEST/internal/admin workflow lifecycle state, transition, event, routes, and `workspace_activity` repository.
- TEST/internal/admin asset/file governance contract, builder, routes, and `file_vault_items` repository.
- TEST/internal/admin contributor identity, split validation, routes, and `workspace_activity` repository.
- TEST/internal/admin create-song orchestration contract, route, and `workspace_activity` repository.
- TEST/internal/admin evidence readiness read-model aggregation over existing operational metadata.
- Pure entitlement decision service.
- Pure quota/usage checking contracts.
- Pure entitlement guard helper.
- Pure dashboard entitlement summary builder.
- Pure injected production mutation guard contract.
- Pure durable audit handoff event builder.
- Deterministic tests for all completed phases.
- Full entitlement/governance contract test sweep passed after Phase 9.

## 7. What Is Contract-Only

- `withEntitlementGuard()` is contract/helper only, not a production authorization system by itself.
- `buildDashboardEntitlementSummary()` is read-only summary logic only, not dashboard API/UI.
- `withProductionMutationGuardContract()` is an injected proof harness only, not a real route wrapper.
- `buildProductionMutationAuditEvent()` builds an audit-event-shaped object only, not durable persistence.
- `resolveWorkspacePlanFromAssignment()` maps already-supplied rows only; it is not a DB adapter and performs no persistence reads.
- `resolveWorkspacePlanDbAdapter()` accepts supplied rows or an injected fetcher. It does not query Supabase/Prisma directly and is not wired to routes.
- `/api/test/workspace-*` routes are TEST/internal/admin support routes only. They can read/write `workspace_plan_assignments` for mockup support, but they are not production guards.

Phase 7A and Phase 7B are pure contracts/builders only. Phase 8E is a pure mapper only.

## 8. What Is Not Implemented

- No production route integration exists.
- No billing exists.
- No payment provider integration exists.
- No DB-backed quota readers exist.
- No persisted quota counters exist.
- No dashboard operational API/UI consumes entitlement summaries.
- No durable audit persistence exists for the Phase 7B audit event.
- No production mutation guard is wired to routes.
- No middleware exists for entitlement or production mutation enforcement.
- No event bus/outbox exists.
- No production route consumes `workspace_plan_assignments`.
- No workspace plan assignment rows have been seeded.
- No production route calls `resolveWorkspacePlanDbAdapter()`.
  TEST/internal/admin support routes may use the adapter for mockup support only.
- No production evidence readiness or submission gating consumes the TEST evidence readiness aggregator.

## 9. TEST-Only Boundaries

The following remain TEST-only, partial, or unsafe for production:

- `POST /api/songs/create`
- `POST /api/works/create`
- `GET /api/submissions/readiness`
- `POST /api/submissions/create-from-work`
- `GET /api/submissions/lifecycle`
- `POST /api/submissions/update-status`
- `GET /api/evidence-readiness`
- `app/registration-workflow-test/page.tsx`
- `app/codex-ui-test/page.tsx`

Song, submission, and evidence workflows remain TEST-only. Current route workflows must not be treated as production-safe.

## 10. Forbidden Assumptions

Do not assume:

- entitlement helpers make routes production-safe
- `TEST_DEMO_PLAN` can run production workflows
- workspace owner equals rights owner
- actor equals rightsholder
- audit event equals chain-of-title proof
- billing or payment status exists
- persisted workspace plan/status foundation means production entitlement is active
- quotas are DB-backed
- dashboard summary means operational dashboard data exists
- Phase 7A/7B activate production governance
- Phase 8E mapper reads the database
- Phase 8F applied migration activates entitlement enforcement
- Phase 9 adapter is route enforcement
- TEST/admin subscription routes are production routes
- TEST/admin onboarding routes are production onboarding
- TEST/admin overview routes are production dashboard/admin routes
- TEST/admin operational audit routes are durable production audit persistence
- TEST/admin lifecycle routes are production workflow automation
- TEST/admin asset routes are real file upload, storage movement, or production evidence governance
- TEST/admin contributor routes are production contributor identity, rights ownership, or split enforcement
- TEST/admin create-song orchestration is production song capture or final readiness
- TEST/admin evidence readiness aggregation is production evidence readiness or submission authorization
- `workspace_settings.settings.workspace_onboarding` is entitlement, billing, or production readiness truth
- current song/submission/evidence routes are production-ready

## 11. Known Gaps

- Real route/service integration for workspace plan resolution.
- Governed workspace plan assignment admin/change flow.
- Durable audit for workspace plan assignment changes.
- DB-backed quota/usage readers.
- Real production mutation guard composition using auth/workspace/RBAC/entitlement/terms/scope/validation.
- Terms/onboarding gate implementation.
- Ownership/scope resolver contract.
- Durable audit persistence decision.
- Audit persistence schema/migration, if approved later.
- Production-safe song capture wrapper/route.
- Workspace-scoped production readiness, queue, lifecycle, and evidence routes.
- Production evidence readiness still needs full foundation, entitlement, terms, ownership, validation, and audit enforcement before it can gate submissions.
- Dashboard API/UI integration only after workspace-scoped backend summaries exist.
- Billing/payment provider adapter, deferred until internal entitlement logic is stable.

## 12. Current Stable Checkpoint

Current stable checkpoint:

- Phase 1 through Phase 8E contract/mapper layers are implemented or documented according to their approved scope.
- Phase 8F applied the empty `workspace_plan_assignments` Supabase persistence table as a non-activating foundation only.
- Phase 9 added an injected workspace plan resolver adapter with deterministic tests.
- Phase 9 TEST/admin backend slice adds mockup-support routes for workspace subscription summary, plan assignment, and entitlement summary.
- TEST workspace onboarding backend slice adds mockup-support routes for onboarding summary and onboarding save/update.
- TEST workspace admin overview backend slice adds one combined mockup-support route for onboarding, subscription, and entitlement/dashboard summaries.
- TEST operational audit event system slice adds mockup-support routes for audit event list/create and audit summary cards.
- TEST workflow lifecycle engine slice adds mockup-support routes for lifecycle transition recording and lifecycle summary cards.
- TEST asset/file governance backend slice adds mockup-support routes for asset list/create and asset summary cards.
- TEST contributor identity split governance backend slice adds mockup-support routes for contributor list/create, contributor summary, and split validation.
- TEST create song orchestration backend slice adds one mockup-support route for create-song orchestration, placeholder readiness, contributor/split validation, asset reference summaries, lifecycle summaries, and audit summaries.
- TEST evidence readiness aggregator slice adds mockup-support routes for readiness score, blockers, missing evidence, compliance status, submission gate status, and operational readiness summaries.
- The full entitlement/governance contract test sweep passed after Phase 9.
- `workspace_plan_assignments` exists as an applied empty Supabase table.
- Post-application verification confirmed table, columns, constraints, indexes, and row count `0`.
- `resolveWorkspacePlanFromAssignment()` is pure and accepts supplied rows only.
- Multiple current workspace plan assignments fail closed in the mapper.
- Demo fallback remains TEST-only and takes precedence over assignment rows.
- No production route consumes workspace plan assignment rows.
- No production route consumes the DB adapter.
- No production route consumes workspace onboarding settings.
- No production route consumes the combined workspace admin overview.
- No production route consumes the TEST operational audit event routes.
- No production route consumes the TEST lifecycle routes.
- No production route consumes the TEST asset/file governance routes.
- No production route consumes the TEST contributor governance routes.
- No production route consumes the TEST create-song orchestration route.
- No middleware activation exists.
- No production entitlement enforcement exists.
- No billing integration exists.
- No production activation exists.
- Song/submission/evidence remain TEST-only.

## 13. Next Recommended Phase

Recommended next phase:

Phase 10 - governed route/service integration prep for workspace plan resolution, or Phase 7C - durable audit persistence design / real production mutation guard composition prep.

Lowest-risk continuation:

1. Design the durable audit persistence strategy without implementing schema.
2. Or design real production guard composition using existing auth/workspace/RBAC helpers without touching routes.
3. Keep production song capture route work separate and explicitly approved.

## 14. Safe Continuation Rules

- Read this handover first.
- Keep TEST routes isolated.
- Do not modify `POST /api/songs/create` into production behavior.
- Do not wire guards to app routes without explicit approval.
- Do not add schema or migrations without explicit approval.
- Do not treat the applied `workspace_plan_assignments` table as entitlement enforcement.
- Do not treat the Phase 8E mapper as a DB-backed adapter.
- Do not treat the Phase 9 adapter as route enforcement.
- Do not add billing/payment provider logic without explicit future approval.
- Do not add middleware without explicit approval.
- Reuse existing Clerk, workspace, RBAC, entitlement, and audit foundations.
- Prefer pure contracts and deterministic tests before persistence or route integration.
- Every production-sensitive mutation must preserve the full chain and audit handoff.
- If unsure whether a workflow is production-safe, classify it as TEST-only or partial.

## 15. Source Documents

- `docs/platform/PLATFORM_ENTITLEMENT_IMPLEMENTATION_PLAN_V1.md`
- `docs/platform/PLATFORM_ENTITLEMENT_SYSTEM_ARCHITECTURE_V1.md`
- `docs/platform/PRODUCTION-MUTATION-GOVERNANCE-PATTERN.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- `docs/platform/WORKSPACE_PLAN_PERSISTENCE_MIGRATION_GOVERNANCE_CHECKLIST_V1.md`
- `docs/build-log/BUILD-LOG.md`
