import { supabaseAdmin } from "../../supabase/admin"

export interface ExpiredWorker {
  worker_id: string
  hostname: string
  lease_expires_at: string
}

export async function getExpiredWorkers() {
  const { data, error } = await supabaseAdmin.rpc(
    "rpc_ai_get_expired_workers"
  )

  if (error) {
    throw error
  }

  return (data ?? []) as ExpiredWorker[]
}
