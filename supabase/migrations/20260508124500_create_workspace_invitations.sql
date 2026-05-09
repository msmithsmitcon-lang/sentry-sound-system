create table if not exists workspace_invitations (
    id uuid primary key default gen_random_uuid(),

    workspace_id uuid not null references workspaces(id) on delete cascade,

    email text not null,
    role_id uuid not null references rbac_roles(id) on delete restrict,

    status text not null default 'pending'
        check (status in ('pending','accepted','declined','expired','cancelled')),

    invited_by_clerk_user_id text,

    invitation_token text not null unique,

    expires_at timestamptz,

    accepted_at timestamptz,
    accepted_by_clerk_user_id text,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    unique(workspace_id, email, status)
);

create index if not exists idx_workspace_invitations_workspace
on workspace_invitations(workspace_id);

create index if not exists idx_workspace_invitations_email
on workspace_invitations(email);

create index if not exists idx_workspace_invitations_status
on workspace_invitations(status);

create index if not exists idx_workspace_invitations_token
on workspace_invitations(invitation_token);