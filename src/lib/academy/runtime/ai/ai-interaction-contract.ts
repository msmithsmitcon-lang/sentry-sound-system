export interface AIInteractionContract {
  interactionId: string

  slbId: string

  runtimeState: string

  interactionType:
    | "orientation"
    | "diagnostic"
    | "guided_interaction"
    | "validation"
    | "remediation"

  competencyTargets: string[]

  telemetryEnabled: boolean

  remediationAware: boolean

  deterministic: boolean

  governanceBoundaries: string[]
}
