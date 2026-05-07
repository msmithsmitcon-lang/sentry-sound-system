create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,

  contact_type text not null default 'person'
    check (contact_type in ('person', 'company', 'organization')),

  lifecycle_status text not null default 'draft'
    check (lifecycle_status in ('draft', 'active', 'inactive', 'archived')),

  display_name text not null,
  legal_name text,
  trading_name text,

  country_code text,
  tax_identifier text,
  registration_number text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_crm_contacts_workspace_id
  on public.crm_contacts(workspace_id);

create index if not exists idx_crm_contacts_display_name
  on public.crm_contacts(display_name);

create table if not exists public.crm_contact_emails (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  email text not null,
  label text default 'primary',
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_contact_phones (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  phone text not null,
  label text default 'primary',
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_contact_relationships (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  from_contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  to_contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  relationship_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_contact_notes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  note text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
