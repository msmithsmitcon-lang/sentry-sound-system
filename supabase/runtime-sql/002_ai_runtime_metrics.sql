create table if not exists public.ai_runtime_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid null,
  metric_type text not null,
  metric_value numeric not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now()
);

create index if not exists idx_ai_runtime_metrics_type
on public.ai_runtime_metrics(metric_type);

create index if not exists idx_ai_runtime_metrics_recorded_at
on public.ai_runtime_metrics(recorded_at desc);
