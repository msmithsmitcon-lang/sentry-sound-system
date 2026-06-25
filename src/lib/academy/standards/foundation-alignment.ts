import { StandardsMapping }
from "./standards-mapping"

export const FOUNDATION_ALIGNMENT:
StandardsMapping = {

  mappingId: "FOUNDATION-MAP-01",

  programmeId: "PROGRAMME-01",
  moduleId: "MODULE-01",
  slbId: "SLB-01.01",

  framework: "INTERNAL",

  competencyTargets: [
    "workflow awareness",
    "role awareness",
    "terminology awareness",
  ],

  evidenceTypes: [
    "workflow_sequencing",
    "role_mapping",
    "terminology_validation",
  ],

  assessmentRequirements: [
    "competency validation required",
    "remediation before progression",
  ],

  remediationSupported: true,

  telemetryTraceable: true,
}
