export type EscalationAssignmentRole =
  | "OPERATIONS_LEAD"
  | "COMPLIANCE_OFFICER"
  | "WORKSPACE_OWNER"
  | "FINANCE_MANAGER"
  | "REGULATORY_MANAGER"

export interface EscalationAssignmentRule {
  severity: string

  assignToRoles: EscalationAssignmentRole[]
}

export interface EscalationAssignmentResult {
  assignedRoles: EscalationAssignmentRole[]

  assignmentReason: string
}
