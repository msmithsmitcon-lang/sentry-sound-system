import {
  runAudiovisualComplianceWorkflow
} from "../../src/lib/registration/services/run-audiovisual-compliance-workflow"

function main() {

  const result =
    runAudiovisualComplianceWorkflow({
      work: {
        id: "av_001",

        title:
          "Music Video Workflow Test",

        status:
          "draft",

        linkedRecordingId:
          "recording_001",

        linkedMusicalWorkId:
          "work_001",

        productionCompanyId:
          "prod_001",

        productionCompanyName:
          "Test Productions",

        directorName:
          "Director One",

        documented: true,

        disputed: false,

        amendmentRequired: false,

        cueSheetRequired: true,
        cueSheetProvided: true,

        depositRequired: true,
        depositCertificateProvided: false,

        participants: [
          {
            participantId:
              "director_001",

            participantName:
              "Director One",

            role:
              "director",

            confirmed: true
          }
        ],

        createdAt:
          new Date().toISOString(),

        updatedAt:
          new Date().toISOString()
      }
    })

  console.log(
    "\n=== AUDIOVISUAL WORKFLOW ===\n"
  )

  console.log(
    JSON.stringify(result, null, 2)
  )

  if (
    result.entity.entityType !==
    "audiovisual_work"
  ) {
    throw new Error(
      "Expected audiovisual_work entity type"
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
    "\nAudiovisual compliance workflow test passed.\n"
  )
}

main()
