import { buildAndEnqueueSamroSubmission } from "../src/lib/registration/submission-engine/services/build-and-enqueue-samro-submission.service"

async function main() {
  const result =
    await buildAndEnqueueSamroSubmission({
      entityType: "musical_work",
      entityId: "WORK-INVALID-OWNERSHIP-001",
      generatedBy: "system",
      rows: [
        {
          workTitle: "Invalid Ownership Song",
          contributorName: "John Smith",
          contributorRole: "Composer",
          ownershipPercentage: 60,
          territory: "ZA",
        },
      ],
    })

  console.log(JSON.stringify(result, null, 2))
}

main().catch((error) => {
  console.error("EXPECTED VALIDATION ERROR:")
  console.error(error.message)
  process.exit(0)
})
