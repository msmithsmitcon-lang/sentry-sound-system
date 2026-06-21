import { SLBContract } from "./slb-contract"

export const SLB_01_01: SLBContract = {
  slbId: "SLB-01.01",
  programmeId: "PROGRAMME-01",
  moduleId: "MODULE-01",

  title: "Introduction to the Modern Music Industry",

  description:
    "Foundational ecosystem awareness of the modern music industry.",

  competencyTargets: [
    "role awareness",
    "workflow awareness",
    "terminology awareness",
    "operational awareness",
  ],

  runtimeStates: [
    "orientation",
    "diagnostic",
    "guided_interaction",
    "competency_validation",
    "remediation",
    "completion",
  ],

  telemetryEvents: [
    "interaction_started",
    "misconception_detected",
    "remediation_triggered",
    "competency_validated",
    "slb_completed",
  ],

  remediationTriggers: [
    "workflow_confusion",
    "role_confusion",
    "terminology_confusion",
  ],

  evidenceTypes: [
    "workflow_sequencing",
    "role_mapping",
    "terminology_validation",
  ],

  progressionRules: {
    remediationRequired: true,
    competencyValidationRequired: true,
    deterministicProgression: true,
  },

  governance: {
    aiMediated: true,
    telemetryAware: true,
    remediationAware: true,
    runtimeCompatible: true,
    standardsReady: true,
  },
}
