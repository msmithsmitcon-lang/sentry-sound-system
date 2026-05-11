import {
  RuntimeExecutionMetrics
} from "../contracts/runtime-contracts"

import {
  persistRuntimeMetric
} from "./persist-runtime-metric"

const metrics: RuntimeExecutionMetrics = {
  tasksCompleted: 0,
  tasksFailed: 0,
  averageExecutionMs: 0,
  queueDepth: 0
}

let totalExecutionTime = 0

export async function recordTaskCompletion(
  executionMs: number
) {
  metrics.tasksCompleted += 1

  totalExecutionTime += executionMs

  metrics.averageExecutionMs =
    totalExecutionTime /
    metrics.tasksCompleted

  await persistRuntimeMetric(
    "TASK_COMPLETION_MS",
    executionMs
  )
}

export async function recordTaskFailure() {
  metrics.tasksFailed += 1

  await persistRuntimeMetric(
    "TASK_FAILURE",
    1
  )
}

export async function updateQueueDepth(
  depth: number
) {
  metrics.queueDepth = depth

  await persistRuntimeMetric(
    "QUEUE_DEPTH",
    depth
  )
}

export function getRuntimeMetrics() {
  return metrics
}
