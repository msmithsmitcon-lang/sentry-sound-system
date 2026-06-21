# Chronicle Intake Review Report V1

Date: 2026-06-04

Status: migration review only. No database writes, imports, schemas, migrations, staging tables, spreadsheet synchronization, or import automation were created.

## Verified Workbook

Canonical Chronicle intake workbook:

```text
C:\Users\Euan Smith\Desktop\CHRONICLE MUSIC PUBLISHING\17_Marketing_Press\Website\public\catalogue\covers\song_metadata_genre_artist_dropdowns.xlsx
```

Workbook metadata:

- Size: 25,891 bytes
- Last modified: 2026-06-04 20:04:53
- Read method: read-only shared-stream XLSX XML inspection
- Workbook was locked/open by another process during inspection, but read-only shared inspection succeeded.

## Workbook Summary

Sheets:

| Sheet | State | Range | Populated rows |
| --- | --- | --- | --- |
| Song Metadata | visible | A1:X500 | 51 including header |
| Dropdown Lists | visible | A1:F58 | 58 including header |
| Instructions | visible | A1:B6 | 6 including header |

Hidden sheets: none.

Main columns:

- Song ID
- Song Title
- Artist
- Featured Artist(s)
- Genre
- Sub-Genre / Style
- Language
- Mood / Theme
- Release Type
- Status
- ISRC
- ISWC
- Composer(s)
- Lyricist(s)
- Producer(s)
- Master Owner
- Publishing Owner
- Ownership Split %
- Recording Date
- Release Date
- DSP / Platform Notes
- Rights / Registration Notes
- Copyright Owner Notes
- General Notes

Reference/dropdown sheet columns:

- Artists: 2 values
- Genres: 57 values
- Sub-Genres / Styles: 13 values
- Languages: 5 values
- Release Types: 9 values
- Statuses: 10 values

No Excel `dataValidation` dropdown rules were found in workbook XML. `Dropdown Lists` is a visible reference sheet.

## Backend Read-Only Duplicate Check

A read-only `SELECT` was run against current `public.musical_works`.

Existing titles returned for duplicate awareness:

- Midnight Drive
- Im Who
- Its Time to
- Township Sunrise
- Fire in the Valley
- Ocean Memory
- Street Parade
- Sunday Morning
- Kimberley Lights
- Desert Rain
- Golden Season
- Midnight Road
- Paper Hearts

No database writes occurred.

## Classification Summary

Workbook row count:

- Total data rows after header: 50
- Populated song records by title: 35
- Placeholder Song ID rows with no title/core metadata: 15

Classification counts:

| Classification | Count | Notes |
| --- | ---: | --- |
| create_candidate | 0 | None are ready for full create with contributor rows because split percentages are blank. |
| possible_duplicate | 1 | `Its Time to Move On` has a fuzzy title match against existing `Its Time to`. |
| matches_existing | 0 | No exact normalized title match found in current `musical_works`. |
| blocked_missing_required_fields | 0 | Populated records have title, artist, genre, language, status, and contributor names. |
| blocked_split_unclear | 34 | Contributor names are present, but `Ownership Split %` is blank. |
| metadata_only_review | 15 | Placeholder Song ID rows with no title/core metadata. |

Candidate import count:

- Full work plus contributors through current create-song contract: 0
- Foundation-only work draft candidates if contributors are deferred: 34
- Duplicate-review foundation candidate: 1

Blocked/review count:

- 50 total rows require some review before migration.
- 35 populated song rows require contributor/split review before contributor import.
- 15 empty placeholder rows should not be migrated.

## Per-Record Review

| Row | Song ID | Title | Artist | Genre | Language | Status | Classification | Reason |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | SONG-001 | Afrika Borwa | M-Wis | House | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. Notes present as metadata-only review. |
| 3 | SONG-002 | As ek vannag kon uitvee | M-Wis | Afrikaanse Adult Contemporary | Afrikaans | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 4 | SONG-003 | Brood van Lewe | M-Wis | Afrikaans Gospel Ballad | Afrikaans | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 5 | SONG-004 | Dina van District 6 | M-Wis | Cape Folk | Afrikaans | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 6 | SONG-005 | Good Woman | M-Wis | Adult Contemporary | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 7 | SONG-006 | Its Time to Move On | M-Wis | Adult Contemporary | English | Ready | possible_duplicate | Fuzzy title match against existing Sentry Sound work `Its Time to`; split also unclear. |
| 8 | SONG-007 | Kurara Easy | M-Wis | Afrobeats | Other | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 9 | SONG-008 | Living Bread | M-Wis | Christian Contemporary / CCM | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 10 | SONG-009 | My liefde hou vir 'n leeftyd | M-Wis | Afrikaanse Adult Contemporary | Afrikaans | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 11 | SONG-010 | My Wife My Life | M-Wis | Adult Contemporary | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 12 | SONG-011 | Ocean Between Us | M-Wis | Adult Contemporary | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 13 | SONG-012 | Ons Twee Verdwaal | M-Wis | Afrikaanse Adult Contemporary | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 14 | SONG-013 | Re Bina Bosigo | M-Wis | Afrobeats | Other | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 15 | SONG-014 | Strobe Waistline | M-Wis | Trap | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 16 | SONG-015 | Tomorrow Land | M-Wis | Dance / EDM | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 17 | SONG-016 | Voel Weer | M-Wis | Afrikaanse Adult Contemporary | Afrikaans | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 18 | SONG-017 | You're Still Here | M-Wis | Adult Contemporary | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 19 | SONG-018 | Always be your child | M-Wis | Adult Contemporary | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 20 | SONG-019 | Daar Kom die Alibaba | M-Wis | Cape Folk | Afrikaans | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 21 | SONG-020 | Draai Soe | M-Wis | Cape Folk | Afrikaans | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 22 | SONG-021 | Hier Is Ons | M-Wis | Afrikaanse Adult Contemporary | Afrikaans | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 23 | SONG-022 | Kalahari High | M-Wis | Inspirational | Afrikaans / English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 24 | SONG-023 | Lei Ons Terug Na U, Jesus | M-Wis | Afrikaans Gospel Ballad | Afrikaans | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 25 | SONG-024 | Mirror Noise | M-Wis | Pop | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 26 | SONG-025 | My Love will last for a Lifetime | M-Wis | Adult Contemporary | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 27 | SONG-026 | Ngingasula Okwanamuhla | M-Wis | Adult Contemporary | Other | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 28 | SONG-027 | Ons is nooit Alleen nie | M-Wis | Afrikaans Gospel Ballad | Afrikaans | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 29 | SONG-028 | Peacock Blue Die Griquas | M-Wis | Adult Contemporary | Afrikaans / English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 30 | SONG-029 | Re Teng Ga Nyele | M-Wis | Inspirational | Other | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 31 | SONG-030 | Saltwater Eyes | M-Wis | Adult Contemporary | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 32 | SONG-031 | The Y - Kimberley | M-Wis | House | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 33 | SONG-032 | Growing Up at the Crossroads | Huey D | Hip-Hop | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 34 | SONG-033 | Huey-D French Inspired | Huey D | Hip-Hop | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 35 | SONG-034 | South side Rhythm | Huey D | Hip-Hop | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 36 | SONG-035 | Windsor Knot | Huey D | Hip-Hop | English | Ready | blocked_split_unclear | Contributors present; Ownership Split % blank. |
| 37-51 | SONG-036 to SONG-050 | blank | blank | blank | blank | blank | metadata_only_review | Placeholder IDs only; no song title/core metadata populated. |

## Required Analysis Findings

### Records That Can Safely Become New Works

No populated record is ready for full work-plus-contributor import.

Thirty-four records can become new draft works only if contributor import is deferred and the create payload uses an empty contributor array. This would create work foundations without asserting contributor splits.

`Its Time to Move On` must be reviewed before creation because it is a possible duplicate of existing work `Its Time to`.

### Records Needing Contributor Review

All 35 populated song records need contributor review.

Reason:

- Composer(s), Lyricist(s), and Producer(s) are populated.
- `Ownership Split %` is blank for every populated song.
- The current create-song contract validates contributor percentages when contributors are supplied.
- Importing contributor rows without clear splits would either fail validation or create misleading rights state.

### Records With Ambiguous Ownership

All 35 populated song records contain ambiguous ownership for migration purposes.

The workbook lists contributor names and owner names, but does not provide a safe relational split model. `Master Owner` and `Publishing Owner` must remain review metadata, not structured rights truth.

### Metadata-Only Records

Rows 37-51 are metadata-only review rows because they contain placeholder Song IDs but no title/core song data.

For populated songs, the following fields are also metadata/review-only during this phase:

- Status
- ISRC
- ISWC
- Master Owner
- Publishing Owner
- notes fields
- release/recording/date fields
- mood/theme and sub-genre if not normalized

### Records That Would Fail Current Create-Song Contracts

If imported with contributors as listed, all 35 populated records would fail or be blocked by current create-song expectations because contributor percentage totals cannot be validated.

If imported foundation-only with `contributors: []`, 34 records appear capable of passing the current basic create-song contract, subject to final approval and duplicate review.

### Records That May Already Exist

Possible duplicate:

- `Its Time to Move On` may relate to existing Sentry Sound work `Its Time to`.

No exact normalized title matches were found among the read-only `musical_works` results.

## Recommended Create Payload Structure

For approved foundation-only migration, use the current existing contract only:

```json
{
  "work_title": "Song Title",
  "genre": "Genre",
  "mood": "",
  "copyright_status": "draft",
  "registration_status": "draft",
  "contributors": []
}
```

Do not send workbook `Status` as backend registration or copyright status yet. Chronicle `Ready` is website/catalogue readiness, not Sentry Sound registration readiness.

After work creation, if approved, use the existing profile update path for non-authoritative creative/profile metadata:

```json
{
  "language": "Language",
  "creative_description": "Chronicle intake notes or public catalogue context",
  "inspiration_reference_notes": "Source: Chronicle intake workbook; Song ID: SONG-..."
}
```

Contributor rows should only be sent later after split review:

```json
{
  "contributors": [
    {
      "name": "Contributor Name",
      "role": "composer",
      "split_type": "composition",
      "percentage": 100
    }
  ]
}
```

That contributor payload is illustrative only. It must not be used until ownership/split intent is approved.

## Recommended Migration Sequence

1. Approve the Chronicle integration principle.
2. Review `Its Time to Move On` against existing `Its Time to`.
3. Decide whether to create foundation-only works for the 34 non-duplicate populated records.
4. Keep all contributor, ownership, master owner, publishing owner, ISRC, and ISWC fields out of structured import.
5. Create approved work foundations through existing `POST /api/songs/create` only.
6. Add approved language/profile notes through existing `PATCH /api/works/[workId]/profile` only.
7. Run a separate contributor/split review pass before touching `contributors` or `work_contributors`.
8. Run a separate identifier/recording/release review before touching ISRC, ISWC, recordings, or release structures.
9. Keep Chronicle as a consumer of approved backend truth through future APIs, exports, feeds, or integrations.

## No-Write Confirmation

No database writes occurred.

No import occurred.

No schema, migration, staging table, spreadsheet sync, or import automation was created.

