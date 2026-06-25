# Hosted Public Music Pages / Catalogue Showcase System

## 1. Purpose

This document captures the future Sentry Sound direction for hosted public music pages and catalogue showcase surfaces.

This is not an implementation plan for the current runtime. It records a validated future product direction: Sentry Sound can eventually become the operational backend and source of truth that feeds approved public-safe data into public-facing music pages, catalogue showcases, and publishing-house websites.

## 2. Chronicle Music Publishing Proof Of Concept

Chronicle Music Publishing is now live at:

- `chroniclemusic.co.za`

Confirmed deployment workflow:

```text
VS Code -> Codex -> GitHub -> Vercel -> 1-grid/Plesk DNS -> live site
```

This validates that a public-facing music publishing website can be designed, built, deployed, and pointed to a production domain through the current development and deployment workflow.

Chronicle is a proof-of-concept for public presentation and deployment flow. It is not Sentry Sound runtime, not a Sentry Sound tenant surface yet, and not a direct public view over Sentry Sound private operational data.

## 3. Chronicle Role

Chronicle Music Publishing is an independent public-facing music publishing house.

Its role is to represent and administer:

- works
- catalogues
- songwriters
- artists
- producers
- rights owners

Chronicle is not Sentry Sound.

Chronicle is not only for M-WIS.

M-WIS is one represented artist/catalogue example, not the only intended scope of Chronicle.

## 4. Future Sentry Sound Role

Sentry Sound should eventually become the operational backend/source of truth for approved music-business data.

In this future model, Sentry Sound owns:

- canonical workspace and account ownership
- private operational records
- catalogue/work metadata
- contributor and split records
- internal rights administration state
- protected evidence and contract records
- approval status for what may be shown publicly
- public/private visibility settings

Public websites such as Chronicle should only receive approved public-safe data from Sentry Sound. They should not become the operational system of record.

## 5. Chronicle As Public Presentation Layer

Chronicle should be treated as a public presentation layer only.

It can display approved public information such as:

- publishing-house identity
- represented catalogues
- selected artists, producers, songwriters, and rights owners
- public song/work descriptions
- licensing contact options
- catalogue showcase content
- approved artwork and media
- enquiry routing

Chronicle should not expose or manage private Sentry Sound operational workflows.

## 6. Public-Safe Feed Concept

Future Sentry Sound may expose a controlled public-safe feed for hosted pages and external public sites.

The feed should be:

- explicitly approved
- read-only for public consumers
- scoped by workspace, brand, catalogue, artist, or public page
- filtered to public-safe fields only
- governed by visibility settings
- protected from accidental leakage of private rights data

The public feed may eventually support static builds, incremental refreshes, or controlled public API reads, but no public API is approved by this document.

## 7. Private / Protected Data Boundary

Critical privacy rule:

Public websites must only read approved public-safe fields.

Private rights data, evidence packs, disputes, royalties, contracts, and admin workflows must remain protected inside Sentry Sound.

Public pages must not expose:

- private contributor agreements
- split disputes
- contract terms
- royalty statements
- payment details
- evidence packs
- legal correspondence
- internal admin notes
- readiness blockers
- submission workflows
- audit history
- protected ownership documentation
- private workspace operations

Public display must always be opt-in or approval-gated.

## 8. Future Supported Public Entities

The future Hosted Public Music Pages / Catalogue Showcase System may support:

- artists
- producers
- songwriters/composers
- catalogues
- works/songs
- cover artwork
- preview audio
- publishing owner
- licensing status
- metadata readiness
- public/private visibility
- public profile settings
- public enquiry routing

These entities should be powered by Sentry Sound backend truth when implemented, but only after a deliberate public-safe feed design exists.

## 9. Future Storage Needs

The future module will likely need governed storage for:

- logos
- cover images
- preview audio
- supporting media

Storage must distinguish public presentation assets from protected operational evidence.

Public assets may be suitable for public CDN delivery.

Protected files, evidence packs, contract documents, and rights-administration records must remain private and access-controlled.

## 10. Future Subscriber Capability

The future module may become a subscriber-facing capability for Sentry Sound users.

Potential capabilities:

- branded public pages
- artist profiles
- producer profiles
- songwriter/composer profiles
- catalogue pages
- work/song showcase pages
- licensing contact options
- public enquiry routing
- custom domains later

This should be treated as a product module that sits on top of approved public-safe data, not as a replacement for the private operational workspace.

## 11. Backend Areas Captured For Future Design

Future backend design areas include:

- public profile settings
- public/private field visibility
- public-safe catalogue read model
- public-safe work/song read model
- public-safe artist/producer/songwriter profile read model
- public media asset storage
- preview audio storage and access rules
- public enquiry routing
- publishing-owner display rules
- licensing-status display rules
- metadata-readiness display rules
- workspace/brand/page scoping
- custom domain mapping later

No schemas, APIs, routes, storage buckets, or runtime services are created by this document.

## 12. Non-Goals

This document does not approve:

- implementation now
- public API creation
- schema creation
- route creation
- storage bucket creation
- Chronicle/Sentry Sound brand merge
- direct Chronicle runtime integration
- exposing Sentry Sound operational rights backend
- exposing private rights, contracts, disputes, evidence, royalties, or admin workflows
- making Chronicle the Sentry Sound source of truth

## 13. Current Status

Status: future module direction captured.

Chronicle Music Publishing validates the public-page deployment pathway and public presentation concept.

Sentry Sound remains the future operational backend/source-of-truth candidate for approved public-safe feeds.

No runtime implementation has been performed.
