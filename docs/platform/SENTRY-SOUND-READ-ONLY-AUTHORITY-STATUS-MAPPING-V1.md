# Sentry Sound Read-Only Authority Status Mapping V1

Date: 2026-06-05

Status: design and read-only authority mapping only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

This document is the first platform-wide authority map for Sentry Sound.

It does not create new authority. It maps the authority posture of current platform structures only:

- where authority already exists
- where authority is protected platform truth
- where authority is only candidate or implied
- where authority is transitional
- where authority is deferred
- where authority risk exists
- where a structure has no authority and should never be treated as authority

Conclusion:

Sentry Sound already has mature protected authority in workspace scoping, Work foundation records, Chronicle foundation catalogue records, finance boundary, and several operational lifecycle foundations. The weaker areas are not empty. They have seeds, but those seeds must be labelled correctly before they can safely drive downstream behavior.

Highest authority confidence:

- Workspace
- Work
- Chronicle Intake after import
- Finance
- Artist Brand

Lowest authority confidence:

- Royalty Authority
- Rights Interest
- Registration / Identifiers
- Master / Recording
- Public/API Consumption

The platform is mature enough to move from broad analysis into controlled execution-adjacent work. The first safe execution-adjacent workstream should be terminology/read-model labels and read-only authority status mapping in planning/read surfaces, not schema or migrations.

## 2. Authority Status Categories

### Protected Authority

Trusted platform truth.

Use when the current platform can be relied on for its own limited domain.

Protected Authority does not imply legal ownership, registration acceptance, royalty entitlement, or public-safe status unless the domain explicitly owns that authority.

### Candidate Authority

Could become authority later.

Use when an existing seed is directionally aligned with doctrine but needs review, contract design, evidence, verification, or future governance.

### Transitional Authority

Operationally useful but not final authority.

Use when a current structure supports working product behavior but must not become the final doctrine authority source.

### Deferred Authority

Requires future governance.

Use when authority belongs to a future controlled design, future verification process, or future source-of-truth rule.

### Authority Risk

May be incorrectly interpreted as authority.

Use when a record, field, label, workflow state, identifier, or reference could mislead users, APIs, reports, or future code.

### No Authority

Should never be treated as authority.

Use for notes, display labels, public presentation, files, external references, and downstream events where they cannot create ownership, identity, registration, release, distribution, or royalty truth.

## 3. Consolidated Authority Table

| Domain | Existing Seed | Status | Risk | Recommendation |
| --- | --- | --- | --- | --- |
| Workspace | `workspaces`, `workspace_members`, workspace context, authz routes/services | Protected Authority | Low | Trust for tenancy, access, membership, and route context only |
| Party / CRM | `crm_contacts`, contact channels, relationships, notes, contract parties | Candidate Authority | High | Treat as Party candidate and operational identity, not legal/rightsholder/payee authority |
| Artist Brand | `artist_profiles`, aliases, genres, social links, artist audit events | Protected Authority | Medium | Trust as public creative identity only |
| Contributor | `contributors`, `work_contributors`, `recording_contributors`, `RecordingPerformer` | Transitional Authority | High | Trust participation capture; do not trust for rights, royalty, payee, or registration authority |
| Work | `musical_works`, create-song path, Works read repositories, Chronicle foundation Works | Protected Authority | Low | Trust as Work foundation truth and catalogue identity |
| Rights Interest | `rights_assets`, `rights_ownership_claims`, lifecycle/audit events, contract links | Candidate Authority | Critical | Treat as rights authority seeds pending verification/evidence/Party rules |
| Master / Recording | Prisma `Recording`, `RecordingPerformer`, `recording_contributors`, `release_tracks.sound_recording_id`, File Vault `master_audio` | Candidate Authority | High | Treat as Master / Recording seeds; do not treat audio/ISRC/release refs as final authority |
| Registration / Identifiers | registration services, readiness rules, evidence repositories, submission engine, ISWC/ISRC/IPI/UPC/SAMRO/CAPASSO/distributor references | Candidate Authority | High | Treat identifiers as registration/evidence state, not ownership |
| Release / Readiness | `releases`, `release_tracks`, release versions/snapshots, work completeness/readiness | Transitional Authority | Medium | Trust release operations; do not treat readiness/status as rights clearance |
| Distribution Relationship | distribution channels, distribution releases, delivery/audit pipeline | Transitional Authority | Medium | Trust downstream delivery state only |
| Royalty Authority | royalty engine, ledger, payout/settlement services, royalty-control alignment preflight | Transitional Authority | Critical | Protect as current calculation/ledger engine; do not treat as final entitlement authority |
| Finance | finance/workspace finance tables, accounts, transactions, commitments, reports | Protected Authority | Low | Trust as operational finance boundary, separate from royalty authority |
| File Vault / Evidence | `file_vault_items`, links, versions, audit events, evidence readiness/evidence vault seeds | Candidate Authority | Medium | Trust file existence and links; treat evidence authority as candidate until verified |
| Chronicle Intake | Chronicle docs, verified workbook, imported foundation Works, import result | Protected Authority | Medium | Trust imported Works as backend catalogue truth; deferred fields remain non-authoritative |
| Public/API Consumption | public/landing surfaces, Works/Artists APIs, future Chronicle feed direction | Deferred Authority | Medium-high | Do not expose authority fields publicly until public-safe projection is approved |

## 4. Domain Authority Mapping

### Workspace

Existing structures:

- `workspaces`
- `workspace_members`
- `workspace_settings`
- `workspace_activity`
- `workspace_user_roles`
- `workspace_invitations`
- `workspace_plan_assignments`
- `user_profiles`
- `authorization_audit_events`
- authenticated workspace context and authz services

Current authority status:

- Protected Authority

Why:

- Workspace is the active tenancy, access, and operational boundary.
- It controls who can act in the platform and which workspace records belong to.
- It is mature enough to trust for access and scope.

Risks:

- Workspace access can be mistaken for copyright ownership.
- Workspace operator status can be mistaken for legal authority, payee authority, or rights ownership.

Recommended interpretation:

- Trust Workspace for access, tenancy, membership, and operational scope.
- Never treat Workspace as copyright ownership or royalty/payee authority.

### Party / CRM

Existing structures:

- `crm_contacts`
- `crm_contact_emails`
- `crm_contact_phones`
- `crm_contact_relationships`
- `crm_contact_notes`
- `crm_contact_audit_events`
- `contract_parties`

Current authority status:

- Candidate Authority

Why:

- CRM Contact is the closest current Party seed.
- It captures operational identity/contact information.
- It is not yet canonical legal/commercial Party authority.

Risks:

- CRM contact existence can be mistaken for rightsholder, payee, contract signer, publisher, label, distributor, society, or legal authority.

Recommended interpretation:

- Treat CRM Contact as operational identity and future Party candidate.
- Require future Party/Rights/Contract/Payee rules before downstream authority use.

### Artist Brand

Existing structures:

- `artist_profiles`
- `artist_aliases`
- `artist_genres`
- `artist_social_links`
- `artist_audit_events`

Current authority status:

- Protected Authority

Why:

- Artist Brand is already reasonably represented by artist profiles.
- It owns public creative identity and presentation, not legal authority.

Risks:

- Artist visibility can be mistaken for owner, company, payee, publisher, rights holder, or registrant.

Recommended interpretation:

- Trust Artist Brand for public creative identity.
- Never treat Artist Brand as legal/commercial authority by itself.

### Contributor

Existing structures:

- `contributors`
- `work_contributors`
- `recording_contributors`
- Prisma `RecordingPerformer`
- contributor search/admin services

Current authority status:

- Transitional Authority

Why:

- Contributors capture participation and readiness context.
- Contributor rows are operationally useful and should remain protected as participation data.
- Contributor split percentages currently influence some downstream behavior, but doctrine says they are not final rights or royalty authority.

Risks:

- Contributor percentage can be mistaken for ownership.
- Contributor percentage can be mistaken for royalty entitlement.
- Contributor identity can be mistaken for Party, payee, or registration authority.

Recommended interpretation:

- Treat Contributor as participation authority only.
- Treat split-derived ownership or royalty interpretation as authority risk until Rights Interest and Party/payee authority exist.

### Work

Existing structures:

- `musical_works`
- create-song path
- Works read repositories
- Work detail read models
- Chronicle foundation catalogue Works

Current authority status:

- Protected Authority

Why:

- `musical_works` is the active Work foundation seed.
- The Chronicle catalogue import successfully established real workspace-scoped Work records.
- Work exists independently from Rights Interest, Master, Registration, Release, Distribution, and Royalty Authority.

Risks:

- Work metadata may imply ownership, publishing, registration, release, or Master truth too early.
- ISWC or imported identifier fields can be mistaken for ownership.

Recommended interpretation:

- Trust Work as composition/song identity.
- Do not treat Work as rights, registration, release, distribution, master, or royalty authority.

### Rights Interest

Existing structures:

- `rights_assets`
- `rights_ownership_claims`
- `rights_lifecycle_events`
- `rights_audit_events`
- `contract_rights_links`
- rights lifecycle services

Current authority status:

- Candidate Authority

Why:

- Rights lifecycle structures are directionally aligned with future Rights Interest authority.
- They include rights assets, ownership claims, verification posture, territory/date concepts, lifecycle, and audit.
- They are not yet the binding downstream authority layer.

Risks:

- Ownership claims may be treated as verified rights without evidence.
- Contract links may be treated as universal ownership.
- Rights records may be consumed by registration, release, distribution, or royalties before authority rules are approved.

Recommended interpretation:

- Treat rights lifecycle records as Rights Interest seeds.
- Do not make them final downstream authority without approved Party, evidence, verification, territory, date, and conflict rules.

### Master / Recording

Existing structures:

- Prisma `Recording`
- Prisma `RecordingPerformer`
- `recording_contributors`
- `release_tracks.sound_recording_id`
- `release_tracks.isrc`
- File Vault `master_audio`
- recording readiness/compliance/evidence services

Current authority status:

- Candidate Authority

Why:

- Master / Recording seeds exist but are not active canonical authority in the main Works flow.
- Recording identity, ISRC, release track references, and master audio files are present in partial/transitional structures.

Risks:

- Audio files can be mistaken for commercial Masters.
- ISRC can be mistaken for ownership.
- Release-track references can be mistaken for Master approval.
- `masterOwnerName` can be mistaken for verified master ownership.

Recommended interpretation:

- Treat current recording structures as Master / Recording seeds.
- Defer ISRC governance, master ownership, commercial master approval, and master-side royalties until future authority design.

### Registration / Identifiers

Existing structures:

- registration services
- registration readiness rules
- registration evidence repositories
- submission engine
- submission snapshots/queue/events
- ISWC, ISRC, IPI, UPC/EAN, SAMRO, CAPASSO, distributor references where present

Current authority status:

- Candidate Authority

Why:

- Registration/evidence/submission structures are substantial and future-facing.
- They are not yet fully unified around verified Rights Interest, Party, Work, Master, and Evidence authority.

Risks:

- Identifier values can be mistaken for ownership.
- Society/distributor references can be mistaken for ownership or rights clearance.
- Registration readiness can be mistaken for legal clearance.

Recommended interpretation:

- Treat registration and identifiers as evidence/state of external registration processes.
- Do not let registration create ownership, Rights Interest, Work, Master, Release, Distribution, or Royalty Authority.

### Release / Readiness

Existing structures:

- `releases`
- `release_tracks`
- `release_versions`
- `release_metadata_snapshots`
- release audit events
- work completeness/readiness structures

Current authority status:

- Transitional Authority

Why:

- Release Management is a protected operational foundation.
- Release lifecycle and track records are useful for packaging and planning.
- Release readiness is not yet a full multi-domain authority gate.

Risks:

- Release `ready` status can be mistaken for legal clearance.
- Release-track ISRC can be mistaken for Master authority.
- Release status can be mistaken for distribution or royalty authority.

Recommended interpretation:

- Trust release structures for commercial packaging and lifecycle state.
- Treat readiness as operational, not legal/rights authority.

### Distribution Relationship

Existing structures:

- distribution channels
- distribution releases
- distribution release channels
- delivery status and audit structures
- distributor/DSP references

Current authority status:

- Transitional Authority

Why:

- Distribution pipeline is a strong downstream operational seed.
- It should consume release/registration/rights truth, not create it.

Risks:

- DSP availability can be mistaken for rights clearance.
- Distributor acceptance can be mistaken for ownership or registration authority.
- Distribution status can be mistaken for royalty entitlement.

Recommended interpretation:

- Trust distribution structures for delivery, availability, takedown, redelivery, and reconciliation context only.
- Do not use distribution as ownership or royalty authority.

### Royalty Authority

Existing structures:

- royalty event API/services
- royalty ledger
- contributor balance services
- payout batch and settlement services
- royalty-control alignment preflight

Current authority status:

- Transitional Authority

Why:

- Current royalty engine is operationally valuable.
- It remains transitional because current royalty logic can derive from contributor participation before verified Rights Interest and Party/payee authority exist.

Risks:

- Contributor splits can become final financial entitlement by accident.
- Royalty events can be mistaken for ownership proof.
- Distributor reporting can be mistaken for payee authority.

Recommended interpretation:

- Protect current royalty engine as transitional calculation/ledger infrastructure.
- Do not rewrite it yet.
- Do not treat outputs as final Royalty Authority until upstream Rights Interest and Party/payee rules are approved.

### Finance

Existing structures:

- finance accounts
- finance transactions
- workspace finance
- commitments
- reports
- receivables/payables/periods/budgets/tax/exchange-rate structures

Current authority status:

- Protected Authority

Why:

- Finance is mature as operational accounting/business finance boundary.
- Doctrine keeps finance separate from royalty administration.

Risks:

- Finance records can be mistaken for royalty entitlement.
- Payment records can be mistaken for ownership.

Recommended interpretation:

- Trust Finance for accounting, cash, business commitments, reporting, and operational money state.
- Do not treat Finance as rights, ownership, royalty, or payee authority by itself.

### File Vault / Evidence

Existing structures:

- `file_vault_items`
- `file_vault_links`
- `file_vault_versions`
- `file_vault_audit_events`
- evidence readiness/evidence vault structures
- Work Supporting Materials

Current authority status:

- Candidate Authority

Why:

- File Vault is a strong support/evidence seed.
- File existence and links are protected facts.
- Evidence authority requires verification and governance.

Risks:

- Uploaded files can be mistaken for verified evidence.
- `master_audio` can be mistaken for approved Master.
- split sheets/contracts can be mistaken for final authority without review.

Recommended interpretation:

- Trust File Vault for file existence, metadata, links, and audit.
- Treat evidence/legal authority as candidate until verified.

### Chronicle Intake

Existing structures:

- Chronicle Integration Principle
- Chronicle Intake Review Report
- Chronicle Foundation Works Import Plan/Result
- verified workbook path/history
- imported Chronicle foundation Works

Current authority status:

- Protected Authority for imported Work foundation
- Deferred Authority for rights, identifiers, masters, contributors, releases, registrations, and ownership fields

Why:

- Chronicle catalogue data was approved and imported as foundation Works.
- The spreadsheet remains intake only.
- Backend now holds the authoritative Chronicle Work foundation for this workspace.

Risks:

- Workbook values can be reintroduced as operational truth.
- Ownership split, ISRC, ISWC, master owner, publishing owner, and notes can be mistaken for backend authority.

Recommended interpretation:

- Trust imported Chronicle Works as backend Work truth.
- Treat all deferred Chronicle fields as non-authoritative until approved migration phases.

### Public/API Consumption

Existing structures:

- Works APIs/read models
- Artist APIs
- public/landing surfaces
- Hosted Public Music Pages doctrine
- Chronicle public consumption direction

Current authority status:

- Deferred Authority

Why:

- Public/API surfaces exist, but public-safe authority projection is not yet designed.
- Chronicle should consume Sentry Sound truth only through approved APIs/exports/feeds later.

Risks:

- Public feeds can expose private rights, contributors, ownership, identifiers, files, or royalty context.
- API consumers can mistake candidate/transitional fields for verified authority.

Recommended interpretation:

- Keep public/API authority fields paused.
- Design public-safe projections before external consumption of operational authority.

## 5. Key Questions Answered

### What can already be trusted?

- Workspace for access and tenancy.
- Work records for composition/catalogue foundation.
- Chronicle imported records as backend Work truth.
- Artist profiles for public creative identity.
- Finance for operational finance.
- File Vault for file existence and links.
- Release/distribution structures for operational lifecycle/delivery state only.

### What should be treated as protected truth?

- `workspaces` and workspace context
- `musical_works`
- Chronicle foundation catalogue Works
- create-song path outputs
- artist profile identity as public creative identity
- contributor participation existence
- File Vault file/link existence
- finance transactions/accounts as finance records

### What is only a candidate?

- CRM Contact as future Party
- rights ownership claims as future Rights Interest
- Recording slice as future Master / Recording
- ISRC/ISWC/IPI/UPC/SAMRO/CAPASSO/distributor references as registration/identifier evidence
- File Vault materials as evidence
- public/API fields as future public-safe projections

### What is currently misleading?

- contributor percentages
- artist visibility
- CRM contact existence
- `masterOwnerName`
- release `ready`
- release-track ISRC
- distributor/DSP acceptance
- royalty event activity
- Chronicle workbook ownership/identifier fields

### What creates the highest authority risk?

Highest risk:

- Royalty engine outputs treated as final entitlement
- rights claims treated as verified ownership
- contributor splits treated as rights authority
- identifiers treated as ownership proof
- public/API projection before classification

### What domains are already mature enough?

Mature enough for protected interpretation:

- Workspace
- Work
- Chronicle imported Work foundation
- Artist Brand
- Finance
- release/distribution operational foundations
- File Vault file/link existence

### What domains genuinely need future work?

Future work needed:

- Party / CRM authority boundary
- Rights Interest verification and downstream authority rules
- Master / Recording activation path
- Registration / Identifier governance
- Royalty Authority transition away from contributor-derived entitlement
- public-safe API/feed projection

## 6. Authority Trust Ranking

Ranked from strongest authority confidence to weakest authority confidence.

| Rank | Domain | Confidence | Why |
| --- | --- | --- | --- |
| 1 | Workspace | Very high | Active tenancy/access boundary with broad route/service use; only risk is overinterpreting access as ownership |
| 2 | Work | Very high | `musical_works` is active, protected, and successfully holds Chronicle foundation catalogue truth |
| 3 | Chronicle Intake | High | Imported Chronicle Works are authoritative backend Work records; deferred fields are clearly excluded |
| 4 | Finance | High | Mature operational finance boundary; doctrine clearly separates it from royalty authority |
| 5 | Artist Brand | High | `artist_profiles` cleanly supports public creative identity if not overstated |
| 6 | Distribution Relationship | Medium-high | Strong downstream operational seed; safe for delivery state, not authority |
| 7 | Release / Readiness | Medium-high | Solid release foundation; readiness/status language needs authority limits |
| 8 | File Vault / Evidence | Medium | File/link authority is clear, but evidence authority requires verification |
| 9 | Contributor | Medium | Participation capture is useful, but split/entitlement interpretations are high risk |
| 10 | Party / CRM | Medium | CRM is a strong Party seed, but legal/commercial authority is not formalized |
| 11 | Master / Recording | Medium-low | Real seeds exist, but not activated as canonical recording authority |
| 12 | Registration / Identifiers | Medium-low | Substantial engine exists, but identifiers are easily misread and not fully governed by Rights Interest |
| 13 | Rights Interest | Low-medium | Directional seeds exist; downstream authority would be high-stakes without verification rules |
| 14 | Public/API Consumption | Low-medium | Public/API surfaces exist but no authority-safe projection is approved |
| 15 | Royalty Authority | Low | Operationally useful but highest risk because current outputs may derive from contributor participation rather than verified Rights Interest/payee authority |

## 7. Strongest Authority Domains

Strongest:

1. Workspace
2. Work
3. Chronicle Intake for imported Works
4. Finance
5. Artist Brand

Why:

- These domains already have clear ownership of their limited truth.
- They are working and structurally aligned.
- Their risks are mostly wording/overinterpretation risks rather than absence of structure.

## 8. Weakest Authority Domains

Weakest:

1. Royalty Authority
2. Rights Interest
3. Public/API Consumption
4. Registration / Identifiers
5. Master / Recording

Why:

- These domains depend on upstream authority that is not fully governed yet.
- Misinterpretation can produce legal, financial, public, or trust risk.
- Existing seeds are useful but not safe as final authority without explicit rules.

## 9. If Execution Started Tomorrow

### First 3 Safest Workstreams

1. Terminology/read-model label correction

Why:

- No schema required.
- No database writes required.
- Reduces authority drift immediately.
- Helps future UI/API/backend work use the same labels.

2. Read-only authority status mapping in planning/read surfaces

Why:

- Uses this document as the map.
- Can define protected/candidate/transitional/deferred/risk/no-authority labels before any implementation.
- Gives future backend contracts a safe target.

3. Public/private field classification for Chronicle and future API/feed consumption

Why:

- Protects Chronicle data.
- Prevents premature public exposure.
- Clarifies what can be shown externally before APIs/feeds are built.

### What Should Still Remain Paused?

Still paused:

- schema changes
- migrations
- royalty rewrite
- contributor migration
- Party implementation
- Rights Interest implementation
- Master implementation
- registration identifier imports
- Chronicle deferred imports
- public feeds/APIs
- release/distribution authority enforcement
- payee/royalty entitlement implementation
- deletion, renaming, or retirement of working structures

### Has The Analysis Phase Reached Sufficient Maturity?

Answer:

```text
YES
```

Justification:

- Doctrine is complete enough to guide work.
- Inventory is complete enough to map existing seeds.
- Priority analysis confirms the platform is not a blank-sheet rebuild.
- Read-model slices have defined the highest-risk interpretation boundaries for Work, Contributor, Party/CRM, Artist Brand, Rights Interest, and Master / Recording.
- This authority status map identifies what can be trusted, what is candidate, what is transitional, what is deferred, what is risky, and what has no authority.

The next step should not be another broad analysis document. The next step should be a controlled execution-adjacent brief for terminology/read-model labels or read-only authority status projection.

## 10. Final Boundary

This document performed read-only authority mapping only.

It did not:

- define new authority
- write SQL
- create migrations
- modify schema
- modify code
- create APIs
- refactor backend logic
- touch UI
- import data
- change database records

