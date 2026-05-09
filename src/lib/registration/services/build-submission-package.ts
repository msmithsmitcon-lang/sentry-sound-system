import type {
  SubmissionPackage
} from "../contracts/submission-package-contract"

export function buildSubmissionPackage(input: {
  submissionType: string

  entity: {
    entityType: string
    entityId: string
    title: string
  }

  includedEvidence: {
    evidenceId: string
    evidenceType: string
    title: string
    verificationStatus: string
  }[]

  readinessScore?: number

  warnings?: string[]

  blockers?: string[]

  exportFormat?: string

  generatedBy?: string
}): SubmissionPackage {

  return {
    submissionType:
      input.submissionType,

    entity:
      input.entity,

    includedEvidence:
      input.includedEvidence,

    generatedAt:
      new Date().toISOString(),

    generatedBy:
      input.generatedBy,

    readinessScore:
      input.readinessScore,

    warnings:
      input.warnings ?? [],

    blockers:
      input.blockers ?? [],

    exportFormat:
      input.exportFormat
  }
}
