alter table projects
add column if not exists workspace_id uuid references workspaces(id) on delete cascade;
