export interface CompetencyCheckpoint {
  checkpointId: string

  slbId: string

  competencyTarget: string

  required: boolean

  validationType:
    | "question"
    | "scenario"
    | "workflow_sequence"
    | "terminology_validation"
}
