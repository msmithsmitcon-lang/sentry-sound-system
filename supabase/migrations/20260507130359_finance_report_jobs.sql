create table if not exists finance_report_jobs (
  id uuid primary key default gen_random_uuid(),

  report_type text not null,

  export_format text not null
  check (
    export_format in (
      'pdf',
      'xlsx',
      'csv'
    )
  ),

  status text not null default 'queued'
  check (
    status in (
      'queued',
      'processing',
      'completed',
      'failed'
    )
  ),

  requested_by text,

  completed_at timestamptz,

  failure_reason text,

  export_id uuid references finance_report_exports(id),

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
