-- Contributors System Expansion V1

create table if not exists work_contributors (
  id uuid primary key default gen_random_uuid(),
  work_id uuid references musical_works(id) on delete cascade,
  contributor_id uuid references contributors(id) on delete cascade,
  role text not null,
  split_type text,
  percentage numeric(5,2),
  notes text,
  confirmed boolean default false,
  created_at timestamp default now()
);

create table if not exists recording_contributors (
  id uuid primary key default gen_random_uuid(),
  recording_id uuid references recordings(id) on delete cascade,
  contributor_id uuid references contributors(id) on delete cascade,
  role text not null,
  split_type text,
  percentage numeric(5,2),
  notes text,
  confirmed boolean default false,
  created_at timestamp default now()
);

alter table contributors
add column if not exists contributor_type text default 'person',
add column if not exists legal_name text,
add column if not exists stage_name text,
add column if not exists id_number text,
add column if not exists company_registration_number text,
add column if not exists tax_number text,
add column if not exists address text,
add column if not exists banking_status text default 'not_captured',
add column if not exists metadata jsonb default '{}'::jsonb;
