create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),

  name text not null,

  legal_name text,

  country_code text,

  base_currency text,

  status text not null default 'active'
  check (
    status in (
      'active',
      'inactive',
      'suspended'
    )
  ),

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists workspace_members (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null references workspaces(id) on delete cascade,

  user_email text not null,

  display_name text,

  role text not null default 'member'
  check (
    role in (
      'owner',
      'admin',
      'finance',
      'artist_manager',
      'member',
      'viewer'
    )
  ),

  status text not null default 'active'
  check (
    status in (
      'active',
      'invited',
      'disabled'
    )
  ),

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),

  unique(workspace_id, user_email)
);

create table if not exists workspace_settings (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null unique references workspaces(id) on delete cascade,

  settings jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists workspace_activity (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null references workspaces(id) on delete cascade,

  activity_type text not null,

  entity_type text,

  entity_id text,

  message text not null,

  performed_by text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
