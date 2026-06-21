# Chronicle Integration Principle V1

Date: 2026-06-04

Status: architectural decision. No schema, API, import automation, runtime integration, or database mutation is created by this document.

## Purpose

This document defines the integration boundary between Chronicle Music and the Sentry Sound Platform.

Chronicle Music is a consumer of operational truth.

Sentry Sound remains the authoritative source for:

- songs
- artists
- contributors
- releases
- registrations
- identifiers
- rights administration
- future royalty administration

The Chronicle spreadsheet and related catalogue files are intake sources only. They may help gather, validate, and migrate catalogue information into Sentry Sound, but they must not become a permanent operational system, second database, or second source of truth.

## Current Intake Rule

The current Chronicle workbook is treated as:

```text
Chronicle Intake Source
  -> Validation
  -> Migration
  -> Sentry Sound Backend
```

The workbook is not:

- a permanent operational system
- an authoritative catalogue database
- a rights administration system
- a registration system
- a royalty administration system
- a synchronization owner

After migration, Sentry Sound backend records become authoritative. Future updates must flow through Sentry Sound contracts and approved integrations, not through spreadsheet ownership.

## Future Architecture Direction

External sources may provide discovery, verification, ingestion, enrichment, reporting, or reconciliation inputs.

Examples:

- Spotify
- YouTube
- Apple Music
- TikTok
- Meta
- registration bodies
- distribution partners

Target direction:

```text
External Sources
  -> Sentry Sound Platform
     (System of Record)
  -> Chronicle Music
```

Chronicle Music may consume approved Sentry Sound data for:

- website content
- catalogue pages
- marketing
- campaigns
- artist pages
- public content
- reports

Chronicle should consume data through:

- APIs
- exports
- feeds
- approved integrations

Chronicle should not consume or own operational truth through direct spreadsheet control.

## Source Of Truth Boundary

Sentry Sound owns private and operational records.

Chronicle owns public presentation, marketing context, and publishing-house-facing content once approved for use.

Chronicle must not directly own:

- private contributor identities
- contributor split truth
- registration status truth
- identifier authority
- rights ownership truth
- royalty administration truth
- private evidence
- contracts
- internal readiness state
- backend workflow state

Any future Chronicle feed must be public-safe, approved, and read-only from Chronicle's perspective unless a separate governed write-back integration is explicitly designed.

## Migration Boundary

For Chronicle catalogue migration, the workbook may be used to prepare review decisions such as:

- create candidate
- possible duplicate
- matches existing
- blocked missing required fields
- blocked split unclear
- metadata-only review

The migration process must not treat the following workbook fields as authoritative structured truth during the first intake phase:

- Ownership Split %
- ISRC
- ISWC
- Master Owner
- Publishing Owner

Those fields require governed identifier, recording, rights, registration, contributor, or evidence handling before becoming durable structured records.

## Approved First Step

The approved first step is a Chronicle Intake Review Report.

The report may inspect the workbook, compare it to existing Sentry Sound records, and recommend migration sequencing.

The report must not:

- import data
- create schema
- create migrations
- create staging tables
- create spreadsheet synchronization
- create import automation
- overwrite existing backend records

## Relationship To Hosted Public Music Pages

This principle extends the hosted public music pages direction already documented for Chronicle.

Chronicle remains a public presentation and marketing/catalogue consumer. Sentry Sound remains the operational backend and future system of record for approved music-business data.

