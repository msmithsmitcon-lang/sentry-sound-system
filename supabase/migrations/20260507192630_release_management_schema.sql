create table if not exists public.releases (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  release_type text not null
    check (
      release_type in (
        'single',
        'ep',
        'album',
        'compilation',
        'deluxe',
        'live',
        'remix'
      )
    ),

  title text not null,

  primary_artist_profile_id uuid
    references public.artist_profiles(id)
    on delete set null,

  lifecycle_status text not null default 'draft'
    check (
      lifecycle_status in (
        'draft',
        'metadata_review',
        'ready',
        'scheduled',
        'released',
        'takedown_requested',
        'archived'
      )
    ),

  catalog_number text,
  upc text,
  external_release_reference text,
  distributor_reference text,

  planned_release_date date,
  actual_release_date date,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_releases_workspace
  on public.releases(workspace_id);

create index if not exists idx_releases_artist
  on public.releases(primary_artist_profile_id);

create table if not exists public.release_tracks (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  release_id uuid not null
    references public.releases(id)
    on delete cascade,

  musical_work_id uuid,
  sound_recording_id uuid,

  track_number integer not null,

  title text not null,

  isrc text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.release_versions (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  release_id uuid not null
    references public.releases(id)
    on delete cascade,

  version_name text not null,

  metadata_snapshot jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.release_metadata_snapshots (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  release_id uuid not null
    references public.releases(id)
    on delete cascade,

  snapshot_label text not null,

  metadata_snapshot jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.release_audit_events (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  release_id uuid
    references public.releases(id)
    on delete set null,

  event_type text not null,
  event_summary text not null,

  event_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

