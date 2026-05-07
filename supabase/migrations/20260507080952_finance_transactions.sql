create table if not exists finance_transactions (
  id uuid primary key default gen_random_uuid(),

  debit_account_id uuid not null references finance_accounts(id),
  credit_account_id uuid not null references finance_accounts(id),

  amount numeric(14,2) not null check (amount > 0),

  reference_type text not null,
  reference_id text,

  description text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index if not exists idx_finance_transactions_debit
on finance_transactions(debit_account_id);

create index if not exists idx_finance_transactions_credit
on finance_transactions(credit_account_id);

create index if not exists idx_finance_transactions_reference
on finance_transactions(reference_type, reference_id);
