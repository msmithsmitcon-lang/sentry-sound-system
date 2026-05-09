export type EscalationProvider =
  | "SENDGRID"
  | "AWS_SES"
  | "TWILIO"
  | "SLACK"

export interface EscalationProviderRule {
  channel: string

  preferredProviders: EscalationProvider[]
}

export interface EscalationProviderResolutionResult {
  selectedProvider?: EscalationProvider

  fallbackProviders: EscalationProvider[]

  resolutionReason: string
}
