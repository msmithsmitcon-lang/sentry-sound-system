create table if not exists public.ai_runtime_workers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid null,
  worker_id text not null unique,
  hostname text not null,
  status text not null default 'ACTIVE',
  active_task_count integer not null default 0,
  last_heartbeat_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_ai_runtime_workers_worker_id
on public.ai_runtime_workers(worker_id);

create index if not exists idx_ai_runtime_workers_last_heartbeat
on public.ai_runtime_workers(last_heartbeat_at);
