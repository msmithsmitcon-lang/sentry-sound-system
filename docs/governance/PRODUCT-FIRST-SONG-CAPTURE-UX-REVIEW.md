# Product-First Song Capture UX Review

Date: 2026-05-26

Status: Product-first UX review and small implementation plan only. No runtime implementation performed.

## 1. Review Question

Simple user goal:

> A user wants to capture a song.

Review stance:

- product-first
- usability-first
- backend-grounded
- Plexicon-informed
- OEF-staged
- doctrine quiet

The user should feel like they are capturing and managing a song, not operating an intelligence framework.

## 2. Concise Route Map

Current route flow:

| Route | Current role | User-facing issue |
| --- | --- | --- |
| `/dashboard` | Entry point with `Add Work` CTA and module cards | Clear entry exists, but dashboard has many module/status concepts around a simple song-capture goal. |
| `/dashboard/works` | Works/Songs command page | Useful hub, but too much lifecycle/module/coach language competes with the simple task. |
| `/dashboard/works/new` | Current primary create/capture page | Captures title, genre, mood, contributors, and splits. Step 0 is useful but feels governance-heavy. |
| `/dashboard/works/list` | Existing works table | Good continuation path, but secondary for a user who just wants to capture a song. |
| `/dashboard/works/details/[workId]` | Song Profile / management detail page | Powerful management page, but current first impression is system-heavy: tabs, progress donuts, OOC, completeness, missing context, save status, and future opportunities. |

## 3. Ideal Simple User Flow

Ideal flow for capturing a song:

1. User clicks `Add Song` or `Add Work` from dashboard or Works/Songs.
2. User quickly checks whether the song already exists.
3. User enters only the minimum song capture fields:
   - title
   - genre
   - mood
   - contributor names/roles
   - split percentages
4. User saves the song.
5. App confirms the saved song in plain language.
6. User lands on the saved song page, focused on the next natural capture step:
   - continue adding song details
   - review contributors/splits
   - add supporting material later
7. System intelligence remains quiet and supportive:
   - show simple progress/context only after the user has a saved record
   - show missing context as helpful next actions, not an audit-like warning layer

The key product principle:

**Create first, then manage.**

## 4. What Currently Works Well

The app already has the right foundations:

- Dashboard has an `Add Work` CTA that routes to `/dashboard/works/new`.
- Works/Songs has clear `Create New Work` and `Continue Existing Work` choices.
- Create page uses backend truth through `POST /api/songs/create`.
- Create page saves a workspace-owned draft and returns a `work_id`.
- Create page shows a successful `Open Song Profile` continuation action.
- Duplicate awareness exists before create, which is good product logic.
- Contributors and splits are captured early.
- Split total feedback is visible before save.
- Existing works can be opened from recent lists and table rows.
- Detail page has useful management modules: captured basics, contributors, creative details, supporting materials, completeness, and OOC context.
- Missing-context actions already route users to the relevant detail tab.

## 5. What Feels Confusing Or Too System-Heavy

The current flow has too much system vocabulary around a simple first task.

Confusing or heavy areas:

- `Add Work` and `Create New Work` are technically accurate, but a music user may think in terms of `song` first.
- `/dashboard/works` mixes song capture with lifecycle map, modules, workflow coach, operational path, finance, actions, readiness, submissions, identifiers, royalties, and future intelligence.
- `/dashboard/works/new` uses phrases like `Step 0`, `duplicate governance`, `workspace-owned draft`, `governed create flow`, `backend-managed`, and `production submission protection`.
- The create page's right column explains field architecture and future backend concepts while the user is trying to enter a song.
- After save, the user gets good actions, but the ideal primary action should be unmistakable: continue editing this song.
- The detail page opens on `Captured Basics`, while the next natural user task after create is often `Creative Details`.
- Detail page progress donuts and system panels are useful, but can dominate the first impression.
- `Outcome Context` and `Operational Completeness` are conceptually correct but may feel like review/audit surfaces too early for a user who just saved a song.
- Save behavior for Creative Details lives in the right aside, separate from the editable fields, which can make the user hunt for the save action.
- `Song Opportunities` appears as a tab even though it is future/non-active, which can distract from core capture.

## 6. Where The User Loses Continuity

Continuity weak spots:

- Dashboard says `Add Work`, Works says `Create New Work`, detail says `Song Profile`; the naming changes across the flow.
- Works overview acts like a command center before the user has finished a simple capture task.
- Create page locks capture until duplicate check is complete, but the language frames this as governance instead of a simple check.
- After saving, the create page does not automatically move the user into the next capture step.
- On the detail page, the user's next editable task is not visually primary because `Creative Details` is just one tab among seven.
- Missing-context actions can route the user to tabs, but the page does not yet feel like a natural continuation of the create flow.
- Save status for Creative Details is separated from the fields it saves.

## 7. Steps That Should Be Simplified

Simplify the route experience:

- Dashboard primary CTA should read closer to the user's intent, such as `Add Song`.
- Works/Songs should emphasize two clear jobs:
  - create a new song
  - continue an existing song
- Create page should use friendlier language:
  - `Check if this song already exists`
  - `Song basics`
  - `Contributors and splits`
  - `Review and save`
- Move field architecture, backend-managed explanations, and future field lists out of the primary create experience.
- After save, make `Continue to Song Details` the dominant next action.
- Detail page should make the next editable capture step obvious.
- Keep future/intelligence surfaces behind lower-priority placement.

## 8. System Intelligence That Should Stay Hidden Or Quiet

Keep quiet:

- Plexicon/OEF/doctrine terminology
- OOC as a named concept in primary task language
- operational cognition language
- governance-gated progression language
- backend field architecture explanations
- future AI/helper concepts
- future identifiers/royalties/submissions unless needed
- progress/completeness as anything resembling approval
- readiness/compliance wording during basic song capture

Show quietly when useful:

- duplicate check result
- save success/failure
- split total
- required missing fields
- contributor count
- supporting material count
- simple next action
- contextual progress labeled as profile/capture progress only

## 9. Primary Capture Page

Primary capture page should be:

**`/dashboard/works/new`**

Its product role:

- fast song/work creation
- duplicate awareness
- essential song fields
- contributors and splits
- save draft

It should not be:

- the full work management page
- a governance explainer
- a field architecture map
- a future modules preview
- an evidence/readiness/submission page

## 10. Management / Detail Page

Management/detail page should be:

**`/dashboard/works/details/[workId]`**

Its product role:

- manage the saved song
- continue creative details
- review contributors and splits
- add supporting materials
- understand missing context
- see contextual profile progress
- prepare for later readiness/evidence/submission workflows without claiming them

It should not be:

- the first capture surface
- a doctrine dashboard
- an approval/certification surface
- an AI/orchestration surface
- a command center before the product flow needs one

## 11. What Should Happen Immediately After Creation

After a song is created:

1. Show a clear success state:
   - `Song saved`
   - include title and contributor/split summary where available
2. Offer one dominant next action:
   - `Continue to Song Details`
3. Route or focus the user toward the next natural detail task:
   - preferably `Creative Details`
   - secondarily `Contributors & Splits` if split/contributor review is needed
4. Keep secondary actions available:
   - `Add another song`
   - `View all songs`
5. Avoid showing readiness, compliance, OOC, submissions, or future intelligence as the immediate next concern.

## 12. Recommended Improved Flow

Recommended product flow:

```text
/dashboard
  -> Add Song

/dashboard/works/new
  -> Check if this song already exists
  -> Song basics
  -> Contributors and splits
  -> Review and save

Save success
  -> Continue to Song Details

/dashboard/works/details/[workId]?tab=creative-details
  -> Creative Details as the next capture step
  -> simple profile progress
  -> quiet missing-context actions
  -> management tabs available but not visually overwhelming
```

## 13. Smallest Safe Implementation Slice

Smallest safe implementation slice:

**Post-create continuation and language simplification.**

Scope:

- Frontend only.
- Existing routes only.
- Existing data only.
- No backend changes.
- No schema/API changes.
- No AI, automation, orchestration, or Plexicon runtime work.

Implementation sequence:

1. Rename user-facing primary CTAs from `Add Work` / `Create New Work` toward `Add Song` or `Add Song / Work` where the user is starting capture.
2. Simplify `/dashboard/works/new` language:
   - `Step 0` becomes `Check if this song already exists`.
   - `Work identity` becomes `Song basics`.
   - `Review draft` becomes `Review and save`.
   - Reduce right-column field architecture/future-system explanations.
3. After successful save, make `Continue to Song Details` the dominant action.
4. Pass a tab hint to detail, for example `?tab=creative-details`, or otherwise land/focus the user on Creative Details after create.
5. Keep secondary actions:
   - `Add another song`
   - `View all songs`

Do not include in the first slice:

- new APIs
- schemas
- backend logic
- contributor editing
- new evidence behavior
- readiness certification
- automation
- AI
- orchestration
- Plexicon runtime integration
- major Work Detail redesign

## 14. Current Flow Diagnosis

Diagnosis:

The app is structurally close. The backend-grounded capture path exists and the saved work can be continued. The main problem is not missing capability; it is product-language and continuity friction.

For a simple user goal, the interface currently presents too many system layers too early. The correct product correction is to reduce vocabulary, make the create page feel like song capture, make post-create continuation obvious, and keep the richer detail intelligence available after the user has a saved song.

## 15. Recommended First Small Implementation Slice

Recommended first slice:

**Make song creation feel like song creation.**

Practical first task:

- Update user-facing copy and post-save continuation on `/dashboard/works/new`.
- Keep the create API and all backend behavior unchanged.
- Keep the Work Detail intelligence intact, but route/focus the user toward `Creative Details` after save.

This is the smallest change with the highest user-experience impact.
