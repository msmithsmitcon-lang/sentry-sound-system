export interface CompetencyEvaluationResult {
  learnerId: string
  slbId: string

  competencyAchieved: boolean

  passedChecks: string[]
  failedChecks: string[]

  remediationRequired: boolean

  evaluatedAt: string
}
