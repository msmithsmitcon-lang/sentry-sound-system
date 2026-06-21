import { LearnerProgressionMemory }
from "./learner-progression-memory"

export function recordCompletedSlb(
  memory: LearnerProgressionMemory,
  slbId: string
): LearnerProgressionMemory {

  return {
    ...memory,

    completedSlbs: [
      ...new Set([
        ...memory.completedSlbs,
        slbId,
      ]),
    ],

    lastActiveSlbId: slbId,

    updatedAt: new Date().toISOString(),
  }
}
