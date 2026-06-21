# Sentry Sound Distribution Relationship Model V1

Date: 2026-06-05

Status: doctrine and distribution authority definition only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

Distribution Relationship is the downstream operational relationship that records how a verified Release is delivered, made available, updated, removed, referenced, and reported through distributors, DSPs, channels, and territories.

Distribution is not ownership. It does not create Works, Masters, Rights Interests, Registrations, Releases, or royalty entitlement. Distribution consumes those truths after they have been established by the relevant authority layers.

Immediate doctrine lock:

- Distribution does not create ownership.
- Distribution does not create Rights Interest.
- Distribution does not create Works.
- Distribution does not create Masters.
- Distribution consumes Release truth.
- Distribution consumes Registration truth.
- Distribution consumes Rights Interest authority.
- Distribution consumes Readiness.
- DSP references are not ownership authority.
- Distributor references are not ownership authority.
- Distributor acceptance is not proof of rights ownership.

Current platform reality:

- Distribution Pipeline exists with `distribution_channels`, `distribution_releases`, `distribution_release_channels`, `distribution_delivery_events`, and `distribution_audit_events`.
- Distribution releases now link to Release Management through `distribution_releases.source_release_id -> releases.id`.
- Distribution channel records represent DSP/platform destinations.
- Release-channel records track territory/platform delivery state.
- Delivery and audit events capture operational history.
- Existing distribution docs already state distribution must not duplicate Rights, Contracts, Artist, or CRM data.

This document does not design implementation. It defines the distribution doctrine future distribution, reporting, takedown, redelivery, and royalty workflows must respect.

## 2. Recommended Distribution Relationship Model

Conceptual model:

```text
Distribution Relationship
  workspace context
  source release
  distributor / delivery partner
  DSP or platform channel
  territory / market scope
  delivery intent
  delivery status
  availability status
  takedown / removal status
  redelivery history
  distributor references
  DSP references
  distribution evidence
  reporting context
  audit context
```

Distribution Relationship should answer:

- which Release is being distributed?
- through which distributor, partner, or channel?
- to which DSP, platform, or destination?
- for which territories or market scope?
- under what delivery status?
- is the release live, removed, failed, scheduled, or pending?
- what external references have been returned?
- what delivery events and evidence exist?
- what takedowns, redeliveries, corrections, or channel changes occurred?
- what reporting context may later support royalty events?

Distribution Relationship should produce operational delivery clarity, not rights authority.

## 3. What Is A Distribution Relationship?

A Distribution Relationship is the operational record of a release's downstream delivery and availability relationship with a distributor, DSP, platform, channel, or territory.

It may include:

- distributor or delivery partner identity
- DSP/platform/channel identity
- territory scope
- scheduled delivery
- submission state
- delivery confirmation
- live/availability state
- failure state
- takedown/removal state
- redelivery/correction history
- external references
- distributor/DSP messages
- evidence of delivery or availability
- reporting context for future royalty ingestion

It is not:

- a Work
- a Master / Recording
- a Release
- a Registration
- a Rights Interest
- a Contract by itself
- a Party identity by itself
- a royalty entitlement
- proof of ownership

## 4. Distribution Relationship vs Release

Release is the commercial package.

Distribution Relationship is the downstream delivery relationship for that package.

Release owns:

- release title
- release type
- track sequence
- artist presentation
- release dates
- package metadata
- UPC/EAN where governed
- lifecycle and metadata snapshots

Distribution Relationship owns:

- delivery/channel relationship
- distributor or channel selection
- DSP/platform destination
- territory delivery scope
- delivery status
- availability/removal status
- external distributor/DSP references
- delivery events
- distribution evidence
- takedown/redelivery history

Doctrine rules:

- Distribution must point to Release truth where possible.
- Distribution must not create the Release package.
- Distribution must not duplicate release metadata as authority.
- Distribution corrections should flow back as review signals, not silent release-truth mutations.
- A release can exist without distribution.
- A release can have many distribution relationships.
- Distribution status must not determine whether a Release was ready.

Chronicle reference:

A Chronicle release may be ready but not distributed. In that case, Release and Release Readiness may be valid while no Distribution Relationship is active yet.

## 5. Distribution Relationship vs Master / Recording

Master / Recording is the sound recording identity.

Distribution Relationship is the delivery relationship through which a Release containing that Master is sent to external platforms.

Doctrine rules:

- Distribution consumes Master truth through Release tracks.
- Distribution does not create Masters.
- Distribution does not decide whether a file is a commercial Master.
- Distribution does not own ISRC authority.
- Distributor/DSP ISRC references are external reference state, not Master authority by themselves.
- If a master changes, distribution should reflect whether redelivery or takedown is required.

Chronicle reference:

A demo recording uploaded for review is not a commercial Master merely because it is sent to a platform. Master approval and Rights Interest authority must precede distribution.

## 6. Distribution Relationship vs Registration

Registration is the downstream authority, verification, and external-body workflow for identifiers and registration references.

Distribution Relationship is delivery and availability state.

Doctrine rules:

- Distribution consumes registration truth.
- Distribution does not create registrations.
- Distribution does not create ISWC, ISRC, IPI, UPC/EAN, society, or distributor identifier authority.
- Distributor references are not registration authority by themselves.
- DSP references are not registration authority by themselves.
- Distributor acceptance does not prove registration correctness.
- Distribution failures may reveal registration problems, but they do not define registration truth.

Chronicle reference:

A Chronicle release may be delivered before a particular registration reference is returned only where policy allows deferral. That delivery state still must not be treated as ownership or registration proof.

## 7. Distribution Relationship vs Rights Interest

Rights Interest is the authority layer that states who owns, controls, administers, licenses, distributes, collects, or receives benefit from rights.

Distribution Relationship is the operational channel through which an authorized Release is delivered.

Doctrine rules:

- Distribution consumes verified Rights Interest.
- Distribution does not create Rights Interest.
- Distribution authority should ultimately depend on Rights Interest scope.
- Territory exclusions should respect Rights Interest and contract scope.
- Takedown requirements may originate from Rights Interest changes.
- Distribution status should not override ownership, administration, collection, or licensing truth.
- Distributor acceptance is not proof that the distributor or uploader owns the rights.

Chronicle reference:

If Chronicle Music administers distribution for a work or master but does not own it, the Rights Interest must describe that authority. The distribution record should consume that authority; it must not imply ownership.

## 8. Distribution Relationship vs Party

Party is the legal/commercial identity layer.

Distribution Relationship may involve Parties such as:

- distributor
- label
- rights administrator
- DSP/platform operator
- service provider
- catalogue owner
- contracting counterparty

Doctrine rules:

- A distributor should ultimately be represented as a Party or Party-linked operational relationship.
- A DSP/platform operator may be represented as a Party, external system, channel, or approved reference depending on future model boundaries.
- Distribution records must not collapse Party, Artist Brand, CRM Contact, and Distributor into one identity.
- Chronicle Music may be a Party acting as label, operator, or rights administrator only where supporting records say so.
- M-Wis and Huey D remain Artist Brands, not distributor Parties by default.

## 9. Distribution Relationship vs DSP

DSP means digital service provider or destination platform, such as a streaming or download platform.

Distribution Relationship is broader than a DSP. It can include distributor, DSP, delivery partner, territory, availability, and reporting state.

Doctrine rules:

- A DSP is a destination/channel, not ownership authority.
- A DSP reference is external platform state, not proof of rights.
- DSP live status does not prove release readiness.
- DSP removal does not erase the Release, Work, Master, Rights Interest, or Registration records.
- DSP reporting may later support Royalty Events, but it does not define royalty authority alone.

## 10. Distribution Relationship vs Royalty Event

Royalty Event is a downstream economic/reporting event.

Distribution Relationship may provide the channel, territory, DSP, distributor, report, and availability context that helps interpret a Royalty Event.

Doctrine rules:

- Distribution does not create royalty entitlement.
- Royalty authority should derive from verified Rights Interest and payee/settlement rules.
- Distribution reports can trigger or evidence Royalty Events.
- DSP/distributor reporting must be reconciled to Release, Master, Work, Rights Interest, and Party truth.
- A Royalty Event should not rely only on visible contributor split rows or distributor payout files.

Chronicle reference:

If a platform report arrives for a Chronicle release, that report may support a Royalty Event. It must still be interpreted through verified Work/Master/Rights/Party authority.

## 11. Distribution Concepts And Boundaries

### Distributor

A distributor is a delivery partner or service provider that sends releases to DSPs/platforms and may provide references, reporting, takedown operations, and payment statements.

Belongs to Distribution Relationship:

- selected distributor
- distributor account/reference
- delivery partner state
- distributor messages
- distributor submission/acceptance events
- distributor report references

Must not own:

- Work truth
- Master truth
- ownership truth
- registration authority
- final royalty entitlement

### DSP

A DSP is a destination platform or digital service provider.

Belongs to Distribution Relationship:

- channel/platform identity
- delivery status
- live/removal state
- platform references
- channel-specific evidence
- reporting context

Must not own:

- ownership authority
- rights scope
- master approval
- registration correctness

### Territory

Territory defines the market, country, region, or scope in which a release is delivered or made available.

Belongs to Distribution Relationship:

- territory code/scope
- exclusions
- territory-specific delivery status
- territory-specific takedown or availability state

Must consume:

- Rights Interest territory scope
- contract/mandate territory scope
- release/distribution policy

### Delivery

Delivery is the operational act of sending release data/assets to a distributor, DSP, channel, or platform.

Belongs to Distribution Relationship:

- queued/submitted/processing/delivered status
- delivery events
- delivery payload evidence or references
- failure/retry state

Must not create:

- release truth
- rights authority
- registration authority
- readiness truth

### Availability

Availability is whether a Release is visible, live, streamable, downloadable, purchasable, blocked, or unavailable in a destination/territory.

Belongs to Distribution Relationship:

- live status
- removed status
- availability date
- territory/platform availability status
- evidence of availability

Must not prove:

- ownership
- registration correctness
- release readiness
- royalty entitlement

### Takedown

Takedown is the operational removal request or removal state for a distributed release/channel/territory.

Belongs to Distribution Relationship:

- takedown request
- reason/context
- affected territories/channels
- removal confirmation
- audit trail

May be triggered by:

- Rights Interest change
- contract expiry
- registration/identifier issue
- platform policy issue
- metadata correction
- release strategy

Must not erase:

- Work truth
- Master truth
- Release history
- Rights Interest history
- prior royalty/reporting events

### Redelivery

Redelivery is a corrected or repeated delivery after metadata, asset, rights, registration, or platform issues are resolved.

Belongs to Distribution Relationship:

- redelivery intent
- corrected package reference
- channel/territory scope
- event history
- external acknowledgement

Must consume:

- current Release truth
- current Readiness state
- relevant Rights Interest/Registration authority

### Distribution Status

Distribution status is an operational lifecycle signal.

Current platform statuses include:

- draft
- scheduled
- submitted
- delivered
- live
- takedown_requested
- removed
- failed
- archived

Channel delivery statuses include:

- pending
- queued
- submitted
- processing
- live
- failed
- removed

Doctrine rules:

- Distribution status is not ownership truth.
- Distribution status is not release readiness.
- Distribution status is not registration truth.
- Distribution status is not royalty entitlement.
- Distribution status should be auditable and downstream of Release/Readiness.

### Distribution Evidence

Distribution evidence is material that supports what happened during delivery, availability, takedown, redelivery, reporting, or dispute handling.

Examples:

- distributor submission confirmation
- DSP live link/reference
- delivery event payload
- takedown confirmation
- redelivery acknowledgement
- territory availability report
- platform rejection message
- distributor statement/report reference

Distribution evidence supports operational history. It does not create rights authority.

### Distributor References

Distributor references are identifiers or references returned by a distributor.

They may help with:

- reconciliation
- support tickets
- delivery status
- reporting
- audit

They must not be used as proof of:

- ownership
- registration
- master authority
- release readiness
- royalty entitlement

### DSP References

DSP references are platform-specific IDs, URLs, URIs, codes, reports, or status messages.

They may help with:

- availability verification
- platform reconciliation
- marketing links
- takedown/redelivery tracing
- reporting context

They must not be used as proof of:

- ownership
- rights authority
- registration correctness
- canonical artist identity
- royalty entitlement

## 12. Distribution Authority Rules

Distribution authority should ultimately be based on:

- Release truth
- Release Readiness
- Master / Recording truth
- Work truth where applicable
- Rights Interest authority
- registration/identifier governance where applicable
- contract/mandate support where applicable
- evidence sufficiency
- territory/channel constraints
- workspace authority

Distribution must not proceed merely because:

- a user can access a distributor account
- a DSP accepted the upload
- metadata fields are populated
- an artist brand is visible
- a contributor split row exists
- a UPC, ISRC, or platform reference exists
- a release has marketing approval

Distribution may be paused, blocked, warned, or allowed based on policy and context, but those decisions must remain downstream from verified authority.

## 13. Relationship To Party

Distribution may involve several Party roles:

- distributor
- label
- rights administrator
- uploader/operator
- DSP/platform operator
- service provider
- report issuer
- contract counterparty
- payor where relevant

Party truth should define who these legal/commercial identities are. Distribution should reference or consume that identity; it should not invent it from a channel name or free-text distributor note.

## 14. Relationship To Rights Interest

Rights Interest should define whether a Party has authority to distribute, license, administer, collect, or otherwise act for a Work or Master.

Distribution should consume:

- distribution rights
- licensing rights
- administration mandates
- territory scope
- channel/platform scope
- effective dates
- restrictions/exclusions
- revocations or expiry

Distribution should not treat platform acceptance as a substitute for this authority.

## 15. Relationship To Work

Work is the composition/song identity.

Distribution may indirectly involve Work through Release tracks and Master links.

Doctrine rules:

- Distribution does not create Works.
- Distribution should not rewrite Work metadata.
- Distribution reports should map back to Work where composition-side royalties, registrations, or reporting require it.
- Work-side entitlement must not be inferred only from distribution records.

## 16. Relationship To Master / Recording

Master / Recording is the sound recording identity.

Distribution should consume Master truth for audio delivery.

Doctrine rules:

- ISRC belongs to Master / Recording identifier governance.
- Distribution may carry ISRC references for delivery/reconciliation.
- Distribution should not decide which file is the approved Master.
- Distribution redelivery may be required when the approved Master changes.
- Master-side royalties require Master/Rights Interest authority, not distribution status alone.

## 17. Relationship To Registration

Registration supplies external registration and identifier state.

Distribution should consume:

- ISRC where applicable
- UPC/EAN where applicable
- registration readiness/state where applicable
- society/distributor references where relevant
- identifier governance

Distribution should not:

- create registrations
- treat identifiers as ownership proof
- assume platform references are registration authority
- bypass unresolved registration blockers where policy requires registration before delivery

## 18. Relationship To Release

Release is the package distribution consumes.

Distribution should consume:

- release title
- release type
- track list
- artist presentation
- artwork/package metadata
- release dates
- identifiers where governed
- approved metadata snapshots

Distribution should not:

- become a second Release table in doctrine
- silently override release package truth
- use distributor returns as automatic canonical metadata
- determine release readiness retroactively

## 19. Relationship To Readiness

Release Readiness precedes Distribution.

Distribution should consume readiness decisions such as:

- allowed
- blocked
- warning
- conditional approval
- deferred registration
- territory/channel exclusion
- evidence required

Distribution should not:

- create readiness
- bypass readiness
- make a release ready because it was accepted
- convert delivery failure into upstream authority truth without review

## 20. Relationship To DSPs

DSPs are destinations/platforms.

Distribution should track:

- destination/channel
- platform type
- platform status
- territory availability
- platform reference
- platform rejection/error state
- platform removal state
- report context

DSPs should not determine:

- legal ownership
- master ownership
- composition ownership
- Party identity
- artist brand authority
- registration validity

## 21. Relationship To Royalty Events

Distribution is one source of reporting context for Royalty Events.

Distribution may provide:

- platform/DSP source
- distributor source
- territory
- period
- release reference
- track reference
- external report reference
- availability context

Royalty Events must still derive entitlement from:

- Rights Interest
- Party/payee authority
- Work/Master relationship
- royalty rules
- settlement/ledger policy
- verified reporting context

Distribution reports are evidence and input. They are not royalty authority by themselves.

## 22. Chronicle Reference Cases

### Release Ready But Not Distributed

A Chronicle release may satisfy readiness checks but have no distributor/channel selected yet. Distribution Relationship remains absent or draft. This is valid.

Doctrine conclusion:

- Release Readiness can pass before distribution starts.
- Distribution should not be required for catalogue truth.

### Release Distributed But Rights Later Change

A Chronicle release may be live while Rights Interest later changes, expires, or is disputed.

Doctrine conclusion:

- Distribution status remains historical operational truth.
- Rights Interest change may require warning, takedown, territory change, or redelivery review.
- Live status does not override updated rights authority.

### Release Removed From DSPs

A Chronicle release may be removed from platforms because of rights, metadata, policy, commercial, or strategy reasons.

Doctrine conclusion:

- Removal is distribution state.
- Removal does not delete Release, Work, Master, Rights Interest, Registration, or royalty history.
- Evidence and audit history should remain available.

### Release Changes Distributor

A Chronicle release may move from one distributor to another.

Doctrine conclusion:

- The Release remains the same canonical package unless the release itself changes.
- Distribution Relationships may change over time.
- Historical distributor references should remain evidence, not current authority.

### Release Exists In Multiple Territories

A Chronicle release may be available in some territories and blocked or excluded in others.

Doctrine conclusion:

- Territory is a distribution scope.
- Territory availability must respect Rights Interest and contract scope.
- A release can be live in one territory and not live in another.

## 23. Conflicts Discovered

### Distribution Pipeline Is Real But Authority Is Early

Current distribution structures support channels, releases, channel delivery state, delivery events, and audit events. They do not yet represent the full future authority chain from Party/Rights Interest/Readiness into distribution.

Doctrine impact:

- Current distribution structures can remain operational.
- They should be treated as transitional until upstream authority layers are formalized.

### Distribution Status Can Look Like Readiness

Lifecycle statuses such as `scheduled`, `delivered`, and `live` can be mistaken for readiness or authority.

Doctrine impact:

- Distribution status must remain downstream status.
- Release Readiness must remain a separate concept.

### Distributor And DSP References Exist Beside Release References

Release and distribution structures can store external/distributor references.

Doctrine impact:

- References should support reconciliation and evidence.
- They must not become ownership, registration, or release authority.

### Release Tracks Carry ISRC

Current release tracks include `isrc`, while Master doctrine states ISRC belongs to Master / Recording identifier governance.

Doctrine impact:

- Release-track ISRC should be treated as transitional delivery/reconciliation data until Master identifier governance is formalized.

### Distribution May Precede Mature Rights Modeling In Current Code

The platform can represent distribution operations before canonical Rights Interest is fully implemented.

Doctrine impact:

- Future distribution work must avoid deepening contributor-split or free-text ownership assumptions.

### Royalty Pipeline Uses Distribution Language

Existing royalty docs and tables use the word distribution for royalty allocation/disbursement.

Doctrine impact:

- Digital distribution and royalty distribution are separate concepts.
- Future docs and UI should distinguish platform delivery from royalty allocation.

## 24. Transitional Concepts Identified

Current or transitional concepts:

- `distribution_channels`
- `distribution_releases`
- `distribution_release_channels`
- `distribution_delivery_events`
- `distribution_audit_events`
- `distribution_releases.source_release_id`
- `distribution_release_channels.territory_code`
- `distribution_release_channels.external_reference_id`
- distribution lifecycle statuses
- channel delivery statuses
- release `external_release_reference`
- release `distributor_reference`
- release-track `isrc`
- distributor/DSP references in metadata
- distribution delivery events as evidence candidates
- distribution audit events
- royalty distribution terminology
- Chronicle workbook DSP/platform notes

These should remain unchanged now.

## 25. What Must Not Change Yet

Do not change:

- distribution schema
- release schema
- readiness schema or routes
- registration schema or routes
- rights/contributor schema
- royalty schema
- distribution services
- release services
- UI
- API routes
- Chronicle import data
- existing distribution lifecycle statuses
- existing channel delivery statuses

Do not:

- create distribution migrations
- rename distribution tables
- introduce canonical Party/Rights Interest foreign keys yet
- convert distributor references into authority
- treat DSP references as proof of rights
- treat distribution acceptance as ownership proof
- merge digital distribution with royalty distribution
- import Chronicle DSP notes as structured distribution truth yet

## 26. Future Refactor Principles

Future distribution refactors should:

- keep Distribution downstream of Release Readiness
- keep Distribution downstream of Rights Interest
- preserve historical delivery and audit state
- distinguish distributor, DSP, Party, and channel concepts
- support territory/channel-specific availability
- support takedown and redelivery without deleting upstream truth
- treat references as reconciliation/evidence, not authority
- separate platform delivery from royalty allocation
- reconcile distributor/DSP reports through Release, Master, Work, Rights Interest, and Party truth
- remain workspace-scoped
- avoid Chronicle-specific logic in platform structures

## 27. Recommended Next Doctrine Artifact

Next artifact:

```text
docs/platform/SENTRY-SOUND-ROYALTY-AUTHORITY-MODEL-V1.md
```

Purpose:

- define Royalty Authority as the downstream economic authority model
- clarify how Royalty Events consume Rights Interest, Distribution, Registration, Release, Work, Master, Party, payee, and reporting context
- distinguish royalty events, royalty calculations, royalty distributions, ledger entries, payouts, and finance/accounting
- define why royalty entitlement must not rely only on contributor split rows or distributor reports

