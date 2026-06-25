-- Sentry Sound Platform - workspace_plan_assignments draft migration
--
-- PHASE 8C DRAFT ONLY:
-- This migration file defines the proposed Supabase-owned workspace plan/status
-- persistence table. It must not be treated as production entitlement activation.
--
-- No route, middleware, dashboard, song capture, submission, evidence, billing,
-- quota, or production mutation workflow may depend on this table until a later
-- resolver adapter and full enforcement chain are explicitly approved.
--
-- DO NOT APPLY THIS _draft.sql FILE DIRECTLY:
-- Before application, this file must be reviewed, approved, and renamed to a
-- final migration filename. Migration alone does not activate entitlement
-- enforcement or make song/submission/evidence workflows production-safe.

create table if not exists public.workspace_plan_assignments (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null references public.workspaces(id) on delete cascade,

  plan_key text not null
    check (
      plan_key in (
        'TEST_DEMO_PLAN',
        'FREE_INVITED_CONTRIBUTOR_ACCESS',
        'ARTIST_STARTER',
        'ARTIST_PRO',
        'PRODUCER_STUDIO',
        'LABEL_PUBLISHER',
        'ENTERPRISE_ADMIN_COMPANY'
      )
    ),

  subscription_status text not null
    check (
      subscription_status in (
        'test_demo',
        'active',
        'trial',
        'suspended',
        'cancelled',
        'not_configured',
        'unknown'
      )
    ),

  source text not null
    check (
      source in (
        'system_default',
        'demo_workspace_fallback',
        'workspace_record_later',
        'admin_override_later',
        'billing_provider_later',
        'not_configured',
        'unknown'
      )
    ),

  is_production_eligible boolean not null default false,

  effective_from timestamptz not null default now(),
  effective_until timestamptz,

  reason text,

  -- Actor fields intentionally store external actor identifiers such as Clerk user ids.
  -- They are nullable for system/default assignments and do not create user ownership.
  created_by text,
  updated_by text,

  -- Supporting references only. This column must not become entitlement truth.
  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint workspace_plan_assignments_effective_window_check
    check (effective_until is null or effective_until > effective_from)
);

create index if not exists idx_workspace_plan_assignments_workspace_id
  on public.workspace_plan_assignments(workspace_id);

create index if not exists idx_workspace_plan_assignments_workspace_effective_window
  on public.workspace_plan_assignments(workspace_id, effective_from, effective_until);

create index if not exists idx_workspace_plan_assignments_subscription_status
  on public.workspace_plan_assignments(subscription_status);

create index if not exists idx_workspace_plan_assignments_plan_key
  on public.workspace_plan_assignments(plan_key);

create index if not exists idx_workspace_plan_assignments_source
  on public.workspace_plan_assignments(source);

-- Multiple current/active rows are not DB-prevented in this draft.
-- A future resolver adapter must fail closed if more than one assignment is
-- current for the same workspace, unless a later approved final migration adds
-- a database-level uniqueness/exclusion strategy.

comment on table public.workspace_plan_assignments is
  'DRAFT Phase 8C entitlement persistence table. Operational workspace plan/status state only; no production entitlement, billing, route, song, submission, or evidence activation.';

comment on column public.workspace_plan_assignments.plan_key is
  'Allowed entitlement plan key from the backend entitlement registry.';

comment on column public.workspace_plan_assignments.subscription_status is
  'Normalized entitlement/access status. This is not payment-provider status.';

comment on column public.workspace_plan_assignments.source is
  'Normalized assignment source. Billing-provider-fed state must be normalized and audited before use.';

comment on column public.workspace_plan_assignments.is_production_eligible is
  'Explicit resolver input only. This flag alone must not authorize production mutations.';

comment on column public.workspace_plan_assignments.metadata is
  'Supporting references only. Metadata/settings must not be used as entitlement truth.';

-- updated_at trigger note:
-- Existing migrations include a CRM-specific updated_at trigger helper only.
-- No generic shared updated_at trigger helper was found during Phase 8C inspection.
-- A generic trigger/helper or table-specific trigger remains deferred until explicitly approved.
