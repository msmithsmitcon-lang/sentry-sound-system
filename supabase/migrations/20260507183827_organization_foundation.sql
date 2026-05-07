create table if not exists departments (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null references workspaces(id) on delete cascade,

  department_name text not null,

  department_code text,

  description text,

  manager_email text,

  is_active boolean not null default true,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null references workspaces(id) on delete cascade,

  department_id uuid references departments(id) on delete set null,

  team_name text not null,

  description text,

  lead_email text,

  is_active boolean not null default true,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists workspace_members (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null references workspaces(id) on delete cascade,

  department_id uuid references departments(id) on delete set null,

  team_id uuid references teams(id) on delete set null,

  email text not null,

  full_name text,

  role_key text not null default 'member'
  check (
    role_key in (
      'owner',
      'admin',
      'manager',
      'finance',
      'legal',
      'producer',
      'artist',
      'member',
      'viewer'
    )
  ),

  is_active boolean not null default true,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into departments (
  workspace_id,
  department_name,
  department_code,
  description
)
select
  id,
  'Production',
  'PROD',
  'Music production operations'
from workspaces
where not exists (
  select 1
  from departments
  where departments.workspace_id = workspaces.id
  and department_code = 'PROD'
);

insert into departments (
  workspace_id,
  department_name,
  department_code,
  description
)
select
  id,
  'Finance',
  'FIN',
  'Finance and royalty operations'
from workspaces
where not exists (
  select 1
  from departments
  where departments.workspace_id = workspaces.id
  and department_code = 'FIN'
);

insert into departments (
  workspace_id,
  department_name,
  department_code,
  description
)
select
  id,
  'Rights Management',
  'RIGHTS',
  'Publishing and compliance management'
from workspaces
where not exists (
  select 1
  from departments
  where departments.workspace_id = workspaces.id
  and department_code = 'RIGHTS'
);
