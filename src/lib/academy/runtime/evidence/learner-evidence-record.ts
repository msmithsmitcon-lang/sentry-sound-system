export interface LearnerEvidenceRecord {
  evidenceId: string

  learnerId: string

  programmeId: string
  moduleId: string
  slbId: string

  evidenceType: string

  competencyTarget: string

  passed: boolean

  submittedAt: string

  metadata?: Record<string, any>
}
