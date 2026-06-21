# Sentry Sound Master / Recording Model V1

Date: 2026-06-04

Status: doctrine and authority definition only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

Master / Recording is the sound recording identity layer in Sentry Sound.

Work is the composition/song identity. Master / Recording is the captured sound performance or production embodiment of one or more Works. A Work may have zero, one, or many Masters. A Master should point back to one or more Works where applicable.

Master / Recording is needed before Sentry Sound can safely reason about:

- ISRC placement
- master ownership
- producer and performer participation
- release track identity
- commercial audio readiness
- distribution authority
- master-side royalties
- neighboring rights
- recording evidence

Immediate doctrine lock:

- Work is the composition/song identity.
- Master / Recording is the sound recording identity.
- ISWC belongs to Work identifier governance.
- ISRC belongs to Master / Recording identifier governance.
- Audio files are not automatically Masters.
- Demo audio is not automatically a commercial Master.
- Release tracks should ultimately link to Master / Recording and Work distinctly.
- Master ownership must be represented through Rights Interest, not through artist name or file ownership alone.
- Distribution consumes Release/Master truth; it should not create Master truth.
- Royalty Events must distinguish composition-side and master-side entitlement.

Current platform reality:

- `musical_works` is the active Work seed.
- Prisma `Recording` and `RecordingPerformer` exist as older/parallel models.
- `recording_contributors` exists in migration history.
- `release_tracks` has `musical_work_id`, `sound_recording_id`, and `isrc` fields.
- File Vault supports `master_audio` as a file category.
- There is no active canonical Master / Recording model in the current Works UX.

This document does not create the missing model. It defines the doctrine future work must respect.

## 2. Recommended Master / Recording Model

Conceptual model:

```text
Master / Recording
  sound recording identity
  linked Work(s)
  recording title / version
  performer and producer participation
  ISRC when governed
  recording date/session/version context
  linked audio files
  master-side Rights Interests
  release-track usage
  registration/distribution/royalty context
```

Master / Recording should answer:

- what sound recording is this?
- which Work or Works does it embody?
- is this a demo, mix, master, alternate version, live version, remix, or commercial master?
- who performed, produced, engineered, or otherwise participated?
- which audio file represents the current approved recording?
- is an ISRC assigned?
- who owns or controls the master?
- is the recording ready for release/distribution?
- which releases and distribution relationships use it?
- which master-side rights and royalty rules apply?

## 3. What Is A Master / Recording?

A Master / Recording is the recorded sound identity, not the composition itself and not merely a file.

It can represent:

- final commercial master
- alternate version
- radio edit
- remix
- live recording
- acoustic version
- demo recording where intentionally modeled
- instrumental recording
- vocal recording
- remaster
- territory/platform-specific recording version where governed

Master / Recording is the authority layer for recording identity. Audio files may support it, but the file is not the identity by itself.

## 4. Work / Master Boundary Rules

Work owns:

- composition/song identity
- title and work metadata
- ISWC when governed
- composition-side contributor participation
- composition/publishing registration context
- composition/publishing Rights Interests

Master / Recording owns:

- sound recording identity
- ISRC when governed
- recording/version identity
- performer/producer/master-side participation
- master-side rights context
- current approved audio/master relationship
- master-side release/distribution/royalty implications

Rules:

- A Work may exist without a Master.
- A Work may have many Masters.
- A Master may embody one or more Works where applicable.
- Do not collapse Work and Master into a generic song record.
- Do not put ISRC authority on Work.
- Do not put ISWC authority on Master.
- Current `musical_works` remains the active Work seed and must not be renamed now.

Chronicle reference:

The M-Wis and Huey D catalogues may contain many Works. Some Works may not yet have approved commercial Masters. That is valid and should not block Work-level catalogue authority.

## 5. Identifier Rules: ISWC vs ISRC

ISWC:

- belongs to Work identifier governance
- identifies the composition/work
- should not be treated as sound recording identity

ISRC:

- belongs to Master / Recording identifier governance
- identifies a sound recording
- should not be treated as composition/work identity

Rules:

- Chronicle workbook ISRC values must not be imported onto Work as authoritative recording identifiers.
- Release-track `isrc` can be useful transitional data, but long-term ISRC authority belongs to Master / Recording.
- Identifier values require source, verification, issuing context, and entity placement.
- Missing ISRC does not mean no Work exists.
- Missing ISWC does not mean no Master exists.

## 6. Audio File vs Master Distinction

Audio file is a stored or referenced media file.

Master / Recording is the recording identity.

Rules:

- Audio files are not automatically Masters.
- Demo audio is not automatically a commercial Master.
- A rough mix is not automatically an approved release master.
- A mastered WAV file may support a Master, but the platform still needs an explicit recording identity and approval state.
- File ownership does not prove master ownership.
- Storage location does not prove release readiness.
- Audio metadata extraction must not create legal recording authority by itself.

Current mapping:

- `file_vault_items.file_category = master_audio` is a file category, not final recording authority.
- Song Capture V2 references to final audio, mix/master files, and demo audio are workflow/supporting-material concepts until a Master / Recording model is approved.

Chronicle reference:

Some Chronicle songs may have demo recordings or final audio files later. Those files should not automatically become release Masters unless reviewed and promoted through a governed Master / Recording process.

## 7. Master vs Release

Release is commercial packaging.

Master / Recording is sound recording identity.

Rules:

- A release may contain one or more release tracks.
- A release track should ultimately link to both Work and Master / Recording distinctly where applicable.
- Release metadata should not create Master truth.
- Release scheduling should not create Master ownership.
- Release may reference a recording version, but the Master / Recording record should own recording identity and ISRC.
- Release readiness should consume Master readiness, not invent it.

Current platform mapping:

- `release_tracks.musical_work_id` and `release_tracks.sound_recording_id` already point in the right conceptual direction.
- `release_tracks.isrc` is transitional until recording identifier governance is locked.

## 8. Master vs Artist Brand

Artist Brand is public-facing creative/commercial identity.

Master / Recording is sound recording identity.

Rules:

- Artist brand visibility is not master ownership.
- M-Wis or Huey D can be presented as artist brands on a recording or release without owning the master.
- A Master may feature multiple artist brands.
- A Party may own/control the master while an Artist Brand appears publicly.
- Public artist metadata must not be used as proof of master ownership.

Chronicle reference:

M-Wis may be the artist brand for a recording, while Chronicle Music or another Party may own/administer the Master only if Rights Interest supports that authority.

## 9. Master vs Contributor

Contributor is participant identity.

Master / Recording is sound recording identity.

Rules:

- Producer, performer, engineer, session musician, and vocalist participation does not automatically create master ownership.
- Recording participants may need separate recording contributor relationships from work contributor relationships.
- Composition-side contributor splits must not be used as master-side splits.
- Performer participation may inform neighboring rights or royalty review, but it is not itself ownership authority.
- Master ownership and participation should be governed through Rights Interest and master-specific contributor/participant context.

Current platform mapping:

- `recording_contributors` and Prisma `RecordingPerformer` are transitional seeds for recording-side participation.
- `work_contributors` is composition/work-side and should not be stretched into master-side authority.

## 10. Master vs Rights Interest

Rights Interest is ownership/control/admin authority.

Master / Recording is the subject of master-side rights.

Rules:

- Master ownership must be represented through Rights Interest.
- Master ownership must not be inferred from artist name, contributor name, file uploader, file owner, workspace owner, release creator, or distributor reference.
- Rights Interest should define master ownership/control, territory, effective dates, verification state, and authority scope.
- A Master can have multiple Rights Interests.
- A Party can own, administer, license, distribute, or collect on master-side rights depending on Rights Interest and contract support.

Chronicle reference:

Chronicle Music may own or administer Masters only where a Rights Interest or mandate supports it. The Chronicle workbook `Master Owner` field is review context, not authority.

## 11. Master vs Registration

Registration consumes Master / Recording truth where recording registration is relevant.

Rules:

- Registration should not create Master truth.
- Registration should consume Master identity, ISRC, Party, Rights Interest, evidence, and participant context.
- Work registration and recording/master registration must remain distinct.
- Recording registration may require performer, producer, label, master owner, ISRC, evidence, and neighboring-rights context.
- Submission queue records are operational jobs, not Master identity.

## 12. Master vs Distribution

Distribution consumes Release/Master truth.

Rules:

- Distribution should not create Master truth.
- Distributor or platform references should not become Master identity.
- Delivery status does not prove recording ownership.
- Takedowns and territory delivery should respect Release, Master, Rights Interest, and Contract scope.
- Distribution reports may inform royalty events but do not retroactively create Master identity.

## 13. Master vs Royalty Event

Royalty Event is revenue, usage, statement, or settlement-triggering activity.

Master / Recording is one possible source subject for royalty entitlement.

Rules:

- Royalty Events must distinguish composition-side and master-side entitlement.
- Work contributor splits should not drive master-side royalties.
- Master-side royalties should derive from verified Master Rights Interests, contracts, distribution reports, and payee identity.
- A performer royalty, neighboring right, label royalty, distributor royalty, or master owner payment may involve different Parties from composition royalties.
- Royalty ledger outputs must remain downstream of rights authority.

## 14. Relationship To Party

Party is legal/commercial identity.

Master / Recording may relate to Party as:

- master owner
- label
- producer company
- performer legal identity
- distributor
- administrator
- licensor
- licensee
- payee
- society/regulator member

Rules:

- Party identity should be explicit where master authority, payment, registration, contract, or distribution depends on it.
- Artist Brand is not a substitute for Party.
- Workspace User is not a substitute for Party.

## 15. Chronicle Reference Cases

These examples clarify doctrine only. They do not create Chronicle-specific logic.

### M-Wis Catalogue

The M-Wis catalogue may have many Works. Some Works may not yet have Masters. Some may have demo audio. Some may later have release-ready Masters.

Doctrine:

- Work existence is valid without Master.
- Demo audio is supporting material unless promoted.
- M-Wis artist visibility does not prove master ownership.

### Huey D Catalogue

Huey D may be an Artist Brand on Works and future Masters.

Doctrine:

- Huey D brand identity should not collapse into Party, Contributor, or master owner.
- Master-side participation and ownership require separate review.

### Chronicle Music Master Authority

Chronicle Music may own or administer Masters only where Rights Interest supports it.

Doctrine:

- company/reference tenant status does not automatically create master ownership
- workbook owner fields are intake context
- release/distribution authority must consume verified rights

## 16. Conflicts Discovered

Doctrine conflicts and tensions:

- Prisma `Recording` exists, but no active canonical Master / Recording model is used by the current Works UX.
- `recording_contributors` exists, but recording-side participation is not currently integrated into the active Work detail flow.
- `release_tracks.isrc` exists, but long-term ISRC authority belongs to Master / Recording, not release track metadata alone.
- File Vault has `master_audio`, but a file category is not Master identity.
- Song Capture V2 discussions include demo/final audio, but final audio workflow is not yet a governed Master / Recording model.
- Chronicle import correctly deferred ISRC and master owner fields, so Master authority remains intentionally incomplete.

These are alignment gaps, not implementation defects.

## 17. Transitional Concepts Identified

Transitional concepts:

- Prisma `Recording`
- Prisma `RecordingPerformer`
- `recording_contributors`
- `release_tracks.sound_recording_id`
- `release_tracks.isrc`
- `file_vault_items.file_category = master_audio`
- Song Capture V2 demo/mix/master/final audio references
- Chronicle workbook `ISRC` and `Master Owner`
- old recording readiness/evidence/audit models
- audio file metadata and extracted tags

These should remain stable until controlled Master / Recording design and migration work is approved.

## 18. What Must Not Change Yet

Do not change yet:

- do not create a Master / Recording schema
- do not migrate Prisma `Recording`
- do not migrate `recording_contributors`
- do not change release tracks
- do not move ISRC fields
- do not import Chronicle ISRC values
- do not import Chronicle master owner fields
- do not treat audio files as Masters
- do not treat demo audio as commercial Masters
- do not infer master ownership from artist brand, contributor, workspace, file, release, or distribution records
- do not change royalty logic
- do not change registration logic
- do not change UI or Song Capture V2

## 19. Future Refactor Principles

Future Master / Recording work must:

- define Work vs Master boundary before storage
- define ISRC governance before identifier import
- preserve Party, Artist Brand, Contributor, and Rights Interest distinctions
- separate file storage from recording identity
- distinguish demo, mix, master, and commercial release master states
- keep release tracks linked to Work and Master distinctly
- keep distribution downstream of release/master truth
- keep royalty events split between composition-side and master-side entitlement
- use Rights Interest for master ownership/control
- require read-only audits before promoting audio files or workbook values
- avoid Chronicle-specific platform logic

## 20. Next Recommended Doctrine Artifact

Next artifact:

```text
docs/platform/SENTRY-SOUND-REGISTRATION-AUTHORITY-MODEL-V1.md
```

Purpose:

- define registration as a downstream authority/verification workflow
- clarify what registration consumes from Work, Master, Party, Rights Interest, Evidence, and identifiers
- define why registration does not create ownership truth
- distinguish work registration, recording/master registration, society registration, copyright registration, and submission queue operations

Do not start implementation from this Master / Recording model. The next step is doctrine only.

