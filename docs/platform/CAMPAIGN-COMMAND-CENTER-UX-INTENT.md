# Campaign Command Center UX Intent

Status: Future UX intent

Source influence: Controlled MWIS command-center architecture and mockup direction

## 1. Purpose

The Campaign Command Center is a future Sentry Sound Marketing / Campaign Orchestration viewport.

It should render governed campaign state, readiness, approvals, blockers, evidence, recommendations, and lineage in one operational surface.

It is not a social media dashboard, scheduler, posting tool, publishing workflow, or autonomous AI control panel.

## 2. Core UX Question

The Command Center should answer:

- What is the current campaign state?
- Why is it the state?
- What blocks progress?
- What evidence supports or fails to support the state?
- What approval is needed?
- What can happen next?
- What must not happen yet?

## 3. Future Sidebar Modules

Future navigation intent may include:

- Campaigns
- Assets
- Captions
- Approvals
- Platforms
- AI Governance
- Lineage
- Reports
- Settings

These are future module areas only. They do not imply active routes or implementation approval.

## 4. Preserved Component Intent

The MWIS mockup and command-center documents define these future surfaces:

| Surface | Future Intent |
| --- | --- |
| Campaign Overview | Shows campaign identity, scope, state, and operating posture. |
| Lifecycle Matrix | Shows lifecycle states, current state, transition blockers, and review gates. |
| Platform Readiness Panel | Shows readiness by platform and platform-specific blockers. |
| AI Governance Panel | Shows AI role boundaries, recommendations, and prohibited actions. |
| Asset Governance Card | Shows linked assets, approval/export/source status, and lineage gaps. |
| Caption Governance Card | Shows caption/copy status, approval state, platform fit, and queue relationship. |
| Approvals Card | Shows approval categories, pending decisions, human decision fields, and rationale needs. |
| Next Actions Card | Shows governed recommendations, urgency, source state, and blockers. |
| Campaign Lineage / History | Shows state changes, evidence, decisions, source references, and audit trail. |
| Review Pack Panel | Shows review pack status, evidence completeness, blockers, and human decision placeholders. |
| Evidence Pack Surface | Renders evidence state but does not own truth. |
| Blocker / Dependency View | Shows active blockers, required dependencies, and resolution paths. |
| Action Tray | Shows action visibility: available, blocked, requires approval, requires evidence, requires review pack, requires platform readiness, or not allowed. |
| Reports | Future post-deployment evidence and review summaries, with telemetry as evidence only. |

## 5. Rendering Rules

The future UI may render:

- campaign state
- lifecycle state
- platform readiness
- evidence
- approvals
- blockers
- dependencies
- recommendations
- action visibility
- audit and lineage
- telemetry later

The UI must not:

- invent state
- invent readiness
- invent approval
- invent evidence
- hide blockers
- treat AI recommendations as approval
- imply deployment eligibility when governed state does not allow it
- mutate canonical truth directly
- flatten platform-specific requirements
- treat telemetry as truth
- turn a Review Pack into an approval
- treat generated output as canonical automatically

## 6. AI Governance UX

AI should appear as:

- recommendation assistant
- blocker explainer
- review-preparation assistant
- evidence-gap summarizer
- next-action suggester
- lineage summarizer

AI must not appear as:

- final approver
- campaign authority
- publisher
- scheduler
- autonomous campaign manager
- deployment eligibility authority

AI recommendation surfaces must be visually and operationally separate from approved state, human decisions, source-of-truth, and deployment eligibility.

## 7. Human Approval UX

Human decision surfaces should preserve:

- approval category
- decision
- rationale
- affected object/state
- evidence considered
- timestamp placeholder
- lineage reference

Approval decisions must remain explicit.

The UI must distinguish:

- ready for review
- approved
- deployment eligible
- deployment approved
- posted/deployed

These are not interchangeable.

## 8. Action Visibility UX

Future actions may be displayed as:

- available
- blocked
- requires approval
- requires evidence
- requires review pack
- requires platform readiness
- not allowed

Action visibility is derived state. It does not authorize execution.

Posting, scheduling, publishing, platform API integration, automation, and deployment require separate governed approval and implementation.

## 9. Data Dependency

The Command Center must render from governed backend/source-of-truth state when implemented.

Conceptual state dependencies:

- `campaign_state`
- `lifecycle_state`
- `readiness_state`
- `approval_state`
- `review_pack_state`
- `evidence_state`
- `blocker_state`
- `dependency_state`
- `recommendation_state`
- `platform_state`
- `asset_state`
- `caption_state`
- `lineage_state`
- `telemetry_state` later

Do not implement the UI before accepted backend/read-model contracts exist.

## 10. Current Implementation Boundary

This document preserves future UX intent only.

Do not build yet:

- routes
- components
- dashboard panels
- schemas
- APIs
- posting controls
- scheduling controls
- platform integrations
- autonomous AI controls
- MWIS-specific hardcoded command center

The Command Center should later become a reusable Sentry Sound module surface, with MWIS as one configurable campaign use case.
