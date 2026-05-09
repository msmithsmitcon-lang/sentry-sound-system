import { resolveEscalationAssignment } from "./escalation-assignment.engine"
import { EscalationAssignmentRule } from "./escalation-assignment.types"

const rules: EscalationAssignmentRule[] = [
  {
    severity: "HIGH",
    assignToRoles: ["OPERATIONS_LEAD", "COMPLIANCE_OFFICER"],
  },
  {
    severity: "CRITICAL",
    assignToRoles: ["OPERATIONS_LEAD", "COMPLIANCE_OFFICER", "WORKSPACE_OWNER"],
  },
]

const result = resolveEscalationAssignment({
  severity: "HIGH",
  rules,
})

if (result.assignedRoles.length !== 2) {
  throw new Error("Expected HIGH escalation to assign 2 roles.")
}

if (!result.assignedRoles.includes("OPERATIONS_LEAD")) {
  throw new Error("Expected OPERATIONS_LEAD assignment.")
}

console.log("Escalation Assignment Governance V1 test passed", result)
