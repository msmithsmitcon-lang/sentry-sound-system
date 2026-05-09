import {
  ResolveDispatchScheduleInput,
  ResolvedDispatchSchedule
} from "./dispatchScheduling.types"

export function resolveDispatchSchedule(
  input: ResolveDispatchScheduleInput
): ResolvedDispatchSchedule {

  const scheduledDate =
    input.requestedAt
      ? new Date(input.requestedAt)
      : new Date()

  return {
    scheduledAt:
      scheduledDate.toISOString(),

    reason:
      input.requestedAt
        ? "Requested schedule applied"
        : "Immediate dispatch schedule applied",

    regulator:
      input.regulator
  }
}
