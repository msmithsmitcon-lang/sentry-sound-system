# SENTRY SOUND UX DOCTRINE AND REDESIGN BRIEF V1
# Authority: Markus Wesley Ivan Smith — Plexicon (Pty) Ltd
# Status: APPROVED — Governs all frontend implementation
# Created: 2026-06-22

---

## THE DESIGN OBJECTIVE

Make artists feel like they finally have a professional 
music company behind them — even if they're working alone.

This is not a usability goal. This is an identity goal.
Every screen, every label, every CTA must reinforce this.

---

## THE CORE PLATFORM PHILOSOPHY

The artist thinks they are moving their music forward.
The platform knows it is building an operational asset.

These are the same action described in two different languages.
Sentry Sound always speaks the artist's language.
The platform complexity is invisible.

---

## THE LANGUAGE DOCTRINE

### Never say — Always say

| Never say | Always say |
|---|---|
| Create a Musical Work | Start a Music Project |
| Register a Work | Protect Your Music |
| Contributor Split Sheet | Who helped you make this? |
| CMO Submission Pack | Your registration is ready to file |
| Evidence Artifact | Proof of creation |
| Work ID | Your project |
| Registration Status | Protection status |
| Workspace | Your music business |
| Musical Work | Song / Track / Release |
| Actor | Artist / Producer / Collaborator |

---

## THE NAVIGATION DOCTRINE

Navigation represents what the artist OWNS — not platform 
modules, not backend architecture, not linear workflow steps.

### Canonical Navigation Structure

- **Home** — Operational overview of their music business
- **My Projects** — All songs and releases with live status
- **My Team** — Contributors, artists, producers, publishers
- **My Protection** — Evidence, registrations, certificates
- **My Releases** — Distribution and release management
- **My Royalties** — Income, statements, tracking
- **My Business** — Finance, contracts, CRM, marketing (expandable)

### Why this structure

It allows Sentry Sound to expand naturally from a rights 
platform to a full music business operating system without 
renaming navigation. Each section grows with the product.

### What is removed immediately

- Any navigation item labelled TEST
- Any navigation item labelled PLANNED
- Any navigation item labelled FUTURE
- Any navigation item labelled STATIC
- These labels destroy trust. Remove them entirely.

---

## THE ADAPTIVE INTERFACE DOCTRINE

The interface evolves with the artist's business stage.

### Stage 1 — New Artist (zero projects registered)
Shows: Mission Control welcome screen
Goal: Complete first project
Feeling: Guided, safe, understood

### Stage 2 — Growing Artist (1-5 projects registered)
Shows: Project workspace with status tracking
Goal: Manage active projects, complete submissions
Feeling: In control, organised, professional

### Stage 3 — Established Artist/Label (5+ projects)
Shows: Full operational command centre
Goal: Business overview, royalty tracking, team management
Feeling: Running a real music business

This is the Plexicon adaptive intelligence pattern (Patent 2)
applied to a music business interface. The platform detects
stage from data and adapts automatically.

---

## THE FIRST-TIME EXPERIENCE

### Mission Control Welcome Screen

Triggered when: Artist has zero registered projects.
Replaces: The current dashboard entirely.

Layout:
- Clean, full-screen, no sidebar navigation visible
- Sentry Sound logo top left
- Artist name top right
- No charts, no empty widgets, no KPIs showing zero
- No "No data available" states
- No billing warnings on first screen
- No setup progress percentages

Content:
```
Welcome to your music business, [First Name].

We'll help you organise, protect, and manage 
your music professionally.

Your first project takes about 15 minutes.

[Start My First Music Project →]  ← PRIMARY CTA

───────────────────────────────────

What happens when you create a project:

✓ Your song gets an official protected record
✓ Your contributors and splits are documented
✓ Your files are stored with proof of creation
✓ You receive a SAMRO/CAPASSO/SAMPRA submission pack
✓ You get a shareable proof-of-collaboration certificate
```

Secondary element (bottom, small):
```
Already have songs? [Import existing work →]
```

### What happens after first project is complete

The dashboard transforms into the operational command centre.
The Mission Control screen never appears again.
The full navigation becomes visible.

---

## THE PROJECT JOURNEY EXPERIENCE

### What the artist experiences (their language)

Step 1 — "Tell me about your song"
- Song title, genre (dropdown with canonical 15 values),
  mood, language, BPM, release date
- Label: "Basic song information"

Step 2 — "Who helped you make it?"
- Add contributors by name or email
- Assign roles: Artist / Producer / Songwriter / Featured Artist
- Label: "Your collaborators"

Step 3 — "Let's make sure everyone gets their fair share"
- Assign split percentages
- Visual indicator: must reach 100%
- Plain language: "Kabza gets 30%, you get 70%"
- Label: "Split agreement"

Step 4 — "Upload your files"
- WAV master, MP3, stems, cover art
- SHA-256 fingerprint shown: "Your file is uniquely identified"
- Label: "Your music files"

Step 5 — "Your protection certificate is ready"
- Show the certificate
- Shareable link
- Download PDF
- Label: "Proof of creation"

Step 6 — "Your submission pack is ready"
- SAMRO + CAPASSO + SAMPRA files
- Checklist with instructions
- Download button
- Label: "File with the collecting societies"

### What the platform does invisibly

- Creates musical_works record with canonical genre enum
- Creates contributor records with workspace isolation
- Validates splits sum to 100% at service layer
- Computes SHA-256 hash of uploaded audio file
- Creates collaboration_certificate record
- Logs PlexiconDecisionEventV1 at each milestone
- Logs plexicon.domain.music.song_registration.registered.v1
- Logs plexicon.domain.music.collaboration_proof.issued.v1
- Logs plexicon.domain.music.submission_pack.generated.v1

---

## THE DASHBOARD — POST FIRST PROJECT

### Home screen for an artist with active projects

Header:
```
Your music business — [Workspace Name]
[+ New Project]
```

Active Projects panel (primary focus):
```
Midnight Drive — Luna Way
● Protected  ✓ Certificate issued
● CMO Pack ready to download
[Download Submission Pack]

Better Days — Jay Nova  
⚠ Waiting for Jay Nova to confirm split
[Send Reminder]

No Turning Back — Evolve
● Released  Royalties being tracked
[View Royalties]
```

Status language (replace all technical terms):
- draft → In Progress
- needs_review → Needs Attention  
- ready_for_submission → Ready to File
- submitted → Filed with CMO
- registered → Protected ✓
- released → Released ✓

Right panel — Quick Actions:
```
[+ Start New Project]
[Invite a Collaborator]
[Download All Pending Packs]
```

Right panel — Attention Items (only real blockers):
```
⚠ Jay Nova hasn't confirmed his split on Better Days
  [Send WhatsApp Reminder] [Send Email Reminder]
```

Remove permanently:
- "Workspace profile is not complete" (handle in onboarding)
- "Billing and production plan activation" (deferred to V1.5)
- "Production dashboard metrics are deferred" (remove entirely)
- All placeholder text and shell labels
- "Customer dashboard shell" label

---

## IMPLEMENTATION INSTRUCTIONS FOR CLAUDE CODE

### Phase 1 — Mission Control welcome screen

Create: app/dashboard/page.tsx (replace current)

Logic:
- Check if authenticated user has any musical_works records
- If zero: render Mission Control welcome screen
- If one or more: render operational dashboard

Mission Control must be:
- Full screen, no sidebar
- Single primary CTA: "Start My First Music Project"
- Clean, professional, no placeholder data
- Mobile responsive

### Phase 2 — Navigation rebuild

Update: the sidebar navigation component

Replace current navigation with canonical structure:
- Home → /dashboard
- My Projects → /dashboard/projects
- My Team → /dashboard/team
- My Protection → /dashboard/protection
- My Releases → /dashboard/releases
- My Royalties → /dashboard/royalties
- My Business → /dashboard/business

Remove all TEST / PLANNED / FUTURE / STATIC badges.
Navigation items that aren't built yet: show them but 
mark as "Coming soon" in a subtle way — never TEST.

### Phase 3 — Language audit

Search and replace across all dashboard UI files:
- "Musical Work" → "Project" or "Song"
- "Create a Musical Work" → "Start a New Project"
- "Split Sheet" → "Revenue Agreement"  
- "CMO Submission" → "Registration Filing"
- "Workspace" (where user-facing) → "Music Business"
- "Actor" → "Artist" or "Collaborator"
- Remove all technical status codes shown to users

### Phase 4 — Dashboard home (post-project state)

Update: the dashboard home to show active projects
with plain-language status and clear next actions.
Wire to real data from musical_works table.
No placeholder metrics. No empty state charts.
Real data or nothing.

### Phase 5 — Commit and report

Commit each phase separately:
- "feat: Mission Control first-time welcome experience"
- "feat: rebuild navigation to artist-owned structure"  
- "fix: language audit — replace technical terms with artist language"
- "feat: dashboard home with live project status"

Report what a first-time artist can now experience
end to end.

---

## GOVERNING PRINCIPLE

Every screen asks: does this make the artist feel like 
they have a professional music company behind them?

If yes: ship it.
If no: redesign it.

This question overrides all technical preferences,
all placeholder states, and all "we'll fix it later" 
decisions.

The artist experience is the product.
