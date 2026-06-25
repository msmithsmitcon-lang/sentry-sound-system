# Chronicle Foundation-Only Works Import Plan V1

Date: 2026-06-04

Status: execution-ready plan only. No import, database write, schema change, migration, staging table, spreadsheet synchronization, or import automation is created by this document.

Source documents:

- `docs/platform/CHRONICLE-INTEGRATION-PRINCIPLE-V1.md`
- `docs/platform/CHRONICLE-INTAKE-REVIEW-REPORT-V1.md`

## Objective

Prepare the first controlled Chronicle catalogue migration step as foundation-only draft works in Sentry Sound.

This plan uses the existing backend authority path:

1. `POST /api/songs/create`
2. Optional `PATCH /api/works/[workId]/profile` only for fields already supported by the current profile contract

This plan does not import contributors, splits, ownership, ISRC, ISWC, master owner, publishing owner, releases, recordings, or rights administration data.

## Scope

Included:

- 34 foundation-only draft candidates from the verified Chronicle workbook
- Work title
- Genre
- Empty mood value, because `Mood / Theme` is blank for all candidates
- Draft backend statuses
- Empty contributors array
- Optional post-create language/profile note through existing profile update contract

Excluded:

- Possible duplicate `Its Time to Move On`
- 15 placeholder Song ID rows with no title/core metadata
- Contributor import
- Ownership split import
- ISRC / ISWC import
- Master owner / publishing owner import
- Spreadsheet synchronization

## Backend Contract Check

`POST /api/songs/create` currently allows empty contributors.

Evidence:

- `src/lib/registration/contracts/create-song-contract.ts` requires `contributors` to be an array.
- It filters named contributors.
- It validates split total only when `contributors.length > 0`.

Therefore this payload is valid for foundation-only work creation:

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

No backend change is required for foundation-only creation.

## Profile Metadata Support Check

`PATCH /api/works/[workId]/profile` currently supports:

- `themes`
- `alternative_title`
- `language`
- `energy`
- `clean_explicit`
- `creative_description`
- `inspiration_reference_notes`
- temporary primary artist tag fields
- temporary release/project grouping tag fields

It does not currently support a generic structured namespaced envelope such as:

```json
{
  "metadata": {
    "chronicle_intake_v1": {}
  }
}
```

Safe current handling:

- Use `language` for the workbook Language value.
- Optionally use `inspiration_reference_notes` as a human-readable Chronicle source note.
- Do not persist ISRC, ISWC, owner, contributor, or split fields into structured profile metadata in this step.

Smallest future backend change, if approved later:

- Extend the profile update contract to accept a bounded `chronicle_intake_v1` object.
- Merge it under `musical_works.metadata.chronicle_intake_v1`.
- Preserve existing `work_intelligence_v1`.
- Validate allowed keys.
- Mark all values as `source_reference_only` / `not_authoritative`.

That change is not part of this plan.

## Exact Candidate Songs

The 34 included foundation-only candidates are:

| Song ID | Title | Artist | Genre | Language | Chronicle status |
| --- | --- | --- | --- | --- | --- |
| SONG-001 | Afrika Borwa | M-Wis | House | English | Ready |
| SONG-002 | As ek vannag kon uitvee | M-Wis | Afrikaanse Adult Contemporary | Afrikaans | Ready |
| SONG-003 | Brood van Lewe | M-Wis | Afrikaans Gospel Ballad | Afrikaans | Ready |
| SONG-004 | Dina van District 6 | M-Wis | Cape Folk | Afrikaans | Ready |
| SONG-005 | Good Woman | M-Wis | Adult Contemporary | English | Ready |
| SONG-007 | Kurara Easy | M-Wis | Afrobeats | Other | Ready |
| SONG-008 | Living Bread | M-Wis | Christian Contemporary / CCM | English | Ready |
| SONG-009 | My liefde hou vir 'n leeftyd | M-Wis | Afrikaanse Adult Contemporary | Afrikaans | Ready |
| SONG-010 | My Wife My Life | M-Wis | Adult Contemporary | English | Ready |
| SONG-011 | Ocean Between Us | M-Wis | Adult Contemporary | English | Ready |
| SONG-012 | Ons Twee Verdwaal | M-Wis | Afrikaanse Adult Contemporary | English | Ready |
| SONG-013 | Re Bina Bosigo | M-Wis | Afrobeats | Other | Ready |
| SONG-014 | Strobe Waistline | M-Wis | Trap | English | Ready |
| SONG-015 | Tomorrow Land | M-Wis | Dance / EDM | English | Ready |
| SONG-016 | Voel Weer | M-Wis | Afrikaanse Adult Contemporary | Afrikaans | Ready |
| SONG-017 | You're Still Here | M-Wis | Adult Contemporary | English | Ready |
| SONG-018 | Always be your child | M-Wis | Adult Contemporary | English | Ready |
| SONG-019 | Daar Kom die Alibaba | M-Wis | Cape Folk | Afrikaans | Ready |
| SONG-020 | Draai Soe | M-Wis | Cape Folk | Afrikaans | Ready |
| SONG-021 | Hier Is Ons | M-Wis | Afrikaanse Adult Contemporary | Afrikaans | Ready |
| SONG-022 | Kalahari High | M-Wis | Inspirational | Afrikaans / English | Ready |
| SONG-023 | Lei Ons Terug Na U, Jesus | M-Wis | Afrikaans Gospel Ballad | Afrikaans | Ready |
| SONG-024 | Mirror Noise | M-Wis | Pop | English | Ready |
| SONG-025 | My Love will last for a Lifetime | M-Wis | Adult Contemporary | English | Ready |
| SONG-026 | Ngingasula Okwanamuhla | M-Wis | Adult Contemporary | Other | Ready |
| SONG-027 | Ons is nooit Alleen nie | M-Wis | Afrikaans Gospel Ballad | Afrikaans | Ready |
| SONG-028 | Peacock Blue Die Griquas | M-Wis | Adult Contemporary | Afrikaans / English | Ready |
| SONG-029 | Re Teng Ga Nyele | M-Wis | Inspirational | Other | Ready |
| SONG-030 | Saltwater Eyes | M-Wis | Adult Contemporary | English | Ready |
| SONG-031 | The Y - Kimberley | M-Wis | House | English | Ready |
| SONG-032 | Growing Up at the Crossroads | Huey D | Hip-Hop | English | Ready |
| SONG-033 | Huey-D French Inspired | Huey D | Hip-Hop | English | Ready |
| SONG-034 | South side Rhythm | Huey D | Hip-Hop | English | Ready |
| SONG-035 | Windsor Knot | Huey D | Hip-Hop | English | Ready |

Excluded duplicate/review song:

| Song ID | Title | Artist | Genre | Language | Reason |
| --- | --- | --- | --- | --- | --- |
| SONG-006 | Its Time to Move On | M-Wis | Adult Contemporary | English | Possible duplicate of existing Sentry Sound work `Its Time to`. |

## Proposed Payloads

The following payloads are proposed only. They must not be executed until approved.

| Song ID | Create payload | Optional profile payload |
| --- | --- | --- |
| SONG-001 | `{"work_title":"Afrika Borwa","genre":"House","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-001; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-002 | `{"work_title":"As ek vannag kon uitvee","genre":"Afrikaanse Adult Contemporary","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"Afrikaans","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-002; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-003 | `{"work_title":"Brood van Lewe","genre":"Afrikaans Gospel Ballad","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"Afrikaans","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-003; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-004 | `{"work_title":"Dina van District 6","genre":"Cape Folk","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"Afrikaans","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-004; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-005 | `{"work_title":"Good Woman","genre":"Adult Contemporary","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-005; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-007 | `{"work_title":"Kurara Easy","genre":"Afrobeats","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"Other","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-007; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-008 | `{"work_title":"Living Bread","genre":"Christian Contemporary / CCM","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-008; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-009 | `{"work_title":"My liefde hou vir 'n leeftyd","genre":"Afrikaanse Adult Contemporary","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"Afrikaans","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-009; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-010 | `{"work_title":"My Wife My Life","genre":"Adult Contemporary","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-010; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-011 | `{"work_title":"Ocean Between Us","genre":"Adult Contemporary","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-011; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-012 | `{"work_title":"Ons Twee Verdwaal","genre":"Afrikaanse Adult Contemporary","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-012; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-013 | `{"work_title":"Re Bina Bosigo","genre":"Afrobeats","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"Other","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-013; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-014 | `{"work_title":"Strobe Waistline","genre":"Trap","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-014; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-015 | `{"work_title":"Tomorrow Land","genre":"Dance / EDM","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-015; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-016 | `{"work_title":"Voel Weer","genre":"Afrikaanse Adult Contemporary","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"Afrikaans","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-016; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-017 | `{"work_title":"You're Still Here","genre":"Adult Contemporary","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-017; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-018 | `{"work_title":"Always be your child","genre":"Adult Contemporary","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-018; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-019 | `{"work_title":"Daar Kom die Alibaba","genre":"Cape Folk","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"Afrikaans","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-019; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-020 | `{"work_title":"Draai Soe","genre":"Cape Folk","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"Afrikaans","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-020; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-021 | `{"work_title":"Hier Is Ons","genre":"Afrikaanse Adult Contemporary","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"Afrikaans","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-021; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-022 | `{"work_title":"Kalahari High","genre":"Inspirational","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"Afrikaans / English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-022; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-023 | `{"work_title":"Lei Ons Terug Na U, Jesus","genre":"Afrikaans Gospel Ballad","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"Afrikaans","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-023; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-024 | `{"work_title":"Mirror Noise","genre":"Pop","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-024; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-025 | `{"work_title":"My Love will last for a Lifetime","genre":"Adult Contemporary","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-025; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-026 | `{"work_title":"Ngingasula Okwanamuhla","genre":"Adult Contemporary","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"Other","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-026; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-027 | `{"work_title":"Ons is nooit Alleen nie","genre":"Afrikaans Gospel Ballad","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"Afrikaans","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-027; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-028 | `{"work_title":"Peacock Blue Die Griquas","genre":"Adult Contemporary","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"Afrikaans / English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-028; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-029 | `{"work_title":"Re Teng Ga Nyele","genre":"Inspirational","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"Other","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-029; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-030 | `{"work_title":"Saltwater Eyes","genre":"Adult Contemporary","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-030; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-031 | `{"work_title":"The Y - Kimberley","genre":"House","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-031; Artist: M-Wis; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-032 | `{"work_title":"Growing Up at the Crossroads","genre":"Hip-Hop","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-032; Artist: Huey D; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-033 | `{"work_title":"Huey-D French Inspired","genre":"Hip-Hop","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-033; Artist: Huey D; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-034 | `{"work_title":"South side Rhythm","genre":"Hip-Hop","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-034; Artist: Huey D; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |
| SONG-035 | `{"work_title":"Windsor Knot","genre":"Hip-Hop","mood":"","copyright_status":"draft","registration_status":"draft","contributors":[]}` | `{"language":"English","inspiration_reference_notes":"Chronicle intake source: song_metadata_genre_artist_dropdowns.xlsx; Song ID: SONG-035; Artist: Huey D; Chronicle status: Ready; contributor/owner/identifier fields deferred."}` |

## Duplicate Protection Strategy

Before execution:

1. Run a read-only duplicate preflight scoped to the authenticated workspace.
2. Normalize candidate and existing titles by lowercasing and removing punctuation.
3. Block exact normalized matches.
4. Flag fuzzy matches where one normalized title contains the other and the shorter title is at least eight characters.
5. Keep `Its Time to Move On` excluded until manually reviewed.

During execution:

- Create one work at a time.
- After each successful create, record returned `work_id` and `asset_id` in the execution log.
- Before creating the next work, continue duplicate checks against the latest backend state.
- Do not retry blindly after a network or route error.

After execution:

- Query created works by returned IDs.
- Verify no contributor rows were created.
- Verify work titles, genres, draft statuses, workspace ID, and created-by user context.

## Rollback And Recovery Strategy

Preferred recovery:

- Keep a generated execution receipt with `Song ID`, `work_id`, `asset_id`, request payload, response, and timestamp.
- If a work was created incorrectly, use an approved manual rollback SQL/delete plan by returned IDs only.
- Do not delete by title.
- Do not use broad destructive commands.
- Do not overwrite existing works.

Partial failure handling:

- Stop immediately on first failed create or failed profile update.
- Keep already-created works as backend records until an explicit rollback is approved.
- Use the execution receipt to decide whether to continue, retry a single failed item, or rollback specific created IDs.

Profile PATCH failure handling:

- If create succeeds but profile PATCH fails, do not recreate the work.
- Record the `work_id`.
- Retry only the profile PATCH for that specific `work_id` after diagnosis.

## Test Command And Check Plan

No test command in this section writes data unless explicitly marked as execution.

Read-only preflight checks:

```powershell
npx.cmd tsx -e "import 'dotenv/config'; import { Client } from 'pg'; async function main(){ const c=new Client({connectionString:process.env.DATABASE_URL}); await c.connect(); const r=await c.query('select id, work_title, genre, mood, registration_status, copyright_status, workspace_id, created_at from public.musical_works order by created_at desc limit 500'); console.log(JSON.stringify(r.rows, null, 2)); await c.end(); } main().catch((e)=>{ console.error(e); process.exit(1); });"
```

Contract validation dry run:

```powershell
npx.cmd tsx -e "import { validateCreateSongInput } from './src/lib/registration/contracts/create-song-contract'; const payload={work_title:'Afrika Borwa',genre:'House',mood:'',copyright_status:'draft',registration_status:'draft',contributors:[]}; console.log(validateCreateSongInput(payload));"
```

Post-execution verification query, after approval and import only:

```sql
select
  mw.id,
  mw.work_title,
  mw.genre,
  mw.mood,
  mw.registration_status,
  mw.copyright_status,
  mw.workspace_id,
  count(wc.id) as contributor_count
from public.musical_works mw
left join public.work_contributors wc
  on wc.work_id = mw.id
where mw.id = any($1::uuid[])
group by mw.id
order by mw.work_title;
```

Expected post-execution result:

- 34 new work rows, if all candidates are approved and executed
- `registration_status = draft`
- `copyright_status = draft`
- `contributor_count = 0`
- all rows scoped to the authenticated workspace

## Workspace And User Scope Confirmation

The target backend flow remains workspace/user scoped.

`POST /api/songs/create` calls `getAuthenticatedWorkspaceContext()` and passes:

- `workspace_id`
- `created_by_user_id`

The create service sends those values into `rpc_create_song_with_contributors`.

The RPC writes workspace and created-by context onto:

- `assets`
- `musical_works`
- `contributors`, if contributors are supplied
- `work_contributors`, if contributors are supplied

For this plan, contributors are not supplied, so only `assets` and `musical_works` should be created.

## Execution Boundary

This plan is not authorization to import.

Before execution, the user must explicitly approve:

- the 34-song candidate list
- duplicate exclusion of `Its Time to Move On`
- foundation-only payloads
- whether optional profile PATCH should be included
- whether source reference notes are acceptable without a structured metadata envelope

