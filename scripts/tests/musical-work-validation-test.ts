import { validateMusicalWork } from "../../src/lib/registration/services/validate-musical-work"

const result = validateMusicalWork({
  id: "work_001",
  title: "Test Work",
  status: "draft",
  documented: false,
  disputed: false,
  amendmentRequired: false,
  totalOwnershipPercentage: 90,
  contributors: [
    {
      contributorId: "contributor_001",
      contributorName: "Composer One",
      role: "composer",
      ownershipPercentage: 50,
      confirmed: true
    },
    {
      contributorId: "contributor_002",
      contributorName: "Composer Two",
      role: "lyricist",
      ownershipPercentage: 40,
      confirmed: false
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

console.log("\n=== MUSICAL WORK VALIDATION TEST ===\n")
console.log(JSON.stringify(result, null, 2))

if (result.valid !== false) {
  throw new Error("Expected musical work validation to fail")
}

if (result.generatedConditions.composition_split_total_100 !== false) {
  throw new Error("Expected split total condition to be false")
}

if (result.generatedConditions.split_sheet_signed !== false) {
  throw new Error("Expected split confirmation condition to be false")
}

if (result.generatedConditions.work_documented !== false) {
  throw new Error("Expected documented condition to be false")
}

console.log("\nMusical work validation test passed.\n")
