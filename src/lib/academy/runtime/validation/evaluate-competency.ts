import { CompetencyCheck } from "./competency-check"
import { CompetencyEvaluationResult } from "./competency-evaluation-result"

export function evaluateCompetency(
  learnerId: string,
  slbId: string,
  checks: CompetencyCheck[]
): CompetencyEvaluationResult {

  const passedChecks = checks
    .filter((c) => c.passed)
    .map((c) => c.checkId)

  const failedChecks = checks
    .filter((c) => !c.passed)
    .map((c) => c.checkId)

  const competencyAchieved = failedChecks.length === 0

  return {
    learnerId,
    slbId,

    competencyAchieved,

    passedChecks,
    failedChecks,

    remediationRequired: !competencyAchieved,

    evaluatedAt: new Date().toISOString(),
  }
}
