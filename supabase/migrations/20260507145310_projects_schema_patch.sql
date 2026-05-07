alter table projects
add column if not exists created_by text;

alter table projects
add column if not exists start_date date;

alter table projects
add column if not exists end_date date;

alter table projects
add column if not exists metadata jsonb not null default '{}'::jsonb;
