export interface RecoverableRuntimeSession {
  sessionId: string

  learnerId: string

  slbId: string

  currentState: string

  currentStepId?: string

  resumable: boolean

  interrupted: boolean

  lastInteractionAt?: string

  recoveredAt?: string
}
