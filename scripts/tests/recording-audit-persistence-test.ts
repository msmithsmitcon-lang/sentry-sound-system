import {
  createRecording
} from "../../src/lib/registration/repositories/recording-repository"

import {
  createRecordingAuditEvent
} from "../../src/lib/registration/repositories/recording-audit-repository"

import {
  getAuditEventsForEntity
} from "../../src/lib/registration/repositories/registration-audit-repository"

async function main() {

  const recording =
    await createRecording({
      title:
        "Recording Audit Test",

      isrc:
        "ZATEST2600002",

      status:
        "draft",

      masterOwnerId:
        "label_001",

      masterOwnerName:
        "Test Label",

      documented: true
    })

  await createRecordingAuditEvent({
    recordingId:
      recording.id,

    eventType:
      "performer.added",

    performedBy:
      "recording_admin",

    reason:
      "Featured performer declared",

    metadata: {
      performerId:
        "artist_001",

      role:
        "featured_artist"
    }
  })

  const events =
    await getAuditEventsForEntity({
      entityType:
        "recording",

      entityId:
        recording.id
    })

  console.log(
    "\n=== RECORDING AUDIT EVENTS ===\n"
  )

  console.log(
    JSON.stringify(events, null, 2)
  )

  if (events.length !== 1) {
    throw new Error(
      "Expected one audit event"
    )
  }

  if (
    events[0].eventType !==
    "performer.added"
  ) {
    throw new Error(
      "Expected performer.added"
    )
  }

  console.log(
    "\nRecording audit persistence test passed.\n"
  )
}

main()
