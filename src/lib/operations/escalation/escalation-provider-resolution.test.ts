import { resolveEscalationProvider } from "./escalation-provider-resolution.engine"
import { EscalationProviderRule } from "./escalation-provider-resolution.types"

const rules: EscalationProviderRule[] = [
  {
    channel: "EMAIL",
    preferredProviders: ["SENDGRID", "AWS_SES"],
  },
  {
    channel: "SMS",
    preferredProviders: ["TWILIO"],
  },
  {
    channel: "SLACK",
    preferredProviders: ["SLACK"],
  },
]

const result = resolveEscalationProvider({
  channel: "EMAIL",
  rules,
})

if (result.selectedProvider !== "SENDGRID") {
  throw new Error("Expected SENDGRID as selected provider.")
}

if (!result.fallbackProviders.includes("AWS_SES")) {
  throw new Error("Expected AWS_SES as fallback provider.")
}

console.log("Escalation Provider Resolution V1 test passed", result)
