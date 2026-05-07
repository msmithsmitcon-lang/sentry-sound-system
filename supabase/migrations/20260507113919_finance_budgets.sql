create table if not exists finance_budgets (
  id uuid primary key default gen_random_uuid(),

  name text not null,

  account_code text not null,

  budget_year integer not null,
  budget_month integer not null,

  planned_amount numeric(18,2) not null
  check (planned_amount >= 0),

  actual_amount numeric(18,2) not null default 0
  check (actual_amount >= 0),

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (
    account_code,
    budget_year,
    budget_month
  )
);
