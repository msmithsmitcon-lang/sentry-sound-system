create table if not exists finance_attachments (
  id uuid primary key default gen_random_uuid(),

  entity_type text not null,

  entity_id text not null,

  file_name text not null,

  file_type text,

  file_size bigint,

  storage_path text not null,

  uploaded_by text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
