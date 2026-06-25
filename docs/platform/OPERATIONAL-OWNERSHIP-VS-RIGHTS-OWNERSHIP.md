# Sentry Sound Platform - Operational Ownership vs Rights Ownership

## 1. Purpose

This document defines the critical separation between:

1. platform operational ownership
2. user/action accountability
3. music rights ownership

It prevents Sentry Sound Platform from confusing system users with rights holders, or workspace ownership with copyright, publishing, master, royalty, or submission authority.

This is architecture guidance only.

It does not define code changes, UI changes, schema changes, migrations, or implementation work.

## 2. Core Principle

System users are not automatically rights owners.

Rights owners are not automatically system users.

Workspace ownership is not the same as music rights ownership.

The platform must record who is acting operationally, which workspace they are acting within, and which rights entities own or control the music rights. These are related but separate layers.

## 3. Canonical Ownership Layers

### 1. Platform User / Actor

Meaning:

An authenticated person using the system.

Examples:

- admin staff member
- rights administrator
- finance user
- reviewer
- workspace owner
- invited collaborator

Owns:

- actions performed
- audit responsibility
- workflow accountability

Does not automatically own:

- copyright
- writer share
- publishing share
- master rights
- royalties

Architecture rule:

A platform user is the accountable operational actor. They may also be a rightsholder in some cases, but that must be modeled explicitly. A login account must never be treated as proof of rights ownership.

### 2. Workspace / Account / Organization

Meaning:

The operational account or entity inside Sentry Sound Platform.

Examples:

- artist workspace
- label account
- publisher account
- management company
- rights administrator
- internal Sentry Sound workspace
- demo/test workspace

Owns:

- platform subscription/account
- operational environment
- workspace data context
- user access
- dashboard/workflow context

Does not automatically own:

- all rights inside the workspace
- all contributor shares
- all publisher/admin rights
- all royalty entitlements

Architecture rule:

A workspace scopes operational data and access. It is not proof that the workspace owner owns or controls every right represented inside that workspace.

Workspace subscription controls platform access and allowances. It does not prove rights ownership, royalty entitlement, or submission authority. The conceptual subscription/access model is defined in `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`.

### 3. Rights Entity / Contributor / Rightsholder

Meaning:

A music or legal identity that may hold rights, shares, mandates, or royalty entitlements.

Examples:

- composer
- lyricist/author
- publisher
- producer
- performer
- master owner
- estate
- rights administrator
- collecting society reference

Owns or controls:

- writer shares
- publishing shares
- mechanical rights
- performing rights
- master rights
- mandates/admin authority
- royalty entitlements

May or may not:

- have a platform login
- belong to the workspace
- be represented by a workspace
- approve actions directly

Architecture rule:

Rights entities must be represented as domain identities, not inferred from workspace membership or user login. The same real-world person or company may appear as a user, contact, contributor, rightsholder, mandate holder, payee, or workspace owner, but those roles are not interchangeable.

### 4. Action Ownership / Audit Accountability

Meaning:

The system must record who performed an action.

Examples:

- user captured a song
- user edited splits
- user queued submission
- user uploaded evidence
- user approved correction

This belongs to:

- authenticated user
- workspace context
- permission context
- audit log

It must not be confused with:

- legal rights ownership

Architecture rule:

Audit events answer "who did this in the platform?" They do not answer "who owns the song?" or "who is entitled to royalties?"

### 5. Submission Authority

Meaning:

Submission authority defines who is authorized to submit or act on behalf of rightsholders.

Submission authority rules:

- a workspace may operate the submission process
- a user may perform the submission action
- rights entities may still own the rights
- evidence, mandates, accepted terms, and legal authority determine whether the workspace may act
- submission authority must be governed and auditable

Architecture rule:

Queueing or sending a submission is an operational action. The platform must separately know whether the workspace has authority to submit the relevant work on behalf of the relevant rightsholders.

## 4. Transfer / Change Of Rights

Rights transfer must not be a simple edit.

Future rights transfer should be a governed workflow:

- transfer request
- affected rights identified
- evidence required
- legal/assignment documents
- contributor/rightsholder approval where applicable
- human review where required
- audit event
- lifecycle state
- regulator/industry-body update where applicable

Examples of rights changes:

- writer assigns publishing administration to a publisher
- composer transfers a share to another rights entity
- estate assumes control after death
- master ownership transfers from artist to label
- administrator mandate expires or is revoked
- royalty participant changes payout entitlement

Architecture rule:

Changing a rightsholder, split, publisher, mandate, or royalty entitlement may affect legal, registration, evidence, dispute, and finance workflows. These changes require governance, evidence, authority checks, and audit history.

## 5. Contributor Distinction

There are at least two different contributor concepts:

1. system contributor / collaborator / user
2. song contributor / rightsholder

Do not merge them prematurely.

The platform should eventually support:

- contributor as rights entity
- contributor as contact
- contributor as invited platform user
- contributor as royalty participant
- contributor as performer/session participant

These may overlap, but they are not identical.

Examples:

- a composer may own 50 percent of a composition but never log into the platform
- a manager may have a platform login but own no writer, publishing, or master rights
- a publisher may administer rights without being the original writer
- a producer may be a performer or royalty participant without owning composition copyright
- a workspace admin may capture metadata for several external rightsholders

Architecture rule:

Contributor identity should be modeled around the music/legal role first. Platform access can be linked later when that person or organization needs a login.

## 6. Example Scenarios

### Label Workspace Admin Captures External Composer Shares

A label workspace admin captures a song where external composers own writer shares.

Correct interpretation:

- the admin is the platform actor
- the label workspace is the operational container
- the composers are rights entities
- the label may or may not own master rights or publishing rights
- evidence or mandate records must prove any authority to submit or administer

Incorrect interpretation:

- the label workspace owner automatically owns the writer shares
- the admin who entered the form owns the copyright

### Publisher Workspace Submits Under Mandate

A publisher workspace submits a work on behalf of composers under an administration mandate.

Correct interpretation:

- the publisher workspace operates the submission
- a publisher user performs the action
- composers still own writer shares unless assigned otherwise
- the mandate/evidence determines authority
- audit records show who submitted and under which workspace

Incorrect interpretation:

- submission by the publisher proves the publisher owns all rights

### Artist Workspace Owns Master But Not Full Publishing

An artist workspace may own or control a recording/master while outside writers or publishers own composition shares.

Correct interpretation:

- master ownership and composition ownership are separate
- workspace operation does not collapse those rights
- royalty and evidence workflows must respect each right category

Incorrect interpretation:

- the artist workspace owns all publishing because it controls the release

### Manager User Captures Metadata

A manager user captures metadata for an artist.

Correct interpretation:

- the manager is the actor
- the workspace scopes the operational workflow
- the manager does not automatically own any rights
- authority depends on representation terms, mandate, or workspace role

Incorrect interpretation:

- the manager owns writer, publisher, master, or royalty shares because they entered the data

### Rights Transfer From Composer To Publisher

A composer transfers publishing administration to a publisher.

Correct interpretation:

- the transfer requires evidence and governed lifecycle state
- the composer and publisher are rights entities
- the user performing the action is only the actor
- audit records capture the action; rights records capture the legal change

Incorrect interpretation:

- changing a publisher field is enough to prove legal transfer

### Contributor Never Logs In

A contributor exists as a rightsholder but never logs into the platform.

Correct interpretation:

- the contributor can still hold shares and royalty entitlement
- evidence, contact, mandate, or external society identifiers may represent them
- inviting them as a user is optional and separate

Incorrect interpretation:

- only platform users can be contributors or rightsholders

## 7. System Implications

### Workspace Scoping

Workspace scoping controls operational visibility and access. It does not prove rights ownership.

Production records should distinguish:

- workspace that manages the record
- actor who performed the action
- rights entities connected to the work
- authority basis for the workspace to act

### RBAC

RBAC determines what a platform user may do in the workspace.

RBAC does not determine:

- who owns copyright
- who receives royalties
- who controls publishing
- who owns the master

A user may have permission to edit metadata without owning any underlying rights.

### Audit

Audit records should capture:

- actor
- workspace
- permission context
- action
- target entity
- timestamp
- before/after where appropriate
- authority/evidence reference where applicable

Audit records should not be used as rights ownership records.

### Contributor Modeling

Contributor models must distinguish:

- person or organization identity
- creative or performance role
- share or entitlement
- platform account link if present
- authority/mandate relationship if present

### Royalties

Royalty workflows must use rights, shares, mandates, tax/payee, and entitlement data.

They must not infer payout ownership from:

- workspace owner
- user who captured metadata
- user who submitted registration
- platform role alone

### Disputes

Disputes may challenge:

- rightsholder identity
- split percentage
- publisher/admin authority
- master ownership
- mandate validity
- submission authority
- royalty entitlement

Dispute workflow must preserve operational actor history separately from disputed rights facts.

### Evidence

Evidence should support:

- chain of title
- split confirmation
- mandate/admin authority
- submission authority
- master ownership
- contributor identity
- transfer/assignment

Evidence should not be replaced by workspace membership or RBAC.

### Submissions

Submission workflows must know:

- who clicked submit
- which workspace submitted
- which work was submitted
- which rights entities are affected
- which authority/evidence permits submission
- which regulator/industry body received it

Submission action is not the same as rights ownership.

### Legal Terms

Platform terms should define what a user/workspace is allowed to do in the platform.

Legal rights, mandates, assignment documents, and contributor confirmations define who owns or controls music rights.

These are related but separate legal layers.

### Dashboard Cards

Dashboard cards must not imply rights ownership from operational ownership.

Examples:

- "Managed by this workspace" is different from "Owned by this workspace"
- "Captured by Markus" is different from "Owned by Markus"
- "Submitted by publisher user" is different from "Publisher owns 100 percent"
- "Waiting on contributor" is different from "Contributor has platform access"

### Production Mutation Governance

Production mutations must preserve separate fields or concepts for:

- actor identity
- workspace context
- permission result
- target entity
- rights entity
- authority/evidence basis
- audit event
- lifecycle state

This applies to capture, contributor edits, split changes, evidence upload/linking, submission queueing, lifecycle updates, royalty actions, disputes, and rights transfer.

The standard route/service governance pattern for those mutations is defined in `docs/platform/PRODUCTION-MUTATION-GOVERNANCE-PATTERN.md`.

## 8. Relationship To Platform Foundation

Platform Foundation answers:

Who is using the system, in which workspace, with what permissions, under which legal/commercial terms, and with what audit trail?

Rights Ownership answers:

Who owns, controls, administers, or is entitled to rights in the music?

These questions must both be answered before production workflows become legally and operationally reliable.

Foundation enforcement is required, but foundation enforcement alone does not prove rights ownership.

## 9. Current V1 Position

Current status:

- current TEST song capture does not yet fully separate these layers
- production model must not treat workspace owner as automatic rights owner
- production model must not treat capture user as rights owner
- production model must record operational actor separately from rights entities

Current TEST song capture can validate work creation, contributors, splits, readiness, queue creation, and lifecycle visibility as a prototype flow.

It must remain TEST-only until production routes enforce:

- authenticated actor
- synced user profile
- workspace context
- workspace membership
- permission
- terms/legal framework
- workspace-scoped operational records
- explicit rights entity/contributor records
- authority/evidence basis where required
- audit event

## 10. Recommended Future Model

Recommended separate conceptual entities:

- `PlatformUser`
- `Workspace`
- `WorkspaceMembership` / `Role`
- `RightsEntity`
- `ContributorRole` / `WorkContributor`
- `RightsShare`
- `Authority` / `Mandate`
- `SubmissionActor`
- `AuditEvent`

Conceptual relationship:

`PlatformUser`
-> acts within `Workspace`
-> through `WorkspaceMembership` / `Role`
-> performs governed action
-> against workspace-scoped operational record
-> affecting one or more `RightsEntity` records
-> under `Authority` / `Mandate` where required
-> producing `AuditEvent` and lifecycle state

Implementation is not required by this document.

This model is architecture guidance for future production alignment.

## 11. Development Rules

1. Do not infer rights ownership from login identity.
2. Do not infer rights ownership from workspace ownership.
3. Do not infer rights ownership from the user who captured data.
4. Do not infer submission authority from workspace membership alone.
5. Do not merge platform collaborators and song contributors prematurely.
6. Do not treat contributor contact records as proof of shares.
7. Do not treat audit events as chain-of-title records.
8. Do not build royalty/payout logic from workspace roles alone.
9. Do not make rights transfer a simple field edit.
10. Do not expose production dashboard language that blurs "managed by" and "owned by".

## 12. Source Of Truth Relationship

This document complements:

- `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- `docs/platform/PRODUCTION-MUTATION-GOVERNANCE-PATTERN.md`
- `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`
- `docs/platform/PLATFORM-ECOSYSTEM-DOMAIN-ARCHITECTURE.md`
- `docs/platform/SENTRY-SOUND-PLATFORM-SERVICE-OFFERING.md`
- `docs/platform/APP-LEVEL-USER-JOURNEY-FLOW.md`
- `docs/platform/DASHBOARD-CAPABILITY-ALIGNMENT-MATRIX.md`
- `docs/platform/OPERATIONAL-UX-GOVERNANCE.md`

It should be used whenever platform work touches users, workspaces, contributors, rightsholders, submission authority, evidence, royalties, disputes, or production-sensitive mutations.
