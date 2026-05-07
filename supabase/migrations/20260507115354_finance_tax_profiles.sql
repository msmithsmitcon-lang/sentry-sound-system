create table if not exists finance_tax_profiles (
  id uuid primary key default gen_random_uuid(),

  entity_name text not null,

  country_code text not null default 'ZA',

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

  effective_from date not null default current_date,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
