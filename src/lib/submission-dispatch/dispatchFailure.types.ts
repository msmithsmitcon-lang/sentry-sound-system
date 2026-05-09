export interface FailDispatchInput {
  dispatchId: string

  reason: string
}

export interface RetryDispatchInput {
  dispatchId: string
}

export interface DispatchFailureResult {
  dispatchId: string

  status:
    | "failed"
    | "retrying"

  retryCount: number

  reason: string

  updatedAt: string
}
