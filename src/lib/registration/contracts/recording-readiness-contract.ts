export type RecordingPerformerInput = {
  performerId: string
  performerName: string

  role: string

  participationPercentage?: number

  confirmed: boolean
}

export type RecordingReadinessInput = {
  id: string

  title: string

  isrc?: string | null

  masterOwnerId: string
  masterOwnerName: string

  performers:
    RecordingPerformerInput[]

  documented: boolean

  disputed: boolean

  amendmentRequired: boolean
}
