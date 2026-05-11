import { persistRuntimeEvent } from "./persist-runtime-event"

export async function logRuntimeInfo(
  eventType: string,
  message: string,
  workerId?: string
) {
  await persistRuntimeEvent(
    eventType,
    "INFO",
    message,
    workerId ?? null
  )
}

export async function logRuntimeWarning(
  eventType: string,
  message: string,
  workerId?: string
) {
  await persistRuntimeEvent(
    eventType,
    "WARNING",
    message,
    workerId ?? null
  )
}

export async function logRuntimeError(
  eventType: string,
  message: string,
  workerId?: string
) {
  await persistRuntimeEvent(
    eventType,
    "ERROR",
    message,
    workerId ?? null
  )
}
