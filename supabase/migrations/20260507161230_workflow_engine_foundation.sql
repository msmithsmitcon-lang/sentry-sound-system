create table if not exists workflow_stages (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null references workspaces(id) on delete cascade,

  entity_type text not null
  check (
    entity_type in (
      'project',
      'song',
      'release',
      'finance',
      'artist',
      'task'
    )
  ),

  stage_key text not null,
  stage_name text not null,

  stage_order integer not null default 0,

  is_default boolean not null default false,
  is_final boolean not null default false,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create table if not exists workflow_stage_history (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null references workspaces(id) on delete cascade,

  entity_type text not null,
  entity_id uuid not null,

  from_stage text,
  to_stage text not null,

  changed_by text,

  notes text,

  created_at timestamptz not null default now()
);

insert into workflow_stages (
  workspace_id,
  entity_type,
  stage_key,
  stage_name,
  stage_order,
  is_default,
  is_final
)
select
  id,
  'project',
  'planning',
  'Planning',
  1,
  true,
  false
from workspaces
where not exists (
  select 1
  from workflow_stages
  where workflow_stages.workspace_id = workspaces.id
  and workflow_stages.entity_type = 'project'
  and workflow_stages.stage_key = 'planning'
);

insert into workflow_stages (
  workspace_id,
  entity_type,
  stage_key,
  stage_name,
  stage_order,
  is_default,
  is_final
)
select
  id,
  'project',
  'active',
  'Active Production',
  2,
  false,
  false
from workspaces
where not exists (
  select 1
  from workflow_stages
  where workflow_stages.workspace_id = workspaces.id
  and workflow_stages.entity_type = 'project'
  and workflow_stages.stage_key = 'active'
);

insert into workflow_stages (
  workspace_id,
  entity_type,
  stage_key,
  stage_name,
  stage_order,
  is_default,
  is_final
)
select
  id,
  'project',
  'review',
  'Review',
  3,
  false,
  false
from workspaces
where not exists (
  select 1
  from workflow_stages
  where workflow_stages.workspace_id = workspaces.id
  and workflow_stages.entity_type = 'project'
  and workflow_stages.stage_key = 'review'
);

insert into workflow_stages (
  workspace_id,
  entity_type,
  stage_key,
  stage_name,
  stage_order,
  is_default,
  is_final
)
select
  id,
  'project',
  'completed',
  'Completed',
  4,
  false,
  true
from workspaces
where not exists (
  select 1
  from workflow_stages
  where workflow_stages.workspace_id = workspaces.id
  and workflow_stages.entity_type = 'project'
  and workflow_stages.stage_key = 'completed'
);
