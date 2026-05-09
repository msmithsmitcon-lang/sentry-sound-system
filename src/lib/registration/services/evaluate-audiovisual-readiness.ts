import type {
  AudiovisualWork
} from "../contracts/audiovisual-work-contract"

import type {
  RegistrationReadinessResult,
  RegistrationReadinessRuleResult
} from "../contracts/readiness-rule-contract"

export function evaluateAudiovisualReadiness(input: {
  work: AudiovisualWork

  uploadedEvidenceTypes?: string[]
}): RegistrationReadinessResult {

  const blockers:
    RegistrationReadinessRuleResult[] = []

  const warnings:
    RegistrationReadinessRuleResult[] = []

  if (!input.work.documented) {

    blockers.push({
      ruleId:
        "audiovisual-undocumented",

      passed: false,

      severity: "blocker",

      message:
        "Audiovisual documentation incomplete"
    })
  }

  if (
    input.work.participants.length === 0
  ) {

    blockers.push({
      ruleId:
        "missing-participants",

      passed: false,

      severity: "blocker",

      message:
        "No audiovisual participants declared"
    })
  }

  if (
    input.work.cueSheetRequired &&
    !input.work.cueSheetProvided
  ) {

    blockers.push({
      ruleId:
        "missing-cue-sheet",

      passed: false,

      severity: "blocker",

      message:
        "Cue sheet required but not provided"
    })
  }

  if (
    input.work.depositRequired &&
    !input.work.depositCertificateProvided
  ) {

    warnings.push({
      ruleId:
        "missing-deposit-certificate",

      passed: false,

      severity: "warning",

      message:
        "Deposit certificate not yet provided"
    })
  }

  if (input.work.disputed) {

    blockers.push({
      ruleId:
        "audiovisual-disputed",

      passed: false,

      severity: "blocker",

      message:
        "Audiovisual work currently disputed"
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
    subjectId:
      input.work.id,

    subjectLayer:
      "audiovisual",

    ready:
      blockers.length === 0,

    score,

    blockers,
    warnings,

    info: [],

    checkedAt:
      new Date().toISOString()
  }
}
