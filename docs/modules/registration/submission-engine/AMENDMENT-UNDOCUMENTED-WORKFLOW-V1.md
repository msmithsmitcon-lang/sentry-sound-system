
# Amendment + Undocumented Workflow V1

## Purpose

This layer manages regulator-driven remediation after a submission receives a negative or incomplete operational response.

## Supported Remediation Types

- amendment_required
- undocumented
- evidence_required
- metadata_correction_required
- ownership_correction_required

## Completed Capabilities

- creates undocumented remediation cases automatically
- creates amendment remediation cases automatically
- reuses existing open remediation cases
- blocks royalty eligibility when remediation is open
- preserves regulator response metadata
- supports cashflow-risk escalation

## Royalty Eligibility Bridge

Open remediation cases with:

blocksRoyaltyEligibility = true

prevent the submission from being treated as royalty eligible.

## Current Lifecycle

Regulator Response
? Queue Status Update
? Remediation Case
? Royalty Eligibility Block Evaluation

## Strategic Importance

This layer connects compliance state to future payout governance.

It is foundational for:

- payout blocking
- evidence workflows
- resubmission workflows
- dispute remediation
- forensic royalty reconciliation
- cashflow-risk reporting

## Next Recommended Phase

Evidence Vault V1.

