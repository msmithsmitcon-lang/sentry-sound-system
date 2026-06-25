export interface SLBRegistryItem {
  slbId: string

  programmeId: string
  moduleId: string

  title: string

  competencyLevel: "foundation"

  telemetryAware: boolean
  remediationAware: boolean
  runtimeCompatible: boolean
}
