import { SamroWorkExportRow } from "../contracts/samro-work-export-row.contract"

export function validateSamroOwnershipTotal(
  rows: SamroWorkExportRow[]
): {
  valid: boolean
  total: number
  issues: string[]
} {
  const total =
    rows.reduce(
      (sum, row) =>
        sum + row.ownershipPercentage,
      0
    )

  const valid =
    Math.abs(total - 100) < 0.0001

  return {
    valid,
    total,
    issues: valid
      ? []
      : [
          `SAMRO ownership total must equal 100%. Current total: ${total}.`,
        ],
  }
}
