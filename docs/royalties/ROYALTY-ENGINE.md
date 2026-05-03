# Royalty Engine — Sentry Sound

## Overview

The royalty engine processes a royalty event into:

royalty_events ? royalty_distributions ? royalty_ledger

## Core Components

### 1. Calculation Layer
File:
src/lib/royalties/calculateRoyaltyDistribution.ts

Responsible for:
- Validating split totals (must = 100%)
- Applying platform fee
- Calculating net distributable amount
- Allocating contributor shares

### 2. Service Layer
File:
src/lib/royalties/processRoyaltyEvent.ts

Wrapper for calculation logic.

### 3. DB Processing Layer
File:
src/lib/royalties/processRoyaltyEventToLedger.ts

Responsible for:
- Fetching contributor splits from work_contributors
- Running royalty calculation engine
- Inserting:
  - royalty_distributions
  - royalty_ledger entries

## Flow

1. Receive royalty_event
2. Fetch contributor splits
3. Validate splits = 100%
4. Calculate:
   - gross
   - platform fee
   - net amount
5. Generate distribution per contributor
6. Insert into royalty_distributions
7. Insert into royalty_ledger

## Integrity Rules

- Splits must equal 100%
- No processing without contributor splits
- All distributions must map to contributors
- Ledger entries must mirror distributions

## Next Enhancements

- Idempotency (prevent duplicate processing)
- Reversal entries
- Audit logging integration
- Batch processing
- Multi-currency support
- Royalty rules engine (advanced splits)

## Test Coverage

scripts/tests/royalty-engine-check.ps1

Validates:
- Calculation logic exists
- Service layer exists
- Ledger processing exists

Status: ACTIVE
