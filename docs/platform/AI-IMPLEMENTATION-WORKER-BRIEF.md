# Sentry Sound Platform - AI Implementation Worker Brief

## Read This First

Any VS Code AI implementation worker must read these files before making changes:

1. docs/platform/MASTER-DIRECTION-AND-SYSTEM-IDENTITY.md
2. docs/platform/MASTER-SYSTEM-REFERENCE.md
3. docs/platform/DEVELOPMENT-WORKFLOW.md
4. docs/platform/BACKEND-CAPABILITY-ALIGNMENT-MAP.md
5. docs/platform/BACKEND-CAPABILITY-AUDIT.md
6. docs/platform/TARGET-OPERATIONAL-CAPTURE-ARCHITECTURE.md
7. docs/platform/CANONICAL-PERSISTENCE-DIRECTION.md
8. docs/platform/CAPTURE-STABILIZATION-SEQUENCE.md
9. docs/platform/CREATE-SONG-BOUNDARY-REFACTOR-PLAN.md
10. docs/platform/UI-GENERATION-GOVERNANCE.md
11. docs/platform/AI-DEVELOPMENT-WORKFLOW-GOVERNANCE.md

## Current Active Phase

Phase 1 - Operational Boundary Stabilization.

## Current Implementation Target

Create Song Boundary Refactor.

## Do Not Touch Unless Explicitly Approved

- academy directories
- runtime worker systems
- schema migrations
- finance systems
- unrelated UI
- temp experiments

## Expected Worker Behavior

- inspect current files first
- summarize findings
- implement only approved bounded task
- avoid schema changes unless approved
- keep changes small
- update docs when relevant
- preserve current working behavior

## Current Target Architecture

UI -> API Route -> Capture Service -> Validation Layer -> Repository Layer -> Persistence -> Readiness Evaluation -> Workflow Resolution -> Audit Events
