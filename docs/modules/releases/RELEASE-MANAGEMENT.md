# Release Management Module

## Purpose
Release Management is the operational release layer for singles, EPs, albums, versions, track sequencing, metadata packaging, and commercial release coordination.

## Core principle
Releases must link to existing Rights, Artists, Contributors, Contracts, and Distribution systems without duplicating authority or ownership data.

## Core entities
- releases
- release_tracks
- release_versions
- release_metadata_snapshots
- release_audit_events

## Design rules
- workspace-scoped
- rights-aware
- distribution-aware
- artist-aware
- contract-aware
- lifecycle controlled
- metadata-version aware
- audit-ready
- international-ready

## Lifecycle
Draft ? Metadata Review ? Ready ? Scheduled ? Released ? Takedown Requested ? Archived

## Strategic flow
CRM ? Artists ? Rights ? Contracts ? Releases ? Distribution ? DSP Reporting ? Royalty Ledger ? Payouts

## Next build unit
Create Release Management database schema.

# Release Management Schema Status

## Completed
- releases
- release_tracks
- release_versions
- release_metadata_snapshots
- release_audit_events

## DSP alignment
Release records now support:
- UPC
- external_release_reference
- distributor_reference

## Strategic architecture
Releases now support:
- artist-linked commercial releases
- track sequencing
- versioning
- metadata snapshots
- future DSP ingestion/reconciliation
- auditability

## Next build unit
Release service layer.
