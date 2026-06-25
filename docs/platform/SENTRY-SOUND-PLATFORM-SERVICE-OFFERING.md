# Sentry Sound Platform - Service Offering

## 1. What Sentry Sound Platform Is

Sentry Sound Platform is an operational SaaS system for managing music-rights work from creation through registration readiness, submission tracking, evidence governance, and future royalty/reconciliation operations.

It is not only a catalogue interface.

It is an operating layer for the practical work that happens between a song existing and that song being properly documented, registered, submitted, tracked, reconciled, and governed.

The platform brings together:

- platform foundation: identity, workspace, permissions, terms, jurisdiction, and audit context
- music metadata
- contributor and split governance
- rights evidence
- registration readiness
- submission lifecycle tracking
- operational blockers
- future royalty and reconciliation workflows
- project, file, artist, and catalogue context

## 2. What Service It Offers

Sentry Sound Platform offers a governed music rights operations workspace.

The service helps users:

- create and organize songs/works
- capture contributor and split information
- understand whether a song is ready for registration
- identify what is missing or blocked
- manage evidence and authority requirements
- prepare submissions to applicable bodies
- track submission lifecycle state
- preserve operational memory
- support future royalty, reconciliation, and payout workflows

The platform service is best understood as:

Music rights operations
+
Registration and evidence readiness
+
Lifecycle tracking
+
Governed SaaS workflow guidance

## 3. Who It Serves

Primary users:

- independent artists
- songwriters and composers
- producers
- labels
- publishers
- managers
- rights administrators
- music operations teams

Future extended users:

- finance/royalty operators
- catalogue managers
- sync/licensing administrators
- compliance reviewers
- collaborator contributors
- institutional operations teams

## 4. Operational Problems It Solves

Sentry Sound Platform solves the operational confusion around music rights work.

Common problems:

- songs exist but are not registration-ready
- contributors and splits are incomplete
- evidence is missing, expired, disputed, or not linked
- users do not know what body applies next
- registration state is unclear
- queue/submission state is hidden or fragmented
- lifecycle history disappears after pending status changes
- users do not know whether data is local, saved, submitted, or accepted
- royalty/reconciliation readiness is separated from rights evidence
- institutional memory is lost between people, tools, and time

The platform makes these problems visible, actionable, and governed.

## 5. Core Offering Pillars

Platform Foundation is the base layer for this offering and is documented in `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`.

Before production song capture, registration, evidence, submission, finance, legal, or royalty operations, the platform must know the authenticated actor, workspace/entity context, permission model, legal framework, jurisdiction, and audit trail.

The platform ecosystem domains are mapped in `docs/platform/PLATFORM-ECOSYSTEM-DOMAIN-ARCHITECTURE.md`.

That document separates implemented, partial, conceptual, deferred, and recommended platform domains so the service offering does not drift into unsupported claims.

### Music Rights Operations

The platform manages the operational state of rights-bearing music assets.

This includes:

- song/work identity
- ownership and contribution context
- registration readiness
- lifecycle state
- blockers and remediation
- future value-flow readiness

### Registration / Compliance Readiness

The platform evaluates whether a work is ready for registration-style workflows.

Current direction:

- original composition workflow
- SAMRO-style readiness
- backend validation of work existence
- contributor/split readiness
- queue eligibility only after readiness

Future direction:

- CAPASSO mechanical readiness
- recording/release readiness
- regulator-specific evidence rules
- territory-sensitive requirements

### Submission / Lifecycle Tracking

The platform tracks what happens after a submission queue item exists.

This includes:

- queued state
- processing state
- submitted state
- accepted/rejected/failed state later
- lifecycle events
- regulator messages when present
- duplicate prevention
- remediation links later

Lifecycle state must always come from backend data.

### Evidence / Authority Management

The platform governs proof and authority.

Evidence includes:

- split confirmations
- contributor signatures
- IPI/ISWC/ISRC proof
- publisher authorization
- mechanical mandates
- deed of assignment
- master ownership evidence
- territory clearance
- contracts

Evidence readiness must fail closed when persistence or verification is unavailable.

### Contributor / Split Governance

The platform ensures contributor and split information is visible, validated, and operationally meaningful.

This includes:

- contributors
- roles
- composition shares
- publisher/admin shares later
- split totals
- confirmation states later
- readiness impact

Split allocation must be visible and must not silently change or disappear.

### Future Royalty / Reconciliation Operations

The platform will later connect rights readiness to value flow.

Future operations include:

- royalty statement ingestion
- usage telemetry
- payout readiness
- reconciliation
- black-box/orphan detection
- deduction and settlement tracking
- royalty holds and releases

These features must not be faked before backend contracts exist.

### File / Project / Artist Operations

The platform will also serve as an operational workspace around the rights system.

This may include:

- files
- project context
- artist profiles
- recording/release material
- activity history
- team/collaborator workflows

These must support the rights workflow, not distract from it.

### Platform Foundation

The platform foundation governs:

- identity and user context
- workspace / organization context
- roles and permissions
- legal terms and compliance basis
- subscription and entitlement context later
- country, currency, and jurisdiction defaults
- audit actor and traceability

Current status is partial: workspace/auth/RBAC/onboarding support exists in the repo, but production song capture is not yet fully workspace-enforced.

## 6. What Sentry Sound Platform Is Not

Sentry Sound Platform is not just CRUD.

It is not just a song database.

It is not just a royalty calculator.

It is not just a registration form.

It is not a decorative music dashboard with fake metrics.

It is not a tool where the UI invents lifecycle, readiness, payout, or registration status.

It is not a system where users are left guessing what is saved, blocked, missing, or submitted.

## 7. Primary User Outcomes

A user should be able to:

- start a new song/work confidently
- see incomplete drafts clearly
- return to unfinished work
- understand contributor and split completeness
- know whether a song is ready for registration
- understand blockers in plain language
- provide required evidence when applicable
- submit only when backend readiness allows it
- track lifecycle state after queue/submission
- fix operational problems without losing context
- later understand royalty/reconciliation impact

The platform outcome is operational confidence:

The user knows what exists, what is saved, what is missing, what is blocked, what can happen next, and what the system is doing.
