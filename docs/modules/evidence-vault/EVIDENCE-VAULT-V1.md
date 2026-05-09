# Evidence Vault V1

## Purpose

Evidence Vault V1 is the deterministic evidence governance layer for Sentry Sound.

It supports:
- proof-before-submission
- proof-before-payout
- evidence verification
- evidence supersession
- chain-of-custody history
- audit-grade reconstruction
- regulator submission defensibility
- royalty eligibility gating

## Architectural Fit

Evidence Vault does NOT replace:
- registration readiness
- submission queues
- royalty engine
- finance ERP

Evidence Vault supports them by providing trusted evidence state.

## Existing Foundation

Existing model:
- RegistrationEvidence

Current fields already support:
- evidenceType
- layer
- requirementLevel
- verificationStatus
- signature requirement
- verification requirement
- blocking submission logic
- related entity linking
- related submission linking
- supersededByEvidenceId
- metadata

## V1 Scope

Evidence Vault V1 will add system logic around:
- evidence classification
- required evidence rules
- verification state transitions
- supersession rules
- audit event generation
- readiness impact
- submission-pack inclusion
- royalty eligibility impact

## Deferred

Do NOT build yet:
- UI upload forms
- dashboards
- file storage provider integration
- OCR
- AI verification
- external signing integrations
