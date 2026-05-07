# Finance Architecture

## Overview

The Sentry Sound Finance Layer is a deterministic accounting subsystem
supporting:

- operational accounting
- royalty accounting integration
- ERP-style reporting
- reconciliation workflows
- auditability
- financial controls

Core principle:

Ledger is the source of truth.

All balances and reporting derive from transaction history.

---

# Core Components

## 1. Finance Accounts

Table:
- finance_accounts

Purpose:
- system-level financial accounts
- cash accounts
- liability accounts
- revenue accounts
- expense accounts

Key fields:
- code
- name
- type
- current_balance
- category
- subcategory

---

## 2. Finance Transactions

Table:
- finance_transactions

Purpose:
- debit/credit accounting entries
- operational finance tracking
- cash movement
- liability tracking
- revenue posting
- expense posting

Core features:
- deterministic posting
- reconciliation tracking
- duplicate protection
- audit traceability

---

## 3. Reconciliation Layer

Statuses:
- pending
- cleared
- reconciled

Purpose:
- bank matching
- payout verification
- accounting close workflows

---

## 4. Accounting Periods

Table:
- finance_periods

Purpose:
- month-end close
- audit protection
- historical locking
- financial reporting integrity

Statuses:
- open
- closed

---

## 5. Reporting Layer

Implemented reports:
- trial balance
- profit & loss
- balance sheet
- cash flow
- dashboard summary
- audit trail
- general ledger export

---

# Deterministic Accounting Rules

## Transaction Rules

- debit and credit accounts cannot match
- amount must be positive
- duplicate references blocked
- closed periods reject postings

## Balance Rules

- balances derive from transaction flow
- auditability maintained
- reconciliation tracked independently

---

# Future Expansion

Planned:
- multi-company accounting
- tax/VAT layer
- invoice system
- accounts receivable
- accounts payable
- payroll
- budgeting
- forecasting
- XLSX/CSV exports
- external accounting integrations

---

# Latest Finance Expansion

## Operational Finance

Added:
- accounts receivable
- accounts payable
- receivable payment processing
- payable payment processing
- AR/AP summary
- overdue reporting
- finance KPIs

## Historical Finance

Added:
- finance snapshots
- snapshot comparison
- trend-analysis foundation
- historical reporting support

## Current Finance Architecture Status

The finance layer now supports:

- accounting ledger
- chart of accounts
- revenue
- expenses
- liabilities
- cash movement
- reconciliation
- accounting periods
- financial statements
- AR/AP operations
- KPI reporting
- historical snapshots
- audit/export layers

This is now a functional ERP-style finance subsystem.

## Onboarding Finance Requirements

Future onboarding must capture:

- entity country
- default/base currency derived from selected country
- VAT registration status

Important:
The system must not assume every entity is VAT registered.

Onboarding must ask:
"Are you registered for VAT / sales tax?"

Supported statuses:
- registered
- not_registered
- exempt
- pending

Country selection should later drive:
- default currency
- tax rules
- available tax rates
- compliance requirements

## Multi-Currency Transaction Architecture

Added transaction-level multi-currency fields.

Important rule:
Exchange rate used for a transaction must be stored permanently on that transaction.

Old transactions must not silently recalculate when exchange rates change.

## Exchange Rate Governance Layer

Added controlled exchange-rate source metadata.

Future supported providers may include:
- ECB
- SARB
- Open Exchange Rates
- Fixer
- ExchangeRate.host

Important:
Transactions must permanently store the exchange rate used at posting time.

## Financial Close Governance

Implemented soft/hard close architecture.

Soft close:
- warns/restricts operational posting

Hard close:
- completely locks accounting period

This creates enterprise-grade accounting governance.

---

# Governance + International Finance Expansion

## International Finance

Added:
- transaction-level original currency
- transaction-level base currency
- locked exchange rate used
- exchange rate source metadata
- country-to-currency resolution
- onboarding finance resolution
- company finance settings

Important:
Exchange rates used on transactions must be stored permanently for audit safety.

## Tax-Aware Architecture

Added:
- tax rate catalogue
- entity tax profiles
- VAT registered / not registered / exempt / pending statuses

Important:
VAT must not be assumed automatically. Onboarding must explicitly ask whether the entity is VAT registered.

## Governance

Added:
- finance audit events
- automatic transaction audit emission
- soft-close / hard-close period model
- year-end close foundation
- retained earnings calculation

## Current Status

The finance layer now supports:
- international finance configuration
- controlled FX governance
- VAT-aware entity setup
- accounting close controls
- year-end governance
- retained earnings/equity logic

---

# Finance Governance Workflow Expansion

Added:
- finance roles
- finance approvals
- approval decisions
- finance notifications

## Governance Capabilities

The finance system now supports:
- role-based finance access foundation
- approval workflow foundation
- approval/rejection decision tracking
- operational finance notifications
- enterprise workflow governance

## Future Enforcement

Later phases must connect these to:
- Clerk users
- company/team membership
- role assignment
- route-level permission checks
- approval thresholds
- notification delivery channels

---

# Dashboard + Finance Intelligence Expansion

Added:
- notification read workflow
- dashboard summary
- finance health score

## Intelligence Capabilities

The finance system now supports:
- executive dashboard aggregation
- finance health scoring
- risk indicators
- unread notification tracking
- pending approval visibility
- operational monitoring

## Future Direction

Later phases should connect this layer to:
- actual UI dashboard cards
- AI finance advisory
- scheduled health checks
- notification delivery
- role-based dashboard views

---

# Finance Automation Expansion

Added:
- finance scheduled jobs
- scheduled job execution endpoint

## Automation Capabilities

The finance system now supports:
- scheduled FX sync foundation
- scheduled health checks foundation
- overdue scan foundation
- reconciliation job foundation
- execution tracking

## Future Direction

Later phases should connect scheduled jobs to:
- real background workers
- cron execution
- queue systems
- notification generation
- AI finance monitoring

---

# Finance Collaboration + Timeline Expansion

Added:
- finance attachments
- finance notes
- unified finance timeline

## Collaboration Capabilities

The finance system now supports:
- document attachments
- audit evidence linkage
- operational notes
- approval commentary
- dispute tracking
- unified activity feeds

## Timeline Aggregation

Unified finance timelines now aggregate:
- notes
- approvals
- notifications
- audit events
- attachments

This creates:
- ERP operational visibility
- finance case history
- audit review support
- future AI activity analysis foundation

---

# Finance Reporting Infrastructure Expansion

Added:
- finance report export registry
- finance report job queue
- report job processing workflow

## Reporting Capabilities

The finance system now supports:
- report export tracking
- queued report generation
- completed report linkage
- async reporting foundation
- future PDF/XLSX/CSV report generation
- future scheduled report packs

## Future Direction

Later phases should connect this layer to:
- real PDF generation
- XLSX export generation
- Supabase Storage
- scheduled report delivery
- executive board packs
- tax/audit packs

---

# Enterprise ERP Finance Infrastructure Status

## Core Accounting
- chart of accounts
- transactions
- receivables
- payables
- reconciliation
- balance sheet
- retained earnings

## International Finance
- multi-currency transactions
- FX conversion
- exchange-rate governance
- country/currency onboarding resolution
- VAT-aware onboarding
- company finance settings

## Governance
- audit events
- automatic audit emission
- soft-close / hard-close periods
- year-end close structure
- approvals
- approval decisions
- permissions foundation

## Collaboration
- notifications
- notes
- attachments
- unified activity timeline

## Reporting
- report exports
- report-job queue
- async report processing
- dashboard summary
- finance health scoring

## Automation
- scheduled jobs
- job execution
- operational health endpoint

## Current Architecture Position

The finance subsystem now contains foundational ERP-grade infrastructure for:
- enterprise accounting
- governance
- operational workflows
- reporting
- automation
- auditability
- international finance
- future AI advisory systems

## Next Major Future Phases

Potential future expansions:
- real PDF/XLSX generation
- Supabase Storage integration
- queue workers
- Clerk role enforcement
- AI finance advisory
- budgeting
- forecasting
- royalty analytics
- royalty payout engine
- invoice generation
- tax filing exports
- banking integrations
- payment gateways
