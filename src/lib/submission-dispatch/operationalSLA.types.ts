export interface OperationalSLABreach {
  type: string

  severity:
    | "warning"
    | "critical"

  message: string

  metadata?:
    Record<string, unknown> | null

  detectedAt: string
}
