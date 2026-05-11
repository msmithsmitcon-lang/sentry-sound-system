create or replace function public.rpc_ai_upsert_worker(
  p_worker_id text,
  p_hostname text,
  p_status text,
  p_active_task_count integer
)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.ai_runtime_workers (
    worker_id,
    hostname,
    status,
    active_task_count,
    last_heartbeat_at
  )
  values (
    p_worker_id,
    p_hostname,
    p_status,
    p_active_task_count,
    now()
  )
  on conflict (worker_id)
  do update set
    hostname = excluded.hostname,
    status = excluded.status,
    active_task_count = excluded.active_task_count,
    last_heartbeat_at = now(),
    updated_at = now();
end;
$$;
