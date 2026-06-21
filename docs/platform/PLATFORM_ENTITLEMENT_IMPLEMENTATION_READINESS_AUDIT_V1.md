# Sentry Sound Platform - Entitlement Implementation Readiness Audit V1

## 1. Purpose

This document audits whether the current backend is ready to implement the entitlement backend contract safely.

Primary contract audited:

- `docs/platform/PLATFORM_ENTITLEMENT_BACKEND_CONTRACT_V1.md`

Supporting references:

- `docs/platform/PLATFORM_SUBSCRIPTION_ENTITLEMENT_MATRIX_V1.md`
- `docs/platform/PLATFORM_ENTITLEMENT_SYSTEM_ARCHITECTURE_V1.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- `docs/platform/PRODUCTION-MUTATION-GOVERNANCE-PATTERN.md`
- `docs/build-log/BUILD-LOG.md`

This is audit/readiness only.

No code, UI, schema, migration, middleware, billing, or production route changes were made.

## 2. Files And Areas Inspected

Inspected backend/schema areas:

- `prisma/schema.prisma`
- `supabase/migrations/`
- `sql/platform/rpc_create_song_with_contributors.sql`
- `app/api/`
- `src/lib/authz/`
- `src/lib/rbac/`
- `src/lib/workspace-context/`
- `src/lib/workspace-invitations/`
- `src/lib/onboarding/`
- `src/lib/finance/auth/`
- `src/lib/finance/audit/`
- `src/lib/registration/`
- `src/lib/evidence-vault/`

Key files inspected directly:

- `supabase/migrations/20260507131823_workspace_foundation.sql`
- `supabase/migrations/20260508103000_create_rbac_foundation.sql`
- `supabase/migrations/20260508120000_create_user_profiles.sql`
- `supabase/migrations/20260508123000_create_authorization_audit_events.sql`
- `supabase/migrations/20260508124500_create_workspace_invitations.sql`
- `src/lib/authz/workspace-context/resolve-workspace-context.ts`
- `src/lib/workspace-context/get-authenticated-workspace-context.ts`
- `src/lib/authz/guards/with-permission-guard.ts`
- `src/lib/authz/require-permission.ts`
- `src/lib/authz/log-authorization-event.ts`
- `src/lib/authz/clerk-sync/sync-clerk-user.ts`
- `src/lib/rbac/types.ts`
- `src/lib/rbac/permissions.ts`
- `src/lib/rbac/check-permission.ts`
- `src/lib/workspace-invitations/create-workspace-invitation.ts`
- `src/lib/workspace-invitations/accept-workspace-invitation.ts`
- `src/lib/finance/auth/protected-finance-route.ts`
- `app/api/protected/finance-test/route.ts`
- `app/api/protected/finance-contract-test/route.ts`
- `app/api/songs/create/route.ts`
- `app/api/submissions/create-from-work/route.ts`
- `app/api/submissions/readiness/route.ts`
- `app/api/submissions/lifecycle/route.ts`
- `app/api/evidence-readiness/route.ts`
- `app/api/workspaces/route.ts`
- `app/api/workspace-members/route.ts`
- `app/api/workspace-context/me/route.ts`
- `app/api/workspace-context/resolved/route.ts`
- `app/api/onboarding/bootstrap/route.ts`

Repository search terms included:

- `subscription`
- `plan_key`
- `subscription_plan`
- `subscription_status`
- `entitlement`
- `quota`
- `usage_counter`
- `feature_gate`
- `billing`
- `stripe`
- `paystack`
- `checkout`
- `workspaceId`
- `workspace_id`
- `withPermissionGuard`
- `requirePermission`
- `resolveWorkspaceContext`
- `getAuthenticatedWorkspaceContext`

## 3. Readiness Summary

Current readiness classification:

`partial foundation ready / entitlement implementation not yet ready for production enforcement`

The backend has reusable foundation pieces:

- Clerk auth helpers
- user profile sync
- workspace tables
- workspace context resolvers
- workspace role assignment
- static RBAC permission map
- permission guard reference
- authorization audit table/helper
- workspace invitation helpers
- some workspace-scoped operational tables in migrations

The backend does not yet have the entitlement-specific pieces required by the contract:

- explicit workspace plan/status source
- plan entitlement registry
- entitlement decision service
- quota/usage read model
- entitlement audit metadata standard
- route-level entitlement guard
- dashboard entitlement summary
- request-scoped invited contributor access model
- billing provider adapter

The system is safe to begin a governed backend-first entitlement implementation only after the missing contract pieces are approved.

It is not safe to treat current song capture, submission queue, evidence readiness, or lifecycle routes as production-entitled workflows.

## 4. Existing Tables And Models That Can Support Entitlement Implementation

| Table/model | Source | Current usefulness | Readiness |
| --- | --- | --- | --- |
| `workspaces` | `supabase/migrations/20260507131823_workspace_foundation.sql` | Can anchor workspace-level plan/status later. Has `id`, `name`, `legal_name`, `country_code`, `base_currency`, `status`, `metadata`. | Partial |
| `workspace_settings` | `supabase/migrations/20260507131823_workspace_foundation.sql` | Could hold configuration later, but not a typed plan/status contract. | Partial |
| `workspace_activity` | `supabase/migrations/20260507131823_workspace_foundation.sql` | Can support activity logging, but not enough for entitlement audit by itself. | Partial |
| `workspace_members` | `supabase/migrations/20260507131823_workspace_foundation.sql` and `20260507183827_organization_foundation.sql` | Legacy/simple member table exists. Potential drift with `workspace_user_roles`. | Partial / drift risk |
| `workspace_user_roles` | `supabase/migrations/20260508103000_create_rbac_foundation.sql`, patched by `20260508113000_workspace_user_roles_clerk_user_id_text.sql` | Current active role assignment table used by workspace context and permission helpers. | Reusable |
| `rbac_roles` | `supabase/migrations/20260508103000_create_rbac_foundation.sql` | Role lookup for workspace membership. | Reusable |
| `rbac_permissions` | `supabase/migrations/20260508103000_create_rbac_foundation.sql` | Database permission table exists, but active code uses static `ROLE_PERMISSIONS`. | Partial |
| `rbac_role_permissions` | `supabase/migrations/20260508103000_create_rbac_foundation.sql` | DB role-permission join exists, but active code does not appear to resolve permissions from it. | Partial |
| `user_profiles` | `supabase/migrations/20260508120000_create_user_profiles.sql` | Clerk user profile persistence foundation. | Reusable |
| `authorization_audit_events` | `supabase/migrations/20260508123000_create_authorization_audit_events.sql` | Existing audit event table for permission checks. Metadata field can carry future entitlement metadata if contract allows. | Reusable / needs extension by convention |
| `workspace_invitations` | `supabase/migrations/20260508124500_create_workspace_invitations.sql` | Supports workspace membership invitations. Not suitable as the full invited contributor access model. | Partial |
| `SubmissionQueue.workspaceId` | `prisma/schema.prisma` | Optional Prisma field exists and repository accepts `workspaceId`, but current create-from-work route does not pass it. | Partial |
| `SubmissionQueueEvent` | `prisma/schema.prisma` | Can support lifecycle/audit events for queue transitions. Not currently entitlement-aware. | Partial |
| Workspace-scoped operational tables | Multiple Supabase migrations, including CRM, rights, contracts, dashboard, workflow, notifications, approvals, analytics | Many domain tables have `workspace_id`, useful for future workspace-scoped entitlements and dashboard read models. | Conceptual support / integration varies |

Important schema note:

`prisma/schema.prisma` does not define `workspaces`, `user_profiles`, `workspace_user_roles`, `rbac_roles`, `authorization_audit_events`, or `workspace_invitations`. Those are Supabase SQL migration tables, not Prisma models in the current Prisma schema.

## 5. Existing Helpers And Middleware That Can Be Reused

| Helper/file | What it does now | Reuse potential | Gap |
| --- | --- | --- | --- |
| `getCurrentClerkUser` | Gets authenticated Clerk user. | Reuse as auth input to entitlement guard. | Entitlement must not call it separately if a parent guard already resolved actor. |
| `syncCurrentClerkUserToWorkspace` | Upserts `user_profiles`, finds demo workspace, assigns owner role. | Useful for onboarding/demo bootstrap. | Demo-specific; not a general production onboarding or plan resolver. |
| `bootstrapAuthenticatedUser` | Wraps Clerk sync/bootstrap. | Useful for development onboarding. | Treats onboarding as completed; not terms/plan aware. |
| `resolveWorkspaceContext` | Resolves user, first workspace role, role, workspace, static permissions. | Strong candidate for canonical context input. | Picks first role via `.limit(1)`; no explicit workspace selection; no profile object; no terms/plan. |
| `getAuthenticatedWorkspaceContext` | Similar workspace context resolver in a different path. | Reusable but should be consolidated or wrapped. | Duplicate resolver path; same first-workspace limitation. |
| `checkPermission` | Checks static role permission map. | Reuse before entitlement. | Static code map may drift from `rbac_permissions` tables. |
| `requirePermission` | Checks role permission and logs authorization audit. | Reusable for existing services. | Does not return structured context/decision; no entitlement step. |
| `withPermissionGuard` | Route/service wrapper that resolves context, checks permission, writes audit. | Best current reference for guard style. | RBAC only; no terms, plan, quota, ownership, business validation, mutation audit. |
| `logAuthorizationEvent` | Inserts into `authorization_audit_events`. | Can record entitlement decision metadata later. | Current type accepts RBAC resource/action only; no entitlement-specific typed envelope. |
| `createWorkspaceInvitation` | Requires authenticated workspace context and `settings:admin`, creates workspace invitation. | Reuse for true workspace membership invitations. | Not request-scoped contributor access. |
| `acceptWorkspaceInvitation` | Authenticates user, validates token/email, assigns workspace role. | Reuse for workspace member onboarding. | Grants workspace role, so not safe for limited contributor approvals. |
| `protectedFinanceRoute` | Checks Clerk auth and returns `{ workspaceId: "system", role: "admin" }`. | Useful only as a warning/reference. | Placeholder workspace context; not production entitlement-ready. |
| `app/api/protected/finance-test/route.ts` | Uses `withPermissionGuard` for `finance:admin`. | Best small route reference for permission guard pattern. | Not entitlement, terms, ownership, or full finance governance. |

## 6. Current Workspace Context Gaps

Workspace context is partial and should be aligned before entitlement enforcement.

Gaps found:

1. There are two active resolver paths:
   - `src/lib/authz/workspace-context/resolve-workspace-context.ts`
   - `src/lib/workspace-context/get-authenticated-workspace-context.ts`

2. Both resolve a single workspace using `.limit(1)` and do not take an explicit workspace id from route context.

3. The current context does not include:
   - normalized `user_profiles` row
   - workspace plan/status
   - subscription/entitlement context
   - terms acceptance
   - onboarding completion beyond bootstrap
   - selected workspace handling for multi-workspace users
   - canonical actor/audit envelope

4. Some workspace APIs use `supabaseAdmin` directly and do not enforce authenticated actor context:
   - `app/api/workspaces/route.ts`
   - `app/api/workspace-members/route.ts`

5. Prisma registration routes and Supabase workspace foundation use different persistence surfaces. Entitlement implementation must be careful about which data layer a route uses.

Readiness judgment:

Workspace context is reusable but should be consolidated or wrapped before adding entitlement enforcement.

## 7. Current RBAC And Permission Gaps

RBAC has a usable starting point but is not yet complete enough for production entitlement enforcement.

Existing support:

- `rbac_roles`, `rbac_permissions`, `rbac_role_permissions`, `workspace_user_roles` tables exist.
- Static role permissions exist in `src/lib/rbac/permissions.ts`.
- `withPermissionGuard` and `requirePermission` can check static role permission and log authorization result.

Gaps:

1. Active permission checks use static `ROLE_PERMISSIONS`, not the database `rbac_permissions` / `rbac_role_permissions` tables.

2. Permission resources are broad:
   - `analytics`
   - `reports`
   - `workflows`
   - `approvals`
   - `royalties`
   - `rights`
   - `releases`
   - `finance`
   - `contacts`
   - `assets`
   - `integrations`
   - `settings`

3. Entitlement contract feature/action keys are more specific than current RBAC resources/actions.

4. There is no explicit RBAC permission for:
   - `works.create.production`
   - `submissions.queue.create`
   - `evidence.upload`
   - `contributors.split.approve`
   - dashboard quick action use

5. Roles and plan entitlements are not separated in any backend helper yet.

Readiness judgment:

RBAC is reusable as the pre-entitlement permission gate, but permission granularity likely needs alignment before production song capture and submission routes are guarded.

## 8. Current Audit Logging Gaps

Existing support:

- `authorization_audit_events` table exists.
- `logAuthorizationEvent` helper writes workspace/user/resource/action/allowed/reason/metadata.
- `withPermissionGuard` logs allow/deny permission decisions.
- Domain-specific audit/event tables exist in various migrations, including finance, CRM, rights, contracts, release, file vault, task, workflow, notification, approval, and analytics tables.
- Prisma has `RegistrationAuditEvent`, `SubmissionQueueEvent`, and `EvidenceAuditEvent`.

Gaps:

1. No entitlement-specific audit envelope exists.

2. Current authorization audit logs permission decisions, not entitlement decisions.

3. No standard audit metadata shape exists for:
   - plan key
   - subscription status
   - feature key
   - action key
   - quota key
   - usage count
   - entitlement decision status
   - reason code

4. TEST routes do not write durable production audit events for song capture, readiness, queue creation, lifecycle read, or evidence readiness.

5. Some protected finance routes use a placeholder context and are not safe as full audit examples.

Readiness judgment:

Authorization audit can be reused, especially through `metadata`, but a typed entitlement audit convention should be designed before enforcement.

## 9. Subscription, Plan, Billing, Entitlement, And Quota Existence Check

Search result:

Original readiness-audit finding before Phases 1-7A: no implemented backend support was found for:

- explicit workspace subscription plan field
- `plan_key`
- `subscription_plan`
- `subscription_status`
- entitlement model/table
- entitlement helper/service
- quota table
- quota helper/service
- usage counter table
- feature gate helper
- billing provider integration
- Stripe integration
- Paystack integration
- checkout sessions
- provider customer id
- provider price id
- route-level entitlement middleware

Current consistency-sweep update after Phases 1-7A:

- Phase 1 implemented pure entitlement constants and registry contracts.
- Phase 2 implemented a pure workspace plan/status read model, but no persisted workspace plan/status source.
- Phase 3 implemented a pure entitlement decision service.
- Phase 4 implemented pure quota/usage read-model contracts, but no DB-backed usage readers or persisted counters.
- Phase 5 implemented a pure entitlement guard helper, but no middleware or route integration.
- Phase 6 implemented a pure dashboard entitlement summary builder, but no dashboard API/UI integration.
- Phase 7A implemented a pure injected production mutation guard contract, but no real auth/workspace/RBAC integration, route wrapper, durable audit writer, or production activation.

The original missing-backend finding remains true for persisted state, middleware, active route enforcement, billing provider integration, and production mutation activation.

Fields that may look related but are not entitlement support:

- `workspaces.metadata`: generic JSON metadata, not a typed plan/status contract.
- `workspaces.status`: workspace lifecycle status only (`active`, `inactive`, `suspended`), not subscription status.
- `usage_tag` / `allowed_usage` in `002-song-metadata-expansion.sql`: song metadata usage fields, not platform quota/usage counters.
- finance `planned_amount`: budget planning, not subscription plan.
- finance `customer_name`: receivables customer, not billing subscription customer.

Readiness judgment:

Subscription/plan/quota/entitlement implementation requires new backend components. Existing fields should not be quietly repurposed as production entitlement truth without a governed decision.

## 10. Invited Contributor Access Readiness

Existing workspace invitations:

- `workspace_invitations` has `workspace_id`, `email`, `role_id`, `status`, `invited_by_clerk_user_id`, `invitation_token`, expiry and accepted fields.
- `createWorkspaceInvitation` requires authenticated workspace context and `settings:admin`.
- `acceptWorkspaceInvitation` assigns a role in `workspace_user_roles`.

Can it be reused?

Yes, for true workspace member invitations.

Should it be reused for `FREE_INVITED_CONTRIBUTOR_ACCESS`?

No, not directly.

Reason:

`FREE_INVITED_CONTRIBUTOR_ACCESS` is request-specific and should not automatically grant workspace membership, workspace dashboard access, catalogue visibility, settings access, finance access, or unrelated evidence visibility.

Needs separate model:

- request id
- target type and target id
- invited email/user id
- allowed request-specific actions
- status
- expiry/revocation
- action-specific terms acceptance
- audit metadata

Readiness judgment:

Invitations are reusable for workspace membership only. A separate contributor access model is needed for free invited contributor/rightsholder participation.

## 11. Where The Entitlement Guard Should Live

Recommended future location:

- `src/lib/entitlements/`

Recommended future modules:

- `src/lib/entitlements/types.ts`
- `src/lib/entitlements/plan-registry.ts`
- `src/lib/entitlements/resolve-workspace-plan.ts`
- `src/lib/entitlements/get-usage-counters.ts`
- `src/lib/entitlements/check-entitlement.ts`
- `src/lib/entitlements/with-entitlement-guard.ts`

Recommended production mutation integration location:

- `src/lib/authz/guards/with-production-mutation-guard.ts`

Reasoning:

- Entitlement should not be mixed into raw RBAC helpers.
- RBAC remains the role/permission gate.
- Entitlement should sit after workspace/RBAC and before terms/ownership/validation/mutation.
- A future production mutation guard can compose existing `resolveWorkspaceContext`, `checkPermission`, `logAuthorizationEvent`, and entitlement checks.

Do not put entitlement implementation inside:

- individual route files as ad hoc logic
- UI components
- Prisma schema comments
- generic workspace invitation helpers
- finance-only guard files

## 12. Production Mutation Routes That Should Eventually Receive Entitlement Gates

High-priority future targets:

| Route/action | Current status | Future entitlement need |
| --- | --- | --- |
| `POST /api/songs/create` | TEST-only / unsafe for production | `works.create`, `works.create.production`, active workspace plan, active work quota |
| contributor creation inside create-song flow | TEST-only / partial | `works.manage_contributors`, contributor/split governance, invited contributor separation |
| `GET /api/submissions/readiness` | partial / TEST-only | Read-only `submissions.readiness.read`, workspace ownership/visibility |
| `POST /api/submissions/create-from-work` | unsafe until guarded | `submissions.queue`, submission allowance, workspace ownership, readiness, authority |
| `GET /api/submissions/lifecycle` | partial / unsafe until scoped | `submissions.lifecycle.read`, workspace ownership/visibility |
| `GET /api/evidence-readiness` | TEST-only / partial | `evidence.readiness.read`, workspace ownership/visibility |
| future evidence upload/link route | deferred | `evidence.upload`, storage quota, evidence authority |
| future dashboard summary routes | not confirmed as production | dashboard entitlement read-only summary |
| future report/export routes | partial/deferred | `reports.export`, export quota |
| future finance/royalty production routes | deferred for rights workflow | `finance.read`, `finance.manage`, `royalties.read`, `royalties.manage`, plan entitlement plus finance authority |
| future workflow automation routes | deferred | `workflow.automation`, automation run quota |
| workspace admin/settings routes | partial | settings/admin entitlement if plan restricts advanced team/admin features |

## 13. TEST Routes That Must Remain Isolated

These routes/pages must remain explicitly TEST-only or partial until production foundation and entitlement gates exist:

- `app/registration-workflow-test/page.tsx`
- `app/codex-ui-test/page.tsx`
- `POST /api/songs/create`
- `GET /api/submissions/readiness`
- `POST /api/submissions/create-from-work`
- `GET /api/submissions/lifecycle`
- `GET /api/evidence-readiness`
- `GET /api/test/get-work`
- `POST /api/submissions/update-status`
- protected finance test/contract routes where context is placeholder or diagnostic

TEST isolation rule:

Do not make these routes production-safe by adding entitlement only. Production safety also requires workspace scoping, RBAC, terms, ownership/scope validation, business validation, and audit.

## 14. Lowest-Risk Implementation Sequence

No implementation was performed by this audit. Current implemented contract phases cover steps 2 through 8 as pure/non-routed layers only. Recommended future order:

1. Consolidate or wrap the canonical workspace context resolver so production code has one actor/workspace/role/permission source.
2. Keep entitlement types/constants, plan registry, capability registry, and TEST/deferred statuses aligned with the docs.
3. Keep the pure workspace plan/status resolver fail-closed until a persisted plan/status source is approved.
4. Keep the pure entitlement decision service as the single decision source.
5. Keep entitlement audit metadata conventions in pure helpers until a durable audit writer is approved.
6. Add DB-backed quota/usage readers only after a governed production target is approved.
7. Keep the composable entitlement guard non-routed until real auth/workspace/RBAC/terms/scope integration is approved.
8. Use the Phase 7A production mutation guard contract as the proof harness for future real guard composition.
9. Build a future production-safe song capture wrapper/route rather than modifying the TEST route in place.
10. Expose dashboard entitlement summaries to API/UI only after workspace-scoped backend summaries exist.
11. Defer billing provider integration until internal entitlement decisions are stable.

## 15. Files Likely To Be Touched Later

Likely new files:

- `src/lib/entitlements/types.ts`
- `src/lib/entitlements/plan-registry.ts`
- `src/lib/entitlements/resolve-workspace-plan.ts`
- `src/lib/entitlements/get-usage-counters.ts`
- `src/lib/entitlements/check-entitlement.ts`
- `src/lib/entitlements/with-entitlement-guard.ts`
- `src/lib/authz/guards/with-production-mutation-guard.ts`
- future tests under the repo's chosen test structure

Likely existing files to review or touch later:

- `src/lib/authz/workspace-context/resolve-workspace-context.ts`
- `src/lib/workspace-context/get-authenticated-workspace-context.ts`
- `src/lib/rbac/types.ts`
- `src/lib/rbac/permissions.ts`
- `src/lib/authz/guards/with-permission-guard.ts`
- `src/lib/authz/log-authorization-event.ts`
- `src/lib/onboarding/bootstrap-authenticated-user.ts`
- `src/lib/workspace-invitations/create-workspace-invitation.ts`
- `src/lib/workspace-invitations/accept-workspace-invitation.ts`
- future production song capture route/service
- future production dashboard summary route/service
- future production submission queue route/service

Likely route files to leave isolated until production replacements exist:

- `app/api/songs/create/route.ts`
- `app/api/submissions/create-from-work/route.ts`
- `app/api/submissions/readiness/route.ts`
- `app/api/submissions/lifecycle/route.ts`
- `app/api/evidence-readiness/route.ts`

## 16. Schema And Migration Needs

Potential future schema/migration needs:

1. Workspace plan/status source:
   - explicit workspace plan/status columns or a separate `workspace_subscriptions` / `workspace_plan_assignments` table.

2. Plan entitlement registry persistence:
   - optional. Could begin as code constants, then move to database later if needed.

3. Usage counters/read model:
   - optional first as queries; may need `workspace_usage_counters` or materialized/read-model table later for performance and consistency.

4. Invited contributor access:
   - likely needs a separate table from `workspace_invitations`.

5. Entitlement audit:
   - may use `authorization_audit_events.metadata` initially, but dedicated event typing may be needed later.

Current audit decision:

Do not create migrations yet. The first safe implementation step can be code-only types/registry/resolver design if approved, but production enforcement will eventually need a governed plan/status source and likely a separate invited contributor access model.

## 17. Risks, Unknowns, And Blockers

Risks:

- Duplicate workspace context resolvers can lead to inconsistent enforcement.
- `.limit(1)` workspace selection is unsafe for multi-workspace users.
- Static RBAC permissions may drift from database RBAC tables.
- Workspace member concepts are split between `workspace_members` and `workspace_user_roles`.
- Current workspace/admin APIs using `supabaseAdmin` without auth/permission checks are not safe as production governance examples.
- Current TEST registration/submission routes do not enforce auth, workspace ownership, RBAC, terms, entitlement, or audit.
- `SubmissionQueue.workspaceId` is optional and not populated by current `create-from-work` route.
- Current create-song RPC does not appear to receive workspace context.
- Entitlement cannot be safely enforced without a canonical workspace plan/status source.
- Quotas cannot be enforced consistently without usage read models or counters.
- Invited contributor access should not reuse workspace role invitations directly.

Unknowns needing future inspection before implementation:

- Whether the live Supabase database exactly matches all migrations.
- Whether `workspace_user_roles.user_id` patch is applied in the active environment.
- Whether demo workspace seed data exists in every environment.
- Whether `rbac_roles` seed values match static `ROLE_PERMISSIONS`.
- Whether `rpc_create_song_with_contributors` should be wrapped, extended, or replaced for production workspace-scoped capture.
- Whether production dashboard should read from Prisma, Supabase SQL tables, or a new consolidated read model.

Blockers before production entitlement enforcement:

- canonical workspace context resolver
- workspace plan/status source
- entitlement decision service
- quota/usage strategy
- entitlement audit metadata convention
- route guard composition
- production-safe song capture wrapper/route
- terms acceptance gate
- workspace-scoped ownership and validation for target records

## 18. Final Audit Conclusion

The backend is ready to support a careful, incremental entitlement implementation plan.

The backend is not ready to enforce entitlement safely in production routes today.

Best next step after approval:

Design and implement entitlement types, a plan registry, and a pure decision service first, without touching production routes or billing.

Current song capture, submission, evidence, and lifecycle workflows must remain TEST-only or partial until the complete foundation and entitlement enforcement chain exists.
