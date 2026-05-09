export interface ExecuteDispatchInput {
  dispatchId: string
}

export interface ExecuteDispatchResult {
  dispatchId: string

  success: boolean

  finalStatus:
    | "sent"
    | "failed"

  executedAt: string

  message: string
}
