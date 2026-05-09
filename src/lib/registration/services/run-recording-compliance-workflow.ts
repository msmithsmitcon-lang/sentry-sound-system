import {
  evaluateRecordingReadiness
} from "./evaluate-recording-readiness"

import {
  buildGenericComplianceWorkflowResult
} from "./build-generic-compliance-workflow-result"

export function runRecordingComplianceWorkflow(input: {
  recording: {
    id: string

    title: string

    isrc?: string | null

    masterOwnerId: string
    masterOwnerName: string

    performers: {
      performerId: string
      performerName: string

      role: string

      participationPercentage?: number

      confirmed: boolean
    }[]

    documented: boolean

    disputed: boolean

    amendmentRequired: boolean
  }

  uploadedEvidenceTypes?: string[]
}) {

  const readiness =
    evaluateRecordingReadiness({
      recording: input.recording,

      uploadedEvidenceTypes:
        input.uploadedEvidenceTypes
    })

  return buildGenericComplianceWorkflowResult({
    entity: {
      entityType: "recording",

      entityId: input.recording.id,

      layer: "recording"
    },

    readiness,

    resolvedEntity: {
      id: input.recording.id
    }
  })
}
