# Commitment Weighting V1

## Current Status

Commitment Weighting V1 is stabilized and complete for now.

The layer has been defined, built, tested, stabilized, and documented. Future operational chain reasoning must not be merged into this layer.

## Purpose

Commitment Weighting V1 translates each finance commitment from a dated financial item into an explainable operational responsibility.

It helps Sentry Sound explain why a commitment matters, what it affects, what kind of coordination pressure it creates, how due or overdue status changes meaning, and what calm review posture is appropriate.

## Strategic Principle

The objective is operational sustainability, financial credibility, and enterprise viability. Commitment Weighting V1 must not become a fear dashboard, punitive scoring system, opaque risk engine, credit score, or AI financial judgment.

The system should help creative enterprises see fragmented obligations before they become invisible operational pressure.

## What V1 Does

V1 is a computed semantic read model. It uses existing commitment fields:

- `commitment_domain`
- `commitment_type`
- `commitment_nature`
- `commitment_risk_level`
- `status`
- `priority`
- `due_date`
- `amount`
- `industry_body`
- `related_module`
- `related_entity_type`
- `related_entity_id`

It returns semantic bands, affected dimensions, overdue aging, amount severity, review posture, and explanation bullets.

## What V1 Does Not Do

V1 does not implement ROI ratios, output conversion scoring, forecasting, AI advice, credit or fundability scoring, budget engine, reserve allocation, bank or cash logic, numerical scores, payout automation, legal/accounting/tax advice, or opaque prioritization.

## Semantic Bands

- `low_coordination_impact`: optional, low-risk, or non-blocking commitment.
- `operational_attention`: needs normal workflow follow-up.
- `continuity_pressure`: may affect operations, production, release, tools, infrastructure, or delivery.
- `governance_attention`: relates to compliance, tax, legal, statutory, or formal business duties.
- `credibility_pressure`: may affect contributor trust, supplier reliability, funding readiness, partner trust, or institutional confidence.

A commitment can have more than one band.

## Affected Dimensions

V1 computes:

- `sustainability_posture`: `stable`, `needs_coordination`, or `under_pressure`.
- `operational_pressure`: `none`, `low`, `medium`, or `high`.
- `credibility_pressure`: `none`, `low`, `medium`, or `high`.
- `compliance_pressure`: `none`, `low`, `medium`, or `high`.
- `continuity_pressure`: `none`, `low`, `medium`, or `high`.

These are semantic dimensions, not credit ratings or financial scores.

## Review Postures

- `monitor`: keep visible.
- `review`: check the commitment and keep it on the operating radar.
- `coordinate`: align people, date, amount, or workflow context.
- `clarify_amount`: amount is unknown and needs clarification.
- `resolve`: the item has stronger consequence or age and should be resolved.

Review posture is guidance language. It is not an automated decision.

## Overdue Aging

V1 computes:

- `no_due_date`
- `not_due`
- `due_soon`
- `overdue_1_7`
- `overdue_8_30`
- `overdue_31_plus`

Overdue behavior is contextual. Optional overdue work is not treated the same as SARS, CIPC, contributor, legal, or release-blocking obligations.

## Amount Severity

V1 computes:

- `amount_unknown`
- `low_amount_pressure`
- `moderate_amount_pressure`
- `material_amount_pressure`

Amount severity is deliberately simple in V1 because there is no authoritative cash, bank, budget, or forecast truth. Small amounts can still have high consequence, and large amounts can remain optional.

Unknown amount is treated as a clarification need, not as zero impact.

## Explanation Philosophy

Every weighting result should explain why the commitment matters in plain language.

Example explanations:

- This is a tax commitment, so it affects compliance discipline.
- This is a compliance commitment, so it affects governance readiness.
- This relates to contributors or contractors, so it affects trust and coordination.
- This supports production activity, so it may affect delivery continuity.
- Amount needs clarification.

Language must remain calm, operational, and non-punitive.

## Test Harness

The DB-free semantic test harness is:

`temp/verify-commitment-weighting.ts`

Run:

```powershell
cmd /c npx tsx temp/verify-commitment-weighting.ts
```

Focused lint:

```powershell
cmd /c npx eslint temp/verify-commitment-weighting.ts src/lib/finance-v1/workspace-commitment-weighting-service.ts src/lib/finance-v1/workspace-commitment-weighting.types.ts app/api/finance/v1/commitments/weighting/route.ts
```

## Scenarios Covered

Phase 1 scenarios:

- optional low-risk overdue commitment
- mandatory tax/compliance overdue commitment
- contributor obligation overdue
- production/studio commitment due soon
- software infrastructure renewal overdue
- unknown amount commitment
- high-value optional commitment
- release marketing commitment linked to release/project
- legal governance commitment
- finance funding commitment

Phase 2 scenarios:

- small CIPC commitment overdue
- SAMRO admin due soon
- small contributor payment overdue
- large optional marketing spend not due
- studio appointment due today
- one-song release workflow commitment
- mandatory tax with no amount
- review-later software renewal
- optional overdue 31+ item
- legal dispute resolution critical

## Future-Chain Reasoning Note

Commitment Weighting V1 supports future operational dependency reasoning, but it does not yet perform chain reasoning across artist, project, release, receivable, and obligation dependencies.

Example future chain:

Artist signed -> lyrics needed -> beat needed -> studio recording session -> mixing/mastering -> release readiness -> royalty/revenue expectation.

V1 can understand the individual commitments in that chain. It cannot yet understand whether one action unlocks another, whether an uncertain receivable should influence timing, or whether a production commitment has converted into useful output.

Future required layers:

- workflow dependency graph
- output dependency mapping
- receivable certainty/uncertainty
- project/release linkage
- action-to-output linkage
- operational viability reasoning layer

## Future Layers Not Yet Implemented

Not implemented yet:

- operational conversion layer
- action-to-output ROI logic
- chain-level reasoning
- receivable certainty modeling
- project/release dependency graph
- forecasting
- AI financial coach
- prioritization engine
- reserve allocation engine
- bank/cash integration
