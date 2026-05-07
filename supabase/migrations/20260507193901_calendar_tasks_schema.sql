create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  event_type text not null,

  title text not null,
  description text,

  lifecycle_status text not null default 'scheduled'
    check (
      lifecycle_status in (
        'scheduled',
        'active',
        'completed',
        'cancelled'
      )
    ),

  start_at timestamptz,
  end_at timestamptz,

  linked_record_type text,
  linked_record_id uuid,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_calendar_events_workspace
  on public.calendar_events(workspace_id);

create table if not exists public.task_items (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  task_type text not null,

  title text not null,
  description text,

  lifecycle_status text not null default 'draft'
    check (
      lifecycle_status in (
        'draft',
        'open',
        'in_progress',
        'blocked',
        'completed',
        'archived'
      )
    ),

  priority_level text not null default 'normal'
    check (
      priority_level in (
        'low',
        'normal',
        'high',
        'critical'
      )
    ),

  due_at timestamptz,

  linked_record_type text,
  linked_record_id uuid,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_task_items_workspace
  on public.task_items(workspace_id);

create table if not exists public.task_assignments (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  task_item_id uuid not null
    references public.task_items(id)
    on delete cascade,

  assigned_workspace_member_id uuid,

  assigned_crm_contact_id uuid
    references public.crm_contacts(id)
    on delete set null,

  assignment_role text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.task_comments (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  task_item_id uuid not null
    references public.task_items(id)
    on delete cascade,

  comment_text text not null,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.task_audit_events (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  task_item_id uuid
    references public.task_items(id)
    on delete set null,

  event_type text not null,
  event_summary text not null,

  event_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
