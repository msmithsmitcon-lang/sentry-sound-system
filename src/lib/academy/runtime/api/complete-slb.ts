export interface CompleteSLBRequest {
  sessionId: string

  learnerId: string

  slbId: string
}

export interface CompleteSLBResponse {
  completed: boolean

  competencyAchieved: boolean

  remediationRequired: boolean
}
