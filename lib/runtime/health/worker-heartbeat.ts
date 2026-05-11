import os from "os"

import {
  RuntimeWorkerHeartbeat
} from "../contracts/runtime-contracts"

import {
  registerWorker
} from "../registry/worker-registry"

import {
  upsertRuntimeWorker
} from "./persist-worker-heartbeat"

import {
  extendWorkerLease
} from "../workers/worker-lease"

export function createWorkerHeartbeat(
  workerId: string,
  activeTaskCount = 0
): RuntimeWorkerHeartbeat {
  return {
    workerId,
    hostname: os.hostname(),
    status: "ACTIVE",
    activeTaskCount,
    lastHeartbeatAt: new Date().toISOString()
  }
}

export async function publishWorkerHeartbeat(
  workerId: string,
  activeTaskCount = 0
) {
  const heartbeat = createWorkerHeartbeat(
    workerId,
    activeTaskCount
  )

  registerWorker(heartbeat)

  await upsertRuntimeWorker(
    heartbeat.workerId,
    heartbeat.hostname,
    heartbeat.status,
    heartbeat.activeTaskCount
  )

  await extendWorkerLease(
    heartbeat.workerId,
    60
  )

  return heartbeat
}
