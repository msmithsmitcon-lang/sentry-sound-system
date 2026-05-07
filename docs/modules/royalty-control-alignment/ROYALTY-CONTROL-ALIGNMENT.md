# Royalty Control Alignment Module

## Purpose
Royalty Control Alignment bridges the existing Royalty Engine with the newer Rights, Contracts, Releases, and Distribution systems.

## Core principle
The existing royalty engine remains the calculation/ledger engine.

Rights, Contracts, Releases, and Distribution become control and validation layers before royalty processing occurs.

## Strategic architecture

Rights
  ?
Contracts
  ?
Releases
  ?
Distribution
  ?
Royalty Control Alignment
  ?
Existing Royalty Engine
  ?
Ledger / Payouts / Settlements

## Responsibilities
- Rights validation
- Contract authority validation
- Release lifecycle validation
- Distribution status validation
- Territory validation
- Ownership allocation validation
- Royalty processing authorization

## Important rule
This module must NOT duplicate:
- royalty calculations
- ledger posting logic
- payout logic
- settlement logic

Those already exist in the Royalty Engine.

## Next build unit
Create royalty control validation services.

## Service layer

### validateRoyaltyProcessingPreflight

Checks upstream control context before the existing Royalty Engine processes a royalty event.

## Current checks
- workspaceId required
- optional rights ownership validation
- release link presence
- distribution release link presence
- territory context

## Processing rule
Royalty processing may continue when:
- no rights asset is supplied, or
- rights ownership totals are complete at 100%

## Important
This does not replace the Royalty Engine.
It controls whether the existing engine should be allowed to run.

## Next build unit
Connect preflight validation to royalty event processing route.
