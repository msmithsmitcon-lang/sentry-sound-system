import {
  createMusicalWork
} from "../../src/lib/registration/repositories/musical-work-repository"

import {
  createRegistrationEvidenceRecord,
  getEvidenceForEntity
} from "../../src/lib/registration/repositories/registration-evidence-repository"

async function main() {

  const work = await createMusicalWork({
    title: "Evidence Persistence Test",
    status: "draft",
    documented: true
  })

  await createRegistrationEvidenceRecord({
    evidenceType: "split_sheet",

    layer: "composition",

    title: "Signed Split Sheet",

    description:
      "Composer ownership split confirmation",

    requirementLevel: "required",

    verificationStatus: "pending",

    requiresSignature: true,

    requiresVerification: true,

    blocksSubmissionIfMissing: true,

    uploadedBy: "legal_admin",

    relatedEntityType: "musical_work",
    relatedEntityId: work.id,

    metadata: {
      contributors: 2,
      signed: false
    }
  })

  const evidence =
    await getEvidenceForEntity({
      relatedEntityType: "musical_work",
      relatedEntityId: work.id
    })

  console.log("\n=== EVIDENCE ===\n")
  console.log(evidence)

  if (evidence.length !== 1) {
    throw new Error("Expected one evidence record")
  }

  if (evidence[0].requiresSignature !== true) {
    throw new Error(
      "Expected requiresSignature true"
    )
  }

  console.log(
    "\nEvidence persistence test passed.\n"
  )
}

main()
