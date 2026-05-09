import { randomUUID } from "crypto"

import {
  createSubmissionDispatch
} from "@/lib/submission-dispatch/createSubmissionDispatch"

import {
  processDispatchQueue
} from "@/lib/submission-dispatch/processDispatchQueue"

async function main() {

  await createSubmissionDispatch({
    submissionExportId:
      randomUUID(),

    regulator:
      "SAMRO"
  })

  await createSubmissionDispatch({
    submissionExportId:
      randomUUID(),

    regulator:
      "SAMRO"
  })

  const result =
    await processDispatchQueue({
      limit: 10
    })

  console.log(result)
}

main()
  .catch(console.error)
