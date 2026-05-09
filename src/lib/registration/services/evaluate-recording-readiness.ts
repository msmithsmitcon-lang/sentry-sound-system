import type {
  RecordingReadinessInput
} from "../contracts/recording-readiness-contract"

import type {
  RegistrationReadinessResult,
  RegistrationReadinessRuleResult
} from "../contracts/readiness-rule-contract"

export function evaluateRecordingReadiness(input: {
  recording: RecordingReadinessInput

  uploadedEvidenceTypes?: string[]
}): RegistrationReadinessResult {

  const blockers:
    RegistrationReadinessRuleResult[] = []

  const warnings:
    RegistrationReadinessRuleResult[] = []

  if (!input.recording.documented) {

    blockers.push({
      ruleId: "recording-undocumented",

      passed: false,

      severity: "blocker",

      message:
        "Recording documentation incomplete"
    })
  }

  if (
    input.recording.performers.length === 0
  ) {

    blockers.push({
      ruleId: "missing-performers",

      passed: false,

      severity: "blocker",

      message:
        "No performers declared"
    })
  }

  if (!input.recording.isrc) {

    warnings.push({
      ruleId: "missing-isrc",

      passed: false,

      severity: "warning",

      message:
        "ISRC not assigned"
    })
  }

  if (input.recording.disputed) {

    blockers.push({
      ruleId: "recording-disputed",

      passed: false,

      severity: "blocker",

      message:
        "Recording currently disputed"
    })
  }

  const score =
    Math.max(
      0,
      100 -
      (blockers.length * 30) -
      (warnings.length * 10)
    )

  return {
    subjectId: input.recording.id,

    subjectLayer: "recording",

    ready: blockers.length === 0,

    score,

    blockers,
    warnings,

    info: [],

    checkedAt:
      new Date().toISOString()
  }
}
