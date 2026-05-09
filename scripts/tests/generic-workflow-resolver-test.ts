import {
  resolveWorkflowStatus
} from "../../src/lib/registration/services/resolve-workflow-status"

function main() {

  const blocked =
    resolveWorkflowStatus({
      readiness: {
        subjectId: "work_001",
        subjectLayer: "composition",

        ready: false,

        score: 42,

        blockers: [
          {
            ruleId: "split_sheet_missing",
            passed: false,
            severity: "blocker",
            message: "Split sheet missing"
          }
        ],

        warnings: [],
        info: [],

        checkedAt:
          new Date().toISOString()
      }
    })

  console.log("\n=== BLOCKED ===\n")
  console.log(blocked)

  const ready =
    resolveWorkflowStatus({
      readiness: {
        subjectId: "work_002",
        subjectLayer: "composition",

        ready: true,

        score: 100,

        blockers: [],
        warnings: [],
        info: [],

        checkedAt:
          new Date().toISOString()
      }
    })

  console.log("\n=== READY ===\n")
  console.log(ready)

  if (
    blocked.resolvedStatus !==
    "metadata_incomplete"
  ) {
    throw new Error(
      "Expected metadata_incomplete"
    )
  }

  if (
    ready.allowedForSubmission !== true
  ) {
    throw new Error(
      "Expected allowedForSubmission true"
    )
  }

  console.log(
    "\nGeneric workflow resolver test passed.\n"
  )
}

main()
