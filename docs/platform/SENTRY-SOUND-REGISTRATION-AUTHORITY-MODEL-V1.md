# Sentry Sound Registration Authority Model V1

Date: 2026-06-05

Status: doctrine and authority definition only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

Registration is a downstream authority, verification, and external-body workflow. It records how a Work, Master / Recording, Party, Rights Interest, Release, or related package is submitted, referenced, accepted, amended, disputed, or identified by a registration body, society, distributor, or external authority.

Registration does not create ownership. Registration consumes verified ownership authority.

Registration does not create Works, Masters, Parties, Artist Brands, or Rights Interests. It references those records and records the registration/submission/identifier state that external bodies or platform governance provide.

Immediate doctrine lock:

- Registrations do not create ownership.
- Registrations consume verified ownership authority.
- Registrations do not create Rights Interests.
- Registrations consume Rights Interests.
- Registrations do not create Works.
- Registrations do not create Masters.
- Registrations reference Works and/or Masters.
- Identifiers are evidence of registration state, not ownership state.
- Society references are not ownership authority by themselves.
- Distribution references are not ownership authority by themselves.
- Registration readiness should eventually depend on verified Rights Interest and asset truth.

Current platform reality:

- Registration/readiness/submission modules exist and are valuable.
- Prisma registration models and submission queues are partly transitional.
- `musical_works` is the active Work seed, while Prisma `MusicalWork` remains a parallel registration-domain model.
- Prisma `Recording` exists, but Master / Recording is not yet active as the canonical Works UX surface.
- SAMRO export and validation concepts exist.
- ISWC, ISRC, IPI, UPC, regulator references, and distributor references are not yet governed by one canonical identifier model.

This document does not design implementation. It defines what registration and identifiers may prove, what they may not prove, and which canonical entity should own each identifier conceptually.

## 2. Recommended Registration Authority Model

Conceptual model:

```text
Registration Authority
  subject: Work, Master / Recording, Party, Release, Rights Interest, or submission package
  body/source: SAMRO, CAPASSO, distributor, society, regulator, platform, internal governance
  identifier/reference: ISWC, ISRC, IPI, UPC/EAN, society ref, distributor ref
  status: draft, ready, submitted, accepted, rejected, amended, disputed, expired, archived
  evidence: documents, files, contracts, rights interests, body responses
  authority consumed: Party, Rights Interest, Work, Master, Release, Evidence
  audit: who submitted, when, under which workspace and authority
```

Registration Authority should answer:

- what entity or package was registered or submitted?
- with which body, society, distributor, or platform?
- which identifier/reference was issued or used?
- what verified authority was used to make the submission?
- what evidence supported the submission?
- who submitted it and under which workspace?
- what response or status came back?
- does the result affect readiness, release, distribution, or royalty workflows?

## 3. What Is A Registration?

A Registration is a governed record of a submission, listing, body reference, identifier assignment, confirmation, amendment, dispute, or external acknowledgement related to a music-business entity.

Registration can apply to:

- Work / composition
- Master / Recording
- Party / contributor / writer / publisher identity
- Rights Interest
- Release package
- collection mandate
- submission package
- society membership/reference
- distributor or platform reference

Registration may produce or reference identifiers. The identifier is not the whole registration context. The registration context should include body/source, subject, status, evidence, authority basis, and audit trail.

## 4. Registration vs Work

Work is the composition/song identity.

Registration records how the Work is submitted, referenced, identified, accepted, or amended with a registration body or society.

Rules:

- Registration does not create Work.
- Work exists before ISWC.
- Work exists before registration.
- ISWC belongs to Work identifier governance.
- Work-level registration should consume verified composition/publishing Rights Interest.
- Work-level registration should not infer ownership from contributor rows, artist brand, workspace owner, or workbook fields.

Current mapping:

- `musical_works` remains the active Work seed.
- Prisma `MusicalWork` registration models are transitional until canonical mapping is defined.

Chronicle reference:

The Chronicle foundation works now exist in Sentry Sound before any ISWC or society registration is imported. That is correct.

## 5. Registration vs Master / Recording

Master / Recording is the sound recording identity.

Registration records how the Master / Recording is submitted, referenced, identified, accepted, or amended with bodies, societies, distributors, or platforms.

Rules:

- Registration does not create Master.
- Master exists before ISRC.
- ISRC belongs to Master / Recording identifier governance.
- Recording/master registration should consume verified master-side Rights Interest.
- Master registration must remain distinct from Work registration.
- Recording participant and performer references are not automatically master ownership.

Current mapping:

- Prisma `Recording` and `RecordingPerformer` are transitional.
- Release-track `isrc` is transitional until Master / Recording identifier governance is locked.

Chronicle reference:

Chronicle workbook ISRC fields remain deferred. They should not be imported as Work truth.

## 6. Registration vs Rights Interest

Rights Interest is ownership/control/administration authority.

Registration consumes Rights Interest.

Rules:

- Registration does not create Rights Interest.
- Registration may confirm, expose, reject, or dispute a claimed right.
- Registration readiness should depend on verified or review-approved Rights Interest.
- Submission to a body should not be allowed to override local rights truth without governed review.
- Society references are not ownership authority by themselves.
- Registration status should not be used as a substitute for Rights Interest verification.

Example:

A SAMRO submission should be based on verified composition/publishing Rights Interests, not only contributor names or split percentages.

## 7. Registration vs Party

Party is legal/commercial identity.

Registration may identify or reference a Party as a writer, publisher, registrant, claimant, administrator, member, payee, label, distributor, or submitter depending on body and domain.

Rules:

- Registration does not create Party.
- Registration may require Party identifiers such as IPI/CAE, membership numbers, tax/company references, or society references.
- Party identity must remain separate from workspace user identity.
- Submitter/actor is not automatically the registrant, claimant, publisher, owner, or payee.
- CRM/contact data alone is not registration authority.

## 8. Registration vs Release

Release is commercial packaging.

Registration records identifiers and body/platform references related to release packages where applicable.

Rules:

- Registration does not create Release.
- UPC/EAN belongs to Release identifier governance.
- Release readiness may consume registration state, but release metadata should not create registration truth.
- Release scheduling should not create registration authority.
- Release tracks should reference Work and Master separately when governed.

Current mapping:

- Release Management supports UPC and external release/distributor references.
- These are useful but remain identifier/reference concepts, not ownership authority.

## 9. Registration vs Distribution

Distribution is channel/platform delivery and status.

Registration may provide or consume references needed by distribution, but distribution references do not prove ownership.

Rules:

- Registration does not create Distribution Relationship.
- Distribution does not create registration authority.
- Distributor references are not ownership authority by themselves.
- Distribution references may identify a delivered release, channel, platform, or distributor-side package.
- Distributor/platform identifiers should link back to Release, Distribution Relationship, and/or external source context, not overwrite Work/Master/Party/Rights truth.

## 10. Registration vs Royalty Event

Royalty Event is revenue, usage, statement, or settlement-triggering activity.

Registration may influence royalty eligibility, collection, matching, and reporting, but registration does not create royalty entitlement alone.

Rules:

- Royalty Events should consume verified Rights Interest and relevant registration/identifier state.
- Registration references can support matching and collection.
- Registration status is not enough to prove payout authority.
- Payee and entitlement must be derived from Party, Rights Interest, contracts/mandates, distribution/reporting context, and applicable registrations.
- Work-side and master-side royalty identifiers must remain distinct.

## 11. Registration vs Identifier

Identifier is a reference value.

Registration is the governed context in which the identifier is issued, used, verified, amended, disputed, or linked.

Rules:

- Identifiers are evidence of registration/reference state, not ownership state.
- An identifier without source/body/context is incomplete.
- An identifier may be valid but attached to the wrong local entity if mapping is wrong.
- Missing identifier does not mean the underlying entity does not exist.
- Duplicate/conflicting identifiers require review, not blind overwrite.
- External identifiers should not live only as ungoverned metadata.

## 12. Identifier Governance Rules

### ISWC

Belongs to:

- Work / composition identifier governance

Authority required before issuance/use:

- Work identity
- composition-side contributor identity
- composition/publishing Rights Interest
- registration body/society context
- evidence/readiness where applicable

Must not be used as proof of:

- master ownership
- sound recording identity
- release ownership
- payee authority
- workspace ownership

### ISRC

Belongs to:

- Master / Recording identifier governance

Authority required before issuance/use:

- Master / Recording identity
- sound recording/version context
- master-side Party/Rights Interest
- label/issuer/distributor context where applicable
- evidence/readiness where applicable

Must not be used as proof of:

- Work ownership
- composition ownership
- publishing ownership
- artist brand ownership
- release ownership by itself

### IPI / CAE

Belongs to:

- Party/contributor/person/publisher identity governance, depending on body context

Authority required before issuance/use:

- verified person/company/Party identity
- society/member context
- contributor or publisher role mapping where applicable

Must not be used as proof of:

- Work ownership by itself
- master ownership
- release ownership
- payout entitlement without Rights Interest/contract context

### UPC / EAN

Belongs to:

- Release identifier governance

Authority required before issuance/use:

- Release identity
- release package metadata
- label/distributor/issuer context
- release readiness and rights authority where applicable

Must not be used as proof of:

- Work ownership
- Master ownership
- Party ownership
- royalty entitlement

### SAMRO References

Belongs to:

- Registration/submission/society reference governance, usually Work/composition and Party/contributor/publisher context

Authority required before issuance/use:

- Work identity
- contributor and publisher identity
- composition/publishing Rights Interest
- society submission context
- evidence/readiness where applicable

Must not be used as proof of:

- master ownership
- release ownership
- distribution authority
- ownership outside the registered scope without review

### CAPASSO References

Belongs to:

- Registration/submission/society reference governance, typically mechanical rights and publishing/collection context

Authority required before issuance/use:

- Work identity
- Party/publisher identity
- mechanical/publishing Rights Interest or collection mandate
- evidence/readiness where applicable

Must not be used as proof of:

- master ownership
- public artist identity
- broad ownership outside the mechanical/collection scope

### Distributor References

Belongs to:

- Distribution Relationship and/or Release reference governance

Authority required before issuance/use:

- Release identity
- distribution relationship/channel context
- distributor account or partner context
- release/master rights readiness where applicable

Must not be used as proof of:

- Work ownership
- Master ownership
- Party ownership
- registration acceptance
- royalty entitlement by itself

## 13. Registration Authority Rules

Registration authority rules:

- Registration follows ownership authority.
- Rights Interest exists before registration authority.
- Registration readiness should depend on verified Rights Interest and asset truth.
- Registration may require Work, Master, Party, Rights Interest, Evidence, Contract/Mandate, and Identifier context.
- Registration should distinguish work registration, recording/master registration, society registration, copyright registration, release/package identifiers, and distributor references.
- Registration should record body/source and status.
- Registration results should be auditable.
- Registration responses should not silently overwrite local canonical truth.
- Registration disputes and amendments should be explicit lifecycle events.

## 14. Relationship To Party

Registration may reference Party as:

- writer
- composer
- lyricist
- publisher
- claimant
- registrant
- administrator
- society member
- master owner
- label
- submitter
- payee or collection recipient where body-specific

Rules:

- Party identity is required before registration authority can be trusted.
- Workspace actor identity and Party identity must remain separate.
- Artist Brand is not a substitute for Party.

## 15. Relationship To Rights Interest

Registration should consume Rights Interest as the authority basis for submission and identifier governance.

Rules:

- Verified Rights Interest should be the preferred basis for registration readiness.
- Pending Rights Interest may support draft/review only.
- Disputed Rights Interest should block or warn depending on registration type.
- Registration may produce evidence that updates review status, but not automatically.

## 16. Relationship To Work

Registration may reference Work for:

- ISWC
- composition registration
- SAMRO-style work registration
- CAPASSO/mechanical context
- publisher/writer claims
- copyright/evidence workflows

Rules:

- Work exists before registration.
- Registration state should not be the only Work status.
- Work title/metadata should not be overwritten by external body data without governed review.

## 17. Relationship To Master / Recording

Registration may reference Master / Recording for:

- ISRC
- recording registration
- neighboring rights
- master owner/label context
- performer/producer context
- master-side evidence

Rules:

- Master exists before ISRC.
- ISRC belongs to Master / Recording.
- Master-side registration must stay distinct from Work registration.

## 18. Relationship To Release

Registration may reference Release for:

- UPC/EAN
- catalogue number
- release package references
- distributor package references
- external release references

Rules:

- Release exists before release package identifier governance.
- Release identifiers do not prove Work or Master ownership.
- Release readiness should consume registration/identifier readiness but not replace it.

## 19. Relationship To Distribution

Registration may support distribution by providing required identifiers or readiness evidence.

Rules:

- Distribution follows release readiness.
- Distribution references are not registration authority.
- Distribution references are not ownership authority.
- Distribution reports may later feed royalty matching, not ownership truth.

## 20. Relationship To Royalty Event

Registration may support royalty matching, collection, society claims, and statement reconciliation.

Rules:

- Royalty Events consume registration/identifier context where relevant.
- Royalty Events must ultimately derive authority from Rights Interest and Party/payee relationships.
- Registration identifiers help match revenue; they do not independently create entitlement.

## 21. Chronicle Reference Cases

These examples clarify doctrine only. They do not create Chronicle-specific logic.

### Work Exists Before ISWC

Chronicle foundation works now exist in Sentry Sound without ISWC import.

Doctrine:

- This is valid.
- Work identity does not depend on ISWC.
- ISWC should be added only through governed Work registration/identifier authority.

### Master Exists Before ISRC

A Chronicle Master / Recording may exist before ISRC assignment.

Doctrine:

- This is valid.
- ISRC should identify the Master / Recording, not the Work.
- Demo audio should not receive commercial Master authority by accident.

### Rights Interest Exists Before Registration

Chronicle ownership/admin claims must be modeled as Rights Interest before registration authority can be trusted.

Doctrine:

- Workbook ownership fields are intake context.
- Registration should follow reviewed ownership/admin authority.

### Distribution Follows Registration Readiness

Chronicle public release/distribution should consume release readiness, which may include registration/identifier readiness, Rights Interest, Master, Work, and evidence state.

Doctrine:

- Distribution should not create registration or ownership truth.

## 22. Conflicts Discovered

Doctrine conflicts and tensions:

- Identifier values are currently spread across Prisma `MusicalWork.iswc`, Prisma `Recording.isrc`, `release_tracks.isrc`, release UPC fields, artist metadata IPI fields, SAMRO export rows, and Chronicle workbook fields.
- No single external identifier governance model is active.
- Active Work truth uses lowercase `musical_works`, while registration-domain Prisma `MusicalWork` remains parallel.
- Master / Recording identifier governance is not active in the Works UX.
- SAMRO submission validation checks contributor/publisher IPI and ownership totals, but long-term authority should consume Party/Rights Interest rather than raw split rows alone.
- Release and distributor references exist, but they must not become ownership or registration authority by accident.
- Chronicle import correctly deferred ISRC, ISWC, master owner, publishing owner, release data, rights data, and registration identifiers.

These are doctrine alignment issues, not implementation defects.

## 23. Transitional Concepts Identified

Transitional concepts:

- Prisma `MusicalWork.iswc`
- Prisma `Recording.isrc`
- `release_tracks.isrc`
- `releases.upc`
- `releases.external_release_reference`
- `releases.distributor_reference`
- `distribution_release_channels.external_reference_id`
- artist profile IPI / PRO metadata
- contributor metadata optional IPI / ID fields
- SAMRO export rows and validation utilities
- `SubmissionQueue` entity references
- `SubmissionSnapshot` payloads
- Chronicle workbook `ISRC`, `ISWC`, `Master Owner`, `Publishing Owner`, and owner notes
- registration readiness rules that predate Rights Interest authority

These should remain stable until controlled identifier/registration design and migration work is approved.

## 24. What Must Not Change Yet

Do not change yet:

- do not create identifier schema
- do not migrate ISWC
- do not migrate ISRC
- do not import Chronicle identifiers
- do not change registration flows
- do not change submission queues
- do not change SAMRO/CAPASSO validation
- do not change release/distribution references
- do not infer ownership from identifiers
- do not infer ownership from society references
- do not infer ownership from distributor references
- do not modify code, UI, APIs, schema, migrations, or database records

## 25. Future Refactor Principles

Future Registration Authority work must:

- define identifier ownership before storage
- preserve Work vs Master identifier boundaries
- preserve Party vs Contributor vs Artist Brand identity boundaries
- consume verified Rights Interest before registration submission authority
- keep registration separate from ownership creation
- keep external body responses auditable
- treat external identifiers as references with source/body/context
- require conflict review for duplicate or mismatched identifiers
- keep release/distribution references downstream
- avoid Chronicle-specific platform logic
- require read-only audits before promoting workbook values or external references

## 26. Next Recommended Doctrine Artifact

Next artifact:

```text
docs/platform/SENTRY-SOUND-RELEASE-READINESS-MODEL-V1.md
```

Purpose:

- define release readiness as a downstream gate
- clarify what Release consumes from Work, Master, Artist Brand, Party, Rights Interest, Registration, Evidence, artwork, files, and identifiers
- define why release does not create ownership, registration, or distribution truth
- prepare the doctrine boundary before distribution and royalty authority models

Do not start implementation from this Registration Authority model. The next step is doctrine only.

