import { SamroWorkExportRow } from "../contracts/samro-work-export-row.contract"

function normalizeText(
  value?: string | null
): string | null {
  if (!value) {
    return null
  }

  return value
    .trim()
    .replace(/\s+/g, " ")
}

function normalizeIpi(
  value?: string | null
): string | null {
  if (!value) {
    return null
  }

  return value
    .replace(/\s/g, "")
}

export function normalizeSamroWorkExportRows(
  rows: SamroWorkExportRow[]
): SamroWorkExportRow[] {
  return rows.map((row) => ({
    ...row,

    workTitle:
      normalizeText(row.workTitle) ?? row.workTitle,

    alternateTitle:
      normalizeText(row.alternateTitle),

    language:
      normalizeText(row.language),

    iswc:
      normalizeText(row.iswc),

    contributorName:
      normalizeText(row.contributorName) ?? row.contributorName,

    contributorLegalName:
      normalizeText(row.contributorLegalName),

    contributorIpi:
      normalizeIpi(row.contributorIpi),

    contributorAlias:
      normalizeText(row.contributorAlias),

    contributorRole:
      normalizeText(row.contributorRole) ?? row.contributorRole,

    publisherName:
      normalizeText(row.publisherName),

    publisherIpi:
      normalizeIpi(row.publisherIpi),

    territory:
      normalizeText(row.territory),
  }))
}
