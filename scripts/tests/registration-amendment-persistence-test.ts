import {
  createMusicalWork
} from "../../src/lib/registration/repositories/musical-work-repository"

import {
  createRegistrationAmendmentRecord,
  getAmendmentsForEntity
} from "../../src/lib/registration/repositories/registration-amendment-repository"

async function main() {

  const work = await createMusicalWork({
    title: "Amendment Persistence Test",
    status: "draft",
    documented: true
  })

  await createRegistrationAmendmentRecord({
    amendmentType: "split_adjustment",

    amendmentStatus: "draft",

    relatedEntityType: "musical_work",
    relatedEntityId: work.id,

    requestedBy: "publisher_admin",

    reason: "Ownership percentages corrected",

    oldValues: {
      composerA: 50,
      composerB: 50
    },

    newValues: {
      composerA: 60,
      composerB: 40
    },

    evidenceIds: [
      "split_sheet_v2"
    ],

    requiresReconfirmation: true,

    musicalWorkId: work.id
  })

  const amendments = await getAmendmentsForEntity({
    relatedEntityType: "musical_work",
    relatedEntityId: work.id
  })

  console.log("\n=== AMENDMENTS ===\n")
  console.log(amendments)

  if (amendments.length !== 1) {
    throw new Error("Expected one amendment")
  }

  if (amendments[0].requiresReconfirmation !== true) {
    throw new Error("Expected reconfirmation requirement")
  }

  console.log("\nAmendment persistence test passed.\n")
}

main()
