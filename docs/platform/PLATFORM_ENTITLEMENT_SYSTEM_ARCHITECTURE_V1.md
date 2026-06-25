# Sentry Sound Platform - Entitlement System Architecture V1

## 1. Purpose

This document defines the canonical architecture for the Sentry Sound Platform entitlement subsystem before schema, middleware, billing, or route implementation begins.

The entitlement subsystem is a governed operational layer that decides whether a workspace, actor, or request-scoped invited participant may access a platform capability under the current plan, rollout state, allowance, governance status, and operational context.

It must support long-term SaaS ecosystem expansion across future subsystems, operational domains, AI capabilities, workflow engines, dashboards, integrations, evidence systems, finance systems, marketing systems, booking systems, automation systems, and enterprise capabilities.

This is architecture design only.

It does not implement code, schema, migrations, middleware, billing, or production routes.

## 2. Core Architectural Principles

1. Entitlement is not billing.
2. Entitlement is not authentication.
3. Entitlement is not RBAC.
4. Entitlement is not rights ownership.
5. Entitlement is not business validation.
6. Entitlement is a modular platform capability gate.
7. Entitlement must fail closed for production-sensitive actions when required context is missing.
8. Entitlement must support partial rollout states, beta/experimental capabilities, enterprise overrides, and deferred capabilities.
9. Entitlement must be extensible without hardcoding the platform's current feature set as final.
10. Entitlement decisions must be explainable, auditable, and reusable by routes, jobs, dashboards, workflow engines, AI systems, and integrations.

The subsystem must not become a monolithic "subscription manager." It should be composed of small contracts:

- plan/status resolution
- capability registry
- quota/usage read model
- action gate evaluation
- rollout/override evaluation
- invited contributor access evaluation
- decision output
- audit metadata
- enforcement adapters

## 3. Separation Of Concerns

### Auth

Auth answers: who is the authenticated actor?

Auth should resolve Clerk user id, email/profile identity, session validity, and actor status where available.

Auth does not answer what the workspace plan allows, whether the user has a role, whether the workspace owns rights, or whether a mutation is valid.

### RBAC

RBAC answers: what is this actor allowed to do inside this workspace by role?

RBAC should resolve workspace membership, role, permission resource, and permission action.

RBAC does not answer whether the workspace plan includes the capability, whether quota remains, whether the workspace has rights authority, or whether a feature is in beta or enterprise-only.

### Entitlement

Entitlement answers: can this workspace or request-scoped access context use this platform capability now?

Entitlement should evaluate workspace plan key, subscription/access status, feature entitlement, action gate, quota/usage allowance, rollout state, beta/experimental state, enterprise override, and invited contributor request scope.

Entitlement does not answer whether the actor owns rights, whether metadata is valid, whether evidence is sufficient, whether submission authority exists, or whether legal terms are accepted.

### Ownership

Ownership answers: who owns, controls, administers, represents, or is entitled to rights in the music?

Ownership must remain separate from login identity, workspace ownership, plan status, audit actor, and invited contributor access.

Workspace ownership is not rights ownership.

### Business Validation

Business validation answers: is the action valid under the domain's operational rules?

Examples include song metadata completeness, contributor split totals, readiness blockers, duplicate submission prevention, evidence requirements, finance/tax validation, and workflow transition validity.

Entitlement may allow access to a capability, but business validation may still block execution.

## 4. Canonical Entitlement Evaluation Flow

Canonical evaluation flow:

```text
input request/action
-> actor context from auth
-> workspace or invited-access context
-> RBAC decision
-> plan/status resolution
-> capability registry lookup
-> rollout/beta/deferred/enterprise override evaluation
-> quota/usage evaluation where required
-> action gate evaluation
-> structured entitlement decision
-> audit metadata
-> caller-specific response or enforcement
```

The entitlement engine should return a structured decision, not only a boolean.

The decision must preserve allowed or blocked state, status, reason code, workspace id, plan key where applicable, feature key, action key, quota/usage result where applicable, rollout/beta/override source where applicable, upgrade target where applicable, and audit metadata.

## 5. Workspace Plan Resolution Flow

Workspace plan resolution should be isolated from feature evaluation.

Flow:

```text
workspace id
-> resolve workspace record
-> resolve plan assignment/status
-> resolve production eligibility
-> apply admin/enterprise override if present
-> return normalized WorkspacePlanContext
```

Plan resolution must support test/demo workspaces, active production plans, trial states, suspended states, cancelled states, not-configured states, future enterprise/custom states, and future billing-provider-backed states.

Plan resolution must not call billing providers directly during every capability check, infer rights ownership, infer user permissions, or silently treat missing plan state as production access.

The initial implementation may use internal plan state before billing exists. Billing provider data should later feed plan/status state through an adapter, not replace entitlement logic.

## 6. Quota And Usage Evaluation Flow

Quota evaluation should be a separate read-model responsibility.

Flow:

```text
workspace id
-> quota key
-> period/scope
-> resolve allowance for plan/override
-> read current usage
-> compare usage to allowance
-> return quota decision
```

Quota categories must remain extensible.

Current examples:

- active works
- monthly submission queue items
- team users
- invited collaborators
- evidence storage
- evidence item count
- report exports
- automation runs
- API requests
- AI assistant usage later
- integration sync volume later
- marketing campaign volume later
- booking/performance records later

Quota evaluation must support unlimited allowances, custom enterprise allowances, beta caps, soft limits, hard limits, warnings before limit, period resets, and feature-specific scope.

Quota evaluation must not infer rights ownership, replace business validation, hide readiness blockers behind plan language, or count request-scoped invited contributors as normal workspace team users unless explicitly defined.

## 7. Action Gate Evaluation Flow

Action gates translate feature entitlement into a specific allowed or blocked operation.

Flow:

```text
feature key
-> action key
-> actor/workspace/access context
-> plan entitlement rule
-> rollout state
-> quota result
-> action-specific constraints
-> decision
```

Canonical action gate statuses:

- `allowed`
- `limited`
- `unavailable`
- `collaborator_only`
- `enterprise_only`
- `future_deferred`
- `beta`
- `experimental`
- `test_only`
- `unknown`

Action gates should be used by production route guards, workflow engines, dashboard quick actions, background jobs, AI assistant tool access, report/export services, API/integration endpoints, and admin/settings surfaces.

Action gates must not be treated as UI button toggles only. They are backend operational decisions.

## 8. Upgrade And Downgrade Lifecycle Concepts

Entitlement architecture must support plan lifecycle changes without corrupting operational state.

Upgrade concepts:

- immediate feature unlock where safe
- quota increase
- beta capability enrollment
- enterprise override assignment
- expanded reporting/export access
- expanded team or collaborator allowance

Downgrade concepts:

- new actions may be blocked
- existing records remain visible where legally/operationally required
- active workflows may need grace period or restricted completion
- exports/automation/API access may be reduced
- compliance/audit access should not disappear if records must remain defensible

Lifecycle states:

- `active`
- `trialing`
- `past_due`
- `grace_period`
- `suspended`
- `cancelled`
- `not_configured`
- `test`

Downgrades must be governed. They must not delete records, erase audit history, hide legal evidence, or break required lifecycle visibility.

## 9. TEST Vs Production Separation

TEST mode is an explicit architectural boundary.

`TEST_DEMO_PLAN` may support isolated demos, QA, training, workflow validation, simulated entitlement decisions, and non-production route behavior.

`TEST_DEMO_PLAN` must not support production song capture, real submission authority, real evidence upload as legal truth, real payouts, real royalty entitlement, production dashboard claims, or production audit claims.

Current TEST routes remain isolated:

- `POST /api/songs/create`
- `GET /api/submissions/readiness`
- `POST /api/submissions/create-from-work`
- `GET /api/submissions/lifecycle`
- `GET /api/evidence-readiness`
- `app/registration-workflow-test/page.tsx`
- `app/codex-ui-test/page.tsx`

Adding entitlement architecture does not make these production-safe.

Production routes should be separate wrappers or routes that enforce the full chain.

## 10. Invited Contributor Architecture Boundary

Invited contributor access is not a workspace plan.

It is a request-scoped access mode for a specific contributor/rightsholder/evidence participant action.

Architecture boundary:

```text
workspace plan entitlement
!= workspace membership invitation
!= request-scoped contributor access
!= rights ownership
```

Invited contributor access should support target-specific scope, action-specific permission, expiry, revocation, status, terms acceptance, audit, and evidence or split approval workflows later.

It should not grant workspace dashboard, catalogue visibility, team/settings access, finance access, unrelated evidence/files, exports, or submission authority outside the request.

Existing workspace invitations remain for true workspace membership. They should not be stretched into the invited contributor access model.

## 11. Dashboard Read-Model Architecture

Dashboards should consume entitlement as read-only visibility and action-state context.

Dashboard read-model flow:

```text
actor/workspace context
-> dashboard capability request
-> entitlement visibility decisions
-> workspace-scoped operational summaries
-> dashboard card/action model
```

Dashboard entitlement should decide whether a card can be shown, whether a count can be shown, whether a quick action is enabled, whether a module is deferred, whether a plan upgrade is required, whether a feature is beta/experimental, and whether an enterprise override is required.

Dashboard read models must not aggregate global data into production cards, show unsupported modules as live, imply production readiness from TEST data, expose plan-blocked actions as active, or confuse managed-by workspace with rights ownership.

Dashboard responses should include status language such as:

- `available`
- `limited`
- `upgrade_required`
- `permission_denied`
- `deferred`
- `test_only`
- `not_configured`
- `beta`
- `enterprise_only`

## 12. Mutation Enforcement Placement

Entitlement belongs inside the production mutation enforcement chain after RBAC and before terms/ownership/business validation/mutation.

Canonical production mutation chain:

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

Placement rules:

- entitlement should not run before auth/workspace/RBAC context exists
- entitlement should block before mutation
- entitlement should not replace terms/onboarding
- entitlement should not replace ownership/scope checks
- entitlement should not replace business validation
- entitlement decision metadata should be available to audit

Production song capture should eventually use this chain through a production wrapper/route, not by making the current TEST route silently production-active.

## 13. Audit And Event Requirements

Entitlement decisions must be auditable.

Minimum entitlement audit metadata:

- actor id
- workspace id where applicable
- access mode
- plan key where applicable
- subscription/access status
- feature key
- action key
- quota key where applicable
- usage value and limit where applicable
- decision status
- reason code
- override source where applicable
- rollout/beta flag where applicable
- target entity type/id where applicable
- production vs TEST context

Audit rules:

- allowed and blocked production-sensitive actions should be traceable
- denied entitlement decisions should be explainable
- TEST preview events must be labeled as non-production
- audit events are operational accountability records, not rights ownership records
- entitlement metadata may enrich authorization audit events, but production mutations may also need domain lifecycle/activity events

Status: Phase 7B implemented a pure durable audit handoff contract and builder in `src/lib/authz/audit/`. It maps production mutation guard handoffs into blocked, executed, or failed audit event shapes while preserving gate trail, entitlement metadata, mutation metadata, and TEST/non-production markers. Database writes, schema, migrations, durable audit persistence, route wiring, middleware, event bus/outbox, and production activation remain deferred.

## 14. Future Billing And Provider Isolation Boundary

Billing must remain isolated from entitlement logic.

Billing provider adapters may eventually translate external provider state into internal plan/status state.

Entitlement should consume normalized internal state only.

Boundary:

```text
billing provider
-> billing adapter
-> internal plan/status state
-> entitlement resolver
-> entitlement decision
```

Billing should not be called directly from every route guard, contain feature logic, contain rights logic, contain RBAC logic, decide business validation, or become the source of legal authority.

This allows future providers, manual enterprise plans, admin overrides, trials, beta access, grants, and regional payment systems without rewriting entitlement decisions.

## 15. Future API And Integration Entitlement Boundary

API and integration access must be a separate entitlement category.

Future API/integration entitlement should support API access enabled/disabled, integration category, token or app identity, workspace scope, rate limits, usage quotas, enterprise-only connectors, beta connectors, webhook volume, and audit/event logging.

API entitlement must not bypass auth/client identity, workspace scope, RBAC or app permissions, rights authority, production mutation governance, quota/usage limits, or audit.

AI tools and automation agents that call platform APIs should be treated as integration actors or delegated actors with entitlement decisions, not as trusted bypasses.

## 16. Deferred And Non-Goals

Deferred:

- schema implementation
- migrations
- route middleware
- billing provider integration
- Stripe/Paystack checkout
- dashboard implementation
- quota counter implementation
- invited contributor table implementation
- production song capture wrapper
- production submission queue wrapper
- production evidence upload/link workflow
- production finance/royalty entitlement enforcement

Non-goals:

- building a monolithic subscription manager
- hardcoding today's feature set as final
- tying billing provider events directly to feature checks
- replacing RBAC
- replacing rights ownership validation
- replacing business validation
- replacing legal/terms acceptance
- upgrading TEST routes into production routes
- inferring copyright, master ownership, publishing ownership, royalty entitlement, or submission authority from plan status

## 17. Recommended Implementation Phases

Implementation must wait for explicit approval.

### Phase 0 - Architecture Lock

- Lock this architecture.
- Keep all current production-sensitive routes unchanged.
- Keep TEST routes isolated.

### Phase 1 - Contracts And Registries

- Define plan keys, access statuses, feature keys, action keys, quota keys, decision statuses, reason codes, rollout states, and override sources.
- Define a modular capability registry that can accept future domains.
- Do not add billing.
- Do not add production enforcement.

Status: implemented as registry contract only in `src/lib/entitlements/`.

### Phase 2 - Context And Resolution

- Consolidate or wrap workspace context.
- Define workspace plan/status resolution.
- Define override and rollout resolution.
- Preserve RBAC separation.

Status: workspace plan/status read model implemented in `src/lib/entitlements/` as a pure fail-closed resolver. Workspace-context integration, persisted plan state, overrides, rollout resolution, billing, guards, and production activation remain deferred.

### Phase 3 - Pure Decision Engine

- Implement a pure entitlement evaluator.
- Return structured decisions.
- Include quota and rollout result slots even when not yet backed by persistence.
- Fail closed for unknown production-sensitive contexts.

Status: implemented in `src/lib/entitlements/` as a pure deterministic decision service. Middleware, route guards, RBAC integration, workspace-context integration, quota persistence, dashboard APIs, billing, and production activation remain deferred.

### Phase 4 - Usage Read Models

- Add read-model strategy for the first quotas.
- Start with low-risk counts such as active works and submission queue items.
- Keep usage counting separate from feature registry logic.

Status: implemented as a pure quota/read-model boundary in `src/lib/entitlements/`. DB-backed usage readers, persisted quota counters, middleware, route guards, dashboard APIs, billing, and production activation remain deferred.

### Phase 5 - Entitlement Guard Helper

- Add a pure entitlement guard helper that blocks handler execution when entitlement fails.
- Accept prechecked RBAC context as input without resolving RBAC internally.
- Return structured guard results and audit metadata handoff.
- Do not wire routes, middleware, workspace context, Clerk, Supabase, Prisma, dashboard APIs, or production mutations.

Status: implemented as a pure helper in `src/lib/entitlements/`. Production mutation guard composition, route integration, RBAC resolution, workspace-context resolution, terms enforcement, ownership checks, business validation, durable audit writes, middleware, dashboard APIs, billing, and production activation remain deferred.

### Phase 6 - Dashboard Read-Only Entitlements

- Provide dashboard entitlement summaries before enabling dashboard quick actions.
- Show deferred, beta, upgrade-required, and TEST-only states truthfully.
- Keep dashboard summary output read-only, workspace-plan-aware, and explicit that `productionReady` is false until production enforcement exists.

Status: implemented as a pure dashboard entitlement summary builder in `src/lib/entitlements/`. Dashboard UI, dashboard APIs, DB-backed operational metrics, route wiring, middleware, production quick actions, production mutation integration, billing, and production activation remain deferred.

### Phase 7 - First Production Mutation Wrapper

- Build a production-safe song capture wrapper/route.
- Do not mutate the TEST route into production behavior.
- Enforce auth, workspace, RBAC, entitlement, terms, ownership/scope, validation, mutation, and audit.

Status: Phase 7A implemented a pure injected production mutation guard contract in `src/lib/authz/guards/`. It proves strict gate order, fail-closed behavior, handler blocking, thrown-gate handling, structured errors, and audit handoff shape. Real auth/workspace/RBAC/entitlement/terms/scope/audit integrations, route wiring, production song capture, middleware, schema, migrations, and production activation remain deferred.

Phase 7B added a pure durable audit handoff builder only. It does not persist audit events or activate route governance.

### Phase 8 - Subsystem Onboarding Pattern

- Define how future subsystems register feature keys, action keys, quota keys, dashboard visibility, audit metadata, and enforcement requirements.
- Apply to submissions, evidence, finance, royalties, AI, workflows, reports, integrations, marketing, booking, and enterprise capabilities as they mature.

### Phase 9 - Billing Adapter

- Add billing provider adapters only after internal entitlement decisions are stable.
- Map provider state into internal plan/status.
- Keep billing isolated from capability logic.

## 18. Risks And Governance Concerns

Risks:

- entitlement becomes tangled with billing
- entitlement becomes tangled with RBAC
- plan status is mistaken for rights authority
- current TEST routes are accidentally treated as production
- hardcoded feature lists block future subsystem onboarding
- enterprise overrides become untracked exceptions
- beta flags bypass audit
- quotas are counted inconsistently across routes
- dashboard shows plan-enabled actions whose backend capability is still deferred
- AI tools or integrations bypass entitlement checks
- downgrade behavior hides records needed for legal or compliance reasons

Governance controls:

- all production-sensitive mutations must use the enforcement chain
- all new subsystem entitlements must register feature/action/quota keys
- all enterprise overrides must be traceable
- all beta/experimental flags must be explicit and auditable
- all billing provider state must be normalized before entitlement sees it
- all dashboard quick actions must be backed by entitlement and backend capability status
- all TEST workflows must stay labeled and isolated

## 19. Current V1 Position

The entitlement subsystem is architected, Phase 1 registry contract files are implemented, and Phase 2 workspace plan/status read model files are implemented.

Phase 3 entitlement decision service is implemented.

Phase 4 quota/usage read model is implemented as a pure non-persistent boundary.

Phase 5 entitlement guard helper is implemented as a pure non-routed boundary.

Phase 6 dashboard read-only entitlement summary is implemented as a pure non-routed boundary.

Phase 7A production mutation guard contract is implemented as a pure injected non-routed boundary.

Phase 7B durable audit handoff contract is implemented as a pure non-persistent builder boundary.

Current backend readiness is partial.

Current song capture, submission, evidence, and lifecycle workflows are not production entitlement-enforced.

This architecture should guide future implementation, but Phase 1 through Phase 7B do not activate any production capability.

## 20. Source Of Truth Relationship

This architecture depends on:

- `docs/platform/PLATFORM_SUBSCRIPTION_ENTITLEMENT_MATRIX_V1.md`
- `docs/platform/PLATFORM_ENTITLEMENT_BACKEND_CONTRACT_V1.md`
- `docs/platform/PLATFORM_ENTITLEMENT_IMPLEMENTATION_READINESS_AUDIT_V1.md`
- `docs/platform/PLATFORM_ENTITLEMENT_IMPLEMENTATION_PLAN_V1.md`
- `docs/platform/PLATFORM_ENTITLEMENT_DATA_MODEL_DECISION_V1.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- `docs/platform/PRODUCTION-MUTATION-GOVERNANCE-PATTERN.md`
- `docs/platform/OPERATIONAL-OWNERSHIP-VS-RIGHTS-OWNERSHIP.md`

Use this document before implementing entitlement schemas, route guards, dashboard entitlement read models, quota counters, invited contributor access, billing adapters, API/integration entitlement, AI capability access, workflow automation gates, or enterprise overrides.
