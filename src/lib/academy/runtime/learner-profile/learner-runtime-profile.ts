export interface LearnerRuntimeProfile {
  learnerId: string

  activeProgrammeId?: string

  competencySummary: {
    completedSlbs: number
    remediationCount: number
    competencyAchievedCount: number
  }

  telemetryProfile: {
    workflowConfusionCount: number
    terminologyConfusionCount: number
    roleConfusionCount: number
    retryCount: number
  }

  progressionProfile: {
    currentModuleId?: string
    currentSlbId?: string
    lastCompletedSlbId?: string
  }

  updatedAt: string
}
