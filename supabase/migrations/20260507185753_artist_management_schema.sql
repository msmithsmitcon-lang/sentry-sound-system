create table if not exists public.artist_profiles (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  crm_contact_id uuid not null
    references public.crm_contacts(id)
    on delete restrict,

  lifecycle_status text not null default 'draft'
    check (
      lifecycle_status in (
        'draft',
        'onboarding',
        'active',
        'inactive',
        'archived'
      )
    ),

  artist_type text not null default 'solo'
    check (
      artist_type in (
        'solo',
        'group',
        'band',
        'dj',
        'producer',
        'composer',
        'label'
      )
    ),

  stage_name text not null,
  legal_display_name text,

  primary_genre text,
  country_code text,
  primary_language text,

  onboarding_completed boolean not null default false,
  verification_status text not null default 'unverified'
    check (
      verification_status in (
        'unverified',
        'pending',
        'verified',
        'rejected'
      )
    ),

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_artist_profile_contact
  on public.artist_profiles(crm_contact_id);

create index if not exists idx_artist_profiles_workspace
  on public.artist_profiles(workspace_id);

create index if not exists idx_artist_profiles_stage_name
  on public.artist_profiles(stage_name);

create table if not exists public.artist_aliases (
  id uuid primary key default gen_random_uuid(),

  artist_profile_id uuid not null
    references public.artist_profiles(id)
    on delete cascade,

  alias_name text not null,

  created_at timestamptz not null default now()
);

create table if not exists public.artist_genres (
  id uuid primary key default gen_random_uuid(),

  artist_profile_id uuid not null
    references public.artist_profiles(id)
    on delete cascade,

  genre_name text not null,

  created_at timestamptz not null default now()
);

create table if not exists public.artist_social_links (
  id uuid primary key default gen_random_uuid(),

  artist_profile_id uuid not null
    references public.artist_profiles(id)
    on delete cascade,

  platform text not null,
  url text not null,

  created_at timestamptz not null default now()
);

create table if not exists public.artist_audit_events (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  artist_profile_id uuid
    references public.artist_profiles(id)
    on delete set null,

  event_type text not null,
  event_summary text not null,

  event_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

