import { validateRuntimeHealth } from "../../src/lib/academy/runtime/testing/validate-runtime-health"

const health = validateRuntimeHealth()

console.log(JSON.stringify({
  success: true,
  health,
}, null, 2))
