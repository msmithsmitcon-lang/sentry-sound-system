# Sentry Sound Website Content V1

## 1. Purpose

This document is the canonical messaging source for the public Sentry Sound website layer.

The website layer explains the business, the music-industry problems, the value proposition, the broader ecosystem, and the route toward SaaS entry. It is separate from the SaaS operational platform itself.

## 2. Website Architecture

Sentry Sound has three product layers:

1. Website layer
   - Explains the business, problems, value proposition, ecosystem, and capabilities.
   - Builds trust and conviction.
   - Guides users toward trial, login, plans, contact, or demo.
2. SaaS entry / conversion layer
   - Handles Start Free Trial, login, and low-friction handoff into the SaaS platform.
   - A dedicated `/start`, `/trial`, or `/get-started` route can be created later.
3. SaaS operational platform
   - Handles onboarding, workspace activation, dashboard, workflows, and operational management.

Current implementation uses `/landing` as the public website home and `/landing/start` as the temporary SaaS entry handoff page.

## 3. Core Positioning

Primary positioning:

The platform that keeps music operations organized.

Core value:

Sentry Sound helps organizations understand what is complete, what is missing, what is blocked, what needs attention, and what can safely happen next.

Expanded positioning:

Sentry Sound is an intelligent operational workspace for music operations and music rights. It helps artists, producers, studios, labels, publishers, managers, rights administrators, and operations teams bring songs, contributors, splits, files, evidence, workflow status, and next steps into one clearer working environment.

## 4. Tone Guidance

The website should feel operational, intelligent, organized, modern, scalable, enterprise-ready, approachable, practical, calm, and commercially believable.

Avoid flashy music-app aesthetics, cyberpunk or gaming style, exaggerated AI claims, startup buzzword overload, internal/backend terminology, legal overclaiming, automatic regulator claims, and automatic royalty claims.

Use plain terms such as organized operations, readiness, visibility, workflow, contributors, files, evidence, submissions, missing information, blocked items, next steps, and operational clarity.

Avoid internal terms such as orchestration, operational graph, entitlement systems, readiness aggregation, lifecycle abstraction, and mutation engines.

## 5. CTA Wording

Primary CTA: Start Free Trial

Secondary CTA: View Plans

Header CTA: Login

Contact/demo CTA: Request Demo

Temporary routing:

- Start Free Trial routes to `/landing/start`.
- Login routes to `/sign-in`.
- View Plans routes to `/landing/pricing`.
- Request Demo routes to `/landing/contact`.

## 6. Home Page Messaging

Purpose:

Main positioning, ecosystem introduction, CTA entry point.

Hero headline:

The platform that keeps music operations organized.

Hero supporting copy:

Sentry Sound helps artists, producers, studios, labels, publishers, managers, and rights teams keep songs, contributors, splits, files, evidence, workflow status, and next steps in one clear workspace.

Value proposition:

Move from scattered admin to operational clarity. See what is complete, what is missing, what is blocked, and what needs attention before work slows down.

Problem statements:

- Music operations are spread across spreadsheets, folders, emails, chats, and disconnected systems.
- Contributor details, splits, and evidence often become unclear when teams need them most.
- Submission and rights preparation slows down when readiness, blockers, and files are not visible.

Home sections:

- Hero and dashboard-style preview
- Problem statements
- Complete / missing / blocked visibility
- Platform capability overview
- Ecosystem preview
- CTA path to plans, trial, and demo

## 7. About Page Messaging

Purpose:

Explain who Sentry Sound is, why it exists, and what industry problem is being solved.

Core message:

Music operations should not depend on scattered files, disconnected tools, and memory. Sentry Sound exists to bring structure, visibility, and operational confidence to the work behind music rights, submissions, evidence, and future royalty operations.

Key points:

- The music business has many practical workflow gaps.
- Teams need to know what exists, what is missing, what is blocked, and what can happen next.
- Sentry Sound is built around operational clarity, not flashy dashboards or fake status.

## 8. Platform Page Messaging

Purpose:

Explain platform capabilities in plain English.

Capabilities:

- Songs and works
- Contributors and splits
- Files and evidence
- Readiness and blockers
- Submissions preparation
- Dashboard visibility
- Activity and accountability
- Future finance, royalty, reporting, and enterprise oversight

Boundary:

The page may explain future direction, but must not imply automatic industry-body submission, automatic royalty collection, or production automation that is not active.

## 9. Solutions / Service Offerings Messaging

Purpose:

Explain who the platform is for.

Audience sections:

- Artists & Producers: organize songs, collaborators, files, evidence, and progress.
- Labels & Publishers: create a clearer operating layer for catalogue work and team coordination.
- Rights Administrators: prepare rights data and identify missing information.
- Studios & Teams: keep project files, song context, contributors, and next steps easier to follow.
- Enterprise Operations: build toward governance, oversight, reporting, controlled access, and scalable operations.

## 10. Technology & Intelligence Messaging

Purpose:

Explain intelligent operational visibility without overpromising AI.

Core message:

Sentry Sound is designed to make operational state visible. It helps teams see readiness, gaps, blockers, activity, and next steps so work can move with less confusion.

Use claims such as:

- Track readiness and missing information.
- Highlight blocked items.
- Organize contributors, files, evidence, and workflow status.
- Keep activity and accountability visible.
- Prepare for more structured workflows later.

Avoid claims such as fully automated industry submission, AI making rights decisions, guaranteed royalty recovery, and automatic legal verification.

## 11. Ecosystem / Partners Messaging

Purpose:

Explain the broader ecosystem in grounded commercial language.

Ecosystem entries:

- Plexicon: strategic operational logic and structured systems thinking that supports future platform intelligence.
- Sentry Sound Academy: training, enablement, and industry education aligned with the platform's operational approach.
- StudyEdge: structured learning and support systems that can inform broader education and onboarding experiences.

Positioning:

The ecosystem gives Sentry Sound a wider base than a single SaaS tool: operational software, structured learning, training, and proprietary process logic can reinforce each other over time.

## 12. Pricing / Plans Messaging

Purpose:

Present trial direction, SaaS plans, operational scaling, and enterprise direction.

Plans may be shown conceptually:

- Test / Demo
- Artist Starter
- Artist Pro
- Producer / Studio
- Label / Publisher
- Enterprise / Admin Company

Boundary:

Pricing and billing are not active production billing until a payment provider and subscription flow are approved.

## 13. Contact / Demo Messaging

Purpose:

Allow business users to ask for sales contact, demo support, partnership discussions, and general inquiries.

Recommended sections:

- Request demo
- Contact sales
- Business inquiries
- Support contact

If no production form backend exists, the page should present clear contact intent and mark form handling as a future connection point.

## 14. SaaS Entry Handoff Messaging

Purpose:

Transition users from website interest into Start Free Trial, Login, and operational onboarding.

Core message:

Start with a workspace, enter quickly, configure gradually, and use guided setup inside the product as operations grow.

Deferred dependencies:

- Clerk email activation
- MFA enforcement
- real billing/payment provider
- production entitlement enforcement
- production RBAC enforcement
- invite email delivery
- production dashboard metrics
- production onboarding gates
- enterprise workflow automation

These must not block website execution.
