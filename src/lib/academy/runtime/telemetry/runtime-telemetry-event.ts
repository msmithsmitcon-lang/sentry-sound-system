export interface RuntimeTelemetryEvent {
  eventId: string
  learnerId: string
  slbId: string
  sessionId: string

  eventType: string
  runtimeState: string

  timestamp?: string

  metadata?: Record<string, any>
}

