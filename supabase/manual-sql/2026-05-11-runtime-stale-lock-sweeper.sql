-- Runtime Governance: Stale Lock Sweeper
-- Date: 2026-05-11
-- Apply manually in Supabase SQL Editor if CLI drift occurs.

create or replace function rpc_ai_sweep_stale_locks(
  p_stale_after_minutes integer default 15
)
returns table (
  queue_id uuid,
  task_id uuid,
  previous_status text,
  new_status text
)
language plpgsql
security definer
as $$
begin
  return query
  update ai_task_queue q
  set
    status = 'pending',
    locked_by = null,
    locked_at = null,
    updated_at = now()
  where q.status = 'processing'
    and q.locked_at < now() - make_interval(mins => p_stale_after_minutes)
  returning
    q.id,
    q.task_id,
    'processing'::text,
    'pending'::text;
end;
$$;
