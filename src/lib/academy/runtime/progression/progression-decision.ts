export interface ProgressionDecision {
  learnerId: string

  programmeId: string
  moduleId: string
  slbId: string

  competencyAchieved: boolean

  remediationRequired: boolean

  nextAction:
    | "advance"
    | "remediate"
    | "retry"
    | "block"

  nextSlbId?: string

  decidedAt: string
}
