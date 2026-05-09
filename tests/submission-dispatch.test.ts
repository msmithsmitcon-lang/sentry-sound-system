import { randomUUID } from "crypto"

import {
  createSubmissionDispatch
} from "@/lib/submission-dispatch/createSubmissionDispatch"

async function main() {

  const result =
    await createSubmissionDispatch({
      submissionExportId:
        randomUUID(),

      regulator: "SAMRO",

      metadata: {
        source:
          "submission-dispatch-test"
      }
    })

  console.log(result)
}

main()
  .catch(console.error)
