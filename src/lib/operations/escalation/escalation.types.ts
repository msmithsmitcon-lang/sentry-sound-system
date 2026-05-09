export type EscalationSeverity =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL"

export type EscalationTriggerType =
  | "ALERT"
  | "INCIDENT"
  | "SLA_BREACH"
  | "DISPATCH_FAILURE"

export type EscalationLifecycleState =
  | "OPEN"
  | "ACKNOWLEDGED"
  | "IN_PROGRESS"
  | "ESCALATED"
  | "RESOLVED"
  | "CLOSED"

export interface EscalationPolicy {
  id: string
  code: string

  triggerType: EscalationTriggerType

  severity: EscalationSeverity

  failureThreshold: number

  escalationWindowMinutes: number

  notifyRoles: string[]

  isActive: boolean
}

export interface EscalationResolutionInput {
  triggerType: EscalationTriggerType

  currentFailureCount: number

  unresolvedMinutes: number
}

export interface EscalationResolutionResult {
  shouldEscalate: boolean

  matchedPolicy?: EscalationPolicy

  resolvedSeverity?: EscalationSeverity

  lifecycleState: EscalationLifecycleState

  reasons: string[]
}
