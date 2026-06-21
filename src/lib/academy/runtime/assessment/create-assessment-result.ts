import { AssessmentResult }
from "./assessment-result"

export function createAssessmentResult(
  payload: AssessmentResult
): AssessmentResult {

  return {
    ...payload,
    evaluatedAt: new Date().toISOString(),
  }
}
