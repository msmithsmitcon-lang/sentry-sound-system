create table if not exists public.scheduled_jobs (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  job_type text not null,
  job_name text not null,

  active boolean not null default true,

  schedule_config jsonb not null default '{}'::jsonb,
  job_payload jsonb not null default '{}'::jsonb,

  last_run_at timestamptz,
  next_run_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_scheduled_jobs_workspace
  on public.scheduled_jobs(workspace_id);

create table if not exists public.scheduled_job_runs (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  scheduled_job_id uuid
    references public.scheduled_jobs(id)
    on delete set null,

  run_status text not null default 'queued'
    check (
      run_status in (
        'queued',
        'running',
        'completed',
        'failed',
        'cancelled'
      )
    ),

  run_payload jsonb not null default '{}'::jsonb,
  result_payload jsonb not null default '{}'::jsonb,

  error_message text,

  started_at timestamptz,
  completed_at timestamptz,

  created_at timestamptz not null default now()
);

create table if not exists public.scheduled_job_audit_events (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  scheduled_job_id uuid
    references public.scheduled_jobs(id)
    on delete set null,

  scheduled_job_run_id uuid
    references public.scheduled_job_runs(id)
    on delete set null,

  event_type text not null,
  event_summary text not null,
  event_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
