# Sentry Sound Platform - Development Workflow

## Purpose

This document defines how Sentry Sound Platform development must proceed.

It exists to preserve disciplined engineering, prevent AI drift, and support manual continuation when Codex or AI sessions are unavailable.

## Required Workflow

All platform development must follow this sequence:

1. Confirm active objective
2. Inspect current repository state
3. Inspect relevant files and schema
4. Identify actual current behavior
5. Update current system-state documentation
6. Define bounded task scope
7. Implement only the bounded task
8. Run validation or runtime test
9. Update build log or relevant system doc
10. Commit changes with clear Git message

## Implementation Rules

- backend-first
- governance-aware
- PowerShell-first where possible
- no UI-first development
- no uncontrolled abstractions
- no large unrelated edits
- no implementation without inspection
- no mixing Academy work into Platform stabilization
- no changing schema without documenting intent
- no Codex task without a clear active task reference

## Manual Continuation Rule

Every important development step must be continuable manually from repository files.

This requires:

- master direction document
- active task file
- current system-state file
- build log
- explicit PowerShell commands
- Git commits after bounded work

## Current Platform Priority

The current platform priority is stabilizing the operational music rights capture pipeline.

Immediate focus:

- song/work capture
- contributor capture
- contributor reuse
- split validation
- save pipeline
- update pipeline
- registration readiness alignment
- audit/governance readiness
