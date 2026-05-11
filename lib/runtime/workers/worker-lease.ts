import { supabaseAdmin } from "../../supabase/admin"

export async function extendWorkerLease(
  workerId: string,
  leaseSeconds = 60
) {
  const { error } = await supabaseAdmin.rpc(
    "rpc_ai_extend_worker_lease",
    {
      p_worker_id: workerId,
      p_lease_seconds: leaseSeconds
    }
  )

  if (error) {
    throw error
  }
}
