# Sentry Sound Platform - AI Development Workflow Governance

## Purpose

This document defines how AI tools inside VS Code may assist Sentry Sound Platform development.

AI may accelerate implementation, but must not replace architecture, governance, or user approval.

## Role Structure

### ChatGPT

Role: Architect, controller, governance layer, and canonical source of truth.

Responsibilities:

- define architecture
- define contracts
- define implementation order
- maintain platform consistency
- review generated outputs
- prevent architectural drift
- generate controlled SQL and PowerShell instructions

### Roo Code / VS Code AI

Role: Repo-aware implementation worker.

Responsibilities:

- inspect files
- summarize repository structure
- implement approved bounded tasks
- perform repetitive coding work
- assist debugging
- update files under instruction

Roo Code must not:

- invent architecture
- redesign systems
- invent schema
- bypass approved contracts
- introduce competing runtime patterns
- create hidden abstractions

### User

Role: final authority and SQL approval layer.

Responsibilities:

- approve schema changes
- execute SQL manually
- approve production-impacting changes
- validate architectural direction
- preserve operational control

## Operating Principle

AI should accelerate implementation, not replace architecture.

## Required Rules

- inspect before modifying
- backend before UI
- contracts before components
- documentation is part of the system
- SQL is prepared by AI but executed manually by user
- no uncontrolled AI drift
