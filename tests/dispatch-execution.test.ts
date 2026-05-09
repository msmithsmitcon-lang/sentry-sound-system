import { randomUUID } from "crypto"

import {
  createSubmissionDispatch
} from "@/lib/submission-dispatch/createSubmissionDispatch"

import {
  executeDispatch
} from "@/lib/submission-dispatch/executeDispatch"

async function main() {

  const queued =
    await createSubmissionDispatch({
      submissionExportId:
        randomUUID(),

      regulator:
        "SAMRO",

      metadata: {
        source:
          "dispatch-execution-test"
      }
    })

  const result =
    await executeDispatch({
      dispatchId:
        queued.id
    })

  console.log(result)
}

main()
  .catch(console.error)
