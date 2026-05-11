import { RuntimeWorkerHeartbeat } from "../contracts/runtime-contracts"

const workerRegistry = new Map<string, RuntimeWorkerHeartbeat>()

export function registerWorker(
  heartbeat: RuntimeWorkerHeartbeat
) {
  workerRegistry.set(heartbeat.workerId, heartbeat)
}

export function getWorker(
  workerId: string
) {
  return workerRegistry.get(workerId)
}

export function getAllWorkers() {
  return Array.from(workerRegistry.values())
}

export function removeWorker(
  workerId: string
) {
  workerRegistry.delete(workerId)
}
