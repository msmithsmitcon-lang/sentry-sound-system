# Distribution Pipeline Module

## Purpose
The Distribution Pipeline is the operational delivery layer for releases, DSP submissions, territories, delivery status, takedowns, royalty ingestion, and reporting.

## Core principle
Distribution must not duplicate Rights, Contracts, Artist, or CRM data. It links to approved operational records.

## Core entities
- distribution_channels
- distribution_releases
- distribution_release_channels
- distribution_deliveries
- distribution_delivery_events
- distribution_audit_events

## Design rules
- workspace-scoped
- release-linked where possible
- rights-aware
- contract-aware
- territory-aware
- DSP/platform-aware
- lifecycle controlled
- audit-ready
- international-ready

## Lifecycle
Draft ? Scheduled ? Submitted ? Delivered ? Live ? Takedown Requested ? Removed ? Failed ? Archived

## Strategic flow
CRM ? Artists ? Rights ? Contracts ? Releases ? Distribution Pipeline ? DSP Reporting ? Royalty Ledger ? Payouts

## Next build unit
Create Distribution Pipeline database schema.

# Distribution Pipeline Schema Status

## Completed
- distribution_channels
- distribution_releases
- distribution_release_channels
- distribution_delivery_events
- distribution_audit_events

## Release alignment
- Uses source_release_id as a safe placeholder link to the future/full release system.
- Avoids premature foreign key assumptions.

## Strategic architecture
Distribution now supports:
- DSP/platform channels
- scheduled release delivery
- territory-specific channel delivery
- external platform references
- delivery events
- audit events

## Next build unit
Distribution service layer.

## Service layer

### Services added
- createDistributionChannel
- createDistributionRelease
- addDistributionReleaseChannel
- updateDistributionDeliveryStatus
- updateDistributionReleaseLifecycle

## Backend rules
- Distribution is workspace-scoped.
- Channels represent DSP/platform destinations.
- Releases can be scheduled before delivery.
- Release-channel records track territory/platform delivery state.
- Delivery events capture operational history.
- Lifecycle changes are audited.

## Next build unit
Release Management backend.
