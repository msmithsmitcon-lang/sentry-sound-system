alter table projects
add column if not exists title text;

alter table projects
add column if not exists description text;

alter table projects
add column if not exists project_type text default 'music_project';

alter table projects
add column if not exists status text default 'planning';

alter table projects
add column if not exists start_date date;

alter table projects
add column if not exists end_date date;

alter table projects
add column if not exists created_by text;

alter table projects
add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table projects
add column if not exists updated_at timestamptz not null default now();
