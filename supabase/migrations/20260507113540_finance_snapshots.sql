create table if not exists finance_snapshots (
  id uuid primary key default gen_random_uuid(),

  snapshot_date date not null,

  snapshot_type text not null
  check (
    snapshot_type in (
      'daily',
      'monthly',
      'manual'
    )
  ),

  data jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
