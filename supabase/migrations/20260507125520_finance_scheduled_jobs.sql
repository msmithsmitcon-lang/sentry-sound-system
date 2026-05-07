create table if not exists finance_scheduled_jobs (
  id uuid primary key default gen_random_uuid(),

  job_name text not null unique,

  job_type text not null,

  status text not null default 'active'
  check (
    status in (
      'active',
      'paused',
      'disabled'
    )
  ),

  last_run_at timestamptz,

  next_run_at timestamptz,

  last_run_status text,

  schedule_expression text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
