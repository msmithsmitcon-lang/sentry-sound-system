# Sentry Sound Platform - Platform Foundation V1 Minimum Requirements

## 1. Purpose

This document defines the minimum V1 Platform Foundation requirements that must be in place before operational domains can be treated as properly grounded.

Operational domains include song capture, evidence readiness, submissions, royalties, finance, CRM, workflows, legal/dispute handling, notifications, analytics, and future AI guidance.

This is a design and governance document.

It does not define schema changes, migrations, UI work, or implementation tasks.

It aligns with:

- `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`
- `docs/platform/PLATFORM-ECOSYSTEM-DOMAIN-ARCHITECTURE.md`
- `docs/platform/APP-LEVEL-USER-JOURNEY-FLOW.md`
- `docs/platform/APP-BUILD-MILESTONE-TRACKER.md`

Status labels used:

- `[implemented]` working code/API support exists in the repo
- `[partial]` some support exists, but it is incomplete, not enforced everywhere, TEST-only, or not integrated
- `[conceptual]` required for V1 grounding but not operational yet
- `[deferred]` intentionally outside V1 minimum enforcement
- `[requirement]` minimum V1 requirement

## 2. Foundation Gate Principle

Before a user can perform production-sensitive operations, the platform must be able to answer:

Who is acting, for which workspace/entity, under what authority, under which legal/commercial terms, in which jurisdiction/currency context, and with what audit trail?

If the platform cannot answer that question, the operation must remain blocked, read-only, local-only, or explicitly marked as TEST.

## 3. Minimum Workspace / Organization Requirements

The workspace is the required operational container for production work.

Minimum V1 workspace requirements:

| Requirement | Minimum V1 rule | Current status |
| --- | --- | --- |
| Workspace existence | `[requirement]` Every production operation must resolve to one active workspace. | `[partial]` Workspace APIs and context helpers exist. |
| Workspace selection | `[requirement]` User must have a current workspace before dashboard and workflow mutations. | `[partial]` Context helpers exist, but not all routes require them. |
| Workspace ownership | `[requirement]` Captured works, evidence, queues, lifecycle events, tasks, files, and future finance records must be workspace-scoped. | `[partial]` Some queue/workspace support exists; active song capture is not fully workspace-owned. |
| Workspace name | `[requirement]` A workspace must have a user-facing name. | `[partial]` Workspace `name` support exists. |
| Workspace type | `[requirement]` A workspace must declare an operating type or default to an explicit unknown/individual state until confirmed. | `[conceptual]` Not confirmed as enforced. |
| Workspace country | `[requirement]` A workspace must declare a primary country/jurisdiction before production capture. | `[partial]` Workspace country support exists. |
| Workspace currency | `[requirement]` A workspace must declare a base operating/reporting currency. | `[partial]` Base currency support exists. |
| Workspace status | `[requirement]` A workspace must be active and not suspended/archived for production mutation. | `[conceptual]` Not confirmed as enforced. |

Minimum V1 workspace types:

- Individual Artist
- Band / Group
- Label
- Publisher
- Manager / Agency
- Producer / Studio
- Rights Administrator
- Company / Enterprise
- Internal / Demo / Test

## 4. Minimum User Identity Requirements

Production actions require an authenticated actor.

Minimum V1 user identity requirements:

| Requirement | Minimum V1 rule | Current status |
| --- | --- | --- |
| Authentication | `[requirement]` Production mutations require an authenticated user or approved system actor. | `[partial]` Clerk auth helpers exist; not all current app/API routes enforce identity. |
| Stable actor ID | `[requirement]` Every sensitive action must carry a stable actor identifier. | `[partial]` Auth helpers can resolve users, but audit envelopes are not standardized everywhere. |
| User profile | `[requirement]` User profile must include enough information to identify the actor in audit and collaboration contexts. | `[partial]` Clerk/user sync patterns exist. |
| Workspace membership | `[requirement]` User must be an active member of the resolved workspace before production mutation. | `[partial]` Workspace members/roles exist in helpers and APIs. |
| Actor type | `[requirement]` Audit must distinguish human user, service/system actor, and future delegated actor. | `[conceptual]` Not standardized. |
| Current workspace context | `[requirement]` The resolved workspace must be explicit, not inferred silently from unrelated records. | `[partial]` Context helpers exist, but registration TEST flow is not fully integrated. |

## 5. Minimum Role / Access Requirements

V1 must distinguish who can create, view, modify, submit, approve, and administer operational records.

Minimum V1 access requirements:

| Area | Minimum V1 permission requirement | Current status |
| --- | --- | --- |
| Workspace administration | `[requirement]` Manage workspace details, members, roles, and legal/entity profile. | `[partial]` Workspace role/invitation support exists. |
| Song/work capture | `[requirement]` Create work or rights asset within workspace. | `[conceptual]` Permission requirement is not enforced in active TEST capture. |
| Contributor/split management | `[requirement]` Add/edit contributor and split data before production submission. | `[partial]` Initial contributor capture exists; update/confirmation governance incomplete. |
| Readiness review | `[requirement]` View readiness and blockers for workspace-owned works. | `[partial]` Readiness API exists; workspace access not uniformly enforced. |
| Evidence review | `[requirement]` View evidence readiness; upload/review permissions remain separate and governed later. | `[partial]` Read-only evidence readiness exists; persistence alignment remains risk. |
| Submission intent | `[requirement]` Queue or submit only when actor has submission authority. | `[partial]` Readiness guard exists; actor/workspace authority incomplete. |
| Lifecycle visibility | `[requirement]` View lifecycle only for authorized workspace records. | `[partial]` Lifecycle API exists for TEST flow. |
| Finance/royalty access | `[requirement]` Financial records require distinct finance permissions. | `[partial]` Finance permission patterns exist; not integrated into rights workflow. |
| Legal/dispute access | `[requirement]` Dispute and legal authority must be explicit. | `[partial]` Dispute/amendment support exists; workflow is deferred. |
| Override/approval | `[requirement]` Override authority must be role-gated and audit-heavy. | `[conceptual]` Not active in current slice. |

Minimum V1 role set:

- Owner
- Admin
- Rights Manager
- Contributor Manager
- Submission Manager
- Evidence Reviewer
- Finance Viewer / Finance Manager
- Legal Reviewer
- Read-Only Member

The exact implementation may use existing RBAC primitives, but production workflows must not rely on a single generic logged-in user state.

## 6. Minimum Legal / Entity Profile Requirements

The platform must know whether the workspace is acting as an individual, company, administrator, label, publisher, or other rights-bearing entity.

Minimum V1 legal/entity requirements:

| Requirement | Minimum V1 rule | Current status |
| --- | --- | --- |
| Legal/entity name | `[requirement]` Workspace must have a legal or accountable operating name before production-sensitive actions. | `[partial]` Workspace legal name support exists. |
| Entity type | `[requirement]` Individual, company, label, publisher, administrator, or other declared operating form. | `[conceptual]` Not confirmed as enforced. |
| Authority basis | `[requirement]` Workspace must declare whether it owns, administers, represents, or only manages the relevant works. | `[conceptual]` Required before production submissions and future royalties. |
| Terms acceptance | `[requirement]` Platform terms must be accepted by an authorized actor before production mutation. | `[conceptual]` No confirmed platform terms gate. |
| Subscription entitlement | `[requirement]` Workspace plan must allow the requested production capability before action execution. | `[conceptual]` Plan/access model is documented, but no real billing or entitlement enforcement exists. |
| Data responsibility | `[requirement]` Workspace must accept responsibility for data accuracy and rights claims. | `[conceptual]` Not enforced. |
| Company registration | `[requirement]` Required for company/entity workspaces where applicable; optional/deferred for individuals. | `[conceptual]` Not confirmed. |
| VAT/tax status | `[requirement]` Required before finance, invoicing, payout, or VAT-sensitive workflows; not required for TEST song capture. | `[partial]` Finance tax support exists, but not foundation-gated. |

V1 does not require full legal mandate management before every song draft, but it must not present production submission or royalty workflows as complete without legal/entity authority context.

## 7. Minimum Onboarding Requirements

Onboarding is the foundation gate between authentication and production operation.

Minimum V1 onboarding sequence:

1. User authenticates.
2. System resolves existing workspace or prompts create/select.
3. User confirms workspace name.
4. User selects workspace type.
5. User confirms country/jurisdiction.
6. User confirms base currency.
7. User confirms legal/entity operating name.
8. User confirms their role/authority.
9. Authorized actor accepts platform terms.
10. System marks minimum onboarding complete.
11. User enters dashboard command centre.

Minimum onboarding rules:

- `[requirement]` Dashboard may be visible before onboarding completion only as a setup surface.
- `[requirement]` Production song capture must require minimum onboarding completion.
- `[requirement]` TEST workflows must remain explicitly labeled when they bypass onboarding.
- `[requirement]` Onboarding state must be auditable enough to know who accepted terms and when.

Current status:

- `[partial]` Onboarding bootstrap endpoint exists.
- `[partial]` Clerk sync to workspace exists.
- `[partial]` Workspace creation and invitation support exists.
- `[conceptual]` Onboarding is not yet the canonical enforced app entry gate.

## 8. Minimum Jurisdiction / Country / Currency / VAT Fields

The platform must carry jurisdiction and currency context before workflows become production-ready.

Minimum V1 fields:

| Field | Minimum V1 rule | Required before |
| --- | --- | --- |
| `country_code` | `[requirement]` Primary operating country for workspace. | Dashboard production access, song capture, regulator-specific flows |
| `jurisdiction_code` | `[requirement]` Legal/regulatory jurisdiction where it differs from country. | Submissions, disputes, legal workflows |
| `base_currency` | `[requirement]` Workspace reporting/operating currency. | Dashboard summaries, finance, royalties |
| `tax_country_code` | `[requirement]` Tax country for entity/person when finance begins. | Finance, invoices, payouts |
| `vat_registration_status` | `[requirement]` Registered, not registered, exempt, unknown, or not applicable. | Finance/VAT-sensitive workflows |
| `vat_number` | `[requirement]` Required only when VAT registered. | Finance/VAT-sensitive workflows |
| `regulator_region` | `[requirement]` Target registration/regulatory region when submissions begin. | Production submissions |
| `default_submission_society` | `[requirement]` Required only when a workflow targets a society/regulator. | SAMRO/CAPASSO/future regulator flows |

Current status:

- `[partial]` Workspace country and base currency support exists.
- `[partial]` Finance country/currency/tax support exists elsewhere.
- `[conceptual]` Jurisdiction, VAT status, and regulator preferences are not enforced as foundation gates.

## 9. Minimum Audit / Governance Requirements

Every production-sensitive action must leave a defensible audit trail.

Minimum V1 audit envelope:

| Field | Minimum V1 rule |
| --- | --- |
| `event_id` | Stable audit event identifier. |
| `event_type` | Canonical action/event type. |
| `actor_id` | Authenticated user or system actor. |
| `actor_type` | Human, system, service, or delegated actor. |
| `workspace_id` | Operational workspace scope. |
| `entity_type` | Work, asset, contributor, evidence, submission, finance record, dispute, etc. |
| `entity_id` | Target entity identifier where available. |
| `permission_context` | Role/permission basis for the action where applicable. |
| `before_state` | Required for sensitive state changes where practical. |
| `after_state` | Required for sensitive state changes where practical. |
| `source_route_or_service` | API route, service, worker, or job responsible. |
| `timestamp` | Server-side event time. |
| `request_correlation_id` | Required for traceability across route/service boundaries where available. |

Minimum V1 governance rules:

- `[requirement]` Production create/update/submit/approve/override actions must be audited.
- `[requirement]` Failed authorization and blocked readiness actions should be auditable where practical.
- `[requirement]` TEST preview events must be labeled as preview/non-persisted.
- `[requirement]` Audit events must not depend only on client-side state.

Current status:

- `[partial]` Workspace activity and authorization audit patterns exist.
- `[partial]` Registration/evidence audit concepts exist.
- `[conceptual]` A uniform actor/workspace audit envelope is not yet enforced across capture/readiness/queue/lifecycle.

## 10. Minimum Operational Dependency Rules

Operational domains must not run ahead of foundation.

Minimum dependency rules:

| Domain/action | V1 foundation dependencies |
| --- | --- |
| Dashboard command centre | Authenticated actor, selected workspace, membership, onboarding state, real backend summary data. |
| Song capture | Authenticated actor, workspace, create-work permission, plan entitlement, country/currency context, audit envelope. |
| Contributor/split management | Workspace-owned work, contributor/split permission, audit trail, split validation. |
| Readiness check | Workspace-owned work, actor visibility permission, backend validation result. |
| Evidence readiness | Workspace-owned entity, actor visibility permission, evidence persistence availability or fail-closed diagnostic. |
| Submission queue | Workspace-owned ready work, submission permission, plan entitlement, accepted terms, jurisdiction/regulator context, audit trail. |
| Lifecycle tracking | Workspace-owned queue/submission, actor visibility permission, real backend lifecycle rows. |
| Finance/royalties | Workspace/entity profile, finance permission, plan entitlement, country/currency/tax context, ownership/split authority, audit trail. |
| CRM/contact expansion | Workspace scope, contact ownership/access rules, relationship to contributor identity. |
| Workflows/tasks | Workspace scope, actor/assignee identity, permissioned mutation, audit trail. |
| Notifications | Workspace membership, recipient routing, notification preference/consent rules. |
| Legal/disputes | Legal/entity authority, evidence references, dispute permission, immutable audit trail. |

Rule:

If a downstream domain lacks the required foundation context, the platform may expose read-only diagnostics but must not expose production mutation as complete or safe.

## 11. What Is Implemented Now

Current implemented support from the inspected documents:

- `[implemented]` `POST /api/songs/create` creates an original-composition work through the current RPC.
- `[implemented]` Song creation writes basic asset, musical work, contributor, and work contributor records.
- `[implemented]` `GET /api/submissions/readiness?work_id=...` validates work existence, contributor presence, and split total.
- `[implemented]` `POST /api/submissions/create-from-work` checks readiness before queue creation.
- `[implemented]` Duplicate queue prevention and readiness guard exist for the current TEST slice.
- `[implemented]` Platform docs classify current domains with maturity labels and warn against unsupported product claims.

This implemented support is valuable, but it does not by itself make the foundation production-ready.

## 12. What Is Partial

Current partial support:

- `[partial]` Authentication helpers and authz routes exist, but production-sensitive route enforcement is not uniform.
- `[partial]` Workspace APIs, settings, members, invitations, and context helpers exist.
- `[partial]` Workspace country and base currency support exists.
- `[partial]` Workspace activity and authorization audit patterns exist.
- `[partial]` RBAC permission maps and checks exist.
- `[partial]` Submission queue can carry workspace context, but workspace ownership is not consistently mandatory.
- `[partial]` Evidence readiness is read-only and fail-closed when persistence is unavailable.
- `[partial]` Finance, royalties, CRM, notifications, legal, analytics, and workflow helper surfaces exist but are not grounded in the active music-rights production flow.
- `[partial]` App-level journey defines the dashboard as command centre, but production dashboard dependency enforcement is not confirmed.

## 13. What Is Deferred

Deferred beyond minimum V1 foundation:

- `[deferred]` Full subscription/billing entitlement enforcement, except where needed to block production access later.
- `[deferred]` Real payment provider integration and billing enforcement.
- `[deferred]` Banking and payout setup.
- `[deferred]` Full VAT/tax workflow, except minimum tax/VAT fields required before finance operations.
- `[deferred]` Contributor invitations and collaborative confirmation flows.
- `[deferred]` Evidence upload, verification, supersession, and review controls.
- `[deferred]` CAPASSO/neighbouring-rights advanced submission flows.
- `[deferred]` Royalty statement ingestion, reconciliation, settlement, and payout execution.
- `[deferred]` Full CRM/contact command centre.
- `[deferred]` Legal dispute UI and human legal review workflows.
- `[deferred]` Notification delivery automation tied to blockers and deadlines.
- `[deferred]` AI assistant surfaces and grounded response governance.
- `[deferred]` Marketing, booking, release distribution, and broad analytics expansion.

Deferred does not mean unnecessary. It means these systems must wait until foundation gates can carry actor, workspace, authority, jurisdiction, permission, and audit context.

## 14. What Blocks Song Capture From Becoming Production-Ready

Current song capture must remain TEST or pre-production until these blockers are resolved:

1. `[requirement]` Production capture must require authenticated actor identity.
2. `[requirement]` Production capture must require a selected active workspace.
3. `[requirement]` Created works/assets/contributors must be workspace-owned or workspace-scoped.
4. `[requirement]` Actor must have create-work permission in that workspace.
5. `[requirement]` Workspace plan must allow production song/work capture once subscription gates are implemented.
6. `[requirement]` Workspace must have minimum onboarding complete.
7. `[requirement]` Workspace must have country and base currency context.
8. `[requirement]` Workspace/entity legal operating name and terms acceptance must be recorded.
9. `[requirement]` Capture must write or trigger a standard audit event with actor/workspace/entity context.
10. `[requirement]` Readiness, queue, and lifecycle routes must enforce workspace visibility and mutation permissions.
11. `[requirement]` TEST-only bypasses must be removed, isolated, or clearly labeled before production entry.
12. `[requirement]` Dashboard and workflow routes must not present local-only or partially persisted capture as production truth.
13. `[requirement]` Evidence readiness must either have aligned persistence or continue to fail closed without allowing production submission.

Until these blockers are cleared, the existing capture/readiness/queue/lifecycle slice should be treated as a strong TEST foundation, not a production-ready rights intake system.

## 15. V1 Minimum Production Readiness Checklist

Platform Foundation V1 minimum is satisfied only when all of the following are true:

| Check | Status target |
| --- | --- |
| Authenticated actor required for production mutations | `[requirement]` |
| Active workspace required for dashboard/workflow production use | `[requirement]` |
| Workspace membership required for production mutation | `[requirement]` |
| Workspace has name, type, country, base currency, legal/entity name | `[requirement]` |
| Platform terms accepted by authorized actor | `[requirement]` |
| Minimum onboarding completion recorded | `[requirement]` |
| Role/permission matrix covers capture, readiness, evidence, submission, lifecycle, finance, legal, admin | `[requirement]` |
| Workspace plan/access model is defined and entitlement gates are positioned before production action execution | `[requirement]` |
| Production records are workspace-scoped | `[requirement]` |
| Audit envelope is standardized for sensitive actions | `[requirement]` |
| Jurisdiction/regulator context is required before production submission | `[requirement]` |
| Finance/royalty workflows require tax/currency/entity context before activation | `[requirement]` |
| TEST workflows are isolated and labeled | `[requirement]` |

## 16. Source Of Truth Relationship

This document turns the Platform Foundation domain architecture into minimum V1 gates.

It should be read as the production-readiness checklist beneath:

- `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`
- `docs/platform/PLATFORM-ECOSYSTEM-DOMAIN-ARCHITECTURE.md`
- `docs/platform/APP-LEVEL-USER-JOURNEY-FLOW.md`
- `docs/platform/APP-BUILD-MILESTONE-TRACKER.md`

No downstream operational domain should be considered production-grounded if it bypasses these minimum requirements.
