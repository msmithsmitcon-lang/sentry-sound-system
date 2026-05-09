import {
  createRegistrationAuditEventRecord
} from "./registration-audit-repository"

export async function createRecordingAuditEvent(input: {
  recordingId: string

  eventType: string

  performedBy?: string

  reason?: string

  metadata?: Record<string, unknown>
}) {

  return createRegistrationAuditEventRecord({
    eventType:
      input.eventType,

    entityType:
      "recording",

    entityId:
      input.recordingId,

    performedBy:
      input.performedBy,

    reason:
      input.reason,

    metadata:
      input.metadata,

    recordingId:
      input.recordingId
  })
}
