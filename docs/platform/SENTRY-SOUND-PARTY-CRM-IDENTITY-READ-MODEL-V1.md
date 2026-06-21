# Sentry Sound Party / CRM Identity Read Model V1

Date: 2026-06-05

Status: design and Party / CRM identity read-model interpretation only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

`crm_contacts` is the closest current Party seed.

Today, CRM Contact should be interpreted as operational identity/contact foundation. It is workspace-scoped, reusable, auditable, and already useful across artists, labels, publishers, clients, vendors, contracts, releases, and finance.

CRM Contact is not yet full canonical Party authority.

It must not automatically be read as:

- rights holder
- payee
- owner
- publisher
- label
- distributor
- society
- legal signing authority
- registration authority

This read-model defines how Party / CRM / Identity information should be interpreted safely before a canonical Party implementation exists.

## 2. What Is A CRM Contact Today?

A CRM Contact is an operational contact, relationship, and identity foundation record.

Current active seed:

```text
crm_contacts
```

Related current structures:

- `crm_contact_emails`
- `crm_contact_phones`
- `crm_contact_relationships`
- `crm_contact_notes`
- `crm_contact_audit_events`
- `artist_profiles`
- `contract_parties`
- rights and contract references where linked

CRM Contact can capture:

- display name
- contact type
- person/company/organization style identity
- communication channels
- relationship context
- operational lifecycle
- notes
- audit events
- workspace scope

CRM Contact is a strong identity seed. It is not complete legal/commercial authority by default.

## 3. What Is A Party Under Future Doctrine?

Party is the future legal/commercial identity layer.

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
- manager
- estate
- trust
- collective
- studio
- platform partner

Party answers questions such as:

- who owns or controls rights?
- who signed a contract?
- who is the publisher?
- who is the payee?
- who is the registrant?
- who has administration authority?
- who is the distributor or society?

Future Party authority may reuse `crm_contacts`, extend it, or link from it. This document does not choose implementation. It defines safe interpretation now.

## 4. CRM Contact vs Party

CRM Contact is the operational/contact foundation.

Party is legal/commercial authority.

Read-model rules:

- A CRM Contact may be a future Party candidate.
- A CRM Contact may represent a person, company, or organization operationally.
- A CRM Contact by itself does not prove legal authority.
- A CRM Contact by itself does not prove rights ownership.
- A CRM Contact by itself does not prove payee authority.
- Contact channels and notes must not become authority.

Labels:

- contact record: `protected`
- future Party possibility: `candidate`
- legal/commercial authority: `deferred`
- contact-as-owner/payee/signatory assumption: `authority_risk`

## 5. CRM Contact vs Contributor

Contributor is participation identity.

CRM Contact is contact/identity foundation.

Read-model rules:

- A Contributor may later link to a CRM Contact / Party candidate.
- A CRM Contact may represent the same real person or company as a Contributor.
- Contributor participation does not prove CRM Contact legal identity.
- CRM Contact details do not prove contributor participation.
- Do not collapse Contributor and CRM Contact without review.

Labels:

- possible Contributor-to-CRM mapping: `candidate`
- contributor participation: belongs to Contributor read model
- legal identity authority: `deferred`
- contributor-as-contact or contact-as-contributor assumption: `authority_risk`

## 6. CRM Contact vs Artist Brand

Artist Brand is public-facing creative identity.

CRM Contact is operational/contact identity.

Read-model rules:

- An Artist Brand may link to a CRM Contact.
- A CRM Contact may represent a person/company behind an Artist Brand.
- An Artist Brand is not automatically a legal person/company.
- A CRM Contact is not automatically the public artist brand.
- Public artist data must remain separate from private CRM/contact/legal data.

Labels:

- artist-to-contact link: `candidate` or `protected` where explicitly stored
- public artist brand identity: Artist Brand read model
- private contact/legal data: `private`
- artist-as-owner/payee assumption: `authority_risk`

## 7. CRM Contact vs Workspace User

Workspace User is access/accountability actor.

CRM Contact is operational/contact identity.

Read-model rules:

- A workspace user may correspond to a CRM Contact, but they are not the same concept.
- Workspace User controls app access and audit attribution.
- CRM Contact stores relationship/contact identity.
- Workspace ownership or membership does not prove copyright ownership.
- A creator/audit actor is not automatically the Work owner, payee, or legal Party.

Labels:

- workspace access: Workspace read model
- possible user-contact mapping: `candidate`
- audit actor: `protected` operational context
- owner/payee/signatory assumption from user access: `authority_risk`

## 8. CRM Contact vs Payee

Payee is payment recipient authority.

CRM Contact is not payee authority by default.

Read-model rules:

- A CRM Contact may become a payee candidate.
- Payment terms, payout eligibility, tax/banking details, holds, disputes, and settlement readiness require future authority.
- Contact email/phone/display name must not create payment authority.
- Royalty payee authority should ultimately consume Party/Rights/Royalty Authority.

Labels:

- payee candidate: `candidate`
- payment authority: `deferred`
- contact-as-payee assumption: `authority_risk`
- banking/tax/payment details: `private`

## 9. CRM Contact vs Rights Holder

Rights Holder is a Party/Rights Interest role.

CRM Contact is not rights holder authority by default.

Read-model rules:

- A CRM Contact may be linked to rights claims.
- A rights claim involving a CRM Contact is a candidate authority record until verified.
- Rights ownership/control/admin authority belongs in Rights Interest, not CRM Contact alone.
- CRM Contact type such as company, publisher, label, or organization does not prove rights ownership.

Labels:

- future rights-holder candidate: `candidate`
- rights claim link: `candidate`, `authority_risk` until verified
- verified rights holder: future Rights Interest label, not CRM Contact label alone
- contact-as-owner assumption: `authority_risk`

## 10. CRM Contact vs Contract Party

Contract Party is a role in a contract record.

CRM Contact can be linked as a contract party, but that link still needs contract context.

Read-model rules:

- Contract party links are operational/legal relationship candidates.
- A CRM Contact appearing in a contract does not prove all authority outside that contract.
- Contract status, effective dates, territory, scope, obligations, and rights links matter.
- Contract terms may support authority, but CRM Contact alone does not.

Labels:

- contract party link: `transitional` or `candidate` until contract authority is reviewed
- signed/active contract authority: future contract/Rights Interest governance
- contact-as-legal-signatory assumption: `authority_risk`

## 11. CRM Contact vs Registration Identity

Registration Identity is claimant, registrant, society, external-body, IPI/CAE, publisher, composer, or registration-facing identity.

CRM Contact may support registration identity but does not prove it.

Read-model rules:

- A CRM Contact may be a registrant or claimant candidate.
- Registration identity requires governed identifier/evidence/authority context.
- IPI/CAE, society references, SAMRO/CAPASSO references, and external-body identity should not be inferred from CRM Contact alone.
- CRM Contact may help prepare registration, but Registration Authority consumes verified identity.

Labels:

- registration identity candidate: `candidate`
- registration authority: `deferred`
- contact-as-registrant/claimant assumption: `authority_risk`

## 12. CRM / Identity Read-Model Label Classification

### Protected

Label as `protected`:

- contact identity
- display name
- contact type
- contact channels
- workspace scope
- operational contact record
- CRM lifecycle status
- contact relationship/notes existence
- CRM audit context

Meaning:

- safe operational contact truth
- useful workspace-scoped identity/contact foundation
- not legal/rights/payment authority

### Candidate

Label as `candidate`:

- future Party candidate
- future payee candidate
- future rights-holder candidate
- future contract party candidate
- future registration identity candidate
- Contributor-to-CRM mapping
- Artist Brand-to-CRM mapping
- distributor/publisher/label/society role candidate

Meaning:

- useful authority review input
- may later support Party implementation
- not verified authority by existence alone

### Transitional

Label as `transitional`:

- current use in contracts/rights links where Party is not formalized
- CRM-as-identity bridge in artist creation
- CRM-linked operational relationship records that approximate Party relationships

Meaning:

- useful current bridge
- should remain available
- not final canonical Party authority

### Deferred

Label as `deferred`:

- legal authority
- payee authority
- rights authority
- registration authority
- signing authority
- tax/banking authority
- society/distributor/publisher authority

Meaning:

- requires future Party/Rights/Contract/Registration/Royalty governance

### Non-Authoritative

Label as `non_authoritative`:

- free-text notes
- contact labels
- relationship notes
- communication details
- unverified company/role descriptions
- imported/contact hints

Meaning:

- useful context
- must not drive ownership, payment, registration, or legal authority

### Authority Risk

Label as `authority_risk`:

- CRM contact treated as ownership authority
- CRM contact treated as payee authority
- CRM contact treated as legal signing authority without verification
- CRM contact treated as registration claimant without governed evidence
- CRM contact treated as publisher/label/distributor/society authority by label alone
- Workspace User identity treated as CRM/Party/legal authority automatically

Meaning:

- requires warning, review, or downstream block before authority use

## 13. Chronicle CRM / Party Interpretation

Chronicle examples:

- Chronicle Music may be a CRM Contact.
- Chronicle Music may be a future Party.
- Chronicle Music may act as business operator, publisher, label, catalogue owner, or rights administrator only where future authority records support that role.
- M-Wis and Huey D may link to CRM Contacts but remain Artist Brands.
- One real person may control Chronicle Music, M-Wis, and Huey D without collapsing them into one identity.

Read-model rules:

- CRM/contact records do not automatically prove ownership.
- CRM/contact records do not automatically prove mandate.
- CRM/contact records do not automatically prove payee rights.
- Chronicle Music must not be hardcoded as a platform Party.
- M-Wis and Huey D must not be treated as companies by default.
- Artist Brand, Contributor, CRM Contact, Workspace User, and future Party must remain distinguishable.

## 14. Safe Surfacing Rules

Safe internal surfacing:

- display name
- contact type
- lifecycle status
- workspace scope
- contact channels where user has permission
- relationship labels
- linked artist profile indicator
- linked contract/rights candidate indicator

Internal but caution-labelled:

- company/publisher/label/distributor/society descriptors
- contract party links
- rights-holder candidates
- payee candidates
- registration identity candidates
- Contributor/Artist Brand mappings

Hidden/private by default:

- private contact details where not permissioned
- notes
- KYC/tax/banking details
- contracts
- payment details
- disputes
- internal legal/rights notes
- registration identity evidence

Public-safe only after approval:

- public display name
- public business/artist-facing name
- public website/social/contact channel explicitly approved

Not public-safe by default:

- emails
- phone numbers
- private notes
- legal/tax/banking/payment data
- rights/payee/registration assumptions
- contract participation

## 15. Risks Prevented

This read-model prevents:

- treating CRM Contact as full Party authority too early
- treating CRM Contact as ownership authority
- treating CRM Contact as payee authority
- treating CRM Contact as legal signing authority without verification
- treating workspace user identity as rights ownership
- collapsing CRM Contact, Contributor, Artist Brand, Workspace User, and future Party
- exposing private contact information in public/Chronicle outputs
- hardcoding Chronicle-specific identity logic
- creating Party schema before interpreting existing seeds

## 16. Suggested Party / CRM Identity Read-Model Fields

Suggested fields for future design only:

- `crm_contact_id`
- `workspace_id`
- `display_name`
- `contact_type`
- `lifecycle_status`
- `contact_scope_label`
- `party_candidate_label`
- `contributor_mapping_label`
- `artist_brand_mapping_label`
- `workspace_user_mapping_label`
- `payee_candidate_label`
- `rights_holder_candidate_label`
- `contract_party_candidate_label`
- `registration_identity_candidate_label`
- `public_projection_label`
- `privacy_label`
- `authority_warnings`

Example labels:

- `operational_contact_foundation`
- `party_candidate`
- `not_legal_authority`
- `not_payee_authority`
- `not_rights_authority`
- `contract_party_candidate`
- `registration_identity_candidate`
- `private_contact_data`
- `public_projection_not_approved`

## 17. Future Gates

Implementation remains paused for:

- Party schema
- Party migrations
- CRM schema changes
- CRM-to-Party migration
- payee implementation
- rights-holder implementation
- contract authority implementation
- registration identity implementation
- public CRM/contact projection
- Chronicle-specific identity logic

Before any implementation:

- approve this read-model design
- list affected CRM/artist/contributor/contract/rights routes and services
- define exact field mapping
- define private/public rules
- define authority warning rules
- define tests/checks
- define rollback/recovery if runtime behavior changes

## 18. Recommended Next Read-Model Slice

Recommended next slice:

```text
Artist Brand Read Model V1
```

Purpose:

- interpret `artist_profiles` as the public-facing Artist Brand seed
- distinguish Artist Brand from CRM Contact, Party, Contributor, Workspace User, Rights Holder, and Payee
- prepare public-safe artist/catalogue interpretation without making Artist Brand legal authority

