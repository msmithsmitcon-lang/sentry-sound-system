export interface RuntimeMetricsSummary {
  programmeId: string

  totalSessions: number

  competencyAchievedCount: number

  remediationTriggeredCount: number

  workflowConfusionCount: number

  terminologyConfusionCount: number

  roleConfusionCount: number

  completionRate: number

  updatedAt: string
}
