import { RuntimeEvent }
from "./runtime-event"

type RuntimeEventHandler =
  (event: RuntimeEvent) => void

const handlers:
Record<string, RuntimeEventHandler[]> = {}

export function subscribeToRuntimeEvent(
  eventType: string,
  handler: RuntimeEventHandler
) {

  if (!handlers[eventType]) {
    handlers[eventType] = []
  }

  handlers[eventType].push(handler)
}

export function publishRuntimeEvent(
  event: RuntimeEvent
) {

  const eventHandlers =
    handlers[event.eventType] || []

  for (const handler of eventHandlers) {
    handler(event)
  }
}
