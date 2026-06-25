# CLAUDE.md — Sentry Sound Master Governance File
# Read this file before every single action. No exceptions.

---

## What Sentry Sound Is

Sentry Sound is a multi-tenant music operations and compliance platform built
for South African artists, labels, and music businesses.

It is NOT a DAW (digital audio workstation). It does NOT compete with Reaper,
Logic, or Ableton.

Sentry Sound is an **Operational Governance Platform** that manages:
- Song registration and lifecycle (Draft → In Review → Mastered → Released)
- Artist and contributor management
- Audio file vault (WAV, MP3, stems, cover art)
- Royalty tracking, statements, and payouts
- Production projects and studio sessions
- South African compliance (SAMRO, CAPASSO, SAMPRA, RAV, CIPC)
- Multi-step song registration wizard
- Team and RBAC (role-based access control)

---

## Authority Structure

**Markus** — Final approval on all architecture, product direction, and scope
decisions. Nothing deploys without Markus approval.

**Claude Code** — Bounded execution only. Reads this file first. Builds what
is approved. Reports what it built. Never invents new subsystems.

---

## Tech Stack — Do Not Change Without Markus Approval

| Layer | Technology |
|---|---|
| Frontend | Next.js + Tailwind CSS + shadcn/ui |
| Backend | Supabase (PostgreSQL + Edge Functions) |
| ORM | Prisma |
| Auth | Supabase Auth with RLS |
| File Storage | Supabase Storage |
| Deployment | Vercel |
| Language | TypeScript throughout |

---

## Current Repository Structure

```
sentry-sound-system/     ← PRIMARY repo — build everything here
  prisma/                ← Database schema and migrations
  public/                ← Static assets including logo
  scripts/               ← Utility scripts
  sql/                   ← Raw SQL including RLS policies
  src/                   ← Application source code
  supabase/              ← Supabase config, migrations, edge functions
  tests/                 ← Test suite
  AGENTS.md              ← Agent instructions (supplement to this file)

sentry-sound-website/    ← Marketing/public website — separate concern
SENTRY_SOUND_ACADEMY/    ← Education product — separate concern
```

---

## UI Reference

The canonical UI design is the dashboard mockup showing:
- Top stats: Total Songs, Total Streams, Total Royalties, Active Projects
- Sidebar: Music / Production / Finance / Settings sections
- Quick Actions: Add New Song, Upload Files, New Project, Invite Artist
- Recent Songs list with status badges
- File Vault panel
- Calendar widget
- Recent Activity feed
- Add New Song wizard (4 steps: Song Info, Audio Files, Contributors, Review)

**This mockup is the source of truth for all frontend work.**
Do not redesign. Do not invent new layouts. Build exactly this.

---

## South African Compliance Modules

Sentry Sound must support these registration bodies:

| Body | Purpose | Export Format |
|---|---|---|
| SAMRO | Composition royalties | CWR XML or CSV |
| CAPASSO | Mechanical royalties | Mirrors SAMRO splits |
| SAMPRA | Recording/performer royalties | Excel/CSV + Session Log |
| RAV | Music video broadcasting royalties | Metadata CSV |
| CIPC | Cinematographic film registration | PDF (CoR 40.1) |

Key data requirements:
- ISWC (International Standard Musical Work Code) for compositions
- ISRC (International Standard Recording Code) for recordings
- Video ISRC (separate from audio ISRC) for music videos
- CAE/IPI numbers for SAMRO contributors
- Publisher share max 50% enforced in split logic
- Performer roles: Featured / Session / Producer (SAMPRA)

---

## Database Principles

- Musical works are the core entity
- Every work has contributors with explicit split percentages
- Splits must sum to 100% — enforce at schema level
- All audio files are immutable once ingested — never overwrite source
- Every action must be traceable — audit log is mandatory
- RLS enforces tenant isolation — users only see their own data
- Schema versioning is required — never drop columns, only add

---

## Execution Rules

1. Read this file before every task
2. Check AGENTS.md for any task-specific overrides
3. State what you are about to do before doing it
4. Make one bounded change at a time
5. Run linter and type checks after every file change
6. Update the build log after completing a task
7. Never touch sentry-sound-website or SENTRY_SOUND_ACADEMY unless
   Markus explicitly instructs
8. Never invent new modules not listed in this file
9. Never change the tech stack
10. If anything is unclear — stop and ask Markus

---

## Forbidden Actions

- Do not redesign the UI — the mockup is final
- Do not add MIDI, piano roll, or DAW features
- Do not add provider lock-in beyond the approved stack
- Do not create hidden runtime logic
- Do not deploy to production without Markus approval
- Do not modify RLS policies without explicit instruction
- Do not delete or overwrite source audio files

---

## Current Priority — Complete Sentry Sound V1

The goal is a working, deployable V1 that delivers:
1. Song registration with full metadata
2. File vault with upload and retrieval
3. Royalty tracking and statements
4. South African compliance export (SAMRO/CAPASSO minimum)
5. Multi-tenant RBAC with team management
6. The dashboard UI matching the approved mockup exactly

Everything else is out of scope for V1.
