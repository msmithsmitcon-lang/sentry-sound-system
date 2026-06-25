import { GovernanceViolationRecord }
from "./governance-violation-record"

export function createGovernanceViolation(
  payload: GovernanceViolationRecord
): GovernanceViolationRecord {

  return {
    ...payload,
    detectedAt: new Date().toISOString(),
  }
}
