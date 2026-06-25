export class AcademyTelemetryService {

  track(
    eventType: string,
    metadata?: Record<string, any>
  ) {

    return {
      eventType,
      metadata,
      trackedAt: new Date().toISOString(),
    }
  }
}
