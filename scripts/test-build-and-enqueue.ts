import { buildAndEnqueueSamroSubmission } from "../src/lib/registration/submission-engine/services/build-and-enqueue-samro-submission.service"

async function main() {
  const result =
    await buildAndEnqueueSamroSubmission({
      entityType:
        "musical_work",

      entityId:
        "WORK-QUEUE-001",

      generatedBy:
        "system",

      rows: [
        {
          workTitle:
            "Queue Test Song",

          contributorName:
            "John Smith",

          contributorRole:
            "Composer",

          ownershipPercentage:
            100,

          territory:
            "ZA",
        },
      ],
    })

  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
