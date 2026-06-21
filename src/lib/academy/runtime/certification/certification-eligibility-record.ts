export interface CertificationEligibilityRecord {
  learnerId: string

  programmeId: string

  modulesCompleted: string[]

  competencyRequirementsMet: boolean

  evidenceRequirementsMet: boolean

  remediationOutstanding: boolean

  eligible: boolean

  evaluatedAt: string
}
