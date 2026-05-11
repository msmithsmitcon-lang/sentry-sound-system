import { supabaseAdmin } from "../../supabase/admin"

export async function upsertRuntimeWorker(
  workerId: string,
  hostname: string,
  status: string,
  activeTaskCount: number
) {
  const { error } = await supabaseAdmin.rpc(
    "rpc_ai_upsert_worker",
    {
      p_worker_id: workerId,
      p_hostname: hostname,
      p_status: status,
      p_active_task_count: activeTaskCount
    }
  )

  if (error) {
    throw error
  }
}
