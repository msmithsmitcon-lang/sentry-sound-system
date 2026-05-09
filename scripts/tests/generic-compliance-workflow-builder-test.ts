import {
  buildGenericComplianceWorkflowResult
} from "../../src/lib/registration/services/build-generic-compliance-workflow-result"

function main() {

  const result =
    buildGenericComplianceWorkflowResult({
      entity: {
        entityType: "recording",
        entityId: "rec_001",
        layer: "recording"
      },

      readiness: {
        subjectId: "rec_001",
        subjectLayer: "recording",

        ready: true,

        score: 96,

        blockers: [],
        warnings: [],
        info: [],

        checkedAt:
          new Date().toISOString()
      },

      resolvedEntity: {
        id: "rec_001",
        status: "ready_for_submission"
      }
    })

  console.log(
    "\n=== GENERIC WORKFLOW RESULT ===\n"
  )

  console.log(result)

  if (
    result.workflowResolution
      .allowedForSubmission !== true
  ) {
    throw new Error(
      "Expected allowedForSubmission true"
    )
  }

  if (
    result.entity.entityType !==
    "recording"
  ) {
    throw new Error(
      "Expected recording entity type"
    )
  }

  console.log(
    "\nGeneric workflow builder test passed.\n"
  )
}

main()
