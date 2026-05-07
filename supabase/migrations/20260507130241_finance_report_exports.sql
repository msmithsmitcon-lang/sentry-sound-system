create table if not exists finance_report_exports (
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

  file_name text not null,

  storage_path text not null,

  generated_by text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);
