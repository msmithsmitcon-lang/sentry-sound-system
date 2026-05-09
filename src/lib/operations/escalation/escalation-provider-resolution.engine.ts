import {
  EscalationProviderRule,
  EscalationProviderResolutionResult,
} from "./escalation-provider-resolution.types"

export function resolveEscalationProvider(params: {
  channel: string
  rules: EscalationProviderRule[]
}): EscalationProviderResolutionResult {
  const matchedRule = params.rules.find(
    (rule) => rule.channel === params.channel
  )

  if (!matchedRule) {
    return {
      fallbackProviders: [],
      resolutionReason:
        "No provider rule matched notification channel.",
    }
  }

  const [selectedProvider, ...fallbackProviders] =
    matchedRule.preferredProviders

  return {
    selectedProvider,

    fallbackProviders,

    resolutionReason:
      `Matched provider rule for channel ${params.channel}.`,
  }
}
