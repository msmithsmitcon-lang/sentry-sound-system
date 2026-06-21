-- Runtime core execution contracts
-- Canonical path:
-- ai_tasks -> ai_task_queue -> rpc_ai_claim_next_task -> worker -> rpc_ai_complete_task

create table if not exists public.ai_tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid null,
  task_type text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending',
  result jsonb null,
  error_message text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz null
);

create table if not exists public.ai_task_queue (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.ai_tasks(id) on delete cascade,
  status text not null default 'pending',
  locked_by text null,
  locked_at timestamptz null,
  available_at timestamptz not null default now(),
  attempts integer not null default 0,
  max_attempts integer not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.rpc_ai_create_task(
  p_task_type text,
  p_payload jsonb default '{}'::jsonb,
  p_tenant_id uuid default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_task_id uuid;
begin
  insert into public.ai_tasks (tenant_id, task_type, payload, status)
  values (p_tenant_id, p_task_type, coalesce(p_payload, '{}'::jsonb), 'pending')
  returning id into v_task_id;

  insert into public.ai_task_queue (task_id, status)
  values (v_task_id, 'pending');

  return v_task_id;
end;
$$;

create or replace function public.rpc_ai_claim_next_task(
  p_worker_id text
)
returns table (
  task_id uuid,
  queue_id uuid,
  task_type text,
  payload jsonb
)
language plpgsql
security definer
as $$
begin
  return query
  with next_item as (
    select q.id
    from public.ai_task_queue q
    where q.status = 'pending'
      and q.available_at <= now()
    order by q.created_at asc
    for update skip locked
    limit 1
  ),
  claimed as (
    update public.ai_task_queue q
    set status = 'processing',
        locked_by = p_worker_id,
        locked_at = now(),
        attempts = q.attempts + 1,
        updated_at = now()
    from next_item n
    where q.id = n.id
    returning q.id, q.task_id
  )
  update public.ai_tasks t
  set status = 'processing',
      updated_at = now()
  from claimed c
  where t.id = c.task_id
  returning t.id, c.id, t.task_type, t.payload;
end;
$$;

create or replace function public.rpc_ai_complete_task(
  p_task_id uuid,
  p_result jsonb default '{}'::jsonb
)
returns boolean
language plpgsql
security definer
as $$
begin
  update public.ai_tasks
  set status = 'completed',
      result = coalesce(p_result, '{}'::jsonb),
      completed_at = now(),
      updated_at = now()
  where id = p_task_id;

  update public.ai_task_queue
  set status = 'completed',
      updated_at = now()
  where task_id = p_task_id;

  return true;
end;
$$;
