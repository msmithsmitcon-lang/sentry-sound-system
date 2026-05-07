create table if not exists finance_exchange_rates (
  id uuid primary key default gen_random_uuid(),

  base_currency text not null,
  target_currency text not null,

  exchange_rate numeric(18,6) not null
  check (exchange_rate > 0),

  effective_date date not null,

  created_at timestamptz not null default now(),

  unique (
    base_currency,
    target_currency,
    effective_date
  )
);
