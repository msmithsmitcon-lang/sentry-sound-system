# Sentry Sound Platform - Workspace Plan Persistence Migration Governance Checklist V1

## 1. Purpose

This document is the final governance checklist before any workspace plan/status persistence migration is allowed.

It does not approve a migration. It defines the conditions that must be true before a future migration can be created, reviewed, and applied.

This is documentation only.

No schema, migration, code, route, middleware, billing, or production activation is approved by this document.

## 2. Migration Objective

The future migration objective is to create the smallest governed persistence surface for workspace entitlement state.

The table must provide a typed operational source for:

- workspace plan key
- workspace entitlement/access status
- plan assignment source
- production eligibility
- effective window
- administrative reason/reference
- change accountability fields

The table exists to support a later resolver adapter. It must not directly activate entitlement enforcement.

## 3. Non-Goals

The migration must not:

- implement billing
- integrate Stripe, Paystack, checkout, webhooks, invoices, or payment status
- create a full subscription billing engine
- create quota counters
- create entitlement middleware
- wire any production route
- make dashboard cards production-operational
- make song capture, submissions, evidence, lifecycle, finance, royalty, AI, API, workflow, marketing, booking, or enterprise capabilities production-safe
- infer rights ownership
- infer submission authority
- replace Clerk, workspace context, RBAC, terms acceptance, ownership validation, business validation, or audit governance
- use `workspaces.metadata`, `workspace_settings.settings`, Clerk metadata, or billing metadata as entitlement truth

## 4. Supabase vs Prisma Ownership Rule

Current workspace foundation persistence is Supabase-owned.

The future workspace plan/status table should therefore be introduced through Supabase migration governance unless the platform first approves a broader Prisma ownership change for workspace foundation tables.

Rules:

- Do not add a Prisma-only model for workspace plan state while workspace foundation tables remain Supabase-owned.
- Do not duplicate plan truth across Prisma and Supabase.
- Do not hide plan state in metadata/settings JSON.
- Keep the plan assignment table near the existing workspace foundation tables.
- Treat Prisma alignment, if needed later, as a separate persistence ownership decision.

## 5. Required Table Purpose

Recommended future table purpose:

`workspace_plan_assignments` stores normalized operational entitlement state for a workspace.

It is not:

- a billing subscription table
- a payment-provider table
- a rights ownership table
- a workspace membership table
- a user role table
- a quota counter table
- a durable audit event table

It should answer one narrow question:

```text
What governed plan/status assignment should the entitlement resolver evaluate for this workspace?
```

## 6. Required Fields

Minimum recommended future fields:

| Field | Requirement | Purpose |
| --- | --- | --- |
| `id` | Required | Stable row identity. |
| `workspace_id` | Required | Links assignment to `workspaces.id`. |
| `plan_key` | Required | One allowed entitlement plan key. |
| `subscription_status` | Required | Normalized entitlement/access status. |
| `source` | Required | Explains where this plan assignment came from. |
| `is_production_eligible` | Required | Explicit production eligibility flag evaluated by resolver. |
| `effective_from` | Required | Start of assignment validity. |
| `effective_until` | Nullable | End of assignment validity. |
| `reason` | Nullable | Human-readable admin/commercial/change reason. |
| `created_by` | Nullable initially | Actor responsible for initial assignment when available. |
| `updated_by` | Nullable initially | Actor responsible for latest assignment when available. |
| `metadata` | Nullable | Supporting references only, never entitlement truth. |
| `created_at` | Required | Creation timestamp. |
| `updated_at` | Required | Latest update timestamp. |

Recommended constraints before production dependency:

- `workspace_id` references `workspaces.id`
- `plan_key` constrained to approved plan values
- `subscription_status` constrained to approved status values
- `source` constrained to approved source values
- `effective_until` must be null or later than `effective_from`
- only one current active assignment per workspace, or resolver must fail closed on conflicts

## 7. Allowed Values

Allowed `plan_key` values:

- `TEST_DEMO_PLAN`
- `FREE_INVITED_CONTRIBUTOR_ACCESS`
- `ARTIST_STARTER`
- `ARTIST_PRO`
- `PRODUCER_STUDIO`
- `LABEL_PUBLISHER`
- `ENTERPRISE_ADMIN_COMPANY`

Allowed entitlement/access status values should map to the current TypeScript contract:

- `test_demo`
- `active`
- `trial`
- `suspended`
- `cancelled`
- `not_configured`
- `unknown`

Allowed source values should map to the current TypeScript contract:

- `system_default`
- `demo_workspace_fallback`
- `workspace_record_later`
- `admin_override_later`
- `billing_provider_later`
- `not_configured`
- `unknown`

If the future table uses database-friendly names such as `workspace_record`, `admin_override`, or `billing_provider`, the resolver adapter must explicitly map those values into the TypeScript contract. Silent or implicit mapping is not allowed.

## 8. Effective-Window Rules

The resolver adapter must treat an assignment as current only when:

```text
effective_from <= now
and
(effective_until is null or effective_until > now)
```

Rules:

- Future-dated assignments are not active yet.
- Expired assignments are not active.
- Missing `effective_from` fails closed.
- Invalid windows fail closed.
- Multiple current assignments for one workspace fail closed unless a database constraint makes that state impossible.
- Historical rows may exist, but production resolver logic must evaluate only the single valid current assignment.
- Effective windows must not be inferred from billing provider metadata.

## 9. Rollback Rules

The first migration must be additive.

Rollback expectations:

- The migration must not mutate existing `workspaces`, `workspace_members`, `workspace_user_roles`, `user_profiles`, song, submission, or evidence records.
- If rollback is required before route dependency, the table can be dropped without changing production behavior.
- If seed/demo rows are added later, they must be removable without affecting existing workspace foundation records.
- No route may depend on the table until resolver adapter, full chain, and audit handoff are separately approved.
- Rollback must preserve current TEST-only route behavior.

## 10. No-Activation Rules

Migration alone does not activate production entitlement.

Migration alone does not make song/submission/evidence production-safe.

No route may depend on the table until resolver adapter plus the full production mutation chain are approved.

The table must not be consumed by:

- song capture routes
- submission routes
- evidence routes
- dashboard production cards
- finance/royalty routes
- workflow automation
- API/integration routes
- middleware

until an explicit later implementation phase approves that integration.

## 11. Resolver Fail-Closed Requirements

The future resolver adapter must fail closed when:

- no assignment exists for a non-demo workspace
- the assignment has an unknown plan
- the assignment has an unknown status
- the assignment has an unknown source
- the assignment is suspended
- the assignment is cancelled
- the assignment is inactive
- the assignment is expired
- the assignment is future-dated
- the assignment is malformed
- more than one current assignment exists
- the workspace itself is inactive, suspended, missing, or unresolved
- the assignment says production eligible but the plan/status combination is not allowed for production

Fail-closed means the workspace is not production eligible and production-sensitive mutations remain blocked.

## 12. Demo Fallback Preservation

The existing demo fallback must be preserved.

Current rule:

```text
workspace name exactly "Sentry Sound Demo Workspace"
-> TEST_DEMO_PLAN
-> test_demo
-> demo_workspace_fallback
-> not production eligible
```

Rules:

- Demo fallback remains TEST-only.
- Demo fallback must not become production eligible.
- Demo fallback must not require a persisted table row.
- If a persisted row is later created for the demo workspace, the resolver must still preserve TEST/demo isolation unless a separate approved change explicitly replaces the fallback.

## 13. Billing-Provider Isolation

No billing provider integration is included.

The future table may reserve a normalized source value for future billing-provider-fed state, but:

- billing provider IDs are not entitlement logic
- payment status is not capability logic
- provider metadata is not plan truth
- provider webhooks must not directly mutate production capability behavior without normalization and audit
- billing tables, checkout sessions, invoices, and webhook ingestion are separate future work

The workspace plan assignment is operational governance state, not billing truth.

## 14. Audit / Change-Governance Expectations

Plan/status changes must be accountable.

Minimum expectations before production dependency:

- capture `created_by` where available
- capture `updated_by` where available
- capture `reason` for manual/admin changes
- preserve timestamps
- keep supporting references in `metadata` only as references
- produce or hand off audit metadata when plan/status is changed by an approved admin flow later

The initial migration may create the table only. Durable audit writes for plan changes are a separate future implementation unless explicitly approved with the migration.

## 15. Test Requirements

Before any migration is accepted:

- migration applies cleanly to a local/test database
- rollback path is documented
- allowed value constraints are verified
- effective-window constraint is verified
- workspace foreign key is verified
- no existing route starts reading the table
- no middleware starts reading the table
- existing entitlement tests still pass
- existing production mutation contract tests still pass

Before any resolver adapter consumes the table later:

- demo fallback still resolves to TEST-only
- missing row fails closed
- unknown plan fails closed
- unknown status fails closed
- unknown source fails closed
- suspended/cancelled rows fail closed
- expired rows fail closed
- future-dated rows fail closed
- multiple current rows fail closed or are impossible by constraint
- production-sensitive decisions remain blocked unless the full chain is satisfied

## 16. Manual Approval Gate Before Migration

Before a migration file is created, a future request must explicitly approve:

- the exact table name
- the exact migration file path
- the exact allowed plan/status/source values
- the exact required fields
- the exact constraints
- whether any seed/demo row is included
- the rollback plan
- the verification commands
- confirmation that no route activation is included
- confirmation that no billing provider integration is included

Absent that explicit approval, no migration should be created.

## 17. Post-Migration Verification Checklist

After a future approved migration, verify:

- `workspace_plan_assignments` or approved equivalent exists
- required fields exist
- constraints exist
- foreign key to `workspaces` exists
- no workspace foundation data was rewritten unexpectedly
- no Prisma schema was changed unless separately approved
- no route reads the table
- no middleware reads the table
- no song/submission/evidence production behavior changed
- no billing provider integration was introduced
- existing entitlement tests pass
- existing production mutation guard/audit contract tests pass
- build log records documentation/schema boundary accurately

## 18. Forbidden Assumptions

Do not assume:

- a table means entitlement enforcement is active
- a migration means production routes are safe
- `TEST_DEMO_PLAN` can perform production mutations
- workspace subscription status proves music rights ownership
- workspace owner equals rightsholder
- user actor equals contributor/rightsholder
- metadata/settings can be entitlement truth
- billing provider status can bypass entitlement governance
- route handlers may read plan state before resolver adapter approval
- dashboard cards may show production operational state before foundation-governed data exists
- song/submission/evidence workflows are production-safe

Current song capture, submission, and evidence workflows remain TEST-only.

## 19. Source References

- `docs/platform/ENTITLEMENT_AND_PRODUCTION_GOVERNANCE_HANDOVER_V1.md`
- `docs/platform/PLATFORM_ENTITLEMENT_DATA_MODEL_DECISION_V1.md`
- `docs/platform/PLATFORM_ENTITLEMENT_IMPLEMENTATION_PLAN_V1.md`
- `src/lib/entitlements/workspace-plan-context.ts`
- `src/lib/entitlements/resolve-workspace-plan.ts`
- `src/lib/entitlements/workspace-plan-status.ts`

## 20. Phase 8C Draft Migration Status

Draft migration file created:

- `supabase/migrations/20260517180000_workspace_plan_assignments_draft.sql`

Status:

- draft only
- not applied
- additive table creation only
- no seed data
- no Prisma model
- no route dependency
- no middleware
- no billing provider integration
- no production entitlement activation
- no song/submission/evidence activation
- not approved for direct application

The draft migration creates `workspace_plan_assignments` with required plan/status/source constraints, workspace/effective-window/status indexes, and comments that preserve the non-activation boundary.

Phase 8D review finding:

- Multiple current/active assignments for the same workspace are not DB-prevented in this draft.
- A future resolver adapter must fail closed if multiple active/current assignments exist for the same workspace.
- A later approved final migration may add a database-level uniqueness or exclusion strategy, but this draft does not.
- No route may depend on this table until the resolver adapter and full production governance chain are approved.
- Migration alone does not activate entitlement enforcement.

Trigger helper inspection result:

- Existing migrations contain a CRM-specific `set_crm_contacts_updated_at()` trigger helper.
- No generic shared `updated_at` trigger helper was found.
- The draft therefore keeps `updated_at timestamptz not null default now()` and defers any generic or table-specific `updated_at` trigger until explicitly approved.

This `_draft.sql` file must not be applied directly. Before application, it must be reviewed, approved, and renamed to a final migration filename.

## 21. Phase 8E Pure Mapper Status

Pure workspace plan assignment mapper files created:

- `src/lib/entitlements/workspace-plan-assignment-row.ts`
- `src/lib/entitlements/resolve-workspace-plan-from-assignment.ts`
- `src/lib/entitlements/workspace-plan-assignment-row.test.ts`

Updated entitlement exports:

- `src/lib/entitlements/workspace-plan-context.ts`
- `src/lib/entitlements/index.ts`

Status:

- pure TypeScript mapper/validator only
- no DB reads
- no Supabase imports
- no Prisma imports
- no schema changes
- no migrations applied
- no route dependency
- no middleware
- no production entitlement activation
- no song/submission/evidence activation

Mapper governance:

- Demo fallback takes precedence over assignment rows.
- Missing rows fail closed.
- Expired rows fail closed.
- Future-dated rows fail closed.
- Multiple current rows fail closed.
- Unknown plan/status/source values fail closed as malformed.
- Workspace suspended/inactive state fails closed before assignment mapping.
- `is_production_eligible` cannot authorize production by itself.
- Metadata is not used as entitlement truth.

Test command:

```powershell
cmd /c "npx tsx src/lib/entitlements/workspace-plan-assignment-row.test.ts"
```

Result:

`Workspace plan assignment row mapper tests passed`

This mapper does not consume the draft migration table and does not make the draft migration approved for application.
