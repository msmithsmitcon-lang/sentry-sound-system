import { randomUUID } from "crypto"

import {
  persistSubmissionExport
} from "@/lib/submission-export-persistence/persistSubmissionExport"

async function main() {

  const result =
    await persistSubmissionExport({
      regulator: "SAMRO",

      format: "JSON",

      manifestId:
        randomUUID(),

      payload: {
        test: true,
        source: "submission-export-persistence-test"
      },

      metadata: {
        runtimeCheck: true
      }
    })

  console.log(result)
}

main()
  .catch(console.error)
