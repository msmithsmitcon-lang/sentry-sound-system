import { SLBInteractionStep }
from "../../slbs/interactions/slb-interaction-step"

import { RuntimeInteractionSession }
from "./runtime-interaction-session"

export function createInteractionSession(
  sessionId: string,
  slbId: string,
  interactions: SLBInteractionStep[]
): RuntimeInteractionSession {

  return {
    sessionId,

    slbId,

    currentStepIndex: 0,

    completedSteps: [],

    activeStep: interactions[0],
  }
}
