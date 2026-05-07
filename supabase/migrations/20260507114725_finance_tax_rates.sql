create table if not exists finance_tax_rates (
  id uuid primary key default gen_random_uuid(),

  name text not null,

  country_code text not null,

  tax_type text not null,

  rate numeric(8,4) not null
  check (rate >= 0),

  is_active boolean not null default true,

  created_at timestamptz not null default now()
);
