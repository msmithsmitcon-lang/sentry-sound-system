create table if not exists finance_roles (
  id uuid primary key default gen_random_uuid(),

  role_name text not null unique,

  description text,

  permissions jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
