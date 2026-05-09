export interface SubmissionManifestItem {
  evidenceId: string
  documentType: string
}

export interface SubmissionManifest {
  manifestId: string

  generatedAt: string

  regulator: string

  evidenceCount: number

  evidence:
    SubmissionManifestItem[]
}
