import { SLBContract } from "../../slbs/contracts/slb-contract"

export interface SLBRuntimeSession {
  sessionId: string
  learnerId: string
  slbId: string
  currentState: string
  completedStates: string[]
  competencyAchieved: boolean
  remediationRequired: boolean
}

export function createSLBRuntimeSession(
  sessionId: string,
  learnerId: string,
  slb: SLBContract
): SLBRuntimeSession {
  return {
    sessionId,
    learnerId,
    slbId: slb.slbId,
    currentState: slb.runtimeStates[0],
    completedStates: [],
    competencyAchieved: false,
    remediationRequired: false,
  }
}
