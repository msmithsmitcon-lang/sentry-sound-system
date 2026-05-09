import type { MusicalWork } from "../contracts/musical-work-contract"

export type MusicalWorkValidationResult = {
  valid: boolean
  errors: string[]
  warnings: string[]
  generatedConditions: Record<string, boolean>
}

export function validateMusicalWork(
  work: MusicalWork
): MusicalWorkValidationResult {

  const errors: string[] = []
  const warnings: string[] = []

  const totalOwnership =
    work.contributors.reduce(
      (sum, contributor) => sum + contributor.ownershipPercentage,
      0
    )

  const allConfirmed =
    work.contributors.every(
      (contributor) => contributor.confirmed
    )

  const conditions: Record<string, boolean> = {
    composition_split_total_100: totalOwnership === 100,
    split_sheet_signed: allConfirmed,
    work_documented: work.documented
  }

  if (totalOwnership !== 100) {
    errors.push(
      `Ownership total must equal 100. Current total: ${totalOwnership}`
    )
  }

  if (!allConfirmed) {
    errors.push(
      "All contributors must confirm ownership splits"
    )
  }

  if (!work.documented) {
    warnings.push(
      "Work currently marked as undocumented"
    )
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    generatedConditions: conditions
  }
}
