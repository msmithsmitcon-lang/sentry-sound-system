export interface SLBInteractionStep {
  stepId: string

  runtimeState:
    | "orientation"
    | "diagnostic"
    | "guided_interaction"
    | "competency_validation"
    | "remediation"
    | "completion"

  interactionType:
    | "message"
    | "question"
    | "scenario"
    | "validation"

  prompt: string

  competencyTargets: string[]

  telemetryEvent?: string
}
