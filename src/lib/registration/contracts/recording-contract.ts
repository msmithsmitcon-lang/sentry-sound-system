import type { RegistrationStatus } from "../types/registration-status"

export type RecordingPerformerRole =
  | "featured_artist"
  | "session_musician"
  | "producer"
  | "engineer"

export type RecordingPerformer = {
  performerId: string
  performerName: string

  role: RecordingPerformerRole

  participationPercentage?: number

  confirmed: boolean
}

export type Recording = {
  id: string

  title: string

  isrc: string

  status: RegistrationStatus

  recordingDate?: string

  studioName?: string

  masterOwnerId: string
  masterOwnerName: string

  linkedMusicalWorkId?: string

  performers: RecordingPerformer[]

  documented: boolean

  disputed: boolean

  amendmentRequired: boolean

  readinessScore?: number

  createdAt: string
  updatedAt: string
}
