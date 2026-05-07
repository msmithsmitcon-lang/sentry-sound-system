# Rights Lifecycle Module

## Purpose
Rights Lifecycle is the legal/control layer for ownership, authority, territories, effective dates, and royalty entitlement logic.

## Core principle
Royalty splits must be supported by rights records, not exist as isolated percentages.

## Core entities
- rights_assets
- rights_parties
- rights_ownership_claims
- rights_territories
- rights_lifecycle_events
- rights_audit_events

## Design rules
- workspace-scoped
- CRM-linked where possible
- contributor-linked where royalty participation exists
- artist-linked where artist identity matters
- effective-date aware
- territory-aware
- audit-ready
- international-ready

## Lifecycle
Draft ? Claimed ? Verified ? Active ? Disputed ? Expired ? Archived

## Strategic flow
CRM ? Artists ? Contributors ? Rights Ownership ? Royalty Splits ? Ledger ? Payouts

## Next build unit
Create Rights Lifecycle database schema.

# Rights Lifecycle Schema Status

## Completed
- rights_assets
- rights_ownership_claims
- rights_lifecycle_events
- rights_audit_events

## Ownership model
Rights ownership claims now support:
- CRM-linked entities
- contributor-linked royalty participants
- territory-aware ownership
- effective date ranges
- verification status
- auditability

## Strategic architecture
Rights records now sit above royalty splits and below CRM/Artist identity layers.

## Future strategic extensions
- rights conflict resolution
- chain-of-title tracking
- publishing administration
- neighboring rights
- collecting society registration
- territory inheritance
- royalty waterfall logic

## Next build unit
Rights service layer.

## Validation layer

### validateRightsOwnershipTotals

Validates verified ownership totals for:
- asset
- territory
- ownership percentages

### Validation outputs
- verifiedOwnershipTotal
- isComplete
- isOverAllocated
- isUnderAllocated

## Strategic importance
This validation layer becomes the future control gate before:
- royalty calculations
- ledger postings
- payout generation
- settlements
- rights activation

## Next build unit
Rights territory inheritance + rights conflict handling.
