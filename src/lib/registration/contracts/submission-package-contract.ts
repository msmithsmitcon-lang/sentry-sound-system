export type SubmissionPackageEntity = {
  entityType: string
  entityId: string
  title: string
}

export type SubmissionPackageEvidence = {
  evidenceId: string
  evidenceType: string
  title: string
  verificationStatus: string
}

export type SubmissionPackage = {
  submissionType: string

  entity: SubmissionPackageEntity

  includedEvidence:
    SubmissionPackageEvidence[]

  generatedAt: string

  generatedBy?: string

  readinessScore?: number

  warnings: string[]

  blockers: string[]

  exportFormat?: string
}
