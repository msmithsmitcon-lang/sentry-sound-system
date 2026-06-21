# Sentry Sound Rights Interest Model V1

Date: 2026-06-04

Status: doctrine and authority definition only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

Rights Interest is the canonical authority layer for ownership, control, administration, territory, effective dates, verification, disputes, and downstream royalty authority.

Rights Interest sits between Party and operational downstream workflows:

```text
Party / legal-commercial identity
  -> Rights Interest
  -> Registration
  -> Release
  -> Distribution
  -> Royalty Event
```

Rights Interest exists because music-business participation is not the same thing as ownership. A contributor may write, produce, perform, arrange, or participate without owning or administering a right. An artist brand may be visible to the public without owning the work or master. A workspace user may operate the system without owning copyright. A contract may support authority, but the platform still needs a rights-level record that states what right exists, who controls it, where, when, and with what verification state.

Immediate doctrine lock:

- Contributor participation is not automatically ownership.
- Artist brand visibility is not automatically ownership.
- Workspace ownership is not copyright ownership.
- Contracts may support rights interests but do not automatically create authority.
- Rights Interests become the canonical authority layer.
- Registration consumes verified Rights Interest.
- Release consumes verified Rights Interest.
- Distribution consumes verified Rights Interest.
- Royalty authority should ultimately derive from verified Rights Interest.

Current platform seed:

- `rights_assets`
- `rights_ownership_claims`
- `rights_lifecycle_events`
- `rights_audit_events`
- `contract_rights_links`

This document does not design or change implementation. It defines the authority doctrine future work must respect.

## 2. Recommended Rights Interest Model

A Rights Interest is a governed statement that a Party or Party-adjacent identity has a defined interest in a right-bearing asset or scope.

Conceptual model:

```text
Rights Interest
  right subject: Work, Master, Release, Contract, brand, video, or other rights asset
  right holder/controller: Party or transitional identity
  category: ownership, administration, collection, licensing, distribution, mandate
  scope: composition, publishing, master, mechanical, performance, territory, channel, use type
  percentage or share where relevant
  territory where relevant
  effective dates where relevant
  verification status
  source evidence / contract / mandate
  lifecycle and audit history
```

Rights Interest should answer:

- what right is being claimed or verified?
- who holds or controls it?
- is this ownership, administration, collection, distribution, licensing, or another authority?
- which asset or subject does it apply to?
- which territory, term, and use context does it cover?
- what evidence or contract supports it?
- is it pending, verified, disputed, expired, or active?
- can downstream registration, release, distribution, or royalty workflows rely on it?

## 3. What Is A Rights Interest?

A Rights Interest is an authority record, not merely a descriptive note.

It can represent:

- ownership
- partial ownership
- publishing control
- administration authority
- collection mandate
- licensing authority
- distribution authority
- master control
- mechanical rights participation
- performance rights participation
- territory-specific authority
- time-limited mandate
- disputed claim
- verified right
- expired right

It must be specific enough to prevent later systems from guessing.

Rights Interest is where Sentry Sound should eventually decide whether a Party has authority for registration, release, distribution, royalty calculation, payout, licensing, or reporting.

## 4. Why Rights Interest Exists Separately From Contributor Splits

Contributor splits capture participation and preliminary allocation. They do not prove legal authority.

Contributor split rows may answer:

- who contributed?
- what role did they play?
- what percentage was captured for a composition or contribution workflow?
- has the split been confirmed operationally?

Rights Interest must answer:

- who legally owns or controls the right?
- who administers it?
- who may register it?
- who may authorize release or distribution?
- who may collect and receive revenue?
- which territory and date range apply?
- what evidence or contract supports the authority?
- is the claim verified, disputed, expired, or active?

Reasons to keep them separate:

- writers are not always publishers
- performers are not always master owners
- artist brands are not always legal parties
- payees may differ from contributors
- administration can be granted without ownership
- rights can vary by territory
- rights can change over time
- registration and royalty bodies may require different identity evidence
- a contributor percentage can be wrong, incomplete, unverified, or only a capture placeholder

## 5. Rights Categories Identified

Rights categories are conceptual here. This is not a schema design.

### Composition Ownership

Ownership interest in the underlying composition/song.

Relevant to:

- writers
- composers
- lyricists
- publishers
- registration
- performance/mechanical collection
- royalties

### Publishing Ownership

Ownership/control of publishing share or publisher-side interest.

Relevant to:

- publishers
- administrators
- collection societies
- licensing
- registrations
- royalty allocation

### Administration Rights

Authority to administer rights on behalf of an owner without necessarily owning them.

Relevant to:

- publishers
- rights administrators
- Chronicle Music where it administers but does not own
- collection and registration workflows

### Mechanical Rights

Rights related to reproduction/mechanical exploitation.

Relevant to:

- mechanical collection
- DSP/distribution reporting
- publishing administration
- territory-specific rules

### Performance Rights

Rights related to public performance and communication to the public.

Relevant to:

- PRO/society registration
- performance royalty collection
- writer/publisher shares

### Master Ownership

Ownership/control of the sound recording/master.

Relevant to:

- ISRC authority
- release readiness
- neighboring rights
- distribution authority
- master royalties

### Distribution Rights

Authority to distribute a release or master through channels/platforms.

Relevant to:

- distributor agreements
- territory/channel delivery
- takedowns
- DSP reporting

### Licensing Rights

Authority to license usage, synchronization, reproduction, performance, or other exploitation.

Relevant to:

- contracts
- sync/licensing workflows
- territory/use-type constraints

### Collection Mandates

Authority to collect revenue from societies, platforms, distributors, or other sources.

Relevant to:

- payees
- royalty events
- statements
- collection societies
- administrators

### Territory-Specific Rights

Rights that apply only to specific countries, regions, societies, channels, or territories.

Relevant to:

- ownership totals
- registration bodies
- distribution territories
- royalty allocation
- disputes

## 6. Rights Interest vs Contributor

Contributor is participant identity.

Rights Interest is authority.

Rules:

- Contributor participation is not automatically ownership.
- A contributor may have no rights interest.
- A contributor may have multiple rights interests.
- A Party linked to a contributor may hold the rights interest.
- Contributor split rows may inform review but must not be final authority.
- Contributor identity can help determine who needs review, evidence, or confirmation.

Example:

M-Wis may be listed as performer or contributor on a Work/Master. That participation does not prove composition ownership, master ownership, administration authority, or payee authority unless a Rights Interest supports it.

## 7. Rights Interest vs Artist Brand

Artist Brand is public-facing creative/commercial identity.

Rights Interest is legal/control authority.

Rules:

- Artist brand visibility is not automatically ownership.
- Artist Brand can be attached to releases, public pages, and catalogue presentation without owning rights.
- Artist Brand may be linked to a Party that owns or administers rights, but that relationship must be explicit.
- Artist Brand should not carry private rights authority in public-safe profile data.

Example:

Huey D may be the public artist brand on a release. That does not mean Huey D owns the master, owns publishing, controls distribution, or receives royalties without a Rights Interest or Party/payee relationship.

## 8. Rights Interest vs Party

Party is the legal/commercial identity.

Rights Interest is the authority relationship between a Party and a right.

Rules:

- Party identifies who can hold or control a right.
- Rights Interest defines what that Party owns, controls, administers, collects, licenses, or disputes.
- A Party may hold many rights interests.
- Many Parties may hold rights interests in one Work, Master, Release, or Contract scope.
- A Party record alone does not create ownership.
- Rights Interest without Party clarity may remain transitional, pending, or disputed.

Current platform mapping:

- `rights_ownership_claims.crm_contact_id` is the strongest current Party-like link.
- `rights_ownership_claims.contributor_id` is useful where contributor identity is the current available anchor, but should be reviewed before final authority.

## 9. Rights Interest vs Contract

Contract is legal/commercial agreement and evidence of authority or obligation.

Rights Interest is the modeled authority derived from, supported by, or constrained by contracts and other evidence.

Rules:

- Contracts may support rights interests but do not automatically create authority.
- A signed contract may be evidence for a Rights Interest.
- Contract parties should be distinct from rights holders if the contract party signs in a representative capacity.
- Contract terms may define effective dates, territory, payment terms, royalty logic, and authority scope.
- Rights Interest should be the downstream authority layer consumed by registration, release, distribution, and royalty workflows.

Examples:

- A publishing administration agreement may support an administration Rights Interest.
- A distribution agreement may support distribution Rights Interest.
- A producer agreement may support royalty participation but not necessarily composition ownership.

## 10. Rights Interest vs Registration

Registration is a body-specific process and result.

Rights Interest is the ownership/control/admin truth registration should consume.

Rules:

- Registration consumes verified Rights Interest.
- Registration should not create ownership truth.
- Registration may confirm, reject, dispute, or expose gaps in claimed rights.
- Registration may produce external identifiers or body references.
- Registration readiness should check Rights Interest state before submission.
- Registration records must distinguish submitter, registrant, claimant, contributor, and rights holder.

Example:

If a Work is registered with a society, the society registration should be based on verified composition/publishing Rights Interests, not merely on a workbook owner field or contributor name.

## 11. Rights Interest vs Release

Release is commercial packaging.

Rights Interest is authority to package, exploit, release, and represent the underlying Work/Master where required.

Rules:

- Release consumes verified Rights Interest.
- Release should not create ownership truth.
- Release readiness should check Work, Master, artist, artwork, registration, contract, and rights status.
- Release artist visibility does not prove ownership.
- Release metadata snapshots should not override Rights Interest.

Example:

A single can list M-Wis as the artist brand, but release readiness should still ask who owns or controls the Work and Master, and whether Chronicle Music has release authority.

## 12. Rights Interest vs Distribution

Distribution is delivery and platform/channel relationship.

Rights Interest is authority to distribute and collect/report where applicable.

Rules:

- Distribution consumes verified Rights Interest.
- Distribution should not duplicate release, rights, artist, or contract data.
- Distribution relationship should know whether the workspace/Party has authority to deliver a release to a platform or territory.
- Distribution takedowns, territory exclusions, and channel status should respect Rights Interest and Contract scope.
- Distributor references do not prove ownership.

Example:

If Chronicle Music distributes a release in South Africa but not worldwide, that should be a territory/channel authority question grounded in Rights Interest and contracts.

## 13. Rights Interest vs Royalty Event

Royalty Event is revenue, usage, statement, or settlement-triggering activity.

Rights Interest is the authority from which entitlement should ultimately derive.

Rules:

- Royalty authority should ultimately derive from verified Rights Interest.
- Royalty Event should not rely only on visible contributor split rows.
- Royalty Event should consume distribution/reporting context and rights/payee authority.
- Payee may differ from contributor, artist brand, workspace user, or public brand.
- Royalty ledger and settlement outputs should remain downstream of rights authority.

Current conflict:

- The active royalty engine fetches `work_contributors` percentages directly. This is transitional and useful for early calculation tests, but it is not the long-term rights authority model.

## 14. Authority Rules

Rights Interest authority rules:

- Work creation does not create ownership.
- Contributor capture does not create ownership.
- Artist visibility does not create ownership.
- Workspace ownership does not create copyright ownership.
- Contract existence does not automatically create rights authority without interpretation and linkage.
- Registration does not create ownership truth.
- Release does not create ownership truth.
- Distribution does not create ownership truth.
- Royalty processing does not create ownership truth.
- External references do not create ownership truth without governed ingestion.
- Verified Rights Interest is the authority layer downstream systems should rely on.

Rights Interest lifecycle direction:

```text
draft
  -> claimed
  -> verified
  -> active
  -> disputed / expired / archived
```

This lifecycle is conceptual and aligns with current rights lifecycle documentation. It is not an implementation instruction.

## 15. Chronicle Reference Cases

These examples clarify doctrine only. They do not create tenant-specific logic.

### If Chronicle Music Owns A Work

Chronicle Music should be represented as a Party/company identity.

The Rights Interest would state, conceptually:

- Party: Chronicle Music
- subject: Work
- category: composition ownership and/or publishing ownership
- share: defined percentage if applicable
- territory: applicable territory
- verification: pending, verified, disputed, or active
- source: evidence/contract/mandate where available

The Rights Interest, not the workbook row, becomes authority.

### If Chronicle Administers But Does Not Own A Work

Chronicle Music should still be a Party/company identity.

The Rights Interest would state:

- category: administration rights or collection mandate
- owner Party remains separate if known
- scope: territory, dates, use types, collection channels
- source: administration agreement, mandate, or evidence

Chronicle would not become owner merely because it administers.

### If M-Wis Performs On A Master But Does Not Own It

M-Wis remains an Artist Brand and may have performer/contributor participation.

The Rights Interest would not automatically show M-Wis as master owner.

If M-Wis has a neighboring-rights, performer royalty, or royalty participation interest, that must be modeled as a specific Rights Interest or downstream royalty/payee rule, not inferred from artist visibility.

### If A Publisher Owns Part Of A Work

The publisher should be represented as Party/company identity.

The Rights Interest would state:

- category: publishing ownership or publishing administration
- subject: Work/composition
- share: publisher share where governed
- territory and effective dates
- verification status
- supporting contract/evidence

Contributor rows may identify writers, but publisher ownership requires Party/Rights Interest authority.

## 16. Transitional Concepts Identified

Transitional concepts:

- `work_contributors.percentage` as split capture/readiness, not final rights authority
- `contributors` as participant identity, not final rights holder identity
- `artist_profiles.metadata.rightsPublishing` as posture/intake metadata, not final rights authority
- `musical_works.publisher_name`, `publisher_share`, `composer_split_total`, `lyric_split_total`, and related metadata fields
- Chronicle workbook fields such as `Ownership Split %`, `Master Owner`, and `Publishing Owner`
- royalty processing based directly on `work_contributors`
- `rights_ownership_claims.contributor_id` where Party identity is not yet clarified
- contracts linked to rights assets before interpretation into verified Rights Interest
- registration/submission records that do not yet consume locked Rights Interest authority

These should remain stable until a controlled future design and refactor explicitly maps them.

## 17. Conflicts Discovered

Doctrine conflicts and tensions:

- Current royalty logic uses contributor splits directly, while rights doctrine requires rights-backed royalty authority.
- Current contributor records can look ownership-like if split percentages are treated too strongly.
- Current artist metadata can store rights/publishing posture, but that metadata is not final authority.
- Contract docs say contracts control authority, while rights doctrine says Rights Interest should be the canonical downstream authority. The reconciliation is: contracts support or evidence rights interests; verified Rights Interest is what downstream systems consume.
- Release docs are rights-aware but do not yet have a locked release readiness dependency on verified Rights Interest.
- Registration docs are operational/legal first, but current registration identity and rights consumption remain transitional.
- Chronicle import intentionally deferred owner/split/identifier data, leaving Rights Interest incomplete by design.

These are doctrine alignment items, not implementation defects.

## 18. What Must Not Change Yet

Do not change yet:

- do not create or change rights schema
- do not migrate contributor splits into rights records
- do not import Chronicle ownership fields
- do not treat Chronicle Music as owner/admin without rights review
- do not treat M-Wis or Huey D artist visibility as ownership
- do not rewrite royalty logic
- do not change registration flows
- do not change release/distribution flows
- do not create APIs
- do not refactor backend logic
- do not rename current rights tables
- do not rename `work_contributors`
- do not rename `contributors`
- do not make workbook fields authoritative

## 19. Future Refactor Principles

Future Rights Interest work must:

- define authority before storage
- preserve Party vs Contributor vs Artist Brand boundaries
- preserve Work vs Master boundaries
- preserve workspace scope and actor audit
- separate ownership, administration, collection, licensing, and distribution authority
- support territory and effective dates
- support pending, verified, disputed, expired, and active states
- consume contracts and evidence without letting contracts/evidence casually become authority
- keep royalty calculations downstream of verified rights
- keep registration/release/distribution readiness downstream of verified rights
- provide read-only audits before any migration from metadata, splits, workbook fields, or contracts
- avoid Chronicle-specific platform logic

## 20. Next Recommended Doctrine Artifact

Next artifact:

```text
docs/platform/SENTRY-SOUND-MASTER-RECORDING-MODEL-V1.md
```

Purpose:

- define Master / Recording as the sound recording authority layer
- clarify ISRC ownership and placement
- define Master vs Work boundary
- define performer/master participant vs contributor/work participant distinction
- clarify master ownership, recording evidence, release track, distribution, and royalty implications

Do not start implementation from this Rights Interest model. The next step is doctrine only.

