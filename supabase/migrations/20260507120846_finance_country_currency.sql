create table if not exists finance_country_currency (
  id uuid primary key default gen_random_uuid(),

  country_code text not null unique,

  country_name text not null,

  currency_code text not null,

  currency_name text not null,

  currency_symbol text,

  is_active boolean not null default true,

  created_at timestamptz not null default now()
);
