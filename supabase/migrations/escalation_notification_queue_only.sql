create table if not exists "EscalationNotificationQueue" (
  id text primary key,

  escalation_id text not null,

  channel text not null,

  recipients jsonb not null default '[]'::jsonb,

  subject text not null,

  message text not null,

  status text not null default 'QUEUED',

  queued_at timestamptz not null default now(),

  dispatched_at timestamptz,

  failed_at timestamptz,

  failure_reason text,

  created_at timestamptz not null default now()
);

create index if not exists idx_escalation_notification_queue_status
on "EscalationNotificationQueue"(status);

create index if not exists idx_escalation_notification_queue_channel
on "EscalationNotificationQueue"(channel);

create index if not exists idx_escalation_notification_queue_escalation_id
on "EscalationNotificationQueue"(escalation_id);
