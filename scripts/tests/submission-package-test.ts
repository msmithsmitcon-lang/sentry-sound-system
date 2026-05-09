import {
  buildSubmissionPackage
} from "../../src/lib/registration/services/build-submission-package"

function main() {

  const submissionPackage =
    buildSubmissionPackage({
      submissionType:
        "SAMRO_WORK_REGISTRATION",

      entity: {
        entityType:
          "musical_work",

        entityId:
          "work_001",

        title:
          "Submission Packaging Test"
      },

      includedEvidence: [
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

      readinessScore: 95,

      warnings: [],

      blockers: [],

      exportFormat:
        "json",

      generatedBy:
        "submission_engine"
    })

  console.log(
    "\n=== SUBMISSION PACKAGE ===\n"
  )

  console.log(
    JSON.stringify(
      submissionPackage,
      null,
      2
    )
  )

  if (
    submissionPackage
      .includedEvidence.length !== 1
  ) {
    throw new Error(
      "Expected one evidence record"
    )
  }

  if (
    submissionPackage
      .submissionType !==
    "SAMRO_WORK_REGISTRATION"
  ) {
    throw new Error(
      "Expected SAMRO package"
    )
  }

  console.log(
    "\nSubmission package test passed.\n"
  )
}

main()
