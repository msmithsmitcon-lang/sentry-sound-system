create table if not exists public.distribution_channels (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  channel_name text not null,
  platform_type text not null,

  active boolean not null default true,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.distribution_releases (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  source_release_id uuid,

  lifecycle_status text not null default 'draft'
    check (
      lifecycle_status in (
        'draft',
        'scheduled',
        'submitted',
        'delivered',
        'live',
        'takedown_requested',
        'removed',
        'failed',
        'archived'
      )
    ),

  scheduled_release_date date,
  actual_release_date date,

  distribution_notes text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.distribution_release_channels (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  distribution_release_id uuid not null
    references public.distribution_releases(id)
    on delete cascade,

  distribution_channel_id uuid not null
    references public.distribution_channels(id)
    on delete cascade,

  territory_code text,

  delivery_status text not null default 'pending'
    check (
      delivery_status in (
        'pending',
        'queued',
        'submitted',
        'processing',
        'live',
        'failed',
        'removed'
      )
    ),

  external_reference_id text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.distribution_delivery_events (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  distribution_release_channel_id uuid not null
    references public.distribution_release_channels(id)
    on delete cascade,

  event_type text not null,
  event_summary text not null,

  event_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.distribution_audit_events (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  distribution_release_id uuid
    references public.distribution_releases(id)
    on delete set null,

  event_type text not null,
  event_summary text not null,

  event_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

