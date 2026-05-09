import type {
  ReadinessCheckResult,
  RegistrationReadinessResult
} from "../contracts/readiness-rule-contract"

import type { RegistrationLayer } from "../types/registration-layer"
import type { EvidenceType } from "../types/evidence-type"

import { registrationReadinessRules } from "../readiness/registration-readiness-rules"

import {
  validateRegistrationEvidence
} from "./validate-registration-evidence"

export type ReadinessConditionMap = Record<string, boolean>

export type EvaluateRegistrationReadinessInput = {
  subjectId: string
  subjectLayer: RegistrationLayer
  conditions: ReadinessConditionMap
  uploadedEvidenceTypes?: EvidenceType[]
}

export function evaluateRegistrationReadiness(
  input: EvaluateRegistrationReadinessInput
): RegistrationReadinessResult {

  const applicableRules = registrationReadinessRules.filter(
    (rule) => rule.appliesTo === input.subjectLayer
  )

  const results: ReadinessCheckResult[] = applicableRules.map((rule) => {
    const passed = input.conditions[rule.conditionKey] === true

    return {
      ruleId: rule.id,
      passed,
      severity: rule.severity,
      message: passed ? "Passed" : rule.failureMessage,
      requiredFix: passed ? undefined : rule.requiredFix,
      requiredEvidence: passed ? undefined : rule.requiredEvidence
    }
  })

  if (input.uploadedEvidenceTypes) {

    const evidenceValidation = validateRegistrationEvidence({
      layer: input.subjectLayer,
      uploadedEvidenceTypes: input.uploadedEvidenceTypes
    })

    for (const blocker of evidenceValidation.blockers) {
      results.push({
        ruleId: `evidence-${blocker.evidenceType}`,
        passed: false,
        severity: "blocker",
        message: blocker.message
      })
    }

    for (const warning of evidenceValidation.warnings) {
      results.push({
        ruleId: `evidence-${warning.evidenceType}`,
        passed: false,
        severity: "warning",
        message: warning.message
      })
    }
  }

  const blockers = results.filter(
    (result) => !result.passed && result.severity === "blocker"
  )

  const warnings = results.filter(
    (result) => !result.passed && result.severity === "warning"
  )

  const info = results.filter(
    (result) => !result.passed && result.severity === "info"
  )

  const passedCount = results.filter((result) => result.passed).length

  const score =
    results.length === 0
      ? 100
      : Math.round((passedCount / results.length) * 100)

  return {
    subjectId: input.subjectId,
    subjectLayer: input.subjectLayer,
    ready: blockers.length === 0,
    score,
    blockers,
    warnings,
    info,
    checkedAt: new Date().toISOString()
  }
}
