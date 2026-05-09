import {
  runRecordingComplianceWorkflow
} from "../../src/lib/registration/services/run-recording-compliance-workflow"

function main() {

  const result =
    runRecordingComplianceWorkflow({
      recording: {
        id: "recording_001",

        title:
          "Recording Workflow Test",

        isrc: null,

        masterOwnerId: "label_001",
        masterOwnerName:
          "Test Label",

        documented: true,

        disputed: false,

        amendmentRequired: false,

        performers: [
          {
            performerId:
              "artist_001",

            performerName:
              "Artist One",

            role:
              "featured_artist",

            confirmed: true
          }
        ]
      }
    })

  console.log(
    "\n=== RECORDING WORKFLOW ===\n"
  )

  console.log(
    JSON.stringify(result, null, 2)
  )

  if (
    result.entity.entityType !==
    "recording"
  ) {
    throw new Error(
      "Expected recording entity type"
    )
  }

  if (
    result.workflowResolution
      .allowedForSubmission !== true
  ) {
    throw new Error(
      "Expected allowedForSubmission true"
    )
  }

  console.log(
    "\nRecording compliance workflow test passed.\n"
  )
}

main()
