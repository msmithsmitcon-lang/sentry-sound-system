export interface SamroWorkExportRow {
  workTitle: string

  alternateTitle?: string | null

  language?: string | null

  iswc?: string | null

  contributorName: string

  contributorLegalName?: string | null

  contributorIpi?: string | null

  contributorAlias?: string | null

  contributorRole: string

  ownershipPercentage: number

  publisherName?: string | null

  publisherIpi?: string | null

  publisherSharePercentage?: number | null

  territory?: string | null
}
