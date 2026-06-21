# Sentry Sound Platform - Entitlement Backend Contract V1

## 1. Purpose

This document defines the canonical backend entitlement contract for Sentry Sound Platform V1.

It translates the subscription tiers and entitlement matrix in `docs/platform/PLATFORM_SUBSCRIPTION_ENTITLEMENT_MATRIX_V1.md` into a backend-facing design contract.

This is a contract before build. It defines how future backend services should reason about workspace plans, subscription status, feature entitlements, usage allowances, action gates, invited contributor access, dashboard visibility, and production mutation governance.

It does not implement code, middleware, schema, migrations, UI, billing, or production route changes.

Current song capture, submission, evidence, and lifecycle flows remain TEST-only or partial until the foundation and entitlement chain is implemented.

## 2. Contract Scope

The entitlement contract answers one question:

Can this actor, inside this workspace or request-specific access context, use this platform capability under the current plan, status, allowance, and governance rules?

It must also preserve Independent Module Integrity:

- entitlement gates may control governed capability access, usage limits, scale, automation, integrations, reporting, and orchestration
- entitlement gates must not intentionally cripple the core standalone promise of a paid module
- basic access to user-owned records must not be treated as a hostage feature
- blocked/limited decisions must distinguish plan limitation from permission, readiness, evidence, rights, legal authority, backend-deferred, or setup issues
- upgrade targets should represent additive value, not punitive dependency pressure

It does not answer:

- whether the user is authenticated
- whether the user has the right workspace role
- whether terms have been accepted
- whether the workspace owns or controls music rights
- whether contributors/rightsholders have approved
- whether readiness, evidence, or business validation has passed
- whether a mutation should be audited
- whether billing payment collection succeeded

Those checks belong to other foundation and governance layers.

## 3. Workspace Plan And Status Resolution Model

Future backend entitlement resolution should produce a normalized workspace plan context before evaluating a gated capability.

Conceptual shape:

```ts
type WorkspacePlanKey =
  | "TEST_DEMO_PLAN"
  | "ARTIST_STARTER"
  | "ARTIST_PRO"
  | "PRODUCER_STUDIO"
  | "LABEL_PUBLISHER"
  | "ENTERPRISE_ADMIN_COMPANY";

type SubscriptionStatus =
  | "test"
  | "active"
  | "trialing"
  | "past_due"
  | "suspended"
  | "cancelled"
  | "not_configured";

type WorkspacePlanContext = {
  workspaceId: string;
  planKey: WorkspacePlanKey;
  status: SubscriptionStatus;
  source: "system_default" | "workspace_record" | "admin_override" | "billing_provider_later";
  effectiveFrom?: string;
  effectiveUntil?: string;
  isProductionEligible: boolean;
};
```

V1 design rules:

- `TEST_DEMO_PLAN` is non-production.
- `FREE_INVITED_CONTRIBUTOR_ACCESS` is not a workspace plan. It is an access mode for request-specific participation.
- A workspace plan controls workspace feature access and usage allowances.
- Subscription status controls whether an otherwise allowed plan is active enough to use.
- A suspended, cancelled, or not-configured production workspace should fail closed for production-sensitive mutations.
- Billing provider state is deferred and must not be required for the first internal entitlement contract.

## 4. User Role Vs Workspace Plan Separation

User role and workspace plan are separate checks.

Role answers:

Can this authenticated user perform this type of action inside the workspace?

Plan answers:

Does this workspace have access and allowance for this platform capability?

Example:

- A workspace owner may have `rights:admin` permission.
- If the workspace plan does not include production song capture, the production capture mutation must still be blocked.
- If the workspace plan includes production capture, but the user lacks the correct role/permission, the mutation must still be blocked.

Backend order:

```text
auth
-> workspace context
-> RBAC permission
-> entitlement decision
```

Entitlement must not be implemented as a replacement for RBAC.

RBAC must not be used as a substitute for plan entitlement.

## 5. Invited Contributor Access Separation

`FREE_INVITED_CONTRIBUTOR_ACCESS` is a request-specific access mode, not a paid workspace plan and not normal workspace membership.

It should be modeled separately from:

- workspace owner
- workspace admin
- workspace member
- workspace invitation
- artist workspace subscription
- label/publisher workspace subscription

Conceptual shape:

```ts
type ContributorAccessContext = {
  accessMode: "FREE_INVITED_CONTRIBUTOR_ACCESS";
  requestId: string;
  targetType: "work" | "contributor_split" | "evidence_item" | "submission_item";
  targetId: string;
  invitedEmail?: string;
  invitedUserId?: string;
  allowedActions: EntitlementActionKey[];
  expiresAt?: string;
  status: "pending" | "accepted" | "expired" | "revoked" | "completed";
};
```

Allowed contributor access should be narrow:

- view the specific request
- approve or reject a requested split
- comment on the specific request
- provide evidence for the specific request when governed
- accept action-specific terms
- view limited lifecycle/status for the specific request

Contributor access must not grant:

- global workspace dashboard access
- catalogue-wide visibility
- team/settings access
- finance access
- unrelated evidence/files
- exports
- submission authority outside the request

Existing workspace invitations should be reused for true workspace membership. They should not be stretched into contributor/rightsholder request access.

## 6. Feature Entitlement Categories

Feature entitlement keys should represent governed platform capabilities, not random UI buttons.

Canonical V1 feature categories:

```ts
type EntitlementFeatureKey =
  | "workspace.dashboard.basic"
  | "workspace.dashboard.operations"
  | "works.create"
  | "works.manage_contributors"
  | "contributors.invite"
  | "contributors.approve_split"
  | "evidence.readiness.read"
  | "evidence.upload"
  | "submissions.readiness.read"
  | "submissions.queue"
  | "submissions.lifecycle.read"
  | "reports.export"
  | "finance.read"
  | "finance.manage"
  | "royalties.read"
  | "royalties.manage"
  | "ai.assistant.basic"
  | "api.integrations"
  | "workflow.automation";
```

Rules:

- Feature keys should be stable backend concepts.
- A feature may still be unavailable because the backend capability is deferred.
- Entitlement allows access only when foundation, RBAC, terms, ownership, validation, and audit requirements also pass.
- Finance, royalty, evidence upload, API/integration, and automation features are deferred for production rights workflows until their governed backend contracts mature.

## 7. Quota And Usage Read-Model Concepts

Quotas are plan allowances. Usage is the current consumed amount.

Quota checks should be read-model based where possible, not ad hoc query fragments scattered across routes.

Conceptual quota keys:

```ts
type QuotaKey =
  | "active_works"
  | "monthly_submission_queue_items"
  | "team_users"
  | "invited_collaborators"
  | "evidence_storage_mb"
  | "evidence_items"
  | "report_exports_monthly"
  | "automation_runs_monthly"
  | "api_requests_monthly";
```

Conceptual usage shape:

```ts
type UsageCounter = {
  workspaceId: string;
  quotaKey: QuotaKey;
  period: "lifetime" | "monthly" | "annual";
  used: number;
  limit: number | "unlimited" | "custom";
  resetAt?: string;
};
```

Quota decision rules:

- Missing usage data should fail closed for production-sensitive mutations unless explicitly configured as unlimited/custom.
- Read-only dashboard visibility may show unknown usage as `unavailable` or `not_configured`, not as zero.
- Usage counters should distinguish workspace team users from request-specific invited contributors.
- Quotas should not be used to infer rights ownership, authority, or legal readiness.

## 8. Entitlement Decision Result Shape

Future backend entitlement checks should return a structured decision, not only a boolean.

Conceptual shape:

```ts
type EntitlementActionKey =
  | "works.create.production"
  | "works.contributors.manage"
  | "contributors.invite"
  | "contributors.split.approve"
  | "evidence.readiness.view"
  | "evidence.upload"
  | "submissions.readiness.view"
  | "submissions.queue.create"
  | "submissions.lifecycle.view"
  | "reports.export"
  | "finance.read"
  | "finance.manage"
  | "royalties.read"
  | "royalties.manage"
  | "dashboard.card.view"
  | "dashboard.quick_action.use"
  | "ai.assistant.use"
  | "api.integration.use"
  | "workflow.automation.run";

type EntitlementDecisionStatus =
  | "allowed"
  | "blocked"
  | "limited"
  | "unavailable"
  | "test_only"
  | "deferred"
  | "unknown";

type EntitlementDecision = {
  allowed: boolean;
  status: EntitlementDecisionStatus;
  workspaceId?: string;
  planKey?: WorkspacePlanKey;
  subscriptionStatus?: SubscriptionStatus;
  accessMode?: "workspace_plan" | "invited_contributor" | "test_demo";
  featureKey: EntitlementFeatureKey;
  actionKey: EntitlementActionKey;
  quota?: UsageCounter;
  reasonCode:
    | "ENTITLEMENT_ALLOWED"
    | "PLAN_NOT_CONFIGURED"
    | "PLAN_DOES_NOT_INCLUDE_FEATURE"
    | "SUBSCRIPTION_NOT_ACTIVE"
    | "QUOTA_EXCEEDED"
    | "FEATURE_DEFERRED"
    | "TEST_ONLY"
    | "INVITED_ACCESS_SCOPE_MISMATCH"
    | "ENTITLEMENT_UNKNOWN";
  message: string;
  upgradeTarget?: WorkspacePlanKey | "enterprise_contact";
  auditMetadata?: Record<string, unknown>;
};
```

Decision rules:

- Production mutations require `allowed: true`.
- `limited` may allow read-only access or bounded action execution only when the quota check passes.
- `test_only` must not allow production mutation.
- `deferred` must not allow active production capability.
- `unknown` must fail closed for production-sensitive actions.
- The response should separate plan blockers from RBAC, terms, rights, evidence, and readiness blockers.

## 9. Action Gate Statuses

Canonical action gate statuses:

| Status | Meaning | Production mutation behavior |
| --- | --- | --- |
| `allowed` | Plan includes the feature and usage is within allowance. | May proceed to terms, ownership, validation, mutation, and audit. |
| `limited` | Plan includes the feature with usage or scope limits. | May proceed only if limit and scope checks pass. |
| `unavailable` | Plan does not include the feature. | Block. |
| `collaborator_only` | Action is available only through request-specific invited contributor access. | Allow only inside matching request scope. |
| `enterprise_only` | Feature requires enterprise/admin-company plan or commercial approval. | Block unless enterprise/custom entitlement exists. |
| `future_deferred` | Feature is not a production backend capability yet. | Block production mutation. |
| `test_only` | Feature/action exists only for isolated TEST workflows. | Block production mutation. |
| `unknown` | Entitlement cannot be resolved. | Fail closed for production-sensitive actions. |

## 10. Placement In Enforcement Chain

The entitlement check belongs after workspace and RBAC resolution and before terms, ownership, business validation, mutation, and audit.

Canonical chain:

```text
auth
-> profile
-> workspace
-> RBAC
-> entitlement
-> terms
-> ownership/scope
-> validation
-> mutation
-> audit
-> response
```

Why entitlement sits here:

- Auth/profile/workspace/RBAC must identify the actor and permission context first.
- Entitlement then determines whether the workspace/access mode may use the capability.
- Terms, ownership, validation, mutation, and audit still need the actor/workspace context.
- Entitlement failure should block before mutating or doing expensive business operations.

## 11. Production Mutation Governance Integration

The future production mutation guard should include entitlement configuration as part of its route contract.

Conceptual guard shape:

```ts
withProductionMutationGuard(
  {
    resource: "rights",
    action: "create",
    featureKey: "works.create",
    actionKey: "works.create.production",
    requiredPlanBehavior: "workspace_plan",
    quotaKey: "active_works",
    productionSensitive: true
  },
  handler
);
```

Guard responsibilities should include:

- resolve authenticated actor
- resolve workspace context
- check RBAC permission
- resolve workspace plan/status or invited contributor access context
- evaluate feature entitlement
- evaluate quota where required
- pass entitlement decision into the handler context
- block production-sensitive mutations if entitlement is not allowed
- attach entitlement decision metadata to audit events

The guard must not:

- replace business validation
- replace terms acceptance
- replace rights authority checks
- replace evidence/readiness checks
- replace audit persistence
- infer rights ownership from subscription status

## 12. Dashboard Entitlement Read-Only Use

Dashboard entitlement checks are read-only visibility gates.

They should decide what dashboard cards, counts, quick actions, reports, finance widgets, AI surfaces, and integration panels may be shown or enabled for the current workspace.

Dashboard rules:

- Dashboard cards must be backed by workspace-scoped data.
- Dashboard quick actions must be hidden or disabled when the plan does not include the feature.
- Dashboard quick actions must also be hidden or disabled when the backend capability is deferred or TEST-only.
- Dashboard should distinguish `upgrade_required`, `not_configured`, `deferred`, `test_only`, and `permission_denied`.
- Dashboard entitlement visibility must not imply production readiness.
- Dashboard read-only access must not bypass foundation context.

Example read-only dashboard decision:

```ts
{
  featureKey: "submissions.queue",
  actionKey: "dashboard.quick_action.queue_submission",
  status: "test_only",
  allowed: false,
  message: "Submission queue creation is available only in isolated TEST workflow until production governance is implemented."
}
```

## 13. TEST Mode Behavior

`TEST_DEMO_PLAN` exists to keep current development and workflow validation possible without production claims.

TEST behavior:

- may allow current isolated TEST workflow actions
- must be clearly labeled non-production
- must not imply real billing, real submission authority, real payout, or real rights ownership
- must not enable production mutation routes
- may simulate future plan gates
- may return `test_only` decisions for active TEST routes

Current TEST workflows remain governed by the TEST boundary:

- `POST /api/songs/create`
- `GET /api/submissions/readiness`
- `POST /api/submissions/create-from-work`
- `GET /api/submissions/lifecycle`
- `GET /api/evidence-readiness`
- `app/registration-workflow-test/page.tsx`

These do not become production-safe because this contract exists.

## 14. Deferred Billing And Payment Provider Boundaries

Billing is deferred.

This contract should not implement or require:

- Stripe
- Paystack
- checkout sessions
- invoice generation
- card payments
- payment webhooks
- provider customer IDs
- provider price IDs
- plan upgrade checkout flows
- subscription renewal logic

Near-term entitlement should be able to run from internal plan/status state before payment provider integration.

Future billing integration should map provider state into the same entitlement contract. It should not create a parallel authorization system.

## 15. Missing Backend Components

The following backend components are not yet implemented and are required before production entitlement enforcement:

| Component | Purpose | Current state |
| --- | --- | --- |
| Workspace plan/status source | Store or resolve workspace plan and subscription status. | Phase 2 implemented a pure read model and demo fallback only; persisted workspace plan/status source is still missing. |
| Plan entitlement registry | Define which feature/action/quota belongs to each plan. | Phase 1 implemented in `src/lib/entitlements/` as constants/registry contract only. |
| Entitlement resolver | Produce structured entitlement decisions. | Phase 3 implemented pure `checkEntitlement()`; no route integration exists. |
| Quota/usage read model | Count usage for works, submissions, team users, collaborators, evidence, exports, automation, and API use. | Phase 4 implemented pure quota/usage contracts; DB-backed readers and persisted counters are still missing. |
| Route-level entitlement guard | Enforce entitlement after RBAC and before terms/validation/mutation. | Phase 5 implemented pure `withEntitlementGuard()` and Phase 7A implemented an injected mutation guard contract; no route-level production integration exists. |
| Dashboard entitlement summary | Provide read-only dashboard visibility decisions. | Phase 6 implemented pure `buildDashboardEntitlementSummary()`; no dashboard API/UI consumes it. |
| Invited contributor access model | Support request-specific free contributor/rightsholder access. | Missing / separate from workspace invitations. |
| Entitlement audit metadata | Attach plan/status/feature/quota decision to audit events. | Pure decision, guard, dashboard summary, and mutation contract audit metadata shapes exist; durable audit writes are still missing. |
| Billing provider adapter | Map payment provider state into plan/status context. | Deferred. |

## 16. Recommended Future Implementation Sequence

Implementation must wait for approval. Recommended order:

1. Define backend constants/types for plan keys, subscription statuses, feature keys, action keys, quota keys, and decision statuses. Done for Phase 1 registry contract in `src/lib/entitlements/types.ts`.
2. Define an internal plan entitlement registry using the matrix tiers, with TEST and deferred statuses explicit. Done for Phase 1 registry contract in `src/lib/entitlements/plan-registry.ts` and `src/lib/entitlements/capability-registry.ts`.
3. Define a workspace plan/status resolver that can return `TEST_DEMO_PLAN` for demo/test workspaces and fail closed for unknown production workspaces.
4. Define a pure entitlement decision service that accepts actor/workspace/plan/action/quota context and returns `EntitlementDecision`.
5. Define quota/usage read-model queries for active works, submission queue items, team users, invited collaborators, evidence storage/items, exports, automation, and API requests.
6. Add entitlement decision metadata to future production audit events.
7. Design dashboard read-only entitlement summary endpoints before enabling production dashboard cards.
8. Design request-scoped invited contributor access separately from workspace invitations.
9. Add entitlement to a future production song capture wrapper or route before any production-sensitive song mutation.
10. Only after internal entitlement enforcement is stable, design billing provider integration.

## 17. Source Of Truth Relationship

This contract depends on:

- `docs/platform/PLATFORM_SUBSCRIPTION_ENTITLEMENT_MATRIX_V1.md`
- `docs/platform/PLATFORM_ENTITLEMENT_SYSTEM_ARCHITECTURE_V1.md`
- `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- `docs/platform/PRODUCTION-MUTATION-GOVERNANCE-PATTERN.md`
- `docs/platform/OPERATIONAL-OWNERSHIP-VS-RIGHTS-OWNERSHIP.md`

This contract should be used before implementing any backend subscription entitlement service, route guard, dashboard entitlement endpoint, usage counter, quota gate, invited contributor access mode, or billing provider adapter.
