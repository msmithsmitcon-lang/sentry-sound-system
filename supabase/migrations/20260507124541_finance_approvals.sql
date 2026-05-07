create table if not exists finance_approvals (
  id uuid primary key default gen_random_uuid(),

  approval_type text not null,

  entity_type text not null,

  entity_id text not null,

  status text not null default 'pending'
  check (
    status in (
      'pending',
      'approved',
      'rejected'
    )
  ),

  requested_by text,

  approved_by text,

  rejected_by text,

  approval_notes text,

  approved_at timestamptz,
  rejected_at timestamptz,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
