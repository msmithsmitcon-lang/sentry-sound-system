create table if not exists public.dashboard_widgets (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  widget_type text not null,

  widget_title text not null,

  widget_config jsonb not null default '{}'::jsonb,

  display_order integer not null default 0,

  active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_dashboard_widgets_workspace
  on public.dashboard_widgets(workspace_id);

create table if not exists public.dashboard_alerts (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  alert_type text not null,

  severity_level text not null default 'normal'
    check (
      severity_level in (
        'low',
        'normal',
        'high',
        'critical'
      )
    ),

  alert_title text not null,
  alert_summary text not null,

  linked_record_type text,
  linked_record_id uuid,

  acknowledged boolean not null default false,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index if not exists idx_dashboard_alerts_workspace
  on public.dashboard_alerts(workspace_id);

create table if not exists public.dashboard_snapshots (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  snapshot_type text not null,

  snapshot_data jsonb not null default '{}'::jsonb,

  generated_at timestamptz not null default now()
);

create table if not exists public.dashboard_activity_feed (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  activity_type text not null,

  activity_summary text not null,

  linked_record_type text,
  linked_record_id uuid,

  activity_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
