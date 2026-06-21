# Operational Flow Review Pass

Date: 2026-05-26

Status: Review/doctrine only. No runtime implementation performed.

## 1. Executive Summary

The Work/Song detail page exposed an operational flow problem that is bigger than UI polish.

The page now contains enough real backend truth to reveal workflow fragmentation: completeness logic detects missing context, OOC V0 summarizes contextual sufficiency, supporting materials and contributors expose evidence-adjacent facts, and creative-detail inputs can resolve some gaps. But those pieces are stacked as page sections rather than organized as an operational workflow.

The problem is not that the page is visually broken. The problem is that backend state and user intent are not yet shaping the user journey. The system can identify missing themes, language, clean/explicit notes, contributor conditions, split-sheet references, and supporting material gaps, but the page does not consistently show the user where to resolve each detected concern.

Future Sentry Sound pages should treat backend truth as workflow intelligence, not merely validation output. If the backend can identify state, gaps, review concerns, or contextual sufficiency, the frontend should structure the page around those operational modes and resolution paths.

## 2. Current Work Detail Flow Inventory

Inspected primary runtime page:

- `app/dashboard/works/details/[workId]/page.tsx`

Related existing read/write surfaces inspected:

- `app/api/works/[workId]/completeness/route.ts`
- `src/lib/work-readiness/get-work-completeness.ts`
- `src/lib/work-readiness/work-completeness-repository.ts`
- `app/api/works/[workId]/files/route.ts`
- `src/lib/work-files/work-supporting-materials.types.ts`

Current page sections in order:

| Section | What it does | Operational state represented | Mode | User action? |
| --- | --- | --- | --- | --- |
| Captured basics | Displays work title, genre, mood, contributor count, split total, registration, copyright | Existing work identity and basic catalog state | Context / summary | Display only |
| Outcome Context | Displays intended outcome fallback, visible context, contextual sufficiency, related materials, completeness context, missing context, review notes | Derived operational context over existing page data | Context / review | Display only |
| Operational Completeness | Displays backend completeness categories, missing items, review notes, and disclaimer | Deterministic completeness read model from work facts | Review | Display only |
| Contributors & Splits | Displays contributor rows, roles, split type, percentages, confirmation status | Contributor/split state from canonical work detail read model | Context / review | Display only |
| Supporting Materials | Displays linked reference materials and allows adding a metadata-only reference | Reference/evidence-adjacent state | Evidence / capture | Yes, add reference |
| Creative Details | Editable Song Profile fields: alternative title, language, themes, energy, clean/explicit, creative description, inspiration/reference notes | Creative truth and metadata context | Capture | Yes, edit/save profile |
| Song Opportunities | Displays future system-generated commercial-intelligence placeholders | Future intelligence, not current operational truth | Future Intelligence | Display only |
| Aside: Metadata intelligence | Shows creative-field capture count and explanatory metadata text | Capture progress for manual creative fields | Context / review | Display only |
| Aside: Save status | Explains save behavior and provides save button | Creative truth persistence state | Action / capture | Yes, save profile |
| Aside: Field status | Explains storage behavior for fields | Implementation/context explanation | Context | Display only |

The completeness backend currently evaluates:

- Work basics: work title, genre, mood
- Contributors & splits: contributor presence, split total, contributor confirmation
- Song Profile: themes, language, clean/explicit, creative description
- Supporting materials: supporting material reference, split-sheet reference

That backend categorization is already close to a workflow map. The page does not yet fully use it as one.

## 3. Flow Friction Points

Observed friction:

- Detected gaps are far away from the controls that resolve them.
- OOC and Operational Completeness can both show missing context before the user reaches Creative Details or Supporting Materials.
- Review state appears before resolution context.
- Capture, context, review, evidence reference, action, and future intelligence are stacked into one long scroll.
- Missing-context text does not map to a resolving section or action.
- Some gaps are resolvable on the page, while others require later workflows, but the distinction is not obvious enough.
- The Save action for Creative Details is separated into the aside rather than living near the capture fields it saves.
- Supporting Materials mixes evidence-adjacent display, add-reference capture, and reference-only disclaimer in one dense block.
- Future intelligence appears in the same linear flow as current capture and review, which can distract from present user tasks.
- Repeated disclaimers are individually correct but add cognitive load when the user is trying to resolve gaps.
- The page asks the user to mentally connect backend categories to UI sections.
- Contextual sufficiency says whether enough context is visible but does not yet guide toward the nearest resolving mode.

The page technically works, but the workflow is asking the user to do too much operational translation.

## 4. Backend Truth -> Workflow Principle

Principle:

If backend logic identifies required fields, important context, dependencies, state, completeness gaps, or review concerns, the workflow should expose:

- why it matters
- current state
- action to resolve
- where to resolve it
- whether it is required now or later
- whether it is context-only, readiness-related, or evidence-related
- whether the current page can resolve it
- whether another module or future workflow is needed

Backend truth should shape workflow design, not only validation.

In the Work/Song detail page, the completeness read model already names categories and item keys. Those categories should become workflow intelligence:

- `work_basics` should map to summary/basic capture or explain why the original create path owns it.
- `contributors_splits` should map to Contributors & Splits and distinguish read-only review from future contributor-edit/confirmation workflows.
- `song_profile` should map directly to Creative Details.
- `supporting_materials` should map directly to Supporting Materials.

The frontend should not merely show "missing." It should help the user understand whether the missing item is resolvable here, deferred to another workflow, or only visible as review context.

## 5. Operational Modes Doctrine

### Capture Mode

User question: "What can I add or correct right now?"

May show:

- editable fields
- existing values
- field purpose
- save state
- local validation or gentle missing-context indicators

May contain:

- input controls
- save actions
- add-reference actions
- local fallback states

Must not:

- imply approval
- mix generated intelligence into user-entered truth
- hide what backend gap the field resolves
- force unrelated workflow completion

### Context Mode

User question: "What is already visible about this record?"

May show:

- captured basics
- contributor counts
- material counts
- related read-only summaries
- OOC contextual sufficiency

May contain:

- read-only summaries
- links or anchors to resolving sections
- gentle state labels

Must not:

- become certification
- mutate source modules
- rank hidden priorities
- imply the system has made a decision

### Review Mode

User question: "What should I look at before deciding the next step?"

May show:

- completeness categories
- missing items
- review notes
- contextual sufficiency
- disclaimers

May contain:

- review indicators
- resolving-path links
- explanation of unresolved/future workflows

Must not:

- appear as an approval engine
- certify readiness
- block the user without explanation
- present warnings without an action or reason

### Evidence Mode

User question: "What reference material supports this operational context?"

May show:

- linked supporting materials
- material categories
- reference status
- evidence-adjacent disclaimers

May contain:

- add-reference capture if already supported
- reference-only status
- material count summaries

Must not:

- verify evidence unless verification exists
- claim legal clearance
- become submission readiness
- imply files are authoritative without review

### Action Mode

User question: "What can I do next?"

May show:

- save controls
- add-reference controls
- links to existing flows
- future workflow unavailable messages

May contain:

- explicit user-triggered actions
- clear scope of the action
- success/error state

Must not:

- trigger automation
- create hidden obligations
- change unrelated module state
- overload one action with multiple operational meanings

### Future Intelligence Mode

User question: "What will the system help with later?"

May show:

- placeholders
- coming-later intelligence categories
- clear separation from current user truth

May contain:

- no current operational authority

Must not:

- distract from current capture/review
- imply AI recommendation is active
- mix with required current workflow
- become a substitute for present capture quality

## 6. Recommended Work Detail Flow Model

Do not implement yet. Conceptual model:

1. Summary / Current State
   - Captured basics, current contextual sufficiency, material/contributor counts, and calm status.
   - Should answer: "What is this work, and what state is it in?"

2. Capture Missing Context
   - A guided area or grouped capture model driven by completeness categories.
   - Should prioritize fields that resolve known gaps, especially Song Profile gaps.

3. Contributors & Splits
   - Contributor/split review near any contributor-related completeness concerns.
   - If editing/confirmation is not available, say the workflow is later.

4. Supporting Materials / Evidence References
   - Evidence-adjacent references and add-reference action.
   - Should clearly distinguish reference-only materials from verified evidence.

5. Outcome Context
   - OOC should summarize what is visible after or alongside resolving context.
   - If it names missing context, it should point toward the resolving mode.

6. Operational Completeness / Review
   - Completeness is review-state output and should be close to resolving actions or include explicit resolution paths.
   - It should not feel like a detached audit panel.

7. Future Opportunities / Intelligence
   - Keep separate and visibly non-current.
   - It should not compete with immediate capture and review.

Alternative acceptable model:

- Top command-summary with anchors into mode sections.
- Then mode sections in this order: Capture, Contributors, Materials, Review, Future Intelligence.

The key is not the exact visual layout. The key is that detected state must lead to an intelligible user path.

## 7. Action-Linking Principle

Every detected gap should connect to a resolution path.

Examples:

- Missing `Song Profile: Themes` should point to Creative Details -> Themes.
- Missing `Song Profile: Language` should point to Creative Details -> Language.
- Missing `Song Profile: Clean / explicit` should point to Creative Details -> Clean / explicit.
- Missing `Song Profile: Creative description` should point to Creative Details -> Creative description.
- Missing `Supporting materials: Supporting material reference` should point to Supporting Materials -> Add reference.
- Missing or needs-review split-sheet reference should point to Supporting Materials -> Add reference with split sheet category.
- Contributor confirmation needed should point to Contributors & Splits and explain that confirmation workflow is later if no action exists.
- Split total review should point to Contributors & Splits and explain whether editing is available or deferred.
- Work basics missing should identify whether the current detail page can resolve it or whether the create/edit workflow must be expanded later.

If a resolution is not available yet, the page should say so plainly:

- "Workflow coming later."
- "Visible for review only."
- "Resolve in contributor workflow when available."

No warning should leave the user wondering where to go next.

## 8. Page vs Workspace Decision

The Work Detail page does not need a visual redesign decision yet, but operational logic suggests the current single long page is reaching its limit.

Options:

| Option | Operational fit | Risk |
| --- | --- | --- |
| One long page | Simple and preserves current behavior | High cognitive load as more modules join |
| Section anchors | Good first improvement; preserves page while linking gaps to resolution | Requires careful labels and anchor ordering |
| Grouped cards by mode | Strong operational fit; makes capture/context/review distinct | Can become card clutter if overused |
| Tabs | Good for mode separation | Can hide missing-context resolution if warnings are in another tab |
| Stepper | Useful if there is a true sequence | Risk of forced workflow gating |
| Split-pane summary + resolving sections | Strong for command-center style review | More design complexity |
| Command-center summary with resolving sections | Best future fit for OOC-like surfaces | Must avoid premature orchestration semantics |
| Progressive disclosure | Good for calm UX | Must not hide important missing context |

Near-term doctrine:

- Keep Work Detail as the canonical work-centered page.
- Add mode separation before adding platform-wide command-center behavior.
- Prefer anchors or a summary-to-section pattern before tabs or steppers.
- Avoid stepper semantics unless the backend defines a true sequence.
- Avoid hiding review gaps behind tabs without clear cross-links.

## 9. Reusable Workflow Rules

Reusable local Sentry Sound rules:

- Every detected gap must have a visible resolving path.
- No warning without next action, explanation, or "workflow coming later" label.
- Context-only panels must not imply approval, certification, or readiness authority.
- Future intelligence must not distract from current user task.
- Backend state should map to workflow mode.
- Review states should appear with or after capture/resolution context, not as disconnected warnings.
- Long pages need anchors, mode separation, or summary-to-section linking.
- Missing context should name both the gap and the resolving area.
- Read-only review must clearly distinguish visible state from editable state.
- Evidence-adjacent materials must preserve reference-only language unless verification exists.
- User-entered truth and future generated intelligence must remain separated.
- Save actions should be near the capture mode they save, or the relationship must be obvious.
- Operational logic must preserve calm, non-coercive UX.
- Workflow guidance should reduce mental mapping, not add another layer of interpretation.

## 10. Relationship To Plexicon

Potentially Plexicon-relevant discoveries:

- Backend Truth -> Workflow Design
- State-to-action mapping
- Context Gap -> Resolution Path
- Operational Mode Separation
- Warning-to-intervention proportionality
- Workflow coherence as operational intelligence

These are not promoted doctrine. They are local Sentry Sound discoveries that may deserve Plexicon review later.

Sentry Sound remains runtime/domain authority. Plexicon remains semantic/governance/intelligence authority. This review does not modify Plexicon or universalize local product semantics.

## 11. Candidate Intelligence Check

This pass discovered reusable intelligence worth logging locally:

- Backend Truth -> Workflow Design
- Context Gap -> Resolution Path
- Operational Mode Separation

Entries were added to `docs/governance/PLEXICON-CANDIDATE-INTELLIGENCE-LOG.md` as candidates only.

## 12. Recommended Next Step

Recommended next Codex prompt direction:

> Perform a Work Detail Flow Realignment Design Pass only. Do not implement UI changes. Use the Operational Flow Review Pass to design a revised Work/Song detail page structure where backend completeness categories map to capture, context, review, evidence, and future-intelligence modes; every missing context item has a resolving path or "workflow coming later" explanation; and OOC remains read-only/contextual without becoming orchestration, automation, or approval.
