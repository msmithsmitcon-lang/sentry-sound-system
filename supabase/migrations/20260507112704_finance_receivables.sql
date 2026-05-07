create table if not exists finance_receivables (
  id uuid primary key default gen_random_uuid(),

  customer_name text not null,

  reference_code text not null unique,

  amount numeric(18,2) not null
  check (amount > 0),

  outstanding_amount numeric(18,2) not null
  check (outstanding_amount >= 0),

  status text not null default 'open'
  check (
    status in (
      'open',
      'partial',
      'paid'
    )
  ),

  due_date date,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
