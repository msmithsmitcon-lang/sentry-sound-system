create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  contract_type text not null
    check (
      contract_type in (
        'artist',
        'distribution',
        'publishing',
        'licensing',
        'management',
        'producer',
        'sync',
        'label',
        'service'
      )
    ),

  contract_number text,

  title text not null,

  lifecycle_status text not null default 'draft'
    check (
      lifecycle_status in (
        'draft',
        'review',
        'signed',
        'active',
        'suspended',
        'expired',
        'terminated',
        'archived'
      )
    ),

  effective_from date,
  effective_to date,

  governing_country_code text,
  governing_region text,

  auto_renew boolean not null default false,

  royalty_terms jsonb not null default '{}'::jsonb,
  payment_terms jsonb not null default '{}'::jsonb,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contracts_workspace
  on public.contracts(workspace_id);

create index if not exists idx_contracts_status
  on public.contracts(lifecycle_status);

create table if not exists public.contract_parties (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  contract_id uuid not null
    references public.contracts(id)
    on delete cascade,

  crm_contact_id uuid
    references public.crm_contacts(id)
    on delete set null,

  contributor_id uuid
    references public.contributors(id)
    on delete set null,

  party_role text not null,

  signing_authority boolean not null default false,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.contract_rights_links (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  contract_id uuid not null
    references public.contracts(id)
    on delete cascade,

  rights_asset_id uuid not null
    references public.rights_assets(id)
    on delete cascade,

  rights_scope text,
  territory_code text,

  effective_from date,
  effective_to date,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.contract_obligations (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  contract_id uuid not null
    references public.contracts(id)
    on delete cascade,

  obligation_type text not null,

  obligation_summary text not null,

  due_date date,

  completion_status text not null default 'pending'
    check (
      completion_status in (
        'pending',
        'in_progress',
        'completed',
        'waived',
        'breached'
      )
    ),

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.contract_audit_events (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  contract_id uuid
    references public.contracts(id)
    on delete set null,

  event_type text not null,
  event_summary text not null,

  event_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

