# Work Detail Flow Realignment Design Pass

Date: 2026-05-26

Status: Design pass only. Runtime implementation remains pending Markus review.

## 1. Executive Summary

The Work/Song Detail page needs flow realignment because it has become an operational composite without a clear operational order.

This is not cosmetic UI polish. The page now contains backend-derived completeness state, OOC contextual sufficiency, contributor/split state, supporting-material references, editable creative truth, and future intelligence placeholders. Those pieces should not be arranged only by when they were added to the page. They should be arranged by how a user understands the current work, resolves known gaps, reviews context, and decides the next human step.

Backend truth should guide the workflow. If completeness logic can identify missing Song Profile fields, supporting material gaps, contributor review concerns, or split-sheet issues, the page should show the user where those items are resolved or clearly say that the resolving workflow is not available yet.

The recommended realignment keeps the page work-centered, read-mostly where appropriate, and calm. It does not turn Work Detail into a campaign command center, automation surface, readiness certification engine, or AI coordinator.

## 2. Current Page Flow Problem

Inspected:

- `app/dashboard/works/details/[workId]/page.tsx`

Current main-column section order:

1. Captured basics
2. Outcome Context
3. Operational Completeness
4. Contributors & Splits
5. Supporting Materials
6. Creative Details
7. Song Opportunities

Current aside section order:

1. Metadata intelligence
2. Save status
3. Field status

The congestion comes from mixed operational modes:

- Captured Basics is summary/context.
- Outcome Context is derived context/review.
- Operational Completeness is backend review output.
- Contributors & Splits is read-only review/context.
- Supporting Materials is both evidence-adjacent display and capture.
- Creative Details is editable capture.
- Song Opportunities is future intelligence.
- Save status is the action for Creative Details, but it lives in the aside.

The main disconnect is that missing context appears high on the page through Outcome Context and Operational Completeness, while several resolving controls appear lower down in Creative Details or Supporting Materials. Some detected concerns, such as contributor confirmation, are visible but not currently resolvable on this page. The user is asked to infer whether a gap is actionable now, read-only, or deferred.

The page should reduce that mental mapping.

## 3. Recommended New Page Structure

Recommended conceptual order:

1. Current State / Summary
2. Resolve Missing Context
3. Contributors & Splits
4. Supporting Materials
5. Outcome Context
6. Operational Completeness / Review
7. Future Intelligence / Opportunities

### 1. Current State / Summary

Purpose:

- Establish what work the user is viewing and what high-level context is already visible.

Operational mode:

- Context Mode

Data shown:

- Work title
- Genre
- Mood
- contributor count
- split total
- supporting material count
- completeness status label
- contextual sufficiency label

User action allowed:

- No primary mutation.
- May include section jump links.

Must not:

- certify readiness
- imply approval
- become a dashboard-wide command center
- hide missing context behind vague status text

### 2. Resolve Missing Context

Purpose:

- Put actionable gaps before passive review details.
- Show the nearest resolving path for missing context.

Operational mode:

- Capture Mode / Action Mode

Data shown:

- Missing Song Profile fields from completeness output
- Missing supporting material reference
- Missing split sheet reference
- Contributor/split concerns with "visible for review" or "workflow coming later" where not resolvable

User action allowed:

- Jump to existing Creative Details section
- Jump to existing Supporting Materials section
- Jump to Contributors & Splits for read-only review
- No new backend mutation beyond existing page actions

Must not:

- add new workflow engines
- force completion
- create hidden gating
- treat every gap as mandatory for all outcomes
- claim readiness certification

### 3. Contributors & Splits

Purpose:

- Keep contributor and split review near its related completeness concerns.

Operational mode:

- Context Mode / Review Mode

Data shown:

- contributor rows
- role
- split type
- percentage
- confirmation status
- split total

User action allowed:

- None in the first realignment unless an existing safe action already exists.
- If no edit/confirmation workflow exists, explicitly label this as visible for review only.

Must not:

- imply split confirmation is legally final
- add contributor editing
- add approval workflow
- mutate contributor state

### 4. Supporting Materials

Purpose:

- Resolve material-related gaps and show reference-only evidence context.

Operational mode:

- Evidence Mode / Capture Mode

Data shown:

- supporting material count
- linked material rows
- reference status
- file category
- notes/reference text
- reference-only disclaimer

User action allowed:

- Existing add-reference action only.
- Existing material fields only.

Must not:

- verify evidence
- claim legal clearance
- approve submission readiness
- create new evidence architecture

### 5. Outcome Context

Purpose:

- Summarize visible operational context after the page has exposed resolving areas.
- Show contextual sufficiency without becoming authority.

Operational mode:

- Context Mode / Review Mode

Data shown:

- intended outcome fallback
- visible context
- contextual sufficiency
- related materials
- completeness context
- missing context summary
- review notes summary

User action allowed:

- Jump links back to resolving sections.
- No writes.

Must not:

- approve readiness
- certify completion
- rank priorities
- orchestrate actions
- make AI recommendations

### 6. Operational Completeness / Review

Purpose:

- Provide the full deterministic read-model output after the user has seen resolving areas.

Operational mode:

- Review Mode

Data shown:

- completeness categories
- item-level statuses
- missing items
- review notes
- disclaimer

User action allowed:

- Links to resolving sections where possible.
- No direct mutation unless routed to existing sections.

Must not:

- become submission approval
- become legal/evidence/royalty certification
- block the user without explanation
- create a new readiness authority

### 7. Future Intelligence / Opportunities

Purpose:

- Preserve future commercial-intelligence intent without distracting from current capture and review.

Operational mode:

- Future Intelligence Mode

Data shown:

- future system-generated output placeholders
- clear "coming later" posture

User action allowed:

- None in this realignment.

Must not:

- appear as active AI recommendations
- distract from missing context
- mix with user-entered creative truth
- imply current campaign strategy exists

## 4. Gap-To-Resolution Model

The design should map completeness gaps to resolution areas:

| Completeness gap | Resolving section | Resolution behavior |
| --- | --- | --- |
| `Work basics: Work title` | Current State / Summary or future basic-edit flow | If edit is unavailable, explain that basic edit workflow is later. |
| `Work basics: Genre` | Current State / Summary or future basic-edit flow | If edit is unavailable, explain that basic edit workflow is later. |
| `Work basics: Mood` | Current State / Summary or future basic-edit flow | If edit is unavailable, explain that basic edit workflow is later. |
| `Song Profile: Themes` | Resolve Missing Context -> Creative Details | Jump to Creative Details / Themes. |
| `Song Profile: Language` | Resolve Missing Context -> Creative Details | Jump to Creative Details / Language. |
| `Song Profile: Clean / explicit` | Resolve Missing Context -> Creative Details | Jump to Creative Details / Clean / explicit. |
| `Song Profile: Creative description` | Resolve Missing Context -> Creative Details | Jump to Creative Details / Creative description. |
| `Supporting materials: Supporting material reference` | Supporting Materials | Jump to Supporting Materials / Add reference. |
| `Supporting materials: No split sheet reference...` | Supporting Materials | Jump to Supporting Materials / Add reference with split sheet category. |
| `Contributors & splits: Contributor presence` | Contributors & Splits or create/edit workflow | If not resolvable here, label workflow later. |
| `Contributors & splits: Composition split total...` | Contributors & Splits | Show visible split state; if editing unavailable, label workflow later. |
| `Contributors & splits: Contributor confirmation...` | Contributors & Splits | Show visible confirmation state; label confirmation workflow later if unavailable. |

Completeness gaps should prefer the nearest resolving section. If no resolving section exists, the page should say the workflow is coming later rather than presenting the gap as an unsolvable warning.

## 5. UX Pattern Recommendation

Safest first design pattern:

- one improved long page
- section anchors
- grouped cards by operational mode
- a compact "Resolve Missing Context" summary near the top
- no tabs in the first slice
- no stepper in the first slice
- no split-pane redesign in the first slice

Why:

- It preserves the current page architecture.
- It has minimal implementation risk.
- It does not require new backend logic.
- It makes existing sections easier to find.
- It supports gap-to-resolution links without inventing workflow state.
- It avoids hiding important context behind tabs.
- It avoids implying forced sequential completion.

Recommended near-term layout pattern:

- Keep the two-column page shell if it remains useful.
- Add stable section anchors to existing sections.
- Add a top section-navigation strip or compact summary links.
- Add a Resolve Missing Context card that lists actionable gaps and jumps to existing sections.
- Keep existing visual style and card language.
- Reorder sections only after Markus review.

Tabs and steppers should wait. They create stronger workflow semantics than the backend currently supports.

## 6. OOC Panel Placement

Outcome Context should not remain as a standalone early warning panel with no resolution paths.

Recommended placement:

- Keep a lightweight contextual sufficiency signal in Current State / Summary.
- Move the fuller Outcome Context panel after the primary resolving sections: Creative Details, Contributors & Splits, and Supporting Materials.
- If Outcome Context remains near the top temporarily, it must summarize gaps with links to resolving sections.

OOC should:

- remain read-only
- remain context-only
- summarize visible context
- point toward resolution paths where applicable
- preserve "No intended outcome selected yet" fallback when no explicit outcome exists

OOC must not:

- approve readiness
- certify completion
- score priority
- decide next action
- automate anything
- become campaign command center logic

## 7. Future Intelligence Placement

Song Opportunities and future intelligence should sit last or be moved into a clearly separated "Coming later" area.

Reason:

- Current missing capture/review work should not compete with future generated commercial intelligence.
- Users should understand that future intelligence depends on quality user-entered truth and supporting context.
- Future intelligence should not look like active AI recommendations.

Recommended posture:

- Keep "Song Opportunities" below all current capture, evidence-reference, OOC, and completeness sections.
- Preserve "Coming later" language.
- Consider collapsing or visually separating it in a later design pass if it distracts from current tasks.

## 8. Implementation Boundary For Next Slice

Smallest safe UI implementation slice after Markus review:

- Add stable section ids/anchors to existing sections.
- Add a compact section-navigation strip near the top.
- Add a small `Resolve Missing Context` card near the top using existing `completeness.missing_items` and `completeness.review_notes`.
- Map known completeness labels to existing section anchors only.
- Add plain fallback text for gaps without a current resolving workflow.
- Keep OOC read-only/contextual.
- Do not create new APIs, schemas, routes, automation, AI, or backend logic.
- Do not introduce tabs, stepper, split-pane layout, or command-center behavior yet.
- Do not alter source module truth.

Possible low-risk order for implementation:

1. Add section anchors.
2. Add a section navigation row.
3. Add Resolve Missing Context summary.
4. Optionally move Creative Details above Outcome Context only if Markus approves reordering.

The first implementation slice should make the current page easier to navigate before attempting a larger layout realignment.

## 9. Risks / Drift Warnings

Risks:

- Turning Work Detail into a campaign command center prematurely.
- Adding new workflows before the backend supports them.
- Adding AI recommendations or generated next steps.
- Creating dependency graphs from completeness items.
- Treating completeness as certification.
- Treating contextual sufficiency as readiness.
- Losing simple Song Profile usability.
- Overloading the first realignment with tabs, steppers, or split panes.
- Making every missing item feel mandatory for every user outcome.
- Mutating contributor, material, or work state from context-only sections.
- Hiding warnings behind visual polish rather than connecting them to resolution.
- Moving future intelligence too high in the workflow.

## 10. Recommended Next Codex Prompt

After Markus review, use a prompt like:

> Implement the smallest safe Work Detail flow realignment slice only. In `app/dashboard/works/details/[workId]/page.tsx`, add stable section anchors, a compact section-navigation strip, and a read-only `Resolve Missing Context` summary near the top using only existing `completeness.missing_items` and `completeness.review_notes`. Map known gap labels to existing section anchors where possible and show "workflow coming later" for unresolved workflows. Do not create schemas, APIs, routes, backend logic, tabs, steppers, split panes, AI, automation, dependency graphs, campaign command center behavior, or readiness certification.
