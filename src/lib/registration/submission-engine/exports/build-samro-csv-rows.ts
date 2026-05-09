import { SamroWorkExportRow } from "../contracts/samro-work-export-row.contract"

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return ""
  }

  const stringValue = String(value)

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

export function buildSamroCsvRows(
  rows: SamroWorkExportRow[]
): string {
  const headers = [
    "Work Title",
    "Alternate Title",
    "Language",
    "ISWC",

    "Contributor Name",
    "Contributor Legal Name",
    "Contributor IPI",
    "Contributor Alias",
    "Contributor Role",

    "Ownership Percentage",

    "Publisher Name",
    "Publisher IPI",
    "Publisher Share Percentage",

    "Territory",
  ]

  const csvRows = rows.map((row) => [
    row.workTitle,
    row.alternateTitle,
    row.language,
    row.iswc,

    row.contributorName,
    row.contributorLegalName,
    row.contributorIpi,
    row.contributorAlias,
    row.contributorRole,

    row.ownershipPercentage,

    row.publisherName,
    row.publisherIpi,
    row.publisherSharePercentage,

    row.territory,
  ])

  return [
    headers,
    ...csvRows,
  ]
    .map((line) =>
      line.map(escapeCsvValue).join(",")
    )
    .join("\n")
}
