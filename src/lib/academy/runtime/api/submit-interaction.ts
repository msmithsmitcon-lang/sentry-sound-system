export interface SubmitInteractionRequest {
  sessionId: string

  learnerId: string

  slbId: string

  runtimeState: string

  response: unknown
}

export interface SubmitInteractionResponse {
  competencyState: string

  remediationRequired: boolean

  nextState: string
}
