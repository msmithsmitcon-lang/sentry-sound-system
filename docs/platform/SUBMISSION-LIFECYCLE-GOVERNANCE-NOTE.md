# Submission Lifecycle Governance Note

Date: 2026-05-16

## Purpose

This note prevents future drift.

The current status update route is for prototype/backend testing only.

It must NOT be treated as the final business process.

## Current Prototype

Created:

- POST /api/submissions/create-from-work
- GET /api/submissions/pending
- POST /api/submissions/update-status

These prove the vertical slice:

captured work
? submission queue item
? duplicate prevention
? pending/queued retrieval
? status movement test

## Important Architecture Rule

Submission status changes must eventually be controlled by backend operational events, not casual manual UI clicks.

Final lifecycle should be driven by:

- readiness validation
- required identifier checks
- ISRC / ISWC / IPI / internal ID governance
- export/package generation
- dispatch confirmation
- industry-body response
- admin verification where unavoidable
- remediation workflow
- audit events
- evidence records
- regulator references
- timestamped status history
- actor/source tracking

## Status Meaning

queued = ready for processing  
submitted = dispatch/export process confirmed submission  
accepted = industry body/admin verified acceptance  
rejected = industry body/admin verified rejection  
failed = system or dispatch error  
remediation = missing/incorrect data must be fixed before progress

## Warning

Do not expand manual status editing as a final feature.

The current update-status route is a test doorway only.

## Next Required Future Layer

Before real industry submission:

- add submission readiness gate
- add identifier/code governance
- prevent duplicate industry submissions
- create status event/audit history
- enforce allowed lifecycle transitions

