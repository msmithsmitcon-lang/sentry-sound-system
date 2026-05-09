export interface ResolveDispatchScheduleInput {
  requestedAt?: string | null

  regulator?: string | null

  metadata?:
    Record<string, unknown> | null
}

export interface ResolvedDispatchSchedule {
  scheduledAt: string

  reason: string

  regulator?: string | null
}
