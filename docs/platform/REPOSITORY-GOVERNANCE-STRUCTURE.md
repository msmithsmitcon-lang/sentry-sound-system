# Sentry Sound Platform - Repository Governance Structure

## Purpose

This document defines the governed repository structure for Sentry Sound Platform.

It exists to:

- reduce architectural drift
- preserve repository memory
- support Codex continuation
- support bounded implementation
- maintain operational clarity
- separate active systems safely
- preserve long-term maintainability

## Primary Repository Areas

### docs/

Purpose:

Canonical repository memory and architecture governance.

Contains:

- platform direction
- architecture references
- system-state documents
- build logs
- operational governance
- stabilization planning
- bounded task references

### docs/platform/

Purpose:

Canonical platform governance and stabilization documents.

Key files:

- MASTER-DIRECTION-AND-SYSTEM-IDENTITY.md
- MASTER-SYSTEM-REFERENCE.md
- CURRENT-SYSTEM-STATE.md
- ACTIVE-TASK.md

### src/

Purpose:

Primary application and backend implementation.

Must contain:

- operational logic
- backend services
- API routes
- workflow orchestration
- frontend operational interfaces

### src/lib/

Purpose:

Governed reusable backend domain logic.

Examples:

- registration services
- repositories
- governance logic
- workflow engines
- validation systems
- orchestration services

### src/app/

Purpose:

Application routing and operational interfaces.

UI must remain operational-interface driven, not business-logic driven.

### prisma/

Purpose:

Canonical Prisma schema and ORM governance.

### supabase/

Purpose:

Supabase operational database governance.

Contains:

- migrations
- manual SQL
- operational DB scripts

### scripts/

Purpose:

Inspection, repair, migration, validation, and operational tooling.

Scripts must remain bounded and task-specific.

### temp/

Purpose:

Temporary experimentation only.

Must not become permanent architecture.

### database/

Purpose:

Reserved for future governed database references, exports, snapshots, or operational schema artifacts.

## Governance Rules

### Rule 1

Do not mix unrelated implementation tracks.

### Rule 2

Do not implement before inspection.

### Rule 3

Operational workflows must align to platform direction documents.

### Rule 4

Repository memory documents must be updated during stabilization phases.

### Rule 5

Large architectural expansion must be bounded by active-task governance.

### Rule 6

UI must not become the source of operational truth.

### Rule 7

Backend workflows and governed operational assets define system truth.

## Current Stabilization Focus

The current stabilization focus is:

- operational music capture
- contributor management
- split governance
- save/update pipelines
- registration alignment
- operational integrity
- repository stabilization
- reduction of architectural drift
