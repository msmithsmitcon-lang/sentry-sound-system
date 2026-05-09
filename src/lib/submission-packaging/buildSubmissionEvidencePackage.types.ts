export interface SubmissionPackagingEvidenceItem {
  evidenceId: string
  documentType: string
}

export interface SubmissionEvidencePackage {
  generatedAt: string

  evidenceCount: number

  evidence: SubmissionPackagingEvidenceItem[]
}
