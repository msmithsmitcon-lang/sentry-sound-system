create table if not exists public.workflow_events (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  source_module text not null,
  event_type text not null,

  linked_record_type text,
  linked_record_id uuid,

  event_payload jsonb not null default '{}'::jsonb,

  processed boolean not null default false,

  created_at timestamptz not null default now()
);

create index if not exists idx_workflow_events_workspace
  on public.workflow_events(workspace_id);

create table if not exists public.workflow_rules (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  rule_name text not null,
  source_module text,
  event_type text,

  active boolean not null default true,

  conditions jsonb not null default '{}'::jsonb,
  actions jsonb not null default '[]'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_runs (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  workflow_event_id uuid
    references public.workflow_events(id)
    on delete set null,

  workflow_rule_id uuid
    references public.workflow_rules(id)
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

  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.workflow_audit_events (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  workflow_run_id uuid
    references public.workflow_runs(id)
    on delete set null,

  event_type text not null,
  event_summary text not null,
  event_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
