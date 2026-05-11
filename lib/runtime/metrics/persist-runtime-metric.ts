import { supabaseAdmin } from "../../supabase/admin"

export async function persistRuntimeMetric(
  metricType: string,
  metricValue: number,
  metadata: Record<string, unknown> = {}
) {
  const { error } = await supabaseAdmin.rpc(
    "rpc_ai_record_runtime_metric",
    {
      p_metric_type: metricType,
      p_metric_value: metricValue,
      p_metadata: metadata
    }
  )

  if (error) {
    throw error
  }
}
