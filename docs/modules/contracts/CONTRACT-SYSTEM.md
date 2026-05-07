# Contract System Module

## Purpose
The Contract System is the binding legal/operational layer connecting CRM parties, artists, contributors, rights, obligations, royalty rules, and effective dates.

## Core principle
Contracts must control authority and obligations without duplicating CRM, Artist, Contributor, or Rights data.

## Core entities
- contracts
- contract_parties
- contract_rights_links
- contract_obligations
- contract_milestones
- contract_audit_events

## Design rules
- workspace-scoped
- CRM-linked parties
- contributor-linked where royalty participation matters
- rights-linked where ownership/authority is affected
- effective-date aware
- status/lifecycle controlled
- audit-ready
- international-ready

## Lifecycle
Draft ? Review ? Signed ? Active ? Suspended ? Expired ? Terminated ? Archived

## Strategic flow
CRM ? Artists ? Contributors ? Rights Ownership ? Contracts ? Royalty Logic ? Ledger ? Payouts

## Next build unit
Create Contract System database schema.

# Contract System Schema Status

## Completed
- contracts
- contract_parties
- contract_rights_links
- contract_obligations
- contract_audit_events

## Contract rule fields
Contracts now include:
- royalty_terms
- payment_terms
- effective dates
- governing country/region
- auto-renewal flag

## Strategic architecture
Contracts now sit above Rights Lifecycle and can control:
- authority
- obligations
- royalty/payment terms
- effective periods
- territory-linked rights scope

## Next build unit
Contract service layer.
