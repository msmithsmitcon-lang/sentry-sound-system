import type { RegistrationStatus } from "../types/registration-status"

export type AudiovisualWorkRole =
  | "production_company"
  | "director"
  | "producer"
  | "editor"
  | "cinematographer"
  | "rights_owner"

export type AudiovisualWorkParticipant = {
  participantId: string
  participantName: string
  role: AudiovisualWorkRole
  confirmed: boolean
}

export type AudiovisualWork = {
  id: string

  title: string

  status: RegistrationStatus

  linkedRecordingId?: string
  linkedMusicalWorkId?: string

  productionCompanyId?: string
  productionCompanyName?: string

  directorName?: string

  releaseDate?: string

  documented: boolean
  disputed: boolean
  amendmentRequired: boolean

  cueSheetRequired: boolean
  cueSheetProvided: boolean

  depositRequired: boolean
  depositCertificateProvided: boolean

  participants: AudiovisualWorkParticipant[]

  readinessScore?: number

  createdAt: string
  updatedAt: string
}
