import { LearnerCompetencyState }
from "./learner-competency-state"

export function createLearnerCompetencyState(
  learnerId: string,
  programmeId: string,
  moduleId: string,
  slbId: string
): LearnerCompetencyState {

  return {
    learnerId,

    programmeId,
    moduleId,
    slbId,

    competencyState: "not_started",

    remediationHistory: [],

    completedStates: [],

    telemetrySummary: {
      misconceptionsDetected: 0,
      remediationCount: 0,
      retryCount: 0,
    },

    updatedAt: new Date().toISOString(),
  }
}
