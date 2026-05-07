create table if not exists public.approval_requests (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  approval_type text not null,

  lifecycle_status text not null default 'draft'
    check (
      lifecycle_status in (
        'draft',
        'pending_review',
        'approved',
        'rejected',
        'cancelled',
        'expired'
      )
    ),

  title text not null,
  summary text,

  linked_record_type text,
  linked_record_id uuid,

  requested_by_workspace_member_id uuid,

  expires_at timestamptz,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_approval_requests_workspace
  on public.approval_requests(workspace_id);

create table if not exists public.approval_steps (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  approval_request_id uuid not null
    references public.approval_requests(id)
    on delete cascade,

  step_order integer not null,

  approver_type text not null,

  approver_workspace_member_id uuid,

  lifecycle_status text not null default 'pending_review'
    check (
      lifecycle_status in (
        'pending_review',
        'approved',
        'rejected',
        'skipped',
        'expired'
      )
    ),

  due_at timestamptz,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.approval_responses (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  approval_step_id uuid not null
    references public.approval_steps(id)
    on delete cascade,

  response_type text not null
    check (
      response_type in (
        'approved',
        'rejected',
        'commented'
      )
    ),

  response_comment text,

  responded_by_workspace_member_id uuid,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.approval_audit_events (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  approval_request_id uuid
    references public.approval_requests(id)
    on delete set null,

  event_type text not null,
  event_summary text not null,
  event_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
