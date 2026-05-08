create table if not exists public.analytics_metrics (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  metric_key text not null,
  metric_value numeric not null default 0,

  metric_context jsonb not null default '{}'::jsonb,

  recorded_at timestamptz not null default now()
);

create index if not exists idx_analytics_metrics_workspace
  on public.analytics_metrics(workspace_id);

create table if not exists public.analytics_snapshots (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  snapshot_type text not null,

  snapshot_data jsonb not null default '{}'::jsonb,

  generated_at timestamptz not null default now()
);

create table if not exists public.analytics_report_definitions (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  report_key text not null,
  report_name text not null,

  active boolean not null default true,

  report_config jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_report_runs (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  analytics_report_definition_id uuid
    references public.analytics_report_definitions(id)
    on delete set null,

  run_status text not null default 'queued'
    check (
      run_status in (
        'queued',
        'running',
        'completed',
        'failed'
      )
    ),

  result_payload jsonb not null default '{}'::jsonb,

  error_message text,

  started_at timestamptz,
  completed_at timestamptz,

  created_at timestamptz not null default now()
);

create table if not exists public.analytics_audit_events (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  event_type text not null,
  event_summary text not null,

  event_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
