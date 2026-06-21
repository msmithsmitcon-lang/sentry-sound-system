-- ============================================
-- SENTRY SOUND ACADEMY
-- RUNTIME REGISTRY FOUNDATION V1
-- ============================================

create table if not exists academy_slb_registry (
    academy_slb_id uuid primary key default gen_random_uuid(),
    slb_code text not null unique,
    slb_name text,
    module_code text,
    status text not null default 'active',
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists academy_slb_competency_map (
    id uuid primary key default gen_random_uuid(),
    academy_slb_id uuid not null references academy_slb_registry(academy_slb_id) on delete cascade,
    competency_id uuid not null,
    competency_code text,
    mapping_status text not null default 'active',
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    unique (academy_slb_id, competency_id)
);

create table if not exists academy_lesson_execution_sessions (
    id uuid primary key default gen_random_uuid(),
    session_id text not null unique,
    learner_id text not null,
    lesson_id text,
    slm_id text,
    slb_id text,
    current_state text,
    started_at timestamptz default now(),
    completed_at timestamptz,
    tenant_id uuid,
    runtime_learner_id text,
    academy_slb_uuid uuid references academy_slb_registry(academy_slb_id),
    runtime_competency_id uuid,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create index if not exists idx_academy_slb_registry_slb_code
on academy_slb_registry(slb_code);

create index if not exists idx_academy_slb_competency_map_slb
on academy_slb_competency_map(academy_slb_id);

create index if not exists idx_academy_slb_competency_map_competency
on academy_slb_competency_map(competency_id);

create index if not exists idx_academy_lesson_execution_sessions_session
on academy_lesson_execution_sessions(session_id);

create index if not exists idx_academy_lesson_execution_sessions_learner
on academy_lesson_execution_sessions(learner_id);

create index if not exists idx_academy_lesson_execution_sessions_runtime_competency
on academy_lesson_execution_sessions(runtime_competency_id);
