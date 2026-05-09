import { randomUUID } from "crypto"

import {
  createDispatchAttempt
} from "@/lib/submission-dispatch/createDispatchAttempt"

async function main() {

  const result =
    await createDispatchAttempt({
      dispatchId:
        randomUUID(),

      attemptNumber: 1,

      status: "started",

      message:
        "Dispatch attempt initialized",

      regulatorResponse: {
        simulated: true
      },

      metadata: {
        source:
          "dispatch-attempt-test"
      }
    })

  console.log(result)
}

main()
  .catch(console.error)
