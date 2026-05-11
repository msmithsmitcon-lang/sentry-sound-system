import { supabaseAdmin } from "../../supabase/admin"

export async function retryClaimedRuntimeTask(
  queueId: string,
  workerId: string,
  errorMessage: string,
  retryDelaySeconds = 60
) {
  const { error } = await supabaseAdmin.rpc(
    "rpc_ai_retry_claimed_task",
    {
      p_queue_id: queueId,
      p_worker_id: workerId,
      p_error_message: errorMessage,
      p_retry_delay_seconds: retryDelaySeconds
    }
  )

  if (error) {
    throw error
  }
}
