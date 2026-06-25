# MWIS Controlled Module Ingestion Review

Date: 2026-05-25

Status: Controlled future-module ingestion review

## 1. Purpose

This review records the controlled ingestion of the external `Desktop/M-WIS` folder into Sentry Sound platform memory as future Marketing / Campaign Orchestration module direction.

This is not a runtime import.

This is not deployment work.

This is not schema, API, or UI implementation.

Canonical deployment remains `sentry-sound-system`.

## 2. Material Inspected

The reviewed MWIS material includes:

- `docs/source-of-truth/MWIS-SOURCE-OF-TRUTH.md`
- `docs/source-of-truth/MWIS-DECISION-LOG.md`
- `docs/handover/MWIS-HANDOVER.md`
- `docs/strategy/MWIS-MARKETING-SYSTEM.md`
- `docs/strategy/CAMPAIGN-LIFECYCLE-ARCHITECTURE.md`
- `docs/strategy/PLATFORM-READINESS-ARCHITECTURE.md`
- `docs/strategy/REVIEW-APPROVAL-ARCHITECTURE.md`
- `docs/strategy/REVIEW-PACK-ARCHITECTURE.md`
- `docs/strategy/OPERATIONAL-EVIDENCE-ARCHITECTURE.md`
- `docs/strategy/BLOCKER-DEPENDENCY-ARCHITECTURE.md`
- `docs/strategy/ACTION-RECOMMENDATION-ARCHITECTURE.md`
- `docs/strategy/STATE-CONTRACT-ARCHITECTURE.md`
- `docs/strategy/AUDIT-LINEAGE-ARCHITECTURE.md`
- `docs/strategy/GOVERNED-COMMAND-CENTER-UX-CONTRACT.md`
- `docs/strategy/DOCTRINE-CONSOLIDATION-REVIEW.md`
- `docs/strategy/CANONICAL-OPERATIONAL-OBJECT-MAP.md`
- `docs/strategy/CAMPAIGN-TRACKER.md`
- `campaigns/MWIS-CAMPAIGN-001-IDENTITY-FOUNDATION.md`
- `Marketing/01-Identity-Pillar/IDENTITY-ASSET-REGISTRY.md`
- `Marketing/01-Identity-Pillar/IDENTITY-POST-QUEUE.md`
- `Marketing/09-Captions-Copy/PILLAR-1-CAPTION-RULES.md`
- `Marketing/09-Captions-Copy/PILLAR-1-CAPTION-LIBRARY.md`
- `platform-profiles/PLATFORM-PROFILES.md`

Audio files, REAPER project files, rendered images, backups, exports, and platform-specific creative assets were not imported.

## 3. Ingestion Decision

MWIS is approved as a future-module reference for Sentry Sound Marketing / Campaign Orchestration.

The reusable layer is the governed operational logic:

- campaign command center concept
- campaign lifecycle states
- platform readiness logic
- review pack architecture
- operational evidence architecture
- review and approval governance
- asset governance
- caption/copy governance
- blocker and dependency logic
- next recommended action logic
- AI governance boundaries
- lineage and audit tracking
- campaign tracker logic
- canonical operational object map
- state-contract architecture
- command-center UX/component intent

MWIS-specific identity, creative strategy, visuals, captions, platform handles, songs, and campaign instance content are not platform defaults.

## 4. Canonical Runtime Boundary

The ingestion does not change deployment topology.

Rules:

- Do not create a separate MWIS runtime.
- Do not create a separate Vercel app.
- Do not configure `mwis.sentrysound.co.za`.
- Do not copy the whole MWIS folder into the app.
- Do not treat MWIS files as an app root.
- Do not hardcode MWIS artist identity into Sentry Sound.
- Do not create schemas, APIs, UI, posting tools, schedulers, integrations, or automation from this review.

This review aligns with `docs/governance/DEPLOYMENT-TOPOLOGY-V1.md`.

## 5. Reusable Module Logic

The following MWIS concepts should become future reusable Sentry Sound module logic:

- Campaign as a governed operational object.
- Lifecycle state as a governed state with valid transitions and required approvals.
- Platform readiness as platform-specific readiness, not posting approval.
- Review Pack as a support object that bundles evidence, blockers, risks, recommendations, requested approvals, and lineage.
- Evidence as proof supporting state, readiness, blockers, approvals, and lifecycle transitions.
- Approval as explicit human/governance decision, separate from AI recommendation.
- Asset governance with source reference, export filename, approval state, platform usage, and lineage.
- Caption/copy governance with platform fit, approval state, revision lineage, and post-queue relationship.
- Blocker/dependency state as first-class operational logic, not hidden text.
- Action recommendations as advisory next steps derived from governed state.
- Audit and lineage as durable explanation of why state exists.
- Campaign tracker as summary surface, not canonical truth.
- Command Center as governed viewport, not social dashboard or publishing console.

## 6. Artist-Specific Configurable Concepts

The following MWIS content must remain artist/project-specific and configurable:

- M-WIS Sonic Project identity.
- Public posture, restraint model, brand tone, and creative philosophy.
- Black, charcoal, and warm gold visual direction.
- Instagram handle `mwis.project`.
- Facebook page `M-WIS Sonic Project`.
- Pillar 1 Identity copy and caption library.
- M-WIS campaign IDs and review pack IDs.
- Early Weeknd-era restraint as a strategic reference.
- Current source prompt, export, caption, and readiness gaps.
- Specific assets, songs, release files, REAPER files, masters, and artwork.

Future platform design may support configurable artist identity models, campaign pillars, visual systems, caption rules, and platform profiles, but MWIS must not become the default platform doctrine.

## 7. Existing Sentry Sound Support Signals

Sentry Sound already has partial foundations that could later support this module:

- `projects` and `project_tasks` tables for campaign/project and task-like structures.
- `approval_requests`, `approval_steps`, `approval_responses`, and approval audit events for governed approval flows.
- workspace calendar/action items for operational next actions and due dates.
- file vault and asset concepts for future asset governance.
- evidence readiness and evidence audit concepts for proof/readiness logic.
- production mutation governance for future guarded state changes.
- RBAC/workspace context for future permissions.
- Artist Intelligence Layer future note for configurable strategy inputs.

These are support signals only. They are not confirmation that the Marketing / Campaign Orchestration module is production-ready.

## 8. Missing Future Contracts

Before implementation, Sentry Sound would need governed contracts for:

- Campaign object
- Campaign lifecycle state and transition rules
- Platform readiness object
- Review Pack object
- Marketing/campaign evidence object or relationship model
- Asset governance object or file-vault relationship
- Caption/copy object
- Campaign approval categories and state transitions
- Blocker object
- Dependency object
- Recommendation object
- Human decision object
- Lineage and audit relationship model
- Action visibility derived-state contract
- Campaign tracker read model
- Command Center read model
- AI recommendation capture and separation from human approval

These contracts should be designed before schema/API/UI work.

## 9. Governed Review-Only Logic

Until later implementation approval, the following must remain review-only:

- Review Pack preparation
- platform readiness validation
- deployment eligibility evaluation
- approval decisions
- blocker waivers
- evidence verification
- recommendation acceptance/completion
- lifecycle advancement
- posting, scheduling, publishing, platform API integration, automation, and deployment

AI/Codex may inspect, map, summarize, prepare, and recommend. It may not approve, execute, publish, schedule, post, connect integrations, mark deployment eligibility, fabricate evidence, waive blockers, or mutate canonical truth without explicit instruction and governed implementation.

## 10. Plexicon Alignment

The ingested module direction aligns to the following Plexicon principles:

- backend/source-of-truth owns state
- frontend renders state
- AI recommends/prepares and does not approve
- telemetry is evidence, not truth
- lineage matters more than rendered output
- Review Pack is a support object, not approval
- deployment eligibility is derived, not approval
- generated output is not canonical automatically
- UX surfaces render governed state and do not own truth
- action buttons do not create authority

## 11. Result

MWIS marketing intelligence is preserved as future Sentry Sound platform capability.

Runtime authority remains clean:

- canonical repo: `sentry-sound-system`
- canonical deployment target: `sentry-sound-system`
- MWIS role: future Marketing / Campaign Orchestration module blueprint and configurable artist/campaign use case
