export interface AssessmentResult {
  learnerId: string

  assessmentId: string
  slbId: string

  passed: boolean

  score: number

  remediationRequired: boolean

  evaluatedAt: string
}
