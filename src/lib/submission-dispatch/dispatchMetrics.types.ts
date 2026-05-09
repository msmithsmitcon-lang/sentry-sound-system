export interface DispatchMetricsSnapshot {
  queued: number

  scheduled: number

  dispatching: number

  sent: number

  failed: number

  retrying: number

  cancelled: number

  total: number

  generatedAt: string
}
