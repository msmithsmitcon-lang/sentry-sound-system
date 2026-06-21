export interface GovernanceViolationRecord {
  violationId: string

  learnerId?: string

  programmeId?: string
  moduleId?: string
  slbId?: string

  violationType:
    | "scope_violation"
    | "ungoverned_generation"
    | "progression_violation"
    | "telemetry_missing"
    | "remediation_bypass"

  severity:
    | "low"
    | "medium"
    | "high"
    | "critical"

  description: string

  detectedAt: string
}
