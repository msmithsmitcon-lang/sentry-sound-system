-- ============================================
-- ACADEMY RUNTIME AUDIT TRAIL
-- ============================================

create table if not exists academy_runtime_audit_trail (
    id uuid primary key default gen_random_uuid(),

    learner_id text not null,

    programme_id text,
    module_id text,
    slb_id text,

    session_id text,

    action_type text not null,

    runtime_state text,

    metadata jsonb default '{}'::jsonb,

    created_at timestamptz default now()
);
