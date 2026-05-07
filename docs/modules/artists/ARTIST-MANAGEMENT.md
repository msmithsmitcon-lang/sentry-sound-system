# Artist Management Module

## Purpose
Artist Management extends CRM contacts into music-industry artist profiles.

## Core principle
Artists must not duplicate CRM identity data.

Each artist profile links to:
- one crm_contact
- one workspace
- optional stage/performing name
- lifecycle and onboarding status
- management/compliance metadata

## Core entities
- artist_profiles
- artist_aliases
- artist_genres
- artist_social_links
- artist_audit_events

## Design rules
- workspace-scoped
- CRM-linked
- backend first
- audit-ready
- international-ready
- reusable across releases, rights, contracts, distribution, marketing, and finance

## Lifecycle
Draft ? Onboarding ? Active ? Inactive ? Archived

## Next build unit
Create Artist Management database schema.
