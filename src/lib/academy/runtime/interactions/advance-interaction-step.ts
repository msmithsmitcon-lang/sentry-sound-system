import { RuntimeInteractionSession }
from "./runtime-interaction-session"

import { SLBInteractionStep }
from "../../slbs/interactions/slb-interaction-step"

export function advanceInteractionStep(
  session: RuntimeInteractionSession,
  interactions: SLBInteractionStep[]
): RuntimeInteractionSession {

  const nextIndex =
    session.currentStepIndex + 1

  return {
    ...session,

    currentStepIndex: nextIndex,

    completedSteps: [
      ...session.completedSteps,
      session.activeStep?.stepId || "",
    ],

    activeStep: interactions[nextIndex],
  }
}
