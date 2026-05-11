import { supabaseAdmin } from "../../supabase/admin"

export async function persistRuntimeEvent(
  eventType: string,
  severity: string,
  message: string,
  workerId: string | null = null,
  taskId: string | null = null,
  metadata: Record<string, unknown> = {}
) {
  const { error } = await supabaseAdmin.rpc(
    "rpc_ai_record_runtime_event",
    {
      p_event_type: eventType,
      p_severity: severity,
      p_worker_id: workerId,
      p_task_id: taskId,
      p_message: message,
      p_metadata: metadata
    }
  )

  if (error) {
    throw error
  }
}
