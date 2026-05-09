import {
  resolveEvidenceState
} from "./resolveEvidenceState"

import {
  EvidenceSnapshotItem,
  ResolvedEvidenceSnapshot
} from "./resolveEvidenceSnapshot.types"

export function resolveEvidenceSnapshot(
  evidenceItems: EvidenceSnapshotItem[]
): ResolvedEvidenceSnapshot {

  const validEvidenceIds: string[] = []

  const supersededEvidenceIds: string[] = []

  const rejectedEvidenceIds: string[] = []

  const pendingEvidenceIds: string[] = []

  for (const item of evidenceItems) {

    const resolved =
      resolveEvidenceState({
        evidenceId: item.evidenceId,

        verificationStatus:
          item.verificationStatus,

        supersededByEvidenceId:
          item.supersededByEvidenceId,

        rejectionReason:
          item.rejectionReason
      })

    if (resolved.status === "valid") {
      validEvidenceIds.push(
        resolved.evidenceId
      )
    }

    else if (
      resolved.status === "superseded"
    ) {
      supersededEvidenceIds.push(
        resolved.evidenceId
      )
    }

    else if (
      resolved.status === "rejected"
    ) {
      rejectedEvidenceIds.push(
        resolved.evidenceId
      )
    }

    else {
      pendingEvidenceIds.push(
        resolved.evidenceId
      )
    }
  }

  return {
    validEvidenceIds,

    supersededEvidenceIds,

    rejectedEvidenceIds,

    pendingEvidenceIds
  }
}
