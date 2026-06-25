# Sentry Sound Party Identity Model V1

Date: 2026-06-04

Status: doctrine and architecture direction only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

Party is the legal/commercial identity layer for Sentry Sound.

Party is the concept the platform needs before it can safely reason about ownership, contracts, registrations, release authority, distribution relationships, royalty payees, mandates, administration, and external-body identity.

Current platform reality already has several adjacent identity structures:

- `crm_contacts`
- `contributors`
- `artist_profiles`
- `workspace_members`
- `contract_parties`
- `rights_ownership_claims`

Those structures are useful and must not be collapsed casually. The doctrine direction is that Party becomes the future conceptual authority for legal/commercial identity, while current `crm_contacts` remain the closest active seed for person, company, and organization identity.

Locked principles:

- Party is the legal/commercial identity layer.
- CRM Contact is operational/contact data, not always legal authority.
- Contributor is a role/participant identity, not automatically ownership authority.
- Artist Brand is public-facing identity, not automatically legal identity.
- Workspace User controls access, not copyright ownership.
- Chronicle Music is a company/reference tenant/business operator, not an artist.
- M-Wis and Huey D are artist brands.
- Rights ownership must eventually attach to Party/Rights Interest, not only contributor split rows.

This document does not create a Party table. It defines the model that future controlled design and refactor work must respect.

## 2. What A Party Is

A Party is a legal or commercial identity that can hold, administer, sign, control, receive, represent, register, dispute, or be accountable for music-business rights and obligations.

A Party can represent:

- person
- company
- publisher
- label
- distributor
- collecting society
- regulator
- service provider
- rights administrator
- manager
- estate
- trust
- collective
- production company
- studio
- platform partner

Party is not primarily a UI profile. It is the identity layer behind authority.

Party answers questions such as:

- who legally owns or controls this right?
- who signed this contract?
- who has administration authority?
- who is the payee?
- who is the registrant?
- who is the publisher?
- who is the label?
- who is the distributor?
- who is the regulator or society?
- who is responsible for a mandate or obligation?

## 3. Recommended Party Model

Recommended conceptual model:

```text
Party
  legal/commercial identity
  may have contact records
  may have roles
  may control artist brands
  may participate as contributor
  may hold rights interests
  may be party to contracts
  may be registration claimant/registrant/payee
```

Party should eventually support:

- party type
- legal name
- trading name
- country/jurisdiction
- registration/tax identifiers where applicable
- contact channels through CRM/contact structures
- relationship links to artist brands, contributors, contracts, rights interests, registrations, releases, distribution relationships, and royalties
- verification status
- lifecycle status
- audit trail

Current active seed:

- `crm_contacts` is the closest active structure for Party-like identity.

Current direction:

- Treat `crm_contacts` as the practical Party seed for now.
- Do not create or rename Party storage yet.
- Do not force all existing identity records into one model yet.
- Use this doctrine to prevent future feature work from putting legal authority in the wrong place.

## 4. Party vs CRM Contact

CRM Contact is an operational contact/relationship record.

Party is a legal/commercial identity concept.

CRM Contact may represent a Party, but not every CRM Contact is automatically authoritative as a Party.

CRM Contact owns:

- display name
- legal/trading/contact names where captured
- contact type
- email and phone channels
- notes
- relationship context
- operational lifecycle
- communication and contact metadata

Party owns, conceptually:

- legal/commercial identity
- authority to own, sign, administer, register, receive, or represent
- legal/commercial role in rights, contracts, registrations, and royalties

Rules:

- A CRM contact can be the current record used to represent a Party.
- A CRM contact by itself must not prove rights ownership.
- Contact details must not become ownership truth.
- Private CRM data must not leak into public artist or Chronicle-facing feeds.
- A future Party model may formalize what `crm_contacts` currently approximates.

## 5. Party vs Contributor

Contributor is a creative or operational participant identity.

Party is the legal/commercial identity layer.

Contributor may represent:

- composer
- lyricist
- producer
- arranger
- performer
- featured artist participant
- publisher role holder
- master owner role holder
- session participant

Contributor owns:

- participant name/profile used in work/master contributor contexts
- role and contribution relationships through `work_contributors` or future recording relationships
- split capture/readiness data where present

Party owns:

- legal/commercial authority
- ownership/control/admin/payee/registrant identity

Rules:

- A contributor is not automatically a rights owner.
- A contributor split row is not final rights authority.
- A contributor may later link to a Party/CRM identity.
- One Party may have multiple contributor identities or aliases.
- One contributor identity may need review before being treated as a Party.
- Contributor capture can inform rights review, but Rights Interest must carry authority.

Example:

If a songwriter appears as a composer in `work_contributors`, that captures participation. It does not by itself prove who owns publishing, who controls administration, who receives royalties, or who can authorize registration.

## 6. Party vs Artist Brand

Artist Brand is public-facing creative/commercial identity.

Party is legal/commercial identity.

Artist Brand owns:

- stage name
- public artist profile posture
- genre and public-facing identity
- marketing/catalogue identity
- release-facing artist presentation
- public-safe social and biography context

Party owns:

- legal identity
- company/person/organization identity
- authority and obligations
- contracts, rights, payee, registration, and administration context

Rules:

- Artist Brand is not automatically a company.
- Artist Brand is not automatically the legal owner.
- Artist Brand is not automatically the payee.
- Artist Brand may be controlled or represented by one or more Parties.
- One Party may control or administer multiple Artist Brands.
- One Artist Brand may involve multiple Parties.
- Artist Brand public-safe data must remain separate from private legal, tax, banking, contract, and rights data.

Examples:

- M-Wis is an Artist Brand.
- Huey D is an Artist Brand.
- Neither name should automatically become a company, publisher, payee, or rights owner.

## 7. Party vs Workspace User

Workspace User is an access and accountability actor.

Party is legal/commercial identity.

Workspace User owns:

- authentication identity
- workspace access
- permissions
- role in the app
- audit attribution for actions performed

Party owns:

- legal/commercial identity and authority

Rules:

- A workspace user can act on behalf of a Party only where authority is recorded or implied by governed workspace role/mandate policy.
- A workspace owner is not automatically the copyright owner.
- A user who creates a Work is not automatically the writer, publisher, master owner, or payee.
- Audit actor and rights owner must remain separate.
- Workspace access must never be used as proof of copyright ownership.

## 8. Party vs Company / Label / Publisher / Distributor / Society

Company, label, publisher, distributor, and society are Party roles or Party types, not separate identity universes.

A Party may act as:

- company
- label
- publisher
- distributor
- society
- regulator
- rights administrator
- service provider

Rules:

- A label is a Party role, not an Artist Brand by default.
- A publisher is a Party role, not a Work contributor by default.
- A distributor is a Party role or relationship participant, not a Release by default.
- A society/regulator is a Party or external body, not a workspace actor.
- A company can operate an Artist Brand, but the company and the Artist Brand remain distinct.
- The same Party may have several roles across different works, masters, contracts, releases, and territories.

Current conflict to avoid:

- `artist_profiles.artist_type` currently allows `label`. This may be useful as a temporary capture posture, but doctrine says label identity belongs to Party/company context unless there is a deliberate public-facing artist-brand reason.

## 9. Chronicle Music Representation

Chronicle Music should be represented as:

- a real-world company
- a reference tenant / pilot implementation
- an operational business using Sentry Sound
- potentially a Party where legal/commercial identity is needed
- potentially a label, publisher, rights administrator, catalogue operator, marketing operator, or business operator where rights/mandate records support that role

Chronicle Music should not be represented as:

- an artist
- an Artist Brand
- a hardcoded platform constant
- automatic owner of all imported works
- automatic publisher
- automatic master owner
- automatic payee
- spreadsheet authority

Recommended current posture:

- Workspace: Chronicle or Sentry Sound demo workspace context may contain Chronicle catalogue records.
- Party concept: Chronicle Music should be treated as a company/business Party when needed.
- Rights/mandate authority: must be represented by Rights Interest, Contract, or Mandate records in future controlled phases.
- Public website/catalogue: Chronicle consumes public-safe Sentry Sound truth through approved feeds, exports, APIs, or integrations.

## 10. M-Wis And Huey D Representation

M-Wis and Huey D should be represented as Artist Brands.

They may also relate to:

- contributors
- parties
- CRM contacts
- releases
- works
- masters
- public catalogue pages
- marketing campaigns

They should not automatically be:

- companies
- labels
- publishers
- rights administrators
- legal owners
- payees
- workspace users

Recommended current posture:

- Artist Brand: M-Wis and Huey D.
- CRM/Party: only where legal/contact/commercial identity is known and appropriate.
- Contributor: only where they participated in a Work/Master role.
- Rights Interest: only where ownership/control/admin authority is verified or claimed through governed records.

## 11. One Real Person Controlling Multiple Parties / Brands

One real human may be:

- a workspace user
- a Party as an individual person
- a director or representative of a company Party
- the controller of an Artist Brand
- a Contributor on works
- a contract signer
- a royalty payee
- an administrator for a catalogue

These roles must not be collapsed.

Rules:

- The same person may control multiple Artist Brands.
- The same person may represent multiple companies or Parties.
- The same person may be both contributor and administrator, but those roles remain explicit.
- The same person may have workspace access without personally owning rights.
- Legal authority should be traceable through Party, Contract, Mandate, Rights Interest, or workspace authorization policy.
- Public-facing artist identity should not reveal private legal identity unless approved.

Example:

A person may manage both M-Wis and Huey D brands, be a contributor on one work, sign a contract for Chronicle Music, and use the Sentry Sound workspace. These are four different roles, even if one human is behind them.

## 12. Party Links To Rights Interest

Rights Interest is the authority layer for ownership, control, administration, territory, effective dates, verification, disputes, and audit.

Party should eventually link to Rights Interest as:

- owner
- claimant
- administrator
- publisher
- master owner
- label
- licensee
- licensor
- collection recipient
- rights controller
- beneficiary
- disputed claimant

Rules:

- Rights ownership must attach to Party/Rights Interest, not only contributor split rows.
- Contributor rows may inform rights review but do not replace Party-linked Rights Interest.
- Rights Interest should support territory, effective dates, verification status, and evidence.
- Chronicle workbook owner fields must not become Party-linked Rights Interest without review.
- Workspace ownership must not become rights ownership.

Current platform mapping:

- `rights_ownership_claims.crm_contact_id` is a strong seed for Party-linked rights.
- `rights_ownership_claims.contributor_id` is useful where contributor identity is the current available anchor.
- Future doctrine should clarify which link has legal authority under which conditions.

## 13. Party Links To Contracts

Contracts need Party identity because contracts are signed by or apply to legal/commercial entities.

Party may link to contracts as:

- contracting party
- signer
- publisher
- label
- distributor
- artist representative
- manager
- service provider
- rights administrator
- payee
- guarantor
- licensee
- licensor

Rules:

- Contract parties should point to Party/CRM identity where possible.
- Contributor identity alone is not always enough for contract authority.
- Artist Brand should not sign a contract unless a legal Party relationship is explicit.
- Workspace user may execute an action in the app, but the contract party is the legal/commercial Party.
- Contract rights links should not create ownership truth unless governed as Rights Interest or mandate evidence.

Current platform mapping:

- `contract_parties.crm_contact_id` is a strong Party seed.
- `contract_parties.contributor_id` is useful but should be treated as transitional or role-specific until Party identity is clear.
- `contract_rights_links` can connect contract authority to rights assets.

## 14. Party Links To Registrations

Registration consumes verified identity and rights truth.

Party may link to registrations as:

- registrant
- claimant
- publisher
- composer identity
- author identity
- master owner
- label
- society member
- administrator
- submitter
- rights controller
- payee or collection recipient where body-specific

Rules:

- Registration should not create ownership truth.
- Registration should consume Party, Contributor, Work, Master, Rights Interest, Evidence, and Identifier truth.
- Submitter/user identity and registrant/claimant Party must remain separate.
- Society/regulator identifiers should be linked to Party where they identify a person/company/organization.
- Work-level and Master-level registration roles must remain distinct.

Current platform mapping:

- Existing registration/submission models are valuable, but their identity links are transitional until Party mapping is explicit.
- Submission queue records should remain operational jobs, not final identity authority.

## 15. Party Links To Royalties / Payees

Royalty administration requires Party clarity because payout and entitlement are legal/commercial matters.

Party may link to royalty flow as:

- rightsholder
- beneficiary
- payee
- publisher payee
- label payee
- distributor/source account
- royalty recipient
- withholding/tax subject
- statement issuer
- collection society

Rules:

- Royalty Event must consume verified rights and distribution/reporting context.
- Royalty Event must not rely only on visible contributor split rows.
- Payee is not always the same as contributor.
- Payee is not always the same as artist brand.
- Payee is not automatically the workspace user.
- Payment/banking details are private and must not live in public Artist Brand truth.
- Workspace finance may record accounting effects, but royalty authority must remain tied to rights and Party/payee identity.

Current conflict:

- Current royalty processing reads `work_contributors` directly. This is transitional and should not become the long-term authority model.

## 16. Transitional Existing Entities

Current structures that are useful but transitional for Party doctrine:

- `crm_contacts` as practical Party seed but not formal Party doctrine yet
- `contributors` as participant identity, not legal authority
- `artist_profiles` as public/commercial Artist Brand identity, not company/legal identity by default
- `workspace_members` and workspace user records as access actors, not rightsholders
- `contract_parties.contributor_id` where contract identity may need Party/CRM clarification
- `rights_ownership_claims.contributor_id` where rights identity may need Party/CRM clarification
- Artist metadata fields for rights/publishing posture
- Work metadata/free-text contributor, publisher, owner, and split fields
- Registration/submission queue identity fields that use text IDs or generic entity references

These should remain unchanged until a controlled model-specific refactor is approved.

## 17. What Must Not Change Yet

Do not change yet:

- do not create a Party table
- do not rename `crm_contacts`
- do not rename `contributors`
- do not rename `artist_profiles`
- do not collapse Artist Brand into Party
- do not collapse Contributor into Party
- do not collapse Workspace User into Party
- do not make Chronicle Music an artist
- do not make M-Wis or Huey D companies by default
- do not migrate rights claims
- do not migrate contract parties
- do not migrate registration identities
- do not change royalty logic
- do not import Chronicle ownership fields as Party/Rights truth
- do not infer payees from contributor split rows
- do not expose private Party/CRM/legal/tax/banking data through public artist or Chronicle feeds

## 18. Future Refactor Principles

Future identity refactors must:

- define authority before storage
- preserve workspace scope
- preserve public/private boundaries
- preserve audit actor vs legal Party distinction
- keep Artist Brand public identity separate from legal/commercial identity
- keep Contributor role identity separate from ownership authority
- keep CRM/contact data separate from legal proof
- link Party to Rights Interest before registration/release/royalty authority
- provide controlled mapping for existing CRM contacts, contributors, artist profiles, contract parties, and rights claims
- avoid Chronicle-specific assumptions in platform logic
- treat external identifiers as scoped to the identity type they identify
- require read-only audits before any data movement

Future backend work touching ownership, registration, release, distribution, royalties, contracts, artist/company identity, or rights administration must state which Party or Party-adjacent identity is being referenced and whether that identity is authoritative or transitional.

## 19. Doctrine Conflicts Found

Conflicts or tensions identified:

- No formal Party entity exists yet; `crm_contacts` is the closest current seed.
- Artist profiles currently allow label-like typing, which can blur company/label identity with Artist Brand identity.
- Rights claims can link to CRM contacts or contributors; doctrine needs a future Rights Interest model to define when each link is authoritative.
- Contract parties can link to CRM contacts or contributors; future contract doctrine should prefer Party/CRM identity for legal parties.
- Registration/submission models do not yet have a locked Party identity relationship.
- Royalty processing currently depends on `work_contributors`, which conflicts with the long-term rights/payee authority model.
- Chronicle import correctly avoided ownership and contributor split import, leaving Party/Rights truth intentionally incomplete.

These are design conflicts, not implementation defects. They should guide future controlled doctrine and refactor planning.

## 20. Next Recommended Doctrine Artifact

Next artifact:

```text
docs/platform/SENTRY-SOUND-RIGHTS-INTEREST-MODEL-V1.md
```

Purpose:

- define Rights Interest as the authority model for ownership/control/administration
- define how Party, Contributor, Work, Master, Contract, Evidence, Registration, and Royalty Event relate to rights authority
- define why contributor split rows are not final rights truth
- define what current `rights_assets` and `rights_ownership_claims` own conceptually

Do not start implementation from this Party model. The next step is doctrine only.

