# Asset Intelligence V1 Implementation Feasibility

Date: 2026-05-28

Status: Feasibility pass only. No runtime implementation authorized.

## 1. Executive Summary

Asset Intelligence V1 can likely be implemented as a metadata-only refinement over the existing File Vault / Supporting Materials path.

Migration recommendation:

No migration needed now.

Reason:

- `file_vault_items.metadata` already exists as `jsonb`.
- `file_vault_links.metadata` already exists as `jsonb`.
- `file_vault_versions.metadata` already exists as `jsonb`.
- `file_vault_audit_events.event_payload` already exists as `jsonb`.
- The current Work Supporting Materials write path already stores reference/evidence-boundary semantics in metadata.
- The current `/api/works/[workId]/files` route can remain the song-anchored API path.

Schema changes may become useful later for querying, filtering, public access control, evidence promotion, archive/supersession workflows, or public feed generation. They are not unavoidable for the first V1 slice.

## 2. Existing Storage/Metadata Capacity

### Existing File Vault columns

`file_vault_items`:

- `id`
- `workspace_id`
- `file_category`
- `file_name`
- `file_mime_type`
- `file_size_bytes`
- `storage_provider`
- `storage_bucket`
- `storage_path`
- `checksum`
- `metadata jsonb`
- `created_at`
- `updated_at`

`file_vault_links`:

- `id`
- `workspace_id`
- `file_vault_item_id`
- `linked_record_type`
- `linked_record_id`
- `link_role`
- `metadata jsonb`
- `created_at`

`file_vault_versions`:

- `id`
- `workspace_id`
- `file_vault_item_id`
- `version_number`
- `storage_path`
- `checksum`
- `metadata jsonb`
- `created_at`

`file_vault_audit_events`:

- `id`
- `workspace_id`
- `file_vault_item_id`
- `event_type`
- `event_summary`
- `event_payload jsonb`
- `created_at`

### Current API payload shape

Current `POST /api/works/[workId]/files` accepts:

- `file_name`
- `file_category`
- `reference_text`
- `notes`

Current response returns:

- `id`
- `link_id`
- `file_name`
- `file_category`
- `reference_status`
- `reference_text`
- `notes`
- `file_mime_type`
- `file_size_bytes`
- `created_at`
- `source`
- `mode`
- `disclaimer`

### Current service/repository behavior

The current repository writes:

- `file_vault_items.storage_provider = manual_reference`
- `file_vault_items.storage_path = manual-reference:<uuid>`
- `file_vault_items.metadata.referenceStatus = reference_only`
- `file_vault_items.metadata.verificationStatus = not_verified`
- `file_vault_items.metadata.referenceText`
- `file_vault_items.metadata.notes`
- `file_vault_items.metadata.sourceModule = works`
- `file_vault_items.metadata.linkedRecordType = musical_work`
- `file_vault_items.metadata.linkedRecordId`
- `file_vault_items.metadata.createdByUserId`
- `file_vault_items.metadata.realFileUpload = false`
- `file_vault_items.metadata.productionEvidenceGovernance = false`
- `file_vault_links.link_role = supporting_material`
- `file_vault_links.metadata.referenceOnly = true`
- `file_vault_links.metadata.notVerified = true`
- `file_vault_audit_events.event_type = work.supporting_material.reference_created`

This means V1 metadata can fit the existing write pattern without changing table shape.

## 3. Field-by-Field Feasibility

| V1 key | Can fit existing metadata? | Needs explicit column now? | Unsafe / unclear? | Recommended V1 handling |
| --- | --- | --- | --- | --- |
| `purpose` | Yes | No | Low risk if allowed values are validated. | Store in `file_vault_items.metadata.purpose`; expose as descriptive metadata. |
| `referenceType` | Yes | No | Medium risk if confused with evidence verification. | Store in `file_vault_items.metadata.referenceType`; validate allowed values; keep disclaimer. |
| `visibility` | Yes | No | Medium risk because visibility can imply access control. | Store as intent/posture only in V1; do not treat as access-control enforcement yet. |
| `publicSafeStatus` | Yes | No | Medium/high risk if UI implies publication approval. | Store as preparatory posture only; default `private_only` or `not_applicable`. |
| `usageContext` | Yes | No | Low risk. | Store in metadata; use for organization only. |
| `lineageSourceType` | Yes | No | Low/medium risk if users infer provenance guarantee. | Store as lightweight origin context; no proof or immutability claim. |
| `sourceReference` | Yes | No | Medium risk if treated as verified URL/storage path. | Store as user-provided reference only; do not validate as proof in V1. |
| `reviewStatus` | Yes | No | Medium risk if "reviewed" sounds approved. | Store as basic posture; avoid legal/public/evidence approval language. |
| `archiveStatus` | Yes | No | Medium risk because no archive behavior exists. | Store only if needed; default `active`; do not hide/delete records. |
| `supersedesAssetId` | Yes | No | Medium risk because no referential constraint exists in JSON. | Store as optional placeholder; no automatic supersession behavior. |
| `evidenceCandidate` | Yes | No | High risk if confused with `RegistrationEvidence`. | Store boolean only; must not create or satisfy Evidence Vault records. |

Feasibility conclusion:

All V1 keys can fit existing metadata for the first implementation slice. None require an explicit column immediately.

Fields most likely to deserve columns later:

- `visibility`
- `publicSafeStatus`
- `purpose`
- `referenceType`
- `reviewStatus`
- `archiveStatus`

Reason:

Those fields are likely future filter/query/access-control dimensions if Asset Intelligence expands beyond one song detail view.

## 4. API Compatibility

Existing `/api/works/[workId]/files` can support V1 metadata without new routes.

Why:

- It is already song-anchored.
- It already resolves authenticated workspace context.
- It already validates work ownership.
- It already writes to File Vault tables.
- It already stores metadata.
- It already returns a supporting-material read model.
- It already preserves a reference-only/evidence-not-verified disclaimer.

Likely later API refinement:

- Extend create payload to accept selected V1 keys.
- Validate each V1 key against contract allowed values.
- Store the keys in `file_vault_items.metadata`.
- Optionally mirror link-specific posture in `file_vault_links.metadata` only where link semantics differ from item semantics.
- Return selected V1 keys in `WorkSupportingMaterial`.

No new route is needed for the smallest V1 implementation slice.

## 5. UI Compatibility

The current Supporting Materials UI can support V1 later without a full redesign.

Why:

- It already has a compact add-reference form.
- It already uses product-first language.
- It already displays material name, category, reference text, notes, and not-verified status.
- It already says the record does not upload a file or verify evidence.
- It already sits inside Song Detail as a song-attached material surface.

Likely later UI refinement:

- Add one simple "What is this file for?" control for `purpose`.
- Add a minimal reference/evidence-candidate selector only if wording remains clear.
- Default visibility to private/workspace without making public-safe posture prominent.
- Keep evidence/public-safe status as small labels or future fields, not approval badges.

No full UI redesign is required for V1 feasibility.

## 6. Completeness / Review Impact

V1 metadata should not affect completeness initially.

Current Work Completeness only reads:

- supporting material count;
- split-sheet reference count through `file_category = split_sheet`.

Recommendation:

- Keep completeness behavior unchanged in the first V1 implementation slice.
- Treat new metadata as display/organization context first.
- Do not make `reviewStatus`, `evidenceCandidate`, `publicSafeStatus`, or `visibility` change completeness/readiness in V1.

Later, after review:

- `purpose = split_sheet` or `referenceType = evidence_candidate` may support richer review hints.
- Public-safe posture may support hosted-page preparation checks.
- Review posture may support human task lists.

Those are not V1 behavior.

## 7. Evidence Boundary

`evidenceCandidate` must not create verified evidence or `RegistrationEvidence` automatically.

Existing Evidence Vault / Registration Evidence has its own:

- evidence type;
- requirement level;
- verification status;
- related entity;
- expiry/supersession;
- audit events.

V1 supporting-material metadata may mark a material as a candidate only.

It must not:

- create `RegistrationEvidence`;
- set evidence verification status;
- satisfy evidence readiness;
- satisfy submission readiness;
- approve legal clearance;
- affect royalty/payout eligibility.

## 8. Public-Safe Boundary

`publicSafeStatus` must not expose anything publicly in V1.

Existing Hosted Public Music Pages documentation defines a future public-safe feed and public/private boundary, but no public feed/runtime exists now.

V1 public-safe posture may only mean:

- private-only;
- candidate for later public-safe review;
- not applicable.

It must not:

- publish a file;
- expose a URL;
- make a public API response;
- feed Chronicle or hosted pages;
- approve cover art/audio preview/profile media.

## 9. Migration Recommendation

Recommendation:

No migration needed now.

Migration likely later.

Migration is not unavoidable now.

Why no migration now:

- All proposed V1 keys fit existing JSON metadata.
- The initial V1 use case is song-local organization, not cross-catalogue querying.
- Existing route/service/repository already writes metadata and audit events.
- Existing completeness only needs counts, not new queryable V1 dimensions.

Why migration is likely later:

- public/private enforcement may need first-class fields and policies;
- public feed generation may need indexed public-safe status;
- evidence promotion may need relational links to `RegistrationEvidence`;
- archive/supersession may need constraints and lifecycle events;
- filtering by purpose/review/public-safe state across many works may need indexes;
- reporting may need stable columns or generated indexes.

## 10. Safest Next Implementation Slice

If implementation is approved later, the smallest safe runtime change would be:

1. Extend the existing Work Supporting Materials create payload to accept selected metadata keys:
   - `purpose`
   - `referenceType`
   - `visibility`
   - `publicSafeStatus`
   - `usageContext`
   - `lineageSourceType`
   - `sourceReference`
   - `reviewStatus`
   - `archiveStatus`
   - `supersedesAssetId`
   - `evidenceCandidate`
2. Validate each key against the contract's allowed values.
3. Store the keys in `file_vault_items.metadata`.
4. Keep `storage_provider = manual_reference` unless a real upload system is separately approved.
5. Return selected keys from `GET /api/works/[workId]/files`.
6. Keep completeness unchanged.
7. Keep UI minimal.
8. Keep all evidence/public-safe language non-approving.

No storage upload engine should be added in this slice.

## 11. Risks

Risks:

- Metadata JSON becomes a dumping ground if keys are not validated.
- Validation drift between docs, frontend, API, and repository.
- Future migration cost if high-volume querying starts before stable columns exist.
- Public/private leakage if `visibility` is treated as access control without enforcement.
- Evidence overclaiming if `evidenceCandidate` is presented as proof.
- UI implying approval through labels such as "reviewed", "public", or "evidence".
- JSON-only `supersedesAssetId` has no referential integrity.
- `archiveStatus` may imply behavior that does not exist.
- Duplicate semantics between `file_category`, `purpose`, and `referenceType` if labels are not kept simple.

Mitigations:

- Validate allowed values centrally.
- Default sensitive fields conservatively.
- Keep disclaimers visible.
- Keep completeness/readiness unchanged first.
- Avoid public feed or evidence bridge until separately designed.

## 12. Deferred Items

Deferred:

- schema migration;
- new API routes;
- update/delete/archive routes;
- real file upload;
- storage provider decision;
- public feed;
- media preview handling;
- public CDN delivery;
- evidence approval workflow;
- `RegistrationEvidence` promotion bridge;
- graph/lineage engine;
- AI orchestration;
- release package intelligence;
- archive/cold storage;
- royalty-linked usage intelligence;
- DSP asset tracking;
- automated licensing workflows.
