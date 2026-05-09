import { validateEscalationTransition } from "./escalation-lifecycle.engine"

const allowed = validateEscalationTransition({
  currentState: "OPEN",
  nextState: "ACKNOWLEDGED",
})

if (!allowed.isAllowed) {
  throw new Error("Expected OPEN ? ACKNOWLEDGED to be allowed.")
}

const blocked = validateEscalationTransition({
  currentState: "CLOSED",
  nextState: "ESCALATED",
})

if (blocked.isAllowed) {
  throw new Error("Expected CLOSED ? ESCALATED to be blocked.")
}

console.log("Escalation Lifecycle Governance V1 test passed", {
  allowed,
  blocked,
})
