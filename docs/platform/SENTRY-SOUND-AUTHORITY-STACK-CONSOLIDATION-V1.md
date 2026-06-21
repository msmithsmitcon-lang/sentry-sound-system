# Sentry Sound Authority Stack Consolidation V1

Date: 2026-06-05

Status: design and consolidation only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

Sentry Sound does not need a blank-sheet rebuild to align with the approved doctrine.

The current platform already has strong operational seeds for most authority domains. The safest path is to reuse existing seeds first, label them accurately, protect working foundations, and only extend or refactor where current seeds cannot safely carry doctrine responsibility.

Estimated current-state alignment remains approximately 75-85 percent.

The main issue is not absence of structure. The main issue is authority interpretation:

- some records are protected foundation truth
- some records are candidate authority seeds
- some records are transitional working structures
- some fields are non-authoritative context
- some fields create authority risk if surfaced or consumed without labels

This consolidation moves the platform from one-document-at-a-time doctrine into a practical authority-stack view. The next work should be execution-adjacent, starting with read-only authority status mapping and terminology/read-model labels, not schema changes.

## 2. Authority Stack Map

| Doctrine Layer | Existing Seed | Current Status | Risk | Recommendation |
| --- | --- | --- | --- | --- |
| Workspace | `workspaces`, workspace members, workspace context/authz | Active operational boundary | Low | Promote/protect as canonical tenancy and access boundary |
| Party / CRM Identity | `crm_contacts`, contact channels, contact relationships, contract parties | Closest Party seed, not full Party authority | High | Extend through read-model labels and future Party contract design |
| Artist Brand | `artist_profiles`, aliases, genres, social links | Strong Artist Brand seed | Medium | Promote as public creative identity seed |
| Contributor Participation | `contributors`, `work_contributors`, `recording_contributors` | Useful participation/readiness capture | High | Protect as participation, not ownership or royalty authority |
| Work Foundation | `musical_works`, create-song path, Works read models | Active Work seed and protected catalogue foundation | Low | Protect as Work foundation truth |
| Rights Interest Seed | `rights_assets`, `rights_ownership_claims`, lifecycle/audit events, contract links | Directionally aligned authority seed | Critical | Extend carefully; do not silently promote to final authority |
| Master / Recording Seed | Prisma `Recording` / `RecordingPerformer`, `recording_contributors`, `release_tracks.sound_recording_id`, File Vault `master_audio` | Useful but not active canonical layer | High | Extend after authority/read-model design |
| Registration / Identifier Seed | registration/evidence/submission engine, readiness rules, ISWC/ISRC/IPI/identifier references | Substantial seed, not unified authority chain | High | Extend through identifier governance and read model |
| Release / Readiness Seed | `releases`, `release_tracks`, release versions/snapshots, work completeness/readiness | Protected operational foundation | Medium | Extend through readiness labels and upstream dependency rules |
| Distribution Relationship Seed | distribution pipeline, channels, release-channel delivery/audit structures | Strong downstream operational seed | Medium | Promote as consumer of Release/Registration/Rights truth |
| Royalty Authority Seed | royalty engine, ledger, payout/settlement services, royalty-control alignment preflight | Transitional calculation/ledger engine | Critical | Observe/protect; do not rewrite until upstream authority is designed |
| Finance Boundary | finance/workspace finance/accounting/commitment structures | Separate operational finance foundation | Low | Protect; keep separate from royalty authority |
| Public / Chronicle Consumption | Chronicle docs/import results, Works UI, public/landing/API surfaces | Protected pilot consumption direction, no public-safe authority projection yet | Medium | Observe and design public-safe projections later |

## 3. Existing Seeds That Can Be Promoted

The following existing structures can likely become canonical, or remain canonical, with minimal change:

- `workspaces` and workspace context as the tenancy/access boundary
- `musical_works` as the active Work foundation seed
- Chronicle foundation catalogue records as workspace-scoped Work truth
- `artist_profiles` as the Artist Brand seed
- distribution pipeline structures as downstream Distribution Relationship seeds
- finance/workspace finance structures as the Finance Boundary

Promotion does not mean every field becomes authoritative. It means the structure can carry the doctrine role with language/read-model alignment and protected boundaries.

## 4. Existing Seeds That Should Be Extended

The following are useful but need contract, read-model, or authority alignment:

- `crm_contacts` should extend toward Party candidate interpretation, not immediate Party implementation.
- `contributors`, `work_contributors`, and `recording_contributors` should keep participation meaning while future Party/Rights/Payee relationships are designed.
- `rights_assets` and `rights_ownership_claims` should extend toward Rights Interest authority after explicit verification, territory, date, evidence, and Party rules are approved.
- Prisma `Recording` / `RecordingPerformer`, release-track recording references, and File Vault `master_audio` should extend toward Master / Recording authority after existing seeds are mapped.
- registration/evidence/submission structures should extend toward identifier governance and upstream Rights Interest dependency.
- `releases` and `release_tracks` should extend through Release Readiness labels and dependency rules.
- File Vault/evidence structures should extend through evidence verification and public/private classification.

## 5. Existing Structures That Must Remain Protected

Protected foundations:

- `musical_works`
- Chronicle catalogue
- create-song path
- workspace scoping
- contributor capture
- File Vault
- release/distribution foundations
- finance boundary
- current royalty engine as transitional
- existing Works UI and read repositories
- current docs and build-log lineage

Protected means useful and working. It does not mean legally complete, final, or free from future extension.

## 6. Existing Structures That Are Authority-Risky

The following can mislead future work if treated as authority:

- contributor split percentages treated as ownership
- contributor split percentages treated as royalty entitlement
- `work_contributors` treated as final rights authority
- `recording_contributors` treated as master ownership
- Artist Brand visibility treated as owner, company, payee, publisher, or registrant
- CRM contact existence treated as legal Party, rights holder, payee, or signing authority
- `rights_ownership_claims` treated as final verified Rights Interest without evidence/rules
- `masterOwnerId` / `masterOwnerName` treated as final master ownership
- File Vault `master_audio` treated as approved commercial Master
- uploaded/demo audio treated as Master authority
- ISRC/ISWC/IPI/UPC/SAMRO/CAPASSO/distributor references treated as ownership proof
- release lifecycle `ready` treated as legal clearance
- distribution status treated as release readiness or rights clearance
- royalty events treated as ownership or entitlement proof
- finance transactions treated as royalty authority
- Chronicle workbook fields treated as operational truth after intake

## 7. Missing Authority Decisions

The following decisions are still required before schema/API/backend execution:

- What exact read-model labels should be used in the first executable status map?
- How should CRM Contact map to future Party candidate status?
- Which current rights lifecycle fields can be considered candidate, verified, blocked, or non-authoritative?
- What evidence threshold is required before a Rights Interest can be consumed downstream?
- How should existing Recording/RecordingPerformer and release-track recording references be reconciled before Master activation?
- How should ISWC, ISRC, IPI, UPC/EAN, SAMRO, CAPASSO, distributor, and DSP references be classified?
- What is the minimum Release Readiness status map that does not create legal authority?
- Which public/Chronicle fields are public-safe now, private, deferred, or blocked?
- How should current royalty engine outputs be labelled while Rights Interest authority is not yet enforced?
- What approval gate is required before any schema addition or migration?

## 8. Shortest Safe Path To Alignment

The shortest safe path is:

1. Freeze the authority-stack language as the working map.
2. Create a read-only authority status mapping against current structures.
3. Add terminology/read-model labels in docs and planning artifacts first.
4. Inventory UI/API language that overstates authority.
5. Design one contract-alignment slice for read-only status output before any mutation.
6. Only after approval, consider additive backend contract extensions.
7. Only after contract approval, consider schema additions.
8. Only after schema and migration planning, consider controlled migration or retirement of transitional authority paths.

This path preserves the Chronicle catalogue, create-song flow, Works UI, contributors, File Vault, release/distribution foundations, finance boundary, and current royalty engine while reducing authority drift.

## 9. Consolidated Priority Order

Recommended workstream order:

1. Read-only authority status mapping
2. Terminology and read-model label correction across docs/UI/API planning
3. Public/private field classification for Chronicle and future public/API consumption
4. Registration / Identifier read-model alignment
5. Release / Readiness read-model alignment
6. Distribution Relationship read-model alignment
7. Royalty Authority transitional-status mapping
8. Backend contract alignment design for Party/Rights/Master/Registration
9. Additive schema planning only where existing seeds cannot carry the role
10. Controlled migration planning for contributor/royalty/rights transitions

Do not create many more doctrine artifacts unless a missing decision blocks execution. Future docs should be shorter execution-brief or design-gate artifacts.

## 10. Recommended First Execution-Adjacent Workstream

Recommended first execution-adjacent workstream:

```text
Read-Only Authority Status Mapping V1
```

Why this first:

- It uses existing seeds.
- It does not require schema changes.
- It can protect Chronicle catalogue data.
- It can clarify what is protected, candidate, transitional, deferred, non-authoritative, blocked, or authority-risky.
- It creates a concrete bridge to future UI/API/read-model work.
- It gives backend contract design something factual to target.

Expected scope:

- map existing records/tables/routes/docs to authority labels
- define read-only status names and descriptions
- identify which statuses are internal-only
- identify public-safe candidates
- identify blocked/deferred fields
- identify authority-risk warnings

Not in scope:

- code
- UI changes
- schema
- migrations
- data writes
- imports
- royalty recalculation
- contributor migration

## 11. What Should Remain Paused

The following remain paused until explicit approval:

- schema changes
- migrations
- royalty rewrite
- contributor migration
- Party implementation
- Rights Interest implementation
- Master implementation
- Chronicle deferred imports
- public feeds/APIs
- registration identifier imports
- release/distribution authority enforcement
- payee/royalty entitlement implementation
- deletion, renaming, or retirement of working structures

## 12. Stop Criteria For Analysis Phase

The analysis phase should stop when the following are true:

- the authority stack is accepted as the working map
- protected foundations are reaffirmed
- authority-risk structures are identified
- the first execution-adjacent workstream is approved
- the workstream has clear boundaries and stop rules
- no missing doctrine decision blocks read-only status mapping

At that point, Sentry Sound should move from broad analysis documents into controlled execution briefs.

Controlled execution should begin with read-only status mapping and terminology alignment, not schema or migration work.

## 13. Expected Conclusion

How much already exists?

- Most doctrine domains already have usable operational seeds.

What can be reused?

- Workspace, Work, Artist Brand, Release, Distribution, Finance, File Vault, Rights Lifecycle, Registration/Evidence, and Royalty structures all contain reusable seeds.

What needs interpretation only?

- Work, Chronicle catalogue, contributor participation, Artist Brand, File Vault, release/distribution foundations, finance boundary, and current royalty engine posture.

What needs extension?

- Party/CRM, Rights Interest, Master / Recording, Registration/Identifier, Release Readiness, public/API consumption, and royalty authority transition.

What genuinely needs future refactor?

- Contributor-derived royalty authority, Party/Rights/Master canonical enforcement, identifier governance, and public-safe authority projections may need future controlled refactor or additive schema after design approval.

What is the shortest safe route to execution?

- Stop broad doctrine expansion, approve Read-Only Authority Status Mapping V1, apply terminology/read-model labels, then design backend contracts only where read-only mapping proves a need.

