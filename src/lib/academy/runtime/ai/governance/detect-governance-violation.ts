const FORBIDDEN_RESPONSE_PATTERNS = [
  "ignore previous instructions",
  "bypass governance",
  "disable safety",
  "override policy",
]

export function detectGovernanceViolation(
  response: string
): {
  violation: boolean
  matchedPattern?: string
} {

  const normalized =
    response.toLowerCase()

  for (const pattern of
    FORBIDDEN_RESPONSE_PATTERNS) {

    if (normalized.includes(pattern)) {

      return {
        violation: true,
        matchedPattern: pattern,
      }
    }
  }

  return {
    violation: false,
  }
}
