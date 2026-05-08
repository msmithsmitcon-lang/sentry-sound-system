import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createAnalyticsMetric(input: {
  workspaceId: string;

  metricKey: string;
  metricValue: number;

  metricContext?: Record<string, unknown>;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (!input.metricKey?.trim()) {
    throw new Error("metricKey is required");
  }

  const { data, error } = await supabaseAdmin
    .from("analytics_metrics")
    .insert({
      workspace_id: input.workspaceId,

      metric_key: input.metricKey.trim(),
      metric_value: input.metricValue,

      metric_context:
        input.metricContext ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
