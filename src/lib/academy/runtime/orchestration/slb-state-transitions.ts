import { SLBRuntimeSession } from "./slb-runtime-session"

export function advanceRuntimeState(
  session: SLBRuntimeSession,
  nextState: string
): SLBRuntimeSession {
  return {
    ...session,
    currentState: nextState,
    completedStates: Array.from(
      new Set([...session.completedStates, session.currentState])
    ),
  }
}

export function markRemediationRequired(
  session: SLBRuntimeSession
): SLBRuntimeSession {
  return {
    ...session,
    remediationRequired: true,
    currentState: "remediation",
  }
}

export function markCompetencyAchieved(
  session: SLBRuntimeSession
): SLBRuntimeSession {
  return {
    ...session,
    competencyAchieved: true,
    remediationRequired: false,
    currentState: "completion",
  }
}
