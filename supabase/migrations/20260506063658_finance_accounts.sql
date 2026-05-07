-- Finance Accounts System
create table if not exists finance_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  type text not null check (type in ('cash', 'liability', 'revenue', 'expense')),
  currency text not null default 'ZAR',
  is_active boolean not null default true,
  opening_balance numeric(14,2) not null default 0,
  current_balance numeric(14,2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_finance_accounts_type on finance_accounts(type);
create index if not exists idx_finance_accounts_active on finance_accounts(is_active);
