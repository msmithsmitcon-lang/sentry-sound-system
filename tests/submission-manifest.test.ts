import { randomUUID } from "crypto"

import {
  buildSubmissionManifest
} from "@/lib/submission-manifest/buildSubmissionManifest"

function assert(
  condition: boolean,
  message: string
) {
  if (!condition) {
    throw new Error(message)
  }
}

const evidenceId = randomUUID()

const manifest =
  buildSubmissionManifest({
    regulator: "SAMRO",

    evidencePackage: {
      generatedAt:
        new Date().toISOString(),

      evidenceCount: 1,

      evidence: [
        {
          evidenceId,
          documentType:
            "split_sheet"
        }
      ]
    }
  })

assert(
  manifest.regulator === "SAMRO",
  "incorrect regulator"
)

assert(
  manifest.evidenceCount === 1,
  "incorrect evidence count"
)

assert(
  manifest.evidence[0].evidenceId ===
    evidenceId,
  "incorrect evidence mapping"
)

console.log(
  "Submission manifest tests passed"
)
