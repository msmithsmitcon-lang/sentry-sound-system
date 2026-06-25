# Sentry Sound Controlled Refactor Roadmap V1

Date: 2026-06-05

Status: design and architecture roadmap only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

This roadmap converts the completed doctrine and gap-analysis work into a controlled, non-destructive alignment path for Sentry Sound.

The platform is working and must be protected. The goal is not a rewrite. The goal is to prevent authority drift while gradually aligning future backend work around the approved doctrine chain:

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

The roadmap separates:

- what must change eventually
- what should change soon
- what can stay
- what must not be touched yet
- what needs read-only inventory first
- what needs approval before execution

The first practical next action after this roadmap is approved is:

```text
Read-Only Current-State Inventory V1
```

That inventory should map existing code, tables, routes, services, docs, and imported Chronicle catalogue state to doctrine domains. It should not create schema, run migrations, refactor code, or change data.

## 2. Roadmap Principles

Core principles:

- Protect working product surfaces.
- Align authority before extending high-stakes backend behavior.
- Prefer read-only inventory before design, design before schema, schema before migration, and migration before retirement.
- Keep changes additive until a specific retirement plan is approved.
- Do not rename, delete, or demote current working structures casually.
- Preserve auditability and migration reversibility where possible.
- Treat Chronicle as a reference tenant/pilot, not platform-specific logic.
- Treat Sentry Sound as the system of record.
- Treat spreadsheets as intake only.
- Treat external systems as consumers or evidence/reporting inputs, not operational truth owners.

Authority principles:

- Contributor splits are not final rights authority.
- Artist visibility is not ownership.
- Workspace access is not copyright ownership.
- Distribution is not royalty allocation.
- Royalty events are evidence of activity, not ownership authority.
- Finance remains separate from royalty administration.
- Rights Interest is the future authority layer for ownership, control, administration, collection, licensing, distribution, and royalty entitlement.

## 3. Non-Goals

This roadmap does not authorize:

- broad rewrite
- production schema change
- SQL or migration work
- API route changes
- backend service refactors
- UI changes
- Chronicle data mutation
- data imports
- royalty engine implementation changes
- contributor split migration
- table deletion
- table renaming
- hardcoding Chronicle Music into platform logic
- turning `musical_works` into legacy
- treating contributor splits as final authority
- treating distributor/DSP/society references as ownership proof

## 4. Current Protected Working Foundation

The following foundations are protected and should remain stable unless a later approved roadmap phase explicitly scopes change:

- `musical_works` as the active Work seed
- Chronicle foundation catalogue records
- workspace scoping
- existing create-song path
- contributor capture as participation/readiness data
- current Works UI
- File Vault foundation
- release/distribution foundations
- finance boundary
- current royalty engine as transitional calculation/ledger engine
- existing docs and build log lineage

Protected does not mean perfect. It means useful, working, and not to be destabilized prematurely.

## 5. Phase 0: Doctrine Lock

Classification: Doctrine lock only

Purpose:

- Make the completed doctrine chain the required planning context for future work touching ownership, registrations, releases, distribution, royalties, artist/company identity, contracts, evidence, public exports, or rights administration.

Scope:

- Reference the completed doctrine artifacts in future briefs.
- Use the consolidation and gap-analysis document as the baseline map.
- Keep current working product behavior unchanged.

Outputs:

- approved roadmap
- shared glossary and authority language
- explicit implementation pause boundaries

Exit criteria:

- Product owner confirms this roadmap as the control path.
- Future backend work agrees to start with read-only inventory, not schema.

Requires approval before:

- any schema design
- any service changes
- any import or migration
- any UI rewrite

## 6. Phase 1: Read-Only Current-State Inventory

Classification: Read model alignment

Purpose:

- Map current platform reality to doctrine domains before any refactor work.

Inventory domains:

- Workspace
- Party / CRM / Identity
- Artist Brand
- Work
- Master / Recording
- Contributor
- Rights Interest
- Registration / Identifiers
- Release / Readiness
- Distribution
- Royalty Authority
- Finance
- File Vault / Evidence
- Chronicle Integration
- Public/API Consumption

Inventory should inspect:

- tables
- migrations
- Prisma schema
- routes
- services
- read repositories
- UI wording surfaces
- docs
- Chronicle imported records
- build-log lineage

Inventory must classify each item as:

- aligned
- partially aligned
- transitional
- legacy authority path
- missing
- risky
- protected
- do-not-touch

Strict boundaries:

- no schema changes
- no code changes
- no UI changes
- no data writes
- no imports
- no migrations
- no refactors

Exit criteria:

- A read-only inventory artifact exists.
- The inventory identifies exact files/tables/routes/docs for later design.
- No execution work has started.

## 7. Phase 2: UI/Docs Language Correction

Classification: UI language correction

Purpose:

- Reduce authority drift by correcting language that overstates ownership, readiness, registration, distribution, royalty, evidence, or finance truth.

Allowed work after approval:

- copy changes
- docs cross-reference updates
- labels that clarify "draft", "candidate", "supporting material", "participation", "metadata", "not verified", "not authoritative", or "deferred"

Protected workflows:

- create-song path
- current Works UI structure
- Chronicle catalogue visibility
- contributor capture flows
- File Vault reference flows

Not allowed in this phase:

- backend behavior changes
- schema changes
- new gates
- data migrations
- route changes

Exit criteria:

- UI/docs language no longer implies contributor splits are ownership, artist brands are companies, readiness is legal clearance, or royalty events are entitlement.

## 8. Phase 3: Backend Contract Alignment Design

Classification: Backend contract extension

Purpose:

- Design future route/service contracts that preserve current behavior while distinguishing doctrine domains.

Design targets:

- Party vs CRM Contact vs Contributor vs Artist Brand
- Work vs Master / Recording
- Contributor split vs Rights Interest
- Registration identifier vs ownership proof
- Release lifecycle vs Release Readiness
- Distribution Relationship vs royalty allocation
- Royalty Event vs Royalty Authority
- Finance transaction/commitment vs royalty entitlement
- File reference vs verified evidence

Allowed work:

- contract design docs
- payload sketches
- compatibility notes
- migration-readiness notes
- preflight/read-model concepts

Not allowed:

- API implementation
- route modification
- service refactor
- schema work

Exit criteria:

- Future backend changes have approved contract direction before implementation.

## 9. Phase 4: Authority Layer Design

Classification: Doctrine lock only / backend contract extension design

Purpose:

- Design the authority layers before adding or changing schema.

Authority layers to design:

- Party identity authority
- Rights Interest authority
- Master / Recording authority
- Registration/identifier authority
- Release Readiness authority
- Distribution Relationship authority
- Royalty Authority
- Evidence authority
- Public/API projection authority

Required design questions:

- which entity owns the truth?
- which entities consume that truth?
- which current structures are seeds?
- which structures are transitional?
- which authority paths must remain paused?
- what must be reversible?
- what is workspace-scoped?
- what must not expose private data?

Exit criteria:

- Authority designs are approved before schema planning.

## 10. Phase 5: Additive Schema Planning

Classification: Schema addition

Purpose:

- Plan additive schema only where current structures cannot safely carry canonical authority.

Rules:

- No SQL in this roadmap phase artifact.
- No implementation without explicit later approval.
- Prefer additive tables/fields over destructive changes.
- Avoid renames and deletes.
- Keep transitional fields for audit and compatibility.
- Do not make `musical_works` legacy.
- Do not mutate Chronicle imported records.

Candidate planning areas:

- canonical Party layer
- Rights Interest authority layer
- Master / Recording active layer
- identifier governance
- Release Readiness read/authority model
- Royalty Authority payee/entitlement model
- public-safe export projections

Exit criteria:

- Schema plan has rollback strategy, migration strategy, verification plan, and protected-surface review.

## 11. Phase 6: Controlled Migration Planning

Classification: Controlled migration

Purpose:

- Plan how existing records would map into new authority layers without overwriting or deleting current operational truth.

Migration planning rules:

- dry-run first
- workspace-scoped
- no overwrite by default
- preserve original source references
- preserve transitional records
- explicitly identify unknown/ambiguous records
- do not treat Chronicle deferred fields as authority
- keep contributor splits as capture/readiness data unless verified authority exists

Migration planning targets:

- CRM/contact to Party candidates
- artist profiles to Artist Brand/Party relationships
- contributors to Contributor/Party candidates
- rights claims to Rights Interest candidates
- release-track/master references to Master candidates
- registration identifiers to identifier governance candidates
- royalty contributor allocations to transitional royalty evidence

Exit criteria:

- Approved dry-run plan.
- Approved verification plan.
- Approved rollback/recovery plan.

## 12. Phase 7: Execution Gates

Classification: Approval gates

Purpose:

- Define the checks required before any implementation can begin.

Required gates:

- doctrine alignment confirmed
- read-only inventory complete
- affected domains identified
- protected foundations reviewed
- test plan approved
- rollback/recovery plan approved
- workspace scope confirmed
- Chronicle impact reviewed
- public/private data impact reviewed
- finance/royalty boundary reviewed
- no destructive operation unless explicitly approved

Execution may begin only when:

- the specific phase is approved
- the exact files/tables/routes/services are listed
- non-goals are restated
- verification criteria are clear
- rollback path is documented

## 13. Phase 8: Legacy Authority Retirement

Classification: Legacy retirement

Purpose:

- Retire only legacy authority use, not useful historical/capture structures.

Allowed retirement after approval:

- stop using contributor splits as final royalty authority
- stop using release lifecycle `ready` as full readiness authority
- stop using release-track ISRC as canonical Master authority
- stop treating distributor/DSP references as authority
- stop treating finance commitments as royalty entitlement

Not allowed without explicit approval:

- deleting tables
- renaming tables
- deleting Chronicle records
- removing contributor capture
- removing current Works UI
- removing royalty engine history
- deleting build-log lineage

Exit criteria:

- downstream flows consume approved canonical authority
- transitional fields remain available for audit/reconciliation where needed

## 14. Risk Ranking

Critical risk:

- changing royalty calculations before Rights Interest and Party/payee authority exist
- introducing Party/Rights/Master schema without inventory and migration plan
- modifying Chronicle foundation catalogue records without scoped approval
- breaking create-song or current Works UI

High risk:

- treating contributor splits as final authority
- treating registration identifiers as ownership proof
- treating release readiness as lifecycle status only
- treating distribution/DSP acceptance as proof of rights
- merging royalty administration into Finance

Medium risk:

- ambiguous UI language
- public/API feeds without privacy/authority projection
- File Vault supporting materials mistaken for verified evidence
- artist brand metadata mistaken for company/payee authority

Low risk:

- doctrine references
- build-log updates
- read-only inventory
- docs cross-links
- non-authoritative UI copy clarification after approval

## 15. Dependency Order

Recommended order:

1. Roadmap approval.
2. Read-Only Current-State Inventory V1.
3. UI/docs authority language review.
4. Backend contract alignment design.
5. Party identity authority design.
6. Rights Interest authority design.
7. Master / Recording authority design.
8. Registration/identifier governance design.
9. Release Readiness design.
10. Distribution Relationship alignment design.
11. Royalty Authority alignment design.
12. Finance posting boundary design.
13. Public/Chronicle projection design.
14. Additive schema planning.
15. Controlled migration planning.
16. Execution gate approval.
17. Legacy authority retirement.

Do not skip from doctrine directly to schema.

## 16. Approval Gates

Approval is required before:

- creating schema
- writing migrations
- modifying API contracts
- changing backend services
- changing royalty engine behavior
- importing Chronicle deferred fields
- changing public/API data exposure
- migrating contributor splits
- creating Party/Rights/Master authority records
- retiring legacy authority paths
- changing current Works UI behavior

Each approval must state:

- scope
- non-goals
- affected files/tables/routes/services
- protected foundations
- test/check plan
- rollback/recovery plan
- workspace/data impact

## 17. What Remains Paused

Remain paused until explicit approval:

- canonical Party schema/migrations
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
- destructive cleanup
- table renaming
- table deletion
- current Works UI refactor
- create-song contract changes

## 18. First Practical Next Action After Roadmap Approval

Create:

```text
docs/platform/SENTRY-SOUND-READ-ONLY-CURRENT-STATE-INVENTORY-V1.md
```

Purpose:

- map existing code/tables/routes/docs to doctrine domains
- identify aligned, partial, transitional, missing, risky, protected, and do-not-touch areas
- produce a factual inventory before any design or schema work

Inventory domains:

- Workspace
- Party / CRM / Identity
- Artist Brand
- Work
- Master / Recording
- Contributor
- Rights Interest
- Registration / Identifiers
- Release / Readiness
- Distribution
- Royalty Authority
- Finance
- File Vault / Evidence
- Chronicle Integration
- Public/API Consumption

Boundary:

- read-only inspection only
- no schema
- no code
- no migrations
- no UI changes
- no imports
- no database writes

Do not create this inventory until explicitly requested.

