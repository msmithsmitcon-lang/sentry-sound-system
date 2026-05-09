import {
  validateDispatchTransition
} from "@/lib/submission-dispatch/validateDispatchTransition"

function assert(
  condition: boolean,
  message: string
) {
  if (!condition) {
    throw new Error(message)
  }
}

assert(
  validateDispatchTransition({
    currentStatus: "queued",
    nextStatus: "dispatching"
  }) === true,

  "queued -> dispatching should be allowed"
)

assert(
  validateDispatchTransition({
    currentStatus: "sent",
    nextStatus: "queued"
  }) === false,

  "sent -> queued should not be allowed"
)

assert(
  validateDispatchTransition({
    currentStatus: "failed",
    nextStatus: "retrying"
  }) === true,

  "failed -> retrying should be allowed"
)

console.log(
  "Dispatch lifecycle tests passed"
)
