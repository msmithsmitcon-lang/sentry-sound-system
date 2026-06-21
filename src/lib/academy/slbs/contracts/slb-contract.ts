export interface SLBContract {
  slbId: string
  programmeId: string
  moduleId: string

  title: string
  description: string

  competencyTargets: string[]

  runtimeStates: string[]

  telemetryEvents: string[]

  remediationTriggers: string[]

  evidenceTypes: string[]

  progressionRules: {
    remediationRequired: boolean
    competencyValidationRequired: boolean
    deterministicProgression: boolean
  }

  governance: {
    aiMediated: boolean
    telemetryAware: boolean
    remediationAware: boolean
    runtimeCompatible: boolean
    standardsReady: boolean
  }
}
