# Finance Database Schema

## finance_accounts

Purpose:
Stores company financial accounts.

Types:
- cash
- liability
- revenue
- expense

Key fields:
- id
- code
- name
- type
- current_balance
- category
- subcategory

---

## finance_transactions

Purpose:
Stores debit/credit accounting entries.

Key fields:
- debit_account_id
- credit_account_id
- amount
- reference_type
- reference_id
- reconciliation_status

Constraints:
- unique(reference_type, reference_id)

---

## finance_periods

Purpose:
Stores accounting periods.

Key fields:
- period_year
- period_month
- status
- closed_at

Statuses:
- open
- closed

---

# Latest Database Additions

## finance_receivables

Tracks money owed to the company.

## finance_payables

Tracks money owed by the company.

## finance_snapshots

Stores historical finance state snapshots.

Used for:
- audits
- trend reporting
- period comparisons
- executive reporting

---

# Governance + International Database Additions

## finance_company_settings
Stores root finance configuration:
- country
- base currency
- reporting currency
- VAT status

## finance_country_currency
Maps country to default currency.

## finance_tax_profiles
Stores entity-level tax registration status.

## finance_exchange_rates
Now includes source governance fields.

## finance_audit_events
Stores finance governance events.

## finance_year_closes
Stores year-end accounting governance.

## finance_transactions
Now includes:
- original currency
- base currency
- locked exchange rate fields

---

# Governance Workflow Database Additions

## finance_roles
Stores finance role definitions and permission maps.

## finance_approvals
Stores approval requests and decision outcomes.

## finance_notifications
Stores finance workflow notifications and alerts.

---

# Automation Database Additions

## finance_scheduled_jobs

Stores scheduled finance automation jobs.

Supports:
- job type
- schedule expression
- last run status
- last run timestamp
- next run timestamp

---

# Collaboration Database Additions

## finance_attachments
Stores linked finance files and evidence.

## finance_notes
Stores finance comments and operational notes.

These support:
- audit evidence
- workflow collaboration
- dispute tracking
- operational visibility

---

# Reporting Infrastructure Database Additions

## finance_report_exports
Tracks generated report files and export metadata.

## finance_report_jobs
Tracks queued report generation requests and processing status.
