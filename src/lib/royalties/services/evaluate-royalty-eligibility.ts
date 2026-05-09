export type RoyaltyEligibilityInput = {
  registrationStatus: string

  readinessScore?: number | null

  disputed: boolean

  amendmentRequired: boolean

  crossRightsValid: boolean

  missingEvidenceCount?: number
}

export type RoyaltyEligibilityResult = {
  eligible: boolean

  blockers: string[]

  warnings: string[]
}

export function evaluateRoyaltyEligibility(
  input: RoyaltyEligibilityInput
): RoyaltyEligibilityResult {

  const blockers: string[] = []

  const warnings: string[] = []

  if (
    input.registrationStatus !==
    "ready_for_submission"
  ) {

    blockers.push(
      "Registration status not eligible"
    )
  }

  if (input.disputed) {

    blockers.push(
      "Entity currently disputed"
    )
  }

  if (input.amendmentRequired) {

    blockers.push(
      "Outstanding amendment required"
    )
  }

  if (!input.crossRightsValid) {

    blockers.push(
      "Cross-rights validation failed"
    )
  }

  if (
    typeof input.readinessScore ===
      "number" &&
    input.readinessScore < 80
  ) {

    warnings.push(
      "Low readiness score"
    )
  }

  if (
    (input.missingEvidenceCount ?? 0) > 0
  ) {

    warnings.push(
      "Missing supporting evidence"
    )
  }

  return {
    eligible:
      blockers.length === 0,

    blockers,
    warnings
  }
}
