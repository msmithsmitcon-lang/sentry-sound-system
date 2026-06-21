import { SLBInteractionStep }
from "./slb-interaction-step"

export const SLB_01_01_INTERACTIONS:
SLBInteractionStep[] = [

  {
    stepId: "intro-01",

    runtimeState: "orientation",

    interactionType: "message",

    prompt:
      "The modern music industry is an ecosystem involving creators, businesses, platforms, rights, and audiences.",

    competencyTargets: [
      "ecosystem awareness",
    ],

    telemetryEvent: "interaction_started",
  },

  {
    stepId: "diagnostic-01",

    runtimeState: "diagnostic",

    interactionType: "question",

    prompt:
      "Who do you think helps music reach streaming platforms like Spotify?",

    competencyTargets: [
      "role awareness",
    ],

    telemetryEvent: "diagnostic_response",
  },

  {
    stepId: "workflow-01",

    runtimeState: "guided_interaction",

    interactionType: "scenario",

    prompt:
      "A song is created and recorded. What usually happens before audiences can stream it online?",

    competencyTargets: [
      "workflow awareness",
    ],

    telemetryEvent: "workflow_sequence_attempt",
  },

  {
    stepId: "validation-01",

    runtimeState: "competency_validation",

    interactionType: "validation",

    prompt:
      "Explain the difference between a music creator and a streaming platform.",

    competencyTargets: [
      "role awareness",
      "operational awareness",
    ],

    telemetryEvent: "competency_validated",
  },
]
