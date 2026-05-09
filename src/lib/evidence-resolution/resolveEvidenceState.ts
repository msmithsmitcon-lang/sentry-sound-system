import {
  ResolvedEvidenceState,
  EvidenceResolutionStatus
} from "./resolveEvidenceState.types"

export interface ResolveEvidenceStateInput {
  evidenceId: string

  verificationStatus?: string | null

  supersededByEvidenceId?: string | null

  rejectionReason?: string | null
}

export function resolveEvidenceState(
  input: ResolveEvidenceStateInput
): ResolvedEvidenceState {

  let status: EvidenceResolutionStatus =
    "pending"

  if (input.rejectionReason) {
    status = "rejected"
  }
  else if (input.supersededByEvidenceId) {
    status = "superseded"
  }
  else if (
    input.verificationStatus === "verified"
  ) {
    status = "valid"
  }

  return {
    evidenceId: input.evidenceId,

    status,

    supersededByEvidenceId:
      input.supersededByEvidenceId,

    isLatestValidEvidence:
      status === "valid",

    rejectionReason:
      input.rejectionReason
  }
}
