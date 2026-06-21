import { RuntimeTelemetryEvent } from "./runtime-telemetry-event"

export function createTelemetryEvent(
  payload: RuntimeTelemetryEvent
): RuntimeTelemetryEvent {
  return {
    ...payload,
    timestamp: new Date().toISOString(),
  }
}
