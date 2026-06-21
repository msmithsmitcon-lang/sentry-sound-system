# Sentry Sound Read-Model Alignment Design V1

Date: 2026-06-05

Status: design and read-model alignment only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

Read-model alignment is the safest first practical workstream after doctrine, inventory, and priority analysis.

The purpose is not to create new authority. The purpose is to interpret current Sentry Sound records accurately so UI, APIs, reports, and future planning can distinguish protected operational truth from candidates, transitional records, deferred data, non-authoritative metadata, and authority risk.

This design prepares the platform to say:

- this record is safe foundation truth
- this record is useful but not authoritative
- this value is a candidate for future authority review
- this field is private/internal and must not be publicly exposed
- this downstream workflow must remain blocked until upstream authority is verified

The first recommended practical read-model slice is:

```text
Work Foundation Read Model V1
```

This slice should interpret `musical_works`, Chronicle foundation catalogue records, contributor counts, supporting materials, registration/copyright draft posture, and authority warnings without changing underlying data.

## 2. Read-Model Alignment Purpose

Read-model alignment exists to make current records safer to consume.

It should:

- reuse existing seeds first
- protect `musical_works` as the active Work seed
- protect Chronicle catalogue records
- preserve create-song and Works UI foundations
- label contributor capture as participation/readiness data
- label File Vault records as support/evidence candidates unless verified
- label royalty engine output as transitional until Rights Interest authority is available
- prevent public/API overexposure of private or non-authoritative fields
- support future Party, Rights, Master, Registration, Release, Distribution, Royalty, Evidence, and Public/API designs

It must not:

- change source data
- create new authority
- create schema
- create API routes
- refactor backend services
- change UI
- import deferred Chronicle fields
- migrate contributors or royalties

## 3. Label Taxonomy

### `protected`

Meaning:

- A working foundation record or path that should remain stable.

Use for:

- `musical_works`
- Chronicle foundation catalogue records
- workspace-scoped create-song outputs
- existing Works UI foundation
- finance boundary

Must not imply:

- legal ownership
- rights clearance
- registration acceptance
- royalty entitlement

### `candidate`

Meaning:

- A record or field may become part of a future authority layer after review.

Use for:

- CRM Contact as possible Party seed
- rights claim as possible Rights Interest seed
- recording slice as possible Master seed
- identifier fields as registration/identifier candidates
- contributor rows as possible participant/Party review inputs

Must not imply:

- verified authority
- final relationship
- final ownership

### `transitional`

Meaning:

- Useful current structure that serves the platform now but should not be treated as final doctrine authority.

Use for:

- `work_contributors` splits
- current royalty calculation/ledger engine
- release-track `isrc`
- older/parallel Prisma registration/evidence slice
- distribution references used for reconciliation

Must not imply:

- wrong or unusable
- ready for deletion

### `verified`

Meaning:

- A value has been reviewed and accepted by an approved governance process for its limited context.

Current caution:

- This label should be used sparingly until verification workflows are explicitly implemented.
- Existing records should not be marked verified merely because they exist.

Use for future:

- verified Rights Interest
- verified evidence
- accepted registration reference
- approved Master identity
- approved public export field

### `deferred`

Meaning:

- The information exists as intake, note, source material, or future need, but is intentionally not imported or activated as authority.

Use for:

- Chronicle ownership splits
- Chronicle ISRC/ISWC
- master owner/publishing owner fields
- release data not yet migrated
- rights data not yet governed
- registration identifiers not yet governed

### `unknown`

Meaning:

- The platform does not yet have enough governed context to classify the record safely.

Use for:

- ambiguous contributor identity
- unclear Party/payee mapping
- unreviewed ownership notes
- unclassified source references
- unmatched royalty or distribution report lines

### `blocked`

Meaning:

- A downstream action should not proceed until missing or conflicting upstream authority is resolved.

Use for:

- release readiness blocked by unresolved rights
- royalty processing blocked by incomplete authority
- public export blocked by privacy/authority uncertainty
- registration submission blocked by missing evidence or identity

### `non_authoritative`

Meaning:

- Useful context that must not be used as source-of-truth authority.

Use for:

- free-text notes
- spreadsheet values after intake
- File Vault support references before verification
- contributor split rows before Rights Interest authority
- distributor/DSP references
- society references without reconciliation

### `authority_risk`

Meaning:

- A record or field may be mistaken for ownership, registration, release, distribution, royalty, payee, or public authority.

Use for:

- contributor split percentages
- Work metadata fields that imply ownership/publishing
- release lifecycle `ready`
- release-track `isrc`
- distributor/DSP acceptance references
- royalty distributions calculated from contributors

## 4. Domain-By-Domain Read-Model Interpretation

### Work / `musical_works`

Current seed:

- `musical_works`
- `assets`
- Works read repositories
- create-song path

Default labels:

- `protected`
- `active_seed`
- `workspace_scoped`

Safe interpretation:

- Work records are foundation catalogue truth.
- Chronicle imported records are protected foundation Works.
- Draft copyright/registration status can be surfaced as operational status, not external authority.

Candidate/transitional/non-authoritative:

- ownership-related metadata
- publishing fields
- ISWC-like fields
- copyright evidence notes
- API/public flags until public-safe projection exists

Must remain hidden/private:

- internal notes
- evidence notes
- private metadata
- unresolved ownership/publishing fields

### Contributors / `work_contributors`

Current seed:

- `contributors`
- `work_contributors`
- contributor admin/governance services

Default labels:

- `transitional`
- `participation_capture`
- `non_authoritative`

Safe interpretation:

- Contributors are participants and readiness inputs.
- Contributor rows can support review, registration preparation, and split-sheet workflow.

Candidate/transitional/non-authoritative:

- split percentages
- contributor role-to-rights assumptions
- publisher/master owner roles unless verified elsewhere

Must remain hidden/private:

- private contributor identity/contact details
- payment details
- internal contributor notes

### Party / CRM / Identity

Current seed:

- `crm_contacts`
- contact emails/phones/relationships/notes
- contract parties

Default labels:

- `candidate`
- `identity_seed`
- `non_authoritative`

Safe interpretation:

- CRM Contact is the closest current Party seed.
- It can be surfaced internally as contact/identity context.

Candidate/transitional/non-authoritative:

- legal/commercial Party authority
- payee authority
- rights holder status
- distributor/society/publisher authority

Must remain hidden/private:

- contact details not approved for public use
- notes
- private business/legal fields

### Artist Brand

Current seed:

- `artist_profiles`
- aliases
- genres
- social links

Default labels:

- `protected`
- `artist_brand_seed`

Safe interpretation:

- Artist Brand can be surfaced as public-facing creative identity where approved.
- Stage/performing name, genre, and public links may be public-safe only after review.

Candidate/transitional/non-authoritative:

- artist profile rights/publishing posture
- management/compliance metadata
- assumptions that artist brand equals company or payee

Must remain hidden/private:

- legal names where private
- contact details
- contracts/banking/tax/evidence metadata

### Rights Interest

Current seed:

- `rights_assets`
- `rights_ownership_claims`
- rights lifecycle/audit events
- contract rights links

Default labels:

- `candidate`
- `authority_risk`

Safe interpretation:

- Rights lifecycle records are rights authority seeds.
- They can be surfaced internally as claims, review states, and candidate authority context.

Candidate/transitional/non-authoritative:

- unverified ownership claims
- territory/effective-date claims before verification
- contract-linked rights before authority review

Must remain hidden/private:

- disputes
- claim evidence
- contracts
- internal rights notes

### Master / Recording

Current seed:

- Recording slice
- `RecordingPerformer`
- `recording_contributors`
- `release_tracks.sound_recording_id`
- File Vault `master_audio`

Default labels:

- `candidate`
- `transitional`

Safe interpretation:

- Recording/Master records or references can be surfaced internally as candidate Master context.
- Audio files can be labelled support material, not commercial Master authority.

Candidate/transitional/non-authoritative:

- release-track `isrc`
- uploaded/demo audio
- producer/performer roles as ownership authority
- master owner text fields

Must remain hidden/private:

- unreleased audio references
- private recording notes
- master ownership evidence

### Registration / Identifiers

Current seed:

- registration services
- submission engine
- registration evidence
- registration disputes/amendments
- identifier/readiness logic

Default labels:

- `transitional`
- `candidate`
- `authority_risk`

Safe interpretation:

- Registration records and identifiers are registration/reference context.
- Submission readiness can be surfaced as operational readiness, not ownership proof.

Candidate/transitional/non-authoritative:

- ISWC, ISRC, IPI, UPC/EAN, society references
- SAMRO/CAPASSO/distributor references
- pending/disputed registration status

Must remain hidden/private:

- submission packets
- evidence
- regulator correspondence
- disputes/amendments unless approved

### Release / Readiness

Current seed:

- `releases`
- `release_tracks`
- versions/snapshots/audit
- work completeness/readiness

Default labels:

- `protected`
- `transitional`

Safe interpretation:

- Releases are commercial package seeds.
- Work completeness can be surfaced as operational completeness.

Candidate/transitional/non-authoritative:

- `lifecycle_status = ready`
- release-track `isrc`
- distributor references
- release readiness implied by metadata alone

Must remain hidden/private:

- internal release notes
- blockers
- evidence gaps
- contracts/rights review state unless approved

### Distribution

Current seed:

- distribution channels
- distribution releases
- channel delivery records
- delivery/audit events

Default labels:

- `protected`
- `delivery_context`
- `non_authoritative`

Safe interpretation:

- Distribution can show delivery/channel/status context.
- It can support reporting and reconciliation.

Candidate/transitional/non-authoritative:

- distributor references
- DSP references
- platform acceptance
- live status as rights proof

Must remain hidden/private:

- distributor credentials
- internal delivery event payloads
- takedown dispute details

### Royalty Authority

Current seed:

- royalty engine
- royalty events
- royalty distributions
- royalty ledger
- payout/settlement services
- royalty-control alignment preflight

Default labels:

- `transitional`
- `authority_risk`

Safe interpretation:

- Current royalty engine is a protected transitional calculation/ledger engine.
- Royalty events are activity/evidence, not ownership authority.

Candidate/transitional/non-authoritative:

- contributor-derived distributions
- contributor balances
- payout candidates
- distributor/society reports before reconciliation

Must remain hidden/private:

- payout details
- payee/payment details
- private statements
- disputes/holds

### File Vault / Evidence

Current seed:

- File Vault items/links/versions/audit
- evidence readiness/evidence vault seeds
- work supporting materials

Default labels:

- `protected`
- `support_material`
- `candidate`

Safe interpretation:

- Files can be surfaced internally as supporting materials.
- Linked records can show that a file exists for review.

Candidate/transitional/non-authoritative:

- proof of ownership files before verification
- split sheets before validation
- contracts before rights authority review
- evidence readiness before full governance

Must remain hidden/private:

- files by default
- contracts
- KYC/identity documents
- private invoices/statements
- evidence audit trail unless approved

### Chronicle Integration

Current seed:

- imported Chronicle Works in `musical_works`
- Chronicle docs
- existing create-song path

Default labels:

- `protected`
- `backend_authoritative`
- `chronicle_foundation_catalogue`

Safe interpretation:

- Chronicle foundation Works are backend-authoritative for foundation catalogue identity.
- Workbook values remain intake-only.

Candidate/transitional/non-authoritative:

- Chronicle ownership splits
- ISRC/ISWC
- master owner/publishing owner
- release data
- notes fields

Must remain hidden/private:

- deferred rights/ownership fields
- private notes
- evidence/registration/royalty data

### Public / API Consumption

Current seed:

- landing pages
- operational APIs
- Works/Artist read paths
- no public-safe Chronicle projection yet

Default labels:

- `candidate`
- `public_projection_needed`
- `authority_risk`

Safe interpretation:

- Public/API consumption must use approved projection fields only.
- Operational records should not be exposed directly.

Candidate/transitional/non-authoritative:

- all public catalogue feeds until projection rules exist
- API handles/public flags until approved

Must remain hidden/private:

- contributors unless approved public credits
- splits
- rights
- contracts
- evidence
- internal readiness
- royalties
- finance
- private CRM/contact fields

## 5. What Can Be Safely Surfaced Now

Safe internal surfaces:

- Work title
- workspace-scoped Work identity
- genre/mood where captured as metadata
- draft copyright/registration posture as internal status
- contributor count
- supporting material existence
- artist brand display where profile is intended for workspace use
- release/distribution operational status as downstream context
- finance dashboard data inside authenticated workspace context

Safe public surfaces only after approval:

- title
- public artist brand display
- public genre/category
- approved catalogue description
- approved artwork/public asset
- approved release/public availability status

## 6. What Must Be Labelled Candidate / Transitional / Non-Authoritative

Candidate:

- CRM Contact as Party seed
- rights claims as Rights Interest seed
- recording references as Master seed
- identifiers as registration candidates
- public feed fields before approval

Transitional:

- `work_contributors`
- contributor split totals
- release-track `isrc`
- current royalty engine output
- older/parallel registration/evidence slice
- lifecycle `ready` states before readiness gates

Non-authoritative:

- spreadsheet values after intake
- File Vault supporting materials before evidence verification
- distributor/DSP references
- society references
- free-text notes
- artist visibility
- workspace access

## 7. What Must Remain Hidden / Private

Private by default:

- contributor private identity/contact data
- split percentages unless approved for internal rights review
- ownership claims
- contracts
- KYC/identity files
- evidence documents
- internal notes
- registration packets
- disputes/amendments
- distributor payloads
- royalty statements
- payout/payee/payment details
- finance internals
- readiness blockers
- deferred Chronicle rights/identifier fields

Public exposure requires an approved public-safe projection model.

## 8. Public-Safe Field Principles

Public/API outputs should:

- use approved projection fields
- never expose operational tables directly
- distinguish public artist brand from legal Party
- avoid contributor splits
- avoid rights ownership details
- avoid registration disputes/readiness internals
- avoid evidence and contracts
- avoid royalties and finance
- avoid workbook-origin deferred authority fields
- include only reviewed public catalogue metadata

Public-safe does not mean true by default. It means approved for public consumption from backend truth.

## 9. Chronicle Catalogue Read-Model Rules

Chronicle foundation Works:

- label as `protected`
- label as `backend_authoritative`
- label as `chronicle_foundation_catalogue`
- expose internally through current Works UI
- do not mutate from workbook
- do not treat workbook as ongoing authority

Chronicle deferred fields:

- ownership split: `deferred`, `non_authoritative`, `authority_risk`
- ISRC: `deferred`, `candidate`, `authority_risk`
- ISWC: `deferred`, `candidate`, `authority_risk`
- master owner: `deferred`, `candidate`, `authority_risk`
- publishing owner: `deferred`, `candidate`, `authority_risk`
- release data: `deferred`, `candidate`
- rights notes: `deferred`, `private`

Chronicle public/API rule:

- no public feed until approved projection rules exist
- no Chronicle-specific platform logic
- Chronicle consumes Sentry Sound truth, not workbook truth

## 10. Risks Prevented By Read-Model Alignment

Read-model alignment prevents:

- treating contributor splits as final ownership
- treating artist visibility as ownership or payee authority
- treating workspace access as copyright ownership
- treating File Vault documents as verified evidence
- treating release lifecycle `ready` as full Release Readiness
- treating distribution/DSP references as rights proof
- treating identifiers as ownership proof
- treating royalty events as ownership authority
- exposing private Chronicle/intake fields publicly
- designing schema before understanding current seeds

## 11. Future Implementation Gates

Implementation remains paused until explicit approval for:

- schema changes
- migrations
- API routes
- backend services
- UI changes
- public projections
- contributor migration
- Party implementation
- Rights Interest implementation
- Master implementation
- Registration identifier governance
- Release Readiness gates
- Distribution enforcement
- Royalty Authority migration
- finance/royalty posting automation

Before implementation, each future workstream must have:

- approved scope
- protected foundations reviewed
- affected files/tables/routes listed
- read-model labels defined
- privacy/public-safe impact reviewed
- rollback/recovery plan
- test/check plan

## 12. Recommended First Practical Read-Model Slice

Recommended slice:

```text
Work Foundation Read Model V1
```

Purpose:

- interpret current `musical_works` records safely
- protect Chronicle foundation catalogue data
- expose contributor count as participation context, not rights authority
- expose support-material existence as support context, not verified evidence
- show registration/copyright status as internal draft posture, not external authority
- flag deferred authority fields as `deferred`, `candidate`, or `authority_risk`

Suggested read-model outputs:

- `work_id`
- `workspace_id`
- `title`
- `genre`
- `mood`
- `catalogue_source_label`
- `foundation_status_label`
- `contributor_capture_label`
- `rights_authority_label`
- `registration_authority_label`
- `master_authority_label`
- `evidence_label`
- `public_projection_label`
- `authority_warnings`

Boundary:

- design only
- no code
- no schema
- no API
- no UI
- no database writes

Recommended next artifact:

```text
docs/platform/SENTRY-SOUND-WORK-FOUNDATION-READ-MODEL-V1.md
```

