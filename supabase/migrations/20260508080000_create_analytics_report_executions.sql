create table if not exists analytics_report_executions (
    id uuid primary key default gen_random_uuid(),

    report_definition_id uuid not null references analytics_report_definitions(id) on delete cascade,

    workflow_run_id uuid references workflow_runs(id) on delete set null,
    scheduled_job_run_id uuid references scheduled_job_runs(id) on delete set null,

    status text not null default 'queued'
        check (status in ('queued','processing','completed','failed','cancelled')),

    triggered_by text not null
        check (triggered_by in ('manual','scheduled','workflow','system')),

    execution_started_at timestamptz,
    execution_completed_at timestamptz,

    output_format text
        check (output_format in ('json','csv','xlsx','pdf')),

    output_storage_path text,
    output_metadata jsonb not null default '{}'::jsonb,

    execution_parameters jsonb not null default '{}'::jsonb,
    execution_context jsonb not null default '{}'::jsonb,

    records_processed integer not null default 0,

    retry_count integer not null default 0,
    error_message text,

    created_by uuid,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_analytics_report_executions_definition
on analytics_report_executions(report_definition_id);

create index if not exists idx_analytics_report_executions_status
on analytics_report_executions(status);

create index if not exists idx_analytics_report_executions_created_at
on analytics_report_executions(created_at desc);

create index if not exists idx_analytics_report_executions_workflow_run
on analytics_report_executions(workflow_run_id);

create index if not exists idx_analytics_report_executions_scheduled_job_run
on analytics_report_executions(scheduled_job_run_id);