# Sentry Sound Platform - Subscription and Access Model

## 1. Purpose

This document defines how Sentry Sound subscription plans, access allowances, collaborator access, and feature gates should work at platform level.

It defines conceptual platform access logic only.

It does not implement billing, payment processing, pricing, schema changes, UI changes, migrations, or runtime enforcement.

## 2. Core Principle

Subscription plans control workspace-level platform access and allowances.

They must not be confused with music rights ownership.

An invited contributor or rightsholder may need limited free access to approve, reject, comment, or provide evidence without becoming a paying subscriber.

Rules:

- a workspace subscription controls platform feature access
- a user role controls what an authenticated user may do inside a workspace
- collaborator access controls narrow request-specific participation
- rights ownership is determined by rights records, evidence, mandates, and governance, not by plan status
- subscription entitlement must never be treated as copyright, publishing, master, royalty, or submission authority
- each paid or available module must remain operationally useful within its promised scope
- upgrades must add scale, governance, automation, reporting, collaboration, orchestration, or intelligence depth, not intentionally cripple core module workflows

## 3. Subscription Concepts

### Workspace Plan

The commercial access tier assigned to a workspace.

It controls the workspace's feature access, usage allowances, and upgrade path.

### User Role

The role a platform user has inside a workspace.

It controls permission within the workspace, but does not define plan entitlement by itself.

Examples:

- Owner
- Admin
- Rights Manager
- Submission Manager
- Evidence Reviewer
- Finance User
- Read-Only Member

### Collaborator / Invited Access

Limited access granted to a person for a specific request, work, evidence item, split approval, or comment.

Collaborator access should be permission-scoped and auditable.

It should not require the invited contributor/rightsholder to become a paying subscriber for basic approval or evidence actions.

### Feature Entitlement

A plan-level rule that determines whether a workspace may use a feature.

Examples:

- submissions enabled
- evidence vault enabled
- royalty module enabled
- team management enabled
- exports enabled
- automation enabled

### Usage Allowance

A quantity limit or quota attached to a plan.

Examples:

- number of active works
- number of team users
- number of monthly submissions
- invited collaborators
- evidence storage
- exports
- automation runs

### Action Gate

A route/service/workflow check that decides whether the current workspace may perform an action under its plan.

Action gates sit alongside foundation and RBAC checks.

### Upgrade Path

The guided path from a blocked or limited action to a higher plan, enterprise discussion, or workspace setup step.

Upgrade prompts must be truthful and must not hide legal, rights, evidence, or readiness blockers behind plan language.

Upgrade prompts must also follow Independent Module Integrity. They should explain enhancement, scale, automation, orchestration, or deeper visibility. They must not suggest that the user's core records are locked, that a paid module is useless without unrelated modules, or that basic participation requires unnecessary paid access.

Use language such as:

- Add cross-module visibility
- Automate this workflow
- Connect this to finance/submissions/releases
- Unlock deeper reporting
- Coordinate this across your workspace

Avoid language such as:

- You cannot continue
- Your work is incomplete unless you upgrade
- Your data is locked
- Submission-ready when only references exist
- AI knows what to do without reviewable user control

## 4. Conceptual Workspace Plan Categories

These plans are conceptual. They are not implemented billing products.

### TEST / Demo Plan

Target user/workspace type:

- internal development
- demo workspace
- QA / training workspace
- prototype route testing

Allowed core actions:

- create TEST works
- add TEST contributors/splits
- check readiness
- queue TEST submissions where existing TEST APIs allow
- view TEST lifecycle
- simulate future plan gates later

Limitations:

- non-production only
- no real billing
- no real submission authority
- no production claims
- no real payout/royalty use

Ideal upgrade trigger:

- workspace wants to move from TEST capture into production-governed song capture.

Risks if too restrictive:

- development and demos cannot validate workflow behavior.

Risks if too generous:

- TEST workflows may be mistaken for production-ready operations.

### Free / Invited Contributor Access

Target user/workspace type:

- invited composer
- invited lyricist/author
- invited performer
- external rightsholder
- evidence provider
- collaborator asked to review a specific item

Allowed core actions:

- view the specific request/item they were invited to
- accept action-specific terms where required
- approve or reject contributor split request
- comment on a specific request
- provide or upload/link evidence when governed
- view limited status for their request

Limitations:

- no independent workspace command centre unless they create one
- no broad catalogue access
- no team management
- no global dashboard
- no unrelated submissions or exports
- no finance/royalty dashboard unless separately authorized later

Ideal upgrade trigger:

- contributor wants to manage their own catalogue, workspace, evidence, submissions, or team.

Risks if too restrictive:

- contributors may refuse or fail to approve splits/evidence because basic participation is paywalled.

Risks if too generous:

- invited users may gain more visibility than the request requires.

### Artist Starter

Target user/workspace type:

- independent artist
- songwriter/composer starting a catalogue
- small creative workspace

Allowed core actions:

- create a limited number of works
- add contributors/splits
- check readiness
- invite limited contributors
- view lifecycle
- use basic evidence readiness
- access basic dashboard and catalogue

Limitations:

- capped active works
- capped submissions
- limited team users
- limited evidence/file storage
- no advanced finance, royalties, marketing, booking, or automation
- limited exports

Ideal upgrade trigger:

- user reaches active work, submission, collaborator, storage, export, or team limits.

Risks if too restrictive:

- serious independent artists hit limits before receiving enough value.

Risks if too generous:

- paid plan differentiation becomes unclear.

### Artist Pro

Target user/workspace type:

- active independent artist
- songwriter/composer with a growing catalogue
- small professional team

Allowed core actions:

- higher work and submission allowances
- contributor invitations
- evidence upload/linking when governed
- lifecycle tracking
- basic exports
- richer dashboard summaries
- limited workflow automation later
- basic royalty/readiness visibility later

Limitations:

- limited team size
- limited advanced finance
- limited admin-company workflows
- no enterprise-grade bulk operations
- no custom onboarding/support guarantees

Ideal upgrade trigger:

- user needs larger teams, label/publisher administration, advanced reporting, or multi-artist operations.

Risks if too restrictive:

- professional creators outgrow the platform too quickly.

Risks if too generous:

- label/publisher features may be underpriced or operationally overloaded.

### Producer / Studio

Target user/workspace type:

- producer
- studio
- production house
- session-heavy creator workspace

Allowed core actions:

- create works and recordings where supported
- manage contributors/splits
- invite collaborators
- manage evidence for sessions and authorship
- track readiness and lifecycle
- limited file vault/project usage
- future session/recording participant flows

Limitations:

- publishing/admin-company workflows limited
- broad royalty/finance workflows deferred
- booking/marketing tools deferred
- team size and storage capped by tier

Ideal upgrade trigger:

- studio needs label/publisher administration, larger teams, advanced evidence storage, or finance/royalty operations.

Risks if too restrictive:

- producers need collaboration and evidence support early.

Risks if too generous:

- production/studio access may blur into publisher/admin-company features.

### Label / Publisher

Target user/workspace type:

- label
- publisher
- rights administrator
- management company handling multiple works/artists

Allowed core actions:

- larger catalogue and submission allowances
- team users
- contributor invitations
- evidence and mandate workflows when governed
- submission/lifecycle management
- exports and reports
- release/royalty/finance access when implemented and governed
- approval/review workflows later

Limitations:

- enterprise bulk/custom integrations may require Enterprise/Admin Company
- finance/royalty modules remain deferred until production-governed
- legal/dispute controls require additional governance

Ideal upgrade trigger:

- workspace needs bulk import/export, custom roles, multiple teams, advanced reporting, API integrations, custom support, or administrator-company controls.

Risks if too restrictive:

- labels/publishers cannot manage real operational workload.

Risks if too generous:

- enterprise-level usage may overload support, compliance, or infrastructure.

### Enterprise / Admin Company

Target user/workspace type:

- large rights administrator
- institutional publisher
- label group
- enterprise catalogue owner/operator
- internal Sentry Sound operations where applicable

Allowed core actions:

- high or custom allowances
- advanced teams and roles
- approval/review workflows
- bulk operations later
- custom reports/exports
- finance/royalty modules when governed
- advanced evidence/mandate management
- enterprise support and onboarding
- integrations later

Limitations:

- requires governed onboarding and commercial approval
- custom terms may apply
- feature availability still depends on implemented backend contracts

Ideal upgrade trigger:

- workspace requires scale, custom controls, audit/compliance reporting, integrations, or multi-entity administration.

Risks if too restrictive:

- enterprise prospects cannot operate at necessary scale.

Risks if too generous:

- custom enterprise promises may outrun implemented backend governance.

## 5. Allowance Categories

Conceptual allowance categories:

| Allowance | Meaning | Notes |
| --- | --- | --- |
| Active works | Number of works/songs actively managed in the workspace. | Should distinguish archived/inactive later. |
| Registration submissions | Number of submission intents or queue actions per period. | Must still pass readiness and authority gates. |
| Team users | Number of workspace members with login access. | Separate from invited collaborator requests. |
| Invited collaborators | Number of external request-specific participants. | Should be generous enough for contributor approvals. |
| Evidence storage | Storage or evidence item allowance. | Must not enable ungoverned evidence upload before evidence workflow is ready. |
| File vault usage | Project/file storage for operational documents and assets. | Deferred until file vault is governed for product use. |
| Royalty/finance access | Access to finance, royalty, reconciliation, payout, or tax modules. | Deferred until backend contracts are reliable. |
| Marketing tools | Campaign, content, promotion, or audience workflows. | Future/deferred. |
| Booking tools | Booking, venue, setlist, settlement, performance workflows. | Future/deferred. |
| Reports/exports | Operational, rights, submission, finance, or compliance exports. | Export gates must include permissions and data scope. |
| AI assistant/help | Guided explanations and future assistant support. | Must be grounded in backend state/docs. |
| Workflow automation | Reminders, tasks, escalation, auto-generated workflows. | Should wait for blocker/task/lifecycle state. |

Allowances should be evaluated after workspace context and role resolution, and before production-sensitive action execution.

## 6. Action Gate Matrix

Status meanings:

- `allowed`: conceptually included in the plan
- `limited`: included with allowance, scope, or maturity limits
- `unavailable`: not included for the plan
- `collaborator-only`: only available for a specific invitation/request
- `enterprise-only`: reserved for enterprise/admin-company tiers
- `future/deferred`: not currently a production capability

| Action | TEST / Demo | Free / Invited Contributor | Artist Starter | Artist Pro | Producer / Studio | Label / Publisher | Enterprise / Admin Company |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Create song/work | allowed for TEST | unavailable | limited | allowed | allowed | allowed | allowed |
| Add contributors/splits | allowed for TEST | collaborator-only for requested item | limited | allowed | allowed | allowed | allowed |
| Invite contributor | allowed for TEST | unavailable | limited | allowed | allowed | allowed | allowed |
| Approve contributor split | allowed for TEST | collaborator-only | collaborator-only / limited | collaborator-only / allowed | collaborator-only / allowed | collaborator-only / allowed | collaborator-only / allowed |
| Upload evidence | future/deferred for TEST mutation | collaborator-only when governed | limited when governed | allowed when governed | allowed when governed | allowed when governed | allowed when governed |
| Check readiness | allowed for TEST | collaborator-only for requested item | allowed | allowed | allowed | allowed | allowed |
| Queue submission | allowed for TEST only | unavailable | limited when production-governed | allowed when production-governed | allowed when production-governed | allowed when production-governed | allowed when production-governed |
| View lifecycle | allowed for TEST | collaborator-only for requested item | allowed | allowed | allowed | allowed | allowed |
| Manage releases | future/deferred | unavailable | unavailable / future | future/deferred | limited later | allowed later | allowed later |
| Manage royalties | future/deferred | collaborator-only only if later authorized | unavailable / future | limited later | limited later | allowed later | allowed later |
| Access finance | future/deferred | unavailable | unavailable | limited later | limited later | allowed later | allowed later / enterprise-only controls |
| Access marketing | future/deferred | unavailable | unavailable / future | limited later | limited later | allowed later | allowed later |
| Access booking | future/deferred | unavailable | unavailable / future | unavailable / future | limited later | future/deferred | allowed later |
| Manage team/settings | allowed for TEST admin | unavailable | limited owner/admin | allowed owner/admin | allowed owner/admin | allowed owner/admin | allowed owner/admin / enterprise-only advanced controls |
| Export reports | future/deferred / TEST diagnostics | unavailable | limited | limited | limited | allowed | allowed / enterprise-only advanced exports |

No action gate can override foundation, permission, readiness, evidence, rights authority, or production mutation governance.

## 7. Collaborator Access Model

Invited contributors should not be forced into a paid subscription for basic approval actions.

Contributor/rightsholder access should be:

- request-specific
- item-specific
- permission-scoped
- time-limited where appropriate
- terms-gated for the specific action
- auditable
- revocable

Allowed collaborator actions may include:

- view request summary
- approve/reject split
- comment on a contributor/rightsholder request
- provide evidence when governed
- confirm identity or role when governed
- view limited lifecycle/status for the request

Collaborators should not automatically receive:

- workspace dashboard access
- catalogue-wide visibility
- team settings access
- finance access
- unrelated evidence/files
- exports
- submission authority outside the request

An invited contributor may later create or upgrade to their own workspace. That new workspace is separate from their collaborator access in another workspace.

Collaborator access must preserve the ownership distinction:

- a collaborator may be a rightsholder without being a subscriber
- a collaborator may approve a rights-related action without owning the workspace
- a workspace may request approval without owning the contributor's rights

## 8. Relationship To Rights Ownership

Subscription status is not rights ownership.

Rules:

- plan holder may operate workflow but may not own rights
- rightsholder may approve a rights-related action without owning the workspace
- workspace subscription does not prove copyright ownership
- workspace subscription does not prove publishing ownership
- workspace subscription does not prove master ownership
- workspace subscription does not prove royalty entitlement
- rights authority still requires evidence, mandate, contributor confirmation, legal terms, and governance

Subscription gating answers:

Can this workspace access this platform capability under its plan?

Rights governance answers:

Does this workspace or actor have authority to perform this rights-related action?

Both questions may be required before production mutation.

## 9. Relationship To Production Mutation Governance

Subscription or entitlement checks should sit after workspace/role checks and before action execution.

Recommended production mutation chain:

auth
-> profile
-> workspace
-> role
-> subscription entitlement
-> terms
-> ownership/scope
-> business validation
-> mutation
-> audit

Important:

- entitlement check does not replace RBAC
- entitlement check does not replace terms acceptance
- entitlement check does not replace rights authority
- entitlement check does not replace business validation
- entitlement check does not replace audit

If a plan blocks an action, the response should explain the plan limitation separately from readiness, rights, evidence, or permission blockers.

## 10. TEST Mode

Current development should use a conceptual `TEST_DEMO_PLAN`.

TEST_DEMO_PLAN rules:

- all basic test workflow actions enabled
- no real billing
- clearly marked non-production
- may simulate plan gates later
- may support current TEST capture/readiness/queue/lifecycle flows
- must not be described as production access
- must not imply real submission authority
- must not imply real rights ownership

Current TEST workflows should remain explicitly labeled and isolated until production foundation, subscription, and mutation governance gates are implemented.

## 11. Deferred Billing Implementation

Billing implementation is deferred.

Current position:

- no payment provider now
- no Stripe integration now
- no Paystack integration now
- no other payment provider integration now
- no real billing enforcement now
- no pricing or package contract is locked by this document
- no schema, migration, or API implementation is required by this document

This document defines conceptual plan logic only.

Future billing work must be governed separately and should not begin until platform foundation, production mutation governance, and production song capture alignment are clear.

## 12. Current V1 Position

Current status:

- subscription/billing entitlement is conceptual
- workspace/auth/RBAC/onboarding foundations exist partially
- current TEST song capture does not enforce real subscription gates
- production song capture should eventually require workspace plan entitlement before mutation
- invited contributor access should be modeled separately from paid workspace subscriptions

V1 should avoid monetization complexity that blocks the core governed rights workflow.

The near-term goal is to define where subscription checks belong, not to implement billing.

## 13. Source Of Truth Relationship

This document complements:

- `docs/platform/SENTRY-SOUND-PLATFORM-SERVICE-OFFERING.md`
- `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`
- `docs/platform/PLATFORM-FOUNDATION-V1-MINIMUM-REQUIREMENTS.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- `docs/platform/OPERATIONAL-OWNERSHIP-VS-RIGHTS-OWNERSHIP.md`
- `docs/platform/PRODUCTION-MUTATION-GOVERNANCE-PATTERN.md`
- `docs/platform/PLATFORM_SUBSCRIPTION_ENTITLEMENT_MATRIX_V1.md`
- `docs/platform/PLATFORM_ENTITLEMENT_BACKEND_CONTRACT_V1.md`
- `docs/platform/PLATFORM-ECOSYSTEM-DOMAIN-ARCHITECTURE.md`
- `docs/platform/APP-LEVEL-USER-JOURNEY-FLOW.md`
- `docs/platform/DASHBOARD-CAPABILITY-ALIGNMENT-MATRIX.md`

Use it when designing platform plans, contributor access, workspace feature gates, action allowances, upgrade paths, and future billing implementation.

Use `docs/platform/PLATFORM_SUBSCRIPTION_ENTITLEMENT_MATRIX_V1.md` when a more detailed tier-by-tier entitlement matrix and backend existence analysis is required.

Use `docs/platform/PLATFORM_ENTITLEMENT_BACKEND_CONTRACT_V1.md` when designing the future backend entitlement resolver, decision shape, quota read model, dashboard entitlement summary, route guard integration, or invited contributor access contract.
