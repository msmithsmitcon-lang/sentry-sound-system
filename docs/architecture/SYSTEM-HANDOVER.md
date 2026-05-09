# Sentry Sound System Handover

## Current Phase

Backend-first enterprise SaaS build.

UI is deferred until backend contracts, governance, identity, workflow, analytics, and operational services are stable.

## Completed Identity / Governance Layer

Implemented:

- Clerk authentication
- Google/email sign-in
- Clerk user backend resolution
- user_profiles table
- workspace_user_roles linked to Clerk user IDs
- RBAC roles and permissions
- effective permissions resolver
- authenticated workspace context resolver
- onboarding bootstrap endpoint
- authorization audit events
- workspace invitation issuing
- workspace invitation acceptance

## Current Backend Flow

Clerk session
→ getCurrentClerkUser
→ user_profiles
→ workspace_user_roles
→ workspaces
→ rbac_roles
→ ROLE_PERMISSIONS
→ effective permissions
→ protected APIs

## Confirmed Test Endpoints

- GET /api/authz/me
- GET /api/authz/sync-me-browser-test
- GET /api/onboarding/bootstrap
- GET /api/workspace-context/me
- POST /api/workspace-invitations/create
- POST /api/workspace-invitations/accept

## UI Preparation Note

The dark Sentry Sound dashboard mockup should be treated as a future service-offering and frontend reference map, not as current build priority.

Future UI build should use:

- backend contracts first
- API mapping second
- reusable React/Tailwind/shadcn components third
- visual polish last

AI frontend tools such as v0.dev/Cursor can be used later to generate UI components from the mockup, but only after mapping every visible section to approved backend services.

## Architecture Rule

Do not let UI generation invent backend logic.

Frontend must render existing backend state, permissions, workflows, analytics, finance, file vault, projects, rights, royalties, and invitation systems.

# NEXT CHAT START POINT

## Recommended next build

Protected Finance APIs.

Start with:

1. Guarded finance accounts API
2. Guarded finance transactions API
3. Finance dashboard aggregation API
4. Finance context using workspace + base currency
5. Finance authorization audit checks

## Current architecture confirmed

The following backend layer is complete and tested:

- Clerk authentication
- Clerk backend user resolution
- user_profiles sync
- workspace_user_roles using Clerk user IDs
- RBAC seeded roles/permissions
- effective permissions resolver
- authenticated workspace context
- onboarding bootstrap
- authorization audit events
- workspace invitations
- invitation acceptance
- reusable permission guard wrapper

## Important routing note

Root `/app` is currently the active Next.js router.

`src/app` also exists and should be consolidated later.

For now, API routes should be created under:

`app/api/...`

## Testing preference

Use backend/API/code tests first.

Use browser console only when Clerk browser session cookies are required.

Avoid UI development until backend contracts stabilize.

## UI preparation note

Future UI must map to approved backend services/contracts.

Do not allow AI UI tools to invent backend logic.

Dashboard mockups are service-offering maps and frontend references only.

## Execution Style / Workflow Rules

Preferred workflow:

- PowerShell-first implementation guidance
- Combine steps into completed commands where possible
- Backend/system logic first
- Automated/code/API testing before browser/UI testing
- Browser/manual testing only when auth/session cookies require it
- UI last after contracts stabilize
- Documentation updates are mandatory during builds
- Update:
  - docs/build-log/BUILD-LOG.md
  - docs/architecture/*
  - relevant module docs
- Maintain handover continuity for future chats
- Keep responses concise, operational, and execution-focused

## Future UI Preparation Strategy

Reference uploaded UI/dashboard mockups and Gemini/Vibe-coding guidance later during frontend phase.

Important rules:

- UI generation must map to existing backend contracts/services
- AI frontend tools may generate components/layouts only
- Backend logic/workflows/governance must never be invented by UI tooling
- Use backend state/contracts as source of truth
- Future preferred stack:
  - Next.js
  - Tailwind
  - shadcn/ui
  - reusable operational SaaS components
- Potential future tooling:
  - v0.dev
  - Cursor
  - Lovable
  - Bolt
- UI should eventually reflect:
  - RBAC
  - workflow state
  - analytics
  - finance
  - royalties
  - rights lifecycle
  - approvals
  - notifications
  - file vault
  - operational dashboards

## Architecture Direction

Sentry Sound is evolving into a full operational governance SaaS platform, not merely a royalty tracker.

Backend governance and operational orchestration remain the highest priority.
