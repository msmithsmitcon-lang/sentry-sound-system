import type { FinanceCommitment } from "./workspace-finance.types"

export const COMMITMENT_WEIGHTING_SOURCE = "commitment_weighting_v1" as const

export type CommitmentSemanticBand =
  | "low_coordination_impact"
  | "operational_attention"
  | "continuity_pressure"
  | "governance_attention"
  | "credibility_pressure"

export type CommitmentPressureLevel = "none" | "low" | "medium" | "high"

export type CommitmentSustainabilityPosture =
  | "stable"
  | "needs_coordination"
  | "under_pressure"

export type CommitmentReviewPosture =
  | "monitor"
  | "review"
  | "coordinate"
  | "clarify_amount"
  | "resolve"

export type CommitmentOverdueAgeBand =
  | "not_due"
  | "due_soon"
  | "overdue_1_7"
  | "overdue_8_30"
  | "overdue_31_plus"
  | "no_due_date"

export type CommitmentAmountSeverity =
  | "amount_unknown"
  | "low_amount_pressure"
  | "moderate_amount_pressure"
  | "material_amount_pressure"

export type CommitmentAffectedDimensions = {
  sustainability_posture: CommitmentSustainabilityPosture
  operational_pressure: CommitmentPressureLevel
  credibility_pressure: CommitmentPressureLevel
  compliance_pressure: CommitmentPressureLevel
  continuity_pressure: CommitmentPressureLevel
}

export type CommitmentWeighting = {
  commitment_id: string
  semantic_bands: CommitmentSemanticBand[]
  affected_dimensions: CommitmentAffectedDimensions
  overdue_age_band: CommitmentOverdueAgeBand
  amount_severity: CommitmentAmountSeverity
  review_posture: CommitmentReviewPosture
  explanations: string[]
}

export type CommitmentWeightingResponse = {
  success: true
  source: typeof COMMITMENT_WEIGHTING_SOURCE
  mode: "computed_semantic_read_model"
  items: CommitmentWeighting[]
}

export type CommitmentWeightingInput = Pick<
  FinanceCommitment,
  | "id"
  | "amount"
  | "due_date"
  | "status"
  | "priority"
  | "commitment_nature"
  | "commitment_risk_level"
  | "commitment_domain"
  | "industry_body"
  | "commitment_type"
  | "related_module"
  | "related_entity_type"
  | "related_entity_id"
>
