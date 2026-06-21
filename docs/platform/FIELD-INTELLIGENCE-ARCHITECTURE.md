# Field Intelligence Architecture

## 1. Purpose

This document defines how Sentry Sound treats capture fields as strategic business intelligence assets, not as simple form inputs.

Music metadata is not administrative overhead. It is the intelligence layer of the music business.

Every field captured by Sentry Sound should have a clear reason to exist. Some fields create the operational record. Some fields power rights readiness. Some fields support marketing, catalog discovery, analytics, royalty routing, playlist positioning, sync/licensing opportunities, release strategy, and future AI-assisted workflows.

This document is architecture guidance only. It does not activate production governance, add schema, change UI, or create migrations.

## Canonical Operational Model Alignment

The approved canonical model decision is:

- the lowercase operational model is the living product seed.
- `musical_works`, `assets`, `contributors`, and `work_contributors` are the active canonical seed for current Works/Songs UX.
- Prisma must conform to the canonical operational schema and must not create competing business truth.
- Prisma `MusicalWork` is legacy/parallel until aligned.
- `/api/test/get-work` is a temporary TEST read model.

Field intelligence must attach to the canonical operational model. User-entered creative truth currently belongs to `musical_works` through dedicated fields such as `themes` and structured metadata such as `metadata.work_intelligence_v1.creative_truth`.

Generated commercial intelligence belongs separately under system insight/action structures. AI outputs must not overwrite or masquerade as user-entered creative truth.

## Permanent Platform Principle - AI/System Outputs Are Not Editable User Truth

AI/system outputs are not editable user truth.

User-entered creative truth must remain separate from system-generated insights. AI recommendations must not overwrite user-provided facts. Commercial intelligence must be generated and stored as system output, while user fields remain factual and creative inputs.

Future AI outputs may be reviewed, accepted, rejected, or converted into actions, but they must not silently become user-entered truth.

Official identifiers require future structured storage. They must not live only in `metadata`:

- ISWC is work/composition-level.
- ISRC is recording/master-level.
- SAMRO/CAPASSO/distributor references must be mapped to canonical internal records and source/audit history.

No official identifier table, ISWC/ISRC capture UI, or submission-return automation is activated by this document.

## 2. Current Source Inspection

Current field usage was inspected across:

- `app/dashboard/works/new/page.tsx`
- `app/dashboard/works/list/page.tsx`
- `src/lib/registration/contracts/create-song-contract.ts`
- `src/lib/registration/contracts/musical-work-contract.ts`
- `src/lib/registration/services/create-song-with-contributors.ts`
- `sql/platform/rpc_create_song_with_contributors.sql`
- `supabase/migrations/002-song-metadata-expansion.sql`
- `supabase/migrations/003-contributors-system.sql`
- `src/lib/contributors/contributor-governance.ts`
- `app/api/test/get-work/route.ts`
- `app/api/submissions/readiness/route.ts`

Current V1 Add Work uses a small in-page field registry that tags fields by operational importance. This document expands that concept into a canonical platform architecture.

## 3. Field Categories

### A. Operational Identity Fields

Fields that identify and organize a work inside the platform.

Examples:

- `work_title`
- `alternative_title`
- `internal_code`
- `catalogue_number`
- `version_label`
- `work_id`
- `asset_id`

### B. Rights & Ownership Fields

Fields that identify who contributed, what role they played, and how ownership or participation is represented.

Examples:

- `contributors.name`
- `contributors.role`
- `contributors.contributor_id`
- `contributors.split_type`
- `contributors.percentage`
- `composer_names`
- `lyricist_names`
- `publisher_name`
- `publisher_share`
- `composer_split_total`
- `lyric_split_total`
- `split_sheet_status`

### C. Metadata / Discovery Fields

Fields that help users find, classify, group, pitch, and understand works.

Examples:

- `genre`
- `sub_genre`
- `mood`
- `themes`
- `tags`
- `language`
- `content_theme`

### D. Marketing Intelligence Fields

Fields that can later support release planning, audience segmentation, campaign logic, and promotional positioning.

Examples:

- `genre`
- `mood`
- `tags`
- `themes`
- `release_date`
- `usage_tag`
- `available_for_api`

### E. AI Enrichment Fields

Fields that may later be AI-assisted or AI-generated, but should not be invented as backend truth without user confirmation.

Examples:

- suggested mood
- suggested genre/sub-genre
- suggested tags
- suggested themes
- marketing copy hints
- playlist fit hints
- sync/licensing fit hints

### F. Compliance / Readiness Fields

Fields that help determine whether a work is ready for review, evidence, submission, or downstream workflow steps.

Examples:

- `registration_status`
- `copyright_status`
- `copyright_claimant`
- `copyright_year`
- `copyright_notice`
- `copyright_pack_url`
- `copyright_evidence_notes`
- `copyright_submitted_at`
- `copyright_confirmed_at`
- `split_sheet_status`
- contributor confirmation state
- readiness score
- readiness blockers

### G. System-Managed Linkage Fields

Fields that should never be manually typed by users in normal capture flows.

Examples:

- `work_id`
- `asset_id`
- `contributor_id`
- `workspace_id`
- `actor_user_id`
- timestamps
- audit event ids
- lifecycle event ids
- submission queue ids

### H. Future Integration Fields

Fields that support industry interoperability, commercial systems, and external workflow integrations.

Examples:

- `ISWC`
- `ISRC`
- society affiliation
- IPI/CAE
- PRO affiliation
- submission target
- regulator/body reference
- distribution/release identifiers
- API handle
- license status

## 4. Canonical Field Map

| Field | Status | Current Use | User/System | Operational Purpose | Strategic Value | Future AI/Intelligence Use | Marketing/Discovery Use | Compliance/Royalty Use | Future Integrations | V1 Placement |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `work_id` | existing | Returned by `rpc_create_song_with_contributors`; `musical_works.id` | system-managed | Links the saved work to all future operations | Stable identity for catalog, readiness, submissions, analytics | Entity anchor for AI summaries and recommendations | Work-level campaign/report linkage | Submission/readiness/royalty linkage | External identifiers, APIs, exports | hidden/system-managed |
| `asset_id` | existing | Returned by RPC; inserted into `assets` | system-managed | Links work to asset/file/catalog layer | Unifies music asset with files, evidence, operations | AI can reason over asset context later | Asset/package grouping | Evidence and file association | File vault, API, sync/licensing | hidden/system-managed |
| `workspace_id` | partial | Present in foundation systems, not current create-song RPC | system-managed | Scopes work to operational account | Tenant-safe analytics and dashboard reporting | Workspace-aware recommendations | Workspace campaign segmentation | Production ownership/scope requirement | Billing, API, enterprise | hidden/system-managed; production gap |
| `actor_user_id` | partial | Present in audit/lifecycle contracts, not current create-song RPC | system-managed | Records who performed an action | Operational accountability | User-aware guidance and task suggestions | Team activity insight | Audit/governance | Audit exports, enterprise controls | hidden/system-managed; production gap |
| `work_title` | existing | V1 Add Work; create-song contract; `musical_works.work_title` | user-facing | Names the work | Core catalog identity | Duplicate detection, title normalization suggestions | Search, display, pitching | Work registration naming | Exports and industry submissions | V1 now |
| `alternative_title` | planned/partial | In test orchestration/future contracts, not current create-song API | user-facing later | Captures alternate names | Prevents duplicate confusion and improves matching | Alias detection | Search and catalog discovery | Submission packaging | Society/registry matching | later workflow step |
| `genre` | existing | V1 Add Work; create-song contract; `musical_works.genre` | user-facing | Classifies the work broadly | Segmentation and catalog grouping | Recommendation and similarity logic | DSP targeting, playlists, audience planning | Reporting by catalog segment | Marketing, analytics, sync | V1 now |
| `sub_genre` | existing column/planned UI | `musical_works.sub_genre` | user-facing later or AI-assisted | Adds finer classification | Better catalog precision | AI-assisted genre refinement | Playlist and campaign targeting | Reporting granularity | DSP/sync metadata | AI-generated later with confirmation |
| `mood` | existing | V1 Add Work; create-song contract; `musical_works.mood` | user-facing | Captures emotional/creative positioning | Sync/licensing and playlist fit | Mood clustering, recommendation context | Playlist matching, campaign tone, sync pitch | None directly, but supports packaging | Sync, playlist, discovery tools | V1 now |
| `themes` | existing column/planned UI | `musical_works.themes` | user-facing later or AI-assisted | Describes subject matter | Deeper creative intelligence | Theme extraction and content grouping | Sync briefs, playlist stories, campaigns | May support evidence/context notes | Sync/licensing search | AI-generated later |
| `tags` | existing column/planned UI | `musical_works.tags` | user-facing later or AI-assisted | Flexible catalog labels | Cross-module discovery | Auto-tagging and similarity | Campaign, playlist, CRM segmentation | Operational reporting | API/discovery integrations | AI-generated later |
| `language` | partial | MusicalWork contract/test orchestration, not current create-song API | user-facing later | Identifies language of work | Territory and audience intelligence | Territory-aware recommendations | Regional targeting, playlist fit | Society/territory readiness | DSP, society, reporting | later workflow step |
| `contributors.name` | existing | V1 Add Work; RPC resolves/creates contributors | user-facing | Identifies people/entities attached to work | Relationship intelligence and duplicate contributor matching | Contributor normalization suggestions | Team/network insights | Royalty routing and split readiness | PRO, IPI, contributor portals | V1 now |
| `contributors.role` | existing | V1 Add Work; `contributors.role`; `work_contributors.role` | user-facing | Captures creative/business role | Role-based catalog and relationship intelligence | Role normalization and missing-role detection | Contributor highlights and campaign credits | Royalty and registration logic | Society/registry contributor roles | V1 now |
| `contributors.contributor_id` | existing/optional | Existing contributor id can be passed to RPC | system-managed | Reuses known contributor records | Prevents duplicate identities | Identity matching | CRM/contact intelligence | Royalty participant mapping | PRO/IPI matching | hidden/system-managed |
| `contributors.split_type` | existing | V1 uses `composition`; `work_contributors.split_type` | user-facing/simple V1 | Identifies what split is being captured | Separates composition/publishing/master later | Detects missing split layers | None directly | Royalty and rights layer separation | Rights admin systems | V1 now, limited |
| `contributors.percentage` | existing | V1 Add Work; create-song validation; `work_contributors.percentage` | user-facing | Captures allocation total | Core royalty/payment intelligence | Split anomaly detection | None directly | Royalty routing, disputes, readiness | Statements, payout, societies | V1 now |
| `confirmed` / contributor confirmation | existing column/planned workflow | `work_contributors.confirmed`; contributor governance | user action later/system state | Shows whether split/role has been confirmed | Trust and workflow visibility | Reminder/review recommendations | None directly | Readiness and dispute risk | Contributor portals, approvals | later workflow step |
| `publisher_name` | existing column/planned UI | `musical_works.publisher_name` | user-facing later | Captures publishing participant/admin context | Publisher/admin intelligence | Missing publisher/admin suggestions | Catalog packaging | Publishing share/royalty routing | Society and publishing integrations | later workflow step |
| `publisher_share` | existing column/planned UI | `musical_works.publisher_share` | user-facing later | Captures publishing share | Rights economics | Split validation suggestions | None directly | Publishing royalty routing | Publisher/society systems | later workflow step |
| `composer_split_total` | existing column/planned/system | `musical_works.composer_split_total` | system-derived later | Summarizes split layer | Fast readiness/reporting | Split quality checks | None directly | Royalty readiness | Reporting/export | hidden/system-managed or derived |
| `lyric_split_total` | existing column/planned/system | `musical_works.lyric_split_total` | system-derived later | Summarizes lyric split layer | Fast readiness/reporting | Split quality checks | None directly | Royalty readiness | Reporting/export | hidden/system-managed or derived |
| `split_sheet_status` | existing column/planned workflow | `musical_works.split_sheet_status` | user/system later | Tracks split sheet progress | Evidence readiness | Missing-document guidance | None directly | Readiness/compliance | Evidence/signature systems | later workflow step |
| `registration_status` | existing | V1 defaults to `draft`; table/list display | system/defaulted/user later | Tracks operational registration state | Workflow visibility | Next-step guidance | None directly | Submission readiness | Society/regulator workflows | hidden/defaulted in V1 |
| `copyright_status` | existing | V1 defaults to `draft`; table/list display | system/defaulted/user later | Tracks copyright posture | Readiness signal | Gap/blocker guidance | None directly | Compliance/readiness | Evidence/submission systems | hidden/defaulted in V1 |
| `copyright_claimant` | existing column/planned workflow | `musical_works.copyright_claimant` | user-facing later | Captures claimant/owner assertion | Legal/rights context | Inconsistency detection | None directly | Copyright readiness | Legal/evidence systems | later workflow step |
| `copyright_year` | existing column/planned workflow | `musical_works.copyright_year` | user-facing later | Captures copyright year | Registration packaging | Missing data detection | None directly | Copyright readiness | Registry/export | later workflow step |
| `copyright_notice` | existing column/planned workflow | `musical_works.copyright_notice` | user-facing later | Captures formal notice text | Legal packaging | Notice generation suggestions | None directly | Copyright readiness | Contract/registry packages | AI-assisted later |
| `copyright_pack_url` | existing column/planned evidence | `musical_works.copyright_pack_url` | system/user later | Links supporting pack | Evidence readiness | Evidence gap detection | None directly | Submission/evidence readiness | File vault/evidence systems | later workflow step |
| `copyright_evidence_notes` | existing column/planned evidence | `musical_works.copyright_evidence_notes` | user-facing later | Captures evidence context | Operational memory | Evidence summarization | None directly | Evidence readiness | Legal/evidence review | later workflow step |
| `copyright_submitted_at` | existing column/planned lifecycle | `musical_works.copyright_submitted_at` | system-managed later | Tracks submission time | Lifecycle analytics | Delay/next-step guidance | None directly | Submission lifecycle | Registry/body integrations | hidden/system-managed |
| `copyright_confirmed_at` | existing column/planned lifecycle | `musical_works.copyright_confirmed_at` | system-managed later | Tracks confirmation time | Lifecycle analytics | Follow-up recommendations | None directly | Compliance status | Registry/body integrations | hidden/system-managed |
| `ISWC` | partial/planned | Prisma MusicalWork and contracts; not current V1 create API | user-facing later/system verified | Industry work identifier | Global interoperability | Identifier validation/matching | Catalog trust | Society/rights readiness | CMO, publisher, registry systems | later workflow step |
| `ISRC` | partial/planned | Recording/test orchestration; not musical work V1 | user-facing later/system verified | Recording/master identifier | Links work to recording/release | Matching recordings to works | DSP/release intelligence | Master/neighboring rights | DSP/distribution systems | later recording workflow |
| `release_date` | partial/planned | Test orchestration, release modules | user-facing later | Plans campaign/release timing | Release strategy | Calendar/marketing recommendations | Campaign timing, PR, playlists | Royalty period context later | Distribution/marketing | later workflow step |
| `api_handle` | existing column/planned integration | `musical_works.api_handle` | system-managed later | Stable API reference | External access and integrations | API-driven recommendations | Discovery API | Not directly | Public/API integrations | hidden/system-managed |
| `usage_tag` | existing column/planned marketing | `musical_works.usage_tag` | user/AI later | Indicates use case | Commercial categorization | Sync/licensing suggestions | Campaign/sync targeting | Licensing readiness | Sync/licensing systems | AI-generated later |
| `license_status` | existing column/planned licensing | `musical_works.license_status` | user/system later | Tracks licensing posture | Commercial availability | Opportunity/risk guidance | Sync/licensing pipeline | Licensing compliance | Licensing platforms | later workflow step |
| `available_for_api` | existing column/planned integration | `musical_works.available_for_api` | system/admin later | Controls external availability | API/product governance | Eligibility checks | Public discovery | Rights clearance dependency | API, partners | hidden/system-managed |
| `metadata` | existing column | `musical_works.metadata` | system/user/AI later | Extensible metadata envelope | Future-proofing | AI enrichment storage after approval | Segmentation and reporting | Supplemental readiness context | Integrations | hidden/system-managed initially |

## 5. Strategic Field Value Examples

- `genre` is not just a dropdown. It supports recommendations, DSP targeting, playlist strategy, catalog segmentation, reporting, and search.
- `mood` is not decorative. It supports sync/licensing intelligence, playlist matching, campaign tone, and AI-assisted catalog grouping.
- `contributor roles` are not labels only. They support royalty routing, registration readiness, relationship intelligence, contributor portals, and split validation.
- `language` supports territory intelligence, regional marketing, playlist targeting, and future industry-body packaging.
- `release_date` supports campaign planning, calendar tasks, royalty-period context, and release strategy.
- `ISRC` and `ISWC` support global music ecosystem interoperability.
- `ownership splits` support royalty/payment intelligence, disputes, readiness, and contributor alignment.

## 6. Future Progressive Capture Structure

The product should keep UX simple while metadata depth grows underneath.

### Step 1: Core Work

Purpose:
Create the operational draft quickly.

Fields:

- work title
- genre
- mood
- contributors
- role
- split type
- percentage

Current status:
V1 now.

### Step 2: Creative Identity

Purpose:
Improve discovery, search, and creative understanding.

Fields:

- alternative title
- language
- sub-genre
- themes
- tags
- version label

Current status:
Later workflow step or AI-assisted later.

### Step 3: Commercial Intelligence

Purpose:
Support marketing, sync/licensing, playlist/discovery, and campaign planning.

Fields:

- usage tag
- release date
- target audience/territory later
- available for API/public discovery later
- license status

Current status:
Later workflow step.

### Step 4: Rights & Registration

Purpose:
Support submission readiness, copyright posture, and rights operations.

Fields:

- ISWC
- publisher/admin data
- society affiliation
- split sheet status
- copyright claimant
- copyright year
- copyright notice

Current status:
Later workflow step.

### Step 5: Release Intelligence

Purpose:
Connect works to recordings, releases, campaigns, and distribution.

Fields:

- ISRC
- linked recording
- release date
- release/project context
- distribution identifiers

Current status:
Future module.

### Step 6: AI / Marketing Intelligence

Purpose:
Use confirmed metadata and operational state to suggest next steps, not invent truth.

Possible outputs:

- suggested tags
- suggested mood/sub-genre
- duplicate warnings
- playlist fit
- sync fit
- campaign angle
- missing metadata suggestions
- readiness blocker explanations

Current status:
AI-generated later, with user confirmation and backend truth constraints.

## 7. Governance Rules

- Do not overload V1 capture. First capture should remain fast and guided.
- Do not ask users for system-managed identifiers.
- Do not treat workspace owner, capture user, contributor, and rightsholder as the same thing.
- Do not treat AI-suggested metadata as backend truth until confirmed.
- Do not present UI-derived TEST indicators as production compliance.
- Do not expand capture fields unless the field has a clear operational or strategic purpose.
- Do not create duplicate field systems when existing columns/contracts can be aligned incrementally.

## 8. Current Support For Future Intelligence

Current fields already support the future intelligence direction in a partial but useful way:

- `work_title`, `genre`, and `mood` support catalog discovery and search now.
- contributor roles and split percentages support readiness and royalty intelligence later.
- `registration_status` and `copyright_status` provide early operational status signals.
- `musical_works.metadata` gives an extensible future envelope.
- existing columns such as `tags`, `themes`, `usage_tag`, `license_status`, and `available_for_api` show that the database already anticipates catalog intelligence and API/discovery use.

Major gaps:

- current create-song route is still TEST/draft-oriented and not production-governed.
- workspace scoping is not yet written into the current create-song RPC.
- contributor identity governance and create-song contributor handling are not fully consolidated.
- readiness/compliance indicators on `/dashboard/works/list` are UI-derived TEST signals, not backend-governed readiness.
- future AI enrichment needs confirmation workflows and source tracing before it can write durable metadata.

## 9. Current Persistence Verification Snapshot - 2026-05-19

The current V1 Add Work flow was verified end to end before expanding metadata UX further.

### Persisted and Displayed

- `work_title` is captured in `/dashboard/works/new`, sent to `POST /api/songs/create`, persisted to `musical_works.work_title`, returned by `GET /api/test/get-work`, and displayed on `/dashboard/works`, `/dashboard/works/list`, and `/dashboard/works/details/[workId]`.
- `genre` and `mood` are captured, persisted to `musical_works.genre` and `musical_works.mood`, returned by the TEST read route, searchable, and displayed.
- `copyright_status` and `registration_status` are defaulted to `draft`, persisted to `musical_works`, returned, and displayed as early TEST status signals.
- contributor name, role, split type, and percentage are persisted through `contributors` and `work_contributors`.
- the TEST read route now exposes contributor count and split total so the Works surfaces can display persisted contributor/split summary without adding schema.

### Persisted or Available, But Not Yet Used As Full Enrichment

- `musical_works` already includes future-oriented columns such as `sub_genre`, `themes`, `tags`, `usage_tag`, `license_status`, `api_handle`, `available_for_api`, and `metadata`.
- These columns are not written by the current V1 create-song route and should not be treated as complete metadata intelligence until an approved update flow exists.

### Not Persisted By Current V1

- `alternative_title`
- `language`
- `audience_vibe`
- `energy`
- `clean_explicit`
- `commercial_notes`
- `sync_licensing_potential`
- `target_audience`
- `release_intentions`
- `marketing_notes`

This snapshot was superseded by the Song Profile refactor below. Commercial/audience/sync/release strategy fields should not remain editable user inputs; they belong under future `system_insights`.

### Current Limitation

`/dashboard/works/details/[workId]` currently reads from the same recent 10 TEST works route as the Works list. A dedicated production work details read route remains future implementation work.

## 10. Step 2 Hybrid Persistence Direction - 2026-05-19

The approved persistence direction for Step 2 Work Intelligence is hybrid.

Rule:

`metadata.work_intelligence_v1` is a structured interim contract, not a dumping ground.

Core product principle:

User enters creative truth. System generates commercial intelligence.

Users should provide factual creative inputs, emotional/creative context, and catalog truth. The system should later generate commercial intelligence, audience analysis, market positioning, release opportunities, marketing recommendations, campaign suggestions, and operational actions.

### Metadata Philosophy

Music metadata is not administrative overhead.
It is the intelligence layer of the music business.

Metadata must be captured in a way that is useful for search, reporting, clustering, recommendations, readiness, and future AI-assisted workflows.

### Controlled Metadata Principle

Controlled fields for intelligence.
Freeform fields for explanation.

Use controlled dropdowns/options for:

- genre
- mood
- energy
- language
- clean/explicit
- statuses
- roles
- split types

Use freeform fields only for:

- creative descriptions
- inspiration/reference notes
- comments
- internal explanations

Uncontrolled freeform metadata creates weak intelligence, poor search, fragmented reporting, broken AI clustering, inconsistent analytics, and lower recommendation quality.

### Intelligence Architecture Direction

Future intelligence flow:

Creative Truth
-> Structured Metadata
-> AI Interpretation
-> Commercial Intelligence
-> Operational Actions
-> Upsell / Service Execution

Future system-generated outputs may include:

- generated release strategies
- campaign recommendations
- playlist opportunities
- audience insights
- sync/licensing opportunities
- upsell service workflows
- deliverable generation
- operational task creation

These are future concepts only. They are not implemented by the current TEST/V1 Song Profile flow.

### Dedicated Column

- `themes` saves to `musical_works.themes`.

### Structured Metadata

The following manual user-entered fields save to `musical_works.metadata.work_intelligence_v1.creative_truth`:

- `alternative_title`
- `language`
- `energy`
- `clean_explicit`
- `creative_description`
- `inspiration_reference_notes`
- `updated_at`
- `source: "manual"`

System-generated or future intelligence outputs belong under `musical_works.metadata.work_intelligence_v1.system_insights`, not in editable user input fields.

The implementation must merge this metadata key safely and must not overwrite unrelated metadata.

### Future Graduation Candidates

Fields should graduate from structured metadata into dedicated columns later when they become important for search, reporting, compliance, integrations, or external workflow interoperability.

Likely future graduation candidates:

- `alternative_title`
- `language`
- `clean_explicit`
- selected creative-truth fields if they become reportable or searchable at scale

### Product Value

Song Profile creative-truth fields support future:

- marketing intelligence
- AI recommendations
- catalog intelligence
- release planning
- sync/licensing thinking
- structured search and reporting

They are not production compliance or submission readiness until the full governed readiness and foundation chain is active.

## 11. Duplicate Awareness And Pre-Capture Governance

Duplicate awareness is pre-capture governance. It protects catalog integrity before a work is created.

The Add Work flow should treat duplicate checking as part of the workflow, not as a passive utility. The user should search existing works before entering a new work so that duplicate titles, conflicting contributor records, repeated split data, and future duplicate submission attempts are caught as early as possible.

This matters because the platform may later support submission preparation for SAMRO, CAPASSO, and other industry bodies. Duplicate works or conflicting metadata can create downstream registration, ownership, evidence, and submission risks.

Current V1 behavior:

- use existing captured works as the TEST read model.
- search by title, genre, and mood.
- allow a soft override when the user decides the new work is different.
- do not block creation through production governance yet.

Future intelligence and governance implications:

- AI duplicate matching.
- fuzzy title matching.
- contributor similarity matching.
- metadata similarity detection.
- genre/mood clustering.
- industry identifier conflict detection.
- duplicate warning history.
- override reason capture.
- audit trail for duplicate overrides.
- future submission governance before SAMRO, CAPASSO, or other industry registration workflows.

These are future backend implications only. They must not be treated as implemented production protection until explicitly built and governed.

## 12. Implementation Boundary

This document does not require immediate UI expansion.

Next implementation should continue to follow the product journey:

1. keep Add Work V1 simple.
2. improve the works list/read model.
3. add view/details before edit.
4. connect backend readiness only when the route is clearly labeled TEST or properly governed.
5. expand metadata capture progressively, not all at once.
