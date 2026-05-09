import {
  buildSamroWorkExportPayload
} from "../../src/lib/registration/services/build-samro-work-export-payload"

function main() {

  const payload =
    buildSamroWorkExportPayload({
      workId: "work_001",

      title:
        "SAMRO Export Test",

      iswc:
        "T-123.456.789-0",

      language:
        "English",

      contributors: [
        {
          contributorName:
            "Composer One",

          role:
            "composer",

          ownershipPercentage:
            50,

          ipiNumber:
            "IPI123456",

          societyAffiliation:
            "SAMRO"
        },

        {
          contributorName:
            "Composer Two",

          role:
            "author",

          ownershipPercentage:
            50,

          societyAffiliation:
            "SAMRO"
        }
      ],

      evidence: [
        {
          evidenceId:
            "evidence_001",

          evidenceType:
            "split_sheet",

          title:
            "Signed Split Sheet",

          verificationStatus:
            "verified"
        }
      ],

      readinessScore: 98,

      generatedBy:
        "samro_export_engine"
    })

  console.log(
    "\n=== SAMRO EXPORT PAYLOAD ===\n"
  )

  console.log(
    JSON.stringify(payload, null, 2)
  )

  if (
    payload.contributors.length !== 2
  ) {
    throw new Error(
      "Expected two contributors"
    )
  }

  if (
    payload.exportType !==
    "SAMRO_WORK_REGISTRATION"
  ) {
    throw new Error(
      "Expected SAMRO export type"
    )
  }

  console.log(
    "\nSAMRO export payload test passed.\n"
  )
}

main()
