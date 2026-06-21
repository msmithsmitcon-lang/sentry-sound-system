# Sentry Sound Read-Only Current-State Inventory V1

Date: 2026-06-05

Status: read-only inventory only. No implementation, SQL, migration, schema change, API route, backend refactor, UI change, import, delete, rename, or database write is created by this document.

## 1. Executive Summary

This inventory maps the actual current Sentry Sound platform state against the approved doctrine chain and controlled refactor roadmap.

It is a factual discovery artifact, not a refactor plan.

The current platform has a working protected foundation:

- workspace-scoped foundation
- active `musical_works` Work seed
- Chronicle foundation catalogue records
- create-song path backed by `rpc_create_song_with_contributors`
- contributor capture through `contributors` / `work_contributors`
- CRM and artist profile foundations
- rights lifecycle seed
- release and distribution foundations
- registration/evidence/submission structures
- File Vault/supporting materials foundations
- current royalty engine and finance boundary
- public/landing and dashboard surfaces

Highest-risk current-state domains:

- Royalty Authority / Royalty Events
- Rights Interest / Ownership Authority
- Master / Recording
- Party / CRM / Identity
- Registration / Identifiers

Most stable/protected current-state domains:

- Workspace / access boundary
- Work / `musical_works`
- Chronicle Integration
- File Vault foundation
- Finance boundary
- release/distribution foundations as operational seeds

Inventory conclusion:

The platform should remain protected. The next work should be interpretation and prioritization of this inventory, not implementation.

## 2. Inventory Scope

Inspected sources:

- completed doctrine artifacts in `docs/platform/`
- `docs/platform/SENTRY-SOUND-CONTROLLED-REFACTOR-ROADMAP-V1.md`
- `docs/platform/SENTRY-SOUND-DOCTRINE-CONSOLIDATION-AND-GAP-ANALYSIS-V1.md`
- Chronicle integration/import docs
- module docs in `docs/modules/`
- royalty docs in `docs/royalties/`
- database docs in `docs/database/`
- Supabase migrations in `supabase/migrations/`
- Prisma schema in `prisma/schema.prisma`
- API routes under `app/api/`
- services/repositories under `src/lib/` and `lib/`
- app/dashboard and landing UI surfaces

Boundary:

- read-only inspection
- no runtime database inspection
- no schema mutation
- no code mutation
- no UI mutation
- no import
- no data write

## 3. Classification Legend

Doctrine alignment status:

- aligned: current structure matches doctrine role
- partial: directionally useful, but incomplete
- transitional: useful existing structure that must not be treated as final authority
- misaligned: current use conflicts with doctrine authority model
- unknown: not enough inspected evidence to classify fully

Risk level:

- low: safe foundation/read-only context
- medium: wording or future integration risk
- high: can create authority drift if extended without design
- critical: can produce wrong rights/royalty/ownership outcomes if used as authority

## 4. Workspace / Access Boundary

Current tables:

- `workspaces`
- `workspace_members`
- `workspace_settings`
- `workspace_activity`
- `workspace_user_roles`
- `workspace_invitations`
- `workspace_plan_assignments`
- `user_profiles`
- `authorization_audit_events`
- organization/support tables: `departments`, `teams`

Current migrations/files:

- `supabase/migrations/20260507131823_workspace_foundation.sql`
- `supabase/migrations/20260507183827_organization_foundation.sql`
- `supabase/migrations/20260508103000_create_rbac_foundation.sql`
- `supabase/migrations/20260508113000_workspace_user_roles_clerk_user_id_text.sql`
- `supabase/migrations/20260508120000_create_user_profiles.sql`
- `supabase/migrations/20260508123000_create_authorization_audit_events.sql`
- `supabase/migrations/20260508124500_create_workspace_invitations.sql`
- `supabase/migrations/20260517180000_workspace_plan_assignments.sql`

Current API routes:

- `app/api/workspaces/route.ts`
- `app/api/workspace-members/route.ts`
- `app/api/workspace-setup/route.ts`
- `app/api/workspace-context/me/route.ts`
- `app/api/workspace-context/resolved/route.ts`
- `app/api/workspace-invitations/create/route.ts`
- `app/api/workspace-invitations/accept/route.ts`
- `app/api/authz/me/route.ts`
- `app/api/authz/sync-me/route.ts`
- `app/api/authz/sync-me-browser-test/route.ts`

Current services/repositories:

- `src/lib/workspace-context/get-authenticated-workspace-context.ts`
- `src/lib/authz/workspace-context/resolve-workspace-context.ts`
- `src/lib/authz/require-permission.ts`
- `src/lib/authz/log-authorization-event.ts`
- `src/lib/authz/clerk-sync/sync-clerk-user.ts`
- `src/lib/workspace-setup/workspace-setup-v1.ts`
- `src/lib/workspace-setup/workspace-setup-v1-supabase.ts`
- `src/lib/workspace-invitations/create-workspace-invitation.ts`
- `src/lib/workspace-invitations/accept-workspace-invitation.ts`

Current UI surfaces:

- `app/dashboard/setup/page.tsx`
- `app/dashboard/setup/edit/page.tsx`
- `app/dashboard/page.tsx`

Current docs:

- `docs/modules/AUTHENTICATED-WORKSPACE-CONTEXT.md`
- `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`
- `docs/platform/PLATFORM-FOUNDATION-V1-MINIMUM-REQUIREMENTS.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- entitlement/access docs under `docs/platform/PLATFORM_ENTITLEMENT_*`

Current authority role:

- Active workspace/access boundary.
- Controls tenancy, membership, route context, and access.
- Must not be treated as copyright ownership, payee authority, or rights authority.

Doctrine alignment status: aligned

Risk level: low

Do not touch yet:

- workspace scoping
- authenticated workspace context
- create-song workspace attribution
- authorization/audit foundations

## 5. Party / CRM / Identity

Current tables:

- `crm_contacts`
- `crm_contact_emails`
- `crm_contact_phones`
- `crm_contact_relationships`
- `crm_contact_notes`
- `crm_contact_audit_events`
- related contract tables: `contract_parties`
- older/parallel references to `parties` in backend history docs, not confirmed as current canonical active model

Current migrations/files:

- `supabase/migrations/20260507184633_crm_contacts_schema.sql`
- `supabase/migrations/20260507184702_crm_audit_and_triggers.sql`
- `supabase/migrations/20260507185120_crm_duplicate_prevention.sql`
- `supabase/migrations/20260507191255_contract_system_schema.sql`

Current API routes:

- No dedicated CRM route found in current `app/api` listing.
- CRM is used indirectly through artist create/list flows.

Current services/repositories:

- `src/lib/crm/createCrmContact.ts`
- `src/lib/crm/listCrmContacts.ts`
- `src/lib/crm/contactChannels.ts`
- `src/lib/crm/contactLifecycle.ts`
- `src/lib/crm/contactRelationsAndNotes.ts`
- `src/lib/crm/index.ts`
- artist create route inserts CRM contact records directly

Current UI surfaces:

- `app/dashboard/artists/new/page.tsx`
- likely indirect use through artist management and operational forms

Current docs:

- `docs/modules/crm/CRM.md`
- `docs/platform/SENTRY-SOUND-PARTY-IDENTITY-MODEL-V1.md`
- `docs/modules/contracts/CONTRACT-SYSTEM.md`

Current authority role:

- Closest active Party seed.
- Operational/contact identity, not final legal/commercial Party authority.
- Used as CRM-linked foundation for artist profiles and contracts.

Doctrine alignment status: partial

Risk level: high

Do not touch yet:

- do not introduce canonical Party schema without approval
- do not collapse CRM Contact, Contributor, Artist Brand, Workspace User, and payee
- do not treat CRM contact existence as rights/payee authority

## 6. Artist Brand

Current tables:

- `artist_profiles`
- `artist_aliases`
- `artist_genres`
- `artist_social_links`
- `artist_audit_events`

Current migrations/files:

- `supabase/migrations/20260507185753_artist_management_schema.sql`

Current API routes:

- `app/api/artists/create/route.ts`
- `app/api/artists/list/route.ts`

Current services/repositories:

- Artist create route currently contains transaction logic for CRM contact plus artist profile.
- No separate artist service directory found in inspected service listing.

Current UI surfaces:

- `app/dashboard/artists/new/page.tsx`

Current docs:

- `docs/modules/artists/ARTIST-MANAGEMENT.md`
- `docs/platform/ARTIST-OPERATIONAL-ENTITY-V1-ALIGNMENT.md`
- `docs/platform/SENTRY-SOUND-PARTY-IDENTITY-MODEL-V1.md`
- `docs/platform/SENTRY-SOUND-CANONICAL-ENTITY-DIRECTION-V1.md`

Current authority role:

- Active Artist Brand seed.
- Public/creative identity layer linked to CRM.
- Not a company, owner, payee, or rights holder by default.

Doctrine alignment status: partial

Risk level: medium

Do not touch yet:

- do not make artist profiles legal companies
- do not treat artist visibility as ownership or payout authority
- do not hardcode Chronicle, M-Wis, or Huey D logic into platform code

## 7. Work / `musical_works`

Current tables:

- `assets`
- `musical_works`
- related `work_contributors`
- work-supporting file links through File Vault

Current migrations/files:

- `supabase/migrations/002-song-metadata-expansion.sql`
- `supabase/migrations/20260520090000_workspace_owned_works_seed.sql`
- `supabase/migrations/003-contributors-system.sql`
- `docs/platform/CREATE-SONG-TRANSACTION-RPC-CONTRACT.md`

Current API routes:

- `app/api/songs/create/route.ts`
- `app/api/works/create/route.ts`
- `app/api/works/route.ts`
- `app/api/works/[workId]/route.ts`
- `app/api/works/[workId]/profile/route.ts`
- `app/api/works/[workId]/contributors/route.ts`
- `app/api/works/[workId]/completeness/route.ts`
- `app/api/works/[workId]/files/route.ts`

Current services/repositories:

- `src/lib/registration/services/create-song-with-contributors.ts`
- `src/lib/registration/services/create-musical-work.ts`
- `src/lib/registration/contracts/create-song-contract.ts`
- `src/lib/registration/contracts/create-musical-work-contract.ts`
- `src/lib/works/works-read-repository.ts`
- `src/lib/works/work-detail-read-repository.ts`
- `src/lib/works/work-profile-update-repository.ts`
- `src/lib/works/get-works-read-model.ts`
- `src/lib/works/get-work-detail-read-model.ts`
- `src/lib/works/update-work-profile.ts`
- `src/lib/works/work-intelligence-v1.ts`
- `src/lib/work-readiness/get-work-completeness.ts`
- `src/lib/work-readiness/work-completeness-repository.ts`

Current UI surfaces:

- `app/dashboard/works/page.tsx`
- `app/dashboard/works/list/page.tsx`
- `app/dashboard/works/new/page.tsx`
- `app/dashboard/works/details/[workId]/page.tsx`
- `app/dashboard/works/song-capture-v2/page.tsx`

Current docs:

- `docs/modules/01-music-catalogue.md`
- `docs/platform/CREATE-SONG-TRANSACTION-RPC-CONTRACT.md`
- `docs/platform/SONG-CAPTURE-V2-ARCHITECTURE-ALIGNMENT-REVIEW.md`
- `docs/platform/SONG-CAPTURE-V2-DEPENDENCY-ALIGNMENT.md`
- `docs/platform/SENTRY-SOUND-CANONICAL-ENTITY-DIRECTION-V1.md`
- `docs/platform/SENTRY-SOUND-DOCTRINE-CONSOLIDATION-AND-GAP-ANALYSIS-V1.md`

Current authority role:

- Active Work seed.
- `musical_works` is protected and must not be made legacy.
- Chronicle foundation catalogue records live here as backend-authoritative foundation Works.
- Work metadata is not final ownership, registration, release, master, or royalty authority.

Doctrine alignment status: aligned

Risk level: low

Do not touch yet:

- do not rename or replace `musical_works`
- do not modify Chronicle foundation catalogue records
- do not break `POST /api/songs/create`
- do not treat Work metadata fields as rights/registration/royalty authority

## 8. Master / Recording

Current tables:

- `Recording`
- `RecordingPerformer`
- `recording_contributors`
- `release_tracks.sound_recording_id`
- `file_vault_items` category `master_audio`

Current migrations/files:

- `supabase/migrations/evidence_vault_audit_events.sql`
- `supabase/migrations/003-contributors-system.sql`
- `supabase/migrations/20260507192630_release_management_schema.sql`
- `prisma/schema.prisma`

Current API routes:

- No dedicated Master / Recording route found in current API listing.
- Recording concepts appear through registration services and release track references.

Current services/repositories:

- `src/lib/registration/repositories/recording-repository.ts`
- `src/lib/registration/repositories/recording-audit-repository.ts`
- `src/lib/registration/services/validate-recording.ts`
- `src/lib/registration/services/evaluate-recording-readiness.ts`
- `src/lib/registration/services/run-recording-compliance-workflow.ts`
- `src/lib/registration/contracts/recording-contract.ts`
- `src/lib/registration/contracts/recording-readiness-contract.ts`

Current UI surfaces:

- `app/dashboard/works/new/page.tsx` references recording/master as not current first composition draft.
- `app/dashboard/works/song-capture-v2/page.tsx` includes recording/production oriented capture concepts.
- No dedicated active Master UI found in inspected list.

Current docs:

- `docs/platform/SENTRY-SOUND-MASTER-RECORDING-MODEL-V1.md`
- `docs/platform/CANONICAL-OPERATIONAL-MODEL-DECISION.md`
- `docs/modules/03-contributors-system.md`
- `docs/modules/releases/RELEASE-MANAGEMENT.md`

Current authority role:

- Transitional/future-facing Master seed.
- ISRC should belong here by doctrine, but current active Work UX does not yet make Master canonical.

Doctrine alignment status: transitional

Risk level: high

Do not touch yet:

- do not create Master schema/migrations
- do not move ISRC authority without approved roadmap phase
- do not treat demo/audio files as commercial Masters
- do not treat release-track `isrc` as canonical Master authority

## 9. Contributors / `work_contributors`

Current tables:

- `contributors`
- `work_contributors`
- `recording_contributors`
- older/parallel `MusicalWorkContributor`
- older/parallel `RecordingPerformer`

Current migrations/files:

- `supabase/migrations/003-contributors-system.sql`
- `supabase/migrations/20260520090000_workspace_owned_works_seed.sql`
- `supabase/migrations/evidence_vault_audit_events.sql`

Current API routes:

- `app/api/works/[workId]/contributors/route.ts`
- `app/api/test/contributors/route.ts`
- `app/api/test/contributors-summary/route.ts`
- `app/api/test/splits/validate/route.ts`

Current services/repositories:

- `src/lib/contributors/contributor-admin.ts`
- `src/lib/contributors/contributor-admin-supabase.ts`
- `src/lib/contributors/contributor-governance.ts`
- `src/lib/registration/repositories/contributor-repository.ts`
- `src/lib/registration/contracts/create-contributor-contract.ts`
- `src/lib/registration/submission-engine/validation/validate-samro-contributor-roles.ts`
- `src/lib/registration/submission-engine/validation/validate-samro-contributor-identity.ts`
- `src/lib/registration/submission-engine/validation/validate-no-duplicate-samro-contributors.ts`

Current UI surfaces:

- `app/dashboard/works/details/[workId]/page.tsx`
- `app/dashboard/works/song-capture-v2/page.tsx`
- `app/registration-workflow-test/page.tsx`

Current docs:

- `docs/modules/03-contributors-system.md`
- `docs/platform/SONG-CAPTURE-V2-CONTRIBUTOR-RUNTIME-SLICE-V1.md`
- `docs/platform/SENTRY-SOUND-RIGHTS-INTEREST-MODEL-V1.md`
- `docs/platform/SENTRY-SOUND-ROYALTY-AUTHORITY-MODEL-V1.md`

Current authority role:

- Participation/readiness capture.
- Useful for contributors, roles, split capture, SAMRO-style readiness, and future evidence workflows.
- Not final rights ownership or royalty authority.

Doctrine alignment status: transitional

Risk level: high

Do not touch yet:

- do not remove contributor capture
- do not migrate contributor splits
- do not treat `work_contributors` as final ownership or royalty entitlement
- do not change contributor routes without approval

## 10. Rights Interest / Ownership Authority

Current tables:

- `rights_assets`
- `rights_ownership_claims`
- `rights_lifecycle_events`
- `rights_audit_events`
- related contract tables: `contracts`, `contract_parties`, `contract_rights_links`, `contract_obligations`, `contract_audit_events`

Current migrations/files:

- `supabase/migrations/20260507190348_rights_lifecycle_schema.sql`
- `supabase/migrations/20260507191255_contract_system_schema.sql`

Current API routes:

- No dedicated rights lifecycle API route found in current API listing.

Current services/repositories:

- `src/lib/rights-lifecycle/createRightsAsset.ts`
- `src/lib/rights-lifecycle/createRightsOwnershipClaim.ts`
- `src/lib/rights-lifecycle/updateRightsAssetLifecycle.ts`
- `src/lib/rights-lifecycle/validateRightsOwnershipTotals.ts`
- `src/lib/contracts/createContract.ts`
- `src/lib/contracts/addContractParty.ts`
- `src/lib/contracts/linkContractToRightsAsset.ts`
- `src/lib/contracts/createContractObligation.ts`
- `src/lib/contracts/updateContractLifecycle.ts`

Current UI surfaces:

- No dedicated rights UI route found in inspected dashboard list.
- Rights concepts appear in artist and song capture UI surfaces.

Current docs:

- `docs/modules/rights-lifecycle/RIGHTS-LIFECYCLE.md`
- `docs/modules/contracts/CONTRACT-SYSTEM.md`
- `docs/platform/SENTRY-SOUND-RIGHTS-INTEREST-MODEL-V1.md`

Current authority role:

- Partial rights/ownership seed.
- Directionally aligned with Rights Interest doctrine but not yet canonical downstream authority.

Doctrine alignment status: partial

Risk level: critical

Do not touch yet:

- do not create Rights Interest schema/migrations
- do not treat rights claims as final authority without verification/evidence model
- do not connect royalty calculation to partial authority without approved design

## 11. Registration / Identifiers

Current tables:

- older/parallel `RegistrationEvidence`
- `RegistrationAuditEvent`
- `RegistrationDispute`
- `RegistrationAmendment`
- `SubmissionQueue`
- `SubmissionQueueEvent`
- `SubmissionSnapshot`
- `SubmissionExport`
- `SubmissionRemediationCase`
- dispatch/operational tables: `SubmissionDispatchQueue`, `SubmissionDispatchAttempt`, `OperationalIncident`

Current migrations/files:

- `supabase/migrations/evidence_vault_audit_events.sql`
- `supabase/migrations/evidence_audit_event_only.sql`
- `supabase/migrations/submission_export_only.sql`
- `supabase/migrations/submission_dispatch_queue_only.sql`
- `supabase/migrations/submission_dispatch_attempt_only.sql`
- `supabase/migrations/operational_incident_only.sql`
- `prisma/schema.prisma`

Current API routes:

- `app/api/submissions/create-from-work/route.ts`
- `app/api/submissions/readiness/route.ts`
- `app/api/submissions/pending/route.ts`
- `app/api/submissions/update-status/route.ts`
- `app/api/submissions/lifecycle/route.ts`
- `app/api/evidence-readiness/route.ts`

Current services/repositories:

- `src/lib/registration/services/evaluate-registration-readiness.ts`
- `src/lib/registration/services/evaluate-musical-work-readiness.ts`
- `src/lib/registration/services/evaluate-recording-readiness.ts`
- `src/lib/registration/services/validate-registration-status-transition.ts`
- `src/lib/registration/services/validate-registration-evidence.ts`
- `src/lib/registration/services/build-submission-package.ts`
- `src/lib/registration/services/build-samro-work-export-payload.ts`
- `src/lib/registration/repositories/registration-evidence-repository.ts`
- `src/lib/registration/repositories/submission-lifecycle-repository.ts`
- `src/lib/registration/repositories/submission-snapshot-repository.ts`
- `src/lib/registration/submission-engine/**`

Current UI surfaces:

- `app/registration-workflow-test/page.tsx`
- `app/codex-ui-test/page.tsx`
- Works detail/readiness surfaces may expose related status.

Current docs:

- `docs/modules/registration/REGISTRATION-FOUNDATION.md`
- `docs/modules/registration/REGISTRATION-READINESS-ENGINE.md`
- `docs/modules/registration/REGISTRATION-STATUS-PIPELINE.md`
- `docs/modules/registration/REGISTRATION-EVIDENCE-ARCHITECTURE.md`
- `docs/modules/registration/submission-engine/*`
- `docs/platform/SENTRY-SOUND-REGISTRATION-AUTHORITY-MODEL-V1.md`

Current authority role:

- Transitional/future-facing registration and submission infrastructure.
- Identifiers are not ownership authority.
- Registration readiness is not yet fully downstream of canonical Rights Interest.

Doctrine alignment status: transitional

Risk level: high

Do not touch yet:

- do not create identifier governance schema
- do not import Chronicle ISRC/ISWC as authority
- do not treat registrations/society references as ownership proof
- do not merge older/parallel Prisma registration slice without approved migration plan

## 12. Release / Readiness

Current tables:

- `releases`
- `release_tracks`
- `release_versions`
- `release_metadata_snapshots`
- `release_audit_events`

Current migrations/files:

- `supabase/migrations/20260507192630_release_management_schema.sql`

Current API routes:

- No dedicated release API route found in current API listing.
- Release concepts appear through services and docs.

Current services/repositories:

- `src/lib/releases/createRelease.ts`
- `src/lib/releases/addReleaseTrack.ts`
- `src/lib/releases/updateReleaseLifecycle.ts`
- `src/lib/releases/index.ts`
- work readiness support: `src/lib/work-readiness/*`

Current UI surfaces:

- `app/dashboard/works/song-capture-v2/page.tsx`
- `app/dashboard/works/details/[workId]/page.tsx`
- `app/dashboard/page.tsx` references release/operations concepts

Current docs:

- `docs/modules/releases/RELEASE-MANAGEMENT.md`
- `docs/platform/SENTRY-SOUND-RELEASE-READINESS-MODEL-V1.md`
- `docs/platform/SONG-CAPTURE-V2-DEPENDENCY-ALIGNMENT.md`

Current authority role:

- Protected release foundation.
- Release lifecycle exists; Release Readiness as multi-domain authority gate is not yet active.

Doctrine alignment status: partial

Risk level: medium

Do not touch yet:

- do not change release schema/services
- do not treat `lifecycle_status = ready` as full Release Readiness
- do not import Chronicle release data as authority
- do not treat release-track `isrc` as canonical Master identifier

## 13. Distribution / DSP Relationships

Current tables:

- `distribution_channels`
- `distribution_releases`
- `distribution_release_channels`
- `distribution_delivery_events`
- `distribution_audit_events`

Current migrations/files:

- `supabase/migrations/20260507191829_distribution_pipeline_schema.sql`
- `supabase/migrations/20260507193047_align_distribution_with_releases.sql`

Current API routes:

- No dedicated distribution API route found in current API listing.

Current services/repositories:

- `src/lib/distribution/createDistributionChannel.ts`
- `src/lib/distribution/createDistributionRelease.ts`
- `src/lib/distribution/addDistributionReleaseChannel.ts`
- `src/lib/distribution/updateDistributionDeliveryStatus.ts`
- `src/lib/distribution/updateDistributionReleaseLifecycle.ts`
- `src/lib/distribution/index.ts`

Current UI surfaces:

- No dedicated distribution dashboard route found in inspected list.
- Distribution appears in dashboard/works language and docs.

Current docs:

- `docs/modules/distribution/DISTRIBUTION-PIPELINE.md`
- `docs/platform/SENTRY-SOUND-DISTRIBUTION-RELATIONSHIP-MODEL-V1.md`

Current authority role:

- Protected distribution foundation.
- Downstream delivery/status/evidence context, not ownership or royalty allocation authority.

Doctrine alignment status: partial

Risk level: medium

Do not touch yet:

- do not change distribution schema/services
- do not treat distributor/DSP references as ownership proof
- do not enforce readiness gates without approved design

## 14. Royalty Authority / Royalty Events

Current tables:

- `royalty_events`
- `royalty_distributions`
- `royalty_ledger`
- `payout_batches`
- `payout_items`
- `settlements`
- `contributor_balances` view

Current migrations/files:

- royalty table creation not found in current Supabase file list inspected, but referenced in backend/database docs and enforcement SQL
- `docs/database/DB-ENFORCEMENT-STEP-2.sql`
- `docs/database/DB-ENFORCEMENT-FINAL.sql`
- `docs/database/seed/SEED-ROYALTY-ENGINE-TEST-DATA.sql`
- `docs/database/seed/RESET-ROYALTY-ENGINE-TEST.sql`

Current API routes:

- No active production royalty route found in current `app/api` listing.
- Technical debt baseline references older `src/app/api/royalty-events/*` and `src/app/api/payouts/*`, but current inventory did not find those under `app/api`.

Current services/repositories:

- `src/lib/royalties/calculateRoyaltyDistribution.ts`
- `src/lib/royalties/processRoyaltyEvent.ts`
- `src/lib/royalties/processRoyaltyEventToLedger.ts`
- `src/lib/royalties/recalculateContributorBalance.ts`
- `src/lib/royalties/reverseRoyaltyEvent.ts`
- `src/lib/royalties/processPayoutBatch.ts`
- `src/lib/royalties/createSettlementForPayoutBatch.ts`
- `src/lib/royalties/validateLedgerEntries.ts`
- `src/lib/royalties/services/evaluate-royalty-eligibility.ts`
- `src/lib/royalty-control-alignment/validateRoyaltyProcessingPreflight.ts`

Current UI surfaces:

- Dashboard references royalties as future/visibility concept.
- `app/codex-ui-test/page.tsx` has royalty/payout readiness display concepts.
- No dedicated current production royalty dashboard route found in inspected list.

Current docs:

- `docs/royalties/ROYALTY-ENGINE.md`
- `docs/SENTRY_SOUND_BACKEND_LOG.md`
- `docs/modules/royalty-control-alignment/ROYALTY-CONTROL-ALIGNMENT.md`
- `docs/platform/SENTRY-SOUND-ROYALTY-AUTHORITY-MODEL-V1.md`

Current authority role:

- Transitional calculation/ledger engine.
- Current docs state distributions are calculated from `work_contributors`.
- Not final Royalty Authority under doctrine.

Doctrine alignment status: misaligned/transitional

Risk level: critical

Do not touch yet:

- do not modify royalty engine implementation
- do not migrate contributor splits
- do not treat contributor split rows as final entitlement
- do not connect finance automation without approved royalty authority design

## 15. Finance Boundary

Current tables:

- older finance tables: `finance_accounts`, `finance_transactions`, `finance_periods`, `finance_payables`, `finance_receivables`, `finance_budgets`, `finance_snapshots`, `finance_exchange_rates`, `finance_tax_profiles`, `finance_tax_rates`, `finance_company_settings`, `finance_country_currency`, `finance_audit_events`, `finance_roles`, `finance_approvals`, `finance_notifications`, `finance_attachments`, `finance_notes`, `finance_report_exports`, `finance_report_jobs`, `finance_scheduled_jobs`, `finance_year_closes`
- workspace finance V1 tables: `workspace_finance_categories`, `workspace_finance_accounts`, `workspace_finance_transactions`, `workspace_finance_payables`, `workspace_finance_receivables`, `workspace_finance_commitments`

Current migrations/files:

- `supabase/migrations/20260506063658_finance_accounts.sql`
- finance migrations dated `20260507*`
- `supabase/migrations/20260520120000_workspace_finance_v1.sql`
- `supabase/migrations/20260520130000_workspace_finance_commitments.sql`
- `supabase/migrations/20260521100000_workspace_finance_commitment_framework.sql`
- `supabase/migrations/20260521101000_workspace_finance_commitment_type_patch.sql`

Current API routes:

- `app/api/finance/**`
- `app/api/finance/v1/route.ts`
- `app/api/finance/v1/money-state/route.ts`
- `app/api/finance/v1/commitments/route.ts`
- `app/api/protected/finance/**`

Current services/repositories:

- `src/lib/finance/**`
- `src/lib/finance-v1/workspace-finance-service.ts`
- `src/lib/finance-v1/workspace-finance-repository.ts`
- `src/lib/finance-v1/workspace-money-state-service.ts`
- `src/lib/finance-v1/workspace-money-state-repository.ts`
- `src/lib/finance-v1/workspace-commitment-weighting-service.ts`
- `lib/finance/services/dashboard-summary-service.ts`

Current UI surfaces:

- `app/dashboard/finance/page.tsx`

Current docs:

- `docs/modules/finance.md`
- `docs/platform/FINANCE-V2-FIELD-MODEL.md`
- `docs/modules/finance/api/PROTECTED-FINANCE-APIS.md`

Current authority role:

- Active finance/accounting and commitment boundary.
- Finance remains separate from royalty administration.
- Royalty-derived finance posting is future/approved-only.

Doctrine alignment status: aligned

Risk level: low

Do not touch yet:

- do not merge royalty administration into Finance
- do not make finance commitments royalty entitlement authority
- do not automate royalty-to-finance posting

## 16. File Vault / Evidence

Current tables:

- `file_vault_items`
- `file_vault_links`
- `file_vault_versions`
- `file_vault_audit_events`
- older/parallel `RegistrationEvidence`
- older/parallel `EvidenceAuditEvent`

Current migrations/files:

- `supabase/migrations/20260507193358_file_vault_schema.sql`
- `supabase/migrations/evidence_vault_audit_events.sql`
- `supabase/migrations/evidence_audit_event_only.sql`
- `prisma/schema.prisma`

Current API routes:

- `app/api/works/[workId]/files/route.ts`
- `app/api/evidence-readiness/route.ts`
- `app/api/test/evidence-readiness/route.ts`
- `app/api/test/evidence-readiness-summary/route.ts`

Current services/repositories:

- `src/lib/file-vault/createFileVaultItem.ts`
- `src/lib/file-vault/linkFileVaultItem.ts`
- `src/lib/file-vault/addFileVaultVersion.ts`
- `src/lib/work-files/work-supporting-materials-service.ts`
- `src/lib/work-files/work-supporting-materials-repository.ts`
- `src/lib/evidence-vault/**`
- `src/lib/evidence-resolution/**`
- `src/lib/evidence/evidence-readiness*.ts`
- `src/lib/registration/repositories/registration-evidence-repository.ts`

Current UI surfaces:

- `app/dashboard/works/details/[workId]/page.tsx`
- `app/dashboard/works/song-capture-v2/page.tsx`
- `app/codex-ui-test/page.tsx`

Current docs:

- `docs/modules/file-vault/FILE-VAULT.md`
- `docs/modules/evidence-vault/EVIDENCE-VAULT-V1.md`
- `docs/modules/registration/REGISTRATION-EVIDENCE-ARCHITECTURE.md`
- `docs/platform/EXISTING-SUPPORTING-MATERIALS-ASSET-AUDIT.md`

Current authority role:

- File Vault is support/reference layer.
- Evidence structures are future-facing/transitional evidence governance.
- Supporting materials are not legal clearance or verified evidence by default.

Doctrine alignment status: partial

Risk level: medium

Do not touch yet:

- do not treat file references as verified evidence
- do not implement evidence authority changes without approval
- do not add file storage/OCR/AI verification

## 17. Chronicle Integration

Current tables:

- Chronicle foundation records live in `musical_works` and `assets`.
- No Chronicle-specific platform tables found.

Current migrations/files:

- No Chronicle-specific schema migration found.
- Chronicle import used existing backend RPC and current workspace-owned Work seed.

Current API routes:

- No Chronicle-specific API route found.

Current services/repositories:

- Chronicle import used existing `POST /api/songs/create` / `rpc_create_song_with_contributors` path.
- No Chronicle-specific service found.

Current UI surfaces:

- Chronicle records visible through current Works UI.

Current docs:

- `docs/platform/CHRONICLE-INTEGRATION-PRINCIPLE-V1.md`
- `docs/platform/CHRONICLE-INTAKE-REVIEW-REPORT-V1.md`
- `docs/platform/CHRONICLE-FOUNDATION-ONLY-WORKS-IMPORT-PLAN-V1.md`
- `docs/platform/CHRONICLE-FOUNDATION-ONLY-WORKS-IMPORT-RESULT-V1.md`

Current authority role:

- Protected foundation catalogue data in backend.
- Chronicle workbook remains intake only.
- Chronicle Music is reference tenant/pilot, not hardcoded platform logic.

Doctrine alignment status: aligned

Risk level: low

Do not touch yet:

- do not modify Chronicle foundation catalogue records
- do not import ownership splits, ISRC, ISWC, master owner, publishing owner, release data, rights data, or registration identifiers
- do not create Chronicle-specific platform logic
- do not make spreadsheets ongoing authority

## 18. Public / Website / API Consumption

Current tables:

- Public/API consumption appears to use existing Work/Artist/landing content foundations.
- No dedicated public-safe projection table found in inspected migrations.

Current migrations/files:

- no dedicated public projection migration found

Current API routes:

- operational APIs include `app/api/works/*`, `app/api/artists/*`, `app/api/finance/*`, `app/api/submissions/*`
- no approved Chronicle public feed/API route found

Current services/repositories:

- Works read repositories: `src/lib/works/*`
- Artist list/create route logic
- no dedicated public projection service found

Current UI surfaces:

- `app/landing/**`
- `app/dashboard/**`

Current docs:

- `docs/platform/CHRONICLE-INTEGRATION-PRINCIPLE-V1.md`
- `docs/platform/HOSTED-PUBLIC-MUSIC-PAGES-MODULE.md`
- `docs/platform/WEBSITE_CONTENT_V1.md`
- `docs/platform/LANDING_PAGE_CONTENT_V1.md`

Current authority role:

- Public/website/API consumption is future-facing.
- External systems should consume approved Sentry Sound truth, but public-safe projections are not yet defined.

Doctrine alignment status: partial

Risk level: medium

Do not touch yet:

- do not create public Chronicle feed/API
- do not expose private contributors, splits, evidence, contracts, internal readiness, or royalty data
- do not source website/catalogue truth from spreadsheets

## 19. Cross-Domain Immediate Observations

1. The active operational seed is lowercase/workspace-owned: `assets`, `musical_works`, `contributors`, `work_contributors`, workspace context, CRM, artist profiles, release/distribution/File Vault foundations.
2. A parallel older/future-facing registration/evidence/model slice exists through PascalCase Prisma-style tables and `prisma/schema.prisma`.
3. The create-song path is protected and currently workspace-scoped through `POST /api/songs/create` and `rpc_create_song_with_contributors`.
4. The current royalty engine exists as a calculation/ledger engine but remains authority-risky because it derives from contributor splits.
5. Rights Lifecycle is directionally aligned but not yet the canonical Rights Interest authority consumed everywhere.
6. Master / Recording concepts exist but are not yet first-class in active Works UI.
7. File Vault is appropriately positioned as support/reference, not legal authority.
8. Finance is comparatively well bounded from royalty administration.
9. Chronicle integration is cleanly non-hardcoded and should remain protected.
10. Public/API consumption needs a public-safe projection design before exposing Chronicle catalogue externally.

## 20. Highest-Risk Domains Found

Critical:

- Rights Interest / Ownership Authority
- Royalty Authority / Royalty Events

High:

- Master / Recording
- Registration / Identifiers
- Contributors / `work_contributors`
- Party / CRM / Identity

Reason:

These domains can create incorrect ownership, registration, master, or royalty outcomes if current transitional structures are treated as final authority.

## 21. Most Stable / Protected Domains Found

Stable/protected:

- Workspace / access boundary
- Work / `musical_works`
- Chronicle Integration
- Finance Boundary
- File Vault foundation
- release/distribution foundations as operational seeds

Reason:

These domains either already match doctrine well or are useful protected foundations that should remain in place while future authority layers are designed around them.

## 22. Recommended Next Step

Recommended next artifact:

```text
docs/platform/SENTRY-SOUND-INVENTORY-INTERPRETATION-AND-PRIORITY-MATRIX-V1.md
```

Purpose:

- interpret this inventory without implementing changes
- rank the discovered current-state items by authority risk
- identify quick language/read-model wins
- identify domains that require design before schema
- define which future workstreams require explicit approval gates

Do not proceed to schema, migrations, backend refactors, royalty changes, Chronicle deferred imports, or public feed/API work from this inventory alone.

