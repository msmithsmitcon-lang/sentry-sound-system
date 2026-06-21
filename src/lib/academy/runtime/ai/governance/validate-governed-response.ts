import { detectGovernanceViolation }
from "./detect-governance-violation"

export function validateGovernedResponse(
  response: string
) {

  const result =
    detectGovernanceViolation(
      response
    )

  return {
    approved: !result.violation,

    violation:
      result.matchedPattern,
  }
}
