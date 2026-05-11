import { supabaseAdmin } from "../../supabase/admin"

export async function failClaimedRuntimeTask(
  queueId: string,
  workerId: string,
  errorMessage: string
) {
  const { error } = await supabaseAdmin.rpc(
    "rpc_ai_fail_claimed_task",
    {
      p_queue_id: queueId,
      p_worker_id: workerId,
      p_error_message: errorMessage
    }
  )

  if (error) {
    throw error
  }
}
