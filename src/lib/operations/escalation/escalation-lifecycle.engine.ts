import { EscalationLifecycleState } from "./escalation.types"

const ALLOWED_TRANSITIONS: Record<
  EscalationLifecycleState,
  EscalationLifecycleState[]
> = {
  OPEN: [
    "ACKNOWLEDGED",
    "ESCALATED",
    "RESOLVED",
  ],

  ACKNOWLEDGED: [
    "IN_PROGRESS",
    "ESCALATED",
    "RESOLVED",
  ],

  IN_PROGRESS: [
    "ESCALATED",
    "RESOLVED",
  ],

  ESCALATED: [
    "IN_PROGRESS",
    "RESOLVED",
    "CLOSED",
  ],

  RESOLVED: [
    "CLOSED",
  ],

  CLOSED: [],
}

export function validateEscalationTransition(params: {
  currentState: EscalationLifecycleState
  nextState: EscalationLifecycleState
}) {
  const allowedTransitions =
    ALLOWED_TRANSITIONS[params.currentState]

  const isAllowed =
    allowedTransitions.includes(params.nextState)

  return {
    isAllowed,

    allowedTransitions,

    currentState: params.currentState,

    nextState: params.nextState,
  }
}
