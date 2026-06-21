import { ProgressionDecision }
from "./progression-decision"

export function createProgressionDecision(
  payload: ProgressionDecision
): ProgressionDecision {

  return {
    ...payload,
    decidedAt: new Date().toISOString(),
  }
}
