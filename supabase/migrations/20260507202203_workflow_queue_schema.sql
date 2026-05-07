create table if not exists public.workflow_queue (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  workflow_run_id uuid
    references public.workflow_runs(id)
    on delete cascade,

  queue_status text not null default 'queued'
    check (
      queue_status in (
        'queued',
        'processing',
        'completed',
        'failed',
        'cancelled'
      )
    ),

  priority_level text not null default 'normal'
    check (
      priority_level in (
        'low',
        'normal',
        'high',
        'critical'
      )
    ),

  available_at timestamptz not null default now(),
  attempts integer not null default 0,
  max_attempts integer not null default 3,

  last_error text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_workflow_queue_workspace_status
  on public.workflow_queue(workspace_id, queue_status);

create index if not exists idx_workflow_queue_available_at
  on public.workflow_queue(available_at);
