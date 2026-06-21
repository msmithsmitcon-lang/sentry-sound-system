export interface RuntimeEvent {
  eventId: string

  eventType: string

  learnerId?: string

  programmeId?: string
  moduleId?: string
  slbId?: string

  sessionId?: string

  payload?: Record<string, any>

  createdAt: string
}
