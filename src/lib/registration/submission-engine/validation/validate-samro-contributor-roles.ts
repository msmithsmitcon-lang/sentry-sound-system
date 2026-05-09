import { SamroWorkExportRow } from "../contracts/samro-work-export-row.contract"

const VALID_SAMRO_ROLES = [
  "Composer",
  "Author",
  "Arranger",
  "Publisher",
]

export function validateSamroContributorRoles(
  rows: SamroWorkExportRow[]
): {
  valid: boolean
  issues: string[]
} {
  const issues: string[] = []

  for (const row of rows) {
    if (
      !VALID_SAMRO_ROLES.includes(
        row.contributorRole
      )
    ) {
      issues.push(
        `Invalid SAMRO contributor role '${row.contributorRole}' for ${row.contributorName}.`
      )
    }
  }

  return {
    valid:
      issues.length === 0,

    issues,
  }
}
