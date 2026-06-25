# Finance V2 Field Model

## Purpose

Finance V2 is the future operational-value finance model for Sentry Sound.

Finance V1 records workspace-owned income, expenses, payables, receivables, controlled income categories, and controlled expense categories.

Finance V2 must go further:

Need -> Analysis -> Solution -> Budget -> Allocation -> Action / Deliverable -> Payment / Expense -> Result -> ROI / Value

Core principle:

Finance records must eventually connect expenses and income to the operational reason, asset, workflow, deliverable, and value outcome.

Phase 1 principle:

Money has responsibility.

Traditional accounting starts when money already moved. Sentry Sound Finance must also help users understand why money should move, what obligations already exist, and what responsibilities may follow when income is received. Phase 1 should therefore start with actuals and commitments before forecasts.

Finance V2 Phase 1 should eventually answer:

1. What money came in?
2. What money went out?
3. What obligations are still outstanding?
4. Who may need to be paid?
5. What compliance payments may be due?
6. What reserves should be considered?
7. What operational action caused this financial item?
8. What should the user not forget?

This is educational and operational. Compliance reminders, reserve prompts, and tax/provisional-tax awareness are guidance surfaces, not legal, accounting, or tax advice.

This document is architecture direction only. It does not authorize schema changes, UI changes, route changes, royalty posting, bank integrations, tax automation, or AI automation.

## Recommended Architecture

Finance V2 should not put every field directly on the main finance transaction.

Recommended model:

- `finance_transactions`: accounting/event record for money movement or planned money movement.
- `finance_commitments`: future obligation/commitment records for outstanding payments, contributor liabilities, planned payments, and compliance reminders before cash movement.
- `finance_reserve_awareness`: future operational reserve prompts for taxes, compliance, contributor obligations, release/project commitments, and other non-free-spend amounts.
- `finance_needs` / business cases: why money may be spent or earned.
- `finance_budgets` / allocations: planned amount, owner, remaining amount, and budget status.
- `finance_deliverables`: what the spend should produce.
- `finance_value_results`: result, ROI, lessons, and value outcome.
- Entity links: work, artist, project, release, recording/session, contributor, calendar action, submission, CRM contact.
- Audit/workflow records: approvals, locks, audit references, created/modified actor trail.

Architecture rule:

The main finance transaction should remain the money/accounting anchor. Operational context should be linked to it, not packed into it as loosely editable columns. This keeps accounting clean while allowing Sentry Sound to explain why money moved, what workflow caused it, what deliverable was expected, and whether value was created.

Phase 1 scope rule:

Start with actuals and commitments, not forecasts. V2 Phase 1 should strengthen visibility into money in, money out, outstanding commitments, contributor liabilities, compliance reminders, reserve awareness, and simple operational financial education. Budgets, forecasts, ROI, and AI coaching are later phases.

## Classification Strategy

Finance V2 should support reusable finance logic across future SaaS systems, not only Sentry Sound. Commitments therefore use four classification axes:

| Axis | Purpose | Examples |
| --- | --- | --- |
| Universal finance classification | Reusable finance logic that works across industries | Compliance, tax, contributor/contractor, operational expense, project/production, marketing, software/subscription, professional services, revenue obligation, other |
| Industry classification | Industry context for future specialized intelligence | Music, general now; construction, education, legal, agriculture, healthcare later |
| Industry-body / external-body classification | External body or ecosystem authority related to the obligation | SAMRO, CAPASSO, CIPC, SARS, distributor, publisher, PRO/CMO, other, none |
| Commitment type | Practical obligation type the user understands | Annual fee, provisional tax, contributor payable, producer fee, studio booking, distribution fee, release campaign, royalty payable, software subscription, other |

This creates the future pattern:

universal finance engine + industry-specific intelligence.

Sentry Sound should use this classification for music-industry obligations while preserving the possibility that the same finance engine could later support other vertical SaaS systems.

## Field Ownership Logic

Finance V2 fields should be owned by the system layer that knows the truth:

| Field ownership type | Meaning | Examples |
| --- | --- | --- |
| User-entered finance truth | Entered by a user when recording a transaction, request, need, or note | `amount`, `transaction_date`, `notes`, `business_need`, `expected_outcome` |
| Controlled finance structure | Selected from governed values for reporting/search/AI integrity | `transaction_type`, `category`, `currency`, `priority`, `deliverable_type` |
| Linked operational truth | Selected from canonical entities rather than typed as text | `linked_work_id`, `linked_contributor_id`, `linked_calendar_action_id`, `linked_submission_id` |
| Workflow-derived truth | Set by workflow/actions/approvals, not manually typed into finance | `requested_by`, `approved_by`, `workflow_status`, `approval_status`, `completed_at` |
| System-generated finance state | Calculated or locked by finance/governance logic | `remaining_amount`, `linked_revenue`, `finance_lock_status`, `audit_reference` |
| AI-derived recommendation | Suggested later by AI, but not authoritative until reviewed/accepted | suggested category, missing link suggestion, ROI insight, budget recommendation |

AI-derived values must remain recommendations or system insights. They must not silently become accounting truth, approval truth, payment truth, user-entered creative truth, or completed operational actions.

## Field Groups

### 1. Transaction Basics

| Field | Purpose | Relationship | Future handling |
| --- | --- | --- | --- |
| `transaction_type` | Defines income, expense, transfer, adjustment | Main transaction | Required dropdown |
| `amount` | Monetary amount | Main transaction | Required user-entered; locked after posting/close |
| `currency` | Transaction currency | Main transaction / workspace finance settings | Required dropdown/default; may be derived from workspace |
| `transaction_date` | Date of transaction | Main transaction | Required user-entered/default |
| `status` | Draft, posted, reconciled, cancelled | Main transaction/workflow | Required dropdown; dangerous if freely editable |
| `category` | Controlled finance category | Main transaction -> category table | Required dropdown for income/expense |
| `notes` | Human explanation | Main transaction | Optional freeform |

Transaction basics should exist on the main transaction. These are the fields most likely to drive accounting reports, summaries, reconciliation state, and future royalty posting into finance.

### 2. Operational Reason / Need

| Field | Purpose | Relationship | Future handling |
| --- | --- | --- | --- |
| `business_need` | Plain reason for spend/income | Finance need/business case | Optional initially; later required for planned expenses above thresholds |
| `operational_reason` | Operational context such as recording, marketing, legal, release | Finance need/business case | Dropdown + freeform detail |
| `business_case` | Justification and expected benefit | Finance need/business case | Optional rich text; linked child entity |
| `expected_outcome` | Desired result | Finance need/business case / value result | Optional user-entered; AI may summarize later |
| `requested_by` | Actor requesting spend/action | Workflow/audit | Workflow-derived linked user |
| `approved_by` | Actor approving spend/action | Approval workflow | Workflow-derived linked user; not free editable |
| `priority` | Operational urgency | Finance need/workflow | Dropdown |

Operational reason fields should usually become a linked business-case/need entity rather than permanent freeform fields on every transaction. A transaction may be manual and simple, but planned spend should be traceable to a need, request, approval, and expected outcome.

### 3. Budget & Allocation

| Field | Purpose | Relationship | Future handling |
| --- | --- | --- | --- |
| `budget_id` | Links transaction to budget | Budget allocation entity | Linked entity |
| `budget_name` | Human budget label | Budget entity | Derived from linked budget |
| `allocated_amount` | Approved/planned amount | Budget allocation | Required when budgeted |
| `remaining_amount` | Amount left | Budget allocation | System-generated from allocations/spend |
| `budget_status` | Draft, approved, active, exhausted, closed | Budget workflow | Workflow/system-derived |
| `budget_owner` | Person/team responsible | Budget entity | Linked user/member |

Budget and allocation fields should become linked child entities. `remaining_amount` must be calculated, not user-entered. Budget status should be controlled by workflow and audit history.

### 4. Operational Linkages

| Field | Purpose | Relationship | Future handling |
| --- | --- | --- | --- |
| `linked_work_id` | Connects finance to song/work | `musical_works` | Optional linked entity; should not be free text |
| `linked_artist_id` | Connects to artist/contact/profile | CRM/artist entity | Future linked entity |
| `linked_project_id` | Connects to project/campaign | Project/release entity | Future linked entity |
| `linked_release_id` | Connects to release | Release entity | Future linked entity |
| `linked_recording_session_id` | Connects studio/session spend to session | Recording/session entity | Future linked entity |
| `linked_contributor_id` | Connects cost/payment to contributor | `contributors` | Optional linked entity |
| `linked_calendar_action_id` | Connects finance to workflow task/action | `workspace_calendar_items` | Workflow-derived |
| `linked_submission_id` | Connects cost to submission workflow | Submission queue/lifecycle | Future linked entity |

Operational linkages should be entity references, not text labels. They are optional on simple manual transactions, but critical for management reporting, ROI, royalty bridge logic, and AI insight quality.

### 5. Deliverables

| Field | Purpose | Relationship | Future handling |
| --- | --- | --- | --- |
| `deliverable_type` | What is being produced: mix, master, artwork, campaign, legal doc | Finance deliverable | Dropdown |
| `deliverable_description` | Details of expected output | Finance deliverable | Optional freeform |
| `due_date` | Expected completion date | Deliverable/workflow action | Optional/date; may create calendar action |
| `completed_at` | Actual completion timestamp | Deliverable | Workflow-derived; not free editable |
| `deliverable_owner` | Responsible user/vendor/contributor | Deliverable/workflow | Linked user/contact |
| `evidence_uploaded` | Whether proof/supporting file exists | Evidence/file vault | System-derived |
| `verification_status` | Pending, verified, rejected, disputed | Evidence/review workflow | Workflow-derived; dangerous if freely editable |

Deliverables should become linked child entities or linked workflow actions. A transaction can pay for a deliverable, but completion and verification belong to workflow/evidence state.

### 6. ROI / Value Tracking

| Field | Purpose | Relationship | Future handling |
| --- | --- | --- | --- |
| `expected_roi` | Expected return/value | Value result/business case | Optional estimate; may be qualitative |
| `actual_result` | What happened | Value result | User-entered + system-supported |
| `linked_revenue` | Revenue related to spend | Finance transactions / royalty statements | System-derived link/aggregation |
| `performance_status` | Underperforming, on track, exceeded, unknown | Value result | System-generated with override notes |
| `roi_notes` | Human interpretation | Value result | Optional freeform |
| `lessons_learned` | Future planning insight | Value result / system insight | Optional; AI may summarize later |

ROI/value fields should become linked value-result records. Some values may be user-entered reflections, but actual linked revenue and performance status should be derived from trusted operational/finance/royalty/reporting data.

### 7. Workflow / Governance

| Field | Purpose | Relationship | Future handling |
| --- | --- | --- | --- |
| `workflow_status` | Requested, approved, in progress, delivered, paid, reviewed | Workflow entity/action | Workflow-derived |
| `approval_required` | Whether approval is needed | Policy/workflow | System/workflow-derived; threshold-based later |
| `approval_status` | Pending, approved, rejected | Approval workflow | Workflow-derived; dangerous if free editable |
| `finance_lock_status` | Editable, posted, period-locked, audit-locked | Finance governance | System-derived |
| `audit_reference` | Trace to audit history | Audit event | System-generated |
| `created_by` | Actor creating record | Audit | System-generated |
| `modified_by` | Actor modifying record | Audit | System-generated |

Workflow and governance fields should not be editable as ordinary form inputs. They should move through controlled workflow actions, approval decisions, lock rules, and audit events.

### 8. Commitments / Obligations / Reserve Awareness

| Field | Purpose | Relationship | Future handling |
| --- | --- | --- | --- |
| `commitment_domain` | Structured operating domain for the obligation | Commitment framework | Required dropdown; controls allowed commitment types |
| `commitment_nature` | Distinguishes mandatory, operational, strategic, and optional commitments | Commitment framework | Controlled dropdown; defaults may be suggested by domain/type |
| `commitment_risk_level` | Indicates low, medium, high, or critical obligation pressure | Commitment framework / future warning logic | Controlled dropdown; high/critical should be visually prominent |
| `commitment_type` | Identifies contributor payable, supplier payable, compliance reminder, release commitment, reserve prompt, or general obligation | Commitment entity | Dropdown |
| `commitment_amount` | Expected amount owed or reserved | Commitment / payable / reserve awareness | Optional initially; required when a known amount exists |
| `commitment_status` | Planned, due, overdue, paid, cancelled, review later | Commitment workflow | Workflow-derived dropdown |
| `due_or_review_date` | Date the user should act or review | Commitment / calendar action | Optional date; may generate workflow action |
| `responsibility_reason` | Why this money is not fully free to spend | Commitment/reserve awareness | Controlled reason + optional notes |
| `linked_income_transaction_id` | Income that may create downstream obligations | Finance transaction | Linked entity |
| `reserve_category` | Tax, compliance, contributor, project/release, operating reserve, other | Reserve awareness | Dropdown |
| `educational_note` | Plain-language reminder explaining the responsibility | Guidance/system content | System-authored; not legal/tax advice |

Commitments and reserve awareness should help the user understand obligations before money disappears from the bank account. They should not become tax automation, legal advice, payroll, or production payout logic in Phase 1.

Structured commitment framework:

Commitments should reduce freeform capture and guide users toward disciplined financial behavior. The user should select a commitment domain first, then a domain-valid commitment type. Nature and risk may default from the selected type but can remain controlled override fields where appropriate.

Initial domains:

- compliance
- tax
- contributor_obligations
- production
- release_marketing
- operations
- software_infrastructure
- legal_governance
- finance_funding
- revenue_sharing
- growth_expansion
- other

Initial nature values:

- mandatory
- operational
- strategic
- optional

Initial risk levels:

- low
- medium
- high
- critical

Examples:

- CIPC annual return: compliance, cipc_annual_return, mandatory, high.
- SARS provisional tax: tax, provisional_tax, mandatory, critical.
- Studio booking: production, studio_booking, operational, medium.
- Producer payment: contributor_obligations, producer_payment, operational, high.

Mandatory and critical commitments must not feel like optional spend. They should support future warnings, reserve awareness, business health assessment, and bankability intelligence.

Phase 1 commitment actions:

- mark paid
- cancel
- review later

Due, overdue, and review-later commitments may create or update finance reminders in the shared Workspace Actions/Calendar layer. This keeps finance obligations visible as operational work without building a separate finance workflow engine.

## Required vs Optional Guidance

| Scope | Recommended requirement level |
| --- | --- |
| V1/V2 manual transaction | Require `workspace_id`, `created_by_user_id`, `transaction_type`, `amount`, `currency`, `transaction_date`, `status`, and controlled `category` for income/expense. |
| Commitment / obligation | Require workspace, creator, commitment type, status, and due/review date when the obligation is actionable. Amount may be optional when unknown. |
| Reserve awareness | Use controlled reserve category and educational note; do not require exact tax/provisional values in Phase 1. |
| Planned spend request | Require business need, expected outcome, requester, priority, and approval requirement when thresholds or workflow rules apply. |
| Budgeted work | Require budget/allocation link, allocated amount, budget owner, and budget status. |
| Work/project-linked spend | Require linked operational entity where the transaction claims to support a work, artist, release, campaign, submission, or session. |
| Deliverable-based spend | Require deliverable type, owner, due date, and verification status before marking value complete. |
| ROI/value review | Require linked result/revenue source before calculating ROI or performance status. |

Optional fields should remain optional when a workspace is doing simple bookkeeping. Requirements should become stricter only when the user enters governed workflows such as budgets, approvals, deliverables, royalty posting, or reporting periods.

## Main Transaction vs Linked Child Entities

### Keep On Main Transaction

- `transaction_type`
- `amount`
- `currency`
- `transaction_date`
- `status`
- `category`
- `notes`
- `source_module`
- `related_entity_type`
- `related_entity_id`
- `workspace_id`
- `created_by_user_id`

Main transaction fields should support accounting summaries and auditability without making the transaction row carry the whole operational story.

### Linked Child Entities Later

- business need / business case
- budget and budget allocation
- deliverable
- evidence/verification
- ROI/value result
- approval trail
- audit history
- multiple entity links where one transaction supports several works/releases/actions
- commitments/obligations/reserve awareness linked to income, contributors, compliance duties, or workflow actions

Linked child entities should support one-to-many relationships, review history, workflow states, and future reporting without constant transaction-table rewrites.

## Derived From Other Modules

Finance V2 should be able to derive or receive context from:

| Source module | Future derived finance context |
| --- | --- |
| Works/Songs | linked work, profile completion need, evidence need, contributor context |
| Recording sessions | studio/mixing/mastering needs, recording deliverables, session owners |
| Releases | launch budget, marketing allocation, distribution costs, release revenue |
| Royalties | approved royalty earnings, contributor payables, statement references |
| Submissions | submission fees, follow-up costs, returned status, body references |
| CRM/Artists | artist/customer/vendor relationship, contact follow-up, service income |
| Workflow/Tasks/Calendar | due dates, approvals, action ownership, completion state |
| File/Evidence vault | uploaded invoice, receipt, proof of deliverable, verification status |

Derived context must be traceable to its source. Finance should not invent operational facts when another module owns them.

## Phase 1: Actuals And Commitments

Finance V2 Phase 1 should focus on:

- money in
- money out
- outstanding commitments
- contributor liabilities
- compliance reminders
- reserve awareness
- simple operational financial education
- links between financial items and workflow/actions

Examples:

- CIPC annual return reminder
- SARS provisional tax reminder
- contributor/producer payable visibility
- release budget awareness
- studio expense linked to song/session/artist
- royalty income connected to future obligations

This phase should help creative businesses build discipline around compliance, contributor payment, reserves, bankability, and operational maturity. It should not attempt complex forecasting, AI prediction, tax calculation, or royalty automation.

## Fields Users Should Not Freely Edit

- `created_by`
- `modified_by`
- `approved_by`
- `completed_at`
- `remaining_amount`
- `linked_revenue`
- `performance_status`
- `finance_lock_status`
- `audit_reference`
- `verification_status`
- reconciled/period-locked status

These should be system-generated, workflow-derived, or controlled through approval/audit flows.

Also dangerous if editable without governance:

- `amount` after posting, reconciliation, period close, or royalty-derived approval
- `currency` after posting
- `transaction_date` after period close
- `category` after reporting lock
- `related_entity_id` after reconciliation or value review
- royalty-sourced payable amounts after approval
- budget remaining amounts
- approval status, approver, and approval timestamp

## Workflow-Derived Strategy

Finance V2 should derive context from workflow/actions where possible:

- A calendar action can create or link a finance need.
- A recording/session workflow can create a studio/mixing/mastering expense need.
- A submission workflow can create a submission-fee payable.
- A release workflow can create marketing/distribution budget allocations.
- A CRM/artist workflow can link customer/vendor/contributor context.

## AI-Derived Future Opportunities

AI may later:

- summarize business cases
- suggest missing operational links
- recommend likely category based on context
- detect spend without deliverable/result
- compare spend to outcome
- summarize lessons learned
- generate ROI insights
- recommend future budget allocation
- suggest reserve allocations or commitment reminders

AI must not silently create accounting truth, approvals, payments, or completed deliverables.

## Critical Risks

- Overloading `finance_transactions` with too many workflow fields.
- Allowing users to manually edit audit/approval/lock/result fields.
- Treating royalty distributions as accounting entries too early.
- Creating budgets without workspace ownership and audit trail.
- Measuring ROI without reliable linked revenue/result data.
- Letting AI convert recommendations into finance truth without user approval.
- Building operational-value tracking before workflow ownership, budget states, and audit rules are clear.
- Using freeform text for links that should be canonical entity references.
- Treating ROI as reliable before revenue/result sources are trustworthy.
- Presenting compliance reminders as legal, accounting, or tax advice.
- Skipping commitments/reserve awareness and moving too quickly into forecasts.

## Suggested Phased Implementation

### Phase 1: Actuals + Commitments + Reserve Awareness

Use Finance V1 actual transaction data as the base and add commitments/reserve awareness as the first practical V2 slice. Focus on outstanding obligations, contributor liabilities, compliance reminders, reserve awareness, and financial education.

### Phase 2: Budget Planning And Allocation Logic

Add budget records, allocation tracking, and planned spend controls.

### Phase 3: Forecasting / Projections

Add projections based on history, royalty cycles, releases, commitments, and planned actions only after actuals and commitments are reliable.

### Phase 4: ROI / Value Intelligence

Add result and ROI tracking after enough operational workflows are stable.

### Phase 5: AI Financial Coach / Guided Recommendations

Add AI recommendations only after user-entered truth, workflow status, commitments, and finance records are cleanly separated. AI may recommend allocations or reserves but must not silently create finance truth.

## Legacy Detailed Implementation Notes

### Phase V2-A: Model Planning

Document canonical finance need, budget allocation, deliverable, and value result entities.

### Phase V2-B: Links Before Automation

Allow finance records to link to works, projects/releases, contributors, and calendar actions.

### Phase V2-C: Budget And Allocation

Add budget records and allocation tracking.

### Phase V2-D: Deliverables

Track what spending is meant to produce, who owns it, and whether evidence exists.

### Phase V2-E: Value / ROI

Add result and ROI tracking after enough operational workflows are stable.

### Phase V2-F: AI Assistance

Add AI recommendations only after user-entered truth, workflow status, and finance records are cleanly separated.
