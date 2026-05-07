create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  notification_type text not null,

  lifecycle_status text not null default 'draft'
    check (
      lifecycle_status in (
        'draft',
        'queued',
        'sent',
        'delivered',
        'failed',
        'cancelled',
        'archived'
      )
    ),

  title text not null,
  message text not null,

  linked_record_type text,
  linked_record_id uuid,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_notifications_workspace
  on public.notifications(workspace_id);

create table if not exists public.notification_recipients (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  notification_id uuid not null
    references public.notifications(id)
    on delete cascade,

  recipient_type text not null,
  recipient_id uuid,
  recipient_email text,

  delivery_channel text not null
    check (
      delivery_channel in (
        'in_app',
        'email',
        'sms',
        'webhook'
      )
    ),

  read_at timestamptz,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.notification_delivery_attempts (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  notification_recipient_id uuid not null
    references public.notification_recipients(id)
    on delete cascade,

  delivery_status text not null default 'queued'
    check (
      delivery_status in (
        'queued',
        'sent',
        'delivered',
        'failed',
        'cancelled'
      )
    ),

  provider_name text,
  provider_reference text,
  error_message text,

  attempted_at timestamptz not null default now()
);

create table if not exists public.notification_templates (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  template_key text not null,
  template_name text not null,

  delivery_channel text not null
    check (
      delivery_channel in (
        'in_app',
        'email',
        'sms',
        'webhook'
      )
    ),

  subject_template text,
  body_template text not null,

  active boolean not null default true,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists public.notification_audit_events (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.workspaces(id)
    on delete cascade,

  notification_id uuid
    references public.notifications(id)
    on delete set null,

  event_type text not null,
  event_summary text not null,
  event_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
