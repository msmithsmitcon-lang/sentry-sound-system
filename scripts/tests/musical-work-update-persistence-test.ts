import {
  createMusicalWork,
  getMusicalWorkById,
  updateMusicalWorkStatus,
  updateMusicalWorkReadiness
} from "../../src/lib/registration/repositories/musical-work-repository"

async function main() {

  const created = await createMusicalWork({
    title: "Workflow Persistence Test",
    status: "draft",
    documented: true
  })

  console.log("\n=== CREATED ===\n")
  console.log(created)

  await updateMusicalWorkStatus({
    id: created.id,
    status: "ready_for_submission"
  })

  await updateMusicalWorkReadiness({
    id: created.id,
    readinessScore: 92
  })

  const updated = await getMusicalWorkById(created.id)

  console.log("\n=== UPDATED ===\n")
  console.log(updated)

  if (!updated) {
    throw new Error("Expected updated musical work")
  }

  if (updated.status !== "ready_for_submission") {
    throw new Error("Expected updated status")
  }

  if (updated.readinessScore !== 92) {
    throw new Error("Expected readiness score 92")
  }

  console.log("\nMusical work update persistence test passed.\n")
}

main()
