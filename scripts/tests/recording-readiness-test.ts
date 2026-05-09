import {
  evaluateRecordingReadiness
} from "../../src/lib/registration/services/evaluate-recording-readiness"

function main() {
  const result = evaluateRecordingReadiness({
    recording: {
      id: "recording_001",
      title: "Recording Readiness Test",
      isrc: null,
      masterOwnerId: "owner_001",
      masterOwnerName: "Test Label",
      documented: true,
      disputed: false,
      amendmentRequired: false,
      performers: [
        {
          performerId: "performer_001",
          performerName: "Artist One",
          role: "featured_artist",
          confirmed: true
        }
      ]
    }
  })

  console.log("\n=== RECORDING READINESS TEST ===\n")
  console.log(JSON.stringify(result, null, 2))

  if (result.ready !== true) {
    throw new Error("Expected recording readiness to pass with warning")
  }

  if (result.warnings.length !== 1) {
    throw new Error("Expected one ISRC warning")
  }

  console.log("\nRecording readiness test passed.\n")
}

main()
