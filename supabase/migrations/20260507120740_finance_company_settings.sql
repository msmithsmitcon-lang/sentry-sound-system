create table if not exists finance_company_settings (
  id uuid primary key default gen_random_uuid(),

  company_name text not null,

  country_code text not null,

  base_currency text not null,

  reporting_currency text not null,

  is_vat_registered boolean not null default false,

  vat_number text,

  tax_registration_status text not null default 'not_registered'
  check (
    tax_registration_status in (
      'not_registered',
      'registered',
      'exempt',
      'pending'
    )
  ),

  default_tax_rate_id uuid references finance_tax_rates(id),

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
