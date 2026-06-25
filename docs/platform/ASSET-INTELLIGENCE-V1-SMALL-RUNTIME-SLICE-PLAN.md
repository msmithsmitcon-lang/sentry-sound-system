# Asset Intelligence V1 Small Runtime Slice Plan

Date: 2026-05-28

Mode: Planning only. No runtime implementation performed.

## 1. Executive Summary

The smallest practical runtime slice is a focused refinement of the existing song Supporting Materials flow.

Instead of exposing the full File Vault, evidence, lineage, public-safe, or governance model to users, the first slice should let a user add a useful supporting file/reference to a song and answer four simple questions:

- What is this file for?
- Is it a reference or an evidence candidate?
- Is it private or can it maybe be used publicly later?
- Where will it help the song workflow?

The implementation should reuse the existing `GET/POST /api/works/[workId]/files` path and existing File Vault metadata capacity if the implementation pass confirms the payload can be extended safely. It should not introduce a new subsystem, schema migration, storage engine, public feed, evidence approval process, or completeness behavior.

This slice gives users practical value now: songs can own more meaningful supporting materials without turning the product into asset governance software.

## 2. User Value

After this slice, a user can add supporting material to a song in a way that is easier to understand and recover later.

Today, the system already supports supporting-material references, but the meaning of each item is thin. After the slice, a user should be able to tell whether a file/reference is lyrics, artwork, a demo, a split sheet, a rights note, or another working reference. They should also be able to see whether it is private, potentially public later, a normal reference, or an evidence candidate.

The practical gain is continuity. A user can return to a song later and quickly understand why a file was added and how it should be treated.

## 3. Product-First UX Goal

The user-facing experience should feel like adding useful material to a song, not managing an asset governance model.

Use product language such as:

- Add supporting file
- What is this file for?
- Is this a reference or evidence candidate?
- Is it private or can it maybe be used publicly later?
- Where will this help?

Avoid user-facing language such as:

- Asset Intelligence
- governance object
- operational entity
- evidence-certified
- public-approved
- compliance-ready

The product goal is simple: help the user keep useful song material attached, understandable, and safely bounded.

## 4. Minimal Runtime Scope

The smallest implementation should:

- Extend the existing Supporting Materials add/read flow.
- Capture a small set of metadata keys.
- Store those keys in existing File Vault metadata if safe.
- Return those keys through the existing supporting-material read path.
- Display the selected values in the existing Supporting Materials tab.
- Keep all new fields optional except fields already required by the current flow.
- Preserve the current reference-only and not-verified posture.

The slice should not try to solve upload storage, evidence approval, public publishing, automated review, catalogue feeds, graph relationships, or archive/version governance.

## 5. Metadata Fields For First Slice

The first slice should include only the smallest useful subset.

### `purpose`

User-facing label: What is this file for?

Suggested first-slice values:

- lyrics
- demo
- artwork
- split_sheet
- agreement
- metadata_reference
- audio_reference
- proof_of_creation
- licensing_reference
- other

Why include it:

This is the highest-value field because it makes the supporting material understandable later.

V1 behavior:

Optional field stored as metadata. It should not change completeness, evidence status, public status, or storage behavior.

### `referenceType`

User-facing label: Is this a reference or evidence candidate?

Suggested first-slice values:

- reference
- evidence_candidate
- operational_document
- public_media
- internal_note

Why include it:

This helps distinguish normal working references from files that may later support evidence or public/profile use.

V1 behavior:

Optional field stored as metadata. `evidence_candidate` must not create verified evidence or a `RegistrationEvidence` record.

### `visibility`

User-facing label: Is it private or can it maybe be used publicly later?

Suggested first-slice values:

- private
- workspace
- public_safe_candidate

Why include it:

This gives the user a safe privacy posture without implying public approval.

V1 behavior:

Optional field stored as metadata. `public_safe_candidate` must not publish anything and must not mean approved for public use.

### `usageContext`

User-facing label: Where will this help?

Suggested first-slice values:

- song_profile
- rights_admin
- publishing
- release_preparation
- licensing
- public_showcase_candidate
- evidence_support

Why include it:

This explains the workflow reason for attaching the material without exposing backend concepts.

V1 behavior:

Optional field stored as metadata. It should be display-oriented in the first slice and should not drive automation.

### Hidden Or Derived Defaults

`publicSafeStatus` should remain hidden and default to `private_only` unless a later implementation pass proves that exposing it is necessary.

`evidenceCandidate` should be derived only when `referenceType = evidence_candidate`, if the backend contract can do so cleanly. It should not be a separate first-slice user control.

All other contract fields should remain deferred.

## 6. Backend Boundary

The backend implementation should:

- Use the existing `/api/works/[workId]/files` route if possible.
- Reuse the existing Work Supporting Materials service/repository path.
- Store selected metadata in existing File Vault metadata if safe.
- Preserve existing File Vault item/link behavior.
- Preserve current reference-only and not-verified semantics.

The backend implementation should not:

- Add a schema migration.
- Create a new subsystem.
- Add a new API route unless inspection proves the existing route cannot be safely extended.
- Add a storage engine.
- Add a public feed.
- Promote assets into verified evidence.
- Change Work Completeness behavior.
- Create approval, archive, lineage, or version governance logic.

## 7. Frontend Boundary

The frontend implementation should be limited to a simple Supporting Materials form refinement.

It may add simple controls for:

- What is this file for?
- Is this a reference or evidence candidate?
- Is it private or can it maybe be used publicly later?
- Where will this help?

The frontend implementation should not add:

- A new dashboard.
- An asset graph.
- An approval workflow.
- Complex statuses.
- File Vault internals.
- Governance language.
- Public approval language.

The Supporting Materials tab should continue to feel like part of the song workspace.

## 8. Validation

The implementation should be validated with a short product workflow:

1. Open an existing song detail page.
2. Add a supporting material record with `purpose`, `referenceType`, `visibility`, and `usageContext`.
3. Save the record through the existing Supporting Materials flow.
4. Reload the page.
5. Confirm the selected values persist and display clearly.
6. Confirm the item remains private/reference-only unless existing behavior says otherwise.
7. Confirm Work Completeness behavior does not change.
8. Confirm no public page, evidence record, upload storage, archive/version, or approval behavior is triggered.
9. Confirm the UI still feels simple and product-first.

## 9. What To Explicitly Defer

Defer:

- Upload/storage engine.
- File binary handling.
- Public publishing.
- Public feed.
- Evidence approval.
- `RegistrationEvidence` promotion.
- Graph view.
- Archive/version UI.
- AI asset suggestions.
- Approval workflows.
- Release package intelligence.
- DSP/royalty asset tracking.
- Cold storage/archive policy.
- Full lineage and supersession governance.

## 10. Risks

The main risk is scope creep. Exposing the full metadata contract at once would make Supporting Materials feel like enterprise asset management instead of a useful song workspace.

Specific risks:

- Metadata JSON becomes a dumping ground without validation.
- The UI becomes too technical.
- Users confuse evidence candidate with verified evidence.
- Users confuse public-safe candidate with public approval.
- Future migration becomes harder if values are not stable.
- Completeness logic accidentally starts treating metadata posture as readiness.
- Private material is accidentally exposed through future public-page work.

The slice should stay intentionally small so these risks remain controllable.

## 11. Recommended Next Implementation Prompt

Next implementation direction:

Implement the smallest Supporting Materials metadata refinement only: extend the existing song Supporting Materials create/read flow to accept and return optional `purpose`, `referenceType`, `visibility`, and `usageContext` values stored in existing File Vault metadata if safe; display those values in the existing Supporting Materials tab with product-first labels; keep `publicSafeStatus` hidden/defaulted to `private_only`; derive `evidenceCandidate` only from `referenceType = evidence_candidate` if already safe; do not add schema, routes, storage upload behavior, public publishing, evidence promotion, completeness changes, approval workflow, archive/version UI, or any new subsystem.
