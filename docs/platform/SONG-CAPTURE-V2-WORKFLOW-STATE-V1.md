# Song Capture V2 Workflow State V1

Date: 2026-05-29

## Purpose

Song Capture V2 now behaves as a progressive workflow instead of one large form.

The first practical runtime stage is the song foundation. Contributors, files, and review remain separate stages so later edits to the foundation do not destroy downstream workflow state.

## Workflow Stages

1. Song Foundation
2. Contributors
3. Files & Assets
4. Review & Save

## Foundation Stage

The foundation stage owns the safe fields already wired in Song Capture V2:

- title
- genre
- alternate title
- language
- description / notes
- primary artist profile tag
- release / project grouping tag

When `Save Song Foundation` is clicked:

- if no `workId` exists yet, the page creates the song through `POST /api/songs/create`;
- the page saves profile metadata through `PATCH /api/works/[workId]/profile`;
- the resulting `workId` is stored in page state;
- the page remains on Song Capture V2;
- the foundation is marked saved and contributors unlock.

## Unlock Rules

Before foundation save:

- Contributors are visually locked.
- Files & Assets are visually locked.
- Review & Save is visually locked.

After foundation save:

- Contributors become active.
- The stepper marks Song Foundation complete.
- The current stage becomes Contributors.

After contributors are reviewed:

- Files & Assets become active.
- Contributors are marked reviewed.
- Review & Save remains deferred until files/assets behavior exists.

## Deferred Persistence

Contributors remain prototype/visual in this V1 workflow state pass.

Files & Assets remain prototype/visual. No upload, storage, File Vault write, or asset persistence is implemented here.

Review & Save remains locked because the page does not yet have enough real downstream persistence to perform a meaningful final review.

## Parent / Child State Rule

Editing Song Foundation after contributors are active must not clear contributor state.

Foundation, contributors, files, and review must be treated as separate workflow stages. A future implementation may add explicit edit/review states, but it should not recreate the work or reset child-stage progress merely because a foundation field changes.

## Boundary

This is page-level workflow state only.

No new tables, backend architecture, contributor persistence, file upload/storage, release/project model, artist relationship model, AI, or Plexicon behavior is introduced.
