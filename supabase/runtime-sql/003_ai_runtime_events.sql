create table if not exists public.ai_runtime_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid null,
  event_type text not null,
  severity text not null default 'INFO',
  worker_id text null,
  task_id uuid null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_runtime_events_type
on public.ai_runtime_events(event_type);

create index if not exists idx_ai_runtime_events_created
on public.ai_runtime_events(created_at desc);

create index if not exists idx_ai_runtime_events_worker
on public.ai_runtime_events(worker_id);
