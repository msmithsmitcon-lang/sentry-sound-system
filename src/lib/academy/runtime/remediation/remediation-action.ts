export interface RemediationAction {
  trigger: string

  remediationType:
    | "guided_reinforcement"
    | "simplified_explanation"
    | "retry_validation"
    | "step_by_step_breakdown"

  message: string
}
