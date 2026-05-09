export type OperationalIncidentSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical"

export type OperationalIncidentStatus =
  | "open"
  | "acknowledged"
  | "resolved"
  | "closed"

export interface CreateOperationalIncidentInput {
  type: string

  severity:
    OperationalIncidentSeverity

  title: string

  description?: string | null

  metadata?:
    Record<string, unknown> | null
}

export interface OperationalIncidentRecord {
  id: string

  type: string

  severity:
    OperationalIncidentSeverity

  status:
    OperationalIncidentStatus

  title: string

  description?: string | null

  metadata?:
    Record<string, unknown> | null

  acknowledgedAt?: Date | null

  resolvedAt?: Date | null

  closedAt?: Date | null

  createdAt: Date

  updatedAt: Date
}
