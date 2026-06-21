# Sentry Sound Doctrine Consolidation And Gap Analysis V1

Date: 2026-06-05

Status: doctrine consolidation, gap analysis, and controlled roadmap direction only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

The completed doctrine chain confirms that Sentry Sound is no longer only a song capture, contributor, split, and metadata application. It is becoming a workspace-scoped music rights operating system whose future backend work must respect authority boundaries across identity, works, masters, rights, registrations, releases, distribution, royalties, evidence, and finance.

The current platform is directionally sound. It already has strong workspace scoping, a useful `musical_works` catalogue seed, CRM-linked artist profiles, contributor capture, file vault foundations, rights lifecycle structures, release/distribution schemas, registration/evidence concepts, and an active royalty engine.

The main issue is not lack of structure. The main issue is authority drift: several current structures are useful operational seeds, but they can imply legal, rights, registration, release, distribution, or royalty truth before the canonical authority layers are fully governed.

Highest-risk gaps:

- Party identity is not yet a canonical legal/commercial identity layer.
- Rights Interest is not yet the binding authority layer consumed by registration, release, distribution, and royalties.
- Master / Recording is not yet the active sound recording authority layer in the main catalogue flow.
- Royalty processing currently derives from `work_contributors`, not verified Rights Interests and Party/payee authority.
- Registration/readiness/evidence structures are present but not yet fully aligned into a single authority chain.

Lowest-risk quick wins:

- lock doctrine references in future task briefs
- correct UI/docs language that implies ownership, readiness, or royalty authority too early
- build read-model inventories before schema work
- map existing records to doctrine categories without changing data
- preserve current operational tables while planning controlled extensions

Recommended immediate next step:

```text
Doctrine Consolidation -> Gap Analysis -> Controlled Refactor Roadmap Approval
```

No implementation should resume for ownership, registrations, releases, distribution, royalties, artist/company identity, or rights administration until a controlled roadmap is approved.

## 2. Consolidated Doctrine Chain

Canonical authority chain:

```text
Workspace
  -> Party
  -> Rights Interest
  -> Work
  -> Master / Recording
  -> Registration Authority
  -> Release Readiness
  -> Distribution Relationship
  -> Royalty Authority
```

Important:

This is not a strict hierarchy. It is an authority and dependency chain. Real records may be many-to-many, lateral, optional, versioned, and time-bound. The doctrine rule is that downstream operational layers must not create or override authority owned upstream.

Doctrine locks:

- Sentry Sound is the system of record.
- Chronicle Music is the first real-world reference tenant / pilot implementation, not hardcoded platform logic.
- Spreadsheets are temporary intake layers only.
- External systems consume Sentry Sound truth.
- Contributor splits are not final rights authority.
- Artist visibility is not ownership.
- Workspace access is not copyright ownership.
- Distribution is not royalty allocation.
- Royalty events are evidence of activity, not ownership authority.
- Finance remains separate from royalty administration.

## 3. Completed Doctrine Inputs

This consolidation uses:

- `docs/platform/SENTRY-SOUND-DOCTRINE-ALIGNMENT-REVIEW-V1.md`
- `docs/platform/SENTRY-SOUND-CANONICAL-ENTITY-DIRECTION-V1.md`
- `docs/platform/SENTRY-SOUND-PARTY-IDENTITY-MODEL-V1.md`
- `docs/platform/SENTRY-SOUND-RIGHTS-INTEREST-MODEL-V1.md`
- `docs/platform/SENTRY-SOUND-MASTER-RECORDING-MODEL-V1.md`
- `docs/platform/SENTRY-SOUND-REGISTRATION-AUTHORITY-MODEL-V1.md`
- `docs/platform/SENTRY-SOUND-RELEASE-READINESS-MODEL-V1.md`
- `docs/platform/SENTRY-SOUND-DISTRIBUTION-RELATIONSHIP-MODEL-V1.md`
- `docs/platform/SENTRY-SOUND-ROYALTY-AUTHORITY-MODEL-V1.md`

Additional current platform references inspected include CRM, artist, contributor, rights lifecycle, registration, release, distribution, royalty, finance, file vault, Chronicle integration, Supabase migration history, Prisma schema, and active API/service surfaces where needed for doctrine comparison.

## 4. Current Platform Reality Summary

Current platform strengths:

- Workspace scoping is a strong operational boundary.
- `musical_works` is a practical active Work seed and successfully holds the Chronicle foundation catalogue.
- `artist_profiles` are linked to `crm_contacts`, which aligns with Artist Brand not duplicating CRM identity.
- `contributors` and `work_contributors` provide useful capture and participation structures.
- Rights Lifecycle already recognizes ownership claims, verification, territories, and effective dates.
- Release Management and Distribution Pipeline are workspace-scoped and lifecycle-aware.
- File Vault can link files to operational records without duplicating business logic.
- Registration/evidence concepts already exist in older/parallel structures.
- Royalty Engine, ledger, payout, settlement, and finance boundaries exist.
- Chronicle intake doctrine is properly scoped as intake-to-backend, not spreadsheet authority.

Current platform constraints:

- CRM Contact is the nearest active Party seed, but not yet a fully canonical Party model.
- Existing Party references in older docs/history are not necessarily the approved future Party model.
- Master / Recording exists in older/parallel concepts and release-track references, but is not fully active in the main catalogue flow.
- Contributor splits are still used as royalty calculation input.
- Rights Interest is doctrinally defined but not yet the canonical enforcement source for all downstream flows.
- Registration/evidence/readiness systems are not yet unified around Rights Interest and identifier governance.
- Release lifecycle has a `ready` status but not a full multi-domain Release Readiness authority gate.
- Distribution status can be mistaken for readiness or authority.
- Royalty "distribution" terminology conflicts with digital distribution.
- Finance can receive royalty-derived effects later, but must not become the royalty authority engine.

## 5. Domain-By-Domain Gap Analysis

### Workspace / Access Boundary

Alignment score: 8/10

Already aligned:

- Workspace-scoped records appear throughout core operational surfaces.
- Workspace context supports Chronicle as a pilot tenant without hardcoding Chronicle logic.
- Workspace access is increasingly treated as operating context.

Gaps:

- Workspace access must remain clearly separate from copyright ownership and payee authority.
- Some older surfaces may still imply workspace/operator ownership through convenience language.

Roadmap class:

- Doctrine lock only
- UI language correction
- Read model alignment

### Party / CRM / Identity

Alignment score: 5/10

Already aligned:

- `crm_contacts` provide a practical identity/contact seed.
- Artist Management links artist profiles to CRM contacts.
- Contracts and rights docs recognize CRM-linked parties.

Gaps:

- Party is not yet a governed legal/commercial identity layer.
- CRM Contact, Contributor, Artist Brand, payee, distributor, publisher, society, company, and workspace user remain adjacent concepts.
- Legacy/older party references are not clearly reconciled with current canonical Party doctrine.

Roadmap class:

- Doctrine lock only
- Read model alignment
- Backend contract extension
- Schema addition later

### Artist Brand

Alignment score: 7/10

Already aligned:

- Artist profiles are CRM-linked and workspace-scoped.
- Artist docs say artists must not duplicate CRM identity.
- The doctrine correctly positions M-Wis and Huey D as Artist Brands, not companies.

Gaps:

- Artist profile metadata includes rights/publishing posture that may be mistaken for authority.
- Artist visibility can still be confused with ownership, payee, or company identity.

Roadmap class:

- UI language correction
- Read model alignment
- Backend contract extension later

### Work / `musical_works`

Alignment score: 8/10

Already aligned:

- `musical_works` is the active Work seed.
- Chronicle foundation catalogue import confirmed it can act as workspace-scoped catalogue truth.
- Work profile metadata is useful for composition/catalogue operations.

Gaps:

- Some Work fields or profile metadata may imply registration, ownership, publishing, release, or master truth too early.
- ISWC governance is not yet fully separated as Registration/identifier authority.

Roadmap class:

- Can-stay
- UI language correction
- Read model alignment
- Backend contract extension later

### Master / Recording

Alignment score: 4/10

Already aligned:

- Older/parallel Prisma `Recording` concepts exist.
- Release tracks have `sound_recording_id`.
- File Vault categories include `master_audio`.
- Doctrine now clearly separates Work from Master.

Gaps:

- Master / Recording is not yet a canonical active entity in the Works UX.
- ISRC may appear on release tracks or spreadsheet intake rather than governed Master identity.
- Demo audio, final files, and commercial Master identity are not yet fully governed.

Roadmap class:

- Doctrine lock only now
- Read model alignment
- Backend contract extension
- Schema addition later
- Controlled migration later

### Contributors / `work_contributors`

Alignment score: 6/10

Already aligned:

- Contributors and work contributors capture participation and roles.
- Contributor docs discourage free-text-only names.
- Contributor rows remain useful for registration readiness and participation visibility.

Gaps:

- Contributor splits can be mistaken for final ownership or royalty authority.
- Current royalty engine uses `work_contributors` directly.
- Contributor, Party, Artist Brand, and payee boundaries need stronger enforcement.

Roadmap class:

- UI language correction
- Backend contract extension
- Legacy retirement later for authority use only, not for capture use

### Rights Interest / Ownership Authority

Alignment score: 5/10

Already aligned:

- Rights Lifecycle recognizes ownership claims, verification, territories, and effective dates.
- Rights docs already state royalty splits must be supported by rights records.
- Validation concepts exist for ownership totals.

Gaps:

- Rights Interest is not yet the canonical authority consumed by registration, release, distribution, and royalty services.
- Current rights structures are still claims/lifecycle seeds rather than complete authority graph.
- Party/payee identity and evidence dependencies are not fully wired.

Roadmap class:

- Doctrine lock only now
- Read model alignment
- Backend contract extension
- Schema addition
- Controlled migration

### Registration / Identifiers

Alignment score: 5/10

Already aligned:

- Registration readiness, evidence, submission, disputes, amendments, and identifier concepts exist.
- Registration doctrine now defines identifiers as evidence/reference state, not ownership.

Gaps:

- Older/parallel Prisma registration slice sits beside active lowercase operational seed.
- ISWC, ISRC, IPI, UPC/EAN, society references, and distributor references are not yet governed through one model.
- Registration readiness is not yet consistently downstream of verified Rights Interest and evidence truth.

Roadmap class:

- Read model alignment
- Backend contract extension
- Schema addition later
- Controlled migration later

### Release / Readiness

Alignment score: 6/10

Already aligned:

- Release Management exists with releases, tracks, versions, snapshots, lifecycle, and audit.
- Release docs say release must link to rights, artists, contributors, contracts, and distribution without duplicating authority.
- Release tracks can reference Work and sound recording concepts.

Gaps:

- `releases.lifecycle_status = ready` is not the same as multi-domain Release Readiness.
- Release readiness does not yet consume full Work/Master/Rights/Registration/Evidence truth.
- Release track `isrc` is transitional until Master identifier governance exists.

Roadmap class:

- UI language correction
- Read model alignment
- Backend contract extension
- Schema addition later

### Distribution / DSP Relationships

Alignment score: 7/10

Already aligned:

- Distribution Pipeline is workspace-scoped, release-linked, territory-aware, DSP/platform-aware, lifecycle-controlled, and auditable.
- Distribution docs already say distribution must not duplicate Rights, Contracts, Artist, or CRM data.
- Distribution releases link to Release Management through `source_release_id`.

Gaps:

- Distribution does not yet consume formal Release Readiness.
- Distributor/DSP references can be mistaken for authority.
- Digital distribution terminology can collide with royalty distribution/allocation.

Roadmap class:

- UI language correction
- Read model alignment
- Backend contract extension later

### Royalty Authority / Royalty Events

Alignment score: 4/10

Already aligned:

- Royalty Engine, royalty ledger, payout, settlement, and contributor balance concepts exist.
- Finance docs correctly preserve the royalty/finance boundary.
- Royalty Control Alignment docs already recognize upstream validation layers.

Gaps:

- Current processing derives from `work_contributors`.
- Royalty distributions and payout items map to contributors, not future Party/payee authority.
- Royalty Events are currently work-centered and too narrow for future Work/Master/Release/distribution statement contexts.
- Royalty calculations do not yet derive from verified Rights Interest.

Roadmap class:

- Doctrine lock only now
- Read model alignment
- Backend contract extension
- Controlled migration later
- Full refactor only after upstream authority exists

### Finance Boundary

Alignment score: 8/10

Already aligned:

- Finance docs explicitly state royalties remain separate and feed finance only through approved posting.
- Finance has standalone value without royalty module dependency.
- Commitments can represent obligations without becoming royalty calculation authority.

Gaps:

- Future finance/royalty integration must avoid letting finance commitments become royalty entitlement truth.

Roadmap class:

- Doctrine lock only
- Do-not-touch for royalty refactor until royalty authority roadmap is approved

### File Vault / Evidence

Alignment score: 7/10

Already aligned:

- File Vault is workspace-scoped, record-linkable, version-aware, audit-ready, and storage-provider agnostic.
- Docs clearly say supporting materials are operational visibility only and not evidence verification or legal clearance.
- Evidence Vault direction includes proof-before-submission and proof-before-payout.

Gaps:

- File Vault references and evidence governance are not yet one mature production authority model.
- Evidence candidates can be mistaken for verified evidence.

Roadmap class:

- UI language correction
- Read model alignment
- Backend contract extension later

### Chronicle Integration

Alignment score: 9/10

Already aligned:

- Chronicle is documented as a consumer of Sentry Sound truth.
- Chronicle workbook is intake only.
- Chronicle foundation catalogue is imported as workspace-scoped backend data.
- Deferred fields such as ownership splits, ISRC, ISWC, master owner, publishing owner, release data, rights data, and registration identifiers are not treated as authority.

Gaps:

- Future public/website/export feeds are not yet formalized.
- Chronicle-specific language must not leak into platform logic.

Roadmap class:

- Doctrine lock only
- Read model alignment
- Backend contract extension later for approved exports/feeds

### Public / Website / API Consumption

Alignment score: 5/10

Already aligned:

- Doctrine says external systems consume Sentry Sound truth through APIs, exports, feeds, or approved integrations.
- Chronicle public content boundary is documented.

Gaps:

- Approved public-safe projection/read model is not yet defined.
- Public outputs must avoid exposing private contributors, splits, evidence, internal readiness, contracts, or royalty truth.
- Website/catalogue consumption should not read from spreadsheets.

Roadmap class:

- Doctrine lock only
- Read model alignment
- Backend contract extension later

## 6. Alignment Score Summary

| Domain | Score | Status |
| --- | ---: | --- |
| Workspace / access boundary | 8/10 | aligned |
| Party / CRM / identity | 5/10 | partially aligned |
| Artist Brand | 7/10 | mostly aligned |
| Work / `musical_works` | 8/10 | aligned active seed |
| Master / Recording | 4/10 | partially present, under-governed |
| Contributors / `work_contributors` | 6/10 | useful seed, authority risk |
| Rights Interest / ownership authority | 5/10 | directionally aligned, not canonical yet |
| Registration / identifiers | 5/10 | present but fragmented |
| Release / readiness | 6/10 | release aligned, readiness immature |
| Distribution / DSP relationships | 7/10 | mostly aligned operationally |
| Royalty Authority / royalty events | 4/10 | active engine, authority misaligned |
| Finance boundary | 8/10 | aligned boundary |
| File Vault / Evidence | 7/10 | strong support layer, evidence maturity gap |
| Chronicle Integration | 9/10 | aligned |
| Public / website / API consumption | 5/10 | doctrine clear, projection missing |

Overall alignment: 6.3/10.

Doctrine conclusion: keep the working platform; align authority pathways before expanding backend features.

## 7. What Is Already Aligned

- Sentry Sound as backend system of record.
- Workspace-scoped operational data.
- Chronicle workbook as intake only.
- `musical_works` as active Work seed.
- CRM-linked artist profiles.
- File Vault as support layer, not business logic owner.
- Release and distribution lifecycle/audit posture.
- Finance boundary from royalty administration.
- Evidence/readiness language already cautious in several docs.
- Rights Lifecycle direction that royalty splits should be supported by rights records.

## 8. What Is Partially Aligned

- CRM Contact as nearest Party seed.
- Artist Brand as public identity distinct from CRM, but not always distinct from rights/payee posture in UI/metadata.
- Contributors as participation capture, but still too close to ownership/royalty authority.
- Rights Lifecycle as ownership claim seed, but not yet full Rights Interest authority.
- Registration/evidence/submission readiness as present but fragmented.
- Release readiness as lifecycle status plus docs, not a full authority gate.
- Distribution as operational layer, but not yet readiness/rights gated.
- Royalty Control Alignment as direction, but active royalty engine still calculates from contributor splits.

## 9. What Is Misaligned

- Treating contributor split totals as royalty processing authority.
- Treating release-track ISRC as if it were Master identifier authority.
- Letting `ready` lifecycle wording imply full release authority.
- Treating distributor/DSP references or acceptance as stronger than reconciliation evidence.
- Treating society/distributor statements as royalty entitlement authority.
- Letting finance commitments appear to own royalty obligations before royalty authority exists.
- Any language implying Artist Brand, Workspace User, or workspace access equals ownership/payee authority.

## 10. What Is Missing

- Canonical Party model.
- Governed Party/Contributor/Artist Brand/payee distinctions in backend contracts.
- Canonical Rights Interest authority consumed by downstream domains.
- Active Master / Recording model in catalogue/release flows.
- Identifier governance read model across ISWC, ISRC, IPI/CAE, UPC/EAN, society references, and distributor references.
- Release Readiness as a multi-domain gate.
- Distribution Relationship consuming readiness and rights authority.
- Royalty Authority consuming Rights Interest and Party/payee truth.
- Public-safe Chronicle/export projection model.
- Controlled transition plan from contributor splits to rights/payee-derived royalty calculations.

## 11. Transitional / Legacy Concepts

Transitional concepts to preserve but not elevate to authority:

- `work_contributors` split rows
- contributor-mapped royalty distributions
- contributor balance views
- release-track `isrc`
- release `distributor_reference`
- release `external_release_reference`
- distribution external references
- `releases.lifecycle_status = ready`
- file vault supporting materials
- evidence readiness read models
- older/parallel Prisma registration models
- older/parallel `Recording` concepts
- rights ownership claims before full Rights Interest
- Chronicle intake fields for ownership, identifiers, master owner, publishing owner, and notes
- royalty "distribution" terminology for allocation

These concepts are useful, but should be explicitly treated as transitional until their authority boundaries are upgraded.

## 12. Must-Change Items

Must change before high-stakes production rights/royalty operations:

- Royalty authority must stop relying on contributor splits as final entitlement.
- Rights Interest must become the source of ownership/control/admin/collection/distribution authority.
- Party/payee authority must be distinguished from Contributor, Artist Brand, CRM Contact, and Workspace User.
- Master / Recording must become the authority layer for sound recordings and ISRC governance.
- Registration identifiers must be governed as reference/evidence state, not ownership proof.
- Release Readiness must be separated from simple lifecycle status.
- Public/export surfaces must avoid private or non-authoritative operational fields.

## 13. Should-Change Items

Should change through controlled design and low-risk refactors:

- UI labels that imply legal clearance, readiness, ownership, or royalty entitlement.
- Read models that surface doctrine status, blockers, and transitional warnings.
- Backend contracts that currently accept or expose ambiguous authority fields.
- Documentation references that use "distribution" ambiguously.
- Artist and contributor forms that place rights/publishing/payment posture too close to profile identity.
- Chronicle export/public feed design.

## 14. Can-Stay Items

Can stay for now:

- `musical_works` as active Work seed.
- Chronicle foundation catalogue records.
- Workspace scoping.
- CRM contact foundation.
- Artist profile foundation.
- Contributor capture and `work_contributors` as participation/readiness capture.
- File Vault metadata/reference layer.
- Rights Lifecycle claim/lifecycle seed.
- Release Management schema.
- Distribution Pipeline schema.
- Current royalty engine as transitional calculation/ledger engine.
- Finance module boundary and commitments model.

## 15. Do-Not-Touch Items

Do not touch until roadmap approval:

- production schema
- Supabase migrations
- active API routes
- create-song/create-work contracts
- Chronicle imported catalogue data
- contributor data model
- royalty engine calculation services
- payout/settlement services
- finance posting logic
- release/distribution services
- registration/evidence routes
- UI workflows that depend on current records

Do not delete or rename working structures casually. They contain useful operational history and implementation value.

## 16. Risk Ranking

Critical risk:

- Royalty calculations based on contributor splits as final authority.
- Ownership/rights operations without canonical Party and Rights Interest authority.
- Master-side identifiers/rights handled through Work or release-track shortcuts.

High risk:

- Registration/readiness workflows treating identifiers as ownership proof.
- Release readiness implied by lifecycle status without rights/evidence/master authority.
- Public/Chronicle feeds exposing private or non-authoritative fields.

Medium risk:

- Distributor/DSP references treated as authority.
- Finance commitments confused with royalty entitlement.
- Artist Brand visibility confused with Party/payee authority.

Low risk:

- Doctrine lock updates.
- Documentation cross-references.
- Read-only inventories.
- UI copy corrections.
- Public-safe field classification design.

## 17. Dependency Order For Future Refactors

Recommended dependency order:

1. Doctrine lock and glossary consolidation.
2. Current-state inventory/read models.
3. Party identity authority design.
4. Rights Interest authority design.
5. Master / Recording authority design.
6. Identifier/Registration governance alignment.
7. Release Readiness read model.
8. Distribution Relationship readiness/rights alignment.
9. Royalty Authority preflight and read-model alignment.
10. Royalty calculation migration planning.
11. Finance posting boundary design.
12. Public/Chronicle export projection.
13. Controlled schema additions.
14. Controlled migrations.
15. Legacy authority-path retirement.

## 18. Recommended Controlled Refactor Roadmap V1

### Phase 0: Doctrine Lock Only

Classification: Doctrine lock only

Scope:

- Treat this document and the completed doctrine artifacts as planning inputs for all future backend work touching rights, registration, releases, distribution, royalties, finance, artists, companies, and identity.
- No schema or code changes.

Exit condition:

- Product owner approves doctrine chain and gap priorities.

### Phase 1: Read Model Alignment

Classification: Read model alignment

Scope:

- Inventory current data structures against doctrine domains.
- Add no authority.
- Produce read-only maps of which records are aligned, transitional, blocked, or unknown.

Exit condition:

- Platform has a clear map of current reality before schema design.

### Phase 2: UI Language Correction

Classification: UI language correction

Scope:

- Correct labels/copy that imply ownership, readiness, registration proof, royalty entitlement, or legal clearance.
- Preserve existing workflows.

Exit condition:

- User-facing language no longer overstates authority.

### Phase 3: Backend Contract Extension Design

Classification: Backend contract extension

Scope:

- Design contract-level inputs/outputs that distinguish Party, Contributor, Artist Brand, Rights Interest, Work, Master, Registration, Release, Distribution, Royalty, Evidence, and Finance.
- No schema until approved.

Exit condition:

- Future route/service changes have doctrine-aligned contract specs.

### Phase 4: Schema Addition Planning

Classification: Schema addition

Scope:

- Plan additive structures only where existing tables cannot safely carry canonical authority.
- Avoid renames/deletions.

Exit condition:

- Approved schema direction with migration and rollback strategy.

### Phase 5: Controlled Migration Planning

Classification: Controlled migration

Scope:

- Map current records into new authority layers without overwriting data.
- Keep transitional fields for audit/reconciliation until retired.

Exit condition:

- Approved dry-run plan and verification criteria.

### Phase 6: Legacy Authority Retirement

Classification: Legacy retirement

Scope:

- Retire only the use of transitional structures as authority.
- Do not remove useful capture/history records unless explicitly approved.

Exit condition:

- Downstream flows consume canonical authority.

### Phase 7: Full Refactor Only If Needed

Classification: Full refactor

Scope:

- Reserved for surfaces that cannot be safely extended.
- Must be scoped, reversible where possible, and backed by migration/verification plans.

Exit condition:

- Approved high-confidence execution plan.

## 19. Recommended Immediate Next Step

Create:

```text
docs/platform/SENTRY-SOUND-CONTROLLED-REFACTOR-ROADMAP-V1.md
```

Purpose:

- convert this gap analysis into a controlled, phase-based roadmap
- define explicit non-goals
- define first safe read-only inventories
- rank work by authority risk
- identify approval gates before any schema/API/service work
- preserve current working structures while planning additive alignment

The first practical work after roadmap approval should be a read-only current-state inventory, not schema work.

## 20. Implementation That Must Remain Paused

Pause implementation for:

- canonical Party schema or migrations
- Rights Interest schema/migrations
- Master / Recording schema/migrations
- registration identifier governance migrations
- Release Readiness backend gates
- Distribution readiness enforcement
- royalty calculation refactor
- contributor split migration
- Chronicle ownership/split/identifier imports
- public Chronicle feed/API
- finance/royalty posting automation
- any destructive cleanup or table retirement

Implementation should resume only after roadmap approval and explicit scope selection.

