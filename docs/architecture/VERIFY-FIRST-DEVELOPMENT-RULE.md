# Verify First Development Rule

Status: HARDLOCKED

## Purpose

Prevent runtime/backend architectural drift, duplicate schema creation,
invalid assumptions, and reactive patch loops.

This rule is mandatory for all future StudyEdge / Sentry Sound runtime,
academy, orchestration, remediation, telemetry, governance, and backend work.

---

# Mandatory Process Before Any Development

Before creating:

- tables
- migrations
- repositories
- orchestration
- services
- triggers
- runtime logic
- contracts
- APIs
- queue systems
- governance layers

the system MUST first verify the existing architecture.

---

# Required Verification Sequence

## 1. Inspect Existing Files

Required:

- orchestration files
- repositories
- contracts
- services
- runtime flows
- SQL files
- migrations
- documentation

Use PowerShell/code snapshot extraction first.

---

## 2. Inspect Existing SQL Structures

Required inspection:

- tables
- columns
- indexes
- constraints
- foreign keys
- triggers
- functions
- existing rows
- canonical IDs
- queue/status enums

Never assume schema names or statuses.

---

## 3. Verify Runtime Contracts

Required verification:

- canonical identifiers
- tenant rules
- remediation statuses
- queue statuses
- telemetry linkage
- orchestration expectations
- escalation references
- existing integration points

---

## 4. Align To Existing Architecture

New development must integrate into:

- existing contracts
- existing orchestration
- existing queues
- existing governance
- existing runtime logic

Avoid duplicate systems.

Avoid competing abstractions.

Avoid alternate naming conventions.

---

# Prohibited Workflow

The following are prohibited:

- blind schema creation
- speculative table creation
- guessed column names
- one-error-at-a-time reactive patching
- bypassing runtime contracts
- inventing statuses/enums without verification
- creating duplicate orchestration layers

---

# Required Development Style

Required approach:

Verify
→ Map Existing Architecture
→ Confirm Contracts
→ Patch Once Cleanly
→ Validate End-To-End
→ Document

---

# Runtime Architecture Principle

The system is now mature enough that:
architecture discovery MUST happen before architecture extension.

This rule is globally applicable across:

- Runtime
- Academy
- Remediation
- Governance
- AI orchestration
- Telemetry
- Workflow systems
- ERP systems
- Queue systems
- Multi-agent systems

---

# Academy Priority Protection Rule

Status: HARDLOCKED

## Strategic Direction

The primary objective is:

Sentry Sound Academy
=
Executable educational operating system.

The system is NOT being developed as a standalone governance/backend engine.

Governance, telemetry, remediation, escalation, queues, audit systems,
and runtime orchestration exist ONLY to support academy execution.

---

# Mandatory Priority Allocation

Development priority must remain approximately:

70% Academy Execution
30% Runtime/Governance Stabilization

---

# Academy Execution Takes Priority

Primary development targets:

- Module Contract System
- Lesson Execution
- SLB Runtime
- Competency Runtime
- Assessment Runtime
- Learner Progression
- Curriculum Execution
- Evidence Generation
- Certification Flow

---

# Runtime/Governance Expansion Restrictions

Do NOT expand governance/runtime systems unless immediately required
by academy execution.

Avoid premature development of:

- autonomous governance engines
- policy automation daemons
- advanced escalation automation
- additional queue systems
- speculative orchestration layers
- duplicate backend lifecycle systems

---

# Runtime Architecture Principle

Runtime/governance systems must remain:

execution infrastructure

NOT the primary product.

The Academy educational execution model remains the primary system objective.

---

# SQL Governance Principle

Validated architecture direction:

TypeScript
=
orchestration adapter

SQL/RPC layer
=
governance authority

TypeScript should orchestrate and initiate.

SQL governance layer should own lifecycle authority.

---

# Verify First Requirement

Before ANY backend/runtime/governance changes:

1. Inspect docs
2. Inspect current architecture
3. Inspect SQL contracts
4. Inspect runtime flows
5. Confirm actual need
6. Avoid speculative expansion

No backend expansion without immediate academy execution requirement.

---

# Strategic Protection

If development drifts too deeply into backend/governance infrastructure,
pause and reconnect work to:

Module
→ Lesson
→ SLB
→ Competency
→ Assessment
→ Remediation
→ Evidence
→ Certification
