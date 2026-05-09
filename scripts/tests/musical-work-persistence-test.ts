import {
  createMusicalWork,
  getMusicalWorkById
} from "../../src/lib/registration/repositories/musical-work-repository"

async function main() {

  const created = await createMusicalWork({
    title: "Persistence Test Work",
    status: "draft",
    documented: true
  })

  console.log("\n=== CREATED MUSICAL WORK ===\n")
  console.log(created)

  const fetched = await getMusicalWorkById(created.id)

  console.log("\n=== FETCHED MUSICAL WORK ===\n")
  console.log(fetched)

  if (!fetched) {
    throw new Error("Expected fetched musical work")
  }

  if (fetched.title !== "Persistence Test Work") {
    throw new Error("Unexpected title")
  }

  console.log("\nMusical work persistence test passed.\n")
}

main()
