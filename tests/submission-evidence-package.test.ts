import { randomUUID } from "crypto"

import {
  buildSubmissionEvidencePackage
} from "@/lib/submission-packaging/buildSubmissionEvidencePackage"

function assert(
  condition: boolean,
  message: string
) {
  if (!condition) {
    throw new Error(message)
  }
}

const evidenceId1 = randomUUID()
const evidenceId2 = randomUUID()

const result =
  buildSubmissionEvidencePackage({
    snapshot: {
      validEvidenceIds: [
        evidenceId1,
        evidenceId2
      ],

      supersededEvidenceIds: [],
      rejectedEvidenceIds: [],
      pendingEvidenceIds: []
    },

    documentTypeMap: {
      [evidenceId1]:
        "split_sheet",

      [evidenceId2]:
        "identity_document"
    }
  })

assert(
  result.evidenceCount === 2,
  "incorrect evidence count"
)

assert(
  result.evidence.length === 2,
  "incorrect package size"
)

assert(
  result.evidence[0].documentType ===
    "split_sheet",
  "incorrect document type mapping"
)

console.log(
  "Submission evidence packaging tests passed"
)
