import {
  evaluateAudiovisualReadiness
} from "../../src/lib/registration/services/evaluate-audiovisual-readiness"

function main() {

  const result =
    evaluateAudiovisualReadiness({
      work: {
        id: "av_001",

        title:
          "Music Video Readiness Test",

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
    "\n=== AUDIOVISUAL READINESS ===\n"
  )

  console.log(
    JSON.stringify(result, null, 2)
  )

  if (result.ready !== true) {
    throw new Error(
      "Expected audiovisual readiness to pass"
    )
  }

  if (result.warnings.length !== 1) {
    throw new Error(
      "Expected deposit warning"
    )
  }

  console.log(
    "\nAudiovisual readiness test passed.\n"
  )
}

main()
