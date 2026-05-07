alter table finance_transactions
add column if not exists reconciliation_status text
not null default 'pending'
check (
  reconciliation_status in (
    'pending',
    'cleared',
    'reconciled'
  )
);
