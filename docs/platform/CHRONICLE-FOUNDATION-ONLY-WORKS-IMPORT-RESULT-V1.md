# Chronicle Foundation-Only Works Import Result V1

Date: 2026-06-04

Status: completed controlled migration.

## Scope

Imported all 35 populated Chronicle Music catalogue records as foundation-only draft works.

Source workbook:

```text
C:\Users\Euan Smith\Desktop\CHRONICLE MUSIC PUBLISHING\17_Marketing_Press\Website\public\catalogue\covers\song_metadata_genre_artist_dropdowns.xlsx
```

Execution path:

- Existing backend RPC used by `POST /api/songs/create`: `public.rpc_create_song_with_contributors`
- Workspace: `Sentry Sound Demo Workspace`
- Workspace ID: `5602498c-3eb5-4426-9480-8a03976c4437`
- Created-by user ID: `user_3DQnYZkfBaZnStBoMogTVTC6CAy`

## Import Totals

| Metric | Count |
| --- | ---: |
| Songs processed | 35 |
| Works created | 35 |
| Skipped | 0 |
| Failed | 0 |

## Created Works

| Song ID | Title | Genre | Work ID | Asset ID |
| --- | --- | --- | --- | --- |
| SONG-001 | Afrika Borwa | House | `1422c0e6-6f5a-45f4-a1a3-fcbd711d8068` | `629d121f-364b-4139-8ad6-f89d10e7d33b` |
| SONG-002 | As ek vannag kon uitvee | Afrikaanse Adult Contemporary | `6458c62d-943d-4b63-9a8e-c69054ad88b4` | `10946dfa-c624-4fee-86bf-7679b47eba5b` |
| SONG-003 | Brood van Lewe | Afrikaans Gospel Ballad | `69c0b3e3-a090-48ef-bd5d-7cee371237cc` | `d1723bb1-8075-47bf-b0df-fd96da350411` |
| SONG-004 | Dina van District 6 | Cape Folk | `a5270f55-7e2f-41d1-a767-02ec9a29ceba` | `a2fc5853-89e4-4acb-95d7-b6456259ba69` |
| SONG-005 | Good Woman | Adult Contemporary | `d4e6d8fc-71ff-45c8-8aea-c322eaa27425` | `96702999-1aa4-4eed-9c86-fec891e846ce` |
| SONG-006 | Its Time to Move On | Adult Contemporary | `436f21c4-8830-4586-984f-b40ca9318b2d` | `2e0ffbcd-2241-438f-9c71-c93f29af103e` |
| SONG-007 | Kurara Easy | Afrobeats | `dfafea32-aae8-45ca-ae65-3ef71fa99b31` | `c5301b95-58aa-4ea1-bf26-38a3e900b57d` |
| SONG-008 | Living Bread | Christian Contemporary / CCM | `56d024b9-117b-4986-bcf3-d174b69ea873` | `efeac958-e305-4c7c-a9d7-88ea5c548bb9` |
| SONG-009 | My liefde hou vir 'n leeftyd | Afrikaanse Adult Contemporary | `39c5fd21-6675-4b44-b1a0-9918b31cf5c2` | `b003ebd8-9894-4f28-b76f-9fcb9aa59f7c` |
| SONG-010 | My Wife My Life | Adult Contemporary | `b51ca63d-1548-460f-a62c-db57b19bf982` | `b6c053be-ca02-485c-8572-9163eaa6d05a` |
| SONG-011 | Ocean Between Us | Adult Contemporary | `fb1813ec-79fc-4c09-a1fc-8bbd12f93f9b` | `af8eff97-5c05-44f6-946d-84754856600d` |
| SONG-012 | Ons Twee Verdwaal | Afrikaanse Adult Contemporary | `a96926fa-65f1-448a-9355-de789f72e256` | `5d551f92-3291-41f9-a803-3cc6c3aa5fdd` |
| SONG-013 | Re Bina Bosigo | Afrobeats | `13410a9e-a98c-4b51-817e-a4c48cbb02f5` | `fa4a8af8-ffc4-4512-adc9-9a6e2c3e6235` |
| SONG-014 | Strobe Waistline | Trap | `62dc3250-9f7b-4dfd-9414-71a607e50e07` | `eed01719-72b1-4c48-8cfc-454f0e93c917` |
| SONG-015 | Tomorrow Land | Dance / EDM | `a918f6bf-3bc6-475d-acf3-81f16018f711` | `6c31b616-fe5b-4182-8b3e-ec67b03ecdc9` |
| SONG-016 | Voel Weer | Afrikaanse Adult Contemporary | `b4a10904-d871-412a-932e-c5846d8a029c` | `64905d0d-ff3d-4b30-9edb-ae7c0b5b0f00` |
| SONG-017 | You're Still Here | Adult Contemporary | `30805c3b-bee2-4cff-b300-2f00e9c8ca98` | `ff20531f-5bce-42f6-9830-225ea98e2c8d` |
| SONG-018 | Always be your child | Adult Contemporary | `98a3503f-0ac5-4619-b88f-84dbbb25ce99` | `9c024693-94f5-46b4-ad27-fc70c7a7da69` |
| SONG-019 | Daar Kom die Alibaba | Cape Folk | `cf29cc51-3f92-49eb-8010-dd40de807be0` | `46645d39-77b9-4c82-8ba3-79bf9e27c7be` |
| SONG-020 | Draai Soe | Cape Folk | `6ed2ab49-c54b-4c11-9ce1-f5bd28bae04e` | `a20ab897-82a8-4cc6-99b6-401ad238d989` |
| SONG-021 | Hier Is Ons | Afrikaanse Adult Contemporary | `172bd3ea-b6c3-47d7-ac4b-5918717410f1` | `b2c91d0a-ce19-4f22-9ca7-71dad978106f` |
| SONG-022 | Kalahari High | Inspirational | `3e02663d-fe7b-42f3-9454-d693ddd69c6d` | `9c5bf8b0-399a-4505-b59b-f07debd9d378` |
| SONG-023 | Lei Ons Terug Na U, Jesus | Afrikaans Gospel Ballad | `3e0878a7-8536-44cc-8b51-f728c94bf825` | `fcc31d96-2b34-4d3e-ac0b-210548c76c21` |
| SONG-024 | Mirror Noise | Pop | `27a50a17-86af-4e74-8ba1-d8f6e00c186c` | `8cd2f54a-f031-4b07-92df-522b88f9d7e8` |
| SONG-025 | My Love will last for a Lifetime | Adult Contemporary | `c32207f8-bdce-4171-b841-1da1841fc4a6` | `896edd3a-b085-426a-b7bf-653aea7ea522` |
| SONG-026 | Ngingasula Okwanamuhla | Adult Contemporary | `650f70c0-99c6-4001-8968-cdfef8134f2c` | `20dea46d-867d-40f0-aba5-d4d75d49a79c` |
| SONG-027 | Ons is nooit Alleen nie | Afrikaans Gospel Ballad | `3a177c39-68d9-4fa3-b451-1ea680b239fc` | `f04f6f07-3bae-4740-ad5c-ec702c642cb7` |
| SONG-028 | Peacock Blue Die Griquas | Adult Contemporary | `16c205cb-a844-4484-a12f-5c6c74822610` | `7b9a3a61-b09d-4896-94aa-9032bec1382a` |
| SONG-029 | Re Teng Ga Nyele | Inspirational | `425d472a-0990-473a-bcd2-5859d5461d4f` | `77377fd6-9752-4c89-a0e4-95444065fba5` |
| SONG-030 | Saltwater Eyes | Adult Contemporary | `d2c3d60d-4db4-4bdd-a2c1-ee55a6a364c0` | `b64cc16d-f748-4897-85b7-c28e1d759a3c` |
| SONG-031 | The Y - Kimberley | House | `ae4d287b-499c-46b1-97e3-086534496986` | `658eb1d5-815c-473b-9c7f-8d7444d68f08` |
| SONG-032 | Growing Up at the Crossroads | Hip-Hop | `7cf6dc03-4765-43de-bc1b-ad1e3f7e942b` | `47604055-c3bb-4127-8a77-77943960ab20` |
| SONG-033 | Huey-D French Inspired | Hip-Hop | `bb4aedd9-ba34-4888-993b-8dd120419cc7` | `9bf9986a-1f34-4a87-b659-bee33613b6e0` |
| SONG-034 | South side Rhythm | Hip-Hop | `3ba73cab-ab2c-4868-a922-afe84b342640` | `b59a852f-d366-4c12-be46-4ef9757688f1` |
| SONG-035 | Windsor Knot | Hip-Hop | `abc04285-c407-4bce-8fd7-7e25717975c0` | `e7911cb2-5b25-48a1-9d6d-006f9a3e8a18` |

## Verification

Post-import verification confirmed:

- All 35 created records are scoped to workspace `5602498c-3eb5-4426-9480-8a03976c4437`.
- All 35 created records are attributed to user `user_3DQnYZkfBaZnStBoMogTVTC6CAy`.
- All 35 created records have `registration_status = draft`.
- All 35 created records have `copyright_status = draft`.
- All 35 created records have empty `mood` values because the workbook `Mood / Theme` field was blank.
- All 35 created records have `contributor_count = 0`.

## Conflicts

No database constraint conflicts occurred.

Previous duplicate detection for `Its Time to Move On` was informational only. The record was imported as instructed because existing catalogue records in the environment are considered test/non-authoritative for this workspace seed.

## Deferred Data

The following Chronicle fields were not imported:

- contributors
- ownership splits
- ISRC
- ISWC
- master owner
- publishing owner
- release data
- rights administration data
- registration identifiers

These remain deferred for future contributor/split, rights, registration, recording, release, and identifier migration passes.

## Source Of Truth Confirmation

The imported Chronicle foundation catalogue now lives in the Sentry Sound backend.

Sentry Sound backend is the authoritative source of truth for these imported foundation work records.

The Chronicle workbook remains an intake/source artifact only and is not an operational system, database, synchronization owner, or ongoing source of truth.

