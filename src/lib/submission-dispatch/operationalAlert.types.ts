export type OperationalAlertSeverity =
  | "info"
  | "warning"
  | "critical"

export interface OperationalAlert {
  type: string

  severity:
    OperationalAlertSeverity

  message: string

  metadata?:
    Record<string, unknown> | null

  createdAt: string
}
