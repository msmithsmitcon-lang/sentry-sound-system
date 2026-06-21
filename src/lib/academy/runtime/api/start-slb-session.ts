export interface StartSLBSessionRequest {
  learnerId: string

  programmeId: string
  moduleId: string
  slbId: string
}

export interface StartSLBSessionResponse {
  sessionId: string

  currentState: string

  competencyState: string
}
