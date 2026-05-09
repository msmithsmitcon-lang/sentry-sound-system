import { randomUUID } from "crypto"

import {
  resolveEvidenceSnapshot
} from "@/lib/evidence-resolution/resolveEvidenceSnapshot"

function assert(
  condition: boolean,
  message: string
) {
  if (!condition) {
    throw new Error(message)
  }
}

const validId = randomUUID()
const supersededId = randomUUID()
const rejectedId = randomUUID()
const pendingId = randomUUID()

const snapshot =
  resolveEvidenceSnapshot([
    {
      evidenceId: validId,
      documentType: "split_sheet",
      verificationStatus: "verified"
    },

    {
      evidenceId: supersededId,
      documentType: "split_sheet",
      verificationStatus: "verified",
      supersededByEvidenceId:
        randomUUID()
    },

    {
      evidenceId: rejectedId,
      documentType: "id_document",
      rejectionReason:
        "invalid upload"
    },

    {
      evidenceId: pendingId,
      documentType: "agreement"
    }
  ])

assert(
  snapshot.validEvidenceIds.includes(validId),
  "valid evidence missing"
)

assert(
  snapshot.supersededEvidenceIds.includes(
    supersededId
  ),
  "superseded evidence missing"
)

assert(
  snapshot.rejectedEvidenceIds.includes(
    rejectedId
  ),
  "rejected evidence missing"
)

assert(
  snapshot.pendingEvidenceIds.includes(
    pendingId
  ),
  "pending evidence missing"
)

console.log(
  "Evidence snapshot tests passed"
)
