import { evaluateEscalationProviderHealth } from "./escalation-provider-health.engine"

const healthy = evaluateEscalationProviderHealth({
  provider: "SENDGRID",
  status: "HEALTHY",
  lastCheckedAt: new Date(),
})

if (!healthy.isHealthy) {
  throw new Error("Expected SENDGRID to be healthy.")
}

const degraded = evaluateEscalationProviderHealth({
  provider: "AWS_SES",
  status: "DEGRADED",
  lastCheckedAt: new Date(),
})

if (degraded.isHealthy) {
  throw new Error("Expected AWS_SES to be unhealthy.")
}

console.log("Escalation Provider Health Governance V1 test passed", {
  healthy,
  degraded,
})
