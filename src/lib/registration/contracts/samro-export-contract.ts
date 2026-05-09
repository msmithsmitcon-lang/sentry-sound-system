export type SamroContributorExport = {
  contributorName: string
  role: string
  ownershipPercentage: number
  ipiNumber?: string
  societyAffiliation?: string
}

export type SamroWorkExportPayload = {
  exportType: "SAMRO_WORK_REGISTRATION"

  work: {
    workId: string
    title: string
    iswc?: string
    language?: string
  }

  contributors: SamroContributorExport[]

  evidence: {
    evidenceId: string
    evidenceType: string
    title: string
    verificationStatus: string
  }[]

  readinessScore?: number

  generatedAt: string
  generatedBy?: string
}
