# Sentry Sound Canonical Entity Direction V1

Date: 2026-06-04

Status: canonical doctrine direction. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

Sentry Sound is the system of record for operational music-business truth.

Chronicle Music is the first real-world reference tenant and pilot implementation, but Chronicle must not be hardcoded into platform logic. Chronicle may operate as a label, publisher, rights administrator, catalogue owner, marketer, or business operator only where Sentry Sound records support that role.

Spreadsheets are intake layers only. External systems consume approved truth from Sentry Sound.

The canonical entity direction is:

```text
Workspace
  -> Party
  -> Artist Brand
  -> Work
  -> Master / Recording
  -> Rights Interest
  -> Registration
  -> Release
  -> Distribution Relationship
  -> Royalty Event
```

This is not a strict parent-child hierarchy. It is an authority sequence and boundary model. Real records may have lateral relationships, optional links, and many-to-many relationships. The doctrine rule is that later operational layers must not create or override the truth owned by earlier authority layers.

The immediate platform lock is:

- keep current `musical_works` as the active Work seed
- do not rename, replace, or refactor active Works now
- do not treat contributor split rows as final rights authority
- do not put ISRC authority on Work
- do not treat artist brands as companies
- do not treat Chronicle Music as an artist
- do not let release, distribution, registration, or royalty workflows create ownership truth

## 2. Canonical Entity List

Canonical direction entities:

- Workspace
- Party
- Artist Brand
- Contributor
- Work
- Master / Recording
- Asset
- File / Evidence
- Rights Interest
- Contract / Mandate
- Registration
- Release
- Distribution Relationship
- Royalty Event
- Royalty Ledger / Settlement
- External Identifier
- External Source / Consumer

Current active or partial platform structures that map to this direction:

- `workspaces`
- `workspace_members`
- `workspace_settings`
- `workspace_activity`
- `crm_contacts`
- `artist_profiles`
- `contributors`
- `work_contributors`
- `assets`
- `musical_works`
- `recording_contributors`
- Prisma `Recording`
- `file_vault_items`
- `file_vault_links`
- `rights_assets`
- `rights_ownership_claims`
- `contracts`
- `contract_parties`
- `contract_rights_links`
- `releases`
- `release_tracks`
- `distribution_channels`
- `distribution_releases`
- `distribution_release_channels`
- registration and submission queue models
- royalty event, distribution, ledger, and finance-adjacent services

## 3. Entity Definitions

### Workspace

The operational tenant, account, organization, or environment under which Sentry Sound work occurs.

Examples:

- Chronicle Music workspace
- label workspace
- publisher workspace
- artist team workspace
- demo or internal workspace

### Party

The legal or commercial identity layer.

A Party may represent:

- person
- company
- publisher
- label
- distributor
- society
- regulator
- service provider
- rights administrator
- estate
- trust
- collective

Current nearest structure: `crm_contacts`.

### Artist Brand

The public-facing creative/commercial identity used in catalogue, release, marketing, audience, and public profile contexts.

Examples:

- M-Wis
- Huey D

Current nearest structure: `artist_profiles` linked to `crm_contacts`.

### Contributor

A creative or operational participant in a Work, Master, Release, or royalty-relevant event.

Examples:

- composer
- lyricist
- producer
- performer
- arranger
- publisher role holder
- master owner role holder

Current structures: `contributors`, `work_contributors`, `recording_contributors`.

### Work

The composition/song identity.

Current active seed: `musical_works`.

Work is the correct authority layer for composition identity and work-level metadata. ISWC belongs to Work identifier governance when supported. The current `musical_works` table remains active and must not be renamed or replaced now.

### Master / Recording

The sound recording identity.

Master/Recording is the correct authority layer for ISRC, recording date, master ownership, sound recording participants, and master-side rights context.

Current platform reality: present in older/parallel structures and release-track references, but not active as the canonical Works UX entity.

### Asset

A broad operational anchor for catalogue, files, or domain records.

Current structure: `assets`.

Asset should not erase the distinction between Work, Master, Release, Rights Interest, and File. It may remain a general anchor, but specific domain records must own their own authority.

### File / Evidence

File is a stored or referenced item.

Evidence is a governed proof record that supports readiness, ownership, registration, contract, identity, or dispute truth.

Current structures include `file_vault_items`, `file_vault_links`, and registration evidence concepts.

### Rights Interest

The ownership, control, administration, territory, effective date, verification, and authority layer.

Current structures: `rights_assets`, `rights_ownership_claims`, `contract_rights_links`.

Rights Interest is the future authority layer for ownership and administration. Contributor split rows are not enough.

### Contract / Mandate

The legal/commercial basis for authority, obligations, rights scope, payment terms, and role authorization.

Current structures: `contracts`, `contract_parties`, `contract_rights_links`, `contract_obligations`.

### Registration

The body-specific process and result of registering a Work, Master, contributor identity, copyright, society interest, or related package.

Registration consumes verified truth. It does not create ownership truth.

### Release

The commercial packaging layer for singles, EPs, albums, versions, tracks, artwork, UPC/catalogue references, and release lifecycle.

Current structures: `releases`, `release_tracks`, `release_versions`, `release_metadata_snapshots`.

### Distribution Relationship

The platform/channel/delivery relationship through which releases are delivered, tracked, updated, removed, and reconciled.

Current structures: `distribution_channels`, `distribution_releases`, `distribution_release_channels`, delivery events.

### Royalty Event

A revenue, usage, statement, distribution-report, or settlement-triggering event.

Royalty Event consumes verified rights and distribution/reporting context. It should not rely only on visible contributor split rows.

### External Identifier

An identifier issued or used by an external body or platform.

Examples:

- ISWC
- ISRC
- UPC
- IPI / CAE
- distributor reference
- DSP platform ID
- registration body reference

External identifiers need governed entity placement and source tracking.

### External Source / Consumer

External systems may provide intake, enrichment, discovery, reconciliation, or consumption.

Examples:

- Chronicle Music website
- Spotify
- YouTube
- Apple Music
- TikTok
- Meta
- registration bodies
- distributors
- statement providers

External systems do not become operational truth unless a governed ingestion contract promotes their data into Sentry Sound.

## 4. What Each Entity Owns

| Entity | Owns |
| --- | --- |
| Workspace | operational container, access boundary, actor context, workspace settings, tenant-level audit scope |
| Party | legal/commercial identity, contact identity, company/person/organization identity, registration/tax posture where applicable |
| Artist Brand | public creative identity, stage/brand name, public profile posture, artist lifecycle, artist marketing context |
| Contributor | creative participant identity and contributor-specific attributes |
| Work | composition identity, title, work-level profile, work-level status, work-level identifiers when governed |
| Master / Recording | sound recording identity, ISRC, recording details, master-side participants, recording version context |
| Asset | broad operational anchor where useful, not domain authority |
| File / Evidence | files, versions, storage/reference metadata, evidence links, evidence verification posture |
| Rights Interest | ownership/control/admin claim, territory, effective dates, verification, disputes, audit |
| Contract / Mandate | legal basis, parties, rights scope, obligations, terms |
| Registration | registration lifecycle, submission package, regulator response, amendments, registration evidence state |
| Release | commercial package, track order, release metadata, UPC/catalogue references, release lifecycle |
| Distribution Relationship | platform/channel delivery status, external delivery references, territory/channel status, takedown state |
| Royalty Event | revenue/usage/statement event, calculation trigger, source report linkage |
| External Identifier | identifier value, issuing/source body, entity link, verification/source metadata |

## 5. What Each Entity Must NOT Own

| Entity | Must not own |
| --- | --- |
| Workspace | copyright ownership, master ownership, royalty entitlement by default |
| Party | artist brand truth unless linked through an artist brand relationship |
| Artist Brand | company/legal identity by default, ownership truth, banking/tax truth, contributor split truth |
| Contributor | final rights authority without rights interests, public artist brand identity by default |
| Work | ISRC, master ownership, release ownership, distribution status, royalty payout authority |
| Master / Recording | composition ownership, ISWC, publishing ownership |
| Asset | final authority for all domain concepts |
| File / Evidence | ownership truth merely because a file exists |
| Rights Interest | public artist branding, release metadata, distribution status |
| Contract / Mandate | actual ownership by implication unless linked to rights scope and parties |
| Registration | ownership truth creation, artist brand truth, release truth |
| Release | ownership truth, registration truth, rights verification truth |
| Distribution Relationship | release truth, ownership truth, artist identity truth |
| Royalty Event | rights ownership creation, contributor identity creation, release truth creation |
| External Identifier | entity identity by itself without governed linkage |

## 6. Relationship Rules Between Entities

Workspace relationship rules:

- All production operational records should be workspace-scoped.
- Workspace is operational control, not rights ownership.
- Workspace actors are accountable for actions, not automatically rightsholders.

Party relationship rules:

- Party should become the long-term identity layer for people, companies, publishers, labels, distributors, societies, regulators, and providers.
- CRM contacts are the current closest operational seed.
- Contributors and artist brands should be linkable to Party/CRM identity where known.

Artist Brand relationship rules:

- Artist Brand must link to Party/CRM identity but must not be assumed to be a company.
- Artist Brand may appear on Works, Masters, Releases, campaigns, public pages, and reports.
- Artist Brand must not hold private legal, banking, tax, or ownership data as public brand truth.

Work and Master relationship rules:

- Work may exist without a Master.
- Master may link to one or more Works where needed.
- Work-level identifiers and recording-level identifiers must remain separate.
- Release tracks should be able to reference both Work and Master distinctly.

Rights relationship rules:

- Rights Interest should link to rights assets and legal/commercial identities.
- Rights Interest may link to Work, Master, Release, Contract, Party, Contributor, territory, and effective date context.
- Work contributor splits may inform rights review, but they do not replace rights interests.

Registration relationship rules:

- Registration consumes Work/Master/Party/Rights/Evidence truth.
- Submission queues are operational jobs, not the full registration truth.
- Registration results should link back to canonical records and external identifiers.

Release and distribution relationship rules:

- Release consumes Work, Master, Artist Brand, identifiers, artwork, and readiness context.
- Distribution Relationship consumes Release truth.
- Distribution records must not duplicate release, artist, rights, contract, or Party data.

Royalty relationship rules:

- Royalty Events consume verified rights and distribution/reporting context.
- Royalty ledger and settlement records should be downstream of Royalty Events and rights allocation rules.
- Workspace finance may receive summarized obligations or accounting effects, but royalties remain their own administration domain.

## 7. Authority Rules

Authority sequence:

```text
Identity and mandate
  -> ownership/control
  -> registration
  -> release
  -> distribution
  -> royalty processing
```

Rules:

- Ownership precedes registration.
- Registration precedes release readiness.
- Release precedes distribution.
- Distribution precedes royalty events.
- Contributor splits are not final rights authority.
- Registration does not create ownership.
- Release does not create ownership.
- Distribution does not create release truth.
- Royalty events do not create rights truth.
- External data does not overwrite canonical truth without governed ingestion.

## 8. Source-Of-Truth Rules

Sentry Sound owns:

- operational workspace truth
- songs/works
- artist and contributor operational records
- releases
- registrations
- identifiers once governed
- rights administration
- future royalty administration
- private evidence and audit trails

Chronicle Music may consume:

- approved catalogue data
- public-safe artist data
- public-safe release data
- marketing/catalogue exports
- reports
- approved feeds and integrations

Spreadsheets may provide:

- intake
- validation source
- migration source
- review context

Spreadsheets must not provide:

- live operational truth
- rights authority
- registration authority
- royalty authority
- ongoing synchronization ownership

## 9. Chronicle Music Positioning

Chronicle Music is:

- a real-world company
- the first reference tenant / pilot implementation
- a possible label, publisher, rights administrator, catalogue operator, marketer, or business operator when records support that role
- a consumer of Sentry Sound operational truth

Chronicle Music is not:

- an artist
- a hardcoded platform concept
- a source of operational truth outside Sentry Sound
- a spreadsheet owner of backend data
- automatically the owner of all works, masters, publishing, releases, or royalties

Platform doctrine must remain tenant-neutral. Chronicle may shape requirements through real usage, but platform contracts must generalize beyond Chronicle.

## 10. Artist Brand Positioning

Artist Brand is the public-facing creative/commercial identity.

M-Wis and Huey D are artist brands.

Artist Brand is not automatically:

- a company
- the legal owner
- the publisher
- the label
- the rights administrator
- the payee
- the platform workspace owner

Artist Brand may relate to:

- Party / CRM Contact
- Contributor
- Work
- Master
- Release
- marketing campaigns
- public pages
- distribution profiles

Public-safe artist brand data must remain separate from private legal, banking, tax, contract, and rights administration data.

## 11. Work vs Master Boundary

Work:

- composition/song identity
- title and composition metadata
- work-level profile
- work-level registration context
- ISWC when governed
- composition-side contributors and readiness

Master / Recording:

- sound recording identity
- final/audio version identity
- ISRC when governed
- recording date/session/version context
- master-side contributors and performers
- master owner/control context
- recording file/audio relationships

Boundary rules:

- `musical_works` remains the active Work seed.
- Do not rename or replace `musical_works` now.
- Do not store ISRC as Work authority.
- Do not collapse Work and Master into one generic song object.
- Do not release a Work directly when the commercial release depends on a Master/Recording.

## 12. Contributor vs Party vs Artist Brand Distinction

Party:

- legal/commercial identity
- may sign, own, administer, receive, register, or represent

Contributor:

- creative or operational participant
- may be a person or entity involved in Work/Master/Release context
- may later link to Party/CRM identity

Artist Brand:

- public creative/commercial identity
- may be represented by one or more Parties
- may involve one or more Contributors

Distinction rules:

- A contributor is not automatically an artist brand.
- An artist brand is not automatically a legal party.
- A party is not automatically a contributor.
- A workspace actor is not automatically any of the above.
- The same real-world person can appear in multiple roles, but those roles must remain explicit.

## 13. Rights Interest Authority Model

Rights Interest is the authority layer for ownership, control, administration, territory, effective dates, verification, disputes, and audit.

Rights Interest should eventually govern:

- composition ownership
- publishing administration
- master ownership/control
- neighboring rights
- licensing authority
- collection authority
- royalty entitlement rules
- rights conflicts and disputes

Rights Interest may be informed by:

- contributor rows
- split sheets
- contracts
- mandates
- evidence
- registrations
- external body confirmations

Rights Interest must not be replaced by:

- free-text owner names
- workbook `Ownership Split %`
- `work_contributors` alone
- artist profile metadata
- workspace ownership
- release metadata
- registration submission rows

## 14. Registration Model Direction

Registration should be a governed process and result that consumes verified truth.

Registration should consume:

- Work identity
- Master identity where applicable
- Party/Contributor identity
- Rights Interest
- evidence
- identifiers
- workspace and actor context
- regulator/body-specific rules

Registration should own:

- submission package state
- submission queue state
- regulator/body response
- registration lifecycle status
- amendments and disputes
- body-specific references

Registration must not own:

- original ownership truth
- artist brand truth
- release packaging truth
- distribution status
- royalty entitlement by itself

## 15. Release / Distribution Model Direction

Release should own:

- commercial package identity
- release title/type/version
- track sequencing
- planned and actual release dates
- UPC/catalogue references when governed
- release lifecycle
- release metadata snapshots

Release must not own:

- rights ownership
- artist legal identity
- registration truth
- distribution channel truth

Distribution Relationship should own:

- delivery channel/platform
- territory/platform delivery status
- external platform references
- delivery events
- takedown/removal lifecycle
- distributor/channel reconciliation context

Distribution Relationship must not own:

- release metadata truth
- rights ownership
- artist brand truth
- registration truth

## 16. Royalty Event Model Direction

Royalty Event should represent revenue, usage, statement, or settlement-triggering source activity.

Royalty Event should consume:

- verified rights interests
- contracts/mandates
- release and distribution context
- external statement/report references
- currency and period context
- contributor/payee identity

Royalty Event should own:

- source event record
- calculation trigger
- event provenance
- event period and amount context
- downstream distribution/ledger linkage

Royalty Event must not:

- create ownership truth
- rely only on visible contributor split rows
- create contributor identity without review
- create release/distribution truth
- bypass rights verification

Workspace finance may record accounting effects, commitments, liabilities, or payments, but royalty administration remains distinct from general finance.

## 17. Transitional / Legacy Entities

The following are transitional or partial and should not be treated as final doctrine by accident:

- Prisma `MusicalWork`
- Prisma `MusicalWorkContributor`
- Prisma `Recording`
- Prisma `RecordingPerformer`
- text-ID submission queue and dispatch models
- `/api/works/create` older create-work path
- direct royalty calculations from `work_contributors`
- `musical_works` legacy metadata fields such as composer names, publisher names, split totals, copyright claimant, and registration-like status fields
- metadata-only supporting materials that are not verified evidence
- `artist_profiles.artist_type = label` as a potential blur between artist brand and company identity

These may remain in place. They should not be expanded as new canonical authority without a separate controlled design decision.

## 18. What Must Not Be Changed Yet

Do not change yet:

- do not rename `musical_works`
- do not replace the active Works seed
- do not rewrite create-song flow
- do not create Party schema yet
- do not create Master schema yet
- do not migrate registration models yet
- do not migrate rights models yet
- do not move Chronicle data
- do not import contributor splits
- do not import Chronicle ownership, ISRC, ISWC, master owner, publishing owner, release data, rights data, or registration identifiers as authority
- do not collapse Artist Brand into CRM Contact
- do not make Chronicle Music an artist
- do not make contributor splits final royalty entitlement
- do not use public website needs to drive private operational shortcuts

## 19. Future Refactor Principles

Future refactors must be controlled by doctrine first:

- define authority before schema
- define entity ownership before API expansion
- preserve workspace scope
- preserve actor/audit attribution
- preserve public/private boundaries
- preserve Work vs Master distinction
- promote intake metadata only through governed review
- favor adapters and mapping plans before replacing active tables
- keep transitional models stable until their canonical destination is approved
- avoid Chronicle-specific code paths unless explicitly marked as tenant configuration or seed data
- require rollback and read-only verification plans before data movement

Future backend work touching ownership, registrations, releases, distribution, royalties, artist/company identity, or rights administration must state which canonical entity owns the truth being created or changed.

## 20. Next Recommended Design Artifact

Recommended next design artifact:

```text
docs/platform/SENTRY-SOUND-PARTY-IDENTITY-MODEL-V1.md
```

Purpose:

- define Party, CRM Contact, Contributor, Artist Brand, Workspace Actor, Company, Publisher, Label, Distributor, Society, Regulator, and Service Provider boundaries
- decide whether current `crm_contacts` becomes the Party seed or whether Party remains a future conceptual layer
- define relationship language without schema or implementation
- clarify how Chronicle Music, M-Wis, Huey D, contributors, publishers, labels, and administrators should be represented

Boundary:

- design only
- no SQL
- no schema
- no migrations
- no route changes
- no code changes

