# Sentry Sound Work Foundation Read Model V1

Date: 2026-06-05

Status: design and Work foundation read-model interpretation only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

`musical_works` remains protected foundation truth.

It is the active Work seed for Sentry Sound. Work records exist independently from Rights Interest, Registration, Release, Distribution, and Royalty Authority. Those downstream domains may consume, reference, evaluate, package, distribute, report on, or calculate from Works later, but they do not create Work truth and Work does not depend on them to exist.

This read-model design defines how existing Work records should be interpreted, surfaced, labelled, and consumed before any future authority-layer implementation.

Immediate lock:

- Work exists independently.
- `musical_works` must not be renamed, replaced, or made legacy.
- Chronicle imported songs are valid foundation Works.
- Work title, identity, workspace scope, creation attribution, and foundation catalogue status are protected Work truth.
- Contributor rows, rights claims, master references, registrations, releases, distribution status, and royalty events are not prerequisites for Work existence.

## 2. What Is A Work?

A Work is the composition/song identity.

In Sentry Sound, the active Work seed is:

```text
musical_works
```

A Work can represent a song or composition in the catalogue before:

- contributors are fully captured
- ownership is verified
- publishing authority is governed
- ISWC exists
- a Master / Recording exists
- a Release exists
- distribution occurs
- royalty events occur

Doctrine rule:

Work is foundation catalogue truth. It is not full rights truth.

## 3. What Is Work Foundation Truth?

Work Foundation Truth is the minimum backend-authoritative record that says:

- this Work exists in this workspace
- this Work has an identity
- this Work has a title
- this Work has creation/audit context
- this Work can be surfaced as part of the protected catalogue foundation

Current Work Foundation Truth includes:

- `work_id`
- `asset_id` where linked
- `workspace_id`
- `created_by_user_id`
- `work_title`
- genre/mood where captured as metadata
- `created_at`
- `updated_at` where available
- internal draft posture such as registration/copyright draft status

Work Foundation Truth does not prove:

- copyright ownership
- publishing ownership
- master ownership
- contributor split authority
- registration acceptance
- release readiness
- distribution availability
- royalty entitlement

## 4. What Belongs To A Work?

Belongs to Work:

- composition/song identity
- Work title
- workspace scope
- Work profile metadata
- catalogue/foundation status
- basic genre/mood/theme metadata where captured
- draft internal registration/copyright posture
- Work-level notes where kept internal
- Work-level relationship indicators to contributors, files, registrations, releases, or other domains

Belongs as relationship indicators, not authority:

- contributor count
- supporting material count
- registration status summary
- copyright status summary
- release relationship summary
- master relationship summary
- rights review summary

These summaries can help users understand state, but they must not convert downstream records into Work-owned authority.

## 5. What Does NOT Belong To A Work?

Work must not own:

- final rights ownership
- final publishing ownership
- final contributor split authority
- master/sound recording identity
- ISRC
- commercial Master approval
- Release package truth
- distribution status
- DSP/distributor references
- royalty allocation
- payee authority
- finance/accounting records
- verified evidence merely because a file exists

ISWC belongs to Work identifier governance when supported, but ISWC existence or absence must not decide whether the Work exists.

## 6. Work vs Contributor

Contributor captures participation.

Work captures composition/song identity.

Read-model rules:

- A Work may exist with zero contributors.
- Contributor count can be surfaced as participation capture status.
- `work_contributors` should be labelled `participation_capture`.
- Contributor splits should be labelled `transitional` and `non_authoritative` unless verified by future Rights Interest authority.
- A composer, lyricist, producer, performer, publisher, or master-owner role row does not automatically create ownership truth.

Work should not be blocked from existing because contributor capture is incomplete.

## 7. Work vs Rights Interest

Rights Interest is ownership/control/administration authority.

Work is composition/song identity.

Read-model rules:

- A Work may exist without Rights Interest.
- Rights Interest may later attach to a Work.
- Rights claims may be labelled `candidate` until verified.
- Missing Rights Interest should not invalidate Work Foundation Truth.
- Missing Rights Interest may block downstream release, registration, distribution, or royalty actions depending on policy.

Work must not own final ownership or administration authority.

## 8. Work vs Master / Recording

Master / Recording is sound recording identity.

Work is composition/song identity.

Read-model rules:

- A Work may exist with zero Masters.
- A Work may later link to one or more Masters.
- Demo audio or supporting files do not automatically become Masters.
- ISRC belongs to Master / Recording identifier governance, not Work Foundation Truth.
- Master ownership must not be inferred from Work metadata or artist visibility.

Work remains valid even where no approved commercial Master exists.

## 9. Work vs Registration

Registration is external-body/identifier workflow.

Work is foundation composition identity.

Read-model rules:

- A Work may exist before ISWC.
- A Work may exist before SAMRO, CAPASSO, copyright, publisher, distributor, or society registration.
- `registration_status = draft` should be interpreted as internal operational posture, not failed registration.
- Registration references should be labelled `candidate` or `deferred` until governed.
- Missing registration must not invalidate Work Foundation Truth.

Registration consumes Work truth; it does not create Work truth.

## 10. Work vs Release

Release is commercial packaging.

Work is composition/song identity.

Read-model rules:

- A Work may exist without a Release.
- A Release may include one or many Works.
- A Release track should ultimately reference Work and Master distinctly.
- Release readiness should not determine whether a Work exists.
- Release data imported from intake should be labelled `deferred` until release governance exists.

Work must not own commercial package truth.

## 11. Work vs Distribution

Distribution is downstream delivery/channel/platform relationship.

Work is composition/song identity.

Read-model rules:

- A Work may exist without distribution.
- Distribution consumes Release truth, which may reference Work.
- Distribution status does not prove Work ownership, Work readiness, or Work registration.
- DSP/distributor references should not appear as Work authority.

Work must not own distribution status.

## 12. Work vs Royalty Event

Royalty Event is activity, report, income, statement, adjustment, or settlement-triggering context.

Work is composition/song identity.

Read-model rules:

- A Work may exist before any royalty event.
- Royalty Events should consume verified rights and reporting context.
- Royalty activity does not create Work ownership.
- Current contributor-derived royalty calculations should be labelled `transitional` and `authority_risk`.

Work must not own royalty allocation or payee authority.

## 13. Work Label Classification

### Protected

Label as `protected`:

- `work_id`
- `asset_id` where present
- `workspace_id`
- `created_by_user_id`
- `work_title`
- creation timestamps
- update timestamps
- Chronicle foundation Work identity
- backend-created Work foundation record

Meaning:

- safe foundation catalogue truth
- stable active Work seed
- not dependent on downstream authority layers

### Candidate

Label as `candidate`:

- contributor-linked ownership assumptions
- artist-linked ownership assumptions
- Work-to-Rights Interest review status
- Work-to-Master review status
- Work-to-registration/identifier review status
- Work-to-public projection review status

Meaning:

- may become useful authority context after future review
- not verified by existence alone

### Transitional

Label as `transitional`:

- split-derived authority interpretations
- current contributor split totals
- Work completeness/readiness fields if used beyond operational visibility
- release/project grouping metadata from capture workflows
- copyright/registration fields that predate governed authority

Meaning:

- useful current platform context
- not final doctrine authority
- not automatically wrong or ready for removal

### Deferred

Label as `deferred`:

- ISWC governance
- ownership authority
- publishing authority
- master owner fields
- release data
- rights administration data
- registration identifiers
- Chronicle workbook rights/identifier fields

Meaning:

- intentionally not activated as structured authority yet
- requires future doctrine-aligned handling

### Non-Authoritative

Label as `non_authoritative`:

- notes
- imported workbook hints
- free-text contributor names
- free-text publisher/owner fields
- DSP/platform notes
- rights/registration notes
- copyright owner notes
- general notes
- reference metadata

Meaning:

- useful context
- must not drive ownership, registration, release, distribution, royalty, or public authority

### Authority Risk

Label as `authority_risk`:

- ownership split percentages
- publisher share
- composer/lyric split totals
- copyright claimant if unverified
- registration/copyright confirmation fields before governance
- available-for-API/public flags before public-safe projection approval

Meaning:

- may be mistaken for stronger authority than it currently has
- requires warning or private/internal interpretation

## 14. Chronicle Catalogue Rules

Chronicle import interpretation:

- Imported songs are valid Works.
- Imported songs are protected foundation catalogue records.
- Imported songs are backend-authoritative for Work identity in this workspace.
- Imported songs are scoped to the Sentry Sound workspace.
- Imported songs are not automatically registered Works.
- Imported songs are not automatically Rights Interests.
- Imported songs are not automatically commercial Releases.
- Imported songs are not automatically Masters.
- Imported songs are not automatically royalty-bearing assets.

Chronicle deferred fields:

- contributors: deferred
- ownership splits: deferred, non-authoritative, authority risk
- ISRC: deferred, candidate for Master identifier governance
- ISWC: deferred, candidate for Work identifier governance
- master owner: deferred, candidate for Rights/Master authority review
- publishing owner: deferred, candidate for Rights/Publishing authority review
- release data: deferred
- rights administration data: deferred
- registration identifiers: deferred

Chronicle source-of-truth rule:

- Sentry Sound backend is authoritative for imported Work foundation records.
- Chronicle workbook remains intake only.
- Future Chronicle website/API consumption must use approved Sentry Sound projections, not workbook ownership.

## 15. Public-Safe Principles

Potentially public-safe after approval:

- Work title
- approved public artist brand display
- public genre/category
- approved public catalogue description
- approved public artwork
- approved public release availability where release/distribution doctrine allows

Internal only by default:

- `workspace_id`
- `created_by_user_id`
- internal code/catalogue number where not approved
- registration/copyright draft posture
- contributor count if it implies incomplete private capture
- supporting material status
- readiness warnings
- source/import metadata
- private notes

Requires future authority verification:

- ISWC
- ownership/publishing claims
- contributor splits
- release status
- master linkage
- registration identifiers
- public availability/API flags
- rights/admin labels
- royalty-bearing status

Public-safe rule:

- No public Work projection should expose private contributor, split, rights, evidence, registration, distribution, royalty, finance, or deferred Chronicle authority fields.

## 16. Suggested Work Foundation Read-Model Fields

Suggested fields for future design only:

- `work_id`
- `asset_id`
- `workspace_id`
- `title`
- `genre`
- `mood`
- `created_at`
- `updated_at`
- `catalogue_source_label`
- `foundation_status_label`
- `workspace_scope_label`
- `contributor_capture_label`
- `rights_authority_label`
- `master_authority_label`
- `registration_authority_label`
- `release_context_label`
- `distribution_context_label`
- `royalty_authority_label`
- `evidence_context_label`
- `public_projection_label`
- `authority_warnings`

Example labels:

- `protected_foundation_work`
- `chronicle_foundation_catalogue`
- `workspace_scoped`
- `contributors_not_imported`
- `rights_deferred`
- `master_deferred`
- `registration_draft_internal`
- `release_not_established`
- `distribution_not_established`
- `royalty_authority_not_established`
- `supporting_materials_candidate`
- `public_projection_not_approved`

## 17. Risks Prevented

This read-model prevents:

- making Work dependent on rights, registration, release, distribution, or royalty records
- demoting `musical_works`
- treating Chronicle intake fields as authority
- treating contributor splits as ownership
- treating Work metadata as publishing authority
- treating draft registration status as registration failure
- treating release/distribution status as Work truth
- treating royalty events as Work ownership
- exposing private Work-adjacent fields publicly

## 18. Future Gates

Implementation remains paused for:

- Work read-model code
- API changes
- UI changes
- schema changes
- migrations
- Chronicle deferred imports
- contributor migration
- Rights Interest implementation
- Master implementation
- registration identifier governance
- public projection implementation
- royalty refactor

Before any implementation:

- approve this read-model design
- list affected routes/services/repositories/UI surfaces
- define exact field mapping
- define public/private rules
- define tests/checks
- define rollback/recovery if any runtime behavior changes

## 19. Recommended Next Read-Model Slice

Recommended next slice:

```text
Contributor Participation Read Model V1
```

Purpose:

- interpret `contributors` and `work_contributors` safely
- keep contributor capture useful
- prevent contributor splits from becoming final rights/royalty authority
- prepare future Party/Rights Interest alignment without migrating contributors yet

