import { CompetencyAnalyticsRecord }
from "./competency-analytics-record"

export function createCompetencyAnalyticsRecord(
  programmeId: string,
  moduleId: string,
  slbId: string,
  competencyTarget: string
): CompetencyAnalyticsRecord {

  return {
    programmeId,
    moduleId,
    slbId,

    competencyTarget,

    totalAttempts: 0,

    passedCount: 0,

    failedCount: 0,

    remediationCount: 0,

    successRate: 0,

    updatedAt: new Date().toISOString(),
  }
}
