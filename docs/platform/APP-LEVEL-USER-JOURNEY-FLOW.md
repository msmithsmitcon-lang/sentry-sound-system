# Sentry Sound Platform - App-Level User Journey Flow

## 1. Purpose

This document defines the foundational app-level SaaS user journey for Sentry Sound Platform.

It explains how a user enters the app, understands operational state, chooses work, and moves into task-specific workflows.

This is app/product flow documentation.

It is not backend schema design.

It is not visual styling guidance.

The journey must remain aligned to `docs/platform/PLATFORM-ECOSYSTEM-DOMAIN-ARCHITECTURE.md`, which identifies which platform domains are implemented, partial, conceptual, deferred, or recommended.

The journey must also respect `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`, which defines identity, workspace, role, permissions, legal, jurisdiction, and audit context as prerequisites for production workflows.

The production readiness gates for that foundation are defined in `docs/platform/PLATFORM-FOUNDATION-V1-MINIMUM-REQUIREMENTS.md`.

The route/action enforcement order for production-sensitive workflows is defined in `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`.

Workspace subscription, collaborator access, feature entitlements, and action allowances are defined conceptually in `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`.

## 2. App-Level Flow

Canonical app-level flow:

1. User logs in
2. System resolves or creates/selects workspace context
3. System confirms role, permissions, plan entitlement where required, legal terms, and minimum onboarding where required
4. User lands on dashboard
5. Dashboard acts as operational command centre
6. User sees what needs attention
7. User chooses an intent path
8. User enters a workflow route/task execution area
9. Backend APIs provide truth
10. UI guides the next safe action

The dashboard is not a marketing page.

The dashboard is not a vanity analytics board.

The dashboard is the operational command centre.

## 3. Dashboard As Operational Command Centre

The dashboard should show real operational state.

It should help users answer:

- What needs my attention?
- Which registrations are active?
- Which drafts are incomplete?
- Which songs are blocked?
- What is waiting on contributors or evidence?
- What is ready to submit?
- What has already been submitted?
- What lifecycle state exists?
- What safe action can I take next?

The provided SaaS dashboard reference is useful structurally:

- sidebar navigation
- dashboard overview
- quick actions
- recent songs/work items
- active files
- recent activity
- embedded new song action

Do not copy it literally.

Use the structure to support operational logic.

Dashboard implementation must also follow `docs/platform/DASHBOARD-CAPABILITY-ALIGNMENT-MATRIX.md`.

That matrix defines which dashboard areas are working, partial, conceptual, or deferred, and prevents the dashboard from presenting unsupported systems as operational.

## 4. Dashboard Should Show

### Active Registrations

Works currently moving through registration workflow.

Backend truth required:

- work identity
- registration journey state
- readiness state
- queue/lifecycle state if applicable

Safe actions:

- continue workflow
- review readiness
- view lifecycle

### Incomplete Drafts

Songs started but not yet ready.

Backend truth required:

- saved draft/work identity when backend draft exists
- local-only state must be explicitly labeled when not backend-persisted
- current incomplete stage

Safe actions:

- continue draft
- complete missing fields
- create backend draft when valid

### Blocked Songs

Works with hard blockers.

Backend truth required:

- blocker codes
- blocker messages
- affected workflow
- next safe action

Safe actions:

- review blocker
- open affected workflow section
- fix missing or invalid data

### Waiting On Contributors / Evidence

Works where progress depends on another person, signature, authority, or evidence.

Backend truth required:

- contributor confirmation state later
- evidence requirement state
- evidence verification state
- waiting reason

Safe actions:

- view waiting reason
- request/review evidence when governed
- continue other non-blocked work

### Ready To Submit

Works where backend readiness allows submission.

Backend truth required:

- readiness result
- queue eligibility
- applicable submission target

Safe actions:

- open submission intent
- create queue item through governed route

### Submitted / Lifecycle Tracking

Works with queue/submission/lifecycle state.

Backend truth required:

- submission queue rows
- lifecycle events
- regulator references/messages when present

Safe actions:

- view lifecycle
- refresh lifecycle
- resolve remediation later

### Recent Activity

Operational activity only.

Examples:

- work created
- readiness checked
- queue item created
- lifecycle status changed
- evidence blocker detected
- contributor added

No fake activity.

### Quick Actions

Quick actions must be operational.

Examples:

- Register New Song
- Continue Draft
- Review Blockers
- Check Lifecycle
- Upload Evidence later when governed

Quick actions must not bypass readiness, evidence, queue, or lifecycle governance.

Quick actions must also respect workspace plan entitlement and collaborator/request-specific access where those gates apply.

## 5. User Intent Paths

### Register New Song

What user sees:

- clear start action
- original composition workflow first
- progressive stages

What system knows:

- no work exists until backend creation succeeds
- local draft is not backend truth

Backend truth required:

- `POST /api/songs/create` or future governed draft API
- returned `work_id`
- returned `asset_id`

Safe action:

- start local draft
- create backend draft when minimum requirements are valid

Workflow opened:

- registration workflow route

### Continue Draft

What user sees:

- incomplete work
- current stage
- missing fields
- next safe action

What system knows:

- backend draft state later
- local-only state only if explicitly labeled

Backend truth required:

- future registration journey summary
- current work metadata
- stage completion state

Safe action:

- resume at earliest incomplete stage

Workflow opened:

- relevant registration journey stage

### Fix Blocker

What user sees:

- blocker in plain language
- affected stage
- downstream impact
- required correction

What system knows:

- blocker code
- validation source
- readiness impact

Backend truth required:

- readiness result
- evidence readiness result
- blocker list

Safe action:

- open affected workflow area
- correct data
- re-run readiness

Workflow opened:

- contributor/split section
- evidence section later
- readiness review

### Review Readiness

What user sees:

- ready/not ready/unknown
- issues
- summary
- next action

What system knows:

- work exists or does not exist
- contributor/split state
- readiness result

Backend truth required:

- readiness API
- evidence readiness API when applicable

Safe action:

- check readiness
- review blockers
- proceed to submission only if ready

Workflow opened:

- readiness panel/workflow stage

### Upload Evidence

What user sees:

- evidence requirements
- missing/blocked/pending states
- upload/link action only when governed

What system knows:

- applicable evidence requirements
- evidence persistence availability
- verification state

Backend truth required:

- evidence readiness
- future evidence upload/link contracts

Safe action:

- view evidence requirement now
- upload/link later when governed

Workflow opened:

- evidence pack workflow

### Check Lifecycle

What user sees:

- real queue/submission state
- lifecycle events
- empty state when none exists

What system knows:

- submission queue rows
- lifecycle events

Backend truth required:

- lifecycle API

Safe action:

- refresh lifecycle
- view details
- remediate later if applicable

Workflow opened:

- lifecycle tracking panel/page

### Manage Contributors / Splits

What user sees:

- contributor rows
- split total
- remaining allocation
- persistence state

What system knows:

- local input before save
- persisted contributors after backend save
- readiness impact

Backend truth required:

- create/update contributor contracts
- readiness summary

Safe action:

- add/edit local contributor before backend draft
- persist through governed backend route
- check readiness

Workflow opened:

- contributors and splits stage

### View Catalogue

What user sees:

- works/songs
- status summaries
- next action per item

What system knows:

- work identity
- operational state summaries

Backend truth required:

- catalogue/read model
- journey summary later

Safe action:

- open work
- continue workflow
- view lifecycle

Workflow opened:

- catalogue/work detail
- registration workflow

### View Royalties Later

What user sees:

- royalty/reconciliation information only when backend contracts exist

What system knows:

- future statement, usage, reconciliation, payout state

Backend truth required:

- royalty/reconciliation contracts
- payout governance

Safe action:

- view only real royalty/reconciliation state

Workflow opened:

- future royalty/reconciliation workspace

## 6. Dashboard UX Rules

No fake metrics.

No decorative stats unless real.

No fake "total royalties", "active projects", "streams", or "payments" unless backed by real APIs.

Actions must be operational.

Cards must show real status.

The user must always know what needs attention.

Dashboard cards must show:

- object identity
- operational state
- blocker or next action
- persistence/lifecycle context
- last updated when available

Dashboard empty states must be truthful.

Example:

- "No lifecycle history returned yet."
- "No backend drafts available yet."
- "Evidence workflow is not connected yet."

## 7. Relationship Between Dashboard And Workflow Routes

Dashboard:

- command centre
- state overview
- triage surface
- launch point for work

Workflow pages:

- task execution areas
- progressive operational work
- stage-specific data entry
- readiness and lifecycle actions

Backend APIs:

- source of truth
- validation
- persistence
- lifecycle state
- blocker state
- queue/submission state

UI:

- guides the user
- displays state
- asks for safe actions
- distinguishes local vs persisted data
- does not invent state

## 8. Canonical App-Level Navigation Model

Initial navigation should support:

- Dashboard
- Register Song
- Catalogue
- Submissions / Lifecycle
- Evidence later
- Contributors / Rights later
- Files / Projects later
- Royalties / Reconciliation later
- Settings / Team later

Navigation should not expose undeveloped modules as if they are operational.

Deferred modules may appear only as clearly labeled future/disabled areas when useful.

## 9. Canonical Dashboard Structure

Recommended structure:

- left sidebar for stable navigation
- command-centre header
- operational summary row with real counts only
- quick actions
- active/incomplete work list
- blockers/waiting list
- lifecycle/recent activity panel
- embedded new-song entry or route link

The dashboard should feel like a working cockpit for music-rights operations, not a decorative landing page.

## 10. Source Of Truth

This document is a canonical app/product flow reference.

Future UI and backend work must follow it before adding more features.

Related governance:

- `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`
- `docs/platform/PLATFORM-FOUNDATION-V1-MINIMUM-REQUIREMENTS.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`
- `docs/platform/PLATFORM-ECOSYSTEM-DOMAIN-ARCHITECTURE.md`
- `docs/platform/SENTRY-SOUND-PLATFORM-SERVICE-OFFERING.md`
- `docs/platform/DASHBOARD-CAPABILITY-ALIGNMENT-MATRIX.md`
- `docs/platform/OPERATIONAL-UX-GOVERNANCE.md`
- `docs/platform/APP-USER-EXPERIENCE-FLOW-FRAMEWORK.md`
- `docs/platform/APP-BUILD-EXECUTION-FRAMEWORK.md`
