import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createDashboardAlert(input: {
  workspaceId: string;

  alertType: string;

  severityLevel?: "low" | "normal" | "high" | "critical";

  alertTitle: string;
  alertSummary: string;

  linkedRecordType?: string | null;
  linkedRecordId?: string | null;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.alertType?.trim()) throw new Error("alertType is required");
  if (!input.alertTitle?.trim()) throw new Error("alertTitle is required");
  if (!input.alertSummary?.trim()) throw new Error("alertSummary is required");

  const { data, error } = await supabaseAdmin
    .from("dashboard_alerts")
    .insert({
      workspace_id: input.workspaceId,

      alert_type: input.alertType.trim(),

      severity_level: input.severityLevel ?? "normal",

      alert_title: input.alertTitle.trim(),
      alert_summary: input.alertSummary.trim(),

      linked_record_type: input.linkedRecordType ?? null,
      linked_record_id: input.linkedRecordId ?? null,

      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
