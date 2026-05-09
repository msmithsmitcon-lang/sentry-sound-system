import {
  resolveDispatchSchedule
} from "@/lib/submission-dispatch/resolveDispatchSchedule"

function assert(
  condition: boolean,
  message: string
) {
  if (!condition) {
    throw new Error(message)
  }
}

const immediate =
  resolveDispatchSchedule({
    regulator: "SAMRO"
  })

assert(
  immediate.reason ===
    "Immediate dispatch schedule applied",
  "immediate schedule reason failed"
)

const requested =
  resolveDispatchSchedule({
    regulator: "SAMRO",
    requestedAt:
      "2026-05-10T08:00:00.000Z"
  })

assert(
  requested.scheduledAt ===
    "2026-05-10T08:00:00.000Z",
  "requested schedule date failed"
)

console.log(
  "Dispatch scheduling tests passed"
)
