# Sentry Sound Artist Brand Read Model V1

Date: 2026-06-05

Status: design and Artist Brand read-model interpretation only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

Artist Brand represents public creative identity.

It does not automatically represent legal identity, ownership authority, payee authority, registration authority, publishing authority, or rights authority.

The current Artist Brand seed is:

```text
artist_profiles
```

Artist profiles extend CRM contacts. That is directionally correct: CRM can hold operational/contact identity, while Artist Brand can hold public-facing creative/commercial presentation. The read model must keep those boundaries intact.

Immediate lock:

- Artist Brand identity is protected as public creative identity.
- Artist profile/branding/presentation can be safely interpreted as artist-facing catalogue and release context.
- Artist Brand does not automatically prove ownership.
- Artist Brand does not automatically prove payee authority.
- Artist Brand does not automatically prove legal entity status.
- Artist Brand does not automatically prove publisher, label, registration, rights, or royalty authority.

## 2. What Is An Artist Brand?

An Artist Brand is the public-facing creative/commercial identity used for catalogue, release, marketing, public profile, audience, campaigns, and artist pages.

An Artist Brand can include:

- stage name
- performing name
- artist type
- genre
- public bio
- social links
- public profile image
- public-facing lifecycle/onboarding posture
- artist aliases
- catalogue/release presentation context

Current active seed:

- `artist_profiles`
- `artist_aliases`
- `artist_genres`
- `artist_social_links`
- `artist_audit_events`

Artist Brand is not the same as Party, Contributor, Workspace User, Rights Holder, Payee, Publisher, Label, or Registrant.

## 3. Artist Brand vs Party

Party is legal/commercial identity.

Artist Brand is public creative identity.

Read-model rules:

- An Artist Brand may link to a CRM Contact / future Party candidate.
- A Party may control, represent, manage, administer, or own rights related to one or more Artist Brands only where authority records support that.
- Artist Brand does not prove legal identity.
- Artist Brand does not prove company status.
- Artist Brand does not prove signing authority.

Labels:

- artist profile: `protected`
- future Party link: `candidate`
- legal/commercial authority: `deferred`
- artist-as-legal-entity assumption: `authority_risk`

## 4. Artist Brand vs Contributor

Contributor is participation identity.

Artist Brand is public presentation identity.

Read-model rules:

- An Artist Brand may appear as a performer/featured artist/contributor context.
- A Contributor may use a stage name associated with an Artist Brand.
- Contributor participation does not prove public artist brand ownership.
- Artist Brand visibility does not prove contributor ownership.
- Artist Brand and Contributor relationships should be labelled as candidate unless explicitly governed.

Labels:

- artist-contributor relationship: `candidate`
- public credit relationship: `candidate`
- artist-as-contributor authority assumption: `authority_risk`
- contributor-as-owner/payee assumption: handled by Contributor read model

## 5. Artist Brand vs Workspace User

Workspace User is access/accountability actor.

Artist Brand is public creative identity.

Read-model rules:

- A workspace user may manage or create an Artist Brand record.
- A workspace user may be associated with an Artist Brand operationally.
- Workspace access does not prove artist brand ownership.
- Workspace user identity does not prove legal artist identity.
- Audit attribution and Artist Brand identity must remain separate.

Labels:

- workspace user relationship: `candidate`
- created-by/audit context: `protected` operational context
- user-as-artist-owner assumption: `authority_risk`

## 6. Artist Brand vs Rights Interest

Rights Interest is ownership/control/administration authority.

Artist Brand is public creative identity.

Read-model rules:

- Artist Brand does not automatically hold rights.
- Artist Brand display on a Work, Master, or Release does not prove ownership.
- Artist Brand may help identify public presentation for a rights review, but Rights Interest must carry authority.
- Artist metadata about rights/publishing should be labelled candidate or authority risk until governed.

Labels:

- rights/publishing posture in artist metadata: `candidate`, `authority_risk`
- artist-as-rights-holder assumption: `authority_risk`
- verified rights authority: future Rights Interest label, not Artist Brand label

## 7. Artist Brand vs Registration Authority

Registration Authority governs identifiers, external-body references, claims, submissions, evidence, disputes, and amendments.

Artist Brand is public presentation.

Read-model rules:

- Artist Brand may appear in registration materials.
- Artist Brand name does not prove registrant, claimant, IPI/CAE identity, publisher, or society membership.
- Registration Authority must consume verified Party/Rights/Work/Master/Evidence context, not artist visibility alone.
- PRO/society/IPI/publisher fields on artist profile metadata are candidate posture until governed.

Labels:

- artist registration identity assumption: `candidate`, `authority_risk`
- PRO/society/IPI metadata: `candidate`, `deferred`
- registration authority: `deferred`

## 8. Artist Brand vs Royalty Authority

Royalty Authority governs entitlement, allocation, statements, ledger, payout, settlement, and payee context.

Artist Brand is public identity.

Read-model rules:

- Artist Brand visibility does not prove royalty entitlement.
- Artist Brand does not prove payee authority.
- Artist Brand does not prove master-side or publishing-side entitlement.
- A public artist may receive royalties only where future Rights Interest, Party/payee, contract/mandate, and Royalty Authority support that result.

Labels:

- artist-as-payee assumption: `authority_risk`
- artist-as-royalty-recipient assumption: `authority_risk`
- payee authority: `deferred`
- royalty authority: `deferred`

## 9. Artist Brand vs Work

Work is composition/song identity.

Artist Brand is public creative identity.

Read-model rules:

- A Work may exist without Artist Brand.
- An Artist Brand may be associated with one or many Works.
- Artist Brand association may support catalogue presentation.
- Artist Brand association does not prove Work ownership, composition authorship, publishing ownership, or registration authority.

Labels:

- artist-work presentation link: `candidate`
- public catalogue display: `candidate` until public projection approved
- artist-as-work-owner assumption: `authority_risk`

## 10. Artist Brand vs Master

Master / Recording is sound recording identity.

Artist Brand is public creative identity.

Read-model rules:

- A Master may be publicly presented under one or more Artist Brands.
- Artist Brand visibility on a recording does not prove master ownership.
- Artist Brand visibility does not prove ISRC authority.
- Artist Brand visibility does not prove performer/neighboring-rights entitlement.
- Master ownership and master-side rights require Master / Recording and Rights Interest authority.

Labels:

- artist-master presentation link: `candidate`
- artist-as-master-owner assumption: `authority_risk`
- master royalty assumption: `authority_risk`
- ISRC authority: `deferred`

## 11. Artist Brand Read-Model Label Classification

### Protected

Label as `protected`:

- artist identity
- artist branding
- artist profile
- stage/performing name
- artist type
- artist lifecycle status
- public artist presentation where approved internally
- artist aliases
- artist genre references
- artist social links where approved internally
- workspace scope
- artist audit context

Meaning:

- safe Artist Brand truth
- useful public-facing creative identity seed
- not legal/rights/payment authority

### Candidate

Label as `candidate`:

- future Party links
- future contributor links
- future Work presentation links
- future Master presentation links
- public credit links
- public projection fields
- artist-to-CRM relationship where not authority-reviewed

Meaning:

- useful relationship or projection review input
- not verified legal or rights authority

### Transitional

Label as `transitional`:

- artist-linked ownership assumptions
- artist profile rights/publishing posture metadata
- artist profile business readiness metadata
- artist operational readiness scores/placeholders
- label/publisher/society descriptors in artist capture fields

Meaning:

- useful current capture context
- not final doctrine authority

### Deferred

Label as `deferred`:

- rights authority
- royalty authority
- registration authority
- legal identity authority
- payee authority
- publishing authority
- master ownership authority
- label/distributor authority

Meaning:

- requires future Party, Rights Interest, Registration, Master, Release, Distribution, or Royalty Authority design

### Non-Authoritative

Label as `non_authoritative`:

- internal notes
- unverified artist metadata
- free-text label/publisher/management fields
- public/private posture before approval
- imported or inferred artist hints

Meaning:

- useful context
- must not drive ownership, payment, registration, rights, or public authority

### Authority Risk

Label as `authority_risk`:

- artist = owner
- artist = rights holder
- artist = payee
- artist = publisher
- artist = label
- artist = legal entity
- artist = registrant
- artist = master owner
- artist = royalty recipient

Meaning:

- requires warning, review, or downstream block before authority use

## 12. Chronicle Artist Brand Interpretation

Chronicle conceptual test case:

- Chronicle Music may be a CRM Contact and future Party.
- M-Wis may be an Artist Brand.
- Huey D may be an Artist Brand.
- One real person may control Chronicle Music, M-Wis, and Huey D.
- Those identities must not be collapsed into one platform identity.

Read-model rules:

- Chronicle Music is not an Artist Brand by default.
- M-Wis and Huey D are Artist Brands.
- M-Wis/Huey D visibility does not prove Work ownership.
- M-Wis/Huey D visibility does not prove Master ownership.
- M-Wis/Huey D visibility does not prove payee authority.
- M-Wis/Huey D visibility does not prove registration authority.
- Chronicle Music may act as label, publisher, owner, administrator, or operator only where future authority records support that role.

Do not create Chronicle-specific logic.

## 13. Safe Surfacing Rules

Safe internal surfacing:

- artist/stage name
- artist type
- genre
- lifecycle/onboarding status
- aliases
- social links where captured for workspace use
- profile image placeholder/reference
- linked CRM contact indicator

Internal but caution-labelled:

- legal name
- PRO/society
- IPI number
- publisher
- copyright status
- ownership status
- split agreement status
- contract status
- banking/tax/business readiness metadata
- management/label affiliation

Hidden/private by default:

- legal name where not public-approved
- banking details
- tax identifiers
- contracts
- IDs/KYC
- evidence
- payment notes
- private contact details
- internal notes

Public-safe only after approval:

- stage/artist name
- public bio
- public image
- genre
- approved social links
- approved website
- approved public catalogue/release artist display

Not public-safe by default:

- legal identity
- rights/publishing posture
- ownership status
- split status
- payee status
- banking/tax/contract/evidence data

## 14. Risks Prevented

This read-model prevents:

- treating Artist Brand as legal identity
- treating Artist Brand as owner
- treating Artist Brand as rights holder
- treating Artist Brand as payee
- treating Artist Brand as publisher
- treating Artist Brand as label/distributor
- treating Artist Brand as registration authority
- exposing private artist/CRM/business metadata publicly
- collapsing Chronicle Music, M-Wis, and Huey D into one identity
- hardcoding Chronicle-specific identity logic
- creating rights or royalty authority from public artist visibility

## 15. Suggested Artist Brand Read-Model Fields

Suggested fields for future design only:

- `artist_profile_id`
- `workspace_id`
- `crm_contact_id`
- `artist_display_name`
- `stage_name`
- `artist_type`
- `genre`
- `lifecycle_status`
- `artist_brand_label`
- `crm_link_label`
- `party_candidate_label`
- `contributor_mapping_label`
- `work_presentation_label`
- `master_presentation_label`
- `rights_authority_label`
- `registration_authority_label`
- `royalty_authority_label`
- `public_projection_label`
- `privacy_label`
- `authority_warnings`

Example labels:

- `artist_brand_seed`
- `public_creative_identity`
- `crm_linked`
- `party_candidate`
- `not_legal_authority`
- `not_rights_authority`
- `not_payee_authority`
- `public_projection_candidate`
- `private_business_metadata`

## 16. Future Gates

Implementation remains paused for:

- Artist Brand read-model code
- artist schema changes
- artist route/service refactors
- Party implementation
- Rights Interest implementation
- payee implementation
- registration identity implementation
- royalty authority implementation
- public artist projection
- Chronicle-specific artist logic

Before any implementation:

- approve this read-model design
- list affected artist/CRM/contributor/work/release routes and services
- define exact field mapping
- define public/private rules
- define authority warning rules
- define tests/checks
- define rollback/recovery if runtime behavior changes

## 17. Recommended Next Read-Model Slice

Recommended next slice:

```text
Rights Interest Seed Read Model V1
```

Purpose:

- interpret `rights_assets` and `rights_ownership_claims` as current rights authority seeds
- distinguish rights claims from verified Rights Interest
- prevent contributor splits, artist visibility, and CRM contacts from being treated as ownership authority

