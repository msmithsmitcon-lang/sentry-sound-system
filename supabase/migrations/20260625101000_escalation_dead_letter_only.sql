create table if not exists "EscalationDeadLetterQueue" (
  id text primary key,

  notification_id text not null,

  escalation_id text not null,

  channel text not null,

  failure_reason text not null,

  original_status text not null,

  quarantined_at timestamptz not null default now(),

  created_at timestamptz not null default now()
);

create index if not exists idx_escalation_dead_letter_notification_id
on "EscalationDeadLetterQueue"(notification_id);

create index if not exists idx_escalation_dead_letter_escalation_id
on "EscalationDeadLetterQueue"(escalation_id);

create index if not exists idx_escalation_dead_letter_channel
on "EscalationDeadLetterQueue"(channel);
