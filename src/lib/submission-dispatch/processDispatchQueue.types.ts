export interface ProcessDispatchQueueInput {
  limit?: number
}

export interface ProcessDispatchQueueResult {
  processed: number

  sent: number

  failed: number

  skipped: number

  processedAt: string
}
