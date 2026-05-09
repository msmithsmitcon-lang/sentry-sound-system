import { randomUUID } from "crypto"

import {
  resolveEvidenceState
} from "@/lib/evidence-resolution/resolveEvidenceState"

function assert(
  condition: boolean,
  message: string
) {
  if (!condition) {
    throw new Error(message)
  }
}

const valid =
  resolveEvidenceState({
    evidenceId: randomUUID(),
    verificationStatus: "verified"
  })

assert(
  valid.status === "valid",
  "verified evidence should resolve as valid"
)

const superseded =
  resolveEvidenceState({
    evidenceId: randomUUID(),
    verificationStatus: "verified",
    supersededByEvidenceId:
      randomUUID()
  })

assert(
  superseded.status === "superseded",
  "superseded evidence should resolve as superseded"
)

const rejected =
  resolveEvidenceState({
    evidenceId: randomUUID(),
    rejectionReason:
      "invalid signature"
  })

assert(
  rejected.status === "rejected",
  "rejected evidence should resolve as rejected"
)

console.log(
  "Evidence resolution tests passed"
)
