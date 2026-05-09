create table if not exists authorization_audit_events (
    id uuid primary key default gen_random_uuid(),

    workspace_id uuid references workspaces(id) on delete set null,
    clerk_user_id text,

    resource text not null,
    action text not null,

    allowed boolean not null,
    reason text,

    metadata jsonb not null default '{}'::jsonb,

    created_at timestamptz not null default now()
);

create index if not exists idx_authorization_audit_events_workspace
on authorization_audit_events(workspace_id);

create index if not exists idx_authorization_audit_events_user
on authorization_audit_events(clerk_user_id);

create index if not exists idx_authorization_audit_events_created_at
on authorization_audit_events(created_at desc);