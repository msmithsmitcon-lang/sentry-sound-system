import type { RegistrationStatus } from "../types/registration-status"

export type MusicalWorkContributorRole =
  | "composer"
  | "lyricist"
  | "arranger"
  | "publisher"

export type MusicalWorkContributor = {
  contributorId: string
  contributorName: string

  role: MusicalWorkContributorRole

  ownershipPercentage: number

  publisherSharePercentage?: number

  territory?: string

  confirmed: boolean
}

export type MusicalWork = {
  id: string

  title: string

  alternateTitle?: string
  subtitle?: string
  language?: string

  status: RegistrationStatus

  iswc?: string

  societyAffiliations?: string[]

  contributors: MusicalWorkContributor[]

  totalOwnershipPercentage: number

  documented: boolean

  disputed: boolean

  amendmentRequired: boolean

  readinessScore?: number

  createdAt: string
  updatedAt: string
}
