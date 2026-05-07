create table if not exists project_tasks (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null references workspaces(id) on delete cascade,

  project_id uuid not null references projects(id) on delete cascade,

  title text not null,

  description text,

  task_type text not null default 'general'
  check (
    task_type in (
      'general',
      'recording',
      'mixing',
      'mastering',
      'artwork',
      'rights',
      'finance',
      'release',
      'approval'
    )
  ),

  status text not null default 'todo'
  check (
    status in (
      'todo',
      'in_progress',
      'blocked',
      'review',
      'done',
      'cancelled'
    )
  ),

  priority text not null default 'medium'
  check (
    priority in (
      'low',
      'medium',
      'high',
      'urgent'
    )
  ),

  assigned_to text,

  due_date date,

  created_by text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
