# MP3 Metadata Extraction UX Design Pass

Date: 2026-05-28

Mode: UX design only. No backend extraction, storage/upload engine, schema, API, route, or runtime behavior implemented.

## 1. Purpose

This design pass defines the future UX for the song workflow step where a user uploads a final MP3 and can choose to extract embedded metadata.

The product principle is:

> Capture once, reuse everywhere.

If Markus already rendered an MP3 with useful metadata from the DAW or tagging workflow, Sentry Sound should not force him to retype the same information. The product should offer a simple option to read the MP3 metadata later, show any extracted values for review, and let the user decide what to save into the Song Profile.

This is not an implementation plan for MP3 parsing. It is a product-first UX design pass for how the experience should behave once extraction becomes available.

## 2. User Workflow

The real user workflow is:

1. Generate or draft the song in Suno / AI tooling.
2. Move the chosen version into a DAW.
3. Mix and master the song.
4. Render a WAV.
5. Render an MP3 with embedded metadata.
6. Upload the final MP3 to Sentry Sound.
7. Review song details.
8. Continue toward registration, release, publishing, radio, YouTube, or SAMRO-related preparation.

The Sentry Sound workflow should treat final MP3 upload as part of finishing the song, not as a separate file-management task.

## 3. UX Behavior After MP3 Upload

When the user uploads a final MP3 in the song workflow, the upload area should show a simple checkbox:

```text
[ ] Extract metadata from this MP3
```

If unchecked:

- The MP3 is treated as a final audio material only.
- No extraction attempt is made.
- Existing manual Song Profile fields remain unchanged.

If checked:

- The system may later inspect embedded MP3 tags after upload.
- Extracted values should be shown in a review state before they are saved.
- Blank or missing values should not block the user.
- Existing trusted Song Profile data should not be overwritten without confirmation.

The mockup direction supports this as part of the Files & Assets step, with the right-side helper panel explaining why metadata extraction can save time.

## 4. Extract Metadata Checkbox Logic

Default state:

- Unchecked by default for the safest first implementation.

Recommended checkbox label:

- Extract metadata from this MP3

Recommended helper copy:

- We will look for song details already saved inside the MP3 and show them for review before saving.

When checked:

- Mark the final MP3 as eligible for future metadata extraction.
- Do not immediately overwrite Song Profile fields.
- Move the user into a review state if extraction returns values.

When unchecked:

- Keep the MP3 attached as final audio.
- Let the user continue manual profile capture.

Review states:

- Metadata found: show extracted fields next to current Song Profile values.
- Some metadata found: show available fields and keep missing fields editable.
- No metadata found: tell the user no embedded metadata was found and keep manual entry available.
- Extraction unavailable: explain that metadata extraction could not run and keep manual entry available.

## 5. Useful Metadata

Embedded MP3 metadata that may be useful:

- title
- artist
- album/project
- genre
- year/date
- track number
- BPM
- key
- comments/description
- artwork/cover image if embedded

These fields should be treated as suggestions for review, not automatic truth.

Potential Song Profile mapping:

- title -> song title or alternate title review
- artist -> primary artist review
- album/project -> project/collection review
- genre -> genre review
- year/date -> release or creation date context later
- BPM -> BPM field
- key -> key field
- comments/description -> description/notes
- artwork/cover image -> artwork material candidate

## 6. Review-Before-Save Rule

Extraction must be review-before-save.

The user should be able to:

- see extracted metadata
- compare it with existing Song Profile values
- choose which values to apply
- edit values before saving
- skip extracted values entirely

The system should not:

- silently overwrite trusted Song Profile fields
- treat extracted metadata as verified rights data
- treat embedded artwork as public-approved
- treat MP3 tags as registration-ready evidence

Recommended product wording:

- Review metadata found in this MP3
- Use this value
- Keep current value
- Edit before saving
- Skip for now

## 7. Missing / Blank Field Behavior

If a field is missing or blank in the MP3:

- show the field as empty or not found
- let the user enter the value manually
- do not fail the upload
- do not mark the song as incomplete solely because MP3 metadata is missing

If an extracted value conflicts with an existing Song Profile value:

- keep the existing value by default
- show the MP3 value as a suggestion
- require the user to confirm replacement

If embedded artwork is missing:

- keep artwork upload/manual artwork workflow available
- do not block final audio capture

## 8. SAMRO / Radio / YouTube Submission Relevance

MP3 metadata can support later preparation for:

- SAMRO-related work context
- radio submission packs
- YouTube upload descriptions
- publishing and catalogue administration
- release metadata review
- internal song profile quality

Important boundary:

- MP3 metadata is useful reference data.
- MP3 metadata is not legal proof by itself.
- MP3 metadata does not confirm ownership, splits, licensing, or registration readiness.
- Future review/readiness flows may use it as context only.

The UX should make this feel helpful, not official or intimidating.

## 9. Backend Boundary

No backend extraction is implemented in this design pass.

Current boundary:

- no MP3 parsing yet
- no storage/upload engine yet
- no schema migration
- no API or route creation
- no runtime behavior change
- no automatic Song Profile overwrite

Future implementation may need:

- an extraction service
- a metadata parser library
- file-type validation
- extraction status tracking
- extraction result storage
- conflict/review payloads
- artwork extraction handling

Those are deferred until the UX and storage boundary are ready.

## 10. Relationship To Existing Product Areas

### Song Profile

Extracted MP3 metadata should be reviewed as candidate Song Profile values.

The Song Profile remains the user-facing place for final trusted song details.

### Supporting Materials / File Vault

The uploaded MP3 can become a final audio material attached to the song.

Quiet backend mapping may include:

- `purpose`: `audio_reference`
- `referenceType`: `public_media` or `operational_document`
- `visibility`: `private` or `public_safe_candidate`
- `usageContext`: `release_preparation` or `public_showcase_candidate`

Supporting Materials may show the file later as structured/admin context, but the normal user should experience this through the song workflow.

### Final Audio Asset

The MP3 should be treated as a final audio candidate, not automatically as the legally final master.

The user may still need to choose:

- final MP3
- final WAV
- current master
- release-ready file

### Registration / Release Readiness

Extracted metadata may help readiness review later, but should not trigger readiness, registration, public publishing, or release automation by itself.

It can reduce duplicate typing and improve profile quality.

## 11. Product-First Wording

Use:

- Extract metadata from this MP3
- Review metadata found in this MP3
- Use this value
- Keep current value
- Add missing details
- Final audio
- Song details
- Cover image found

Avoid:

- Asset Intelligence
- File Vault extraction
- governance metadata
- ID3 authority
- evidence-certified
- public-approved
- registration-ready
- compliance-ready

The user should feel like Sentry Sound is helping them avoid duplicate work.

## 12. Future Implementation Notes

Future implementation should likely happen in small slices:

1. Add the checkbox in the final MP3 upload workflow.
2. Store extraction intent only.
3. Add a backend extraction service later.
4. Show extracted fields in a review panel.
5. Let the user apply selected values to the Song Profile.
6. Treat embedded artwork as an artwork candidate, not approved public art.

Implementation questions to answer later:

- Where is the uploaded MP3 stored?
- Which parser library is allowed?
- Where are raw extracted tags stored?
- How are conflicts with existing Song Profile values represented?
- Should extracted metadata be persisted before user review?
- How should embedded artwork be stored or referenced?

## 13. What Is Explicitly Deferred

Deferred:

- MP3 parsing implementation
- ID3/tag extraction service
- storage/upload engine
- schema migration
- new API/routes
- automatic Song Profile overwrite
- artwork extraction handling
- audio preview generation
- public publishing
- SAMRO submission automation
- YouTube upload automation
- radio submission package automation
- evidence promotion
- registration/release readiness automation
- File Vault admin UI changes
- AI/assistant behavior
