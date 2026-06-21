# Sentry Sound Contributor Participation Read Model V1

Date: 2026-06-05

Status: design and contributor participation read-model interpretation only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

Contributors represent participation.

They do not automatically represent ownership, publishing authority, registration authority, royalty authority, legal identity authority, payee authority, or Rights Interest.

The existing contributor foundation is valuable and should remain protected. `contributors`, `work_contributors`, and future/related `recording_contributors` are useful participation and readiness-capture seeds. They help Sentry Sound understand who was involved in a Work or Master context, but they must not be promoted silently into legal or financial authority.

Immediate lock:

- contributor participation is protected as participation truth
- contributor role is protected as captured role context
- contributor-work relationship is protected as participation relationship
- contributor percentages/splits are transitional unless verified by future Rights Interest authority
- contributor participation does not automatically create Rights Interest
- contributor participation does not automatically create royalty entitlement
- contributor participation does not automatically create registration authority

## 2. What Is A Contributor?

A Contributor is a creative or operational participant connected to a Work, Master / Recording, Release, registration, or royalty-relevant context.

Examples:

- composer
- lyricist
- author
- producer
- performer
- featured artist
- session musician
- vocalist
- arranger
- engineer
- mastering engineer
- publisher role holder
- record label role holder
- master owner role holder

Current active seeds:

- `contributors`
- `work_contributors`
- `recording_contributors`

Contributor records are useful because free-text names are not enough for reliable catalogue, registration, readiness, credit, evidence, and future royalty workflows.

## 3. What Is Participation?

Participation is the fact that a person, entity, brand, company, or role-holder is involved in a Work or Master context.

Participation can describe:

- creative contribution
- performance contribution
- production contribution
- technical contribution
- administrative role capture
- publisher/label role capture
- registration-preparation role capture
- readiness or evidence workflow context

Participation does not by itself prove:

- copyright ownership
- publishing ownership
- master ownership
- administration authority
- payee authority
- registration authority
- royalty entitlement
- legal identity

Read-model rule:

Participation may inform authority review. It is not authority by default.

## 4. Contributor vs Party

Party is legal/commercial identity.

Contributor is participant identity.

Read-model rules:

- A Contributor may later link to a Party.
- A Contributor may represent a person/entity before the legal Party relationship is governed.
- Contributor name, stage name, role, or split does not prove legal identity.
- Contributor contact/payment/tax/legal data should not be inferred from contributor participation.
- CRM Contact remains the closest active Party seed, not Contributor.

Labels:

- contributor identity: `protected`, `participation_capture`
- possible Party mapping: `candidate`
- legal identity authority: `deferred`
- unreviewed contributor-as-Party assumption: `authority_risk`

## 5. Contributor vs Artist Brand

Artist Brand is public-facing creative identity.

Contributor is participation identity.

Read-model rules:

- An Artist Brand may appear as a contributor or performer context.
- A Contributor may have a stage/artist name.
- Artist Brand visibility does not prove contributor ownership.
- Contributor participation does not prove public artist brand authority.
- Artist Brand and Contributor may need relationship review before public/API use.

Labels:

- captured artist/performer participation: `protected`
- artist-linked ownership assumption: `candidate`, `authority_risk`
- public artist display: `candidate` until approved public projection

## 6. Contributor vs Rights Interest

Rights Interest is ownership/control/administration authority.

Contributor is participation/readiness capture.

Read-model rules:

- A contributor is not automatically a rights owner.
- A contributor split is not final Rights Interest.
- Composer/lyricist/publisher/master-owner roles may indicate candidate rights review needs.
- Rights Interest must eventually carry ownership/control/admin authority.
- Contributor data can help prepare Rights Interest review but should not replace it.

Labels:

- contributor participation: `protected`
- ownership assumption: `candidate`
- split-derived ownership: `transitional`, `authority_risk`
- verified Rights Interest: future `verified`, not current contributor truth

## 7. Contributor vs Royalty Authority

Royalty Authority is downstream financial entitlement and allocation authority.

Contributor is participation capture.

Read-model rules:

- Contributor participation is not automatically royalty entitlement.
- Contributor percentage is not automatically royalty percentage.
- Current royalty calculations that derive from `work_contributors` should be labelled `transitional`.
- Contributor balances or payout candidates should not be treated as final entitlement without future Rights Interest and Party/payee authority.
- A contributor may receive royalties only where future Rights Interest, contract, mandate, payee, and royalty authority support that result.

Labels:

- contributor percentage: `transitional`, `authority_risk`
- royalty assumption: `candidate`, `authority_risk`
- current royalty-engine use of contributor split: `transitional`
- payee authority: `deferred`

## 8. Contributor vs Registration Authority

Registration Authority governs submissions, identifiers, external-body references, evidence, amendments, disputes, and readiness.

Contributor is registration input, not registration authority.

Read-model rules:

- Contributor capture may be required for registration readiness.
- Contributor roles may support SAMRO/CAPASSO/SAMPRA-style preparation.
- Missing contributors may block or warn registration workflows.
- Contributor existence does not prove registrant, claimant, publisher, society identity, IPI/CAE identity, or ownership.
- Registration consumes contributor context; it does not make contributor participation legal ownership by itself.

Labels:

- registration-prep contributor data: `candidate`
- IPI/CAE/registrant assumptions: `deferred`, `authority_risk`
- unverified registration contributor role: `non_authoritative`

## 9. Contributor vs Work

Work is composition/song identity.

Contributor is participation relationship to Work.

Read-model rules:

- A Work may exist with zero contributors.
- A Contributor may link to one or many Works.
- `work_contributors` captures participation relationship.
- Contributor count can be surfaced as participation-capture status.
- Incomplete contributor capture does not invalidate Work Foundation Truth.

Labels:

- contributor-work relationship: `protected`
- missing contributors: `unknown` or `blocked` only for downstream workflows, not Work existence
- split values: `transitional`, `non_authoritative`

## 10. Contributor vs Master / Recording

Master / Recording is sound recording identity.

Contributor may participate in Master / Recording context.

Read-model rules:

- A performer, producer, engineer, label, or master-owner role may belong to recording/master context rather than Work context.
- `recording_contributors` is a future/related seed for Master participation.
- Master-side participation does not prove master ownership.
- Master-side participation does not prove neighboring-rights entitlement or royalty entitlement without future authority.

Labels:

- recording participation: `candidate`
- master ownership assumption: `authority_risk`
- master royalty assumption: `authority_risk`
- recording contributor linkage: `transitional` until Master / Recording authority is active

## 11. Contributor Read-Model Label Classification

### Protected

Label as `protected`:

- contributor participation
- contributor role
- contributor-work relationship
- contributor record identity
- workspace scope
- creation/audit context where available

Meaning:

- safe participation/readiness truth
- useful operational capture
- not legal/rights/royalty authority

### Candidate

Label as `candidate`:

- ownership assumptions
- royalty assumptions
- Party mapping assumptions
- Artist Brand relationship assumptions
- registration participant assumptions
- publisher/label/master-owner role review

Meaning:

- useful review signal
- may inform future authority workflow
- not verified authority

### Transitional

Label as `transitional`:

- split-derived authority assumptions
- current contributor percentages
- current contributor-derived royalty calculation inputs
- contributor rows used as readiness substitutes
- master/recording contributor links before Master authority is active

Meaning:

- useful current-state bridge
- not final doctrine authority
- must remain available but carefully labelled

### Deferred

Label as `deferred`:

- legal identity authority
- rights authority
- payee authority
- registration claimant/registrant authority
- IPI/CAE authority
- publishing administration authority
- master ownership authority

Meaning:

- requires future Party, Rights Interest, Registration, Master, or Royalty Authority design

### Non-Authoritative

Label as `non_authoritative`:

- free-text contributor names
- unverified stage names
- notes
- imported workbook hints
- unverified split percentages
- unverified publisher/master-owner roles

Meaning:

- useful context, not authority

### Authority Risk

Label as `authority_risk`:

- contributor percentage treated as ownership
- contributor percentage treated as royalty entitlement
- contributor percentage treated as registration authority
- contributor role treated as legal identity
- artist contributor treated as owner/payee
- publisher/master-owner role treated as verified rights authority

Meaning:

- requires warning, review, or downstream block before authority use

## 12. Chronicle Contributor Rules

Chronicle examples:

- M-Wis may be contributor.
- Huey D may be contributor.
- M-Wis and Huey D may also be Artist Brands.
- Chronicle Music may be a company/reference tenant/operator, not an artist by default.

Read-model rules:

- Contributor participation does not automatically create Rights Interest.
- Contributor participation does not automatically create royalty entitlement.
- Contributor participation does not automatically create registration authority.
- Contributor participation does not automatically create Party identity authority.
- Contributor participation does not automatically create public artist brand authority.

Chronicle deferred import rule:

- Chronicle contributors were not imported in the foundation-only Work import.
- Chronicle ownership splits were not imported.
- Chronicle contributor/split fields remain deferred intake context.
- Future Chronicle contributor import must use controlled review and must not become rights/royalty authority by default.

## 13. Safe Surfacing Rules

Safe internal surfacing:

- contributor display name
- contributor role
- contributor-work relationship
- contributor count
- participation capture status
- split capture status as incomplete/review/candidate only

Internal but caution-labelled:

- percentages/splits
- publisher/master-owner roles
- featured artist/artist role assumptions
- imported contributor hints
- registration-prep role assumptions

Hidden/private by default:

- contact details
- payment/payee details
- legal/tax/banking data
- contracts
- evidence
- disputes
- internal notes
- private contributor identity fields

Public-safe only after approval:

- public credit name
- public role/credit
- public artist brand relationship

Not public-safe by default:

- splits
- ownership assumptions
- payee assumptions
- rights/registration status
- contributor private data

## 14. Risks Prevented

This read-model prevents:

- treating contributor participation as ownership
- treating contributor percentage as rights split
- treating contributor percentage as royalty entitlement
- treating contributor role as legal identity
- treating artist contributor visibility as ownership
- treating publisher/master-owner capture as verified authority
- treating contributor data as public-safe by default
- treating Chronicle contributor hints as imported authority
- rewriting contributor structures before Party/Rights/Royalty doctrine is implemented

## 15. Suggested Contributor Participation Read-Model Fields

Suggested fields for future design only:

- `contributor_id`
- `workspace_id`
- `display_name`
- `role`
- `work_id`
- `work_title`
- `relationship_label`
- `participation_label`
- `party_mapping_label`
- `artist_brand_mapping_label`
- `rights_authority_label`
- `registration_authority_label`
- `royalty_authority_label`
- `master_participation_label`
- `public_credit_label`
- `authority_warnings`

Example labels:

- `participation_capture`
- `work_participant`
- `party_mapping_candidate`
- `artist_brand_mapping_candidate`
- `rights_authority_not_established`
- `registration_authority_not_established`
- `royalty_authority_not_established`
- `split_transitional`
- `public_credit_not_approved`

## 16. Future Gates

Implementation remains paused for:

- contributor read-model code
- API changes
- UI changes
- schema changes
- contributor migrations
- Party implementation
- Rights Interest implementation
- Royalty Authority implementation
- Registration Authority implementation
- public contributor credits
- Chronicle contributor import

Before any implementation:

- approve this read-model design
- list affected tables/routes/services/UI surfaces
- define exact field mapping
- define private/public rules
- define split/percentage warning rules
- define tests/checks
- define rollback/recovery if runtime behavior changes

## 17. Recommended Next Read-Model Slice

Recommended next slice:

```text
Party / CRM Identity Read Model V1
```

Purpose:

- interpret `crm_contacts` as the closest current Party seed
- distinguish CRM Contact, Party, Contributor, Artist Brand, Workspace User, payee, and legal/commercial authority
- prepare future Party alignment without creating Party schema yet

