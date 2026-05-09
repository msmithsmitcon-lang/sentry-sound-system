import {
  createMusicalWork
} from "../../src/lib/registration/repositories/musical-work-repository"

import {
  createRegistrationDisputeRecord,
  getDisputesForEntity
} from "../../src/lib/registration/repositories/registration-dispute-repository"

async function main() {

  const work = await createMusicalWork({
    title: "Dispute Persistence Test",
    status: "draft",
    documented: true
  })

  await createRegistrationDisputeRecord({
    disputeType: "ownership_dispute",

    disputeStatus: "open",

    relatedEntityType: "musical_work",
    relatedEntityId: work.id,

    openedBy: "legal_admin",

    description: "Ownership percentages disputed",

    evidenceIds: [
      "split_sheet_001"
    ],

    resultingRegistrationStatus: "disputed",

    musicalWorkId: work.id
  })

  const disputes = await getDisputesForEntity({
    relatedEntityType: "musical_work",
    relatedEntityId: work.id
  })

  console.log("\n=== DISPUTES ===\n")
  console.log(disputes)

  if (disputes.length !== 1) {
    throw new Error("Expected one dispute")
  }

  if (disputes[0].disputeType !== "ownership_dispute") {
    throw new Error("Unexpected dispute type")
  }

  console.log("\nDispute persistence test passed.\n")
}

main()
