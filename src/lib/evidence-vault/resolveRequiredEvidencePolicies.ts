import {
  RequiredEvidencePolicyRule,
  REQUIRED_EVIDENCE_POLICY_RULES
} from "./requiredEvidencePolicy.constants"

export interface ResolveRequiredEvidencePoliciesInput {
  entityType: string
}

export function resolveRequiredEvidencePolicies(
  input: ResolveRequiredEvidencePoliciesInput
): RequiredEvidencePolicyRule[] {

  return REQUIRED_EVIDENCE_POLICY_RULES.filter(
    rule =>
      rule.entityType === input.entityType
  )
}
