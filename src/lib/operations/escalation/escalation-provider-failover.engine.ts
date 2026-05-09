import {
  EscalationProviderFailoverInput,
  EscalationProviderFailoverResult,
} from "./escalation-provider-failover.types"

export function resolveEscalationProviderFailover(
  input: EscalationProviderFailoverInput
): EscalationProviderFailoverResult {
  if (
    input.selectedProvider &&
    !input.unhealthyProviders.includes(input.selectedProvider)
  ) {
    return {
      finalProvider: input.selectedProvider,
      failoverOccurred: false,
      failoverReason:
        `Primary provider ${input.selectedProvider} is healthy.`,
    }
  }

  const fallbackProvider = input.fallbackProviders.find(
    (provider) =>
      !input.unhealthyProviders.includes(provider)
  )

  if (!fallbackProvider) {
    return {
      failoverOccurred: true,
      failoverReason:
        "No healthy fallback providers available.",
    }
  }

  return {
    finalProvider: fallbackProvider,
    failoverOccurred: true,
    failoverReason:
      `Failover selected provider ${fallbackProvider}.`,
  }
}
