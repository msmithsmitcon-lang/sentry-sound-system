# Asset Intelligence V1 Backend Contract Inspection

Date: 2026-05-28

Status: Backend contract inspection only. No runtime implementation performed.

## 1. Executive Summary

The current V1 boundary, "Allow songs to safely own operationally meaningful files," can be pursued by refining existing Supporting Materials and File Vault contracts rather than creating a new Asset Intelligence subsystem.

Sentry Sound already has:

- a work-level supporting-material API at `GET /api/works/[workId]/files` and `POST /api/works/[workId]/files`;
- File Vault tables for items, links, versions, and audit events;
- service helpers for creating file vault items, linking them to records, and adding versions;
- metadata JSON columns on `file_vault_items`, `file_vault_links`, and `file_vault_versions`;
- Work Operational Completeness logic that already reads supporting-material counts and split-sheet references;
- Evidence Vault / `RegistrationEvidence` concepts that should remain separate from reference-only supporting materials;
- future public-safe/public-page doctrine, but no active public-safe feed contract.

Recommendation:

Asset Intelligence V1 should remain a metadata-reference refinement over File Vault and Work Supporting Materials. It should add clearer contract language around purpose, reference/evidence-candidate posture, visibility, lineage/source, and public-safe candidacy only after a small architecture doc is approved. Most V1 fields can be stored in existing JSON metadata without immediate schema changes.

## 2. Files/routes/services inspected

Core work files and routes:

- `app/api/works/[workId]/files/route.ts`
- `src/lib/work-files/work-supporting-materials.types.ts`
- `src/lib/work-files/work-supporting-materials-service.ts`
- `src/lib/work-files/work-supporting-materials-repository.ts`
- `app/dashboard/works/details/[workId]/page.tsx`

File Vault:

- `docs/modules/file-vault/FILE-VAULT.md`
- `src/lib/file-vault/createFileVaultItem.ts`
- `src/lib/file-vault/linkFileVaultItem.ts`
- `src/lib/file-vault/addFileVaultVersion.ts`
- `supabase/migrations/20260507193358_file_vault_schema.sql`

Evidence and readiness:

- `docs/modules/evidence-vault/EVIDENCE-VAULT-V1.md`
- `src/contracts/evidence-vault/evidence.constants.ts`
- `src/lib/evidence-vault/evaluateEvidenceReadiness.ts`
- `src/lib/evidence-vault/evaluateEvidenceReadiness.logic.ts`
- `src/lib/evidence-vault/evaluateEvidencePackReadiness.ts`
- `src/lib/evidence-vault/validateEvidenceTransition.ts`
- `src/lib/evidence-vault/validateEvidenceSupersession.ts`
- `src/lib/evidence-vault/evidenceLifecycle.constants.ts`
- `src/lib/registration/contracts/registration-evidence-contract.ts`
- `src/lib/registration/evidence/registration-evidence-registry.ts`
- `src/lib/registration/repositories/registration-evidence-repository.ts`
- `prisma/schema.prisma`
- `supabase/migrations/evidence_vault_audit_events.sql`
- `supabase/migrations/evidence_audit_event_only.sql`

Completeness / operational visibility:

- `src/lib/work-readiness/get-work-completeness.ts`
- `src/lib/work-readiness/work-completeness-repository.ts`
- `app/api/works/[workId]/completeness/route.ts`

Asset / storage adjacent:

- `src/lib/assets/asset-governance.ts`
- `src/lib/assets/asset-admin-supabase.ts`
- `app/api/test/assets/route.ts`
- `app/api/finance/attachments/route.ts`

Platform docs:

- `docs/platform/HOSTED-PUBLIC-MUSIC-PAGES-MODULE.md`
- `docs/platform/SENTRY_SOUND_MASTER_OPERATIONAL_ROADMAP.md`
- `docs/platform/EXISTING-SUPPORTING-MATERIALS-ASSET-AUDIT.md`
- `docs/platform/CANONICAL-PERSISTENCE-DIRECTION.md`
- `docs/platform/OPERATIONAL-OWNERSHIP-VS-RIGHTS-OWNERSHIP.md`
- `docs/platform/DASHBOARD-CAPABILITY-ALIGNMENT-MATRIX.md`
- `docs/governance/WORK-DETAIL-FLOW-REALIGNMENT-DESIGN-PASS.md`

## 3. Existing backend structures found

### Work Supporting Materials route

`app/api/works/[workId]/files/route.ts` exposes:

- `GET`: returns work-linked supporting materials for the authenticated workspace.
- `POST`: creates a new work-linked supporting material reference for the authenticated workspace.

The route:

- validates `workId` as UUID;
- resolves workspace context through `getAuthenticatedWorkspaceContext`;
- passes `workspaceId` and `createdByUserId` into service logic;
- returns source/mode metadata on both success and error.

### Work Supporting Materials service

`src/lib/work-files/work-supporting-materials-service.ts`:

- verifies the work belongs to the workspace before read/write;
- validates `file_name` and `file_category`;
- accepts optional `reference_text` and `notes`;
- returns a response with `success`, `materials`, `source`, `mode`, and disclaimer.

### Work Supporting Materials repository

`src/lib/work-files/work-supporting-materials-repository.ts`:

- reads from `file_vault_links` joined to `file_vault_items`;
- filters by `linked_record_type = 'musical_work'`;
- filters by `linked_record_id = workId`;
- creates records through a SQL CTE that inserts:
  - one `file_vault_items` row;
  - one `file_vault_links` row;
  - one `file_vault_audit_events` row.

### File Vault schema

`supabase/migrations/20260507193358_file_vault_schema.sql` defines:

- `file_vault_items`
- `file_vault_links`
- `file_vault_versions`
- `file_vault_audit_events`

These are workspace-scoped and include metadata JSON.

### File Vault service helpers

`src/lib/file-vault/createFileVaultItem.ts` inserts item metadata and writes `file.created` audit events.

`src/lib/file-vault/linkFileVaultItem.ts` links a file vault item to any record type/id and writes `file.linked` audit events.

`src/lib/file-vault/addFileVaultVersion.ts` inserts version records and writes `file.version.added` audit events.

### Work completeness

`src/lib/work-readiness/work-completeness-repository.ts` aggregates:

- total supporting material count;
- split-sheet reference count;
- contributor/split data;
- work basics and creative truth.

`src/lib/work-readiness/get-work-completeness.ts` uses those facts to include a `supporting_materials` category. It treats missing material references and split-sheet references as operational completeness visibility, not evidence verification.

## 4. Existing frontend/data usage found

`app/dashboard/works/details/[workId]/page.tsx` currently:

- defines `WorkSupportingMaterial` with:
  - `id`
  - `link_id`
  - `file_name`
  - `file_category`
  - `reference_status`
  - `reference_text`
  - `notes`
  - `created_at`
- loads supporting materials via `fetch('/api/works/${workId}/files')`;
- creates supporting material references via `POST /api/works/${workId}/files`;
- sends only:
  - `file_name`
  - `file_category`
  - `reference_text`
  - `notes`
- displays count, category, material name, reference text, notes, and a "Not verified" badge;
- tells the user the form captures a workspace reference only and does not upload a file or verify evidence;
- displays the disclaimer: supporting materials are not verified and do not confirm legal clearance or submission readiness;
- uses supporting material count in outcome/context progress and sufficiency labels.

Frontend implication:

The UI is already aligned with a metadata-reference model. It does not expose storage, versioning, visibility, public-safe state, purpose, evidence conversion, archive, or delete behavior.

## 5. Existing supporting-material contract

Current type contract:

- source: `canonical_work_supporting_materials_v1`
- mode: `supporting_materials`
- categories:
  - `contract`
  - `identity_kyc`
  - `proof_of_ownership`
  - `split_sheet`
  - `master_audio`
  - `artwork`
  - `release_document`
  - `compliance`
  - `invoice`
  - `statement`
  - `other`
- material fields:
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
- create input:
  - `file_name`
  - `file_category`
  - `reference_text`
  - `notes`

Current write behavior:

- creates `storage_provider = 'manual_reference'`;
- creates `storage_path = 'manual-reference:<uuid>'`;
- sets `file_mime_type`, `file_size_bytes`, `storage_bucket`, and `checksum` to null;
- writes `file_vault_items.metadata`:
  - `referenceStatus: reference_only`
  - `verificationStatus: not_verified`
  - `referenceText`
  - `notes`
  - `sourceModule: works`
  - `linkedRecordType: musical_work`
  - `linkedRecordId`
  - `createdByUserId`
  - `realFileUpload: false`
  - `productionEvidenceGovernance: false`
- writes `file_vault_links.metadata`:
  - `sourceModule: works`
  - `referenceOnly: true`
  - `notVerified: true`
- writes `file_vault_audit_events.event_type = 'work.supporting_material.reference_created'`.

Conclusion:

The current contract already supports "song owns a file/material reference" in a safe, non-upload, non-evidence way.

## 6. File Vault / Evidence Vault overlap

File Vault and Supporting Materials:

- own operational file/reference organization;
- attach materials to records through linked records;
- store storage metadata and flexible JSON metadata;
- support versions and audit events at table/helper level;
- are not currently an evidence verification system.

Evidence Vault / Registration Evidence:

- owns governed evidence state;
- uses evidence type, layer, requirement level, verification status, expiry, supersession, related entity, and audit events;
- supports readiness/evidence evaluation;
- has transition/supersession logic;
- is documented as separate from File Vault.

Overlap:

- both care about file/material/evidence-like objects;
- both support related entity IDs;
- both can carry metadata;
- both can produce audit events.

Boundary:

Supporting materials can be evidence-adjacent or evidence candidates, but should not become verified evidence unless a governed bridge to Evidence Vault is explicitly designed. A split sheet reference in File Vault is not the same thing as verified split confirmation in Evidence Vault.

## 7. Existing fields and metadata available

### First-class File Vault fields

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
- `metadata`
- `created_at`
- `updated_at`

`file_vault_links`:

- `id`
- `workspace_id`
- `file_vault_item_id`
- `linked_record_type`
- `linked_record_id`
- `link_role`
- `metadata`
- `created_at`

`file_vault_versions`:

- `id`
- `workspace_id`
- `file_vault_item_id`
- `version_number`
- `storage_path`
- `checksum`
- `metadata`
- `created_at`

`file_vault_audit_events`:

- `id`
- `workspace_id`
- `file_vault_item_id`
- `event_type`
- `event_summary`
- `event_payload`
- `created_at`

### Existing supporting-material metadata

Current metadata already stores:

- reference status;
- verification status;
- reference text;
- notes;
- source module;
- linked record type/id;
- created-by user id;
- real file upload flag;
- production evidence governance flag;
- reference-only flag;
- not-verified flag.

### Existing evidence fields

`RegistrationEvidence` / Evidence Vault supports:

- `evidenceType`
- `layer`
- `title`
- `description`
- `requirementLevel`
- `verificationStatus`
- `requiresSignature`
- `requiresVerification`
- `blocksSubmissionIfMissing`
- `uploadedBy`
- `uploadedAt`
- `expiryDate`
- `supersededByEvidenceId`
- `relatedEntityType`
- `relatedEntityId`
- `relatedSubmissionId`
- `metadata`
- evidence audit events

### Existing asset-governance vocabulary

TEST/internal asset governance contains useful vocabulary:

- asset type: audio, image, document, video, template, evidence, artwork, metadata, other;
- asset category: song_file, evidence_file, artwork, file_vault, template, project_asset, submission_package;
- status: draft, uploaded, linked, verified, rejected, archived, expired;
- linked entity type: song, submission, evidence, project, workspace, template, none.

This vocabulary is useful for planning, but the code is explicitly TEST/internal/admin only and should not be treated as production V1.

## 8. Missing V1 fields

Missing from the active work supporting-material contract:

- `purpose` or `material_purpose`;
- clear `asset_kind` beyond File Vault category;
- `reference_type` such as `reference`, `evidence_candidate`, `public_asset_candidate`, `source_material`, `export`;
- `visibility` such as `private`, `workspace_internal`, `public_safe_candidate`, `public_approved`;
- `public_safe_status`;
- `public_approved_at` / `public_approved_by`;
- `lineage_source_type` such as manual note, uploaded file, external location, generated output, export, signed document;
- `source_reference` or `external_locator`;
- `version_label` or surfaced version status;
- `archived_at` / `archived_by` / `archive_reason`;
- `superseded_by_file_vault_item_id` for supporting materials;
- `evidence_candidate_reason`;
- bridge field to a governed `RegistrationEvidence` record;
- `review_status` distinct from evidence verification;
- `usage_context` such as submission, release, catalogue, public page, licensing, internal admin.

Missing as backend behavior:

- no delete/archive route for work supporting material references;
- no version surfaced through `/api/works/[workId]/files`;
- no real upload/storage movement;
- no public-safe approval;
- no evidence promotion/bridge;
- no file access-control policy exposed through current route;
- no checksum/fingerprint use in the active work material path.

## 9. Can V1 be refined without schema changes?

Yes, likely.

The existing File Vault schema provides enough JSON metadata space to refine V1 contract semantics without immediate schema work. A conservative V1 could store the following in `file_vault_items.metadata` and/or `file_vault_links.metadata`:

- `materialPurpose`
- `referenceType`
- `visibility`
- `publicSafeStatus`
- `usageContext`
- `lineageSourceType`
- `sourceReference`
- `evidenceCandidateReason`
- `reviewStatus`

The route response could later expose selected metadata fields if approved, but this inspection did not implement that.

Important constraint:

Schema-free refinement is acceptable only if the contract is documented first and the metadata keys are stable. Free-form metadata without a documented contract will create drift.

Cases that may eventually justify schema changes:

- querying/filtering many works by visibility, purpose, public-safe state, or review state;
- enforcing public/private access at database policy level;
- linking supporting materials to Evidence Vault records;
- lifecycle/archive/supersession rules requiring strong constraints;
- real storage/provider integration;
- public feed generation.

## 10. Risks of creating a new parallel subsystem

Creating a new Asset Intelligence subsystem now would risk:

- duplicating File Vault item/link/version/audit behavior;
- creating a second "file attached to work" concept beside existing supporting materials;
- splitting completeness/readiness logic across competing sources;
- confusing supporting references with verified evidence;
- bypassing File Vault audit events and linked-record strategy;
- introducing another persistence domain despite the canonical persistence warning against new parallel systems;
- making public-safe fields appear active before public-feed governance exists;
- creating future migration debt from two file/material models;
- weakening the current product promise that File Vault and Supporting Materials remain useful as standalone reference surfaces.

## 11. Recommended smallest next step

Create a small V1 architecture contract doc before implementation.

Recommended doc:

`docs/platform/ASSET-INTELLIGENCE-V1-CONTRACT.md`

It should define only:

- the current V1 boundary;
- which existing tables and services remain canonical;
- supported material categories;
- approved metadata keys;
- reference vs evidence-candidate semantics;
- private/public-safe visibility semantics;
- response fields to expose later;
- what must remain disclaimer-only;
- what is explicitly deferred.

After that, the smallest implementation slice, if approved later, should refine the existing Work Supporting Materials contract rather than add a new route or table.

## 12. Deferred items

Defer:

- schema changes;
- new APIs/routes;
- UI changes;
- real file upload;
- storage buckets/provider movement;
- public CDN;
- public-safe feed;
- Chronicle integration;
- evidence promotion bridge;
- Evidence Vault mutation flow from supporting materials;
- archive/delete/version UI;
- OCR/document parsing;
- AI evidence verification;
- approval engine;
- graph/lineage engine;
- submission gating;
- royalty/payout eligibility;
- automated licensing workflows.
