import { RuntimeInteractionSession }
from "./runtime-interaction-session"

export function routeToRemediation(
  session: RuntimeInteractionSession
): RuntimeInteractionSession {

  return {
    ...session,

    activeStep: {
      stepId: "remediation-step",

      runtimeState: "remediation",

      interactionType: "message",

      prompt:
        "Let's slow down and work through this step-by-step.",

      competencyTargets: [
        "guided reinforcement",
      ],
    },
  }
}
