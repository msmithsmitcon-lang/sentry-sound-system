import { validateRegistrationStatusTransition } from "../../src/lib/registration/services/validate-registration-status-transition"

const allowed = validateRegistrationStatusTransition({
  from: "ready_for_submission",
  to: "submitted"
})

const blocked = validateRegistrationStatusTransition({
  from: "draft",
  to: "registered"
})

console.log("\n=== REGISTRATION STATUS TRANSITION TEST ===\n")
console.log("Allowed transition:")
console.log(JSON.stringify(allowed, null, 2))

console.log("\nBlocked transition:")
console.log(JSON.stringify(blocked, null, 2))

if (allowed.valid !== true) {
  throw new Error("Expected ready_for_submission -> submitted to be valid")
}

if (blocked.valid !== false) {
  throw new Error("Expected draft -> registered to be invalid")
}

console.log("\nRegistration status transition test passed.\n")
