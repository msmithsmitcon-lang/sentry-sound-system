import {
  EvidenceRecord
} from "./evaluateEvidenceReadiness"

import {
  resolveRequiredEvidencePolicies
} from "./resolveRequiredEvidencePolicies"

export interface DetectMissingEvidenceInput {
  entityType: string
  evidence: EvidenceRecord[]
}

export function detectMissingEvidence(
  input: DetectMissingEvidenceInput
): string[] {

  const requiredPolicies =
    resolveRequiredEvidencePolicies({
      entityType: input.entityType
    })

  const existingTypes =
    input.evidence.map(x => x.evidenceType)

  return requiredPolicies
    .filter(
      policy =>
        !existingTypes.includes(
          policy.evidenceType
        )
    )
    .map(x => x.evidenceType)
}
