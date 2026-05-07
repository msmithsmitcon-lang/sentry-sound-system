create table if not exists projects (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null references workspaces(id) on delete cascade,

  title text not null,

  description text,

  project_type text not null default 'music_project'
  check (
    project_type in (
      'music_project',
      'album',
      'ep',
      'single',
      'campaign',
      'client_project'
    )
  ),

  status text not null default 'planning'
  check (
    status in (
      'planning',
      'active',
      'review',
      'completed',
      'archived'
    )
  ),

  start_date date,
  end_date date,

  created_by text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
