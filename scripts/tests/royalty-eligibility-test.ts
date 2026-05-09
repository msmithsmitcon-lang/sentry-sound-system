import {
  evaluateRoyaltyEligibility
} from "../../src/lib/royalties/services/evaluate-royalty-eligibility"

function main() {

  const blocked =
    evaluateRoyaltyEligibility({
      registrationStatus:
        "metadata_incomplete",

      readinessScore: 45,

      disputed: true,

      amendmentRequired: true,

      crossRightsValid: false,

      missingEvidenceCount: 2
    })

  const eligible =
    evaluateRoyaltyEligibility({
      registrationStatus:
        "ready_for_submission",

      readinessScore: 95,

      disputed: false,

      amendmentRequired: false,

      crossRightsValid: true,

      missingEvidenceCount: 0
    })

  console.log(
    "\n=== BLOCKED ELIGIBILITY ===\n"
  )

  console.log(blocked)

  console.log(
    "\n=== ELIGIBLE ===\n"
  )

  console.log(eligible)

  if (blocked.eligible !== false) {
    throw new Error(
      "Expected blocked eligibility"
    )
  }

  if (eligible.eligible !== true) {
    throw new Error(
      "Expected eligible result"
    )
  }

  console.log(
    "\nRoyalty eligibility test passed.\n"
  )
}

main()
