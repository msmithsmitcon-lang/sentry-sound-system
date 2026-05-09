import { resolveEscalationProviderFailover } from "./escalation-provider-failover.engine"

const primaryHealthy = resolveEscalationProviderFailover({
  selectedProvider: "SENDGRID",
  fallbackProviders: ["AWS_SES"],
  unhealthyProviders: [],
})

if (primaryHealthy.finalProvider !== "SENDGRID") {
  throw new Error("Expected SENDGRID to remain selected.")
}

if (primaryHealthy.failoverOccurred) {
  throw new Error("Expected no failover when primary is healthy.")
}

const primaryUnhealthy = resolveEscalationProviderFailover({
  selectedProvider: "SENDGRID",
  fallbackProviders: ["AWS_SES"],
  unhealthyProviders: ["SENDGRID"],
})

if (primaryUnhealthy.finalProvider !== "AWS_SES") {
  throw new Error("Expected failover to AWS_SES.")
}

if (!primaryUnhealthy.failoverOccurred) {
  throw new Error("Expected failover to occur.")
}

console.log("Escalation Provider Failover Governance V1 test passed", {
  primaryHealthy,
  primaryUnhealthy,
})
