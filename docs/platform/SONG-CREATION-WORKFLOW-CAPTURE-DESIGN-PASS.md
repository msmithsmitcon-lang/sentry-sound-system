# Song Creation Workflow Capture Design Pass

Date: 2026-05-28

Mode: Design pass only. No runtime implementation performed.

## 1. Executive Summary

The product direction should shift from standalone Supporting Materials capture toward workflow-native song creation capture.

Supporting Materials and File Vault metadata are useful backend/admin structures, but the normal user should not feel like they are managing files, evidence, public-safe posture, or governance metadata. The normal user should feel like they are creating, finishing, and preparing a song.

The future product model should guide the user through natural music-making steps, then quietly map those steps into structured backend data:

- song metadata
- supporting materials
- file purpose
- reference/evidence posture
- usage context
- lineage/version posture
- private/public-safe posture
- future readiness/review context

This keeps the user experience creative and practical while preserving backend structure for later registration, release, publishing, catalogue, and admin workflows.

## 2. User Mental Model

The user mental model should be:

> I am creating or completing a song.

It should not be:

> I am filling backend metadata.

The user should see familiar creative actions:

- Start a song idea.
- Add lyrics, style, prompt, or mood.
- Add a demo or generated version.
- Choose the version to keep working on.
- Add mix and master files.
- Add artwork.
- Add final audio.
- Prepare the song profile.
- Continue to registration or release.

The system can infer structured meaning from those actions without requiring the user to understand File Vault, Asset Intelligence, evidence systems, public-safe boundaries, or lineage semantics.

## 3. Markus Real Workflow Mapping

Markus's real workflow shows the product shape clearly:

1. Create a song in Suno.
2. Enter lyrics, prompt, style, and creative direction into the AI tool.
3. Choose the generated version that feels strongest.
4. Download the WAV file.
5. Save the WAV to a desktop folder for that song.
6. Open a DAW.
7. Mix/master the song.
8. Create artwork.
9. Render a final WAV with metadata.
10. Render an MP3.
11. Upload the MP3 into Sentry Sound.
12. Continue into registration, release, and publishing workflows.

In product terms, this is not a file-management journey. It is a song completion journey.

Sentry Sound should eventually support this as a guided workflow where each step captures what the user naturally has in front of them:

- lyrics/prompt/style as creative context
- generated audio as demo/source material
- chosen version as the working version
- DAW outputs as mix/master material
- artwork as visual release/profile material
- final WAV/MP3 as final audio material
- profile fields as registration/release preparation context

## 4. Proposed User-Facing Workflow Stages

### 1. Song Idea

User-facing question/action:

- What are you making?
- Start a new song idea.

Expected file/data input:

- working title
- genre/mood
- short idea note
- optional intended outcome

Backend can infer:

- a new song/work exists
- early creative context exists
- profile is incomplete but started

Maps to:

- `musical_works`
- work/song profile fields
- creative details metadata

Optional:

- collaborators
- target release intention
- reference notes

### 2. Lyrics / Prompt / Style

User-facing question/action:

- Add lyrics, prompt, style, or reference notes.

Expected file/data input:

- lyrics text
- Suno prompt
- style descriptors
- reference notes

Backend can infer:

- creative source context
- lyrics/reference purpose
- internal working material

Maps to Supporting Materials/File Vault metadata:

- `purpose`: `lyrics` or `metadata_reference`
- `referenceType`: `reference` or `internal_note`
- `visibility`: `private`
- `usageContext`: `song_profile`

Optional:

- stored as profile text first
- supporting-material record only when captured as a file/reference

### 3. Demo Or Generated Version

User-facing question/action:

- Add the demo or generated version you want to keep.
- Which version should we remember?

Expected file/data input:

- Suno-generated audio
- external link
- version note
- chosen version marker

Backend can infer:

- generated demo/reference
- working-version candidate
- source reference exists
- possible lineage starting point

Maps to Supporting Materials/File Vault metadata:

- `purpose`: `demo` or `audio_reference`
- `referenceType`: `reference`
- `visibility`: `private` or `workspace`
- `usageContext`: `song_profile` or `release_preparation`

Optional:

- lineage source type
- version note
- external link

### 4. Working Files

User-facing question/action:

- Add working files or project notes.

Expected file/data input:

- DAW project reference
- session folder note
- stems reference
- bounced working WAV

Backend can infer:

- work-in-progress material
- not final release audio
- private/internal usage

Maps to Supporting Materials/File Vault metadata:

- `purpose`: `audio_reference` or `other`
- `referenceType`: `operational_document` or `reference`
- `visibility`: `private` or `workspace`
- `usageContext`: `release_preparation`

Optional:

- real upload later
- storage provider later
- version chain later

### 5. Mix / Master

User-facing question/action:

- Add mix or master files.
- Which file is the current master?

Expected file/data input:

- mixed WAV
- mastered WAV
- mastering notes
- version label

Backend can infer:

- release-preparation material
- possible current final candidate
- version posture matters later

Maps to Supporting Materials/File Vault metadata:

- `purpose`: `audio_reference`
- `referenceType`: `operational_document` or `reference`
- `visibility`: `private` or `workspace`
- `usageContext`: `release_preparation`

Optional:

- archive/supersession later
- checksum/storage later
- audio preview later

### 6. Artwork

User-facing question/action:

- Add artwork.
- Is this private, or could it maybe be used on a public profile later?

Expected file/data input:

- artwork image
- artwork brief
- cover art reference
- designer/source note

Backend can infer:

- visual identity material
- possible public/profile candidate
- not public-approved yet

Maps to Supporting Materials/File Vault metadata:

- `purpose`: `artwork`
- `referenceType`: `public_media` or `reference`
- `visibility`: `private`, `workspace`, or `public_safe_candidate`
- `usageContext`: `public_showcase_candidate` or `release_preparation`
- `publicSafeStatus`: default `private_only` unless later reviewed

Optional:

- public-safe approval later
- public pages later
- image previews later

### 7. Final Audio

User-facing question/action:

- Add final audio.
- Which MP3/WAV should represent this song?

Expected file/data input:

- final WAV
- final MP3
- metadata-rendered audio
- release-ready audio note

Backend can infer:

- release-preparation asset
- possible public/profile/release candidate
- possible evidence candidate later, but not verified evidence

Maps to Supporting Materials/File Vault metadata:

- `purpose`: `audio_reference`
- `referenceType`: `operational_document` or `public_media`
- `visibility`: `private`, `workspace`, or `public_safe_candidate`
- `usageContext`: `release_preparation`, `licensing`, or `public_showcase_candidate`

Optional:

- DSP/release package automation later
- storage engine later
- audio preview later

### 8. Song Profile

User-facing question/action:

- Prepare the song profile.
- Add the details people will need later.

Expected file/data input:

- title
- alternative title
- genre/subgenre
- mood/theme
- language
- clean/explicit note
- contributors/splits
- release intentions

Backend can infer:

- profile completeness
- registration/release readiness context
- missing review items

Maps to:

- `musical_works`
- contributors/splits
- creative details metadata
- Work Completeness/readiness display

Optional:

- full rights review
- publishing contacts
- licensing notes

### 9. Prepare Registration / Release

User-facing question/action:

- Prepare registration or release.
- What still needs review before this song can move forward?

Expected file/data input:

- split sheets
- agreements
- proof/reference materials
- final audio
- artwork
- contributor confirmation context

Backend can infer:

- readiness gaps
- evidence candidates
- supporting materials count
- future registration/release package candidates

Maps to Supporting Materials/File Vault metadata:

- `purpose`: `split_sheet`, `agreement`, `proof_of_creation`, `licensing_reference`, or `metadata_reference`
- `referenceType`: `evidence_candidate`, `operational_document`, or `reference`
- `visibility`: `private` or `workspace`
- `usageContext`: `rights_admin`, `publishing`, `licensing`, or `evidence_support`

Optional:

- evidence approval later
- RegistrationEvidence creation later
- release package automation later

## 5. Backend Mapping

Workflow-native capture can map to existing Sentry Sound structures without exposing those structures to the user.

Works/songs:

- Song creation begins from existing work/song concepts.
- Early workflow stages create or enrich the song/work record.

`musical_works`:

- Stores canonical song/work identity and existing profile fields.
- Remains the central song anchor.

Contributors/splits:

- Captured during song profile or registration/release preparation.
- Remains separate from file capture.

Work Supporting Materials:

- Stores workflow-attached references/files when a stage produces a meaningful material.
- Can be used by admin/support views to inspect what the workflow captured.

File Vault metadata:

- Stores first-slice metadata such as purpose, reference type, visibility, and usage context.
- Later may store lineage, source reference, archive, or public-safe posture.

Creative details:

- Lyrics, style, prompt, mood, language, and creative notes should often land here first.
- Supporting Materials should be used when the input is a file/reference rather than a profile field.

Completeness/review:

- Should observe the workflow state later.
- Should not force file metadata into readiness before the product rules are clear.

Future evidence/registration:

- Workflow may produce evidence candidates.
- Evidence candidates are not verified evidence and should not automatically create `RegistrationEvidence`.

Future public pages:

- Artwork/final audio/profile material may become public-safe candidates later.
- Public-safe candidate does not mean public approved.

## 6. Supporting Materials Role

Supporting Materials should remain the structured/admin/reference view.

Workflow capture should be the normal user-facing experience.

Both can use the same backend data:

- The workflow captures natural song-making inputs.
- Supporting Materials shows the structured material list.
- Admin/back-office users can correct or review metadata.
- Normal users should not need to open a technical file-management panel to move a song forward.

This allows Sentry Sound to keep a useful File Vault-backed structure without making the product feel like a generic drive or governance console.

## 7. Asset Intelligence V1 Mapping

Workflow-native steps can populate first-slice metadata quietly.

`purpose`:

- Inferred from the stage.
- Artwork stage maps to `artwork`.
- Lyrics/prompt stage maps to `lyrics` or `metadata_reference`.
- Final audio stage maps to `audio_reference`.
- Registration/release preparation maps to `split_sheet`, `agreement`, `proof_of_creation`, or `licensing_reference`.

`referenceType`:

- Inferred from the stage and user wording.
- Normal files start as `reference`.
- Split sheets/agreements/proof can become `evidence_candidate`.
- Artwork/final profile media can become `public_media`.

`visibility`:

- Defaults to `private`.
- Workspace-shared material can use `workspace`.
- Artwork/final audio/profile assets may become `public_safe_candidate` later.

`usageContext`:

- Inferred from workflow stage.
- Song idea and lyrics map to `song_profile`.
- Mix/master/final audio maps to `release_preparation`.
- Split sheet/agreement/proof maps to `rights_admin`, `publishing`, or `evidence_support`.
- Artwork/public profile candidates map to `public_showcase_candidate`.

`evidenceCandidate`:

- Derived only when the stage clearly captures possible evidence, such as proof of creation, split sheet, or agreement.
- It must not mean verified evidence.

`publicSafeStatus`:

- Defaults to `private_only`.
- Public-safe candidate posture may be captured later, but not public approval.

The user should only see simple choices where helpful. The backend can handle the technical mapping.

## 8. Assistant / SLM / LLM Role Later

A future assistant could reduce manual capture by asking:

> What do you want to do today?

Possible choices:

- Create a song.
- Finish a song.
- Add artwork.
- Prepare release.
- Register a song.

The assistant could then guide the user through the relevant workflow steps and map answers/files into backend structures.

Examples:

- If the user says "Create a song", the assistant starts with title, idea, lyrics/prompt/style, and demo.
- If the user says "Finish a song", the assistant asks for current version, mix/master, artwork, and final audio.
- If the user says "Prepare release", the assistant checks final audio, artwork, contributor context, and metadata.
- If the user says "Register a song", the assistant checks contributors, splits, rights references, and evidence candidates.

No AI implementation is recommended now. This section only identifies where assistant guidance could naturally reduce manual capture later.

## 9. Product UX Direction

The UI should feel:

- step-by-step
- creative workflow oriented
- lightweight
- guided
- music-industry natural
- forgiving of incomplete songs
- useful without technical knowledge

The UI should not feel:

- admin-heavy
- governance-heavy
- file-management-first
- evidence-system-first
- public-feed-first
- enterprise DAM-like

The product should help the user keep moving through a real song process, while the backend quietly captures structured data.

## 10. Admin / Back-Office View

Admin/back-office views may expose structured metadata for correction, support, review, or troubleshooting.

These views can show:

- Supporting Materials records
- purpose
- reference type
- visibility
- usage context
- public-safe posture
- evidence-candidate posture
- source/reference notes

But the normal user workflow should stay simple. Admin clarity should not become normal-user complexity.

## 11. V1 Boundary

The first future workflow slice should remain design/product focused.

In scope for the next planning step:

- Create Song Workflow V1 UX plan.
- Stage definitions.
- Simple user questions.
- Mapping from stage to existing backend fields.
- Identification of which existing Add Song/Song Detail areas should be adjusted later.

Out of scope:

- upload engine
- DAW integration
- Suno integration
- AI assistant implementation
- registration pipeline automation
- release package automation
- evidence approval workflow
- public page publishing
- storage provider strategy
- schema migration

## 12. Risks / Anti-Patterns

Avoid:

- making users manually fill every backend field
- turning the workflow into file administration
- exposing governance too early
- making Supporting Materials the primary normal-user journey
- building DAW integrations prematurely
- trying to automate the full pipeline now
- over-aligning endlessly instead of shipping useful workflow slices
- confusing evidence candidate with verified evidence
- confusing public-safe candidate with public approval
- making users understand File Vault, Asset Intelligence, or lineage semantics

The workflow should be simple enough to ship in slices.

## 13. Recommended Next Step

Recommended next step:

Create a Create Song Workflow V1 UX plan that revises the Add Song/Song Detail journey into staged creative workflow capture without implementing runtime changes yet.

That plan should define:

- first screen
- stage order
- exact user-facing copy
- fields/files per stage
- which existing backend structures each stage can reuse
- which stages are display-only first
- what remains deferred

After that UX plan, Sentry Sound can implement one small workflow slice instead of turning Supporting Materials into a standalone user-facing asset system.
