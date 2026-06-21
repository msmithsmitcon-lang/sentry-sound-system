-- ============================================
-- ACADEMY LEARNER COMPETENCY STATES
-- ============================================

create table if not exists academy_learner_competency_states (
    id uuid primary key default gen_random_uuid(),

    learner_id text not null,

    programme_id text not null,
    module_id text not null,
    slb_id text not null,

    competency_state text not null,

    remediation_history jsonb default '[]'::jsonb,

    completed_states jsonb default '[]'::jsonb,

    telemetry_summary jsonb default '{}'::jsonb,

    updated_at timestamptz default now()
);

-- ============================================
-- ACADEMY TELEMETRY EVENTS
-- ============================================

create table if not exists academy_telemetry_events (
    id uuid primary key default gen_random_uuid(),

    learner_id text not null,

    programme_id text,
    module_id text,
    slb_id text,

    session_id text,

    event_type text not null,

    runtime_state text,

    metadata jsonb default '{}'::jsonb,

    created_at timestamptz default now()
);

-- ============================================
-- ACADEMY EVIDENCE RECORDS
-- ============================================

create table if not exists academy_evidence_records (
    id uuid primary key default gen_random_uuid(),

    learner_id text not null,

    programme_id text,
    module_id text,
    slb_id text,

    evidence_type text not null,

    competency_target text,

    passed boolean default false,

    metadata jsonb default '{}'::jsonb,

    submitted_at timestamptz default now()
);

-- ============================================
-- ACADEMY ASSESSMENT RESULTS
-- ============================================

create table if not exists academy_assessment_results (
    id uuid primary key default gen_random_uuid(),

    learner_id text not null,

    assessment_id text not null,

    programme_id text,
    module_id text,
    slb_id text,

    score numeric default 0,

    passed boolean default false,

    remediation_required boolean default false,

    metadata jsonb default '{}'::jsonb,

    evaluated_at timestamptz default now()
);
