# Sentry Sound Platform - Subscription Entitlement Matrix V1

## 1. Purpose

This document defines the first canonical subscription entitlement matrix for the Sentry Sound Platform.

It turns the conceptual subscription direction from `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md` into a practical V1 entitlement planning surface.

It also records a backend existence analysis for subscription, entitlement, quota, billing, dashboard gating, route-level entitlement, and invited contributor access support.

The backend-facing contract for implementing these concepts later is defined in `docs/platform/PLATFORM_ENTITLEMENT_BACKEND_CONTRACT_V1.md`.

This is documentation and inspection only.

It does not implement billing, middleware, route guards, schema, migrations, UI, pricing checkout, or payment provider logic.

## 2. Files Inspected

Primary documentation inspected:

- `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- `docs/platform/PRODUCTION-MUTATION-GOVERNANCE-PATTERN.md`
- `docs/platform/OPERATIONAL-OWNERSHIP-VS-RIGHTS-OWNERSHIP.md`
- `docs/platform/PLATFORM-FOUNDATION-V1-MINIMUM-REQUIREMENTS.md`
- `docs/platform/DASHBOARD-CAPABILITY-ALIGNMENT-MATRIX.md`
- `docs/platform/APP-BUILD-MILESTONE-TRACKER.md`
- `docs/build-log/BUILD-LOG.md`

Backend and foundation areas inspected:

- `prisma/schema.prisma`
- `supabase/migrations/20260507131823_workspace_foundation.sql`
- `supabase/migrations/20260508124500_create_workspace_invitations.sql`
- `app/api/workspace-invitations/create/route.ts`
- `app/api/workspace-invitations/accept/route.ts`
- `app/api/protected/finance-test/route.ts`
- `src/lib/workspace-context/get-authenticated-workspace-context.ts`
- `src/lib/authz/guards/with-permission-guard.ts`
- `src/lib/authz/require-permission.ts`
- `src/lib/rbac/permissions.ts`
- `src/lib/workspace-invitations/create-workspace-invitation.ts`
- `src/lib/workspace-invitations/accept-workspace-invitation.ts`
- `src/lib/finance/auth/protected-finance-route.ts`
- repository search across `app`, `src`, `prisma`, `supabase`, and `sql` for subscription, entitlement, quota, billing, plan, usage counter, feature gate, Stripe, Paystack, and invited contributor access terms

## 3. Canonical Entitlement Principles

Subscription plans control workspace-level platform access and allowances.

They do not prove music rights ownership, copyright ownership, publishing ownership, master ownership, royalty entitlement, or submission authority.

Entitlement checks should sit inside the production mutation chain after workspace and role checks and before terms, ownership/scope validation, business validation, mutation, and audit:

```text
auth
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
```

Lower tiers must remain useful. Higher tiers should justify price through operational scale, governance, evidence handling, collaboration, reporting, compliance value, and risk reduction.

Plan gates must not unlock arbitrary extra buttons. They should control governed operational capacity and access to mature backend capabilities.

Independent Module Integrity applies to every tier. A paid or available module must keep its core standalone promise even when adjacent modules are not active. Higher tiers may add usage scale, governance, automation, reporting, collaboration, orchestration, integrations, and intelligence depth, but they must not turn basic module records or core workflows into hostage features.

Each module/tier definition should declare:

1. Core standalone promise
2. Optional integrations
3. Explicit exclusions
4. Upgrade-safe language
5. Data access/export expectations

Song capture, submission, and evidence workflows remain TEST-only until foundation and subscription entitlement enforcement exists.

## 4. Tier Summary

Suggested pricing bands are conceptual South African SaaS planning bands only. They are not payment products, invoices, billing rules, or public pricing commitments.

| Tier | Intended user | SaaS positioning | Suggested ZA pricing band | Functional benefit ratio | Production readiness status |
| --- | --- | --- | --- | --- | --- |
| `TEST_DEMO_PLAN` | Internal development, QA, demos, training | Non-production workflow validation | R0 internal/demo | Validates product behavior without commercial promise | TEST-only |
| `FREE_INVITED_CONTRIBUTOR_ACCESS` | Invited composer, lyricist, performer, rightsholder, evidence provider | Free request-specific participation | R0 | Removes approval friction without granting workspace control | Conceptual / missing backend mode |
| `ARTIST_STARTER` | Independent artist, songwriter, small creative workspace | Affordable creator entry plan | R99-R199/month | Useful core catalogue/readiness workflow at low cost | Conceptual |
| `ARTIST_PRO` | Active independent artist or small professional team | Professional creator operating plan | R299-R599/month | Higher scale, richer evidence and reporting value | Conceptual |
| `PRODUCER_STUDIO` | Producer, studio, production house, session-heavy workspace | Collaboration and session evidence plan | R499-R999/month | Collaboration and evidence scale for studio risk reduction | Conceptual |
| `LABEL_PUBLISHER` | Label, publisher, manager, rights administrator | Multi-work and team administration plan | R1,499-R3,999/month | Operational control, reporting, approvals, and compliance scale | Conceptual |
| `ENTERPRISE_ADMIN_COMPANY` | Large rights admin company, institutional publisher, label group, internal Sentry operations where applicable | Custom governed enterprise operations | Custom, from about R5,000+/month | Risk reduction, custom controls, support, integrations, compliance reporting | Conceptual |

## 5. Draft Subscription Entitlement Matrix

| Entitlement | `TEST_DEMO_PLAN` | `FREE_INVITED_CONTRIBUTOR_ACCESS` | `ARTIST_STARTER` | `ARTIST_PRO` | `PRODUCER_STUDIO` | `LABEL_PUBLISHER` | `ENTERPRISE_ADMIN_COMPANY` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Workspace limits | Demo/test workspace only; no production claims | No independent workspace unless user creates one | 1 production workspace | 1 production workspace; richer settings | 1 studio workspace | 1 label/publisher workspace; multi-artist administration | Custom workspace/account structure |
| User/team limits | Internal demo users | No team; request-specific access only | Owner plus small team allowance | Owner plus larger small team allowance | Studio team allowance | Larger operations team allowance | Custom teams, roles, and admin structure |
| Catalogue/work limits | TEST works only | Specific invited item only | Limited active works | Higher active works | Higher works plus session-heavy usage | Large catalogue allowance | Custom or high catalogue allowance |
| Submission limits | TEST queue only where existing TEST APIs allow | No independent submission | Limited governed submissions when production-ready | Higher governed submissions | Studio-appropriate governed submissions | High governed submissions | Custom governed submission volume |
| Evidence/storage limits | TEST/read-only evidence readiness; upload deferred | Provide evidence only for invited request when governed | Limited evidence storage when governed | Higher evidence storage when governed | Studio/session evidence allowance | Larger evidence and mandate allowance | Custom evidence, mandate, and retention controls |
| Collaborator/invited access | Simulated or TEST-only | Core purpose of tier; item-specific | Limited invitations | Higher invitations | Collaboration-heavy invitations | Larger contributor/admin invitations | Custom collaborator policies |
| Dashboard access | TEST diagnostics and guided TEST surfaces | No global dashboard; limited request status | Basic workspace dashboard | Richer creator dashboard | Studio dashboard with collaboration/evidence focus | Operations dashboard | Custom operational dashboard and reporting views |
| AI assistant access | TEST/help simulation only | Limited request help later | Basic guided help later | Richer assistant help later | Studio workflow help later | Admin/reporting help later | Custom assistant/help and enterprise knowledge support later |
| API/integration access | None except internal TEST routes | None | None or future limited exports only | Future limited integrations | Future limited integrations | Future API/integration access | Enterprise/custom integrations later |
| Reports/exports | TEST diagnostics only | No exports | Limited reports/exports | More reports/exports | Session/project reports later | Operational, submission, and compliance reports | Advanced/custom exports and compliance reporting |
| Finance/royalty access | Deferred / TEST-only references | None except future request-specific royalty visibility if authorized | Not included or future basic read-only | Limited future royalty visibility | Limited future project/royalty visibility | Finance/royalty access when implemented and governed | Advanced finance/royalty controls when implemented and governed |
| Workflow automation | TEST simulation only | No automation | Minimal reminders later | Limited automation later | Collaboration reminders later | Review/approval workflow automation later | Custom automation, review, and escalation later |
| Governance restrictions | Must remain isolated and labeled non-production | Must be request-scoped, permission-scoped, terms-gated, auditable, revocable | Must pass foundation, entitlement, terms, ownership, readiness, and audit gates | Same as Starter with higher limits | Same as Pro plus stronger collaborator/evidence controls | Strong approval, mandate, evidence, and reporting controls | Custom governance, support, audit, compliance, and contract controls |
| Upgrade triggers | Move from TEST to production capture | Contributor wants own catalogue/workspace | Active work, submission, team, collaborator, storage, or export limit | Larger team, label/publisher administration, advanced reporting | Label/publisher administration, storage, finance, or scale needs | Bulk operations, custom roles, integrations, enterprise support | Custom commercial expansion |
| Deferred/future items | Billing, real submissions, real payout, real authority | Contributor portal, item-specific terms, request-specific evidence upload | Billing, production capture entitlement, usage counters | Billing, richer reports, AI help | Session/project workflows, storage controls | Bulk tools, approvals, finance/royalty | Custom SSO, integrations, compliance exports, support SLAs |

## 6. Action Gate Matrix

Status meanings:

- `allowed`: conceptually included when production governance exists
- `limited`: included with allowance, maturity, or scope limits
- `unavailable`: not included
- `collaborator-only`: allowed only for a specific invitation/request
- `enterprise-only`: reserved for enterprise/admin-company tiers
- `future/deferred`: not a production capability yet
- `TEST-only`: valid only in isolated non-production workflows

| Action | `TEST_DEMO_PLAN` | `FREE_INVITED_CONTRIBUTOR_ACCESS` | `ARTIST_STARTER` | `ARTIST_PRO` | `PRODUCER_STUDIO` | `LABEL_PUBLISHER` | `ENTERPRISE_ADMIN_COMPANY` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Create song/work | TEST-only | unavailable | limited | allowed | allowed | allowed | allowed |
| Add contributors/splits | TEST-only | collaborator-only for requested item | limited | allowed | allowed | allowed | allowed |
| Invite contributor | TEST-only | unavailable | limited | allowed | allowed | allowed | allowed |
| Approve contributor split | TEST-only | collaborator-only | collaborator-only / limited | collaborator-only / allowed | collaborator-only / allowed | collaborator-only / allowed | collaborator-only / allowed |
| Upload evidence | future/deferred for TEST mutation | collaborator-only when governed | limited when governed | allowed when governed | allowed when governed | allowed when governed | allowed when governed |
| Check readiness | TEST-only | collaborator-only for requested item | allowed when scoped | allowed when scoped | allowed when scoped | allowed when scoped | allowed when scoped |
| Queue submission | TEST-only | unavailable | limited when production-governed | allowed when production-governed | allowed when production-governed | allowed when production-governed | allowed when production-governed |
| View lifecycle | TEST-only | collaborator-only for requested item | allowed when scoped | allowed when scoped | allowed when scoped | allowed when scoped | allowed when scoped |
| Manage releases | future/deferred | unavailable | unavailable / future | future/deferred | limited later | allowed later | allowed later |
| Manage royalties | future/deferred | collaborator-only only if later authorized | unavailable / future | limited later | limited later | allowed later | allowed later |
| Access finance | future/deferred | unavailable | unavailable | limited later | limited later | allowed later | allowed later / enterprise-only controls |
| Access marketing | future/deferred | unavailable | unavailable / future | limited later | limited later | allowed later | allowed later |
| Access booking | future/deferred | unavailable | unavailable / future | unavailable / future | limited later | future/deferred | allowed later |
| Manage team/settings | TEST-only admin | unavailable | limited owner/admin | allowed owner/admin | allowed owner/admin | allowed owner/admin | allowed owner/admin / enterprise-only advanced controls |
| Export reports | TEST diagnostics only | unavailable | limited later | limited later | limited later | allowed later | allowed / enterprise-only advanced exports |
| Use AI assistant | TEST/help only | limited request help later | basic help later | richer help later | workflow help later | admin/reporting help later | custom help/knowledge support later |
| Use API/integrations | unavailable | unavailable | unavailable | future/deferred | future/deferred | limited later | enterprise-only / custom later |

## 7. Backend Support Found

| Area | Status | Exact support found | Notes |
| --- | --- | --- | --- |
| Workspace foundation | Partial | `workspaces`, `workspace_members`, `workspace_settings`, `workspace_activity` in `supabase/migrations/20260507131823_workspace_foundation.sql` | `workspaces` has `country_code`, `base_currency`, `status`, and `metadata`, but no explicit subscription plan/status fields. |
| RBAC / permissions | Partial | `src/lib/rbac/permissions.ts`, `src/lib/authz/require-permission.ts`, `src/lib/authz/guards/with-permission-guard.ts` | Role permission checks exist; they are not plan-based entitlement checks. |
| Workspace context | Partial | `src/lib/workspace-context/get-authenticated-workspace-context.ts` | Resolves authenticated user, workspace, role, and permissions. It does not resolve plan entitlement. |
| Authorization audit | Partial | `src/lib/authz/log-authorization-event.ts`, `supabase/migrations/20260508123000_create_authorization_audit_events.sql` | Permission events can be logged. No subscription entitlement audit event contract was found. |
| Workspace invitations | Partial | `workspace_invitations` table and create/accept helpers/routes | Supports workspace role invitations. It is not a request-specific free contributor access mode. |
| Dashboard entitlement documentation | Conceptual | `docs/platform/DASHBOARD-CAPABILITY-ALIGNMENT-MATRIX.md` | Dashboard must respect plan entitlements conceptually, but no backend entitlement gate was found. |
| Finance reference guard | Partial reference only | `app/api/protected/finance-test/route.ts` uses `withPermissionGuard`; `src/lib/finance/auth/protected-finance-route.ts` checks Clerk but returns `workspaceId: "system"` | Useful reference patterns exist, but not subscription-aware and not production finance governance. |

## 8. Backend Support Missing

| Required support | Status | Current reality | Risk if ignored |
| --- | --- | --- | --- |
| Workspace subscription plan field | Missing as explicit backend contract | No explicit `subscription_plan`, `plan_key`, `subscription_status`, or billing field found in Prisma or workspace migration. `workspaces.metadata` exists but is not a typed entitlement contract. | Production gates cannot reliably know which plan a workspace has. |
| Entitlement model | Partial / non-persistent | Phase 1-3 implemented type/registry and pure decision helpers in `src/lib/entitlements/`; no entitlement table or route enforcement exists. | Routes may confuse RBAC permission with plan access if they do not later consume the governed helpers. |
| Quota model | Partial / non-persistent | Phase 4 implemented pure quota/usage contract helpers; no quota tables, persisted counters, or DB-backed usage readers exist. | Limits for works, submissions, team users, storage, exports, and collaborators cannot be enforced in production routes yet. |
| Feature gates | Partial / non-routed | Capability registry, decision service, guard helper, and dashboard summary builder exist as pure contracts; no middleware or production route gate exists. | UI/routes could expose unsupported or unaffordable operational surfaces if they bypass the future governed integration. |
| Plan-based permissions | Missing | RBAC exists, but permissions are role-based only. | A user with the right role could execute actions their workspace plan should not allow. |
| Billing/payment provider | Missing | No Stripe, Paystack, checkout, invoice, customer, price, or subscription integration found. | Paid plan lifecycle cannot be enforced. This is acceptable because billing is deferred. |
| Subscription status | Partial / non-persistent | Phase 2 implemented typed plan/status context and demo fallback; no persisted subscription status source exists. | The system cannot distinguish active paying access from suspended or expired access in production routes yet. |
| Usage counters | Partial / non-persistent | Phase 4 implemented pure usage counter shapes and quota checks; no DB-backed counters exist. | Allowance gates cannot be applied to production routes without governed readers or counters. |
| Dashboard entitlement checks | Partial / non-routed | Phase 6 implemented a pure read-only dashboard entitlement summary builder; no dashboard API/UI consumes it. | Dashboard cards may imply production readiness if future UI bypasses the read-only summary contract. |
| Route-level entitlement middleware/helper | Partial / non-routed | `withPermissionGuard` exists for RBAC and `withEntitlementGuard` exists as a pure helper; no middleware or active production route integration exists. | Production-sensitive mutations cannot enforce plan access consistently until routes are explicitly wrapped later. |
| Production mutation entitlement step | Partial / contract only | Phase 7A implemented a pure injected production mutation guard contract; active routes do not enforce it. | Song capture, queue creation, evidence, finance, and reports remain unsafe for production plan enforcement. |
| Invited contributor access mode | Missing / partial | Workspace invitations assign workspace roles. No request-specific limited contributor access model found. | External rightsholders may either be over-permissioned as workspace users or blocked from basic approval/evidence participation. |

## 9. Contradictions And Drift Found

1. Documentation now places subscription entitlement inside the production mutation chain, but backend implementation does not yet contain a subscription entitlement resolver, guard, quota model, billing status, or usage counter system.

2. The workspace foundation has `metadata`, `country_code`, and `base_currency`, but no explicit typed plan or subscription status field. Treating `metadata` as a hidden plan source would be premature without a governed contract.

3. `workspace_invitations` supports inviting a user into a workspace role. That is different from `FREE_INVITED_CONTRIBUTOR_ACCESS`, which should be item-specific, request-scoped, auditable, and not equivalent to workspace membership.

4. `withPermissionGuard` is the best current route guard reference, but it is RBAC-only. It does not perform subscription entitlement, terms acceptance, business validation, or production mutation governance by itself.

5. Current song capture, readiness, submission queue, lifecycle, and evidence readiness workflows must remain TEST-only or partial. They do not become production-ready because subscription tiers are now documented.

6. Older finance/backend references may describe broad finance capability as implemented. Latest platform governance should be treated as the controlling state for production rights workflows: finance and royalty access remain deferred until foundation, ownership, evidence, entitlement, and audit governance are aligned.

## 10. Recommended Governed Build Steps If Backend Support Is Missing

Do not implement these steps without explicit approval. This section defines sequencing only.

### Must Do Before Production Song Capture

1. Define a backend subscription entitlement contract for plan keys, feature keys, action gates, allowance keys, and route classification.
2. Add a plan resolution design that reads the current workspace plan and subscription status from a governed backend source.
3. Add a production mutation entitlement step after RBAC and before terms/ownership/business validation.
4. Keep `POST /api/songs/create`, readiness, submission queue, lifecycle, and evidence readiness isolated as TEST-only until the production route uses the foundation and entitlement chain.

### Should Do Before Dashboard Integration

1. Define dashboard entitlement categories for cards, counts, quick actions, reports, finance widgets, AI help, and integrations.
2. Build dashboard data from workspace-scoped backend summaries only.
3. Hide or disable dashboard actions when the workspace plan does not include the entitlement or when the backend capability is still deferred.

### Should Do Before Billing

1. Build entitlement and quota logic against internal plan constants first.
2. Add usage counter/read-model design for active works, submissions, team users, invited collaborators, evidence storage, exports, and automation runs.
3. Only after governed entitlement enforcement exists, map plan state to a billing provider.

### Should Do For Invited Contributors

1. Model request-specific collaborator access separately from workspace membership.
2. Preserve existing workspace invitation helpers for true workspace users.
3. Add collaborator access only when approval/evidence flows have item-specific scope, terms, audit, expiry, and revocation rules.

### Should Not Build Yet

1. Do not build Stripe, Paystack, or checkout flows yet.
2. Do not expose production dashboard quick actions for song capture, queue creation, evidence upload, finance, or exports yet.
3. Do not merge song contributors/rightsholders with workspace users.
4. Do not rebuild Clerk, workspace context, RBAC, invitation, or audit foundations.

## 11. Current V1 Position

The canonical subscription/access direction exists in documentation.

The detailed entitlement matrix now exists in this document.

Backend subscription and entitlement enforcement does not yet exist.

Current song capture, submission, evidence, and lifecycle workflows remain TEST-only or partial until they are workspace-scoped, permission-gated, subscription-entitled, terms-gated, business-validated, and audited.
