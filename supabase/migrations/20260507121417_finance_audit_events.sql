create table if not exists finance_audit_events (
  id uuid primary key default gen_random_uuid(),

  event_type text not null,

  entity_type text not null,

  entity_id text not null,

  action text not null,

  performed_by text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
