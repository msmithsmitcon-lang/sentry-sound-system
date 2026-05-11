import { supabaseAdmin } from "../../supabase/admin"

export interface ClaimedRuntimeTask {
  queue_id: string
  task_id: string
  task_type: string
  payload: Record<string, unknown>
  priority: number
}

export async function claimNextRuntimeTask(
  workerId: string,
  lockSeconds = 120
) {
  const { data, error } = await supabaseAdmin.rpc(
    "rpc_ai_claim_next_queued_task",
    {
      p_worker_id: workerId,
      p_lock_seconds: lockSeconds
    }
  )

  if (error) {
    throw error
  }

  if (!data || data.length === 0) {
    return null
  }

  return data[0] as ClaimedRuntimeTask
}
