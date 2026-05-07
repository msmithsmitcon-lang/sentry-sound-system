create table if not exists finance_periods (
  id uuid primary key default gen_random_uuid(),

  period_year integer not null,
  period_month integer not null,

  status text not null default 'open'
  check (
    status in (
      'open',
      'closed'
    )
  ),

  closed_at timestamptz,
  created_at timestamptz not null default now(),

  unique(period_year, period_month)
);
