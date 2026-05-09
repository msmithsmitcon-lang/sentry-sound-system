export interface EscalationProviderFailoverInput {
  selectedProvider?: string

  fallbackProviders: string[]

  unhealthyProviders: string[]
}

export interface EscalationProviderFailoverResult {
  finalProvider?: string

  failoverOccurred: boolean

  failoverReason: string
}
