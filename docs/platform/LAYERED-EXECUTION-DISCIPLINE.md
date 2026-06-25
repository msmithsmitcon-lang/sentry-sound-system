# Layered Execution Discipline

## Purpose

This document locks the Sentry Sound Platform execution model so strategic discovery does not pull implementation out of phase.

Strategic discoveries and semantic reasoning are useful, but implementation must remain layer-disciplined.

## Required Execution Model

Every new platform layer must follow this sequence:

1. Define layer
   - What is the layer supposed to do?

2. Build layer
   - Implement the smallest stable version.

3. Test layer
   - Validate semantics, contracts, and edge cases.

4. Stabilize layer
   - Ensure reasoning consistency and avoid semantic drift.

5. Document layer
   - Lock philosophy, contracts, boundaries, and future notes.

6. Move to next layer
   - Only after stability is achieved.

## Future Discovery Rule

Future discoveries should be documented and aligned to future phases. They must not be prematurely implemented.

Do not evolve the roadmap reactively, partially implement future intelligence layers, or jump ahead because reasoning is interesting.

## Completed Layers

The following layers are officially completed or stabilized for the current roadmap sequence:

- Workspace ownership architecture
- Finance commitments
- Money State V0
- Commitment Weighting V1
- Calendar/action linkage foundational layer
- Calendar/action linkage stabilization
- Works/Songs UX continuation

## Not Started

The following layers are not started and must remain future/deferred until explicitly scoped:

- workflow dependency graph
- operational dependency reasoning
- operational conversion layer
- viability reasoning
- AI/autopilot reasoning
- forecasting
- scoring systems

## Completed Layer: Calendar/Action Linkage Stabilization

Purpose:
Ensure existing workspace actions, finance reminders, and calendar/task surfaces remain coherent, workspace-owned, and reliable as operational reminders.

Why it is needed:
Finance commitments already link due, overdue, and review-later items into workspace actions/calendar. Before building deeper dependency reasoning, the existing action layer must be stable enough to carry reminders from multiple modules without becoming fragmented.

What it should NOT do yet:

- no workflow dependency graph
- no operational chain reasoning
- no AI/autopilot
- no prioritization engine
- no forecasting
- no ROI/conversion logic
- no complex recurrence or external calendar sync

Smallest stable implementation objective:
Review and stabilize the existing workspace action/calendar contracts, status mapping, source-module linkage, related-entity linkage, and dashboard/calendar display assumptions without adding new intelligence layers.

Overdue semantics decision:

- `required_by_date < today` plus an incomplete action status is a derived `past_due` timing signal.
- `action_status = overdue` is an explicit operational escalation.
- Not every past-date pending, in-progress, or awaiting-approval item must automatically become `overdue`.
- `needs_review` is the preferred calm user-facing/support language for past-due items that have not been explicitly escalated.
- Past-due incomplete actions are valid review information, not lifecycle mismatches.

Future RIR alignment:

- Reporting: surface the operational timing issue.
- Improvement: identify process weakness or coordination gap.
- Remediation: later support action, training, or understanding paths.

RIR and remediation are not implemented in this layer.

Completion status:

- Validation harness created at `temp/verify-calendar-action-stabilization.ts`.
- Manual action lifecycle validation passed.
- Finance commitment due, overdue, review-later, paid, and cancelled sync validation passed.
- Repeated finance sync idempotency validation passed.
- Duplicate linked action review passed with no duplicate linked finance actions found.
- Orphan finance action review passed with no orphan finance actions found.
- Lifecycle mismatch review passed with no action/status/completed-at mismatches found.
- Past-due incomplete actions are reported as review information, not failures.

Known future notes:

- Workspace isolation was not fully tested because the validation context exposed only one distinct workspace.
- `past_due` is not yet surfaced separately in UI.
- `review_later` currently maps to `pending`.
- No workflow dependency graph is implemented.
- No operational chain reasoning is implemented.
- No RIR/remediation implementation exists yet.

## Completed Layer: Works/Songs UX Continuation

Purpose:
Return to the user-facing Works/Songs workflow now that the supporting ownership, finance commitment, Money State, commitment weighting, and calendar/action linkage layers are stabilized.

Why it is needed:
The platform should resume visible product flow after backend and action-layer stabilization, preserving the discipline that deeper intelligence layers remain deferred.

What it should NOT do yet:

- no workflow dependency graph
- no operational dependency reasoning
- no operational conversion layer
- no viability reasoning
- no AI/autopilot reasoning
- no forecasting
- no scoring systems

Smallest stable implementation objective:
Continue the existing Works/Songs UX path using canonical workspace-owned backend routes and the stabilized action/calendar layer, without adding new intelligence layers.

Completion status:

- Build, test, and stabilization are complete for now.
- `/dashboard/works` restored a clear lifecycle/operational map.
- The three-zone Works page layout is preserved: operational awareness, primary execution, and Workflow Coach/guidance.
- Last 10 Captured Works remains a compact quick-access list.
- Workflow Coach remains non-generative guidance.
- Step 0 duplicate awareness remains preserved on `/dashboard/works/new`.
- Canonical routes and contracts remain preserved: `/api/works`, `/api/works/[workId]`, `/api/works/[workId]/profile`, and `/api/songs/create`.
- No `/api/test/get-work` dependency was reintroduced.
- The Works page timing metric was aligned with calendar/action semantics by using `Needs Review` instead of explicit `Overdue` wording for derived past-date incomplete actions.

Known future notes:

- No workflow dependency graph is implemented.
- No operational chain reasoning is implemented.
- No AI/autopilot reasoning is implemented.
- No governed readiness engine is implemented.
- No identifier, ISWC, or ISRC capture is implemented.

## Completed Layer: Contributor/Split UX Continuation

Purpose:
Continue the grounded user-facing workflow after work capture by improving the way users view, understand, and continue contributor and split information attached to canonical workspace-owned works.

Why it is needed:
The Works/Songs flow currently captures contributors and composition splits during work creation, but a fuller operational contributor/split UX remains the next practical surface before readiness, submissions, identifiers, royalties, or deeper intelligence layers.

What it should NOT do yet:

- no royalty calculation engine
- no payout automation
- no external contributor portal
- no full RBAC workflow
- no governed readiness engine
- no submission automation
- no identifier capture
- no AI/autopilot reasoning

Smallest stable implementation objective:
Define the current contributor/split UX surface, active contracts, and gaps, then build only the smallest page/flow refinement needed to let users review contributor and split state from the canonical workspace-owned Works/Songs data.

Completion status:

- Build, test, and stabilization are complete for now.
- The canonical work detail read model includes read-only contributor/split rows from `work_contributors` joined to `contributors`.
- Song Profile includes a compact `Contributors & Splits` panel.
- The panel displays contributor names, stage names where available, roles, split types, percentages, confirmation state, and split total.
- Reads remain workspace-scoped through the authenticated workspace context.
- Add Work contributor capture and 100% split validation remain unchanged.
- `/api/songs/create` and `/api/works/[workId]/profile` contracts remain unchanged.
- No TEST contributor/split routes were introduced into the active dashboard path.
- The panel wording uses `Captured split data` and preserves boundaries around signed split sheets, legal clearance, royalty payout readiness, and registration readiness.

Known future notes:

- No contributor editing is implemented.
- No contributor approval workflow is implemented.
- No royalty engine is implemented.
- No payout logic is implemented.
- No publishing administration is implemented.
- No ISWC/ISRC management is implemented.
- No master/recording split support is implemented.
- No neighbouring rights split support is implemented.

## Current Next Layer

The next official roadmap layer is:

Asset/File/Evidence UX Continuation.

Purpose:
Continue the grounded user-facing workflow after work capture and contributor/split visibility by improving how users understand, organize, and review files, evidence, and supporting materials attached to canonical workspace-owned work operations.

Why it is needed:
Works, contributors, and splits need supporting files and evidence before readiness, submissions, registrations, disputes, or compliance workflows can become trustworthy.

What it should NOT do yet:

- no governed readiness engine
- no submission automation
- no legal clearance claims
- no AI/autopilot reasoning
- no identifier capture
- no royalty or payout logic
- no external storage integrations

Smallest stable implementation objective:
Define the current file/evidence UX surface, active contracts, and gaps, then build only the smallest page/flow refinement needed to make supporting materials understandable without implying readiness or clearance.
