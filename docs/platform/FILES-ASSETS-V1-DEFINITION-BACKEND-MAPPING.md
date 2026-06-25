# Files & Assets V1 Definition + Backend Mapping

## 1. Executive Summary

Files & Assets V1 is the Song Capture V2 workflow stage where a song collects meaningful operational material.

It is not a generic file manager, enterprise DAM, or full upload/storage engine. Its purpose is to help a user add useful song material in a natural workflow while Sentry Sound quietly captures structured meaning for later readiness, public/private posture, evidence posture, and release preparation.

Core question for every card:

> What useful thing does this add to the song?

V1 should refine the existing Supporting Materials / Work Files / File Vault direction rather than creating a parallel subsystem.

## 2. Files & Assets V1 Purpose

Files & Assets V1 gives each song a simple, product-first way to collect:

- lyrics
- demo audio references
- artwork candidates
- song metadata readiness data
- agreements
- evidence candidates
- references
- session files
- other clearly described supporting material

The user should experience this as part of creating or completing a song, not as backend asset governance.

## 3. V1 Boundary

V1 includes:

- workflow cards
- song-attached supporting material records
- metadata-first capture
- optional external link/reference
- optional text notes
- purpose/category
- reference vs evidence-candidate distinction
- private/public-safe candidate posture
- usage context

V1 does not include:

- full upload/storage engine
- large binary strategy
- audio preview streaming
- artwork transformation/cropping
- public feed to Chronicle
- evidence approval workflow
- `RegistrationEvidence` promotion
- AI metadata extraction
- MP3 tag parsing
- DSP/distribution automation
- royalty-linked agreement intelligence
- DAW/session version governance
- immutable archive/cold storage

## 4. Existing Backend Structures To Reuse

Files & Assets V1 should align with:

- `musical_works`
- Supporting Materials / Work Files
- `file_vault_items`
- `file_vault_links`
- `file_vault_versions`
- `file_vault_audit_events`
- Work Completeness / readiness logic
- Hosted Public Music Pages public-safe boundary
- Evidence Vault / `RegistrationEvidence` as a future governed layer

The Song Capture V2 page should remain a workflow surface. Supporting Materials / File Vault remains the structured backend/admin/reference layer.

## 5. Card-by-Card Definition

### Lyrics

User-facing meaning:
Lyrics for the song, captured in a structured way.

What the user captures:
Lyric text, lyric notes, language, clean/explicit posture, themes, mood, and optional source/reference.

Backend mapping:
Song-attached supporting material or profile-adjacent text data linked to `musical_works`.

Supporting Materials / File Vault mapping:
Can map to a Supporting Material record with `purpose = lyrics`. V1 should favor structured text capture before upload.

Metadata / intelligence keys:
- `purpose`: `lyrics`
- `referenceType`: `operational_document`
- `visibility`: `workspace`
- `publicSafeStatus`: `candidate` only if user marks it as possible public profile text
- `usageContext`: `song_profile`, `publishing`, `public_showcase_candidate`
- `sourceReference`: optional
- `lineageSourceType`: `legacy_reference`, `external_link`, or `unknown`
- `reviewStatus`: `not_reviewed`
- `evidenceCandidate`: `false`

Default visibility:
Workspace/private.

Public-safe posture:
Candidate only after review. Lyrics may later support public profile text.

Evidence posture:
Not evidence by default.

Future readiness value:
Marketing intelligence, clean/explicit review, themes, mood, language, SAMRO/YouTube/radio/distribution metadata support.

Deferred:
AI lyric analysis, automatic explicit detection, public publishing, registration automation.

### Demo Audio

User-facing meaning:
A small audio preview or review file for the song.

What the user captures:
MP3 reference, demo title/version, notes, source, and whether it may later be used publicly.

Backend mapping:
Song-attached supporting material linked to `musical_works`.

Supporting Materials / File Vault mapping:
Maps to `file_vault_items` / `file_vault_links` once storage exists. V1 may capture metadata/reference first.

Metadata / intelligence keys:
- `purpose`: `demo` or `audio_reference`
- `referenceType`: `public_media` or `reference`
- `visibility`: `public_safe_candidate` or `workspace`
- `publicSafeStatus`: `candidate`
- `usageContext`: `song_profile`, `public_showcase_candidate`, `release_preparation`
- `sourceReference`: optional file/link reference
- `lineageSourceType`: `uploaded_file` or `external_link`
- `reviewStatus`: `not_reviewed`
- `evidenceCandidate`: `false`

Default visibility:
Private/workspace until reviewed.

Public-safe posture:
Public-safe candidate only, not public-approved.

Evidence posture:
Not evidence by default.

Future readiness value:
Profile preview, review listening, Chronicle/public catalogue streaming candidate.

Deferred:
Audio upload engine, preview streaming, transcoding, waveform, master storage.

### Artwork

User-facing meaning:
Cover, profile, or release artwork candidate for the song.

What the user captures:
Artwork file/reference, title, source/creator, notes, and intended use.

Backend mapping:
Song-attached supporting material linked to `musical_works`.

Supporting Materials / File Vault mapping:
Maps to File Vault once storage is available. V1 can capture reference/metadata first.

Metadata / intelligence keys:
- `purpose`: `artwork`
- `referenceType`: `public_media`
- `visibility`: `public_safe_candidate`
- `publicSafeStatus`: `candidate`
- `usageContext`: `song_profile`, `release_preparation`, `public_showcase_candidate`
- `sourceReference`: optional
- `lineageSourceType`: `uploaded_file`, `external_link`, or `legacy_reference`
- `reviewStatus`: `not_reviewed`
- `evidenceCandidate`: `false`

Default visibility:
Private/workspace.

Public-safe posture:
Public-safe candidate, not public-approved.

Evidence posture:
Not evidence by default.

Future readiness value:
Public profile, release prep, marketing intelligence, visual identity.

Deferred:
Upload/storage, cropping, resizing, approval, public publishing.

### Metadata

User-facing meaning:
Song readiness information, not a normal file.

What the user captures:
Title, alternate title, artist, genre, BPM, key, language, explicit status, contributors, release grouping, identifiers later, and readiness notes.

Backend mapping:
Primarily `musical_works` and work profile metadata. May create a Supporting Material metadata reference if needed later.

Supporting Materials / File Vault mapping:
Usually not a file. If represented in Supporting Materials, map to `purpose = metadata_reference`.

Metadata / intelligence keys:
- `purpose`: `metadata_reference`
- `referenceType`: `operational_document`
- `visibility`: `workspace`
- `publicSafeStatus`: `not_applicable` or `candidate` for public profile fields
- `usageContext`: `song_profile`, `release_preparation`, `publishing`
- `sourceReference`: optional
- `lineageSourceType`: `generated_export`, `legacy_reference`, or `unknown`
- `reviewStatus`: `not_reviewed`
- `evidenceCandidate`: `false`

Default visibility:
Workspace/private.

Public-safe posture:
Only specific fields may later become public-safe.

Evidence posture:
Not evidence.

Future readiness value:
SAMRO, radio, YouTube, distribution, public pages, release readiness.

Deferred:
ISRC/ISWC workflows, MP3 tag parsing, DSP exports, automated validation.

### Agreement

User-facing meaning:
Song-linked legal or rights documents.

What the user captures:
Split sheets, producer agreements, publishing agreements, licensing documents, assignment documents, and notes.

Backend mapping:
Supporting Material / File Vault record linked to `musical_works`.

Supporting Materials / File Vault mapping:
Maps strongly to `file_vault_items` and `file_vault_links` with agreement-oriented purpose.

Metadata / intelligence keys:
- `purpose`: `agreement` or `split_sheet`
- `referenceType`: `operational_document` or `evidence_candidate`
- `visibility`: `private`
- `publicSafeStatus`: `private_only`
- `usageContext`: `rights_admin`, `publishing`, `evidence_support`
- `sourceReference`: optional
- `lineageSourceType`: `uploaded_file`, `external_link`, or `legacy_reference`
- `reviewStatus`: `needs_review`
- `evidenceCandidate`: may be `true`

Default visibility:
Private.

Public-safe posture:
Private only.

Evidence posture:
May be evidence candidate, not verified evidence.

Future readiness value:
Royalty splits, rights readiness, ownership, disputes, legal evidence.

Deferred:
Signature workflow, legal approval, royalty-linked agreement intelligence.

### Evidence

User-facing meaning:
Material that may support a claim later.

What the user captures:
Proof of creation, signed split proof, session proof, correspondence, registration support, timestamps, and source notes.

Backend mapping:
Supporting Material / File Vault record linked to `musical_works`, with future bridge to Evidence Vault.

Supporting Materials / File Vault mapping:
Maps as `referenceType = evidence_candidate`. It must not become verified evidence automatically.

Metadata / intelligence keys:
- `purpose`: `proof_of_creation` or `rights_evidence`
- `referenceType`: `evidence_candidate`
- `visibility`: `private`
- `publicSafeStatus`: `private_only`
- `usageContext`: `evidence_support`, `rights_admin`, `publishing`
- `sourceReference`: recommended
- `lineageSourceType`: `uploaded_file`, `external_link`, `legacy_reference`
- `reviewStatus`: `needs_review`
- `evidenceCandidate`: `true`

Default visibility:
Private.

Public-safe posture:
Private only.

Evidence posture:
Evidence candidate only. Not verified evidence.

Future readiness value:
Evidence Vault, `RegistrationEvidence`, disputes, registration support.

Deferred:
Evidence approval workflow, certification, legal verification, automatic promotion.

### Reference

User-facing meaning:
Helpful supporting material that is not evidence.

What the user captures:
Moodboards, briefs, inspiration links, rough references, notes, external URLs.

Backend mapping:
Supporting Material / File Vault record linked to `musical_works`.

Supporting Materials / File Vault mapping:
Maps as reference material with clear usage context.

Metadata / intelligence keys:
- `purpose`: `audio_reference`, `metadata_reference`, or `other`
- `referenceType`: `reference`
- `visibility`: `workspace`
- `publicSafeStatus`: `private_only` or `not_applicable`
- `usageContext`: `song_profile`, `release_preparation`, `public_showcase_candidate` when appropriate
- `sourceReference`: recommended for URLs
- `lineageSourceType`: `external_link`, `legacy_reference`, or `unknown`
- `reviewStatus`: `not_reviewed`
- `evidenceCandidate`: `false`

Default visibility:
Workspace/private.

Public-safe posture:
Usually private. Candidate only if explicitly reviewed later.

Evidence posture:
Not evidence.

Future readiness value:
Creative direction, marketing context, production continuity.

Deferred:
Reference crawling, AI analysis, automatic rights checks.

### Session File

User-facing meaning:
Production files connected to how the song was made.

What the user captures:
DAW/session/project files, stems, mix references, master references, remix/edit history, and version notes.

Backend mapping:
Supporting Material / File Vault record linked to `musical_works`.

Supporting Materials / File Vault mapping:
Maps strongly to File Vault, but real binary handling requires future storage strategy.

Metadata / intelligence keys:
- `purpose`: `session_file`
- `referenceType`: `operational_document`
- `visibility`: `private`
- `publicSafeStatus`: `private_only`
- `usageContext`: `release_preparation`, `evidence_support`
- `sourceReference`: optional but useful
- `lineageSourceType`: `uploaded_file`, `legacy_reference`
- `reviewStatus`: `not_reviewed`
- `evidenceCandidate`: may be `true` only when used as proof

Default visibility:
Private/internal.

Public-safe posture:
Private only.

Evidence posture:
Not evidence by default; may become evidence candidate when explicitly marked.

Future readiness value:
Production lineage, remix/edit history, source traceability.

Deferred:
Large file storage, DAW integration, stem management, version governance, cold storage.

### Other

User-facing meaning:
Any supporting material that does not fit the main cards.

What the user captures:
Description, purpose, notes, optional link/file reference, and why it matters.

Backend mapping:
Supporting Material / File Vault record linked to `musical_works`.

Supporting Materials / File Vault mapping:
Maps to `purpose = other`, but must require enough description to avoid becoming a dumping ground.

Metadata / intelligence keys:
- `purpose`: `other`
- `referenceType`: selected by user or default `reference`
- `visibility`: `workspace`
- `publicSafeStatus`: `private_only`
- `usageContext`: selected by user
- `sourceReference`: optional
- `lineageSourceType`: `unknown`, `external_link`, or `uploaded_file`
- `reviewStatus`: `not_reviewed`
- `evidenceCandidate`: default `false`

Default visibility:
Workspace/private.

Public-safe posture:
Private unless reviewed later.

Evidence posture:
Not evidence unless explicitly marked as evidence candidate.

Future readiness value:
Flexible operational capture without blocking workflow.

Deferred:
Automatic classification, AI suggestions, advanced taxonomy.

## 6. Backend Mapping Table

| Card | Primary backend owner | Supporting Materials / File Vault mapping | Storage needed now? |
| --- | --- | --- | --- |
| Lyrics | `musical_works` / profile metadata | Supporting Material with `purpose = lyrics` | No |
| Demo Audio | Supporting Materials / File Vault | `file_vault_items` + `file_vault_links` later | Later |
| Artwork | Supporting Materials / File Vault | `file_vault_items` + `file_vault_links` later | Later |
| Metadata | `musical_works` / work profile metadata | Optional `metadata_reference` | No |
| Agreement | Supporting Materials / File Vault | Agreement/split sheet record | Later for uploads |
| Evidence | Supporting Materials / File Vault, future Evidence Vault | Evidence candidate record | Later for uploads |
| Reference | Supporting Materials / File Vault | Reference record/link | No for links/notes |
| Session File | Supporting Materials / File Vault | Session/private production file | Later |
| Other | Supporting Materials / File Vault | Other with required purpose/description | Optional/later |

## 7. Metadata / Intelligence Mapping

Use the Asset Intelligence V1 keys consistently:

- `purpose`: what the material is for
- `referenceType`: reference, evidence candidate, operational document, public media, internal note
- `visibility`: private, workspace, public-safe candidate
- `publicSafeStatus`: private only, candidate, approved later, not applicable
- `usageContext`: song profile, rights admin, publishing, release preparation, licensing, public showcase candidate, evidence support
- `sourceReference`: external URL, file name, source note, or origin
- `lineageSourceType`: uploaded file, external link, generated export, legacy reference, unknown
- `reviewStatus`: not reviewed, needs review, reviewed, rejected later
- `evidenceCandidate`: boolean, never verified evidence

## 8. Public vs Private Boundary

Public-safe candidates:

- Lyrics, only if intended for public profile text
- Demo Audio, only as preview/review candidate
- Artwork, only as cover/profile/release candidate
- Selected Metadata fields, only after review

Private by default:

- Agreements
- Evidence
- Session Files
- Reference material unless explicitly reviewed
- Other material unless explicitly reviewed

`public_safe_candidate` never means public-approved.

## 9. Evidence Boundary

Evidence in V1 means evidence candidate only.

V1 may tag material as:

- potentially useful for proof
- requiring review
- connected to rights/registration support

V1 must not:

- certify evidence
- create verified `RegistrationEvidence`
- promote files into Evidence Vault automatically
- imply legal approval

`RegistrationEvidence` remains the future governed evidence layer.

## 10. Storage Boundary

V1 is metadata-first.

It may support:

- text capture
- notes
- external link/reference
- song-attached supporting material records
- file intent metadata

It defers:

- binary upload engine
- provider decision
- large-file handling
- streaming
- artwork transformation
- permanent archive/version governance

## 11. Readiness / SAMRO / Radio / YouTube / Distribution Connections

Files & Assets V1 prepares future readiness signals:

- Lyrics: language, themes, clean/explicit posture, public text
- Demo Audio: review/playback candidate, profile preview
- Artwork: release/profile visual readiness
- Metadata: title, genre, BPM, key, language, contributors, identifiers later
- Agreement: split/ownership support
- Evidence: registration/dispute support
- Reference: creative and marketing context
- Session File: production lineage and source traceability

These signals can later support SAMRO, radio, YouTube, distribution, publishing, and release-readiness checks.

## 12. Chronicle / Hosted Public Pages Future Mapping

Chronicle and hosted public catalogue pages may later consume approved public-safe data.

Likely future candidates:

- public song title
- public artist display name
- approved artwork
- approved demo/audio preview
- approved lyric excerpt or profile text
- genre/mood/language
- public description

Files & Assets V1 only prepares candidate posture. It does not publish anything.

## 13. First Implementation Slice Recommendation

Start with:

1. Lyrics
2. Metadata
3. Agreement / Reference records

Reason:
These deliver immediate value without requiring full upload/storage.

Smallest useful implementation later:

- unlock Files & Assets after contributor review
- allow card selection
- capture text/link/notes/purpose
- persist as existing Supporting Materials / File Vault metadata if safe
- keep demo audio, artwork, session files as metadata/reference placeholders until storage is decided

## 14. Deferred Capabilities

Explicitly defer:

- full upload/storage engine
- large binary strategy
- audio preview streaming
- artwork transformation/cropping
- public feed to Chronicle
- evidence approval workflow
- `RegistrationEvidence` promotion
- AI metadata extraction
- MP3 tag parsing
- DSP/distribution automation
- royalty-linked agreement intelligence
- DAW/session version governance
- immutable archive/cold storage

## 15. Risks / Anti-Patterns

Avoid:

- turning Files & Assets into a generic file drive
- exposing backend metadata language to normal users
- calling evidence verified before review
- treating public-safe candidate as public approval
- forcing upload/storage decisions before metadata capture is useful
- letting `Other` become a dumping ground
- making users classify every backend field manually
- delaying useful workflow slices through over-alignment

## 16. Recommended Next Action

Plan the first Files & Assets V1 runtime slice:

- start with Lyrics + Metadata + Agreement / Reference records
- inspect existing Supporting Materials create/read flow for text/link records
- avoid storage/upload work initially
- keep UI card-based and product-first
- persist through existing Work Supporting Materials / File Vault metadata where safe
