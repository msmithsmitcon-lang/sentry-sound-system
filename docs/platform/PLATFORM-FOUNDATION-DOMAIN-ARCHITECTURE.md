# Sentry Sound Platform - Platform Foundation Domain Architecture

## 1. Purpose

This document defines Platform Foundation as the base operational layer of Sentry Sound Platform.

Platform Foundation comes before rights, registration, songs, contributors, evidence, royalties, legal, finance, marketing, booking, analytics, or workflow execution.

It answers the platform-level questions that must be resolved before operationally sensitive work can be trusted:

- who is using the system
- under which workspace or legal/commercial entity they operate
- what authority they have
- what role and permissions apply
- what legal/commercial terms apply
- what subscription or plan applies
- what country, jurisdiction, and currency context applies
- who is auditable for each action

It does not by itself determine music rights ownership. The separation between operational ownership, actor accountability, and rights ownership is defined in `docs/platform/OPERATIONAL-OWNERSHIP-VS-RIGHTS-OWNERSHIP.md`.

Workspace subscription and plan entitlement are platform access controls, not rights ownership controls. The conceptual subscription and collaborator access model is defined in `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`.

Status labels used:

- `[implemented]` working code/API support exists in the repo
- `[partial]` some support exists, but it is incomplete, not enforced everywhere, TEST-only, or not integrated
- `[conceptual]` the concept is required but not operational yet
- `[deferred]` intentionally not active yet
- `[recommendation]` aligned future guidance

## 2. Core Foundation Question

Before the platform allows sensitive operations, it must know:

Who is acting, for which workspace/entity, under what authority, under which legal/commercial terms, and with what audit trail?

If the system cannot answer that question, it should not allow operational mutation beyond explicitly governed TEST paths.

## 3. Why Platform Foundation Comes Before Song Capture

Song capture is not just form entry.

When a user captures a song, the platform may eventually create:

- a rights-bearing asset
- contributor and split records
- registration readiness state
- evidence obligations
- submission eligibility
- audit history
- future royalty and payout implications

That work must belong to an operational container.

Without foundation context:

- `[conceptual]` the system cannot prove who owns or administers the captured work
- `[conceptual]` the system cannot decide whether the actor has permission to create, edit, submit, dispute, or approve
- `[conceptual]` the system cannot apply country, currency, tax, regulator, billing, or legal terms
- `[conceptual]` the system cannot produce defensible audit history
- `[partial]` current TEST song capture can create records, but it does not yet enforce workspace ownership or production authority

Foundation therefore sits below the current vertical slice:

Platform Foundation
-> Song Capture
-> Contributors
-> Readiness
-> Evidence
-> Queue
-> Lifecycle
-> Future royalty/reconciliation

## 4. Foundation Subdomain Matrix

| Subdomain | Purpose | Current repo status | Current support | Missing / risk | Recommended direction |
| --- | --- | --- | --- | --- | --- |
| Identity & User | Know the authenticated human/system actor | `[partial]` | Clerk auth helpers exist in `src/lib/authz/get-current-clerk-user.ts`; authz routes exist | Not all current app/API routes require authenticated actors | `[recommendation]` require actor identity for production mutations |
| Workspace / Organization | Define the operational container for assets/workflows | `[partial]` | `app/api/workspaces`, workspace context helpers, workspace invitations | Song capture and submission TEST routes are not fully workspace-scoped | `[recommendation]` make workspace context mandatory before production capture |
| Role & Permission | Determine what actor can do | `[partial]` | RBAC permission map, permission checks, workspace role lookup | Registration/evidence/submission route permissions are not uniformly enforced | `[recommendation]` define music-rights permission matrix |
| Subscription & Billing | Determine commercial entitlement | `[conceptual]` | Finance/billing-adjacent APIs exist; conceptual plan/access model now documented in `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md` | Plan/limits/entitlements not enforced | `[recommendation]` define plan gates before production rollout |
| Legal & Compliance Foundation | Confirm accepted terms and legal operating frame | `[conceptual]` | Contract/legal helpers exist elsewhere; no confirmed platform terms gate | Terms acceptance and legal entity requirement not enforced | `[recommendation]` add terms/legal acceptance before sensitive actions |
| Operational Context | Resolve current workspace, role, country, currency, permissions | `[partial]` | `getAuthenticatedWorkspaceContext`, `resolveWorkspaceContext` | Not integrated into current registration TEST flow | `[recommendation]` make operational context a standard route precondition |
| Onboarding & Setup | Bootstrap user/workspace entry into app | `[partial]` | `app/api/onboarding/bootstrap`, Clerk sync to workspace | Onboarding sequence is not the canonical entry gate for app journey yet | `[recommendation]` define minimum onboarding before dashboard access |
| Audit & Governance Foundation | Attribute every sensitive action | `[partial]` | workspace activity writes; authorization audit event helper; registration audit patterns | Capture/readiness/queue events do not all include actor/workspace | `[recommendation]` standardize actor/workspace audit envelope |
| Notification & Communication Foundation | Route messages/reminders to correct actors | `[partial]` | notification helpers and escalation queue exist | No foundation-level notification preferences/consent model | `[recommendation]` defer workflow notifications until actor/workspace routing is stable |
| Jurisdiction & Regulatory Context | Apply country, regulator, currency, tax defaults | `[partial]` | workspace country/base currency; finance country/currency endpoints | Regulator preferences not applied to registration flow | `[recommendation]` require country context before regulator-specific workflows |
| Workspace Configuration | Store defaults and operating settings | `[partial]` | `workspace_settings` created by workspace API | No canonical settings schema for rights workflows | `[recommendation]` define minimal workspace settings contract |
| Data Ownership & Privacy | Know who controls and can access data | `[conceptual]` | workspace membership/roles imply ownership boundaries | No complete data ownership/privacy policy enforcement in active slice | `[recommendation]` define ownership, retention, export, and redaction rules |

## 5. Workspace / Organization Model

The workspace is the operational container for Sentry Sound Platform.

A workspace represents the person, organization, company, team, or internal environment under which music-rights operations occur.

The workspace should eventually own or scope:

- music assets
- musical works
- contributors and split workflows
- registration journeys
- evidence packs
- submission queues
- lifecycle events
- royalty and reconciliation operations
- documents and file vault records
- legal/dispute workflows
- finance records
- notifications
- audit history
- dashboard summaries
- user/team access

Current repo status:

- `[partial]` `workspaces`, `workspace_settings`, `workspace_activity`, `workspace_members`, `workspace_user_roles`, and `workspace_invitations` are referenced by current APIs/helpers.
- `[partial]` `SubmissionQueue.workspaceId` exists but is optional.
- `[partial]` the active original-composition TEST workflow is not yet governed by mandatory workspace context.
- `[conceptual]` active song capture records are not yet consistently workspace-owned in the current TEST slice.

## 6. Possible Workspace Types

Workspace type should help the system configure defaults, permissions, onboarding, legal terms, and future workflow guidance.

Canonical workspace types:

- `[conceptual]` Individual Artist
- `[conceptual]` Band / Group
- `[conceptual]` Label
- `[conceptual]` Publisher
- `[conceptual]` Manager / Agency
- `[conceptual]` Producer / Studio
- `[conceptual]` Rights Administrator
- `[conceptual]` Enterprise / Company
- `[conceptual]` Training / Demo Workspace
- `[conceptual]` Internal Sentry Sound Workspace

Current repo status:

- `[partial]` workspace records currently support basic name/legal/country/currency fields through API code.
- `[conceptual]` workspace type is not confirmed as an enforced canonical field in the current inspected workspace API.

## 7. Workspace Core Fields

Canonical future workspace fields:

| Field | Purpose | Current status |
| --- | --- | --- |
| `workspace_id` | Stable workspace identifier | `[partial]` workspace IDs exist in workspace APIs/helpers |
| `workspace_name` | User-facing workspace name | `[partial]` `name` exists in workspace API |
| `workspace_type` | Operating model/persona | `[conceptual]` not confirmed as enforced |
| `owner_user_id` | Primary accountable owner | `[partial]` owner role assignment exists through Clerk sync patterns, but field-level ownership was not confirmed in workspace API |
| `country` | Jurisdiction/default country | `[partial]` `country_code` exists |
| `base_currency` | Operating/reporting currency | `[partial]` `base_currency` exists |
| `legal_entity_name` | Legal/commercial entity name | `[partial]` `legal_name` exists |
| `registration_number` | Company/entity registration | `[conceptual]` not confirmed in workspace API |
| `tax_status` | VAT/tax profile status | `[conceptual]` finance tax APIs exist, not foundation-gated |
| `default_role_model` | Default role/permission model | `[conceptual]` RBAC roles exist, but workspace default role model is not confirmed |
| `subscription_plan` | Commercial entitlement | `[conceptual]` not confirmed |
| `terms_acceptance_status` | Legal terms acceptance | `[conceptual]` not confirmed |
| `onboarding_status` | Setup progress | `[partial]` onboarding bootstrap exists; canonical workspace onboarding status not confirmed |
| `created_at` | Creation timestamp | `[partial]` likely present in workspace persistence; API orders by `created_at` |
| `updated_at` | Update timestamp | `[conceptual]` not confirmed by inspected route |

## 8. Workspace Onboarding Flow

Minimum foundation onboarding:

1. `[conceptual]` create or select workspace
2. `[conceptual]` choose workspace type
3. `[conceptual]` enter workspace/entity name
4. `[conceptual]` select country
5. `[conceptual]` confirm operating role
6. `[conceptual]` accept platform terms
7. `[conceptual]` land on operational dashboard

Current repo support:

- `[partial]` onboarding bootstrap endpoint exists.
- `[partial]` Clerk user sync to workspace exists.
- `[partial]` workspace creation API exists.
- `[partial]` workspace invitations and role assignment helpers exist.
- `[conceptual]` the canonical user-facing onboarding flow is not yet locked as the required app entry path.

Advanced later:

- `[deferred]` VAT/tax profile
- `[deferred]` company registration number
- `[deferred]` billing/subscription
- `[deferred]` team members
- `[deferred]` role permissions
- `[deferred]` regulator preferences
- `[deferred]` branding/defaults
- `[deferred]` banking/payout setup
- `[deferred]` legal mandates

## 9. Workspace Dependency Rules

### Dashboard access

Required before full dashboard access:

- `[recommendation]` authenticated actor
- `[recommendation]` selected or resolved workspace
- `[recommendation]` active workspace membership
- `[recommendation]` accepted platform terms
- `[recommendation]` minimum onboarding complete

Current status:

- `[partial]` workspace context APIs exist.
- `[conceptual]` app-level dashboard dependency on workspace context is not fully enforced.

### Song capture

Required before production song capture:

- `[recommendation]` authenticated actor
- `[recommendation]` workspace context
- `[recommendation]` permission to create rights assets or works
- `[recommendation]` country/jurisdiction context
- `[recommendation]` audit actor/workspace envelope

Current status:

- `[implemented]` TEST song capture creates records.
- `[partial]` song capture workspace enforcement is not active in the current TEST route/API.

### Workflow mutations

Required before workflow mutation:

- `[recommendation]` actor identity
- `[recommendation]` workspace membership
- `[recommendation]` permission for the requested action
- `[recommendation]` visible backend state and blockers
- `[recommendation]` audit record

Current status:

- `[partial]` some protected finance/authz patterns exist.
- `[partial]` registration workflow mutation routes are not uniformly protected by role/workspace context.

### Submission workflows

Required before production submission:

- `[recommendation]` workspace-owned work
- `[recommendation]` actor with submission permission
- `[recommendation]` accepted legal/commercial terms
- `[recommendation]` readiness pass
- `[recommendation]` evidence policy result where applicable
- `[recommendation]` regulator/jurisdiction context
- `[recommendation]` audit traceability

Current status:

- `[implemented]` readiness guard exists for TEST queue creation.
- `[partial]` workspace and actor enforcement is not complete for current submission routes.

### Financial workflows

Required before financial operations:

- `[recommendation]` workspace context
- `[recommendation]` finance permissions
- `[recommendation]` country, currency, tax profile
- `[recommendation]` subscription/plan entitlement where applicable
- `[recommendation]` audit trail

Current status:

- `[partial]` protected finance route patterns and finance APIs exist.
- `[deferred]` finance is not integrated into the current registration workflow.

### Legal/dispute workflows

Required before legal/dispute operations:

- `[recommendation]` authenticated actor
- `[recommendation]` workspace/legal entity context
- `[recommendation]` dispute authority
- `[recommendation]` evidence references
- `[recommendation]` immutable audit trail

Current status:

- `[partial]` dispute/amendment models and services exist.
- `[deferred]` active legal/dispute workflow is not exposed.

## 10. Relationship To Other Domains

| Domain | Foundation impact |
| --- | --- |
| Rights & Ownership | `[recommendation]` Works, contributors, splits, publishers, mandates, and ownership changes must be scoped to workspace and actor authority. |
| Registration & Compliance | `[recommendation]` Submissions must know workspace, regulator context, jurisdiction, actor, and permissions. |
| Asset & Evidence | `[recommendation]` Evidence must be owned/scoped, access-controlled, and audit-linked to workspace and actor. |
| Workflow & Operations | `[recommendation]` Tasks, blockers, approvals, queues, and lifecycle events need workspace and actor context. |
| Financial & Royalty | `[recommendation]` Statements, settlements, payouts, liabilities, tax, and currency require workspace/entity foundation. |
| Artist / CRM | `[recommendation]` Contacts and collaborators must be scoped to workspace and role permissions. |
| Release & Distribution | `[recommendation]` Release territory, DSP delivery, and distributor authority depend on workspace/entity context. |
| Marketing | `[recommendation]` Campaign assets and communications need workspace ownership and permission boundaries. |
| Legal & Dispute | `[recommendation]` Legal authority, terms, mandates, and dispute actions require authenticated actor and workspace/legal entity context. |
| Booking & Performance | `[recommendation]` Bookings, contracts, settlements, and venue/contact data depend on workspace and legal/commercial context. |
| Notifications | `[recommendation]` Notification routing depends on workspace membership, role, preferences, and consent. |
| Analytics | `[recommendation]` Metrics and insights must be workspace-scoped and permission-aware. |

## 11. Legal Protection Principle

Sentry Sound Platform must not allow operationally sensitive actions without:

- authenticated actor
- workspace/entity context
- accepted legal framework
- sufficient permissions
- audit traceability

Platform Foundation must also preserve the distinction between operational ownership and rights ownership:

- authenticated actors are not automatically rightsholders
- workspace owners are not automatically copyright, publishing, master, or royalty owners
- contributors/rightsholders may not have platform logins
- audit accountability must be recorded separately from legal rights ownership

Sensitive actions include:

- creating production rights assets
- changing contributors or splits
- linking evidence
- verifying evidence
- submitting registrations
- changing lifecycle state
- opening or resolving disputes
- approving overrides
- moving royalty or payout state
- exporting regulated or financial data

Current TEST exceptions must remain explicitly marked as TEST, bounded, and non-production.

## 12. Current Status

| Foundation area | Status | Notes |
| --- | --- | --- |
| Authentication | `[partial]` | Clerk auth helpers and authz routes exist; not all current registration routes require auth. |
| Workspace model | `[partial]` | Workspace API and workspace context helpers exist; active song capture is not yet workspace-owned in the current TEST slice. |
| Workspace onboarding | `[partial]` | Bootstrap endpoint and Clerk sync exist; canonical onboarding journey is not fully enforced. |
| Roles/permissions | `[partial]` | RBAC permission map and permission checks exist; music-rights workflow permission matrix is incomplete. |
| Subscription plans | `[conceptual]` | No implemented platform subscription/entitlement enforcement confirmed. |
| Terms acceptance | `[conceptual]` | No implemented platform terms acceptance gate confirmed. |
| Country/currency defaults | `[partial]` | Workspace country/base currency and finance country/currency helpers exist; not applied to registration workflow yet. |
| Audit actor | `[partial]` | Authorization audit and workspace activity patterns exist; not standardized across capture/readiness/queue/lifecycle. |
| Dashboard dependency | `[conceptual]` | Dashboard should depend on workspace context, but current app-level dashboard enforcement is not confirmed. |
| Song capture workspace enforcement | `[partial]` | Current TEST capture works, but does not yet require authenticated workspace context. |

## 13. Platform Foundation V1 Minimum Requirements

Minimum requirements document:

- `docs/platform/PLATFORM-FOUNDATION-V1-MINIMUM-REQUIREMENTS.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`

Purpose:

- define the minimum viable foundation required before productionizing dashboard access and song capture
- specify required workspace fields
- define onboarding gates
- define required permissions for capture/readiness/queue/lifecycle
- define audit envelope requirements
- define what remains TEST-only until foundation is enforced
- define the route/action enforcement chain that production-sensitive mutations must pass through

Status:

- `[implemented]` Documentation created as the V1 minimum production-readiness gate reference.
- `[implemented]` Enforcement chain documentation created to connect existing foundation systems to governed production mutations.

## 14. Source Of Truth Relationship

This document sits below:

- `docs/platform/PLATFORM-ECOSYSTEM-DOMAIN-ARCHITECTURE.md`
- `docs/platform/SENTRY-SOUND-PLATFORM-SERVICE-OFFERING.md`
- `docs/platform/APP-LEVEL-USER-JOURNEY-FLOW.md`
- `docs/platform/PLATFORM-FOUNDATION-V1-MINIMUM-REQUIREMENTS.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- `docs/platform/OPERATIONAL-OWNERSHIP-VS-RIGHTS-OWNERSHIP.md`
- `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`

It acts as the base layer those documents must respect before expanding operational workflows.
