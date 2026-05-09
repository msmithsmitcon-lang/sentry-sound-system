import { SamroWorkExportRow } from "../contracts/samro-work-export-row.contract"

import { validateIpiNumber } from "./validate-ipi-number"

export function validateSamroContributorIdentity(
  rows: SamroWorkExportRow[]
): {
  valid: boolean
  issues: string[]
} {
  const issues: string[] = []

  for (const row of rows) {
    if (
      row.contributorIpi &&
      !validateIpiNumber(
        row.contributorIpi
      )
    ) {
      issues.push(
        `Invalid contributor IPI for ${row.contributorName}.`
      )
    }

    if (
      row.publisherIpi &&
      !validateIpiNumber(
        row.publisherIpi
      )
    ) {
      issues.push(
        `Invalid publisher IPI for ${row.publisherName ?? "Unknown Publisher"}.`
      )
    }
  }

  return {
    valid:
      issues.length === 0,

    issues,
  }
}
