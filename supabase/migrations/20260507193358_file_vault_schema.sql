create table if not exists public.file_vault_items (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  file_category text not null
    check (
      file_category in (
        'contract',
        'identity_kyc',
        'proof_of_ownership',
        'split_sheet',
        'master_audio',
        'artwork',
        'release_document',
        'compliance',
        'invoice',
        'statement',
        'other'
      )
    ),

  file_name text not null,
  file_mime_type text,
  file_size_bytes bigint,

  storage_provider text not null default 'supabase',
  storage_bucket text,
  storage_path text not null,

  checksum text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_file_vault_items_workspace
  on public.file_vault_items(workspace_id);

create table if not exists public.file_vault_links (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  file_vault_item_id uuid not null
    references public.file_vault_items(id)
    on delete cascade,

  linked_record_type text not null,
  linked_record_id uuid not null,

  link_role text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index if not exists idx_file_vault_links_record
  on public.file_vault_links(linked_record_type, linked_record_id);

create table if not exists public.file_vault_versions (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  file_vault_item_id uuid not null
    references public.file_vault_items(id)
    on delete cascade,

  version_number integer not null,
  storage_path text not null,
  checksum text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.file_vault_audit_events (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  file_vault_item_id uuid
    references public.file_vault_items(id)
    on delete set null,

  event_type text not null,
  event_summary text not null,
  event_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
