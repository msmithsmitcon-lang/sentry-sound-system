
## finance_accounts

Stores system-level financial accounts.

Fields:
- id
- name
- code
- type: cash | liability | revenue | expense
- currency
- opening_balance
- current_balance
- metadata
- is_active
- created_at
- updated_at

## finance_transactions

Double-entry transaction table for system finance tracking.

Fields:
- debit_account_id
- credit_account_id
- amount
- reference_type
- reference_id
- description
- metadata
- created_at

Principle:
Every financial movement must be traceable.
