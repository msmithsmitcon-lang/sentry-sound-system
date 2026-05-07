# File / Document Vault Module

## Purpose
The File Vault is the secure document and asset-file layer for contracts, KYC, proof of ownership, split sheets, masters, artwork, release files, and compliance evidence.

## Core principle
Files must link to operational records without duplicating business logic.

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
