import {
  EvidenceType
} from "@/contracts/evidence-vault/evidence.constants"

import {
  EvidenceRecord,
  EvaluateEvidenceReadinessInput,
  EvaluateEvidenceReadinessResult
} from "./evaluateEvidenceReadiness"

import {
  detectMissingEvidence
} from "./detectMissingEvidence"

export function evaluateEvidenceReadiness(
  input: EvaluateEvidenceReadinessInput & {
    entityType?: string
  }
): EvaluateEvidenceReadinessResult {

  const blockingEvidenceTypes: EvidenceType[] = []
  const rejectedEvidenceTypes: EvidenceType[] = []
  const pendingReviewEvidenceTypes: EvidenceType[] = []

  const missingEvidenceTypes =
    input.entityType
      ? detectMissingEvidence({
          entityType: input.entityType,
          evidence: input.evidence
        }) as EvidenceType[]
      : []

  for (const evidence of input.evidence) {

    const isBlocking =
      evidence.requirementLevel === "BLOCKING"

    const isRejected =
      evidence.verificationStatus === "REJECTED"

    const isPending =
      evidence.verificationStatus === "PENDING" ||
      evidence.verificationStatus === "UNDER_REVIEW"

    if (isBlocking) {
      blockingEvidenceTypes.push(evidence.evidenceType)
    }

    if (isBlocking && isRejected) {
      rejectedEvidenceTypes.push(evidence.evidenceType)
    }

    if (isBlocking && isPending) {
      pendingReviewEvidenceTypes.push(evidence.evidenceType)
    }
  }

  const ready =
    rejectedEvidenceTypes.length === 0 &&
    pendingReviewEvidenceTypes.length === 0 &&
    missingEvidenceTypes.length === 0

  return {
    ready,
    blockingEvidenceTypes,
    missingEvidenceTypes,
    rejectedEvidenceTypes,
    pendingReviewEvidenceTypes
  }
}
