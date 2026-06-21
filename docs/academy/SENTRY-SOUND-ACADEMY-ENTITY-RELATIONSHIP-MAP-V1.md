# Sentry Sound Academy Entity Relationship Map V1

## Purpose

This document defines the high-level relationship map between academy entities.

It does not create database tables yet.

It exists to show how modules, SLBs, lessons, assessments, evidence, learner sessions, competency events, remediation, runtime, and governance connect.

---

# Core Principle

The academy is not a standalone LMS.

It is an executable competency layer aligned to the existing Sentry Sound architecture.

The relationship model must remain:
- competency-driven
- evidence-aware
- workflow-aware
- event-aware
- runtime-compatible
- governance-ready
- workspace-aware

---

# Primary Relationship Flow

Academy Programme
→ Academy Module
→ Academy SLB
→ Academy Lesson
→ Academy Assessment
→ Academy Evidence
→ Learner Execution Session
→ Academy Competency Event
→ Academy Remediation
→ Governance / Audit Review

---

# Entity Relationships

## 1. Academy Programme

A programme contains multiple modules.

Relationship:
- one programme has many modules
- one module may belong to one or more programmes later

Example:
Sentry Sound Fundamentals Programme
→ Music Industry Fundamentals
→ Sentry Sound Platform Fundamentals
→ Rights & Ownership
→ Metadata Management

---

## 2. Academy Module

A module contains multiple SLBs.

Relationship:
- one module has many SLBs
- one SLB belongs to one primary module
- reusable SLBs may later be referenced across modules

---

## 3. Academy SLB

An SLB anchors competence.

Relationship:
- one SLB may have one or more lessons
- one SLB may have one or more assessments
- one SLB may require one or more evidence objects
- one SLB may trigger remediation
- one SLB may produce competency events

---

## 4. Academy Lesson

A lesson teaches one or more SLBs.

Relationship:
- one lesson belongs to a module
- one lesson may map to one or more SLBs
- one SLB may appear in more than one lesson if required

---

## 5. Academy Assessment

An assessment validates one or more SLBs.

Relationship:
- one assessment belongs to a module
- one assessment maps to one or more SLBs
- one assessment may require evidence
- one failed assessment may trigger remediation

---

## 6. Academy Evidence

Evidence proves competence.

Relationship:
- one evidence item belongs to a learner
- one evidence item links to a module, SLB, assessment, or session
- one evidence item may require verification
- one evidence item may generate audit events

---

## 7. Learner Execution Session

A learner execution session tracks learner activity.

Relationship:
- one learner may have many sessions
- one session may involve module, lesson, SLB, and assessment activity
- one session produces competency events
- one session may trigger remediation

---

## 8. Academy Competency Event

A competency event records progress, failure, evidence submission, assessment, remediation, or verification.

Relationship:
- one event belongs to one learner session
- one event links to learner, module, SLB, and optionally assessment/evidence
- one event may update competency state
- one event may trigger remediation
- one event may feed reporting

---

## 9. Academy Remediation

Remediation corrects failed or weak competency areas.

Relationship:
- remediation is triggered by a competency event or assessment result
- remediation maps back to one or more SLBs
- remediation may produce new learner events
- remediation may require reassessment

---

## 10. Governance / Audit Review

Governance ensures quality, compliance, and verification.

Relationship:
- evidence may require verification
- assessments may require review
- modules may require approval
- SLBs may require standards review
- runtime events may require auditability
- learner progress may produce reporting outputs

---

# Runtime Relationship

Future runtime-compatible flow:

1. Learner starts module
2. Execution session is created
3. SLB activity begins
4. Lesson events are recorded
5. Assessment events are recorded
6. Evidence is submitted
7. Competency state is updated
8. Remediation is triggered where needed
9. Reassessment is recorded
10. Verification/governance event is recorded
11. Reports are generated

---

# Standards Relationship

Every major entity should remain standards-ready:

- programme
- module
- SLB
- lesson
- assessment
- evidence
- remediation

Each should be able to reference:
- outcomes
- assessment criteria
- notional hours
- proposed credits
- NQF level consideration
- SAQA/SETA relevance
- international standard relevance

---

# Platform Relationship

Where the academy teaches Sentry Sound Platform operations, entities may link to:

- platform module
- platform workflow
- platform metadata field
- platform compliance process
- platform evidence object
- platform status
- platform governance rule

This keeps training aligned to the real SaaS system.

---

# Architecture Boundary

This is a relationship map only.

Do not create database tables yet unless required.

Backend changes should only be recommended when critical.

---

# Current Status

Academy Entity Relationship Map V1 is locked.

Next step:
Define the Academy Programme Structure V1.
