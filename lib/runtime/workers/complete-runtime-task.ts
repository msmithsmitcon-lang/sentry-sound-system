import { supabaseAdmin } from "../../supabase/admin"

export async function completeClaimedRuntimeTask(
  queueId: string,
  workerId: string
) {
  const { error } = await supabaseAdmin.rpc(
    "rpc_ai_complete_claimed_task",
    {
      p_queue_id: queueId,
      p_worker_id: workerId
    }
  )

  if (error) {
    throw error
  }
}
