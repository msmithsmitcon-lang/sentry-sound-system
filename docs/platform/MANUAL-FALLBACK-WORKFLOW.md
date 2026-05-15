# Sentry Sound Platform - Manual Fallback Workflow

## Purpose

This document preserves a manual continuation path if VS Code AI, Roo Code, Codex, or other AI tooling is unavailable, rate limited, or unreliable.

## Manual Workflow

1. Read active platform docs in docs/platform/
2. Confirm current active task
3. Inspect files manually using PowerShell
4. Make small bounded edits
5. Run validation
6. Update system-state or build log
7. Commit bounded work

## PowerShell Inspection Pattern

Use PowerShell to inspect files and copy results to clipboard for ChatGPT review.

## SQL Rule

SQL must be manually reviewed and executed by the user.

## Git Rule

Commit after bounded successful work.

## Rollback Rule

If AI-generated work causes instability:

1. stop further changes
2. inspect git status
3. identify changed files
4. restore or revert only the faulty bounded task
5. preserve committed governance docs

## Safety Rule

Manual fallback must always remain possible.
