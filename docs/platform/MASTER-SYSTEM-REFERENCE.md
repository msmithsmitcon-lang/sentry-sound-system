# Sentry Sound Platform - Master System Reference

## Product Purpose

Sentry Sound Platform is a governed music rights and royalty operations platform for:

- artists
- producers
- composers
- labels
- publishers
- managers
- rights administrators
- music companies

It is not a training product.

## Core Platform Objective

Enable users to capture, manage, validate, govern, and operationalize music rights data.

Core operational pipeline:

1. Song / Work Capture
2. Contributor Capture
3. Split Validation
4. Rights Metadata
5. Recording / Release Linking
6. Evidence Capture
7. Registration Readiness
8. Compliance Packaging
9. Royalty / Finance Operations
10. Audit + Governance Records

## Engineering Method

Development must remain:

- backend-first
- governance-aware
- PowerShell-first
- repository-memory-driven
- task-by-task
- bounded
- Git-traceable
- manually continuable
- no uncontrolled AI drift

## Current Stabilization Priority

Do not build new features first.

First stabilize:

1. current repository state
2. backend structure
3. Supabase schema state
4. music/song capture flow
5. contributor flow
6. save/update pipeline
7. broken or incomplete flows
8. minimum operational music capture pipeline
9. technical debt risks
10. current system-state documentation

## Boundary Rule

Sentry Sound Academy content must not drive this platform build.

Academy may be ignored unless platform training documentation is explicitly required later.

## Source-of-Truth Rule

Before implementation:

- inspect existing files
- inspect current schema
- inspect current docs
- identify actual working state
- update system-state docs
- then implement bounded changes
