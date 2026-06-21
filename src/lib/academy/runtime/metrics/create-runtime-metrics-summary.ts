import { RuntimeMetricsSummary }
from "./runtime-metrics-summary"

export function createRuntimeMetricsSummary(
  programmeId: string
): RuntimeMetricsSummary {

  return {
    programmeId,

    totalSessions: 0,

    competencyAchievedCount: 0,

    remediationTriggeredCount: 0,

    workflowConfusionCount: 0,

    terminologyConfusionCount: 0,

    roleConfusionCount: 0,

    completionRate: 0,

    updatedAt: new Date().toISOString(),
  }
}
