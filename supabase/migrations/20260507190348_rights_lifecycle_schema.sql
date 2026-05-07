create table if not exists public.rights_assets (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  asset_type text not null
    check (
      asset_type in (
        'musical_work',
        'sound_recording',
        'release',
        'video',
        'brand',
        'contract'
      )
    ),

  asset_reference_id uuid,
  title text not null,

  lifecycle_status text not null default 'draft'
    check (
      lifecycle_status in (
        'draft',
        'claimed',
        'verified',
        'active',
        'disputed',
        'expired',
        'archived'
      )
    ),

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_rights_assets_workspace
  on public.rights_assets(workspace_id);

create table if not exists public.rights_ownership_claims (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  rights_asset_id uuid not null
    references public.rights_assets(id)
    on delete cascade,

  crm_contact_id uuid
    references public.crm_contacts(id)
    on delete set null,

  contributor_id uuid references public.contributors(id) on delete set null,

  ownership_role text not null,
  ownership_percentage numeric(5,2) not null,

  territory_code text,
  effective_from date,
  effective_to date,

  verification_status text not null default 'pending'
    check (
      verification_status in (
        'pending',
        'verified',
        'rejected',
        'disputed'
      )
    ),

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.rights_lifecycle_events (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  rights_asset_id uuid not null
    references public.rights_assets(id)
    on delete cascade,

  event_type text not null,
  event_summary text not null,

  event_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.rights_audit_events (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  rights_asset_id uuid
    references public.rights_assets(id)
    on delete set null,

  event_type text not null,
  event_summary text not null,

  event_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

