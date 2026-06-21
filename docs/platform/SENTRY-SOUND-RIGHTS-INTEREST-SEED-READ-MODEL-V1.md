# Sentry Sound Rights Interest Seed Read Model V1

Date: 2026-06-05

Status: design and Rights Interest seed read-model interpretation only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

Rights Interest is the future canonical authority layer for ownership, control, administration, licensing, collection mandates, distribution authority, and royalty entitlement context.

The current platform already has important Rights Interest seeds:

```text
rights_assets
rights_ownership_claims
rights_lifecycle_events
rights_audit_events
```

These structures are directionally aligned with doctrine, but they must be interpreted carefully. A current rights record is a rights authority seed, not automatically final canonical Rights Interest truth.

Immediate lock:

- `rights_assets` can be read as protected rights-asset seed records.
- `rights_ownership_claims` can be read as candidate rights-interest claims.
- Lifecycle and audit records can be read as protected operational posture and trace history.
- Verification status, where present, is protected as captured status, but it does not automatically make the entire future authority model complete.
- Contributor splits, artist visibility, CRM contact existence, contract existence, workspace access, workbook notes, ISRC, ISWC, master owner fields, and publishing owner fields must not be treated as final rights authority during this read-model phase.

## 2. Rights-Interest Seed Candidates Identified

Current direct seed candidates:

- `rights_assets`
- `rights_ownership_claims`
- `rights_lifecycle_events`
- `rights_audit_events`

Current supporting seed candidates:

- `contracts`
- `contract_parties`
- `contract_rights_links`
- `contract_obligations`
- `contract_audit_events`

Current identity and participation seeds that may support future rights review:

- `crm_contacts`
- `contributors`
- `work_contributors`
- `artist_profiles`
- `recording_contributors`

Current asset and evidence seeds that may support future rights review:

- `musical_works`
- current recording/master-related slices where present
- File Vault records
- evidence/readiness/submission records where present

Current service-layer seeds:

- `src/lib/rights-lifecycle/createRightsAsset.ts`
- `src/lib/rights-lifecycle/createRightsOwnershipClaim.ts`
- `src/lib/rights-lifecycle/updateRightsAssetLifecycle.ts`
- `src/lib/rights-lifecycle/validateRightsOwnershipTotals.ts`

Read-model recommendation:

- Promote `rights_assets` as the protected rights-asset seed.
- Promote `rights_ownership_claims` as candidate Rights Interest claim records.
- Protect lifecycle/audit history as operational trace.
- Treat contracts, CRM, contributors, artist profiles, works, recordings, and evidence as supporting context until explicit authority rules are approved.

## 3. What Is A Rights Interest Seed?

A Rights Interest Seed is an existing record or relationship that may support future canonical Rights Interest authority.

It may describe:

- who claims ownership
- who claims administration rights
- who claims control
- who claims a collection mandate
- what asset the claim relates to
- what territory or effective period applies
- what lifecycle state the claim is in
- what audit trail exists
- what contract or evidence may support the claim

A seed is not the same as final authority.

Read-model rule:

- Seed existence is protected as a current platform fact.
- Seed authority remains candidate, transitional, or verified only according to its current evidence, lifecycle, and verification posture.
- Final downstream authority for registration, release, distribution, and royalties remains deferred until approved canonical rules exist.

## 4. Protected Rights Truth

The following can be interpreted as protected current rights truth:

- rights asset record identity
- rights ownership claim record identity
- workspace scope
- related asset reference as captured
- claim holder reference as captured
- claim category/type as captured
- claim percentage/share as captured claim data
- territory context as captured
- effective date context as captured
- lifecycle status as captured
- verification status as captured
- audit event existence
- contract-rights link existence as captured relationship context
- validation output as captured readiness/control signal

Protected does not mean final legal authority.

Protected means:

- the record exists in the backend
- the backend is the source of truth for that record
- the record should not be overwritten by spreadsheet or UI assumptions
- the record should be surfaced with correct authority labels

## 5. What Is Not Protected Final Authority

The following must not be treated as final Rights Interest authority:

- unverified ownership claims
- contributor split percentages
- contributor participation
- artist profile visibility
- CRM contact existence
- workspace user access
- contract existence without scoped interpretation
- contract party existence without scoped interpretation
- workbook ownership notes
- workbook ownership split percentages
- workbook master owner fields
- workbook publishing owner fields
- ISRC
- ISWC
- release status
- distribution status
- royalty event activity
- payment or finance records

These may be useful review inputs. They are not final authority by themselves.

## 6. Rights Interest vs Party

Party is the legal/commercial identity layer.

Rights Interest is the authority relationship between a Party candidate and an asset, mandate, territory, period, or entitlement context.

Current read-model rules:

- `crm_contacts` is the closest current Party seed.
- A CRM contact may be a candidate rights holder.
- A CRM contact does not prove rights ownership by existence.
- A future Party should become the durable legal/commercial anchor for verified Rights Interest.

Labels:

- CRM-linked rights holder: `candidate`
- verified Party authority: `deferred`
- contact-as-owner assumption: `authority_risk`

## 7. Rights Interest vs Contributor

Contributor is participation.

Rights Interest is ownership, control, administration, mandate, or entitlement authority.

Current read-model rules:

- A contributor may also be a rights holder, but only where a rights claim or future Rights Interest supports that.
- Contributor participation does not prove ownership.
- Contributor split percentages are not final rights authority.
- Contributor-linked rights claims should be surfaced as candidate or transitional until verified.

Labels:

- contributor-linked rights claim: `candidate`
- split-derived rights assumption: `transitional`, `authority_risk`
- contributor-as-owner assumption: `authority_risk`

## 8. Rights Interest vs Artist Brand

Artist Brand is public creative identity.

Rights Interest is legal/commercial authority.

Current read-model rules:

- Artist visibility does not prove ownership.
- Artist profile metadata does not prove payee, publisher, label, or rights-holder status.
- Artist Brand may help identify a review context, but it must not determine Rights Interest.

Labels:

- artist-linked rights hint: `candidate`
- artist-as-owner assumption: `authority_risk`
- artist-as-payee assumption: `authority_risk`

## 9. Rights Interest vs Work

Work is composition/song identity.

Rights Interest governs ownership/control/administration context around a Work or related assets.

Current read-model rules:

- A Work can exist without Rights Interest.
- A Work import does not create Rights Interest.
- Work title, workspace scope, and creation timestamps remain protected Work foundation truth.
- Composition ownership, publishing ownership, administration, mechanical, performance, and collection mandates should be represented by Rights Interest seeds only where actual rights records support them.

Labels:

- work identity: `protected`
- work-rights claim: `candidate`
- work-as-owned-by-artist assumption: `authority_risk`

## 10. Rights Interest vs Master / Recording

Master / Recording is sound recording identity.

Rights Interest governs master ownership, administration, distribution, licensing, neighboring-rights, and related authority.

Current read-model rules:

- A recording/master context does not prove master ownership.
- Audio files do not prove master ownership.
- ISRC does not prove master ownership.
- Master-side authority must be represented through Rights Interest seeds and future canonical Rights Interest rules.

Labels:

- master-rights claim: `candidate`
- ISRC-as-owner proof: `authority_risk`
- audio-file-as-master-owner proof: `authority_risk`

## 11. Rights Interest vs Contract

Contract records can support Rights Interest.

Contracts do not automatically create final platform authority unless their scope, parties, assets, dates, territory, obligations, and evidence are interpreted through approved rules.

Current read-model rules:

- A contract-rights link is supporting context.
- A contract party is not automatically a rights holder.
- A contract may support ownership, administration, collection, licensing, distribution, or royalty authority.
- Contract support should be labelled candidate until reviewed.

Labels:

- contract-supported rights claim: `candidate`
- contract link as relationship context: `protected`
- contract-as-global-owner proof: `authority_risk`

## 12. Rights Interest vs Registration

Registration consumes verified Rights Interest.

Registration does not create ownership.

Current read-model rules:

- ISWC, ISRC, IPI, society references, and distributor references are registration/identifier evidence.
- Identifiers do not prove ownership by themselves.
- Registration readiness should eventually depend on verified Rights Interest.

Labels:

- registration dependency on rights: `deferred`
- identifier as evidence: `candidate`
- identifier as ownership proof: `authority_risk`

## 13. Rights Interest vs Release

Release consumes verified Work, Master, Registration, Rights Interest, and readiness context.

Release does not create ownership.

Current read-model rules:

- Release status does not prove ownership.
- Release readiness should eventually consume Rights Interest authority.
- Commercial release metadata should not overwrite rights truth.

Labels:

- release-rights dependency: `deferred`
- release-as-owner proof: `authority_risk`

## 14. Rights Interest vs Distribution

Distribution consumes Release and Rights Interest truth.

Distribution does not create ownership.

Current read-model rules:

- Distributor acceptance is not proof of rights ownership.
- DSP references are not ownership authority.
- Distributor references are not ownership authority.
- Distribution rights should eventually be represented as a Rights Interest category or related authority context.

Labels:

- distribution rights claim: `candidate`
- distributor/DSP reference: `non_authoritative` for ownership
- distributor-as-owner proof: `authority_risk`

## 15. Rights Interest vs Royalty Authority

Royalty Authority consumes verified Rights Interest.

Royalty events are evidence of activity, not ownership authority.

Current read-model rules:

- Royalty entitlement is not automatically contributor participation.
- Royalty entitlement is not automatically artist visibility.
- Royalty entitlement is not automatically distributor payout.
- Current royalty calculations remain transitional until verified Rights Interest can govern allocation.

Labels:

- rights-derived royalty entitlement: `deferred`
- royalty split from current capture: `transitional`
- royalty event as ownership proof: `authority_risk`

## 16. Rights Interest Seed Label Classification

### Protected

- `rights_assets` record identity
- `rights_ownership_claims` record identity
- workspace scope
- captured claim holder reference
- captured asset reference
- captured lifecycle status
- captured verification status
- captured territory/effective-date context
- captured audit events
- captured contract-rights links

### Candidate

- ownership claims
- publishing ownership claims
- administration claims
- mechanical rights claims
- performance rights claims
- master ownership claims
- distribution rights claims
- licensing rights claims
- collection mandate claims
- territory-specific rights claims
- CRM-linked rights holder candidates
- contributor-linked rights holder candidates
- contract-supported rights candidates

### Transitional

- current rights lifecycle structures before canonical Rights Interest implementation
- ownership percentage validation as readiness/control signal
- contributor-linked royalty participant interpretation
- contract-to-rights links before formal Party/Rights Interest authority

### Deferred

- canonical Rights Interest implementation
- final Party-linked rights authority
- final payee authority
- final royalty authority
- registration enforcement based on verified Rights Interest
- release readiness enforcement based on verified Rights Interest
- distribution authorization based on verified Rights Interest
- rights-to-finance settlement authority

### Non-Authoritative

- free-text rights notes
- workbook ownership hints
- imported ownership split hints
- public artist metadata
- unverified contract summaries
- unverified evidence references
- ISRC/ISWC fields used as ownership proof

### Authority Risk

- treating contributor percentage as ownership
- treating contributor percentage as royalty entitlement
- treating artist brand as rights holder
- treating CRM contact as owner without verification
- treating workspace user as copyright owner
- treating contract existence as universal ownership
- treating ISRC, ISWC, society references, or distributor references as ownership authority
- treating release/distribution status as rights clearance
- treating royalty events as ownership proof

## 17. Chronicle Interpretation

Chronicle Music is a real-world company/reference tenant and business operator, not an artist and not hardcoded platform logic.

Chronicle read-model rules:

- Chronicle Music may be a future Party and rights-holder candidate where records support that.
- Chronicle Music may own a work only where Rights Interest supports ownership.
- Chronicle Music may administer a work without owning it where Rights Interest supports administration or collection mandate.
- M-Wis and Huey D may be Artist Brands and/or Contributors, but artist visibility does not prove ownership.
- A publisher may own or administer part of a work only where Rights Interest supports that.
- Imported Chronicle catalogue Works are valid foundation Works, not automatic rights records.
- Workbook `Ownership Split %`, `Master Owner`, `Publishing Owner`, `ISRC`, `ISWC`, and notes remain non-authoritative review inputs until governed by backend authority.

No Chronicle-specific platform logic should be created from this read model.

## 18. Safe Surfacing Rules

Internal-safe now:

- rights asset existence
- rights claim existence
- captured lifecycle status
- captured verification status
- captured territory and effective-date context
- captured audit trail existence
- captured contract-rights link existence
- candidate labels
- authority-risk warnings

Internal-private by default:

- contract text
- legal evidence files
- disputes
- private rights notes
- payee details
- payment/settlement details
- unapproved ownership percentages
- unresolved claims
- identity verification materials

Public-safe by default:

- no Rights Interest detail is public-safe by default.

Public Rights Interest surfacing should require a future approved public projection that separates catalogue presentation from legal/commercial authority.

## 19. Suggested Future Read-Model Fields

Future implementation may expose fields such as:

```text
rights_asset_id
workspace_id
related_entity_type
related_entity_id
rights_asset_label
claim_id
claim_type_label
claim_status_label
verification_label
territory_label
effective_date_label
party_candidate_label
contributor_candidate_label
contract_support_label
evidence_label
registration_dependency_label
release_dependency_label
distribution_dependency_label
royalty_dependency_label
authority_warnings
```

These are read-model design suggestions only. They are not schema or API requirements.

## 20. Risks Prevented By This Read Model

This read model prevents:

- turning contributor splits into final ownership authority
- turning artist visibility into rights ownership
- turning CRM contacts into legal rights holders without verification
- turning workspace access into copyright ownership
- turning contracts into universal authority without scoped interpretation
- turning registration identifiers into ownership proof
- turning distribution status into clearance proof
- turning royalty events into ownership proof
- letting spreadsheet fields override backend rights records
- exposing private rights or legal context publicly

## 21. Future Implementation Gates

Before Rights Interest seeds can drive registration, release, distribution, royalty, or public API behavior, the platform needs approved design for:

- Party authority mapping
- Rights Interest categories and scopes
- evidence and verification requirements
- contract-to-rights interpretation rules
- territory and effective-date handling
- claim conflict handling
- rights-readiness projection
- registration dependency rules
- release readiness dependency rules
- royalty entitlement derivation
- public/private rights projections

No implementation should begin from this document alone.

## 22. Recommended Next Read-Model Slice

Recommended next read-model slice:

```text
SENTRY-SOUND-MASTER-RECORDING-SEED-READ-MODEL-V1.md
```

Reason:

Master / Recording is the next high-risk authority boundary after Rights Interest. It governs ISRC placement, audio-file interpretation, release-track truth, master ownership context, distribution readiness, and master-side royalty distinction.

