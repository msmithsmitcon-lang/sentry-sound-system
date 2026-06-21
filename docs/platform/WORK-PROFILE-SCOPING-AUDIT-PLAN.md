# Work Profile Scoping And Audit Plan

## Purpose

This plan defines the future workspace scoping and audit-history requirements for canonical Song Profile updates through `PATCH /api/works/[workId]/profile`.

This is planning only. It does not add schema, migrations, workspace enforcement, audit tables, AI outputs, identifiers, readiness, submissions, evidence, or royalty logic.

## Current State

Canonical Song Profile reads and updates now sit under the Works API:

- `GET /api/works/[workId]` loads one canonical work detail.
- `PATCH /api/works/[workId]/profile` saves user-entered creative truth.

The profile update route writes only:

- `musical_works.themes`
- `musical_works.metadata.work_intelligence_v1.creative_truth`

It preserves:

- `metadata.work_intelligence_v1.system_insights`
- unrelated metadata keys

## 1. Workspace Scoping

`PATCH /api/works/[workId]/profile` must eventually verify workspace ownership before updating a work.

The platform must not allow one workspace to update another workspace's work. Song Profile data may affect catalog truth, future duplicate checks, registration packaging, submission readiness, royalty/compliance reporting, and AI recommendations. If cross-workspace writes were possible, one tenant could damage another tenant's catalog and downstream operational history.

Current blocker:

- `workspace_id` is not yet fully confirmed as present and enforced on the active `musical_works` capture path.
- Current Works/Songs flow is still the canonical operational seed, but workspace ownership enforcement needs a confirmed canonical ownership path before route-level enforcement is activated.

Recommended future-safe approach:

- Confirm whether `musical_works.workspace_id` exists and is populated for all active Works/Songs records.
- If missing, plan a controlled schema/data alignment step before enforcing workspace checks.
- Resolve workspace identity from the authenticated session and canonical workspace membership.
- Update repository queries so profile writes require both `id = workId` and `workspace_id = activeWorkspaceId`.
- Return `404` or a safe authorization error when the work does not belong to the active workspace.
- Keep service boundaries ready for workspace input even before enforcement is activated.

## 2. Audit History

Song Profile updates need audit history because creative truth is operational catalog truth. Changes can influence future registration packaging, duplicate checks, contributor conversations, readiness results, AI recommendations, and commercial workflows.

Audit events should track:

- work id
- workspace id
- user id
- changed fields
- old values
- new values
- source: `manual`
- timestamp
- route/action, such as `PATCH /api/works/[workId]/profile`

Audit matters for:

- rights disputes
- contributor/split corrections
- registration history
- AI recommendations
- trust and governance

The audit event should capture enough detail to answer who changed what, when, why the change was allowed, and what downstream systems may need to refresh.

## 3. Creative Truth Boundary

User-entered creative truth can be edited by the user through the Song Profile.

AI/system outputs are not editable user truth.

System insights must be stored separately from creative truth. Future AI suggestions may be reviewed, accepted, rejected, or converted into actions, but they must not silently overwrite profile truth.

The canonical profile update route must continue to save only user-entered creative truth and must preserve `system_insights`.

## 4. Future Implementation Phases

Phase A - Workspace ownership check

- Confirm canonical workspace ownership for `musical_works`.
- Pass active workspace identity into the profile update service.
- Require matching work id and workspace id during update.
- Preserve current UX while hardening backend ownership.

Phase B - Audit event persistence

- Use an existing canonical audit event system if one is confirmed safe.
- Otherwise plan a dedicated canonical audit event table before implementation.
- Record old and new values for changed profile fields.
- Mark source as `manual`.

Phase C - Profile change history display

- Add a read-only profile change history surface later.
- Show who changed creative truth, when, and which fields changed.
- Keep this separate from AI/system insight history.

Phase D - Submission/readiness/identifier linkage

- Let readiness, submission, identifier, and AI systems consume audit history after their canonical owners are confirmed.
- Use audit events to explain why readiness or recommendation outputs changed after profile edits.

## 5. What Not To Implement Yet

- No schema changes now.
- No audit tables now unless an existing canonical audit system is confirmed safe.
- No workspace enforcement until the canonical ownership path is confirmed.
- No AI outputs.
- No identifiers.
- No submission logic.
- No readiness or evidence logic.
- No royalty logic.
