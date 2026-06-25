export interface AssessmentItem {
  assessmentId: string

  slbId: string

  competencyTarget: string

  assessmentType:
    | "workflow_sequence"
    | "role_mapping"
    | "terminology_validation"
    | "scenario_response"

  prompt: string

  passingCriteria: string[]
}
