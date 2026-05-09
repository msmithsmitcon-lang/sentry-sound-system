import type { RegistrationLayer } from "../types/registration-layer"
import type { ReadinessSeverity } from "../types/readiness-severity"
import type { EvidenceType } from "../types/evidence-type"

export type ReadinessRule = {
  id: string
  name: string
  appliesTo: RegistrationLayer
  severity: ReadinessSeverity
  conditionKey: string
  failureMessage: string
  requiredFix: string
  requiredEvidence?: EvidenceType[]
  downstreamImpact: string
}

export type ReadinessCheckResult = {
  ruleId: string
  passed: boolean
  severity: ReadinessSeverity
  message: string
  requiredFix?: string
  requiredEvidence?: EvidenceType[]
}

export type RegistrationReadinessResult = {
  subjectId: string
  subjectLayer: RegistrationLayer
  ready: boolean
  score: number
  blockers: ReadinessCheckResult[]
  warnings: ReadinessCheckResult[]
  info: ReadinessCheckResult[]
  checkedAt: string
}
