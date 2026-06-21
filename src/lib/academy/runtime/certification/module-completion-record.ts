export interface ModuleCompletionRecord {
  learnerId: string

  programmeId: string
  moduleId: string

  completedSlbs: string[]

  competencyAchieved: boolean

  remediationOutstanding: boolean

  eligibleForCompletion: boolean

  completedAt?: string
}
