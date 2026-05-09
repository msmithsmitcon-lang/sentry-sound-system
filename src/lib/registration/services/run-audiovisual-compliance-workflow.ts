import type {
  AudiovisualWork
} from "../contracts/audiovisual-work-contract"

import {
  evaluateAudiovisualReadiness
} from "./evaluate-audiovisual-readiness"

import {
  buildGenericComplianceWorkflowResult
} from "./build-generic-compliance-workflow-result"

export function runAudiovisualComplianceWorkflow(input: {
  work: AudiovisualWork

  uploadedEvidenceTypes?: string[]
}) {

  const readiness =
    evaluateAudiovisualReadiness({
      work: input.work,

      uploadedEvidenceTypes:
        input.uploadedEvidenceTypes
    })

  return buildGenericComplianceWorkflowResult({
    entity: {
      entityType:
        "audiovisual_work",

      entityId:
        input.work.id,

      layer:
        "audiovisual"
    },

    readiness,

    resolvedEntity: {
      id: input.work.id
    }
  })
}
