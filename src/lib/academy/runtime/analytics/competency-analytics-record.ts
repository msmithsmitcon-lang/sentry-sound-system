export interface CompetencyAnalyticsRecord {
  programmeId: string
  moduleId: string
  slbId: string

  competencyTarget: string

  totalAttempts: number

  passedCount: number

  failedCount: number

  remediationCount: number

  successRate: number

  updatedAt: string
}
