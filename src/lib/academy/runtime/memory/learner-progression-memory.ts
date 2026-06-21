export interface LearnerProgressionMemory {
  learnerId: string

  completedSlbs: string[]

  remediationHistory: {
    slbId: string
    trigger: string
    timestamp: string
  }[]

  competencyHistory: {
    slbId: string
    competencyAchieved: boolean
    timestamp: string
  }[]

  lastActiveSlbId?: string

  updatedAt: string
}
