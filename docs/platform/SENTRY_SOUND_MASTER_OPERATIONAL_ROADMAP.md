# SENTRY SOUND PLATFORM - MASTER OPERATIONAL ROADMAP

## 1. Purpose

This document is the first reference document for future Sentry Sound Platform chats, planning, and Codex execution.

It defines product logic before implementation detail.

This is not an implementation handover, migration plan, schema design, UI styling guide, or backend task queue. It is the master operational roadmap that explains what the platform is supposed to become, how user-facing experience should guide development, and how backend, governance, readiness, lifecycle, audit, and operational graph systems should support that experience.

Future implementation work should read this document before selecting files, building routes, adding services, or expanding backend primitives.

## 2. Core Development Principle

UX and operational objectives drive backend development.

Backend systems exist to support visible operational flow, not to become isolated engineering exercises.

The frontend/user journey defines what the system is supposed to do. Backend contracts, governance checks, readiness models, lifecycle events, audit events, entitlement logic, and operational graph data must support that journey. They should not be built merely because they are technically possible or architecturally interesting.

Every backend slice should answer:

- Which user journey does this support?
- What will the user see, understand, decide, or safely do because this exists?
- Which operational surface consumes this capability?
- Which governance rule prevents false readiness or unsafe progression?
- Is this aligned with subscription, onboarding, workspace setup, dashboard, song/work operations, evidence, submissions, finance, or enterprise oversight?

If a backend capability does not clearly support a user-facing or operational objective, pause and realign before implementation.

Layered execution discipline:

Sentry Sound development must proceed layer by layer:

1. Define layer - clarify what the layer is supposed to do.
2. Build layer - implement the smallest stable version.
3. Test layer - validate semantics, contracts, and edge cases.
4. Stabilize layer - ensure reasoning consistency and avoid semantic drift.
5. Document layer - lock philosophy, contracts, boundaries, and future notes.
6. Move to next layer - only after stability is achieved.

Future discoveries should be documented and aligned to future phases, not prematurely implemented. Do not evolve the roadmap reactively, partially implement future intelligence layers, or jump ahead because reasoning is interesting.

Current completed layers: workspace ownership architecture, finance commitments, Money State V0, Commitment Weighting V1, the calendar/action linkage foundational layer, Calendar / Action Linkage Stabilization, Works/Songs UX Continuation, and Contributor/Split UX Continuation.

Current not-started layers: workflow dependency graph, operational dependency reasoning, operational conversion layer, viability reasoning, AI/autopilot reasoning, forecasting, and scoring systems.

Reference: `docs/platform/LAYERED-EXECUTION-DISCIPLINE.md`.

Independent Module Integrity:

Each paid or available module must deliver clear standalone operational value within its promised scope. Cross-module integration may enhance, automate, orchestrate, deepen visibility, or improve intelligence, but must not intentionally cripple core workflows, hide essential records, or force users into unrelated modules to complete the basic job they paid for. Upgrade pressure must be additive, not punitive.

Works/Songs must remain useful without finance, AIL, submissions, royalties, or release modules. Finance must remain valuable without royalties. File Vault and Supporting Materials must remain useful as operational reference surfaces without implying legal clearance or submission readiness. Higher tiers should add scale, governance, automation, reporting, collaboration, orchestration, and intelligence depth, not hostage core workflows or basic access to user-owned records.

Reference: `docs/platform/INDEPENDENT-MODULE-INTEGRITY.md`.

Future Artist Intelligence Layer note:

The Artist Intelligence Layer, or AIL, is future architecture only. It may later use configurable Strategic Identity Models and Strategic Operational Behaviors to connect artist identity, audience psychology, emotional positioning, sonic positioning, rollout posture, and channel strategy to operational recommendations. Strategic Identity Intelligence input is product-strategy input only; it does not control backend architecture, schemas, APIs, implementation sequencing, or roadmap governance.

M-WIS is one test persona/archetype only, not platform doctrine. Its anonymous/restrained, emotion-first, atmosphere-first, low-visibility/high-depth, Afrikaans-rooted but universally human posture may inform future AIL testing, but it must not be hardcoded into the platform. AIL must integrate later with Works, Contributors/Splits, Supporting Materials, Operational Completeness, Finance/Commitments, and Calendar/Actions. No AIL schema, API, AI/autopilot behavior, scoring, dependency reasoning, or automated rollout planning is implemented or approved now.

Reference: `docs/platform/ARTIST-INTELLIGENCE-LAYER-FUTURE-NOTE.md`.

## 3. Role Separation

### User / Product Owner

- Defines business objective
- Defines desired user experience
- Provides screenshots/images/reference flows
- Approves roadmap direction
- Decides commercial priorities

### ChatGPT / Support Architect

- Defines architecture and system logic
- Helps translate business/UX intent into operational roadmap
- Controls conceptual drift
- Maintains alignment between product logic, UX, backend, and governance
- Does NOT act as the implementation engine
- Does NOT micromanage Codex implementation unless there is drift or risk

### Codex / Execution Agent

- Reads repository and source-of-truth documents first
- Determines what is already implemented
- Implements against the roadmap
- Detects drift, duplication, missing alignment, or unsafe changes
- Reports what is done, not done, partially done, or misaligned
- Proposes alignment corrections where existing code does not match roadmap intent
- Does not invent new product direction without flagging it first

## 4. Product Vision

Sentry Sound is a commercial SaaS operational platform for music rights, royalty, compliance, evidence, submissions, workflow, finance, and enterprise operations.

It is not only a catalogue, registration form, file vault, dashboard, or backend rules engine. It is an operational command system for the practical work required to move music from creation into governed rights administration, evidence readiness, submission tracking, royalty/finance operations, and enterprise oversight.

The platform should help users understand:

- what exists
- what is incomplete
- what is blocked
- what evidence is missing
- who needs to act
- what can safely happen next
- which actions are unavailable because foundation, rights, evidence, entitlement, or governance requirements are not met

## Canonical Operational Model Alignment

Approved decision:

Sentry Sound has one canonical operational data model. The current lowercase operational model is the living product seed and must be formalized into the canonical operational schema. Prisma is a backend/developer access and modelling layer over Postgres; it must conform to the canonical operational model and must not remain a competing business reality.

Active source of truth seed:

- `musical_works`
- `assets`
- `contributors`
- `work_contributors`
- `/api/songs/create`
- current Works/Songs UX surfaces
- Step 0 duplicate awareness
- Song Profile / creative truth

Legacy/reference or temporary systems:

- Prisma `MusicalWork` is legacy/parallel until aligned.
- `/api/works/create` is non-active for the current dashboard unless proven otherwise.
- `/api/test/get-work` is a temporary TEST read model, not a production Works read API.
- No canonical recording/master model or official identifier table is active yet.

Why alignment happens now:

- the platform is early-stage.
- there are no production users or irreversible industry integrations.
- future identifiers, submissions, royalties, reporting, and AI intelligence require one durable truth.
- delaying alignment would make later SAMRO/CAPASSO/distributor workflows and royalty/compliance mapping more expensive and riskier.

Impact:

- official identifiers must attach to canonical work or recording records, not legacy/parallel models.
- submission queues and returns must map to canonical internal IDs.
- AI commercial intelligence must be generated from canonical creative truth and must remain separate from user-entered fields.
- reporting, search, duplicate prevention, and future royalty logic must use the same canonical work/contributor/split records as the UX.

Permanent platform principle:

AI/system outputs are not editable user truth. User-entered creative truth must remain separate from system-generated insights. AI recommendations must not overwrite user-provided facts. Commercial intelligence must be generated and stored as system output, while user fields remain factual and creative inputs. Future AI outputs may be reviewed, accepted, rejected, or converted into actions, but they must not silently become user-entered truth.

Universal workspace workflow/task layer:

Sentry Sound includes a shared workspace workflow/task layer for operational actions across the platform. Calendar is one date view of that action layer, not the whole product concept and not a song-specific calendar. Workflow items are workspace-owned and support assignment, status, due/required-by dates, priority, approval requirements, completion state, source module, and future entity links. They can represent onboarding actions, song profile follow-ups, submission follow-ups, release dates, finance/royalty reminders, CRM/artist follow-ups, evidence/readiness blockers, academy/training tasks, manual notes, and future AI/system-recommended actions. Future AI-generated recommendations may propose actions, but they must remain reviewable system output and must not silently become user-entered truth or completed work.

Calendar / Action Linkage Stabilization status:

This layer is complete for now. The validation harness confirmed manual action lifecycle behavior, finance commitment sync for due/overdue/review-later/paid/cancelled states, repeated sync idempotency, duplicate linked action review, orphan finance action review, and action/status/completed-at consistency. The overdue semantics decision is locked: `past_due` is a derived timing signal from `required_by_date < today` plus incomplete action status, while `action_status = overdue` is explicit operational escalation. Past-due incomplete actions are valid review information, not lifecycle mismatches. Future RIR support remains deferred.

Known future notes: workspace isolation was not fully tested due single workspace context; `past_due` is not yet surfaced separately in UI; `review_later` currently maps to `pending`; no workflow dependency graph, operational chain reasoning, or RIR/remediation implementation exists yet.

Reference documents:

- `docs/platform/CANONICAL-OPERATIONAL-MODEL-DECISION.md`
- `docs/platform/CANONICAL-ENTITY-MAP.md`
- `docs/platform/ROUTE-API-OWNERSHIP-PLAN.md`
- `docs/platform/SCHEMA-ALIGNMENT-PLAN.md`
- `docs/platform/OBJECTIVE-DRIFT-PREVENTION-RULES.md`

## 5. Primary User Journey

The intended high-level product flow is:

1. Subscription / plan selection
2. Account creation / authentication
3. Onboarding
4. Workspace / company / artist profile setup
5. Operational dashboard
6. Song/work capture
7. Contributor and split management
8. Asset/file/evidence management
9. Readiness and blocker visibility
10. Submission/compliance workflow
11. Royalty/finance/operations expansion
12. Enterprise governance and oversight

This journey is the default sequence for future development alignment. Backend systems should be prioritized by whether they support this progression and help the user move safely through it.

## 6. UX Reference Alignment

Uploaded screenshots, images, and reference flows are not decorative and not optional.

They define operational surfaces and product intent.

They should guide roadmap and implementation sequencing, especially for:

- navigation structure
- dashboard layout and information priority
- subscription and onboarding flow
- workspace setup expectations
- operational cards and summaries
- task flow sequence
- visible states, blockers, and next actions
- what the user expects to happen before deeper backend systems are expanded

Reference images should not be copied blindly. They should be interpreted as operational intent: what the user should be able to see, decide, and do.

## 7. Operational Surfaces

### Subscription & Access

User objective:
Choose or understand a plan that gives the workspace the right operating capacity.

What the user should see/do:
Select plan, understand limits, see upgrade triggers, understand invited contributor access, and distinguish paid workspace access from music rights ownership.

Backend capabilities needed:
Workspace plan/status read model, entitlement registry, feature/action gates, collaborator access rules, usage/quota read models, plan assignment governance, and future billing-provider isolation.

Current implementation status:
Unknown until Codex verifies.

Alignment notes:
Subscription controls platform access and allowances. It must not imply copyright ownership, rightsholder authority, submission authority, or royalty entitlement.

### Onboarding

User objective:
Set up enough account/workspace context for the platform to behave safely and personally.

What the user should see/do:
Enter entity/profile details, country, currency, VAT/tax status, business type, address, onboarding status, and required legal/terms acceptance where applicable.

Backend capabilities needed:
Workspace onboarding summary, workspace settings/profile persistence, legal/terms acceptance model, jurisdiction/currency/VAT fields, onboarding step/status governance, and fail-closed production eligibility rules.

Current implementation status:
Partial. Workspace Setup V1 now supports the first QuickBooks-style operational identity capture flow at `/dashboard/setup`. Broader production onboarding gates, legal/terms enforcement, invite activation, and production eligibility controls remain deferred.

Alignment notes:
Onboarding should precede production-sensitive workflow activation. Workspace Setup V1 is operational personalization and dashboard setup context only; it is not compliance/KYC and does not request registration documents, tax clearance, banking details, or compliance evidence.

### Workspace/Profile Setup

User objective:
Define the operational identity of the workspace, artist, label, publisher, manager, company, or internal account.

What the user should see/do:
Review and edit workspace/company/artist profile, operational contact details, business identity, jurisdiction, team members, and account context.

Backend capabilities needed:
Workspace context resolver, workspace profile model, membership/role support, invitations, settings, jurisdiction metadata, audit of profile changes, and eventual production ownership/scope rules.

Current implementation status:
Implemented for V1 operational setup. `/dashboard/setup` is now the Workspace Profile/Setup Overview: first-time users see a setup intro and Start Setup action, while completed users see saved profile summary cards with Edit Profile and Back to Dashboard actions. `/dashboard/setup/edit` captures and updates workspace identity, legal/trading name, workspace type, business stage, country, base currency, optional timezone, VAT/tax registered preference, primary role, main goal, current pain point, catalog size, team size, and activation choices. It persists setup data under `workspace_settings.settings.workspace_setup_v1` and mirrors core identity/defaults to existing `workspaces` fields. No new table or migration was required.

Alignment notes:
Workspace ownership is operational account ownership, not music rights ownership. Workspace Setup V1 data can support future agreements/templates, finance defaults, marketing segmentation, onboarding personalization, and dashboard recommendations, but it must not be treated as proof of legal authority, compliance verification, rights ownership, banking readiness, or production workflow activation.

### Main Operational Dashboard

User objective:
Land in a command centre that shows what needs attention and where to go next.

What the user should see/do:
See active works, incomplete drafts, blockers, readiness, evidence gaps, submissions, lifecycle state, recent activity, quick actions, and safe next steps.

Backend capabilities needed:
Workspace-scoped dashboard read models, entitlement-aware capability summaries, blocker summaries, lifecycle/audit feeds, readiness aggregations, task/remediation summaries, and no-fake-metrics rules.

Current implementation status:
Unknown until Codex verifies.

Alignment notes:
Dashboard cards must show real backend truth. Unsupported systems must be disabled, deferred, or clearly marked as unavailable.

Current implementation note:
The first static/light customer-facing dashboard shell now exists at `/dashboard`. It presents workspace identity, setup progress, quick actions, attention items, planned/future module visibility, recent activity empty state, and right-side task/AI-helper placeholders. The legacy dark TEST Control Panel has been preserved away from the customer-facing root at `/test-control-panel`. The dashboard shell is product-facing UI only; production dashboard metrics, billing, RBAC, production onboarding gates, finance, royalties, booking, listening portal, and AI backend systems remain deferred.

### Song / Work Operations

User objective:
Capture and manage a song/work in a way that can eventually support registration, evidence, submissions, and royalties.

What the user should see/do:
Create a song/work, enter metadata, save drafts, continue later, see required fields, and understand whether the work is ready for the next step.

Backend capabilities needed:
Governed song/work capture, draft/resume model, workspace scoping, contributor integration, split integration, lifecycle event emission, operational audit, readiness placeholders, and future production mutation enforcement.

Current implementation status:
Partial. `/dashboard/works`, `/dashboard/works/new`, and `/dashboard/works/list` now exist as customer-facing TEST/draft surfaces. The Add Work V1 page uses existing `POST /api/songs/create` logic and includes field tagging for operational purpose. `/dashboard/works/details/[workId]` is being aligned as a Song Profile surface where users enter creative truth and the system later generates commercial intelligence. Step 2 uses hybrid TEST/V1 persistence: `themes` saves to the existing `musical_works.themes` column, while creative-truth fields save under structured `musical_works.metadata.work_intelligence_v1.creative_truth`. Future generated commercial outputs belong under `system_insights`, not editable user strategy fields. The canonical field strategy is defined in `docs/platform/FIELD-INTELLIGENCE-ARCHITECTURE.md`.

Alignment notes:
TEST create-song support is infrastructure, not production song capture. Production capture must align with foundation, entitlement, terms, ownership/scope, validation, mutation, and audit governance. Metadata fields should be treated as strategic intelligence assets, not random form inputs. User-entered fields should capture creative truth; commercial intelligence, market positioning, audience strategy, release recommendations, and upsell opportunities should be generated by the system later.

Works landing UX note:
Duplicate checking is support logic inside the create-work flow, not a separate user workflow. Continue actions should refer to existing captured works and outstanding profile/readiness items, not vague future continuation.

Works/Songs operational area note:
Work-related modules are being grouped under the Works/Songs operational area to improve user orientation and reduce module fragmentation. The main dashboard can still expose high-level entries such as Contributors & Splits, Files/Evidence, Readiness, and Submissions, but the Works/Songs area should make them feel like connected stages in the life of a work rather than random disconnected modules. Current V1 uses a local Works page navigation panel for Works overview, Create New Work, Existing Works, Song Profile, Contributors & Splits, Files/Evidence, Readiness, Submissions, Calendar/Actions, and future Identifiers, Royalties, and Release/Marketing.

Works/Songs command page guidance direction:
The Works/Songs page should combine operational workflow, contextual guidance, future AI assistance, and future StudyEdge/Plexicon-style micro-learning. Guidance belongs inside the workflow, not outside the product as separate training. Phase 1 refines the page into three zones: operational awareness, primary work actions, and workflow guidance. Later phases may add an AI/avatar assistant, contextual micro-learning, and workflow-aware recommendations tied to readiness, submissions, identifiers, royalties, and calendar actions. These later phases remain roadmap direction only until explicitly implemented.

Phase 1 refinement note:
Operational awareness should stay light and scannable. The Last 10 Captured Works area is a quick-access list, not a full detail surface; full browsing remains on Existing Works. The guidance area should behave like an interactive Workflow Coach with selectable topics and short contextual responses, not like static documentation. Current implementation is non-generative and does not include an AI/avatar engine.

Works/Songs UX Continuation status:
This layer is complete for now. The Works page restored a lifecycle/operational map while preserving the three-zone layout: operational awareness, primary execution, and Workflow Coach/guidance. Last 10 Captured Works remains a compact quick-access list. Workflow Coach remains non-generative. Step 0 duplicate awareness remains preserved on Add Work. Canonical workspace-owned routes and contracts remain intact: `/api/works`, `/api/works/[workId]`, `/api/works/[workId]/profile`, and `/api/songs/create`. No `/api/test/get-work` dependency was reintroduced. The Works page timing metric now uses `Needs Review` instead of explicit `Overdue` wording for derived past-date incomplete actions, aligning with calendar/action semantics.

Known future notes:
No workflow dependency graph, operational chain reasoning, AI/autopilot, governed readiness engine, identifier capture, ISWC capture, or ISRC capture is implemented in this layer.

Contributor/Split UX Continuation status:
This layer is complete for now. The canonical work detail read model now includes read-only contributor/split rows from `work_contributors` joined to `contributors` under the authenticated workspace scope. Song Profile now shows a compact `Contributors & Splits` panel with contributor names, stage names where available, roles, split types, percentages, confirmation state, and split total. The panel uses the wording `Captured split data` and explicitly states that the data is not a signed split sheet, legal clearance, royalty payout readiness, or registration readiness result. Add Work contributor capture, 100% split validation, `/api/songs/create`, and Song Profile save behavior remain unchanged. No TEST contributor/split route dependency was introduced.

Known future notes:
No contributor editing, contributor approval workflow, royalty engine, payout logic, publishing administration, ISWC/ISRC management, master/recording split support, or neighbouring rights split support is implemented in this layer.

Next official roadmap layer:
Asset/File/Evidence UX Continuation. This should continue the grounded user-facing workflow after work and contributor visibility by improving how users understand and organize files, evidence, and supporting materials attached to canonical workspace-owned work operations. It must not introduce governed readiness automation, submission automation, legal clearance claims, AI/autopilot reasoning, identifier capture, royalty/payout logic, or external storage integrations.

Create-work UX note:
Duplicate awareness is pre-capture governance. It protects catalog integrity before a work is created. The Add Work flow should therefore begin with `Step 0 - Check Existing Works` before Work Identity, Contributors & Splits, and Review Draft. Current V1 behavior may remain a soft guidance gate, but the product logic is clear: users should check the catalog before creating a new work.

Future backend implications:
Future production flows should support AI duplicate matching, fuzzy title matching, contributor similarity matching, metadata similarity detection, genre/mood clustering, industry identifier conflict detection, duplicate warning history, override reason capture, audit trail for duplicate overrides, and submission governance protection for SAMRO, CAPASSO, and other industry registration workflows. These are roadmap implications only until explicitly approved for implementation.

### Contributor & Split Governance

User objective:
Capture who contributed, what role they played, and how ownership or allocation is split.

What the user should see/do:
Add contributors, select roles, enter identity details, validate split totals, understand incomplete/draft states, and eventually invite/confirm contributors.

Backend capabilities needed:
Contributor identity contract, role validation, split validation, contributor verification state, collaborator/invitation flow, rights entity separation, contributor approval workflow, lifecycle/audit metadata, and future rights share persistence.

Current implementation status:
Contributor/Split UX Continuation is complete for now. The active Add Work flow captures composition contributors and validates the split total at 100% before save. The active Song Profile detail flow shows read-only contributor/split rows from canonical workspace-owned data, including split total and confirmation visibility.

Alignment notes:
System users, workspace members, contributors, and rightsholders are not the same thing. Do not merge them prematurely.

Field intelligence note:
Contributor names, roles, split types, percentages, and confirmation states are part of the platform intelligence layer. They support future royalty routing, relationship intelligence, readiness, disputes, contributor portals, and AI-assisted workflow guidance.

### Asset / File Intelligence

User objective:
Organize files, artwork, audio, documents, templates, and evidence-like assets so they support operational workflows.

What the user should see/do:
List files/assets, classify them, link them to songs/submissions/evidence/project contexts, and understand upload/link/verification state.

Backend capabilities needed:
Asset/file contract, file classification, file vault read model, asset-event metadata, link intent, storage metadata, lifecycle/audit integration, and future real upload/storage governance.

Current implementation status:
Asset/File/Evidence Operations Pack V1 is active as a metadata-reference layer. Song Profile now includes a compact Supporting Materials panel backed by canonical workspace-scoped routes: `GET /api/works/[workId]/files` and `POST /api/works/[workId]/files`. The implementation uses `file_vault_items`, `file_vault_links`, and `file_vault_audit_events` for work-linked supporting material references. It does not upload files, verify evidence, certify legal clearance, score readiness, or automate submissions.

Alignment notes:
Asset governance is not automatically evidence governance. Real upload/storage, verification, expiry, and evidence authority require explicit production design.

### Evidence & Submission Governance

User objective:
Know what evidence is missing, why a work is blocked, and whether a submission can safely proceed.

What the user should see/do:
See readiness score, blockers, missing evidence, compliance status, evidence status, submission gate state, lifecycle status, and next required actions.

Backend capabilities needed:
Evidence requirement contracts, readiness aggregation, missing evidence detection, blocker summaries, evidence persistence, evidence review/verification, submission intent, submission queue, regulator/body adapters, lifecycle tracking, audit handoff, and remediation workflows.

Current implementation status:
Readiness Visibility Pack V1 is active as Work Operational Completeness. Song Profile now includes an `Operational Completeness` panel backed by `GET /api/works/[workId]/completeness`. The route is read-only and computes from canonical workspace-owned work basics, contributors/splits, Song Profile creative truth, and supporting material references. It does not produce a score and does not claim legal clearance, evidence verification, royalty readiness, regulator acceptance, or submission approval.

Alignment notes:
Readiness and evidence outputs must not claim production submission eligibility unless the full foundation and governance chain is active.

### Rights / Royalty Operations

User objective:
Understand and manage downstream rights, royalty, reconciliation, and payout-related workflows.

What the user should see/do:
Eventually see royalty readiness, statements, revenue attribution, payable participants, reconciliation issues, rights conflicts, and financial operations tied back to governed rights data.

Backend capabilities needed:
Rights entity model, rights share model, royalty participant model, finance/royalty read models, statement ingestion, reconciliation logic, payout governance, dispute handling, and audit trails.

Current implementation status:
Unknown until Codex verifies.

Alignment notes:
Rights and royalties should not be built before contributor/rightsholder separation and evidence/authority governance are clear.

### Finance / CRM / Marketing Expansion

User objective:
Expand from rights operations into business operations without losing governance.

What the user should see/do:
Eventually manage finance workflows, customer/partner relationships, campaign/marketing tasks, bookings, reports, exports, and operational automation.

Backend capabilities needed:
Finance configuration, CRM entities, marketing/task models, report/export capability, automation flags, entitlement gates, audit, and workspace-scoped operational data.

Current implementation status:
Finance / Accounting V1 is now implemented at `/dashboard/finance` using workspace-owned `workspace_finance_*` tables and `/api/finance/v1`. It supports basic accounts, income, expenses, payables, receivables, manual capture, dashboard summaries, recent transactions, AR/AP previews, report placeholders, and a future royalty bridge card. This is QuickBooks-style operational accounting tailored to Sentry Sound, not full QuickBooks and not production accounting automation.

Alignment notes:
These are expansion surfaces. They should not distract from subscription, onboarding, workspace setup, dashboard, and core music operations. Finance answers what the workspace earns, owes, spends, receives, reconciles, and reports. Royalties are not accounting; royalties remain a separate calculation/distribution/payable domain and should feed finance later only through approved posting into accounting. No bank integrations, tax automation, payroll, production payouts, or royalty-to-finance automation are active yet.

Strategic finance principle:
Finance records must eventually connect expenses and income to the operational reason, asset, workflow, deliverable, and value outcome. Sentry Sound Finance must evolve beyond normal accounting capture into operational value tracking. The future Finance V2 flow is: Need -> Analysis -> Solution -> Budget -> Allocation -> Action / Deliverable -> Payment / Expense -> Result -> ROI / Value. A studio fee is therefore not only an expense; it can originate from a recording need, linked artist, song/work, recording session, contributors/producers/lyricists, deliverable, budget allocation, release/commercial outcome, and measured value result. Finance V1 currently records controlled income and expense categories only. The operational value chain is strategic architecture direction and must not be implemented until explicitly scoped.

Finance V2 field model:
The canonical Finance V2 field architecture is captured in `docs/platform/FINANCE-V2-FIELD-MODEL.md`. The main finance transaction should stay as the accounting/money anchor: transaction type, amount, currency, date, status, category, source, workspace, creator, and notes. Operational reason, budgets, allocations, deliverables, ROI/value results, approvals, evidence, and multi-entity links should become linked child entities or workflow-derived records rather than overloaded transaction columns. User-entered finance truth, controlled dropdowns, linked operational truth, workflow-derived state, system-generated finance state, and future AI-derived recommendations must remain clearly separated.

Finance V2 Phase 1:
Start with actuals and commitments before forecasts. Finance V2 Phase 1 should help users understand money in, money out, outstanding commitments, contributor liabilities, compliance reminders, reserve awareness, and what operational action caused the financial item. The principle is: money has responsibility. Income should eventually surface reminders that taxes/compliance may be due, contributors may be owed, planned expenses may exist, and release/project commitments may need funding. Compliance reminders are educational/operational guidance, not legal, accounting, or tax advice.

Finance commitments operational reminder note:
Finance commitments are operational obligations, not passive accounting rows. Lightweight actions such as mark paid, cancel, and review later should keep the finance surface useful without becoming a full workflow engine. Due, overdue, and review-later commitments can feed the shared Workspace Actions/Calendar layer as finance reminders so users see obligations in the same operational action surface as other workspace work.

Finance V2 classification strategy:
Commitments should classify obligations by universal finance category, industry, industry-body/external-body, and commitment type. This preserves reusable finance logic across future SaaS systems while allowing Sentry Sound to add music-industry intelligence for bodies such as SAMRO, CAPASSO, CIPC, SARS, distributors, publishers, and PROs/CMOs. The strategy is: universal finance engine plus industry-specific intelligence.

Structured commitment framework:
Finance commitments should guide users away from vague reminders and toward structured obligation thinking. The user selects a commitment domain, then a domain-valid commitment type. Commitment nature distinguishes mandatory, operational, strategic, and optional items. Commitment risk level distinguishes low, medium, high, and critical pressure. Mandatory/high-risk/critical commitments should visually and operationally feel more serious than optional or strategic spend. This framework supports future warnings, reserve awareness, business health, bankability, and AI financial coaching.

Commitment Weighting V1 status:
Commitment Weighting V1 is stabilized and complete for now. It is a computed semantic layer that explains why individual commitments matter operationally. It does not perform operational chain reasoning, ROI/conversion logic, forecasting, AI advice, scoring, budget allocation, reserve allocation, or bank/cash reasoning. Future chain reasoning remains deferred until the relevant layer is explicitly defined, built, tested, stabilized, and documented.

Future finance phases:
Phase 1 is actuals, commitments, and reserve awareness. Phase 2 is budget planning and allocation logic. Phase 3 is forecasting/projections based on history, royalty cycles, releases, and commitments. Phase 4 is ROI/value intelligence. Phase 5 is an AI financial coach/guided recommendation layer. AI may later recommend allocations, reserves, and commitments, but it must not silently create finance truth, legal/tax advice, approvals, payments, or completed actions.

Team alignment note:
Product owner, ChatGPT, and Codex should treat this Finance V2 Phase 1 direction as shared source-of-truth logic when implementing future finance, royalty, workflow/calendar, and AI features.

### Enterprise Governance

User objective:
Operate at scale with controls, review, permissions, auditability, and oversight.

What the user should see/do:
Manage teams, roles, approvals, reviews, enterprise overrides, audit logs, compliance state, governed workflows, and administrative reporting.

Backend capabilities needed:
RBAC, permissions, approval workflows, enterprise entitlement overrides, audit/event persistence, governance policies, lifecycle states, workspace hierarchy, and reporting/export controls.

Current implementation status:
Unknown until Codex verifies.

Alignment notes:
Enterprise controls should extend core operations, not replace foundation enforcement or rights validation.

### Global UX States and Guidance

User objective:
Understand where they are, what is saved, what is incomplete, what is blocked, and what they can do next.

What the user should see/do:
Clear states for loading, empty, draft, saved, unsaved, blocked, ready, unavailable, deferred, TEST-only, and permission/plan restricted flows.

Backend capabilities needed:
State contracts, backend truth distinction, warnings, blocker models, lifecycle summaries, entitlement summaries, audit metadata, and grounded guidance APIs later.

Current implementation status:
Unknown until Codex verifies.

Alignment notes:
The UI must not invent operational truth. It can explain and guide, but backend state owns readiness, evidence sufficiency, queue eligibility, lifecycle status, and production action availability.

## 8. Existing Backend Value

Existing backend systems are valuable, but they must now be aligned to this roadmap.

Important existing or recently created support infrastructure includes:

- Create Song flow
- Contributor governance
- Split validation
- Asset governance
- Evidence readiness aggregator
- Lifecycle/audit/operational events
- TEST routes

These are support infrastructure, not the roadmap itself.

They should be reused where they support the operational journey. They should not become isolated development tracks that pull the platform away from the subscription-to-onboarding-to-workspace-to-dashboard flow.

Codex should inspect existing code before rebuilding or extending these systems. If existing systems are partial, duplicated, TEST-only, or misaligned, Codex should report that clearly and propose incremental alignment rather than replacing them wholesale.

## 9. Execution Rules Going Forward

- Codex must inspect this roadmap first before future implementation.
- Codex must inspect existing docs/code before building.
- Codex must report whether a feature is already implemented, partially implemented, missing, or misaligned.
- Codex should implement only when the requested work is aligned with the roadmap.
- Codex must flag contradictions between the roadmap and current code.
- Avoid unnecessary repeated tests.
- Avoid duplicate systems.
- Avoid backend work that does not support a clear user-facing or operational objective.
- Keep TEST-only mode until explicitly moved out of TEST.
- No production activation unless explicitly approved.

Additional execution guidance:

- Prefer extending existing operational primitives over creating parallel systems.
- Prefer read-model aggregation where the user needs visibility rather than new persistence.
- Prefer product-flow alignment over isolated backend completion.
- Treat screenshots/reference flows as product requirements to interpret, not decoration.
- Do not treat TEST/admin routes as production capability.
- Do not treat backend contracts as user-facing product completion.

## 10. Immediate Strategic Correction

The project recently drifted too deep into backend primitives before completing the subscription-to-onboarding-to-workspace operational flow.

The correction is to return to the product journey and use backend work only to support the visible operational experience.

This does not mean the backend work was wasted. Entitlement, audit, lifecycle, contributor, asset, orchestration, and readiness primitives are useful foundation pieces. The correction is about sequencing and alignment: future backend work should be pulled by the user journey, dashboard surfaces, onboarding needs, subscription/access logic, and operational product objectives.

## 11. Next Recommended Roadmap Step

Do not implement this yet.

The next planning/execution focus should be:

Subscription -> Onboarding -> Workspace/Profile Setup -> Operational Dashboard

This means the next work should clarify the user-facing flow from plan choice to account creation, onboarding, profile setup, and dashboard entry before expanding deeper song/evidence/submission backend systems.

## 12. Codex Verification Responsibility

Codex must later verify against the repository:

- What parts of this roadmap already exist
- What is missing
- What is partially implemented
- What is misaligned
- What should be prioritized next

For future verification, Codex should inspect at minimum:

- `docs/platform/SENTRY_SOUND_MASTER_OPERATIONAL_ROADMAP.md`
- `docs/platform/SENTRY-SOUND-PLATFORM-SERVICE-OFFERING.md`
- `docs/platform/APP-LEVEL-USER-JOURNEY-FLOW.md`
- `docs/platform/DASHBOARD-CAPABILITY-ALIGNMENT-MATRIX.md`
- `docs/platform/OPERATIONAL-UX-GOVERNANCE.md`
- `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`
- `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- `docs/platform/ENTITLEMENT_AND_PRODUCTION_GOVERNANCE_HANDOVER_V1.md`
- relevant app routes, services, tests, schema, migrations, and TEST/admin slices

Verification should be honest. If a roadmap area is implemented only as TEST support, say TEST support. If production governance is missing, say missing. If the UI surface does not exist, say missing. If backend support exists but is not aligned to the visible journey, say misaligned or partial.

## 13. Source Alignment

This roadmap should be read before implementation handovers and backend phase documents.

Relevant supporting documents include:

- `docs/platform/SENTRY-SOUND-PLATFORM-SERVICE-OFFERING.md`
- `docs/platform/APP-LEVEL-USER-JOURNEY-FLOW.md`
- `docs/platform/DASHBOARD-CAPABILITY-ALIGNMENT-MATRIX.md`
- `docs/platform/OPERATIONAL-UX-GOVERNANCE.md`
- `docs/platform/PLATFORM-SUBSCRIPTION-AND-ACCESS-MODEL.md`
- `docs/platform/PLATFORM-FOUNDATION-DOMAIN-ARCHITECTURE.md`
- `docs/platform/PLATFORM-FOUNDATION-ENFORCEMENT-CHAIN.md`
- `docs/platform/ENTITLEMENT_AND_PRODUCTION_GOVERNANCE_HANDOVER_V1.md`

Implementation handovers describe what has been built. This roadmap explains why future work should be built and in what product direction it should move.
