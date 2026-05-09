create table if not exists rbac_roles (
    id uuid primary key default gen_random_uuid(),
    role_key text not null unique,
    display_name text not null,
    description text,
    is_system_role boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists rbac_permissions (
    id uuid primary key default gen_random_uuid(),
    resource text not null,
    action text not null,
    description text,
    created_at timestamptz not null default now(),
    unique(resource, action)
);

create table if not exists rbac_role_permissions (
    id uuid primary key default gen_random_uuid(),
    role_id uuid not null references rbac_roles(id) on delete cascade,
    permission_id uuid not null references rbac_permissions(id) on delete cascade,
    created_at timestamptz not null default now(),
    unique(role_id, permission_id)
);

create table if not exists workspace_user_roles (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references workspaces(id) on delete cascade,
    user_id uuid not null,
    role_id uuid not null references rbac_roles(id) on delete restrict,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(workspace_id, user_id, role_id)
);

create index if not exists idx_workspace_user_roles_workspace_user
on workspace_user_roles(workspace_id, user_id);

create index if not exists idx_rbac_role_permissions_role
on rbac_role_permissions(role_id);

create index if not exists idx_rbac_role_permissions_permission
on rbac_role_permissions(permission_id);