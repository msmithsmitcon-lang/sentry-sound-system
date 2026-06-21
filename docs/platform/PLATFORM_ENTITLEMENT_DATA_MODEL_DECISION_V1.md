# Sentry Sound Platform - Entitlement Data Model Decision V1

## 1. Purpose

This document defines the canonical data-model strategy for the Sentry Sound Platform entitlement subsystem before implementation begins.

It decides what should be persisted, what should remain in entitlement registry/config, what should be evaluated at runtime, and what must remain deferred until the foundation and entitlement implementation is approved.

This is design documentation only.

No code, schema, migration, middleware, billing integration, or production route activation is approved by this document.

## 2. Decision Summary

The entitlement subsystem should use the smallest governed persistence footprint first.

Canonical direction:

1. Persist only workspace-specific entitlement state that cannot safely live in static registry/config.
2. Keep plan definitions, feature definitions, action keys, quota keys, rollout states, and default allowances in versioned entitlement registry/config first.
3. Evaluate entitlement decisions at runtime using foundation context, workspace plan/status state, registry/config, quota read models, and audit metadata.
4. Defer billing provider persistence, invited contributor access persistence, dedicated quota counters, and dedicated entitlement audit tables until the relevant implementation phase is approved.
5. Preserve TEST isolation and do not treat any documented tier as production-ready without foundation and entitlement enforcement.

This keeps the model extensible without introducing a parallel billing engine or a large schema surface too early.

## 3. What Should Live In Database Tables

Database tables should hold state that is workspace-specific, actor-specific, request-specific, auditable, or operationally mutable.

Recommended database-backed state later:

| Data | Persistence direction | Reason |
| --- | --- | --- |
| Workspace plan assignment | Persist later as typed workspace entitlement state | Production routes need a reliable plan/status source. |
| Workspace entitlement status | Persist later with plan assignment | Need active, trial, suspended, cancelled, demo, not-configured, and future custom states. |
| Effective dates | Persist later | Needed for trials, expiry, suspensions, commercial changes, and audit. |
| Admin override source | Persist later when overrides exist | Enterprise/manual exceptions must be traceable. |
| Billing-provider mapping | Persist later in billing-isolated tables | Provider IDs must not become capability logic. |
| Usage counters/read models | Start as read queries; persist later only if needed | Avoid premature counter schema until performance and reset rules are known. |
| Entitlement decision audit metadata | Attach to existing audit/event records first | Preserve accountability without creating a new event system too early. |
| Request-scoped invited contributor access | Persist later in a separate model from workspace invitations | Free collaborator/rightsholder access is not workspace membership. |
| Enterprise/custom plan contracts | Persist later when commercial/admin needs exist | Custom plan state must be explicit and auditable. |
| Beta/experimental workspace enrollment | Persist later only when beta flags are operational | Needed for controlled rollout, expiry, and audit. |

Database tables should not store every feature definition, every plan matrix row, or every static entitlement rule at the start.

## 4. What Should Live In Entitlement Registry / Config

The entitlement registry/config should hold stable definitions and default rules that are not individual workspace state.

Registry/config should include:

- plan keys
- subscription/access statuses
- feature keys
- action keys
- quota keys
- decision statuses
- reason codes
- default plan-to-feature mappings
- default plan allowances
- default action gate statuses
- deferred capability markers
- TEST-only capability markers
- beta/experimental capability markers
- enterprise-only capability markers
- subsystem ownership metadata
- audit metadata requirements per action
- dashboard visibility categories
- upgrade target hints

Registry/config should be versioned and reviewed like backend contract code when implementation is approved.

The registry must support future subsystem onboarding. It must not assume the current feature set is final.

## 5. What Should Live In Runtime Evaluation Logic

Runtime entitlement logic should combine foundation context, persisted state, registry/config, quota data, and action request data into a structured decision.

Runtime logic should evaluate:

- authenticated actor context
- resolved workspace context
- RBAC result already established by the enforcement chain
- workspace plan/status context
- feature/action registry entry
- rollout/deferred/TEST-only state
- quota/usage result where required
- request-scoped invited contributor context where applicable
- enterprise override where applicable
- production sensitivity
- dashboard read-only visibility
- reason code and audit metadata

Runtime logic should return a structured decision, not a boolean.

Runtime logic must fail closed for unknown production-sensitive contexts.

Runtime logic must not:

- call billing providers directly
- infer rights ownership
- infer submission authority
- replace RBAC
- replace terms/legal acceptance
- replace business validation
- mutate production records by itself
- silently production-enable TEST workflows

## 6. What Should Remain Deferred

The following should remain deferred until the relevant phase receives explicit approval:

- billing provider tables
- payment checkout/session tables
- invoice/payment lifecycle tables
- webhook ingestion tables
- full subscription billing engine
- dedicated entitlement audit table
- dedicated persisted quota counter tables
- event-sourced quota ledger
- request-scoped invited contributor access table
- enterprise contract/override table
- beta enrollment table
- production dashboard entitlement API
- production mutation guard implementation
- production song capture route/wrapper
- production submission/evidence entitlement enforcement
- AI/API/integration entitlement enforcement

Deferral does not mean these concepts are unimportant. It means they should not be introduced before the foundation state, registry contract, and runtime decision model are stable.

## 7. Workspace Plan / Status Persistence Strategy

The first required persistence decision for production entitlement is the workspace plan/status source.

Recommended strategy:

1. Do not use untyped `metadata` as the hidden plan source.
2. Do not create a billing-shaped subscription table before billing exists.
3. Prefer a small internal workspace plan assignment model when implementation is approved.
4. Keep this model separate from billing-provider state.
5. Allow provider mapping later to feed normalized plan/status into the same resolver.

Conceptual fields for a future minimal plan assignment:

- workspace id
- plan key
- entitlement/access status
- source: system_default, workspace_record, admin_override, billing_provider_later
- production eligibility
- effective from
- effective until
- override reason or reference
- created by / updated by where applicable
- audit metadata

Open implementation decision:

- add explicit fields to `workspaces`
- create `workspace_plan_assignments`
- create `workspace_subscriptions`

Canonical recommendation:

Use a separate plan assignment/subscription-state table if production entitlement needs history, overrides, billing isolation, and effective dates. Use workspace columns only if the implementation target is intentionally minimal and no lifecycle/history is required yet.

No schema decision is approved here.

## 8. Feature / Entitlement Registry Strategy

Feature and entitlement definitions should begin as backend registry/config, not database tables.

Reasons:

- lower migration risk
- easier code review
- safer TEST/deferred markers
- avoids admin UI before governance exists
- avoids runtime editing of production capability rules
- easier to keep current matrix aligned with backend behavior
- supports type-safe feature/action/quota keys

The registry should define each subsystem as an extensible namespace, for example:

- works
- contributors
- submissions
- evidence
- dashboard
- finance
- royalties
- reports
- workflow
- automation
- AI
- API/integrations
- marketing
- booking
- enterprise/admin

Each registry entry should be able to declare:

- feature key
- action keys
- required plan behavior
- quota key if applicable
- production sensitivity
- dashboard visibility behavior
- rollout state
- TEST-only/deferred status
- enterprise-only status
- audit metadata requirements
- future subsystem owner

Moving registry data to database should be considered only after:

- admin-managed plan configuration is needed
- enterprise override complexity grows
- feature rollout requires non-developer configuration
- contract tests exist to prevent drift

## 9. Quota / Usage Persistence Strategy

Quota definitions should live in registry/config first.

Usage should start as read-model queries where safe.

Initial low-risk read-model candidates:

- active works count
- monthly submission queue count
- team user count
- invited collaborator count
- report export count later
- automation run count later
- API request count later

Persisted counters should be introduced only when read-time counting becomes unreliable, too expensive, or unable to support reset periods.

Potential future persistence:

- `workspace_usage_counters`
- `workspace_quota_events`
- materialized quota read models

Quota persistence must support:

- workspace scope
- quota key
- period scope
- used value
- limit source
- reset behavior
- custom/unlimited allowances
- auditability

Quota persistence must not:

- count request-scoped invited contributors as workspace team users unless explicitly configured
- hide readiness or legal blockers behind plan language
- infer rights ownership or submission authority
- create inconsistent route-specific counters

No quota persistence is approved here.

## 10. Audit / Event Persistence Strategy

Entitlement decisions must be auditable, but the first implementation should reuse existing audit/event foundations where possible.

Recommended strategy:

1. Attach entitlement decision metadata to `authorization_audit_events.metadata` where the existing audit event shape supports it.
2. Attach entitlement metadata to production mutation/domain lifecycle events when a governed mutation occurs.
3. Consider a dedicated entitlement audit table only after metadata conventions and production event needs are proven.

Minimum metadata later:

- actor id
- workspace id
- plan key
- entitlement/access status
- feature key
- action key
- quota key where applicable
- usage value and limit where applicable
- decision status
- reason code
- rollout/deferred/beta state where applicable
- override source where applicable
- request id / correlation id where available
- TEST vs production context

Audit records are accountability records. They are not music rights ownership records and must not be treated as proof of copyright or royalty entitlement.

## 11. Invited Contributor Persistence Boundary

Invited contributor/rightsholder access should remain separate from workspace membership.

Existing `workspace_invitations` can support workspace membership invitations. It should not be stretched into the full free invited contributor access model.

Future request-scoped invited contributor persistence should likely include:

- target object type
- target object id
- invited email and/or resolved user id
- allowed action keys
- access status
- expiry
- revocation
- accepted terms/action consent
- audit metadata
- workspace context that issued the request

This model should grant access only to the specific item/request. It should not grant:

- workspace dashboard access
- catalogue-wide visibility
- team/settings permissions
- finance access
- unrelated evidence/file access
- unrelated submission authority

No invited contributor table is approved here.

## 12. Billing / Provider Persistence Isolation

Billing is deferred and must remain isolated from entitlement logic.

Future billing provider persistence may include:

- provider customer id
- provider subscription id
- provider price/product id
- provider status
- current period dates
- payment failure state
- webhook event id
- normalized internal plan/status mapping

Billing provider tables should feed internal plan/status state through an adapter.

Entitlement should consume normalized internal state only.

Billing tables must not:

- contain feature logic
- contain RBAC logic
- contain rights ownership logic
- be called directly by route guards
- decide business validation
- decide submission authority
- become the source of legal authority

No payment provider, checkout, webhook, or billing schema is approved here.

## 13. Future Subsystem Onboarding Strategy

Every new subsystem should onboard to entitlement through registry/config first, then runtime evaluation, then persistence only if needed.

Subsystem onboarding should define:

- subsystem namespace
- feature keys
- action keys
- quota keys
- dashboard visibility status
- production sensitivity
- required foundation checks
- required business validation
- audit metadata
- default plan behavior
- deferred/beta/enterprise status
- usage read-model strategy

Subsystems that should be supported by this pattern include:

- works/song capture
- contributor/split governance
- submissions
- evidence
- finance
- royalties
- reports/exports
- workflow automation
- AI assistance
- API/integrations
- marketing
- booking
- CRM
- enterprise/admin operations

No subsystem should create isolated plan logic in its own route or table.

## 14. Future Feature Flag / Beta Strategy

Feature flags and beta access should not be hidden inside ad hoc route checks.

Initial beta/deferred states should live in registry/config.

Future per-workspace beta enrollment may need persistence only when:

- beta access differs by workspace
- beta access has expiry
- beta access requires consent/terms
- beta access affects production-sensitive workflows
- enterprise pilots require traceable overrides

Future beta persistence should include:

- workspace id
- feature key
- beta/experimental status
- effective dates
- approved by
- reason/reference
- audit metadata

Beta and experimental flags must never bypass foundation enforcement, RBAC, terms, ownership validation, business validation, audit, or TEST/production boundaries.

## 15. Prisma Vs Supabase Persistence Considerations

Current repo reality:

- Foundation tables such as `workspaces`, `user_profiles`, `workspace_user_roles`, `rbac_roles`, `authorization_audit_events`, and `workspace_invitations` are Supabase SQL migration tables.
- `prisma/schema.prisma` does not currently model those foundation tables.
- Prisma contains governed registration lifecycle models, including submission-related models.
- The platform already has a persistence alignment warning: do not introduce additional parallel persistence systems unnecessarily.

Canonical consideration:

Entitlement workspace plan/status state should live near the workspace foundation, because plan access is a workspace/account concern.

That suggests Supabase SQL migration ownership may be the natural first persistence home if/when a table is approved.

Prisma integration should be considered only if:

- production mutation services need transactional coordination with Prisma-managed lifecycle records
- the app standardizes those foundation tables into Prisma models
- duplicate persistence paths can be avoided

Do not add separate Prisma and Supabase entitlement models for the same concept.

## 16. Migration-Risk Minimization Strategy

To minimize migration risk:

1. Start with typed registry/config and pure runtime decision contracts.
2. Avoid schema changes until plan/status persistence is explicitly required.
3. Avoid using untyped metadata as a hidden production plan source.
4. Avoid billing-shaped schema before billing exists.
5. Avoid a general entitlement table for every feature unless real runtime editing is required.
6. Add only one persistence surface per approved concept.
7. Keep migrations reversible where possible.
8. Require seed/default behavior for TEST/demo workspaces.
9. Require fail-closed behavior for missing production plan state.
10. Require build-log and architecture updates for every schema decision.

Every migration proposal later must include:

- target table/columns
- ownership: Supabase SQL vs Prisma
- rollback plan
- seed/default plan
- test plan
- audit impact
- production route impact
- TEST isolation impact

## 17. Recommended Minimal Initial Persistence Footprint

Recommended initial footprint before production entitlement enforcement:

1. No new database tables for Phase 1.
2. Registry/config for plan keys, feature keys, action keys, quota keys, statuses, and default allowances.
3. Runtime decision service returning structured decisions.
4. Read-only quota queries where safe.
5. Existing audit metadata conventions for entitlement decisions.
6. A small workspace plan/status persistence model only when production route enforcement is approved.

Recommended first persistence candidate later:

- workspace plan/status assignment, separated from billing provider data.

Recommended first non-persistence implementation later:

- entitlement constants/registry contract.

Recommended first production enforcement target later:

- a production-safe song capture wrapper/route, not the current TEST route.

## 18. Things Explicitly Not To Build Yet

Do not build yet:

- billing engine
- payment provider integration
- checkout
- webhook processor
- invoice/payment lifecycle
- plan admin UI
- entitlement admin UI
- generic feature-flag service
- general entitlement database table for every capability
- persisted quota counters
- event-sourced quota ledger
- dedicated entitlement audit table
- invited contributor access table
- enterprise override table
- beta enrollment table
- dashboard entitlement API
- production entitlement guard
- production song capture activation
- production submission/evidence activation
- AI/API/integration entitlement activation

Do not change:

- code
- UI
- schema
- migrations
- middleware
- billing
- production routes

## 19. Current V1 Position

The canonical data-model decision is:

- registry/config first for entitlement definitions
- runtime evaluation for decisions
- smallest governed persistence surface for workspace-specific state
- no billing coupling
- no broad entitlement database model yet
- no quota counters yet
- no invited contributor persistence yet
- no production route activation

Current song capture, submission, evidence, lifecycle, dashboard, finance, royalty, AI, API, workflow, marketing, booking, and enterprise capabilities remain in their existing TEST-only, partial, conceptual, or deferred state until implementation is explicitly approved and verified.

## 20. Source Of Truth Relationship

This decision depends on:

- `docs/platform/PLATFORM_ENTITLEMENT_SYSTEM_ARCHITECTURE_V1.md`
- `docs/platform/PLATFORM_ENTITLEMENT_IMPLEMENTATION_PLAN_V1.md`
- `docs/platform/PLATFORM_ENTITLEMENT_BACKEND_CONTRACT_V1.md`
- `docs/platform/PLATFORM_ENTITLEMENT_IMPLEMENTATION_READINESS_AUDIT_V1.md`
- `docs/platform/PLATFORM_SUBSCRIPTION_ENTITLEMENT_MATRIX_V1.md`
- `docs/platform/CANONICAL-PERSISTENCE-DIRECTION.md`

Use this decision before proposing entitlement schema, migrations, billing tables, quota counters, invited contributor access tables, feature flag persistence, or production entitlement enforcement.
