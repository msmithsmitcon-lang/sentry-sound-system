# Asset Intelligence V1 Contract

Date: 2026-05-28

Status: Contract only. No runtime implementation authorized by this document.

## 1. Purpose

Asset Intelligence V1 formalizes how songs own meaningful supporting files and assets inside Sentry Sound.

The V1 boundary is:

> Allow songs to safely own operationally meaningful files.

This is not a new parallel subsystem. It is a contract refinement over the existing Work Supporting Materials and File Vault path.

Asset Intelligence V1 must not become:

- a generic drive;
- a digital asset management system;
- an evidence approval workflow;
- a public media publishing system;
- a graph intelligence layer;
- a governance engine.

The V1 job is simpler: when a song has lyrics, demos, artwork, agreements, split sheets, proof notes, metadata exports, audio references, or licensing references, Sentry Sound should know what the material is, why it matters, how private it is, whether it may become evidence later, and whether it may ever be considered for public-safe use later.

## 2. V1 Scope

Included:

- song-attached supporting materials;
- category;
- purpose;
- reference vs evidence-candidate distinction;
- visibility posture;
- public-safe posture;
- basic review posture;
- lineage placeholder;
- source reference;
- usage context.

Excluded:

- full upload engine;
- storage strategy;
- public feed implementation;
- evidence approval workflow;
- graph intelligence;
- AI orchestration;
- advanced version governance;
- release package automation;
- DSP/royalty asset tracking.

## 3. Existing Structures To Reuse

V1 should refine, not replace:

- `file_vault_items`
- `file_vault_links`
- `file_vault_versions`
- `file_vault_audit_events`
- Work Supporting Materials service/repository/types
- `GET /api/works/[workId]/files`
- `POST /api/works/[workId]/files`
- Work Completeness supporting-material count
- Evidence Vault / `RegistrationEvidence`
- Hosted Public Music Pages public-safe boundary

Important reuse rule:

The Work Supporting Materials path remains the active song-facing surface. File Vault remains the storage/reference foundation. Evidence Vault remains the governed evidence layer. Hosted Public Music Pages remains a future public-safe consumer boundary, not a current runtime integration.

## 4. Core V1 Metadata Contract

The following stable semantic keys define Asset Intelligence V1 metadata.

### `purpose`

Meaning:

What the file/material is for in song operations.

Suggested allowed values:

- `lyrics`
- `demo`
- `artwork`
- `split_sheet`
- `agreement`
- `metadata_reference`
- `audio_reference`
- `proof_of_creation`
- `licensing_reference`
- `other`

User-facing label:

What is this file for?

Operational purpose:

Helps users and backend read models understand why the material exists without relying only on broad file category.

V1 behavior:

Used as descriptive metadata only. It does not imply evidence verification, readiness approval, or public approval.

Future expansion notes:

May later support filtering, completeness hints, release-preparation grouping, evidence-candidate mapping, or public-showcase preparation.

### `referenceType`

Meaning:

The operational role of the material.

Suggested allowed values:

- `reference`
- `evidence_candidate`
- `operational_document`
- `public_media`
- `internal_note`

User-facing label:

Type

Operational purpose:

Separates ordinary references from materials that may later support evidence review, public media use, or internal notes.

V1 behavior:

`evidence_candidate` is only a candidate posture. It is not verified evidence. `public_media` is not public approval.

Future expansion notes:

May later map into Evidence Vault, public-safe review, release packs, or media handling after explicit contracts exist.

### `visibility`

Meaning:

Who the material is intended to be visible to.

Suggested allowed values:

- `private`
- `workspace`
- `public_safe_candidate`
- `public_approved_later`

User-facing label:

Visibility

Operational purpose:

Prevents accidental leakage of private operational materials and prepares a future distinction between private assets and public-safe assets.

V1 behavior:

Default should be private or workspace-scoped. `public_safe_candidate` does not publish anything. `public_approved_later` is a placeholder value, not current approval.

Future expansion notes:

May later become a first-class access-control/public-feed field if public pages are implemented.

### `publicSafeStatus`

Meaning:

Whether the material has any public-safe posture.

Suggested allowed values:

- `private_only`
- `candidate`
- `approved_later`
- `not_applicable`

User-facing label:

Public use

Operational purpose:

Makes public-safe readiness explicit without exposing protected material.

V1 behavior:

`candidate` only means it might be reviewed later. `approved_later` is reserved for future workflows and must not be treated as active approval in V1.

Future expansion notes:

May later connect to Hosted Public Music Pages, public catalogue read models, cover art approval, preview audio approval, or profile media rules.

### `usageContext`

Meaning:

Where this material is expected to matter operationally.

Suggested allowed values:

- `song_profile`
- `rights_admin`
- `publishing`
- `release_preparation`
- `licensing`
- `public_showcase_candidate`
- `evidence_support`

User-facing label:

Used for

Operational purpose:

Keeps material organization product-first and workflow-aware without introducing automation.

V1 behavior:

Used for organization and future-safe grouping only.

Future expansion notes:

May later support module-specific views, public-page preparation, release workflows, or evidence support surfaces.

### `lineageSourceType`

Meaning:

Where the material came from.

Suggested allowed values:

- `uploaded_file`
- `external_link`
- `generated_export`
- `legacy_reference`
- `unknown`

User-facing label:

Source type

Operational purpose:

Preserves origin context without requiring a full lineage engine.

V1 behavior:

Stored as a lightweight lineage placeholder. No immutability or provenance guarantee is implied.

Future expansion notes:

May later support version lineage, generation lineage, export history, AI-source lineage, or audit reconstruction.

### `sourceReference`

Meaning:

A user-entered pointer to where the material can be found or what it came from.

Suggested allowed values:

- free-text note;
- external URL;
- storage key;
- filename;
- export label;
- legacy source note.

User-facing label:

Source / reference

Operational purpose:

Lets users capture useful location/source context before full upload or storage systems exist.

V1 behavior:

Reference-only. It should not be treated as a verified URL, storage path, or proof source without later validation.

Future expansion notes:

May later split into structured source URL, storage object key, export ID, or linked File Vault version.

### `reviewStatus`

Meaning:

Whether a human has reviewed the material for the current operational use.

Suggested allowed values:

- `not_reviewed`
- `needs_review`
- `reviewed`
- `rejected_later`

User-facing label:

Review

Operational purpose:

Keeps review posture visible without creating an approval engine.

V1 behavior:

Informational only. `reviewed` does not mean legally cleared, evidence verified, public approved, or submission ready.

Future expansion notes:

May later connect to explicit review workflows, public-safe approvals, evidence verification, or release preparation.

### `archiveStatus`

Meaning:

Whether the material should be treated as active, archived later, or superseded later.

Suggested allowed values:

- `active`
- `archived_later`
- `superseded_later`

User-facing label:

Status

Operational purpose:

Avoids destructive overwrite assumptions and prepares future lifecycle handling.

V1 behavior:

Default is `active`. Archive and supersession values are placeholders unless future behavior is explicitly implemented.

Future expansion notes:

May later become archive/delete/supersession workflow state.

### `supersedesAssetId`

Meaning:

Optional reference to another file/material that this item conceptually supersedes.

Suggested allowed values:

- existing File Vault item id;
- null/empty.

User-facing label:

Replaces

Operational purpose:

Preserves future-safe lineage when users replace drafts, exports, artwork, metadata references, or agreements.

V1 behavior:

Placeholder metadata only. It must not delete, archive, hide, or invalidate the superseded item automatically.

Future expansion notes:

May later connect to File Vault versions or formal supersession rules.

### `evidenceCandidate`

Meaning:

Whether the material may later be considered for governed evidence review.

Suggested allowed values:

- `true`
- `false`

User-facing label:

Evidence candidate

Operational purpose:

Allows a material to be marked as potentially relevant to proof, rights, submissions, or authority review without making it evidence.

V1 behavior:

If true, the material remains unverified. It does not create `RegistrationEvidence`, does not satisfy readiness, and does not approve submission.

Future expansion notes:

May later support a governed conversion/review path into Evidence Vault.

## 5. Suggested Allowed Values

### `purpose`

- `lyrics`
- `demo`
- `artwork`
- `split_sheet`
- `agreement`
- `metadata_reference`
- `audio_reference`
- `proof_of_creation`
- `licensing_reference`
- `other`

### `referenceType`

- `reference`
- `evidence_candidate`
- `operational_document`
- `public_media`
- `internal_note`

### `visibility`

- `private`
- `workspace`
- `public_safe_candidate`
- `public_approved_later`

### `publicSafeStatus`

- `private_only`
- `candidate`
- `approved_later`
- `not_applicable`

### `usageContext`

- `song_profile`
- `rights_admin`
- `publishing`
- `release_preparation`
- `licensing`
- `public_showcase_candidate`
- `evidence_support`

### `lineageSourceType`

- `uploaded_file`
- `external_link`
- `generated_export`
- `legacy_reference`
- `unknown`

### `reviewStatus`

- `not_reviewed`
- `needs_review`
- `reviewed`
- `rejected_later`

### `archiveStatus`

- `active`
- `archived_later`
- `superseded_later`

## 6. Evidence Boundary

`evidence_candidate` is not verified evidence.

Asset Intelligence V1 may mark a supporting material as an evidence candidate only. That means:

- it may be relevant to future proof/review;
- it may help users identify what should be reviewed later;
- it may support operational context.

It does not mean:

- evidence is verified;
- legal clearance exists;
- submission readiness is satisfied;
- royalty or payout eligibility is established;
- `RegistrationEvidence` has been created;
- Evidence Vault has approved anything.

`RegistrationEvidence` remains the governed evidence layer. Any future conversion from supporting material to evidence must be explicitly designed, audited, and reviewed.

No evidence approval workflow is included in V1.

## 7. Public-Safe Boundary

`public_safe_candidate` is not public approval.

Asset Intelligence V1 may prepare metadata posture for future public-safe review, but it does not publish data or media.

Hosted public pages may only use approved public-safe data later. Private operational assets remain protected.

V1 must not expose:

- contracts;
- split disputes;
- evidence packs;
- private contributor documents;
- legal correspondence;
- royalty/payment details;
- internal admin notes;
- readiness blockers;
- private workspace operations.

Public-safe posture is preparatory metadata only.

## 8. Lineage / Version Boundary

V1 must avoid destructive overwrite assumptions.

Rules:

- adding a new material must not silently replace older material;
- `supersedesAssetId` must not automatically archive or delete anything;
- File Vault versions should be respected where already present;
- source references should remain visible as context, not proof by themselves;
- version and lineage fields are placeholders unless future behavior is explicitly implemented.

Full immutability, version governance, cryptographic provenance, and formal supersession workflows are deferred.

## 9. Product UX Language

Use product-first wording:

- Supporting Materials
- Add supporting file
- What is this file for?
- Reference
- Evidence candidate
- Private
- May be used later for public profile

Avoid user-facing wording:

- Asset Intelligence
- Governance object
- Operational entity
- Evidence certified
- Public approved
- Compliance-ready

Language rule:

The user should feel they are organizing song materials, not operating architecture.

## 10. Backend Authority Rules

Backend/File Vault remains the source of truth for material records and metadata.

Rules:

- UI reflects backend metadata/contracts.
- UI may not invent approval.
- UI may not expose private data publicly.
- UI may not silently treat candidates as approved.
- UI may not treat reviewed as legal clearance.
- Large binaries stay outside the relational database.
- Storage pointers do not become truth.
- No silent overwrite assumptions.
- Supporting materials remain useful without Evidence Vault, public pages, releases, royalties, AI, or submissions.

## 11. V1 Implementation Boundary Later

Later implementation should likely:

- refine existing supporting-material metadata;
- reuse the current `/api/works/[workId]/files` path if possible;
- avoid a new parallel subsystem;
- keep UI simple;
- keep user-facing language product-first;
- avoid schema change unless inspection proves unavoidable;
- preserve the reference-only/evidence-candidate boundary;
- preserve private/public-safe boundaries;
- keep Work Completeness as operational visibility only.

No implementation is authorized by this contract.

## 12. Deferred Capabilities

Deferred:

- upload engine;
- storage provider decision;
- public feed;
- media previews;
- approval workflow;
- graph view;
- AI orchestration;
- release package intelligence;
- archive/cold storage;
- royalty-linked usage intelligence;
- DSP asset tracking;
- public CDN delivery;
- OCR/document parsing;
- evidence verification;
- evidence promotion bridge;
- automated licensing workflows.

## 13. Recommended Next Step

Recommended next step:

Asset Intelligence V1 implementation feasibility pass.

The feasibility pass should inspect whether the stable metadata keys in this contract can live safely in existing File Vault metadata JSON or require a migration.

No implementation should begin until feasibility is complete.
