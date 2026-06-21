# Sentry Sound Platform - Operational UX Governance

## 1. Purpose Of Operational UX Governance

Operational UX Governance defines how Sentry Sound Platform interfaces must behave when they expose music-rights workflows to users.

This is not visual design guidance.

This is not Tailwind or component styling guidance.

This is operational SaaS workflow governance.

The platform sits between:

- backend operational truth
- music industry workflow requirements
- practical SaaS user expectations
- AI-generated or AI-assisted interfaces

Operational UX Governance exists so every screen, workflow, generated interface, and TEST surface preserves the same rule:

The user interface may guide, explain, and request governed actions, but it must not invent operational truth.

Backend operational truth includes:

- work identity
- contributor and split persistence
- readiness state
- evidence state
- blocker state
- queue state
- lifecycle state
- submission state
- regulator response state
- audit/event history
- payout and royalty eligibility when those modules exist

Industry workflow requirements include:

- composition ownership completeness
- split totals
- contributor confirmation
- evidence sufficiency
- SAMRO-style work registration readiness
- CAPASSO-style mechanical rights readiness
- recording/release applicability
- downstream lifecycle tracking
- remediation and correction behavior

SaaS UX expectations include:

- clear progress
- safe continuation
- visible save state
- plain-language blockers
- predictable next actions
- no surprise data loss
- no mystery status movement
- no overwhelming metadata dumps

AI-generated interfaces must be constrained by this document so future UI generation does not drift into attractive but operationally false screens.

AI-generated visual mockups are Visual Direction Artifacts only. They may guide hierarchy, tone, spacing, emotional feel, and product intuition, but they do not define executable frontend architecture, reusable assets, backend truth, or final layout systems.

The validated frontend pipeline is:

Visual Direction Artifact -> AI Visual Extraction -> Production Asset Pack -> Codex Asset Integration -> Executable frontend system.

The Production Asset Pack must contain real reusable assets generated, exported, or sourced separately from the flattened mockup. Screenshots and mockup composites are not asset truth.

## 2. Core UX Governance Principles

### Backend Truth Ownership

The backend owns operational truth.

The UI must not locally decide:

- readiness
- evidence sufficiency
- queue eligibility
- lifecycle status
- submission acceptance
- contributor confirmation
- blocker resolution
- payout eligibility

The UI may display backend truth and local form state, but it must clearly distinguish between them.

### Progressive Disclosure

The user should not see the full registration metadata universe upfront.

Fields, sections, and actions appear when they become operationally relevant.

Examples:

- recording fields appear only if a recording exists
- release fields appear only if distribution/release is in scope
- CAPASSO mandate fields appear only when mechanical rights are relevant
- evidence requirements appear when backend rules or prior answers make them applicable

### Operational Continuity

Every screen must preserve the user's place in the workflow.

The user should be able to answer:

- Where am I?
- What did I already complete?
- What is still missing?
- What is blocking me?
- What can I safely do next?

### Explicit Confirmation

After a meaningful backend action, the UI must confirm what actually happened.

Examples:

- work created
- `work_id` returned
- `asset_id` returned
- contributor count persisted
- split total evaluated
- readiness checked
- queue item created
- lifecycle history returned

Confirmation must be based on returned backend data, not optimistic UI claims.

### Safe Progression

The UI must not let the user advance into operational actions before backend gates allow it.

Examples:

- no submission action before readiness
- no queue creation before work exists
- no payout action before payout governance exists
- no lifecycle state change from UI-only state

### Fail Closed

If backend truth is unavailable, ambiguous, or failed, the UI must not assume success.

Fail-closed states include:

- readiness unknown
- evidence persistence unavailable
- work not found
- queue creation blocked
- lifecycle unavailable
- regulator response unavailable

The user-facing message must explain the limitation and the next safe action.

### Visible Persistence

The user must know whether data is:

- unsaved
- local-only
- saved as a backend draft
- persisted as an operational object
- accepted by a downstream workflow
- only visible as diagnostic TEST output

Local buffers must not be presented as backend persistence.

### Contextual Next Actions

Every operational state should have a next safe action.

Examples:

- "Add contributors until splits total 100%."
- "Create backend draft before checking readiness."
- "Review readiness issues before queue creation."
- "Refresh lifecycle to see backend submission state."

### No Silent State Changes

The UI must not silently:

- clear forms
- hide blockers
- mark stages complete
- advance workflow stages
- create queue items
- change lifecycle status
- dismiss warnings
- resolve evidence issues

Meaningful state changes require visible confirmation.

### No Fake Statuses

Status labels must map to backend state, derived backend validation, or clearly marked local form state.

Forbidden:

- fake "submitted"
- fake "approved"
- fake "ready"
- fake "processing"
- fake "royalties earned"
- fake "evidence verified"

### No Hidden Blockers

If a backend blocker exists, the user must be able to see it in plain language.

Blockers must not be buried inside raw JSON or hidden behind generic messages.

### Workflow Guidance Over Generic Forms

Sentry Sound is an operational workflow system, not a generic form builder.

Forms must be tied to:

- operational purpose
- validation impact
- workflow stage
- downstream effect
- next safe action

## 3. User Awareness Rules

The user must always know:

- where they are in the workflow
- what is saved
- what is local-only
- what is missing
- what is blocked
- what validation ran
- what happens next
- whether a button will read, save, submit, queue, refresh, or only change local state

Minimum awareness indicators:

- active stage
- completed stages
- locked stages
- blocked stages
- local draft notice when applicable
- backend confirmation when persisted
- readiness summary
- blocker summary
- next safe action

The UI must avoid ambiguous labels like "Continue" when the action creates backend state. Use explicit labels such as:

- "Create Backend Draft"
- "Check Readiness"
- "Create Queue Item"
- "Refresh Lifecycle"

## 4. Save / Persistence Rules

### Local Draft Buffer Behavior

Local draft buffers are allowed for safe typing recovery.

Rules:

- local buffer is not backend truth
- local buffer must be described as local or recovery-only
- local buffer must not unlock backend workflow actions by itself
- local buffer must not create queue/submission state
- local buffer must not show as persisted contributor or work state

### Backend Persistence Confirmation

After backend persistence, the UI must show returned backend identifiers and summary data.

Minimum confirmation after work creation:

- work title
- `work_id`
- `asset_id`
- contributor count
- split total if available
- current registration/readiness state if available

### Autosave Governance

Autosave may save draft data only after a governed backend draft contract exists.

Until that exists, autosave may only protect local input and must be labeled as local recovery.

Autosave must not:

- create submissions
- create queue items
- change lifecycle state
- approve evidence
- confirm contributors
- resolve blockers
- create payout eligibility

### Stage Completion Visibility

Each stage should show:

- not started
- active
- available
- complete
- blocked
- waiting
- locked

Stage completion must come from backend validation, backend persistence, or clearly marked local completion.

### After-Save UX Behavior

After a save:

- show what was saved
- show what backend returned
- update totals and summaries
- show readiness impact if available
- preserve the user's workflow position
- guide the next action
- do not clear the screen without confirmation

Example after contributor save:

- show persisted contributor row
- show updated split total
- show whether split total is valid
- show readiness impact
- keep the contributor section visible
- guide the user to readiness or missing contributor correction

## 5. Workflow Continuity Rules

### Stage Progression Behavior

Stages must progress only when conditions are met.

Progression can be:

- local form progression
- backend persistence progression
- backend readiness progression
- submission lifecycle progression

The UI must distinguish these.

### Blocker Visibility Behavior

Blockers must be visible near the affected stage and in summary form.

Each blocker should have:

- code when useful
- plain-language message
- affected stage
- downstream impact
- next safe action

### Readiness Visibility Behavior

Readiness must show:

- ready/not ready/unknown
- issues
- summary data
- source API or backend contract
- whether queue/submission is allowed

### Lifecycle Continuity

Lifecycle panels must display only real backend lifecycle data.

If no lifecycle exists, say so.

Do not create visual fake timelines to imply progress.

### Resume Behavior

When a user returns, the system should resume at the earliest incomplete or blocked governed stage.

Resume priority:

1. blockers
2. waiting collaborator/evidence
3. incomplete required fields
4. ready for review
5. ready to submit
6. lifecycle tracking

### Incomplete Workflow Handling

Incomplete workflows must remain visible.

They should not vanish from the user's workspace because they are not submitted yet.

Dashboard/home should eventually surface:

- continue drafts
- needs your action
- blocked
- waiting on others
- ready to submit
- submitted and tracking

## 6. Progressive Disclosure Rules

### When Fields Appear

Fields appear when:

- required for the current stage
- unlocked by a prior answer
- required by an applicable industry body
- required by a backend validation issue
- required for remediation

### Conditional Disclosure

Conditional fields must explain why they appeared.

Examples:

- "Recording details are needed because you said a recording exists."
- "Publisher authority is needed because a publisher is listed."
- "Mechanical mandate is needed because CAPASSO applies."

### Advanced-Field Gating

Advanced fields should stay hidden until needed.

Examples:

- ISWC if already assigned
- IPI when formal submission readiness begins
- UPC/EAN when release/distribution begins
- cue sheet when sync/broadcast/audiovisual use applies

### Regulator-Specific Disclosure

Regulator-specific sections appear only when the workflow target or applicability rules require them.

Examples:

- SAMRO work registration fields
- CAPASSO mechanical rights fields
- future neighboring-rights fields
- future DSP delivery fields

### Recording / Release Disclosure

Recording and release sections appear only after the user indicates:

- a recording exists
- release/distribution is planned
- downstream rights require recording or release metadata

### Evidence Disclosure

Evidence requirements appear when backend rules determine they are applicable.

Evidence state must show:

- missing
- pending
- under review
- verified
- rejected
- expired
- superseded
- disputed

### Progressive Enabling

Actions should become enabled only when backend state allows them.

Examples:

- readiness check enabled after backend work creation
- queue creation enabled after readiness ready
- lifecycle refresh enabled after backend work exists
- submission enabled only after queue eligibility

## 7. SaaS Operational UX Patterns

### Stage Cards

Stage cards show current workflow position.

Required content:

- stage name
- status
- short operational detail
- whether locked/available/complete/blocked

### Checklist Progression

Checklists show what remains.

They must be based on backend validation or explicit local form requirements.

### Blocker Cards

Blocker cards show:

- blocker code
- plain-language explanation
- affected workflow
- next safe action
- whether it blocks submission, payout, or review

### Readiness Summaries

Readiness summaries show:

- readiness state
- issues
- summary data
- evaluated work
- downstream effect

### Next-Action Prompts

Next-action prompts should tell the user what to do next without hiding blockers.

Examples:

- "Create the backend draft before checking readiness."
- "Fix the split total before saving."
- "Readiness is blocked. Review the listed issues."

### Empty States

Empty states must be truthful.

Examples:

- "No lifecycle history returned yet. The UI does not invent lifecycle state."
- "No queue item has been created by the backend yet."

### Confirmation Banners

Confirmation banners show the result of backend actions.

They must include enough returned data to build trust.

### Lifecycle Panels

Lifecycle panels show real submission rows and events.

They must not create fake visual progress.

### Operational Dashboards

Dashboards should prioritize operational work over vanity metrics.

Primary dashboard groups:

- continue drafts
- needs your action
- blocked
- waiting on others
- ready to submit
- submitted and tracking
- recently completed

## 8. AI UI Generation Constraints

AI-generated UI must obey these constraints:

- must pass through AI Visual Extraction before implementation when a mockup or screenshot is used
- must produce or reference a Production Asset Pack when reusable visuals are needed
- must separate visual direction from executable UI architecture
- must separate standalone production assets from flattened AI image composites
- must extract UX intent, hierarchy, spacing, interaction feel, and tone before coding
- must build through Sentry Sound's actual Next.js/Tailwind patterns
- cannot invent operational state
- cannot clear forms silently
- cannot hide persistence state
- cannot show unavailable actions as active
- cannot create fake lifecycle progression
- cannot invent regulator outcomes
- cannot invent evidence verification
- cannot invent payout/royalty results
- cannot bypass blockers for visual flow
- cannot use direct DB access from UI
- must follow operational continuity rules
- must use backend-governed workflow states
- must distinguish local vs persisted state
- must label TEST-only or diagnostic surfaces
- must render unavailable backend state as unavailable, unknown, blocked, or not assessed

AI-generated interfaces must ask:

1. What backend truth powers this?
2. What local-only state exists?
3. What can the user safely do?
4. What must remain disabled?
5. What blockers must be visible?
6. What confirmation is required after action?
7. What part of the mockup is only visual direction?
8. What real reusable assets, if any, must be placed in the approved asset structure?
9. Is a Production Asset Pack needed before Codex integration?

### AI Visual Extraction Rule

Before implementing from an AI visual, screenshot, or annotated mockup:

1. Describe the primary user task.
2. Extract layout hierarchy and content priority.
3. Extract spacing, rhythm, density, and visual tone.
4. Identify interaction expectations.
5. Identify what should be hidden, quiet, secondary, or removed.
6. Identify whether a Production Asset Pack is required.
7. Generate, collect, or approve standalone reusable assets separately from the flattened AI image.
8. Place approved assets in `/public/assets` or the current approved asset structure, preferably `branding/`, `hero/`, `catalogue/`, `icons/`, or `textures/`.
9. Build the UI with executable components and current app patterns.
10. Preserve backend/source-of-truth authority.

The mockup is evidence for direction, not a source of truth for implementation.

Do not let cinematic composition, decorative imagery, or Plexicon doctrine override SaaS usability, product task clarity, or calm human-readable workflow design.

## 9. Operational Feedback Rules

### Success Confirmations

Success messages must say what happened.

Good:

- "Backend draft created. Work ID returned."
- "Queue item created by backend."
- "Existing queue item returned by duplicate prevention."

Bad:

- "Done"
- "Success"
- "All set" without backend detail

### Warning Messaging

Warnings should explain future risk.

Examples:

- "ISWC is not assigned yet. This may be acceptable before formal registration."
- "Cue sheet is missing. Future broadcast reporting may be affected."

### Blocker Messaging

Blockers must explain what is blocked and why.

Example:

- "Split total must equal 100%. Submission readiness is blocked."

### Remediation Messaging

Remediation messages must explain:

- what failed
- what must be corrected
- whether reassessment is needed
- whether lifecycle history remains unchanged

### Queue / Lifecycle Messaging

Queue and lifecycle messages must be backend-based.

Examples:

- "Queued"
- "Submitted"
- "Accepted"
- "Rejected"
- "No lifecycle history returned yet"

Do not display lifecycle state if the backend did not return it.

### Contributor / Split Messaging

Contributor and split messaging must show:

- current split total
- missing contributors
- invalid percentages
- confirmation status when available
- persistence state after save

## 10. UX Governance Examples

### Contributor Flow

User enters contributor name and split.

The UI may show local split total immediately.

Before backend save:

- label as local draft/recovery
- do not claim contributor is persisted

After backend save:

- show persisted contributor count
- show split total from readiness summary when available
- guide to readiness

### Split Allocation Flow

If split total is not 100:

- show warning near split total
- disable backend draft creation or submission action
- explain "Composition splits must total 100%."

If split total is 100:

- show complete local requirement
- allow backend save if other required fields exist

### Readiness Review

When readiness is checked:

- show ready/not ready
- show issues
- show summary
- enable submission intent only if ready

If readiness fails:

- do not create queue item
- show blocker
- guide the user back to the affected stage

### Queue Submission

Queue creation requires:

- real `work_id`
- existing work
- backend readiness ready
- duplicate prevention

After queue creation:

- show queue id/status
- show whether duplicate was prevented
- guide to lifecycle tracking

### Lifecycle Tracking

Lifecycle tracking must:

- load real backend submissions/events
- show empty state if none exist
- never animate or imply progress that is not returned by backend

### Evidence Blocker Flow

If evidence persistence is unavailable:

- fail closed
- show "Evidence storage is not yet connected. This blocks evidence readiness."
- do not mark evidence ready
- do not allow evidence-dependent progression

If evidence is missing:

- show missing evidence
- show affected workflow
- guide to evidence pack resolution when that capability exists

## 11. Future Architecture Direction

The future Sentry Sound Platform build direction is:

Industry workflow rules
+
Backend governance
+
Operational UX governance
+
AI-generated interfaces
=
Governed operational SaaS system

Industry workflow rules define what must happen.

Backend governance owns truth, validation, lifecycle, events, and enforcement.

Operational UX governance defines how users safely see, understand, resume, and progress through that truth.

AI-generated interfaces must operate inside those constraints.

The end goal is not a collection of pages.

The end goal is a governed operational SaaS system for music rights, registration, evidence, lifecycle, remediation, royalties, reconciliation, and audit.

## 12. Canonical Authority

This document is a canonical governance layer for future UI generation and workflow design.

Future implementation must align with:

- `docs/platform/APP-BUILD-EXECUTION-FRAMEWORK.md`
- `docs/platform/APP-USER-EXPERIENCE-FLOW-FRAMEWORK.md`
- `docs/platform/UI-GENERATION-GOVERNANCE.md`
- `docs/build-log/BUILD-LOG.md`

If a generated or proposed UI conflicts with this document, stop and perform DESIGN review before implementation.
