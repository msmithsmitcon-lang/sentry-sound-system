create table if not exists finance_notes (
  id uuid primary key default gen_random_uuid(),

  entity_type text not null,

  entity_id text not null,

  note text not null,

  note_type text not null default 'general'
  check (
    note_type in (
      'general',
      'audit',
      'approval',
      'warning'
    )
  ),

  created_by text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
