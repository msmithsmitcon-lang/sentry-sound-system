import { LearnerProgressionMemory }
from "./learner-progression-memory"

export function createLearnerProgressionMemory(
  learnerId: string
): LearnerProgressionMemory {

  return {
    learnerId,

    completedSlbs: [],

    remediationHistory: [],

    competencyHistory: [],

    updatedAt: new Date().toISOString(),
  }
}
