import { buildSamroSubmissionPackage } from "../src/lib/registration/submission-engine/services/build-samro-submission-package.service"

async function main() {
  const result =
    await buildSamroSubmissionPackage({
      entityType:
        "musical_work",

      entityId:
        "TEST-WORK-CSV-001",

      generatedBy:
        "system",

      rows: [
        {
          workTitle:
            "Test Song",

          alternateTitle:
            "Test Alternate",

          language:
            "English",

          iswc:
            "T-123.456.789-Z",

          contributorName:
            "John Smith",

          contributorRole:
            "Composer",

          ownershipPercentage:
            50,

          publisherSharePercentage:
            25,

          territory:
            "ZA",
        },

        {
          workTitle:
            "Test Song",

          contributorName:
            "Jane Doe",

          contributorRole:
            "Author",

          ownershipPercentage:
            50,

          publisherSharePercentage:
            25,

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
