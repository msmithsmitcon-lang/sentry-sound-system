# Song Capture V2 First Runtime Slice Plan

Date: 2026-05-28

Mode: Runtime slice planning only. No implementation performed.

## 1. Purpose

Define the first safe runtime implementation slice for Song Capture V2 without creating schemas, routes, APIs, backend contracts, or unfinished entity dependencies.

The first slice should make Song Capture V2 save a real song draft using existing backend paths while keeping uncertain fields visual, optional, or deferred.

## 2. Safe Fields To Wire Now

Wire these fields only:

- Song title -> existing create-song contract.
- Genre -> existing create-song contract.
- Draft status -> existing create-song defaults.
- Alternate title -> existing profile metadata after work creation.
- Language -> existing profile metadata after work creation.
- Description / notes -> existing profile metadata after work creation.

Only Song title should be required for the first V2 runtime slice.

## 3. Deferred Fields And Why

Defer:

- Primary Artist linking: CRM/artist profile structures exist, but a safe work-to-primary-artist contract is not proven.
- Project / Collection linking: projects/releases exist, but the meaning and work linkage are not stable yet.
- Version: ownership is unclear and likely belongs closer to recording/final audio/versioning.
- BPM: useful later, but not in the active create/profile contract.
- Key: useful later, but not in the active create/profile contract.

These can remain visible as prototype fields or disabled/display-only values until their contracts are scoped.

## 4. Existing Routes / Contracts To Use

Use existing paths only:

- `POST /api/songs/create`
- `src/lib/registration/contracts/create-song-contract.ts`
- `src/lib/registration/services/create-song-with-contributors.ts`
- `rpc_create_song_with_contributors`
- `PATCH /api/works/[workId]/profile`
- `src/lib/works/work-profile-update.types.ts`
- `musical_works.metadata -> work_intelligence_v1`

Do not create new routes or backend contracts for this slice.

## 5. Expected Frontend Behavior

Song Capture V2 should:

- keep the current prototype layout
- allow editing safe fields
- keep deferred fields visibly optional or inactive
- keep Save Draft / Next product-first
- show clear save progress and error states
- avoid exposing backend terms
- avoid forcing contributors/files/assets in the first slice

The page may continue to show Contributors and Files & Assets visually, but they should not be part of the first save contract.

## 6. Expected Save Flow

On Save Draft:

1. Validate Song title is present.
2. Call `POST /api/songs/create` with:
   - `work_title`
   - `genre`
   - default/empty `mood`
   - existing default statuses
   - empty contributors array unless the existing contract requires otherwise.
3. Receive `workId`.
4. If alternate title, language, or description/notes have values, call `PATCH /api/works/[workId]/profile`.
5. Keep the user in a saved state or navigate to:
   - Song Capture V2 with saved state later, or
   - existing Song Details page for the created work.

Recommended first behavior:

- After save, navigate to the existing Song Details page for the created work because it already has a real saved-state surface.

## 7. User-Facing Wording

Use:

- Save Draft
- Create song draft
- Song saved
- Continue to Song Details
- Add more details later
- Some fields are coming later

Avoid:

- backend contract
- metadata mutation
- File Vault
- CRM linkage
- project relation
- governance state

## 8. What Must Remain Mock / Deferred

Remain mock/deferred:

- Primary Artist selector
- Project / Collection selector
- Version persistence
- BPM persistence
- Key persistence
- Contributors save from Song Capture V2
- Files & Assets save/upload
- storage engine
- MP3 parsing
- workflow preview state engine
- review/approval lifecycle
- registration/release automation

## 9. Validation Steps

Validation for the first implementation slice:

1. Open `/dashboard/works/song-capture-v2`.
2. Enter Song title and genre.
3. Optionally enter alternate title, language, and description/notes.
4. Click Save Draft.
5. Confirm a work is created through the existing create-song flow.
6. Confirm profile metadata is saved if provided.
7. Confirm the user lands on the saved work's existing Song Details page.
8. Confirm no contributors/files/assets/storage/CRM/project/release behavior is triggered.
9. Run targeted lint on changed frontend files.

## 10. Risks

Risks:

- Accidentally wiring prototype-only fields too early.
- Creating fake Primary Artist or Project relationships.
- Making Song Capture V2 appear more complete than it is.
- Failing because the current create-song contract expects contributor behavior.
- Saving profile metadata before the work ID exists.
- Overwriting existing Song Details behavior.

Mitigation:

- Keep the slice to Song Details only.
- Use existing routes only.
- Navigate to existing Song Details after save.
- Leave deferred fields clearly non-authoritative.

## 11. Exact Next Implementation Prompt

Implement the first Song Capture V2 runtime slice only: update `app/dashboard/works/song-capture-v2/page.tsx` so Save Draft creates a real song through existing `POST /api/songs/create` using Song title, Genre, default draft statuses, and no new backend route; after receiving the created work ID, save optional Alternate title, Language, and Description / notes through existing `PATCH /api/works/[workId]/profile`; then navigate to the existing Song Details page for the created work. Do not wire Primary Artist, Project / Collection, Version, BPM, Key, Contributors, Files & Assets, storage/upload, MP3 parsing, workflow preview state, evidence, release, registration, CRM, project, or Plexicon behavior.
