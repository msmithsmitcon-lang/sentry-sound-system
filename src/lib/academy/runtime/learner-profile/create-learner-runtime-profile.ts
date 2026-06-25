import { LearnerRuntimeProfile }
from "./learner-runtime-profile"

export function createLearnerRuntimeProfile(
  learnerId: string
): LearnerRuntimeProfile {

  return {
    learnerId,

    competencySummary: {
      completedSlbs: 0,
      remediationCount: 0,
      competencyAchievedCount: 0,
    },

    telemetryProfile: {
      workflowConfusionCount: 0,
      terminologyConfusionCount: 0,
      roleConfusionCount: 0,
      retryCount: 0,
    },

    progressionProfile: {},

    updatedAt: new Date().toISOString(),
  }
}
