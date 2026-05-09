import {
  createRecording,
  getRecordingById,
  addRecordingPerformer,
  updateRecordingStatus,
  updateRecordingReadiness
} from "../../src/lib/registration/repositories/recording-repository"

async function main() {
  const recording = await createRecording({
    title: "Recording Persistence Test",
    isrc: "ZATEST2600001",
    status: "draft",
    masterOwnerId: "label_001",
    masterOwnerName: "Test Label",
    documented: true
  })

  await addRecordingPerformer({
    recordingId: recording.id,
    performerId: "artist_001",
    performerName: "Artist One",
    role: "featured_artist",
    confirmed: true
  })

  await updateRecordingStatus({
    id: recording.id,
    status: "ready_for_submission"
  })

  await updateRecordingReadiness({
    id: recording.id,
    readinessScore: 90
  })

  const fetched = await getRecordingById(recording.id)

  console.log("\n=== RECORDING ===\n")
  console.log(JSON.stringify(fetched, null, 2))

  if (!fetched) throw new Error("Expected fetched recording")
  if (fetched.status !== "ready_for_submission") throw new Error("Expected updated status")
  if (fetched.readinessScore !== 90) throw new Error("Expected readiness score 90")
  if (fetched.performers.length !== 1) throw new Error("Expected one performer")

  console.log("\nRecording persistence test passed.\n")
}

main()
