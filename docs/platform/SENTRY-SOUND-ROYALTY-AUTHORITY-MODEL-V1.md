# Sentry Sound Royalty Authority Model V1

Date: 2026-06-05

Status: doctrine and royalty authority definition only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

Royalty Authority is the downstream financial authority layer that determines how royalty-bearing activity should be interpreted, allocated, held, reported, paid, reversed, disputed, or posted onward.

Royalty Authority is not contributor participation by itself. It is not artist visibility, a distributor payout, a society statement, a platform report, or a visible split row. It consumes verified Rights Interests, Work/Master truth, registration context, release context, distribution/reporting context, contracts/mandates where applicable, evidence, Party/payee identity, and effective-date/territory rules.

Immediate doctrine lock:

- Royalty entitlement is not automatically contributor participation.
- Royalty entitlement is not automatically artist visibility.
- Royalty entitlement is not automatically distributor payout.
- Royalty entitlement consumes Rights Interest authority.
- Royalty Authority consumes Work/Master truth.
- Royalty Authority consumes Registration context.
- Royalty Authority consumes Release context.
- Royalty Authority consumes Distribution reporting context.
- Royalty Events are evidence of activity, not ownership authority.
- Royalty calculations should ultimately derive from verified Rights Interests.

Current platform reality:

- Royalty Engine exists with `royalty_events`, `royalty_distributions`, and `royalty_ledger`.
- Current processing fetches contributor splits from `work_contributors`.
- Current integrity rules require splits to total 100 percent and distributions to map to contributors.
- Payout Engine exists with `payout_batches`, `payout_items`, and settlement flow.
- Finance docs state royalties remain separate and may later feed Finance only through approved posting.
- Evidence Vault direction already includes proof-before-payout and royalty eligibility gating.

This document does not design implementation. It defines the royalty authority doctrine future royalty calculation, statement ingestion, ledger, payout, settlement, finance posting, and reporting work must respect.

## 2. Recommended Royalty Authority Model

Conceptual model:

```text
Royalty Authority
  workspace context
  royalty source
  royalty event / statement context
  Work and/or Master context
  Release context
  Distribution/reporting context
  Registration/identifier context
  Rights Interest authority
  Contract/mandate support
  Party/payee authority
  entitlement rules
  territory/effective-date adjustments
  allocation calculation
  holds / disputes / exclusions
  ledger / payout / settlement context
  evidence and audit context
```

Royalty Authority should answer:

- what activity or income occurred?
- what source reported or paid it?
- which Work, Master, Release, territory, period, platform, or registration does it relate to?
- which Rights Interests were effective for that scope and period?
- which Parties or payees are entitled?
- what deductions, administration fees, reserves, recoupments, holds, or disputes apply?
- which calculation rules are being used?
- what evidence supports the event and allocation?
- what should be posted to royalty ledger, payout, settlement, or finance?

Royalty Authority should produce entitlement clarity, not ownership truth.

## 3. What Is Royalty Authority?

Royalty Authority is the governed authority layer for royalty interpretation and entitlement.

It may include:

- royalty source classification
- statement/report context
- event period
- amount/currency context
- Work/Master/Release mapping
- registration/identifier mapping
- distribution/reporting source
- Rights Interest authority
- Party/payee authority
- contract/mandate royalty terms
- territory/effective-date rules
- allocation rules
- administration fees
- mechanical/performance/master/publishing category separation
- holds/disputes/exclusions
- ledger and payout authority
- evidence and audit context

It is not:

- a Work
- a Master / Recording
- a Release
- a Registration
- a Distribution Relationship
- a Rights Interest by itself
- a contributor row by itself
- a distributor report by itself
- a general finance transaction by itself

## 4. Royalty Authority vs Contributor Split

Contributor split is capture/readiness or participation data.

Royalty Authority is entitlement authority for financial allocation and payout.

Doctrine rules:

- Contributor participation is not automatically royalty entitlement.
- A contributor can participate creatively without owning rights or receiving royalties.
- A contributor can receive royalties through a contract or mandate even if they are not the visible artist.
- A split row may be useful evidence, readiness input, or transitional calculation input.
- Final royalty entitlement should ultimately derive from Rights Interest, contract/mandate, Party/payee, and evidence authority.
- Current `work_contributors`-based royalty calculation is transitional until Rights Interest authority is formalized.

Chronicle reference:

M-Wis may perform on a master. That performance does not automatically mean M-Wis owns the master, owns publishing, controls distribution, or receives royalties without supporting Rights Interest/payee authority.

## 5. Royalty Authority vs Rights Interest

Rights Interest is the authority layer for ownership, control, administration, collection, licensing, distribution, and entitlement scope.

Royalty Authority consumes Rights Interest to determine financial consequences.

Doctrine rules:

- Rights Interest should define who has economic authority.
- Royalty Authority should apply that authority to actual events, statements, periods, territories, and sources.
- Rights Interest may exist before any royalty event occurs.
- Royalty Authority should not create Rights Interest.
- Rights Interest changes over time must affect future royalty interpretation and may require reversals, holds, disputes, or adjustments.

Chronicle reference:

If Chronicle administers but does not own, the Rights Interest should state administration/collection authority. Royalty Authority may calculate an administration fee or collection flow without pretending Chronicle owns the underlying rights.

## 6. Royalty Authority vs Distribution

Distribution Relationship is delivery, availability, channel, territory, and reporting context.

Royalty Authority interprets money, usage, reports, statements, and entitlement.

Doctrine rules:

- Distributor reporting is input/evidence, not entitlement authority.
- Distributor payout is not proof of ownership.
- DSP/platform reports should be reconciled to Release, Master, Work, Rights Interest, Party, and period.
- Distribution status can explain source and availability context.
- Royalty Authority should not treat delivery/live status as entitlement.
- Digital distribution and royalty distribution/allocation are separate concepts.

Chronicle reference:

A distributor reports revenue for a Chronicle release. That report may trigger Royalty Events, but entitlement must still derive from verified Rights Interests and Party/payee rules.

## 7. Royalty Authority vs Registration

Registration is external-body/identifier authority and verification context.

Royalty Authority consumes registration context where it affects matching, claim validity, reporting, collection, and reconciliation.

Doctrine rules:

- Registrations do not create royalty entitlement by themselves.
- Identifiers help map statements to Works, Masters, Parties, Releases, and sources.
- ISWC, ISRC, IPI/CAE, UPC/EAN, society references, and distributor references are evidence/reference state, not ownership authority.
- Society payment is not proof of complete ownership authority.
- Registration gaps may create holds, warnings, unmatched items, or claim/reconciliation tasks.

Chronicle reference:

A society may pay royalties under a reference. Royalty Authority should treat that as reporting/payment evidence, then reconcile it against verified Work/Master/Rights/Party truth.

## 8. Royalty Authority vs Release

Release is the commercial package.

Royalty Authority consumes Release context to interpret revenue, usage, statement lines, track references, commercial packaging, and release-period context.

Doctrine rules:

- Release does not create royalty entitlement.
- Release metadata helps map royalty events.
- Release dates and track sequence can support reporting interpretation.
- Release should not override Rights Interest.
- Multiple Releases may involve the same Work or Master; royalty mapping must preserve the difference.

Chronicle reference:

A Chronicle song may appear on a single and later on an album. Royalty Authority must interpret each report against the right Release context without duplicating ownership truth.

## 9. Royalty Authority vs Party

Party is the legal/commercial identity layer.

Royalty Authority needs Party/payee identity to know who can receive, administer, collect, report, or be paid.

Doctrine rules:

- Payee identity should ultimately attach to Party or Party-linked payment authority.
- Artist Brand is not automatically the payee.
- Workspace User controls access, not royalty ownership.
- CRM Contact is operational/contact data, not always payee authority.
- Chronicle Music may be a Party/payee/administrator/operator only where records support it.
- One real person may control multiple Parties or Artist Brands without collapsing royalty entitlement.

Chronicle reference:

Huey D may be the public Artist Brand on a release. The payee may be a person, company, administrator, publisher, or other Party depending on Rights Interest and payment authority.

## 10. Royalty Authority vs Royalty Event

Royalty Event is a revenue, usage, statement, distribution-report, settlement-triggering, or adjustment event.

Royalty Authority is the doctrine for interpreting and allocating that event.

Doctrine rules:

- Royalty Events are evidence of activity, not ownership authority.
- Royalty Events should not create Rights Interests.
- Royalty Events should not create Works, Masters, Releases, Registrations, or Parties.
- Royalty Events should be mapped to upstream truth where possible.
- Unmatched Royalty Events should be held or reviewed, not forced into incorrect ownership assumptions.
- Royalty calculations should ultimately derive from verified Rights Interests and payee rules.

## 11. Royalty Concepts And Boundaries

### Royalty Event

A Royalty Event is a specific reported, received, accrued, adjusted, reversed, or settlement-triggering item.

Belongs to Royalty Authority:

- event type
- source
- period
- gross/net context
- currency
- statement/report reference
- Work/Master/Release mapping
- calculation trigger
- status
- evidence/audit context

Must not own:

- ownership truth
- Party identity truth
- release truth
- registration truth

### Royalty Source

Royalty Source is where reported activity or payment originates.

Examples:

- distributor
- DSP/platform report
- collection society
- publisher
- label
- licensing partner
- direct licensee
- sync client
- manual adjustment source

Belongs to Royalty Authority:

- source classification
- source Party/reference
- source reliability context
- reporting/payment channel

Must not prove ownership by itself.

### Royalty Statement

Royalty Statement is a report or statement document/data set describing activity, income, deductions, adjustments, payments, or balances.

Belongs to Royalty Authority:

- statement period
- source
- statement reference
- line-item mapping
- currency and amounts
- deductions/fees
- evidence link
- reconciliation status

Must not become canonical rights authority.

### Royalty Allocation

Royalty Allocation is the calculated division of royalty amounts among entitled Parties/payees.

Belongs to Royalty Authority:

- calculation basis
- applied rights interests
- applied royalty terms
- percentages/amounts
- deductions
- holds/disputes
- ledger posting context

Must ultimately derive from verified Rights Interest, contract/mandate, and payee authority.

### Royalty Entitlement

Royalty Entitlement is the right to receive or control royalty value for a scope, period, source, Work, Master, Release, territory, or usage.

Belongs to Royalty Authority as a downstream interpretation of:

- Rights Interest
- contract/mandate terms
- Party/payee authority
- effective dates
- territory/source scope
- registration/collection context

Must not be inferred only from contributor rows, artist visibility, or distributor payouts.

### Payee

Payee is the Party or approved payment recipient for royalty settlement.

Belongs to Royalty Authority:

- payment recipient context
- payment routing authority
- hold/dispute status
- settlement readiness
- tax/compliance/evidence prerequisites where applicable

Must not be collapsed into:

- Artist Brand
- contributor row
- workspace user
- free-text contact

### Collection Society

Collection Society is an external body that may collect, administer, report, or pay royalties.

Belongs to Royalty Authority:

- society source/reference
- statement/payment context
- registration/claim context
- collection category
- reconciliation state

Must not prove complete ownership by itself.

### Distributor Reporting

Distributor Reporting is reporting received from distributors or delivery partners.

Belongs to Royalty Authority:

- source report
- platform/channel context
- territory and period
- release/track references
- deductions/fees
- payout context

Must not create ownership, registration, or entitlement authority.

### Mechanical Royalties

Mechanical Royalties are composition-side royalties linked to reproduction/mechanical uses.

Belongs to Royalty Authority:

- composition-side Work mapping
- publisher/songwriter/administrator entitlement
- territory/source rules
- society or mechanical agency context
- effective Rights Interest

Must not be calculated from master ownership alone.

### Performance Royalties

Performance Royalties are composition-side royalties linked to public performance, broadcast, streaming performance components, or society-collected performance uses.

Belongs to Royalty Authority:

- Work mapping
- writer/publisher/admin authority
- society context
- territory/source rules
- statement/payment evidence

Must not be inferred from release artist visibility alone.

### Master Royalties

Master Royalties are sound recording-side royalties linked to the Master / Recording.

Belongs to Royalty Authority:

- Master mapping
- master ownership/control Rights Interest
- performer/producer/label/payment terms where supported
- distributor/DSP reporting context
- territory and period

Must not be calculated from composition splits alone.

### Publishing Royalties

Publishing Royalties are composition-side royalties linked to publishing ownership, administration, collection, and songwriter/publisher entitlement.

Belongs to Royalty Authority:

- Work mapping
- publishing Rights Interest
- administrator/publisher Party authority
- society and registration context
- effective dates/territories

Must not be inferred only from a composer name.

### Administration Fees

Administration Fees are deductions or shares retained by an administrator, publisher, rights manager, label services provider, or other authorized Party.

Belongs to Royalty Authority:

- fee basis
- supporting contract/mandate
- applicable source/category
- period and territory scope
- calculation treatment

Must not imply ownership unless Rights Interest separately says so.

### Territory Adjustments

Territory Adjustments are changes to calculation, entitlement, holds, exclusions, or reporting based on territory.

Belongs to Royalty Authority:

- territory source
- Rights Interest territory scope
- contract/mandate territory scope
- society/distributor territory reporting
- local rules/context
- exclusions

Must not override verified rights scope without review.

## 12. Royalty Authority Rules

Royalty Authority should ultimately be based on:

- verified Rights Interest
- Work truth
- Master / Recording truth
- Release context
- Registration/identifier context
- Distribution/reporting context
- Party/payee authority
- contract/mandate terms
- evidence sufficiency
- source, period, territory, and category classification
- audit history

Royalty Authority must not proceed merely because:

- a contributor exists
- a visible artist exists
- a split row totals 100 percent
- a distributor paid the workspace
- a DSP report names an artist
- an ISRC or UPC appears in a statement
- a registration reference exists
- a user manually enters a payout amount

Royalty Authority may hold, dispute, suspend, reverse, adjust, or defer allocation where the upstream truth is missing, conflicting, expired, or contested.

## 13. Relationship To Party

Royalty Authority consumes Party identity for:

- rights holder
- payee
- administrator
- publisher
- label
- distributor
- society
- service provider
- report issuer
- payer
- recipient

Party truth should define the legal/commercial identity. Royalty Authority should not create Party truth from statement names or platform strings without review.

## 14. Relationship To Rights Interest

Rights Interest should be the primary authority source for royalty entitlement.

Royalty Authority consumes:

- ownership percentage
- administration percentage
- collection mandate
- license scope
- master-side control
- publishing-side control
- territory/source scope
- effective dates
- exclusions
- revocations

Rights Interest changes may require:

- future allocation changes
- historical recalculation review
- holds
- disputes
- reversal entries
- restatements
- settlement review

## 15. Relationship To Work

Work is composition/song identity.

Royalty Authority consumes Work truth for:

- mechanical royalties
- performance royalties
- publishing royalties
- composition-side statement matching
- ISWC/reference matching
- songwriter/publisher/admin entitlement

Work must not own:

- master-side royalty entitlement
- distributor delivery status
- payment routing
- payout authority by itself

## 16. Relationship To Master / Recording

Master / Recording is sound recording identity.

Royalty Authority consumes Master truth for:

- master royalties
- neighboring-rights context where applicable
- ISRC/report matching
- master owner/control entitlement
- performer/producer/label payment terms where supported
- distributor/DSP statement mapping

Master must not own:

- composition-side publishing entitlement
- songwriter/publisher shares
- finance posting by itself

## 17. Relationship To Registration

Registration supplies identifier and external-body context.

Royalty Authority consumes:

- ISWC
- ISRC
- IPI/CAE
- UPC/EAN
- society references
- distributor references
- registration state
- claim status

Registration context can improve matching, claims, evidence, and reconciliation. It must not be treated as ownership or payment authority by itself.

## 18. Relationship To Release

Release supplies commercial package context.

Royalty Authority consumes:

- release title
- release type
- track list
- artist presentation
- release date
- UPC/EAN where governed
- release version/snapshot context
- release-to-master/work mapping

Release context supports matching and interpretation. It does not create entitlement.

## 19. Relationship To Distribution

Distribution supplies platform/channel/territory/reporting context.

Royalty Authority consumes:

- distributor source
- DSP/platform source
- territory
- delivery/availability context
- external report references
- takedown/removal context
- distributor statement references

Distribution reporting can trigger Royalty Events. It must not define rights or payee authority alone.

## 20. Relationship To Royalty Events

Royalty Events are the activity/evidence records Royalty Authority interprets.

Royalty Events may represent:

- income receipt
- usage report
- statement line
- distributor report
- society payment
- license fee
- adjustment
- reversal
- reserve release
- dispute resolution

Royalty Events should own event facts. Royalty Authority should own how those facts are interpreted against rights/payee authority.

## 21. Relationship To Finance

Finance is the general accounting and operational finance layer.

Royalty Authority is the royalty administration layer.

Doctrine rules:

- Royalties remain separate from Finance.
- Royalty calculations may later feed Finance only through approved posting.
- Finance should not calculate royalty entitlement.
- Finance may record money received, money owed, commitments, liabilities, settlements, and accounting effects.
- Royalty ledger/payout/settlement records should remain royalty-domain records until approved finance posting occurs.
- Finance commitments can represent royalty payable responsibilities, but they are not the royalty calculation source of truth.

## 22. Chronicle Reference Cases

### Chronicle Administers But Does Not Own

Chronicle may administer or collect for a Work or Master without owning it.

Doctrine conclusion:

- Rights Interest should identify administration/collection authority.
- Royalty Authority may calculate admin fees or collection flows.
- Chronicle should not receive owner entitlement unless the Rights Interest supports it.

### M-Wis Performs But Does Not Own

M-Wis may be a performer or Artist Brand on a Master.

Doctrine conclusion:

- Performance/visibility does not automatically create royalty entitlement.
- Entitlement depends on Rights Interest, contract, mandate, or payee authority.

### Publisher Owns A Share

A publisher may own or administer a percentage of composition-side rights.

Doctrine conclusion:

- Royalty Authority should interpret publishing/mechanical/performance income against publishing Rights Interest.
- Composer visibility alone is not enough for publisher allocation.

### Distributor Reports Revenue

A distributor may report streaming/download revenue.

Doctrine conclusion:

- The report may trigger Royalty Events.
- Entitlement must be calculated from verified Rights Interest/payee authority.
- Distributor payout is not proof of ownership.

### Society Pays Royalties

A society may issue payment or statement lines.

Doctrine conclusion:

- Society payment is evidence and source context.
- It must be reconciled to Work, Party, Rights Interest, registration, territory, and period.

### Rights Interests Change Over Time

Ownership, administration, collection mandates, or territory rights may change.

Doctrine conclusion:

- Royalty Authority must be effective-date aware.
- Future calculations may change.
- Historical events may require hold, dispute, reversal, or restatement review.

## 23. Conflicts Discovered

### Current Engine Calculates From Work Contributors

The current royalty engine fetches contributor splits from `work_contributors` and requires splits to total 100 percent.

Doctrine impact:

- This is useful as a transitional calculation path.
- It should not be treated as final royalty authority.
- Future royalty authority should derive from verified Rights Interests and payee rules.

### Royalty Distributions Map To Contributors

Current integrity rules require royalty distributions and payout items to map to contributors.

Doctrine impact:

- Contributor-linked payouts are transitional.
- Future payee authority should distinguish Contributor from Party/payee.

### Work-Level Royalty Events Are Too Narrow

Current backend log describes a royalty event as income against a musical work.

Doctrine impact:

- Future Royalty Events should support Work-side, Master-side, Release-side, distribution-report, statement, and settlement-triggering contexts.

### Digital Distribution And Royalty Distribution Terminology Collide

The platform uses "distribution" for both digital release delivery and royalty allocation.

Doctrine impact:

- Future design should distinguish Distribution Relationship from Royalty Allocation/Royalty Distribution.

### Finance And Royalty Boundaries Need Protection

Finance docs correctly state royalties remain separate and may later feed finance through approved posting.

Doctrine impact:

- Preserve this boundary.
- Do not let general finance become the royalty authority engine.

### Party Model Is Mixed Across Legacy And Doctrine

Some older backend docs mention `parties` and party roles, while current canonical doctrine uses Party as future legal/commercial layer with current `crm_contacts` as nearest active structure.

Doctrine impact:

- Do not assume existing legacy party references are already the canonical Party model.
- Resolve this in future gap analysis before refactor.

## 24. Transitional Concepts Identified

Current or transitional concepts:

- `royalty_events`
- `royalty_distributions`
- `royalty_ledger`
- `payout_batches`
- `payout_items`
- `settlements`
- `contributor_balances`
- `work_contributors` as calculation input
- contributor-mapped payout items
- split-total validation
- royalty event tied primarily to `work_id`
- royalty ledger credits/debits/adjustments
- payout batch generation from contributor balances
- finance commitments of type royalty payable
- Evidence Vault proof-before-payout / royalty eligibility direction
- contract `royalty_terms`
- distributor and society reports as future source inputs
- Chronicle ownership/split fields deferred from import

These should remain unchanged now.

## 25. What Must Not Change Yet

Do not change:

- royalty schema
- payout schema
- settlement schema
- finance schema
- contributor schema
- rights schema
- release/distribution schema
- royalty services
- payout services
- finance services
- UI
- API routes
- Chronicle import data
- existing test fixtures

Do not:

- create royalty migrations
- rename royalty tables
- introduce Rights Interest foreign keys yet
- convert contributor splits into final entitlement
- import Chronicle ownership splits as authority
- treat distributor or society statements as ownership proof
- merge royalty administration into Finance
- treat artist brand visibility as payee authority
- treat workspace ownership as copyright ownership

## 26. Future Refactor Principles

Future royalty refactors should:

- keep Royalty Authority downstream of Rights Interest
- distinguish contributor, Party, Artist Brand, and payee
- distinguish Work-side and Master-side royalties
- distinguish royalty source, statement, event, allocation, ledger, payout, settlement, and finance posting
- preserve auditability and reversibility
- support holds, disputes, reversals, and restatements
- support effective-date and territory-aware entitlement
- support distributor, DSP, society, publisher, label, licensing, and manual sources
- treat external references as reconciliation/evidence, not authority
- keep finance posting explicit and approved
- remain workspace-scoped
- avoid Chronicle-specific logic in platform structures

## 27. Recommended Next Artifact

Next architecture phase:

```text
Doctrine Consolidation -> Gap Analysis -> Controlled Refactor Roadmap
```

Recommended next artifact:

```text
docs/platform/SENTRY-SOUND-DOCTRINE-CONSOLIDATION-AND-GAP-ANALYSIS-V1.md
```

Purpose:

- consolidate the completed doctrine chain into one navigable authority map
- compare doctrine against current schema, services, routes, docs, and import state
- identify which current structures are aligned, transitional, duplicated, missing, or risky
- rank future refactor candidates by authority risk and operational dependency
- define controlled refactor phases without writing SQL, changing code, or moving data prematurely

