
---

## Royalty Engine Core

### Tables

- royalty_events
- royalty_distributions

### Logic

- A royalty event records income against a musical work.
- Distribution records are calculated from work_contributors.
- Amount = gross_amount × contributor percentage.
- Distribution status values:
  - calculated
  - approved
  - paid
  - held
  - disputed

### Test

- scripts/test-royalty-engine.mjs
- Passed: royalty event of 1000 ZAR created calculated distribution of 1000 ZAR for 100% split.


---

## Royalty Ledger

### Table

- royalty_ledger

### Logic

- Each calculated royalty distribution automatically posts a credit ledger entry.
- Ledger entries support:
  - credit
  - debit
  - adjustment

### Financial Flow

royalty_events
? royalty_distributions
? royalty_ledger

### Test

- scripts/test-ledger.mjs
- Passed: calculated royalty distribution posted credit to ledger.


---

## Payout Engine

### Tables

- payout_batches
- payout_items

### Logic

- `generate_payout_batch()` creates a draft payout batch.
- It groups positive contributor ledger balances.
- It creates payout_items per contributor and currency.
- Payout item statuses:
  - pending
  - approved
  - paid
  - held
  - cancelled

### Test

- scripts/test-payouts.mjs
- Passed: ledger balance generated payout item of 1000 ZAR.


---

## Settlement Engine

### Table

- settlements

### Logic

- Settlements represent actual payments (or pending payments).
- Created from payout batches using:
  - create_settlements_from_payout_batch()

### Status

- pending
- processing
- paid
- failed
- reversed

### Flow

payout_items ? settlements

### Test

- scripts/test-settlements.mjs
- Passed: payout batch generated settlement of 1000 ZAR.


---

## Party + Workflow Foundation

### Tables

- parties
- party_roles
- projects
- workflow_tasks

### Logic

- One party can represent a person, company, label, publisher, producer entity, or artist brand.
- One party can hold multiple roles:
  - producer
  - label
  - master_owner
  - payee
  - artist
  - publisher
  - rights_admin
- Projects act as workflow containers.
- Workflow tasks support producer/label operational flow.

### Test

- scripts/test-workflow.mjs
- Passed: producer-label entity created with multiple roles and project workflow tasks.


---

## Project Membership

### Table

- project_members

### Logic

- Links parties to projects.
- Supports roles:
  - owner
  - artist
  - producer
  - label
  - manager
  - rights_admin
  - finance
- Prevents duplicate party-role entries per project.

### Test

- scripts/test-project-members.mjs
- Passed: duplicate owner role blocked.


---

## Contributor Balances Intelligence View

### View

- contributor_balances

### Logic

Calculates per contributor:

- total_earned
- total_paid
- outstanding_balance

### Purpose

Powers dashboard metrics, payout decisions, royalty reporting, and contributor statements.

### Test

- scripts/test-balances.mjs
- Passed: Markus shows 1000 earned, 0 paid, 1000 outstanding.


---

## Dashboard Intelligence Layer

### Views

- dashboard_metrics
- recent_songs
- recent_activity

### Logic

Powers SaaS dashboard metrics:

- total songs
- active projects
- total royalties
- total outstanding balances
- recent songs
- recent audit activity

### Test

- scripts/test-dashboard.mjs
- Passed: dashboard metrics, recent songs, and recent activity returned successfully.

