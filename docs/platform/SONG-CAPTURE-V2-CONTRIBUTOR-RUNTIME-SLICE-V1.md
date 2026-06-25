# Song Capture V2 Contributor Runtime Slice V1

## Purpose

This slice wires the Song Capture V2 Contributors stage to the existing contributor tables after the song foundation has been saved.

The goal is practical workflow continuity: a user can create the song foundation, add contributors and shares, save them separately, and unlock Files & Assets only after the contributor split is reviewed.

## Existing Structures Reused

- `contributors`
- `work_contributors`
- Existing song creation contributor pattern from `POST /api/songs/create`
- Existing work detail read model contributor shape
- Existing workspace authentication context

No new contributor table or parallel contributor system was introduced.

## Runtime Behavior

After Song Foundation save returns a `workId`, the Contributors section unlocks.

The user can:
- add contributor rows
- edit contributor name, role, split type, share percentage, and optional IPI / ID
- save contributors separately from the song foundation
- mark contributors reviewed only when the saved split total equals 100%

Files & Assets remain locked until contributors are reviewed.

## Route Added

`GET /api/works/[workId]/contributors`

Returns contributor rows for the existing work from `work_contributors` joined to `contributors`.

`PUT /api/works/[workId]/contributors`

Replaces the work-scoped contributor rows for the selected work inside the authenticated workspace. The route:
- verifies the work belongs to the workspace
- validates contributor rows
- validates split total equals 100%
- creates missing `contributors` rows by name when needed
- stores optional IPI / ID in contributor metadata
- writes `work_contributors` rows for the work

## Split Validation

V1 uses the same practical rule as the existing create-song contract: when contributors are supplied, their split total must equal `100%`.

If the split total is not 100%, the UI shows a warning and the route refuses to persist the contributor review state.

## Deferred

- Contributor invitations
- Contributor approval/signature workflow
- Rights-owner relationship modeling
- Royalty calculations
- Publishing registration automation
- Contributor-to-artist identity resolution
- Files & Assets upload/storage

## Notes

The route intentionally saves contributors as a work-scoped operational slice. It does not claim this is the final rights, royalty, or registration model.
