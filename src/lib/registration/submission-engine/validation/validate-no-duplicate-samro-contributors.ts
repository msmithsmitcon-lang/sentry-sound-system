import { SamroWorkExportRow } from "../contracts/samro-work-export-row.contract"

function contributorKey(
  row: SamroWorkExportRow
): string {
  return [
    row.contributorIpi ?? "",
    row.contributorLegalName ?? "",
    row.contributorName,
    row.contributorRole,
    row.territory ?? "",
  ]
    .join("|")
    .toLowerCase()
}

export function validateNoDuplicateSamroContributors(
  rows: SamroWorkExportRow[]
): {
  valid: boolean
  issues: string[]
} {
  const seen = new Set<string>()

  const issues: string[] = []

  for (const row of rows) {
    const key =
      contributorKey(row)

    if (seen.has(key)) {
      issues.push(
        `Duplicate SAMRO contributor detected: ${row.contributorName} / ${row.contributorRole}.`
      )
    }

    seen.add(key)
  }

  return {
    valid:
      issues.length === 0,

    issues,
  }
}
