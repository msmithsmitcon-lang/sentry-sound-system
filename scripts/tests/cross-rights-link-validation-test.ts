import {
  validateCrossRightsLinks
} from "../../src/lib/registration/services/validate-cross-rights-links"

function main() {
  const blocked = validateCrossRightsLinks({
    audiovisualWorkId: "av_001"
  })

  const warningOnly = validateCrossRightsLinks({
    recordingId: "recording_001"
  })

  const valid = validateCrossRightsLinks({
    musicalWorkId: "work_001",
    recordingId: "recording_001",
    audiovisualWorkId: "av_001"
  })

  console.log("\n=== CROSS-RIGHTS LINK VALIDATION ===\n")
  console.log("Blocked:")
  console.log(blocked)
  console.log("\nWarning only:")
  console.log(warningOnly)
  console.log("\nValid:")
  console.log(valid)

  if (blocked.valid !== false) {
    throw new Error("Expected blocked validation")
  }

  if (warningOnly.valid !== true) {
    throw new Error("Expected warning-only validation to remain valid")
  }

  if (valid.valid !== true || valid.warnings.length !== 0) {
    throw new Error("Expected full chain to be valid")
  }

  console.log("\nCross-rights link validation test passed.\n")
}

main()
