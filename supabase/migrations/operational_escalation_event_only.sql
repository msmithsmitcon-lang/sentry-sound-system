create table if not exists "OperationalEscalationEvent" (
  id text primary key,

  trigger_type text not null,

  severity text not null,

  lifecycle_state text not null,

  policy_code text,

  reasons jsonb not null default '[]'::jsonb,

  triggered_at timestamptz not null default now(),

  acknowledged_at timestamptz,

  resolved_at timestamptz,

  created_at timestamptz not null default now()
);

create index if not exists idx_operational_escalation_event_trigger_type
on "OperationalEscalationEvent"(trigger_type);

create index if not exists idx_operational_escalation_event_lifecycle_state
on "OperationalEscalationEvent"(lifecycle_state);

create index if not exists idx_operational_escalation_event_severity
on "OperationalEscalationEvent"(severity);
