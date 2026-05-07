create table if not exists finance_notifications (
  id uuid primary key default gen_random_uuid(),

  notification_type text not null,

  severity text not null default 'info'
  check (
    severity in (
      'info',
      'warning',
      'critical'
    )
  ),

  title text not null,

  message text not null,

  entity_type text,

  entity_id text,

  recipient text,

  is_read boolean not null default false,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
