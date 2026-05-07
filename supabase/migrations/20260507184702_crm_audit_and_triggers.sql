create table if not exists public.crm_contact_audit_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  contact_id uuid references public.crm_contacts(id) on delete set null,

  event_type text not null,
  event_summary text not null,
  event_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index if not exists idx_crm_contact_audit_events_workspace_id
  on public.crm_contact_audit_events(workspace_id);

create index if not exists idx_crm_contact_audit_events_contact_id
  on public.crm_contact_audit_events(contact_id);

create or replace function public.set_crm_contacts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_crm_contacts_updated_at on public.crm_contacts;

create trigger trg_crm_contacts_updated_at
before update on public.crm_contacts
for each row
execute function public.set_crm_contacts_updated_at();
