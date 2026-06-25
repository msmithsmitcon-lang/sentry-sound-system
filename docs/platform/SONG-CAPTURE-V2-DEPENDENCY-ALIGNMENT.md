# Song Capture V2 Dependency Alignment

Date: 2026-05-28

Mode: Dependency alignment only. No code, UI, schema, API, route, or runtime behavior changes.

## Purpose

This document aligns the visible Song Details fields from the annotated Song Capture V2 screenshot with existing Sentry Sound backend/domain structures before implementation.

The goal is to avoid turning the prototype into accidental backend architecture. Song Capture V2 should reuse existing structures where they are already safe, keep uncertain dependencies optional, and defer entity linking until the owning models are proven in the live workflow.

## Existing Structures Found

Active current song/work structures:

- Current Add Song flow at `/dashboard/works/new`.
- Current song creation API path: `POST /api/songs/create`.
- Current create-song contract: `src/lib/registration/contracts/create-song-contract.ts`.
- Current create-song service: `src/lib/registration/services/create-song-with-contributors.ts`.
- Current creation RPC: `rpc_create_song_with_contributors`.
- Active lowercase app tables: `musical_works`, `assets`, `contributors`, `work_contributors`.
- Current Work/Song Detail profile update path: `PATCH /api/works/[workId]/profile`.
- Work profile metadata: `musical_works.metadata -> work_intelligence_v1`.
- Work profile update types: `src/lib/works/work-profile-update.types.ts`.
- Work Intelligence V1 creative truth metadata: `alternative_title`, `language`, `energy`, `clean_explicit`, `creative_description`, `inspiration_reference_notes`.

Related but not yet safely wired into Song Capture V2:

- CRM contacts: `crm_contacts`, `crm_contact_emails`, `crm_contact_phones`, `crm_contact_relationships`, `crm_contact_notes`.
- Artist profiles: `artist_profiles`, `artist_aliases`, `artist_genres`, `artist_social_links`.
- Projects: `projects` and `app/api/projects`.
- Releases: `releases`, `release_tracks`, `release_versions`, `release_metadata_snapshots`, `release_audit_events`.
- Distribution releases: `distribution_releases` and related channel/status tables.

Important distinction:

- The Prisma `MusicalWork` model exists for registration-domain structures and has fields such as `title`, `alternateTitle`, `language`, and `status`.
- The active Works/Songs app flow currently uses lowercase Supabase/Postgres tables such as `musical_works` with fields such as `work_title`, `genre`, `mood`, `copyright_status`, and `registration_status`.
- Song Capture V2 should align with the active lowercase app flow unless a later schema consolidation is explicitly scoped.

## Field-By-Field Ownership Map

| Visible field | Recommended owner | Current support | Safe V1 handling | Future requirement |
| --- | --- | --- | --- | --- |
| Song title | `musical_works.work_title` and linked `assets.title` | Supported by current Create Song flow and required by `create-song-contract` | Required field in first implementation slice | Keep as canonical display title; later reconcile with registration-domain `MusicalWork.title` if schemas consolidate |
| Alternate title | `musical_works.metadata -> work_intelligence_v1.creative_truth.alternative_title` | Supported by Work Profile update, not current initial Create Song save | Optional profile metadata after work exists | Decide whether initial Create Song V2 can write profile metadata during or immediately after creation |
| Version | Not clearly owned today | Mock only in Song Capture V2 | Optional text/display-only in first slice, or defer | Likely needs a version model/field tied to recording/final audio, not composition title |
| Genre | `musical_works.genre` | Supported by current Create Song flow | Optional but visible; can save in first slice | Later normalize genre lists and connect artist/project defaults |
| BPM | No proven active owner in current create/profile contracts | Mock only | Optional and defer persistence, or store later in profile metadata only after contract review | Future music metadata/profile field; important for radio, YouTube, sync, playlisting, and MP3 extraction |
| Key | No proven active owner in current create/profile contracts | Mock only | Optional and defer persistence, or store later in profile metadata only after contract review | Future music metadata/profile field; useful for sync, playlists, performance, and production context |
| Description / notes | `work_intelligence_v1.creative_truth.creative_description` or notes-style creative metadata | Supported as Creative Details on Work Detail, not current initial Create Song save | Optional profile metadata after work exists | Decide if V2 initial workflow should save this through profile update after creation |
| Primary Artist | Artist profile / CRM contact relationship later; contributor fallback today | Partially supported as contributor data, CRM contacts, and artist_profiles exist separately; not safely linked in current song creation workflow | Safest temporary handling is display text or contributor row with role `artist`; do not require artist profile link | Need explicit work-to-artist/primary artist relationship contract |
| Language | `work_intelligence_v1.creative_truth.language`; registration-domain models also know language | Supported by Work Profile update and SAMRO export concepts; not current initial Create Song save | Optional profile metadata after work exists | Consider moving into initial V2 profile save because it matters for SAMRO/radio/YouTube metadata |
| Project / Collection | `projects` or `releases` later, depending meaning | Projects and releases exist, but active linkage to works is not proven in current Works UX | Safest temporary handling is optional free-text/profile metadata or no persistence | Need explicit work-to-project and/or release-track relationship contract |
| Song Status | Existing `copyright_status` / `registration_status` defaults and future workflow lifecycle state | Current Create Song defaults both to `draft`; Work Completeness has review context | Keep default `draft`; do not build new status engine | Later define one visible workflow status separate from legal/registration/release status |

## Which Fields Already Map To Existing Structures

Strong existing mapping:

- Song title -> `musical_works.work_title`, `assets.title`.
- Genre -> `musical_works.genre`.
- Song Status -> existing draft defaults through `copyright_status` and `registration_status`, though these are not a perfect user-facing workflow status.

Existing metadata/profile mapping:

- Alternate title -> `work_intelligence_v1.creative_truth.alternative_title`.
- Language -> `work_intelligence_v1.creative_truth.language`.
- Description / notes -> `work_intelligence_v1.creative_truth.creative_description`.

Partial or uncertain mapping:

- Primary Artist -> contributors are supported; CRM/artist profile structures exist; direct primary artist relationship is not proven.
- Project / Collection -> projects and releases exist; direct song linkage is not proven.

Missing mapping:

- Version.
- BPM.
- Key.

## Which Fields Are Already Supported In Current Create Song Flow

Current `POST /api/songs/create` supports:

- `work_title`
- `genre`
- `mood`
- `copyright_status`
- `registration_status`
- contributors array with `name`, `role`, `split_type`, `percentage`, optional `contributor_id`

Current create flow does not support:

- alternate title
- version
- BPM
- key
- description/notes
- primary artist profile link
- language
- project/collection link
- dedicated visible workflow status

Some unsupported fields can already be saved later through the Work Detail profile update route, but not inside the current initial Create Song mutation.

## Primary Artist Dependency

Question: Does Primary Artist currently have a real entity/profile/contact/CRM structure to link to?

Answer:

- CRM contact structures exist.
- Artist profile structures exist and link to CRM contacts.
- Current create-song flow supports contributors and contributor IDs.
- A dedicated work-to-primary-artist relationship is not proven in the current Works/Songs UX or create-song contract.

Safest temporary handling:

- Do not require a real Artist Profile link in the first Song Capture V2 implementation.
- Treat Primary Artist as one of:
  - display text only in the prototype;
  - a contributor row with role/type `artist` where supported;
  - a later optional selector after artist profile linkage is explicitly designed.

Do not automatically create CRM contacts or artist profiles from this field in V1.

Future backend requirement:

- Define a work-to-artist relationship contract.
- Decide whether primary artist is:
  - a contributor role;
  - an artist profile relation;
  - a CRM-backed profile relation;
  - or a release-level relationship.

## Project / Collection Dependency

Question: Does Project / Collection currently have a real project/release/catalogue structure to link to?

Answer:

- `projects` exists and has a basic API.
- `releases` and `release_tracks` exist.
- Distribution release structures exist.
- However, active linkage from a work/song to a project/collection/release is not proven in the current Works/Songs capture flow.

Safest temporary handling:

- Keep Project / Collection optional.
- Treat it as display-only or free-text metadata until a relation is explicitly scoped.
- Do not force project/release creation from Song Capture V2.
- Do not make release/project selection required for saving a song draft.

Future backend requirement:

- Decide whether Project / Collection means:
  - creative project/session folder;
  - album/EP/single release;
  - catalogue collection;
  - campaign;
  - or public showcase collection.
- Add explicit work-to-project and/or work-to-release-track linkage only after that meaning is stable.

## Fields That Should Remain Optional In V1

Keep optional:

- alternate title
- version
- genre
- BPM
- key
- description/notes
- primary artist link
- language
- project/collection
- user-visible song status override

Only Song title should remain clearly required for first song draft creation.

Contributor requirements should follow the existing create-song contract until the V2 workflow contract is separately scoped. Current contract allows empty contributors except split validation applies when contributors are present.

## Strategic Metadata Importance

Important for SAMRO / registration:

- Song title
- alternate title
- language
- contributors/splits
- status/readiness context

Important for radio:

- Song title
- primary artist
- genre
- BPM
- key
- description/notes
- language
- final audio/metadata later

Important for YouTube:

- Song title
- primary artist
- description/notes
- genre
- language
- artwork/final audio later

Important for release metadata:

- Song title
- primary artist
- version
- genre
- BPM
- key
- language
- project/collection/release relationship
- final audio and artwork later

These fields are strategically important, but strategic importance does not mean every field needs schema work in the first implementation slice.

## Missing Dependencies

Missing or not yet safely proven:

- dedicated primary artist relationship from work/song to artist profile
- work-to-project relationship
- work-to-release/release-track relationship
- version ownership model
- BPM field in active create/profile contracts
- key field in active create/profile contracts
- initial-create support for alternate title, language, and description
- clear single user-facing song workflow status separate from registration/release/legal status
- migration path between active lowercase `musical_works` and Prisma `MusicalWork` registration-domain model

## Safe Temporary Handling

For Song Capture V2 first implementation planning:

- Save only fields already supported by current create flow in the initial mutation.
- Treat alternate title, language, and description as profile metadata that can be saved after work creation through existing profile update logic.
- Keep version, BPM, and key visual/optional until a metadata contract is scoped.
- Treat Primary Artist as contributor/display text, not as a required artist-profile relation.
- Treat Project / Collection as optional display/free text or defer.
- Keep Song Status defaulted to `draft`.

## Future Backend Requirements

Future implementation may require:

- profile metadata expansion for BPM/key/version if JSON metadata remains the preferred first step
- schema expansion if BPM/key/version need querying, filtering, exports, or readiness rules
- artist profile linkage contract
- work-to-project / work-to-release relationship contract
- final audio and recording/master relationship
- release-track relationship for Project / Collection when it means a release
- workflow status model if the UI timeline becomes real state
- readiness/review rules that distinguish profile completion from legal/registration readiness

## What Should NOT Be Implemented Yet

Do not implement yet:

- automatic CRM contact creation from Primary Artist
- automatic artist profile creation from Primary Artist
- required project/release linkage
- schema migration for all prototype fields at once
- workflow status engine
- release/registration automation
- MP3 metadata extraction
- storage/upload engine
- evidence/review logic
- public-safe approval logic
- broad schema consolidation between registration-domain Prisma models and active lowercase app tables

## Recommended First Implementation Slice

Recommended first slice after UX review:

Implement Song Capture V2 Step 1 using existing supported fields only:

- Song title -> current create-song contract
- Genre -> current create-song contract
- Song Status -> default `draft`

Then, after the work exists, optionally reuse the existing profile update path for:

- alternate title
- language
- description/notes

Keep these deferred or display-only in the first runtime slice:

- version
- BPM
- key
- Primary Artist entity link
- Project / Collection entity link

This gives V2 a real backend path without forcing premature schemas or entity relationships.
