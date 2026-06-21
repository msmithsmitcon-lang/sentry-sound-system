# Sentry Sound Doctrine Alignment Review V1

Date: 2026-06-04

Status: doctrine review and architecture gap analysis only. No implementation, SQL, migration, schema change, refactor, import, or database write is proposed or performed by this document.

## 1. Executive Summary

The Chronicle catalogue import confirmed that the current Sentry Sound platform can safely act as the workspace-scoped operational system of record for foundation work records. The import also exposed an architectural truth: the active platform is no longer only a Song Capture plus Contributors plus Splits product. It is becoming a rights administration system whose canonical model must respect ownership, registration, release, distribution, and royalty sequence.

Overall alignment: partially aligned and directionally sound.

The strongest aligned areas are:

- workspace-scoped operational ownership
- `musical_works` as the active work/catalogue seed
- `contributors` and `work_contributors` as the active contributor/split seed
- CRM-backed `artist_profiles`
- file vault and supporting-material links
- release and distribution schemas with lifecycle posture
- rights lifecycle tables that separate ownership claims from contributor percentages

The main misalignments are:

- no single canonical Party model yet
- artist brand, contributor identity, CRM contact, rights party, and workspace actor are still adjacent concepts rather than one governed identity graph
- master/sound recording is not active in the Works UX as a canonical entity
- registration/submission infrastructure still has an older Prisma/text-ID registration slice alongside the active lowercase operational seed
- royalty processing still reads `work_contributors` splits directly rather than verified rights interests
- older metadata fields on `musical_works` can imply ownership, registration, or publishing truth before rights governance

Doctrine conclusion:

Sentry Sound should continue using the current workspace-owned `musical_works` seed as the active catalogue/work anchor, but future backend development should align toward a clearer canonical chain:

```text
Workspace / Operating Entity
  -> Party / CRM Identity
  -> Artist Brand
  -> Work
  -> Master / Recording
  -> Rights Interest
  -> Registration
  -> Release
  -> Distribution Relationship
  -> Royalty Event
```

This is not a rewrite instruction. It is a direction-of-travel rule for future controlled refactors.

## 2. Inputs Inspected

Doctrine and Chronicle sources:

- `docs/platform/CHRONICLE-INTEGRATION-PRINCIPLE-V1.md`
- `docs/platform/CHRONICLE-INTAKE-REVIEW-REPORT-V1.md`
- `docs/platform/CHRONICLE-FOUNDATION-ONLY-WORKS-IMPORT-PLAN-V1.md`
- `docs/platform/CHRONICLE-FOUNDATION-ONLY-WORKS-IMPORT-RESULT-V1.md`

Platform architecture docs:

- `docs/platform/CANONICAL-ENTITY-MAP.md`
- `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`
- `docs/platform/ARTIST-OPERATIONAL-ENTITY-V1-ALIGNMENT.md`
- `docs/platform/SONG-CAPTURE-V2-ARCHITECTURE-ALIGNMENT-REVIEW.md`
- `docs/modules/03-contributors-system.md`
- `docs/modules/artists/ARTIST-MANAGEMENT.md`
- `docs/modules/rights-lifecycle/RIGHTS-LIFECYCLE.md`
- `docs/modules/registration/REGISTRATION-FOUNDATION.md`
- `docs/modules/releases/RELEASE-MANAGEMENT.md`
- `docs/modules/distribution/DISTRIBUTION-PIPELINE.md`
- `docs/royalties/ROYALTY-ENGINE.md`

Schema and operational contracts:

- `prisma/schema.prisma`
- `supabase/migrations/002-song-metadata-expansion.sql`
- `supabase/migrations/003-contributors-system.sql`
- `supabase/migrations/20260507131823_workspace_foundation.sql`
- `supabase/migrations/20260507183827_organization_foundation.sql`
- `supabase/migrations/20260507184633_crm_contacts_schema.sql`
- `supabase/migrations/20260507185753_artist_management_schema.sql`
- `supabase/migrations/20260507190348_rights_lifecycle_schema.sql`
- `supabase/migrations/20260507191255_contract_system_schema.sql`
- `supabase/migrations/20260507191829_distribution_pipeline_schema.sql`
- `supabase/migrations/20260507192630_release_management_schema.sql`
- `supabase/migrations/20260507193047_align_distribution_with_releases.sql`
- `supabase/migrations/20260507193358_file_vault_schema.sql`
- `supabase/migrations/20260520090000_workspace_owned_works_seed.sql`
- `src/lib/registration/services/create-song-with-contributors.ts`
- `app/api/songs/create/route.ts`
- `app/api/works/create/route.ts`
- `src/lib/works/works-read-repository.ts`
- `src/lib/works/work-detail-read-repository.ts`
- `src/lib/royalties/processRoyaltyEventToLedger.ts`

Migration history note:

- No local `prisma/migrations` directory exists.
- Supabase migrations are the meaningful migration history for the operational tables inspected in this review.

## 3. Current Platform Model

The platform currently has two visible model layers.

Active lowercase operational seed:

- `workspaces`
- `workspace_members`
- `workspace_settings`
- `workspace_activity`
- `assets`
- `musical_works`
- `contributors`
- `work_contributors`
- `crm_contacts`
- `artist_profiles`
- `file_vault_items`
- `file_vault_links`
- `rights_assets`
- `rights_ownership_claims`
- `contracts`
- `releases`
- `release_tracks`
- `distribution_channels`
- `distribution_releases`
- `distribution_release_channels`
- `workspace_calendar_items`
- workspace finance and commitment tables

Older/parallel Prisma registration slice:

- `MusicalWork`
- `MusicalWorkContributor`
- `Recording`
- `RecordingPerformer`
- `RegistrationEvidence`
- `SubmissionQueue`
- `SubmissionSnapshot`
- `SubmissionExport`
- dispatch, incident, escalation, dispute, amendment, and audit models

The active Works UI and Chronicle import use the lowercase operational seed, especially `musical_works`, `assets`, `contributors`, and `work_contributors`. Some registration/submission services still use the older Prisma-oriented model or text-ID queue concepts.

## 4. Doctrine Model

Approved doctrine direction:

1. Sentry Sound is the system of record.
2. Chronicle Music is a real-world business operating on top of Sentry Sound.
3. Artist brands are not companies.
4. Chronicle Music is not an artist.
5. Ownership precedes registration.
6. Registration precedes release.
7. Release precedes distribution.
8. Distribution precedes royalty events.
9. Spreadsheets are intake layers, not operational truth.
10. External systems consume truth from Sentry Sound.

Conceptual chain under review:

```text
Party
  -> Artist Brand
  -> Work
  -> Master
  -> Rights Interest
  -> Registration
  -> Release
  -> Distribution Relationship
  -> Royalty Event
```

Objective assessment:

This chain is directionally correct, but should not be force-fit as a strict one-to-one hierarchy. Real music operations require some lateral links:

- a Party may be a company, person, contributor, publisher, label, distributor, regulator, or service provider
- an Artist Brand may map to one or more CRM contacts and may not be the legal party
- a Work may have no Master yet
- a Master may embody one or more Works in some cases
- Rights Interests may attach to works, masters, releases, contracts, territories, and parties
- Registration may apply to works, recordings, contributors, societies, releases, or evidence packages depending on body
- Release and distribution are related but distinct operational layers
- Royalty Events must depend on verified rights/contract/distribution context, not only visible split rows

## 5. Alignment Score By Entity / Domain

| Domain | Current canonical status | Doctrine alignment | Score | Review |
| --- | --- | --- | ---: | --- |
| Workspace / operating container | Active partial canonical | Strong | 8/10 | Workspace scoping is now present across active works, CRM, artists, releases, distribution, file vault, finance, and rights. Legal entity/terms/authority still need stronger gates. |
| Party / legal-commercial identity | Missing as one canonical entity | Partial | 4/10 | CRM contacts, contributors, contract parties, and rights claimants exist, but no single Party abstraction owns identity semantics. |
| CRM contacts | Active canonical seed | Strong | 8/10 | Good base for people, companies, and organizations. Should remain private operational identity layer. |
| Artist brands | Active partial canonical | Partial/strong | 7/10 | `artist_profiles` correctly link to CRM contacts. Doctrine needs stricter language that artist brand is not a company and Chronicle is not an artist. |
| Assets | Active broad seed | Partial | 6/10 | Useful operational anchor, but asset vs work vs master vs file boundaries need clearer canonical meaning. |
| Works / songs | Active canonical seed | Strong | 8/10 | `musical_works` is the active workspace-scoped work anchor. Some legacy metadata fields can imply premature rights truth. |
| Master / recording | Future canonical / weak active | Weak | 3/10 | Prisma `Recording`, `recording_contributors`, `release_tracks.sound_recording_id`, and file categories exist, but no active canonical master model in Works UX. |
| Contributors | Active canonical seed | Partial/strong | 7/10 | Good identity seed for creative participants. Needs relationship to CRM/Party and distinction from artist brand. |
| Work contributors / splits | Active canonical seed, but not rights authority | Partial | 6/10 | Useful for composition split capture and readiness. Must not be treated as verified ownership or royalty entitlement by default. |
| Rights interests / ownership | Future/partial canonical | Partial | 6/10 | `rights_assets` and `rights_ownership_claims` are doctrinally strong. They are not yet the controlling gate for registration, release, or royalties. |
| Registration / submissions | Parallel/transitioning | Partial | 5/10 | Strong concepts and submission engine docs exist, but model split and older text-ID queue patterns create drift. |
| Evidence / file vault | Active partial canonical | Strong | 7/10 | File vault and evidence concepts align well. Need one canonical promotion path from supporting file to legal evidence. |
| Releases | Future/partial canonical | Strong | 7/10 | Schema and service docs align with doctrine. Needs gating by rights/registration readiness before production release actions. |
| Distribution | Future/partial canonical | Strong | 7/10 | Release-linked distribution pipeline aligns well. Needs distributor relationship and royalty/report ingestion model. |
| Royalties | Prototype/partial | Weak/partial | 4/10 | Current processing reads `work_contributors` splits. Doctrine requires verified rights interests and distribution/statement sources before royalty events become authoritative. |
| Chronicle / external consumers | Architecture decision canonical | Strong | 9/10 | Doctrine is clear: Chronicle consumes approved truth from Sentry Sound; spreadsheets are intake only. |

## 6. Aligned Areas

Sentry Sound as source of truth:

- Chronicle principle and import result explicitly preserve backend authority.
- Chronicle workbook was used as intake only.
- The imported works are now workspace-scoped backend records.

Workspace authority:

- Current `POST /api/songs/create` uses authenticated workspace context.
- Active works, assets, contributors, and work contributors are workspace-scoped through the current RPC path.
- Many newer modules are workspace-scoped by design.

Artist/CRM separation:

- Artist profiles link to CRM contacts.
- Artist capture V1 stores public/private posture separately in metadata.
- Artist profiles are correctly reusable for releases and public-facing identity, not treated as the legal company by default.

Rights direction:

- Rights lifecycle docs and tables already separate rights assets and ownership claims from simple contributor rows.
- Rights claims support CRM-linked and contributor-linked ownership.
- Territory, effective date, verification status, and audit concepts exist.

Release/distribution direction:

- Release Management and Distribution Pipeline docs correctly state that releases and distribution should not duplicate rights, contracts, artist, or CRM data.
- Distribution releases now link to releases.
- Both domains are workspace-scoped and lifecycle-aware.

Files/evidence direction:

- File vault provides a generic workspace-scoped file record and links to operational records.
- Work supporting materials avoid pretending that reference files are automatically legal evidence.

## 7. Misaligned Areas

Party is missing as the controlling identity concept:

- CRM contacts can represent people, companies, and organizations.
- Contributors represent creative/business participants.
- Artist profiles represent artist brands.
- Rights claims and contract parties can link to CRM contacts or contributors.
- There is no single canonical Party layer that says which legal/commercial identity owns, signs, administers, registers, receives, or represents.

Artist Brand is too close to operational identity:

- `artist_profiles.artist_type` currently includes `label`, which can blur brand vs company doctrine.
- Artist profiles are linked to CRM contacts, which is good, but future UX/language must avoid making Chronicle Music an artist or making a company equivalent to an artist brand.

Work metadata can imply premature authority:

- `musical_works` has fields such as composer names, publisher name, publisher share, split totals, split sheet status, copyright claimant, and registration statuses.
- These are useful as legacy/profile/intake fields, but they should not be treated as structured rights, registration, or ownership truth without governed relationship records.

Master/recording is not canonical enough:

- ISRC belongs to sound recordings/masters, not works.
- Current active Works import correctly deferred ISRC.
- The platform needs a clearer future master entity before release/distribution/royalty doctrine can be fully enforced.

Registration infrastructure is split:

- Active catalogue uses lowercase `musical_works` UUID records.
- Prisma `MusicalWork`, `Recording`, and submission queue models use separate IDs and older naming.
- Submission queue concepts are valuable, but they need canonical entity mapping before production authority.

Royalty flow is ahead of rights verification:

- Current royalty processing reads `work_contributors` directly.
- Doctrine says ownership precedes registration and royalties should follow distribution events.
- Verified rights interests, contracts, registration status, release/distribution relationships, and statement/revenue sources should eventually govern royalty processing.

## 8. Missing Concepts

Missing or not yet canonical:

- Party as the legal/commercial identity layer
- explicit Artist Brand relationship model to parties, members, labels, managers, and work/release roles
- canonical Master / Sound Recording model in the active operational seed
- external identifier governance for ISWC, ISRC, UPC, IPI/CAE, distributor references, platform IDs, and registration body references
- registration record as durable state separate from submission queue mechanics
- release readiness gate that consumes ownership, registration, master, artist, artwork, and contract state
- distribution relationship model for distributor/platform accounts, DSP delivery relationships, territories, and takedowns
- royalty event source model that links to statements, DSP reports, distributor reports, settlements, and revenue recognition
- controlled public-safe export/feed model for Chronicle Music

## 9. Legacy / Transitional Concepts

Transitional concepts that should not be deleted or rewritten casually:

- Prisma `MusicalWork` and `MusicalWorkContributor` registration models
- Prisma `Recording` and `RecordingPerformer`
- `SubmissionQueue` and related dispatch models where IDs are text or not fully canonical-linked
- `/api/works/create`, which uses the older `createMusicalWork` path and is not the same as the authenticated workspace create-song path
- `musical_works` metadata fields that carry profile, intake, or old website/catalogue-era data
- direct royalty split processing from `work_contributors`
- metadata-only supporting materials that are not verified evidence

These are transitional, not inherently wrong. They should remain stable until a controlled refactor plan explicitly maps them to canonical doctrine.

## 10. Recommended Canonical Entity Model

Recommended canonical direction:

```text
Workspace
  Operational container and access boundary.

Party
  Legal/commercial identity: person, company, organization, publisher, label, distributor, society, regulator, service provider.

Artist Brand
  Public/commercial artist identity linked to one or more parties/CRM contacts. Not a company by default.

Contributor
  Creative or participant identity, linked to Party/CRM where known, and linked to Works/Masters through role-specific relationships.

Work
  Composition/song identity. `musical_works` remains the active seed.

Master / Recording
  Sound recording identity, including ISRC and master-side participants/ownership.

Rights Asset / Rights Interest
  Claim, ownership, mandate, control, territory, effective date, verification, and audit layer for works, masters, releases, and contracts.

Registration
  Body-specific registration process and result, consuming verified identity, ownership, evidence, identifiers, and readiness.

Release
  Commercial package of one or more tracks/masters/works, linked to artist brand and release metadata.

Distribution Relationship
  Delivery and platform relationship for releases across channels, territories, and statuses.

Royalty Event
  Revenue/statement/usage event that consumes distribution and verified rights context before ledger/payout effects.
```

The current platform should not force all domains through a single `assets` table. `assets` may remain an operational/file/catalog anchor, but Work, Master, Release, Rights Interest, and File Vault should have distinct canonical meanings.

## 11. Recommended Ownership Model

Ownership should not be inferred from:

- spreadsheet owner columns
- flat split percentages
- contributor names
- artist brand
- workspace owner
- Chronicle Music business context
- `musical_works` metadata fields alone

Recommended ownership doctrine:

- Work contributor splits are capture/readiness data until confirmed.
- Rights ownership is represented by rights interests or rights ownership claims.
- Claims should be party-linked where legal/commercial identity is known.
- Claims may also be contributor-linked where contributor identity is the practical current anchor.
- Ownership must support territory, effective dates, verification state, source evidence, and disputes.
- Workspace ownership is operational control, not copyright ownership.
- Chronicle Music may administer, publish, market, or release content only where the relevant rights/mandate records support that authority.

## 12. Recommended Registration Model

Registration should consume existing canonical truth rather than own it.

Recommended registration doctrine:

- Registration is not the first place ownership should be captured.
- Registration should depend on Work, Master where applicable, Party/Contributor identity, Rights Interest, Evidence, and Identifier state.
- Submission queue items should be operational jobs, not the canonical registration record itself.
- Regulator responses, amendments, disputes, and evidence should link back to canonical entities.
- ISWC should belong to Work identifier governance.
- ISRC should belong to Master/Recording identifier governance.
- Registration readiness must remain separate from operational completeness.

Current platform implication:

- Existing registration/submission modules are valuable but should be treated as transitional until canonical entity mapping is explicit.

## 13. Recommended Release / Distribution Model

Release doctrine:

- A release packages approved commercial metadata, artist brand identity, tracks, masters, artwork, UPC/catalog references, and lifecycle status.
- Release should not create ownership truth.
- Release should be blocked or flagged where master, rights, artist, artwork, or registration prerequisites are unresolved.
- Release tracks should link to Works and Masters distinctly.

Distribution doctrine:

- Distribution consumes Release truth.
- Distribution relationships should represent platform/channel delivery, territory, delivery status, external references, takedowns, and reporting.
- Distribution should not duplicate release, artist, rights, contract, or party data.
- Royalty/report ingestion should link back to distribution channels and releases where possible.

Current platform implication:

- Release and distribution schemas are directionally aligned and should remain unchanged until the missing Master/Rights/Registration gates are designed.

## 14. Recommended Long-Term Source-Of-Truth Model

Long-term source-of-truth rules:

- Sentry Sound backend is authoritative for operational truth.
- Chronicle Music consumes public-safe and approved operational truth through APIs, exports, feeds, or approved integrations.
- Spreadsheets remain intake and review layers only.
- External sources may enrich, verify, reconcile, or report, but should not overwrite canonical truth without governed ingestion.
- Artist public pages and catalogue pages should consume public-safe read models, not private operational tables directly.
- Metadata JSON may preserve intake context, but should not become the long-term home for governed identifiers, rights, registrations, releases, or royalties.
- All production-sensitive mutations should require workspace context, actor identity, permission, and audit traceability.

## 15. Refactor Roadmap - High Level Only

This roadmap is directional only. It is not an implementation plan.

Phase 1: Doctrine locks

- lock the current active canonical seed names
- identify transitional routes and models
- prevent new features from attaching to the wrong entity
- keep Chronicle as consumer of backend truth

Phase 2: Identity alignment

- define Party vs CRM Contact vs Contributor vs Artist Brand
- define when a contributor should link to a CRM/Party identity
- define company, publisher, label, distributor, and regulator identity roles

Phase 3: Work/Master boundary

- preserve `musical_works` as active Work seed
- define Master/Sound Recording canonical model
- move ISRC logic toward Master, not Work
- preserve ISWC logic for Work identifier governance

Phase 4: Rights and registration alignment

- define Rights Interest as the owner/authority layer before registration
- map registration readiness to canonical Work/Master/Party/Rights/Evidence state
- clarify submission queue vs registration record

Phase 5: Release/distribution readiness

- define release readiness prerequisites
- connect releases to artist brands, works, masters, artwork, identifiers, and rights status
- keep distribution release-linked and channel/territory/status aware

Phase 6: Royalty authority

- ensure royalty events consume verified rights and distribution/reporting context
- separate royalty calculation, ledger, finance accounting, and payout settlement
- keep workspace finance and royalty administration linked but distinct

## 16. What Should NOT Be Changed

Do not change now:

- do not rewrite the platform
- do not rename or replace `musical_works`
- do not remove the active create-song path
- do not modify the Chronicle imported catalogue
- do not import contributors or splits from Chronicle yet
- do not treat Chronicle workbook values as rights or registration truth
- do not collapse artist profiles into companies
- do not make Chronicle Music an artist profile
- do not make work contributor split rows the final rights model
- do not move ISRC into work-level authority
- do not build new registration/release/distribution/royalty features before canonical entity alignment is approved
- do not delete transitional Prisma registration/submission models without a controlled mapping
- do not use public Chronicle needs to drive private operational schema shortcuts

## 17. Doctrine Decision

The current platform is stable enough to continue as the operational source of truth for the Chronicle foundation catalogue, but further backend feature development should pause where it touches ownership, registration, release, distribution, or royalty authority until the next controlled design step defines canonical entity boundaries.

Recommended next design artifact:

- `SENTRY-SOUND-CANONICAL-ENTITY-DIRECTION-V1`

That artifact should define names, boundaries, and authority rules only. It should not include migrations, SQL, or implementation steps unless separately approved.

