import { RuntimeInteractionSession }
from "./runtime-interaction-session"

import { createTelemetryEvent }
from "../telemetry/create-telemetry-event"

export function trackInteractionStep(
  learnerId: string,
  slbId: string,
  session: RuntimeInteractionSession
) {

  if (!session.activeStep) {
    return null
  }

  return createTelemetryEvent({
    eventId: crypto.randomUUID(),

    learnerId,

    slbId,

    sessionId: session.sessionId,

    eventType:
      session.activeStep.telemetryEvent ||
      "interaction_completed",

    runtimeState:
      session.activeStep.runtimeState,

    metadata: {
      interactionType:
        session.activeStep.interactionType,

      competencyTargets:
        session.activeStep.competencyTargets,
    },
  })
}
