# File / Document Vault Module

## Purpose
The File Vault is the secure document and asset-file layer for contracts, KYC, proof of ownership, split sheets, masters, artwork, release files, and compliance evidence.

## Core principle
Files must link to operational records without duplicating business logic.

Independent Module Integrity:
The File Vault and Supporting Materials layer must remain useful as a standalone workspace-owned reference/document surface. It may integrate with readiness, submissions, legal governance, finance, releases, and AI later, but basic file/reference value must not depend on those modules. User-facing language must not imply legal clearance, verified evidence, submission approval, or regulator readiness unless those governed modules and backend contracts are active.

## Core entities
- file_vault_items
- file_vault_links
- file_vault_versions
- file_vault_audit_events

## Design rules
- workspace-scoped
- record-linkable
- version-aware
- audit-ready
- access-control ready
- storage-provider agnostic
- international-ready

## File categories
- contract
- identity_kyc
- proof_of_ownership
- split_sheet
- master_audio
- artwork
- release_document
- compliance
- invoice
- statement
- other

## Strategic links
Files may link to:
- CRM contacts
- artist profiles
- contributors
- rights assets
- contracts
- releases
- distribution releases
- finance records

## Next build unit
Create File Vault database schema.

# File Vault Schema Status

## Completed
- file_vault_items
- file_vault_links
- file_vault_versions
- file_vault_audit_events

## Strategic architecture
The File Vault now supports:
- workspace-scoped storage metadata
- linked operational records
- version-aware files
- storage-provider abstraction
- auditability
- future access-control expansion

## Linked record strategy
Files can attach to any operational entity using:
- linked_record_type
- linked_record_id

## Next build unit
File Vault service layer.

## Service layer

### Services added
- createFileVaultItem
- linkFileVaultItem
- addFileVaultVersion

## Backend rules
- Files are workspace-scoped.
- Files store metadata only; actual storage remains provider-based.
- Files can link to any operational record.
- Versions are tracked separately.
- File actions are audited.

## Next build unit
Calendar / Task Scheduling backend.

## Work Supporting Materials V1

Status: active metadata-reference layer.

Song Profile now uses the File Vault foundation for workspace-owned supporting material references through:

- `GET /api/works/[workId]/files`
- `POST /api/works/[workId]/files`
- `file_vault_items`
- `file_vault_links`
- `file_vault_audit_events`

This V1 layer is for operational visibility only. It records the existence of supporting materials around a work, such as split sheets, artwork, proof notes, contracts, invoices, or compliance references.

It does not implement:

- real file upload
- external storage sync
- OCR
- AI document analysis
- evidence verification
- legal clearance
- readiness scoring
- submission automation

User-facing wording must remain clear: references are not verified and do not confirm legal clearance or submission readiness.
