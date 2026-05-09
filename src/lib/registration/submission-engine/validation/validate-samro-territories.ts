import { SamroWorkExportRow } from "../contracts/samro-work-export-row.contract"

const VALID_TERRITORIES = [
  "ZA",
  "WORLD",
  "AFRICA",
]

export function validateSamroTerritories(
  rows: SamroWorkExportRow[]
): {
  valid: boolean
  issues: string[]
} {
  const issues: string[] = []

  for (const row of rows) {
    if (
      row.territory &&
      !VALID_TERRITORIES.includes(row.territory)
    ) {
      issues.push(
        `Invalid territory '${row.territory}' for ${row.contributorName}.`
      )
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  }
}
