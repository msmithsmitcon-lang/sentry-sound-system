import {
  getAllWorkers,
  removeWorker
} from "../registry/worker-registry"

const STALE_WORKER_THRESHOLD_MS = 60_000

export function cleanupStaleWorkers() {
  const workers = getAllWorkers()

  const now = Date.now()

  const removedWorkers: string[] = []

  for (const worker of workers) {
    const heartbeatTime = new Date(
      worker.lastHeartbeatAt
    ).getTime()

    const age = now - heartbeatTime

    if (age > STALE_WORKER_THRESHOLD_MS) {
      removeWorker(worker.workerId)

      removedWorkers.push(worker.workerId)
    }
  }

  return removedWorkers
}
