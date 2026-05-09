import { randomUUID } from "crypto"

import {
  createSubmissionDispatch
} from "@/lib/submission-dispatch/createSubmissionDispatch"

import {
  failDispatch
} from "@/lib/submission-dispatch/failDispatch"

import {
  retryDispatch
} from "@/lib/submission-dispatch/retryDispatch"

async function main() {

  const dispatch =
    await createSubmissionDispatch({
      submissionExportId:
        randomUUID(),

      regulator:
        "SAMRO"
    })

  const failed =
    await failDispatch({
      dispatchId:
        dispatch.id,

      reason:
        "Simulated regulator outage"
    })

  console.log(failed)

  const retried =
    await retryDispatch({
      dispatchId:
        dispatch.id
    })

  console.log(retried)
}

main()
  .catch(console.error)
