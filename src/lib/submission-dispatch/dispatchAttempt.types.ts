export interface CreateDispatchAttemptInput {
  dispatchId: string

  attemptNumber: number

  status:
    | "started"
    | "succeeded"
    | "failed"

  message?: string | null

  regulatorResponse?:
    Record<string, unknown> | null

  metadata?:
    Record<string, unknown> | null
}
