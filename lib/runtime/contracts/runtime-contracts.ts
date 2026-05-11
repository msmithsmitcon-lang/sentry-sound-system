export type RuntimeTaskPriority =
  | "LOW"
  | "NORMAL"
  | "HIGH"
  | "CRITICAL"

export type RuntimeWorkerStatus =
  | "IDLE"
  | "ACTIVE"
  | "OFFLINE"
  | "DEGRADED"

export interface RuntimeWorkerHeartbeat {
  workerId: string
  hostname: string
  status: RuntimeWorkerStatus
  activeTaskCount: number
  lastHeartbeatAt: string
}

export interface RuntimeExecutionMetrics {
  tasksCompleted: number
  tasksFailed: number
  averageExecutionMs: number
  queueDepth: number
}
