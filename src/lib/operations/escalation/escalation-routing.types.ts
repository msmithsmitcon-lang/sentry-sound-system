export type EscalationRouteChannel =
  | "EMAIL"
  | "SMS"
  | "SLACK"
  | "IN_APP"
  | "EXECUTIVE_REPORT"

export interface EscalationRoutingRule {
  severity: string

  channels: EscalationRouteChannel[]
}

export interface EscalationRoutingResult {
  channels: EscalationRouteChannel[]

  routingReason: string
}
