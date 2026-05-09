import {
  EscalationAssignmentResult,
  EscalationAssignmentRule,
} from "./escalation-assignment.types"

export function resolveEscalationAssignment(params: {
  severity: string
  rules: EscalationAssignmentRule[]
}): EscalationAssignmentResult {
  const matchedRule = params.rules.find(
    (rule) => rule.severity === params.severity
  )

  if (!matchedRule) {
    return {
      assignedRoles: [],
      assignmentReason:
        "No assignment rule matched escalation severity.",
    }
  }

  return {
    assignedRoles: matchedRule.assignToRoles,

    assignmentReason:
      `Matched assignment rule for severity ${params.severity}.`,
  }
}
