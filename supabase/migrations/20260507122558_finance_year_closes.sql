create table if not exists finance_year_closes (
  id uuid primary key default gen_random_uuid(),

  financial_year integer not null unique,

  status text not null default 'open'
  check (
    status in (
      'open',
      'closing',
      'closed'
    )
  ),

  closed_at timestamptz,

  closed_by text,

  close_notes text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
