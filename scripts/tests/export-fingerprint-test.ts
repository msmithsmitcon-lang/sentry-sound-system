import {
  buildSamroWorkExportPayload
} from "../../src/lib/registration/services/build-samro-work-export-payload"

import {
  generateExportFingerprint
} from "../../src/lib/registration/services/generate-export-fingerprint"

function main() {

  const payload =
    buildSamroWorkExportPayload({
      workId: "work_001",

      title:
        "Fingerprint Test",

      contributors: [
        {
          contributorName:
            "Composer One",

          role:
            "composer",

          ownershipPercentage:
            100
        }
      ],

      evidence: [],

      generatedBy:
        "fingerprint_test"
    })

  const fingerprintA =
    generateExportFingerprint(payload)

  const fingerprintB =
    generateExportFingerprint(payload)

  console.log(
    "\n=== EXPORT FINGERPRINT A ===\n"
  )

  console.log(fingerprintA)

  console.log(
    "\n=== EXPORT FINGERPRINT B ===\n"
  )

  console.log(fingerprintB)

  if (
    fingerprintA.fingerprint !==
    fingerprintB.fingerprint
  ) {
    throw new Error(
      "Expected deterministic fingerprints"
    )
  }

  console.log(
    "\nExport fingerprint test passed.\n"
  )
}

main()
