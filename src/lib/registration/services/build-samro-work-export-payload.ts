import type {
  SamroWorkExportPayload
} from "../contracts/samro-export-contract"

export function buildSamroWorkExportPayload(input: {
  workId: string
  title: string
  iswc?: string
  language?: string

  contributors: {
    contributorName: string
    role: string
    ownershipPercentage: number
    ipiNumber?: string
    societyAffiliation?: string
  }[]

  evidence: {
    evidenceId: string
    evidenceType: string
    title: string
    verificationStatus: string
  }[]

  readinessScore?: number
  generatedBy?: string
}): SamroWorkExportPayload {
  return {
    exportType: "SAMRO_WORK_REGISTRATION",

    work: {
      workId: input.workId,
      title: input.title,
      iswc: input.iswc,
      language: input.language
    },

    contributors: input.contributors,

    evidence: input.evidence,

    readinessScore: input.readinessScore,

    generatedAt: new Date().toISOString(),

    generatedBy: input.generatedBy
  }
}
