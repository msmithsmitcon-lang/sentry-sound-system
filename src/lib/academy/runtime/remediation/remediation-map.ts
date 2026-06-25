import { RemediationAction } from "./remediation-action"

export const REMEDIATION_MAP: Record<string, RemediationAction> = {
  workflow_confusion: {
    trigger: "workflow_confusion",
    remediationType: "step_by_step_breakdown",
    message:
      "Replay simplified workflow sequence with guided explanation.",
  },

  role_confusion: {
    trigger: "role_confusion",
    remediationType: "guided_reinforcement",
    message:
      "Reinforce ecosystem participant roles with comparison examples.",
  },

  terminology_confusion: {
    trigger: "terminology_confusion",
    remediationType: "simplified_explanation",
    message:
      "Provide simplified terminology clarification and contextual usage.",
  },

  ownership_confusion: {
    trigger: "ownership_confusion",
    remediationType: "guided_reinforcement",
    message:
      "Clarify simplified ownership distinctions.",
  },

  low_confidence: {
    trigger: "low_confidence",
    remediationType: "guided_reinforcement",
    message:
      "Provide learner reassurance and slower guided progression.",
  },
}
