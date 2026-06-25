# Sentry Sound Master / Recording Seed Read Model V1

Date: 2026-06-05

Status: design and Master / Recording seed read-model interpretation only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, or database write is created by this document.

## 1. Executive Summary

Master / Recording represents sound recording identity.

It is not automatically a Work, Rights Interest, Registration Authority, Release, Distribution Relationship, Royalty Authority, audio file, or artist-brand presentation.

The current platform already contains several Master / Recording seeds:

```text
Prisma Recording / RecordingPerformer
recording_contributors
release_tracks.sound_recording_id
release_tracks.isrc
file_vault_items.file_category = master_audio
recording readiness / compliance services
registration evidence types for ISRC documentation
```

These seeds are useful and should be protected. They should not be treated as complete canonical Master / Recording authority yet.

Immediate lock:

- Existing recording facts are protected as current platform records or contracts.
- Recording-related references are Master / Recording seeds, not final authority.
- ISRC belongs to Master / Recording identifier governance, but current ISRC references remain transitional until governed.
- Audio files, demo files, release-track references, artist visibility, distribution references, and File Vault ownership do not create Master authority.
- Master ownership must ultimately derive from Rights Interest, not from `masterOwnerName`, artist name, file ownership, release status, or distributor acceptance alone.

## 2. Existing Master Seed Candidates

Current direct recording/model seeds:

- `prisma/schema.prisma` model `Recording`
- `prisma/schema.prisma` model `RecordingPerformer`
- generated Prisma `Recording` model output under `src/generated/prisma/`
- `src/lib/registration/contracts/recording-contract.ts`
- `src/lib/registration/contracts/recording-readiness-contract.ts`

Current contributor/participation seeds:

- `recording_contributors`
- `RecordingPerformer`
- `src/lib/registration/repositories/recording-repository.ts`

Current release-track seeds:

- `release_tracks.sound_recording_id`
- `release_tracks.musical_work_id`
- `release_tracks.isrc`
- `src/lib/releases/addReleaseTrack.ts`

Current File Vault / audio seeds:

- `file_vault_items.file_category = master_audio`
- Work Supporting Materials category `master_audio`
- Work Supporting Materials purpose `audio_reference`
- File Vault links to records through `file_vault_links`

Current registration/readiness/evidence seeds:

- `src/lib/registration/services/evaluate-recording-readiness.ts`
- `src/lib/registration/services/validate-recording.ts`
- `src/lib/registration/services/run-recording-compliance-workflow.ts`
- `src/lib/registration/readiness/registration-readiness-rules.ts`
- `src/lib/registration/evidence/registration-evidence-registry.ts`
- evidence type `isrc_documentation`
- dispute/amendment concepts for `isrc_conflict` and `isrc_correction`

Read-model recommendation:

- Treat these as Master / Recording seeds.
- Protect their captured facts.
- Do not merge them into Work.
- Do not use them as final master ownership or registration authority without future approved rules.

## 3. What Is A Master / Recording Seed?

A Master / Recording Seed is an existing structure that may identify, reference, describe, support, or prepare a sound recording before the canonical Master / Recording authority layer exists.

It may capture:

- recording title
- ISRC as captured
- recording status as captured
- recording date
- studio name
- linked Work reference
- performer/producer/engineer participation
- release-track sound recording reference
- audio-file reference
- master audio file category
- readiness posture
- registration evidence posture
- dispute/amendment context

A seed is not the final recording authority layer.

Read-model rule:

- Seed existence is protected as a current platform fact.
- Recording identity is candidate or transitional until an approved canonical Master / Recording model is active.
- Master ownership remains deferred to Rights Interest authority.

## 4. What Current Structures Represent Recording Identity?

The strongest current recording identity seed is the Prisma `Recording` model.

It contains:

- `id`
- `title`
- `isrc`
- `status`
- `recordingDate`
- `studioName`
- `masterOwnerId`
- `masterOwnerName`
- `linkedMusicalWorkId`
- `documented`
- `disputed`
- `amendmentRequired`
- `readinessScore`
- timestamps

The strongest current recording participation seed is `RecordingPerformer`.

It contains:

- `recordingId`
- `performerId`
- `performerName`
- `role`
- `participationPercentage`
- `confirmed`

The strongest current Supabase release-side recording seed is `release_tracks.sound_recording_id`, supported by `release_tracks.isrc`.

The strongest current file/audio seed is `file_vault_items.file_category = master_audio`, supported by Work Supporting Materials `master_audio` and `audio_reference`.

Important current-state caveat:

- The active Works UI currently centers `musical_works` and supporting materials.
- There is no active canonical Master / Recording surface in the current Works UI.
- Existing recording structures should be read as seeds and transitional foundations, not as a fully activated canonical recording system.

## 5. Protected Recording Truth

The following can be interpreted as protected current recording truth:

- recording record existence, where `Recording` records exist
- recording title as captured
- recording status as captured
- recording date as captured
- studio name as captured
- ISRC value as captured
- linked musical work reference as captured
- documented/disputed/amendment-required flags as captured
- readiness score as captured
- performer/participant rows as captured
- recording contributor rows as captured
- release-track `sound_recording_id` as captured reference
- release-track `isrc` as captured transitional identifier
- File Vault `master_audio` category as captured file classification
- File Vault audio/reference links as captured support/evidence context
- registration evidence/readiness outputs as captured operational posture

Protected does not mean:

- commercial master approved
- ISRC verified
- master ownership verified
- release ready
- distribution authorized
- royalty-bearing entitlement active
- public-safe

## 6. Master vs Work

Work is composition/song identity.

Master / Recording is sound recording identity.

Read-model rules:

- A Work may exist without a Master.
- A Work may have zero, one, or many Masters.
- A Master may embody one or more Works where applicable.
- Work title does not create Master identity.
- Work creation does not create a commercial recording.
- ISWC belongs to Work identifier governance.
- ISRC belongs to Master / Recording identifier governance.

Labels:

- `musical_works` identity: `protected`
- linked Work reference on recording: `candidate`
- recording-as-work assumption: `authority_risk`
- Work import as Master creation: `authority_risk`

## 7. Master vs Contributor

Contributor is participation.

Master / Recording is sound recording identity.

Read-model rules:

- Recording performers, producers, engineers, and recording contributors are participation seeds.
- Recording participation does not prove master ownership.
- Recording participation percentage does not prove master royalty entitlement.
- Contributor confirmation does not create Rights Interest authority.

Labels:

- recording contributor participation: `protected`
- performer/producer/engineer role: `protected`
- participation percentage: `candidate`, `transitional`
- contributor-as-master-owner assumption: `authority_risk`
- contributor-as-master-payee assumption: `authority_risk`

## 8. Master vs Artist Brand

Artist Brand is public creative identity.

Master / Recording is sound recording identity.

Read-model rules:

- Artist visibility does not prove master ownership.
- Artist profile does not prove ISRC authority.
- Artist brand may support public presentation of a recording.
- Artist brand may be linked to a release or recording context, but authority remains separate.

Labels:

- artist-recording presentation link: `candidate`
- artist-as-master-owner assumption: `authority_risk`
- artist-as-ISRC-owner assumption: `authority_risk`
- public artist display: `candidate` until public projection approved

## 9. Master vs Rights Interest

Rights Interest is ownership/control/administration authority.

Master / Recording is sound recording identity.

Read-model rules:

- Master ownership must ultimately be represented through Rights Interest.
- Current `masterOwnerId` and `masterOwnerName` fields are captured claim/context seeds, not final canonical authority.
- Current `rights_assets` may reference `sound_recording` as a rights asset type.
- Rights records may support future master-side ownership, administration, licensing, distribution rights, neighboring rights, and royalty entitlement.

Labels:

- master-side rights claim: `candidate`
- current master owner fields: `candidate`, `transitional`
- master ownership authority: `deferred`
- master owner field as final proof: `authority_risk`

## 10. Master vs Registration

Registration consumes verified Work, Master, Party, Rights Interest, and evidence truth.

Registration does not create Master truth.

Read-model rules:

- ISRC belongs to Master / Recording identifier governance.
- Current ISRC fields are captured identifier values, not ownership proof.
- Registration evidence such as `isrc_documentation` supports readiness/review.
- ISRC conflicts and corrections are registration/identifier governance matters, not ownership authority by themselves.
- Recording readiness can warn/block operational flow, but it does not create master ownership.

Labels:

- ISRC as captured value: `protected`
- ISRC governance: `deferred`
- ISRC documentation: `candidate`
- ISRC-as-owner proof: `authority_risk`
- registration-as-master-creator assumption: `authority_risk`

## 11. Master vs Release

Release is commercial packaging.

Master / Recording is sound recording identity.

Read-model rules:

- `release_tracks.sound_recording_id` is a useful seed.
- `release_tracks.musical_work_id` and `release_tracks.sound_recording_id` point in the right future direction because a release track should distinguish Work and Master.
- `release_tracks.isrc` is transitional until ISRC governance is attached to a canonical Master / Recording layer.
- Release status does not prove Master approval.
- Release title or track title does not create recording identity.

Labels:

- release-track sound recording reference: `candidate`
- release-track ISRC: `transitional`
- release status as Master approval: `authority_risk`
- release as Master owner: `authority_risk`

## 12. Master vs Distribution

Distribution consumes Release and Master truth.

Distribution does not create Master truth.

Read-model rules:

- Distributor acceptance does not prove Master ownership.
- DSP availability does not prove Master ownership.
- Distributor/DSP references do not prove ISRC authority.
- Distribution status may show operational downstream state only.
- Distribution should eventually consume approved Master / Recording and Rights Interest authority.

Labels:

- distribution reference to recording/release: `candidate`
- distribution status as clearance proof: `authority_risk`
- DSP metadata as Master authority: `authority_risk`

## 13. Master vs Royalty Authority

Royalty Authority consumes Work/Master, Rights Interest, Registration, Release, Distribution, Party/payee, and evidence context.

Royalty Authority does not create Master truth.

Read-model rules:

- Master-side royalties require a Master / Recording distinction.
- Composition-side and master-side entitlement must not be collapsed.
- Performer participation does not automatically create master-side royalty entitlement.
- Distributor reporting does not determine Master ownership.
- Royalty events are activity evidence, not recording authority.

Labels:

- master-side royalty context: `deferred`
- performer royalty assumption: `authority_risk`
- distributor payout as master ownership: `authority_risk`
- royalty event as Master proof: `authority_risk`

## 14. Master / Recording Seed Label Classification

### Protected

- existing `Recording` record facts
- existing `RecordingPerformer` facts
- `recording_contributors` rows as captured participation
- `release_tracks.sound_recording_id` as captured reference
- `release_tracks.isrc` as captured transitional identifier
- File Vault `master_audio` classification as captured file category
- Work Supporting Materials `master_audio` and `audio_reference` context
- recording readiness results as captured operational posture
- registration evidence records related to recording/ISRC as captured evidence posture

### Candidate

- future canonical Master / Recording identity
- linked Work-to-recording relationship
- performer/producer/engineer relationships
- release-track-to-master relationship
- audio-file-to-master relationship
- ISRC documentation
- recording readiness status
- master owner fields
- sound recording rights asset references

### Transitional

- older/parallel Prisma `Recording` and `RecordingPerformer` slice before canonical alignment
- `release_tracks.isrc` before identifier governance alignment
- `masterOwnerId` / `masterOwnerName` before Party/Rights Interest authority
- recording participant percentages before royalty authority
- File Vault audio classifications before governed Master promotion

### Deferred

- canonical Master / Recording authority model
- ISRC governance
- master ownership authority
- master-side Rights Interest enforcement
- commercial master approval flow
- recording-to-release readiness enforcement
- recording-to-distribution authorization
- master-side royalty entitlement
- public-safe recording projection

### Non-Authoritative

- free-text recording notes
- workbook ISRC fields
- workbook master owner fields
- audio filename
- storage path
- release-track title
- artist display name
- distributor reference
- DSP reference

### Authority Risk

- audio-file existence treated as Master creation
- demo audio treated as commercial Master
- uploaded audio treated as approved Master
- ISRC treated as ownership proof
- artist visibility treated as master ownership
- contributor participation treated as master ownership
- release-track reference treated as recording authority
- distribution status treated as Master clearance
- File Vault ownership treated as master ownership
- royalty event activity treated as Master authority

## 15. Chronicle Interpretation

Chronicle catalogue imports are valid Work foundation records.

Chronicle read-model rules:

- A Chronicle song may exist as a Work without a Master.
- A Chronicle Work is not automatically a sound recording.
- Demo audio is not automatically a commercial Master.
- Uploaded audio is not automatically a Master.
- A mastered file is not automatically master ownership authority.
- ISRC does not create ownership.
- Distribution does not create Master authority.
- M-Wis and Huey D artist visibility does not prove master ownership.
- Chronicle Music may own or administer a Master only where Rights Interest supports that authority.
- Chronicle workbook fields such as `ISRC`, `Master Owner`, `Producer(s)`, `DSP / Platform Notes`, and general notes remain candidate/non-authoritative review inputs until governed by backend authority.

No Chronicle-specific platform logic should be created from this read model.

## 16. Safe Surfacing Rules

Internal-safe now:

- existing recording title/status/date/studio fields as captured
- existing linked Work reference as captured
- existing performer/contributor participation as captured
- existing ISRC as captured transitional identifier
- existing File Vault `master_audio` classification as file context
- existing release-track recording reference as candidate context
- recording readiness warnings/blockers as operational posture
- authority-risk warnings

Internal-private by default:

- ownership notes
- master owner fields until verified
- private audio files
- contract/evidence materials
- disputes and amendments
- payee/payment context
- unresolved ISRC conflict details

Public-safe by default:

- no Master / Recording authority detail is public-safe by default.

Future public recording presentation should be approved as a separate projection and should avoid exposing private ownership, evidence, file, dispute, payee, or registration context.

## 17. Suggested Future Read-Model Fields

Future implementation may expose fields such as:

```text
recording_seed_id
workspace_id
recording_title
recording_status_label
recording_identity_label
linked_work_label
isrc_label
isrc_governance_label
performer_participation_label
producer_participation_label
master_audio_file_label
release_track_reference_label
rights_interest_dependency_label
registration_dependency_label
release_dependency_label
distribution_dependency_label
royalty_dependency_label
public_safe_label
authority_warnings
```

These are read-model design suggestions only. They are not schema or API requirements.

## 18. Risks Prevented By This Read Model

This read model prevents:

- creating Master authority from Work records
- creating Master authority from uploaded audio
- creating Master authority from demo audio
- treating File Vault `master_audio` as approved commercial Master
- treating ISRC as ownership proof
- treating artist visibility as master ownership
- treating performer participation as royalty entitlement
- treating release-track references as Master approval
- treating distributor/DSP data as recording authority
- collapsing composition-side and master-side royalty logic
- letting Chronicle workbook fields override backend authority

## 19. Future Implementation Gates

Before Master / Recording seeds can drive registration, release, distribution, royalty, or public API behavior, the platform needs approved design for:

- canonical Master / Recording identity
- Work-to-Master relationship rules
- audio-file-to-Master promotion rules
- ISRC governance
- master-side Rights Interest dependency
- performer/producer participation handling
- commercial master approval state
- release-track linkage requirements
- distribution readiness dependency
- master-side royalty entitlement
- public/private recording projections

No implementation should begin from this document alone.

## 20. Recommended Next Read-Model Slice

Recommended next read-model slice:

```text
SENTRY-SOUND-REGISTRATION-IDENTIFIER-READ-MODEL-V1.md
```

Reason:

Registration / Identifier interpretation is the next dependency after Work, Contributor, Party/CRM, Artist Brand, Rights Interest, and Master / Recording. It must safely label ISWC, ISRC, IPI, UPC/EAN, SAMRO, CAPASSO, distributor references, and evidence status before release/distribution or royalty read models rely on them.

