# Existing Supporting Materials / Asset Audit

Date: 2026-05-28

Status: Read-only cross-system audit. No runtime implementation performed.

## 1. Executive Summary

Sentry Sound should refine and align existing supporting-material structures before designing anything new for Asset Intelligence V1.

The current system already contains a practical metadata-reference layer for song-attached supporting materials, a File Vault foundation, evidence/readiness concepts, asset governance test utilities, work completeness logic, and a documented future public-safe catalogue feed direction. Across Plexicon, M-WIS, Sentry Sound Academy, and Chronicle, the strongest reusable pattern is consistent: files are not truth by themselves. The reusable intelligence lives in lineage, category, purpose, evidence status, visibility, readiness context, and human/governance approval.

Asset Intelligence V1 should therefore stay bounded:

- reuse the existing work supporting-materials / File Vault foundation;
- make the reference-vs-evidence distinction explicit;
- preserve private/public-safe visibility boundaries;
- connect supporting materials to work completeness without claiming legal clearance;
- defer large storage, graph, OCR, AI verification, approval engines, and public feeds until backend contracts are inspected and approved.

## 2. Sources / Folders Inspected

Available folders inspected:

- `C:\Users\Euan Smith\Desktop\SentrySound`
- `C:\Users\Euan Smith\Desktop\SentrySound\sentry-sound-system`
- `C:\Users\Euan Smith\Desktop\Plexicon`
- `C:\Users\Euan Smith\Desktop\M-WIS`
- `C:\Users\Euan Smith\Desktop\SENTRY_SOUND_ACADEMY`
- `C:\Users\Euan Smith\Desktop\CHRONICLE MUSIC PUBLISHING`
- `C:\Users\Euan Smith\Desktop\StudyEdge`
- `C:\Users\Euan Smith\Desktop\studyedge`

Unavailable requested folders:

- `C:\Users\Euan Smith\Desktop\MWIS`
- `C:\Users\Euan Smith\Desktop\SentrySoundAcademy`
- `C:\Users\Euan Smith\Desktop\ChronicleMusic`
- `C:\Users\Euan Smith\Desktop\Chronicle Music`

Notes:

- `StudyEdge` and `studyedge` are available, but no top-level `docs` folders were present in those two folders during this audit. Their broad search produced dependency noise and did not add a focused Sentry Sound Asset Intelligence V1 finding.
- `M-WIS`, `SENTRY_SOUND_ACADEMY`, and `CHRONICLE MUSIC PUBLISHING` are the available local folder names corresponding to the requested MWIS, Academy, and Chronicle concepts.

## 3. Existing Sentry Sound Structures

| Path | Concept found | Relevance to Asset Intelligence V1 | Reuse potential | Caution / risk |
| --- | --- | --- | --- | --- |
| `docs/modules/file-vault/FILE-VAULT.md` | File Vault as secure document and asset-file layer for contracts, KYC, proof, split sheets, masters, artwork, release files, and compliance evidence. Includes workspace scoping, linked records, versions, audit events, and storage-provider abstraction. | Strong foundation for asset/supporting-material thinking. | Reuse as V1 structural base. | Do not imply actual upload, verification, clearance, OCR, or AI analysis from this layer. |
| `src/lib/work-files/work-supporting-materials.types.ts` | Work Supporting Materials V1 types and categories: contract, proof_of_ownership, split_sheet, master_audio, artwork, compliance, invoice, statement, other. Includes `reference_only` / `not_verified` posture and disclaimer. | Direct V1 candidate. | Reuse categories, response mode, disclaimer, and reference-only contract. | Missing purpose/visibility/evidence distinction beyond current metadata. |
| `src/lib/work-files/work-supporting-materials-service.ts` | Service validates work ownership, payload, category, and returns song-attached supporting-material references. | Existing service boundary for current V1 behavior. | Refine rather than replace. | Does not upload files, verify evidence, or establish storage strategy. |
| `src/lib/work-files/work-supporting-materials-repository.ts` | Stores manual references into `file_vault_items`, links them to `musical_work`, sets `storage_provider = manual_reference`, and writes audit events. | Shows a working "file as operational reference object" pattern. | Keep as metadata-reference layer. | Current `storage_path` is a manual-reference placeholder, not a real file path. |
| `app/api/works/[workId]/files/route.ts` | `GET` and `POST` route for work supporting materials under workspace context. | Existing API surface for song-attached material records. | Inspect/refine contract next if V1 proceeds. | Do not expand behavior before backend contract review. |
| `app/dashboard/works/details/[workId]/page.tsx` | Song Detail page has a Supporting Materials tab/section that loads references, adds metadata-only references, and displays reference-only disclaimers. | Existing UI confirms product intent. | Reuse mental model and copy boundary. | User-facing labels must not imply legal verification or readiness approval. |
| `src/lib/work-readiness/get-work-completeness.ts` | Completeness read model includes `supporting_materials`, supporting material reference count, and split-sheet reference review. | Shows supporting materials already influence operational completeness. | Reuse as read-only visibility input. | Completeness is not legal, evidence, royalty, or submission approval. |
| `app/api/works/[workId]/completeness/route.ts` | Read-only completeness endpoint for work detail. | Existing consumer path for completeness. | Reuse as visibility source. | Avoid turning completeness into approval or gate without governance. |
| `docs/modules/evidence-vault/EVIDENCE-VAULT-V1.md` | Evidence Vault doctrine: evidence classification, verification, supersession, readiness impact, submission-pack inclusion; defers UI upload, storage integration, OCR, AI verification, signing integrations. | Separates evidence from supporting references. | Align V1 to this boundary. | Do not collapse supporting materials into verified evidence. |
| `prisma/schema.prisma` | `RegistrationEvidence` model includes evidence type, layer, requirement level, verification status, signature/verification flags, blocker flag, upload metadata, expiry, supersession, related entity, metadata, audit events. | Existing governed evidence concept. | Reference for future evidence bridge. | It is a parallel/governed domain; canonical operational persistence alignment must be respected. |
| `src/lib/evidence-vault/evaluateEvidencePackReadiness.ts` | TEST read-only evidence pack readiness evaluation with blocker/warning semantics and diagnostic preview events. | Useful for future evidence-aware Asset Intelligence, not V1 storage. | Reuse the fail-closed, policy-versioned, read-only posture conceptually. | TEST_READ_ONLY; not a production approval engine. |
| `src/lib/assets/asset-governance.ts` | Test-internal asset model with asset type, category, status, linked entity, tags, storage path, metadata, audit and lifecycle event. Explicitly says no real upload/storage movement. | Useful vocabulary for asset categories/statuses. | Borrow vocabulary carefully. | TEST/internal/admin only; do not activate as production Asset Intelligence. |
| `docs/platform/HOSTED-PUBLIC-MUSIC-PAGES-MODULE.md` | Future public-safe feed and hosted public music pages direction: approved public-safe data, cover artwork, preview audio, licensing status, public/private visibility, private rights boundary. | Defines public presentation boundary for future assets. | Reuse as visibility/public-safe doctrine. | No public API/schema/feed is approved yet. |
| `docs/platform/CANONICAL-PERSISTENCE-DIRECTION.md` | Current lowercase operational model is active canonical seed; no new major operational tables until persistence alignment stabilizes. | Important V1 boundary. | Build on current operational seed first. | Avoid new parallel persistence systems. |
| `docs/platform/OPERATIONAL-OWNERSHIP-VS-RIGHTS-OWNERSHIP.md` | Separates platform actor/workspace from rights ownership and authority evidence. | Critical for evidence, split sheets, agreements, licensing. | Reuse governance language. | Supporting material existence cannot prove rights ownership. |
| `docs/governance/WORK-DETAIL-FLOW-REALIGNMENT-DESIGN-PASS.md` | Maps completeness gaps to resolution paths and keeps supporting materials reference-only. | UX alignment input. | Reuse for next UI refinement after architecture. | Design pass only; no current implementation authorization. |
| `docs/platform/DASHBOARD-CAPABILITY-ALIGNMENT-MATRIX.md` | File/evidence areas are partial/deferred; evidence upload/link workflow deferred. | Confirms current limitations. | Reuse to prevent fake dashboard capability. | Do not represent future evidence/upload as live. |

## 4. Plexicon Relevant Concepts

Relevant Plexicon sources inspected included:

- `Plexicon\02_REPOSITORIES\plexicon-contracts\docs\strategy\PLEXICON-CENTRAL-SOURCE-OF-TRUTH.md`
- `Plexicon\02_REPOSITORIES\plexicon-contracts\docs\review-cycles\shared-doctrine-and-semantic-alignment\STEP-3-SYSTEM-ALIGNMENT-MAPS-V0.md`
- `Plexicon\02_REPOSITORIES\plexicon-contracts\docs\review-cycles\asset-system-boundary\ASSET-LINEAGE-AS-GOVERNED-MEMORY-PRINCIPLE-V0.md`
- `Plexicon\02_REPOSITORIES\plexicon-contracts\docs\review-cycles\operational-execution-framework\OPERATIONAL-UX-DOCTRINE-AND-HUMAN-OPERATIONAL-INTERFACE-PRINCIPLES-V0.md`

Applicable concepts:

- Lineage-aware retrieval: assets should be retrieved as governed bundles, not isolated files.
- Storage/truth separation: storage holds binaries; storage pointers do not own semantic truth.
- Evidence vs reference: observed material, telemetry, or rendered output may support review, but does not automatically become verified evidence.
- Telemetry as evidence, not truth: usage or post-deployment signals can support review, not self-authorize decisions.
- Governance-gated progression: generated outputs, public usage, evidence verification, and approvals require human/governance review.
- Public/private boundary: deployments must prevent private operational evidence, rights data, and internal admin notes from leaking into public surfaces.
- Product-first UX: backend truth should be translated into human-usable state, gaps, warnings, and next actions rather than forcing users to operate the doctrine directly.

Asset Intelligence V1 implication:

Sentry Sound should treat supporting materials as local music/workflow context with lineage and visibility. It should not treat binary storage, generated media, or metadata presence as proof of rights, evidence verification, public approval, or canonical Plexicon doctrine.

## 5. MWIS Relevant Concepts

Relevant M-WIS sources inspected included:

- `M-WIS\Marketing\01-Identity-Pillar\IDENTITY-ASSET-REGISTRY.md`
- `M-WIS\docs\strategy\OPERATIONAL-EVIDENCE-ARCHITECTURE.md`
- `M-WIS\docs\strategy\REVIEW-PACK-ARCHITECTURE.md`
- `M-WIS\platform-profiles\PLATFORM-PROFILES.md`
- `M-WIS\campaigns\MWIS-CAMPAIGN-001-IDENTITY-FOUNDATION.md`

Concepts that may inform Sentry Sound:

- Public profile assets need asset IDs, purpose, platform usage, approval/export status, source prompt or source-file reference, export filename, and caption/copy status.
- Asset approval is incomplete without lineage. M-WIS explicitly treats source prompt reference and export filename as required lineage evidence.
- Review packs bundle evidence, blockers, linked assets, risks, AI recommendations, and human decision fields without becoming final approval.
- Platform readiness separates profile readiness, brand readiness, asset readiness, caption/copy readiness, platform-format readiness, approval readiness, and deployment eligibility.
- Public identity is controlled and music-first; platform profile state should not be guessed from folder existence.

Asset Intelligence V1 implication:

M-WIS supports adding `purpose`, `platform/use context`, `source/reference`, `export/version`, and `approval/readiness posture` later. For V1, Sentry Sound can reuse the idea that an asset/supporting material record should make purpose and lineage visible, but should defer campaign review packs and deployment eligibility machinery.

## 6. Sentry Sound Academy Relevant Concepts

Relevant Academy sources inspected included:

- `SENTRY_SOUND_ACADEMY\09_LEARNER_OPERATIONS\Evidence_Packs\EVIDENCE_PACK_STRUCTURE.md`
- `SENTRY_SOUND_ACADEMY\07_PLATFORM_INTEGRATIONS\Sentry_Sound\PROOF_OF_WORK_PHILOSOPHY.md`
- `SENTRY_SOUND_ACADEMY\06_STUDYEDGE_INTEGRATION\Academy_Bridge.prisma`
- `SENTRY_SOUND_ACADEMY\04_MODULE_DEVELOPMENT\V01_CREATIVE_MASTERY\M01_DAW_FUNDAMENTALS\Syllabus.md`

Concepts that may inform Sentry Sound:

- Evidence packs have stable identifiers and references: learner/module/lesson/competency/assessment plus SLM/SLB/validation event references, submitted artifact, assessor notes, remediation history, timestamp, and status.
- Evidence statuses include draft, submitted, assessed, remediation_required, validated, moderated, certified, and archived.
- Proof-of-work should be traceable, competency-aware, operationally meaningful, and verification-aware.
- Platform-linked evidence may include uploads, fingerprints, validation events, and portfolio/proof outputs.

Asset Intelligence V1 implication:

Academy reinforces the need for structured evidence objects and artifact references. Sentry Sound V1 should not import Academy competency/certification semantics, but it can align with the pattern that evidence requires status, source references, validation context, and auditability.

## 7. Chronicle Relevant Concepts

Relevant Chronicle sources inspected included:

- `CHRONICLE MUSIC PUBLISHING\17_Marketing_Press\Website\docs\website\WEBSITE_STRUCTURE.md`
- `CHRONICLE MUSIC PUBLISHING\17_Marketing_Press\Website\docs\website\BRAND_GUIDE.md`
- `CHRONICLE MUSIC PUBLISHING\17_Marketing_Press\Website\lib\catalogue.ts`
- `CHRONICLE MUSIC PUBLISHING\17_Marketing_Press\Website\lib\artists.ts`
- `CHRONICLE MUSIC PUBLISHING\17_Marketing_Press\Website\public\assets\branding\ASSET_MANIFEST.json`

Concepts that may inform Sentry Sound:

- Chronicle has a static public catalogue model with title, artist, genre, duration, status, publishing owner, notes, and artwork.
- Chronicle has static artist profiles with slug, name, descriptor, biography, image, represented-by, publishing focus, rights metadata, and streaming link placeholders.
- Chronicle public assets are organized by branding, hero, catalogue, icons, and textures, with intended-use metadata in an asset manifest.
- The website is explicitly static and excludes backend, authentication, dashboards, CMS, and connected forms.
- Chronicle is a public presentation layer, not Sentry Sound operational truth.

Asset Intelligence V1 implication:

Chronicle validates future public-safe catalogue presentation, cover art, artist profiles, and licensing/contact flows. It should inform public-safe read-model shape later, but V1 should not create public feeds or direct Chronicle integration.

## 8. Existing Overlaps To Reuse

Concrete overlaps Sentry Sound should reuse or refine:

- Work-attached supporting material references already exist through `GET/POST /api/works/[workId]/files`.
- File Vault already provides workspace scoping, linked records, version awareness, audit events, storage-provider abstraction, and core material categories.
- Work completeness already counts supporting material references and split-sheet references.
- Evidence Vault already defines a separate governed evidence layer; supporting materials should not replace it.
- Hosted Public Music Pages documentation already defines public-safe feed boundaries, public/private filtering, cover artwork, preview audio, and protected operational data exclusions.
- M-WIS asset registry provides a practical lineage vocabulary: asset ID, purpose, platform usage, status, export status, source prompt/source file, export filename, and caption status.
- Academy evidence packs provide a stable proof-bundle pattern with submitted artifact, validation reference, remediation history, and status.
- Chronicle provides public presentation fields for catalogue cards, artist profiles, artwork, licensing/contact pathways, and asset intended-use manifests.
- Plexicon provides the cross-system doctrine: files are outputs, not truth; storage holds binaries; lineage and review preserve intelligence.

## 9. Missing V1 Pieces

Likely missing for Sentry Sound Asset Intelligence V1:

- Explicit `purpose` or `material_purpose` beyond file category.
- Clear reference vs evidence classification at the supporting-material record level.
- Visibility classification: private, workspace/internal, public-safe candidate, public-approved.
- Public-safe eligibility status and approval state are not active.
- Real file upload and storage movement are not part of current Work Supporting Materials V1.
- File versioning is available in File Vault, but not surfaced through work supporting-material references.
- Evidence bridge from supporting material reference to governed `RegistrationEvidence` is not defined.
- Attachment deletion/archive/supersession behavior for work supporting materials is not visible in current V1.
- Review/approval workflow for assets is not active.
- No public feed/API/read model exists for Chronicle or hosted pages.
- No large media strategy exists for preview audio, public CDN, protected evidence files, or cover art governance.
- No OCR, AI analysis, document parsing, or automatic evidence verification.

## 10. V1 Boundary Recommendation

First practical Asset Intelligence V1 should include:

- song-attached supporting material records;
- category and purpose;
- `reference` vs `evidence_candidate` distinction, without verification;
- visibility state: private/internal by default, optional public-safe candidate later;
- reference text, notes, source/context, and optional external/manual locator;
- reuse of existing File Vault link model and audit behavior;
- explicit disclaimers that references are not verified evidence, legal clearance, submission readiness, or rights proof;
- completeness integration as operational visibility only.

V1 should not create a new large storage strategy unless backend inspection confirms existing storage contracts are ready. Current implementation already has `manual_reference` metadata behavior; that is enough for a bounded V1 refinement.

## 11. What To Defer

Defer:

- real file upload UX;
- storage bucket design;
- public CDN/media delivery;
- preview audio hosting;
- cover-art publication pipeline;
- OCR/document parsing;
- AI evidence verification;
- graph/relationship intelligence;
- approval engines;
- review pack engine;
- evidence supersession UI;
- public-safe feed/API;
- Chronicle runtime integration;
- royalty/payout eligibility logic;
- submission automation;
- licensing automation;
- cross-repository import or architecture migration.

## 12. Candidate Intelligence Log Check

No new candidate intelligence entry was added to `docs/governance/PLEXICON-CANDIDATE-INTELLIGENCE-LOG.md`.

Reason:

- The audit found strong alignment with already documented Plexicon/M-WIS/Sentry Sound patterns: lineage, evidence vs truth, storage/truth separation, public/private discipline, and reference-only supporting materials.
- The findings are immediately useful for Sentry Sound Asset Intelligence V1, but the audit did not establish a newly tested reusable primitive that should be promoted into the local candidate log.

## 13. Recommended Next Action

Recommended next Codex step:

Backend contract inspection for Asset Intelligence V1.

Scope:

- inspect `file_vault_items`, `file_vault_links`, `file_vault_versions`, and current work supporting-material service behavior;
- confirm whether category/purpose/visibility/reference-vs-evidence can be refined through existing metadata without schema changes;
- document a small V1 architecture contract before any schema, route, UI, upload, or storage work.

After that, create a V1 architecture doc. Schema design should come later only if the contract inspection proves metadata-only refinement is insufficient.
