import { randomUUID } from "crypto"

import {
  buildSamroExport
} from "@/lib/regulator-adapters/buildSamroExport"

function assert(
  condition: boolean,
  message: string
) {
  if (!condition) {
    throw new Error(message)
  }
}

const exportResult =
  buildSamroExport({
    manifest: {
      manifestId: randomUUID(),

      generatedAt:
        new Date().toISOString(),

      regulator: "SAMRO",

      evidenceCount: 1,

      evidence: [
        {
          evidenceId: randomUUID(),
          documentType: "split_sheet"
        }
      ]
    }
  })

assert(
  exportResult.regulator === "SAMRO",
  "incorrect regulator"
)

assert(
  exportResult.format === "JSON",
  "incorrect format"
)

assert(
  exportResult.payload.evidenceCount === 1,
  "incorrect evidence count"
)

console.log(
  "SAMRO adapter tests passed"
)
