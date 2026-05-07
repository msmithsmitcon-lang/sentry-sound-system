# CRM / Contacts Module

## Purpose
Central reusable contact system for Sentry Sound.

## Core entities
- contacts
- contact_emails
- contact_phones
- contact_addresses
- contact_relationships
- contact_notes
- contact_audit_events

## Design rules
- workspace-scoped
- reusable across artists, labels, publishers, clients, vendors, contracts, releases, and finance
- backend first
- audit-ready
- international-ready
- no UI dependency

## Lifecycle
Draft ? Active ? Inactive ? Archived

## Next build unit
Create CRM database schema and tests.

## Database schema

### Tables created
- crm_contacts
- crm_contact_emails
- crm_contact_phones
- crm_contact_relationships
- crm_contact_notes
- crm_contact_audit_events

### Backend rules
- Contacts are workspace-scoped.
- Contacts support person, company, and organization types.
- Lifecycle is controlled by status.
- Child records cascade with the contact.
- Audit events remain even if contact is deleted.

### Next build unit
CRM service layer for creating contacts with audit events.

## Service layer

### createCrmContact

Creates a workspace-scoped CRM contact and writes an audit event.

### Validation
- workspaceId is required
- displayName is required
- default contactType is person
- audit event type: contact.created

### Next build unit
Add reusable CRM email and phone service functions.

## Lifecycle service

### updateCrmContactLifecycle

Updates CRM contact lifecycle status.

### Allowed statuses
- draft
- active
- inactive
- archived

### Audit event
- contact.lifecycle.updated

### Next build unit
CRM search/list service for workspace contacts.

# CRM V1 Status

## Completed
- Workspace-scoped CRM contacts
- Contact lifecycle management
- Email channels
- Phone channels
- Relationships
- Notes
- Audit events
- Duplicate prevention
- Primary channel constraints
- Contact search/list service
- Service-layer exports
- SQL validation checks

## Architectural role
CRM is now the reusable entity foundation for:
- artists
- labels
- publishers
- distributors
- clients
- vendors
- contracts
- releases
- finance entities

## Next recommended subsystem
Artist Management

Artist Management should EXTEND CRM rather than duplicate person/company data.
