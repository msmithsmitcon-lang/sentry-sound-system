export interface StandardsMapping {
  mappingId: string

  programmeId: string
  moduleId: string
  slbId: string

  framework:
    | "SAQA"
    | "SETA"
    | "QCTO"
    | "INTERNAL"

  competencyTargets: string[]

  evidenceTypes: string[]

  assessmentRequirements: string[]

  remediationSupported: boolean

  telemetryTraceable: boolean
}
