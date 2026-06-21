export interface LearnerCompetencyState {
  learnerId: string

  programmeId: string
  moduleId: string
  slbId: string

  competencyState:
    | "not_started"
    | "in_progress"
    | "remediation_required"
    | "competency_achieved"
    | "completed"

  remediationHistory: string[]

  completedStates: string[]

  telemetrySummary: {
    misconceptionsDetected: number
    remediationCount: number
    retryCount: number
  }

  updatedAt: string
}
