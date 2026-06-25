# Sentry Sound Inventory Interpretation And Priority Matrix V1

Date: 2026-06-05

Status: design and analysis only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

The read-only inventory confirms that Sentry Sound is not facing a blank-sheet architecture problem. The platform is already structurally aligned in many important places. The safest future alignment path is to reuse existing seeds first, promote what is already working where appropriate, extend only where a seed is insufficient, and reserve new structures/refactors for authority gaps that cannot be safely solved through existing foundations.

Estimated structural alignment: 75-85 percent.

The key finding is that most doctrine domains already have a current seed:

- Workspace -> `workspaces` and workspace context
- Party -> `crm_contacts`
- Artist Brand -> `artist_profiles`
- Work -> `musical_works`
- Rights Interest -> `rights_assets` and `rights_ownership_claims`
- Master / Recording -> existing Recording slice plus `recording_contributors` and release-track references
- Registration -> registration/evidence/submission engine
- Release -> `releases`
- Distribution -> distribution pipeline
- Royalty Authority -> royalty engine plus royalty-control alignment seed
- Finance -> finance/workspace finance layers
- Evidence -> File Vault plus evidence readiness/evidence vault seeds

The platform does not need a broad rewrite. It needs interpretation, language alignment, read-model clarity, authority design, and eventually controlled extension of specific high-risk domains.

First recommended practical workstream:

```text
Read-model alignment
```

Reason:

Read-model alignment can clarify existing truth, surface authority warnings, protect Chronicle catalogue data, and reduce risk without schema changes, migrations, backend rewrites, or contributor/royalty migrations.

## 2. Interpretation Of Inventory

The inventory tells us that Sentry Sound already has a strong operational skeleton:

- Workspace scoping is active and broadly used.
- Work capture is active and backend-authoritative through `musical_works`.
- Chronicle catalogue records are safely stored as foundation Works.
- CRM and artist profile seeds already approximate Party and Artist Brand separation.
- Contributor capture exists and is useful.
- Rights lifecycle structures already point toward rights authority.
- Registration/evidence/submission modules already exist as future-facing governance surfaces.
- Release and distribution tables are already lifecycle-aware and workspace-scoped.
- Royalty and finance engines already exist and are separated in doctrine.
- File Vault is already documented as support/reference, not legal authority.

Where doctrine and platform already align:

- `musical_works` is the active Work seed and should stay.
- `artist_profiles` linked to `crm_contacts` already supports Artist Brand vs contact identity separation.
- Rights Lifecycle already recognizes ownership claims, territories, verification, and effective dates.
- Release and distribution foundations already avoid owning rights by design.
- Finance docs already keep royalties separate from general finance.
- Chronicle integration is already non-hardcoded and intake-only.

Where perceived risk is greater than actual risk:

- Party risk is real, but `crm_contacts` is a strong seed. The issue is not absence; it is authority language and boundary definition.
- Master risk is real, but there is already a Recording slice, release-track `sound_recording_id`, `recording_contributors`, and File Vault `master_audio` category. The issue is activation and governance, not total absence.
- Registration risk is real, but the registration/submission/evidence engine is substantial. The issue is unification and authority ordering, not lack of foundation.
- Royalty risk is critical only if the current engine is treated as final authority. As a transitional calculation/ledger engine, it can stay protected.
- Rights Interest risk is critical only if current rights claims are promoted silently. As a seed, the rights lifecycle module is directionally valuable.

Where future work is genuinely required:

- authority read models that distinguish seed, candidate, verified, transitional, and authoritative records
- Party/CRM/Contributor/Artist Brand/payee boundary clarification
- Rights Interest authority design over current rights lifecycle seeds
- Master / Recording activation path
- Registration/identifier governance alignment
- Royalty Authority pathway away from contributor splits as final entitlement
- public-safe Chronicle/API projection design

## 3. Reuse Existing Seeds Matrix

| Doctrine Domain | Existing Seed | Recommendation | Confidence |
| --- | --- | --- | --- |
| Workspace | `workspaces`, `workspace_members`, workspace context/authz | Promote | High |
| Party | `crm_contacts`, contact channels/relationships/notes, contract parties | Extend | High |
| Artist Brand | `artist_profiles`, aliases, genres, social links | Promote | High |
| Work | `musical_works`, `assets`, Works read repositories | Protect | Very high |
| Master / Recording | Prisma/legacy `Recording`, `RecordingPerformer`, `recording_contributors`, `release_tracks.sound_recording_id`, File Vault `master_audio` | Extend | Medium |
| Contributor | `contributors`, `work_contributors`, `recording_contributors` | Protect | High |
| Rights Interest | `rights_assets`, `rights_ownership_claims`, lifecycle/audit events, contract links | Extend | Medium-high |
| Registration / Identifiers | registration services, evidence repositories, submission engine, Prisma/PascalCase registration tables | Extend | Medium |
| Release / Readiness | `releases`, `release_tracks`, versions, snapshots, work completeness/readiness | Extend | High |
| Distribution | `distribution_channels`, `distribution_releases`, `distribution_release_channels`, delivery/audit events | Promote | High |
| Royalty Authority | royalty engine, royalty ledger, payout/settlement services, royalty-control alignment preflight | Observe | Medium |
| Finance | finance/workspace finance tables, commitments, finance services | Protect | High |
| File Vault / Evidence | `file_vault_items`, links, versions, audit events, evidence readiness/evidence vault seeds | Extend | High |
| Chronicle Integration | Chronicle docs, imported Works, existing create-song path | Protect | Very high |
| Public/API Consumption | landing pages, Works/Artists APIs, no public-safe projection yet | Observe | Medium |

Recommendation meanings:

- Promote: existing seed is close enough to become canonical with doctrine language and controlled alignment.
- Extend: existing seed is valuable but needs authority/read-model/contract design before canonical use.
- Protect: current seed is working and should remain stable.
- Observe: keep as-is until upstream authority design clarifies safe next steps.
- Future Refactor: reserve for later if existing seed cannot safely carry doctrine responsibility.

## 4. Priority Matrix

### GREEN: Already Aligned

Domains:

- Workspace / access boundary
- Work / `musical_works`
- Chronicle Integration
- Finance boundary

Interpretation:

- These are structurally aligned enough to protect.
- Future work should avoid destabilizing them.
- Minor terminology/read-model clarifications may still help.

### YELLOW: Needs Language / Read-Model Correction

Domains:

- Artist Brand
- Contributor capture
- File Vault / Evidence
- Release / Readiness
- Distribution
- Public/API consumption

Interpretation:

- Existing seeds are useful.
- Main risk is overstatement of authority.
- Low-risk next steps are terminology alignment, read-only projections, warning labels, and classification read models.

### ORANGE: Needs Contract / Authority Design

Domains:

- Party / CRM / Identity
- Rights Interest / Ownership Authority
- Master / Recording
- Registration / Identifiers

Interpretation:

- Existing seeds are present and should be reused.
- These domains need explicit authority contracts before schema or service changes.
- Work should begin with read-model alignment and design, not migrations.

### RED: Future Migration / Refactor Candidate

Domains:

- Royalty Authority / Royalty Events
- contributor-split-derived royalty calculation path
- public Chronicle feed/API if it exposes operational fields

Interpretation:

- These are not immediate rewrite targets.
- They are future migration/refactor candidates after Party, Rights Interest, Master, and Registration authority are clearer.
- Current royalty engine should remain protected as transitional.

## 5. Quick Wins

No-schema improvements:

1. Add doctrine cross-references to future work briefs and planning docs.
2. Create read-only domain status labels such as active seed, transitional, protected, candidate, verified, deferred.
3. Clarify in docs that `work_contributors` is participation/readiness capture, not final rights or royalty authority.
4. Clarify that File Vault supporting materials are not verified evidence by default.
5. Clarify that distribution status and references are delivery/reconciliation state, not ownership proof.

No-migration improvements:

1. Produce read-model maps that show existing seed-to-doctrine domain relationships.
2. Inventory UI copy that overstates readiness, registration, ownership, payout, or legal authority.
3. Document a public-safe field classification for future Chronicle/website/API consumption.
4. Document current create-song path as protected Work creation, not rights creation.
5. Document royalty engine as transitional calculation/ledger engine pending Rights Interest authority.

No-refactor improvements:

1. Use existing docs/build-log lineage as the governance trail for future work.
2. Keep Chronicle catalogue visible through existing Works UI.
3. Keep release/distribution services untouched while documenting their authority boundary.
4. Keep finance boundary unchanged while documenting no automatic royalty posting.
5. Keep existing registration/submission engine observed while aligning terminology around identifiers as references/evidence.

## 6. High-Risk Areas

### 1. Rights Interest

Risk level: critical

Why:

- Rights Interest is the future authority layer for ownership, control, administration, collection, licensing, distribution, and royalty entitlement.
- Existing rights lifecycle seeds are useful but should not silently become canonical without authority design.
- Downstream registration, release, distribution, and royalty workflows depend on this layer.

Safe interpretation:

- Reuse `rights_assets` and `rights_ownership_claims` first.
- Extend through design/read models before schema.

### 2. Royalty Authority

Risk level: critical

Why:

- Current royalty engine calculates from `work_contributors`.
- Contributor participation is not final entitlement.
- Incorrect royalty authority can create financial and trust risk.

Safe interpretation:

- Protect current royalty engine as transitional.
- Do not rewrite it yet.
- Design upstream authority first.

### 3. Master / Recording

Risk level: high

Why:

- ISRC, master ownership, commercial recording identity, performers, producers, and master-side royalties belong here.
- Current Work UX is not yet Master-authoritative.

Safe interpretation:

- Reuse existing Recording slice, `recording_contributors`, release-track references, and File Vault `master_audio`.
- Do not create new Master structures until existing seeds are fully assessed.

### 4. Registration / Identifiers

Risk level: high

Why:

- Identifiers can be mistaken for ownership proof.
- Registration/submission/evidence structures exist but are not yet unified behind Rights Interest authority.

Safe interpretation:

- Reuse registration/submission engine seeds.
- Clarify identifier governance before any import of ISRC/ISWC/IPI/UPC data.

### 5. Party

Risk level: high

Why:

- Party is the legal/commercial identity layer.
- CRM Contact, Contributor, Artist Brand, payee, company, distributor, society, and Workspace User can be confused.

Safe interpretation:

- Reuse `crm_contacts` as the closest Party seed.
- Extend cautiously through read models and contracts.

## 7. What Must Stay Protected

Protected foundations:

- `musical_works`
- Chronicle catalogue records
- create-song path
- workspace scoping
- contributor capture
- File Vault foundation
- release/distribution foundations
- finance boundary
- current royalty engine as transitional
- existing docs and build-log lineage

Protection rules:

- Do not rename or demote `musical_works`.
- Do not mutate Chronicle foundation catalogue records.
- Do not change `POST /api/songs/create` or the RPC path without explicit scope.
- Do not remove contributor capture.
- Do not treat File Vault references as verified evidence.
- Do not change release/distribution schemas as part of interpretation.
- Do not merge royalty administration into Finance.
- Do not rewrite the royalty engine before upstream authority is designed.

## 8. Future Workstream Ranking

1. Read-model alignment

Reason:

- Lowest risk, high clarity, no schema required.
- Can expose seed/transitional/protected/authority status across domains.
- Supports all later design.

2. Language correction

Reason:

- Reduces authority drift without changing backend behavior.
- Especially useful in Works, contributors, evidence, release/readiness, distribution, and royalty wording.

3. Rights inventory / Rights Interest authority design

Reason:

- Highest downstream dependency.
- Needed before registration/release/distribution/royalty authority can mature.

4. Party inventory / identity boundary design

Reason:

- Required to distinguish legal/commercial identity from CRM Contact, Contributor, Artist Brand, Workspace User, and payee.
- Should reuse `crm_contacts` first.

5. Royalty inventory / Royalty Authority design

Reason:

- High financial risk and business value.
- Must wait for at least initial Rights/Party interpretation so it does not repeat contributor-split authority drift.

Secondary future workstreams:

- Master / Recording seed assessment
- Registration/identifier governance alignment
- public Chronicle/API projection design

## 9. Immediate Recommendation

First actual practical workstream:

```text
Read-model alignment
```

Why this, before Party/Rights/Royalty implementation:

- It is non-destructive.
- It can reuse existing seeds immediately.
- It can show where records are protected, transitional, candidate, verified, deferred, or unknown.
- It helps Product and Engineering see the current platform clearly before designing changes.
- It reduces risk to Chronicle catalogue and current Works UI.
- It supports later Party, Rights, Master, Registration, Release, Distribution, Royalty, Finance, Evidence, and Public/API workstreams.

Recommended next artifact:

```text
docs/platform/SENTRY-SOUND-READ-MODEL-ALIGNMENT-DESIGN-V1.md
```

Boundary:

- design/read-model only
- no code
- no schema
- no API
- no migration
- no UI changes
- no data writes

## 10. What Must Remain Paused

Remain paused until further approval:

- schema changes
- migrations
- royalty rewrites
- contributor migrations
- Party implementation
- Rights Interest implementation
- Master / Recording implementation
- registration identifier import/governance implementation
- Release Readiness backend gates
- Distribution readiness enforcement
- Chronicle ownership/split/identifier imports
- public Chronicle feed/API
- finance/royalty posting automation
- destructive cleanup
- table renaming
- table deletion

Do not proceed from this interpretation directly into implementation. The next safest step is read-model alignment design.

