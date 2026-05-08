import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createAnalyticsReportDefinition(input: {
  workspaceId: string;

  reportKey: string;
  reportName: string;

  active?: boolean;

  reportConfig?: Record<string, unknown>;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.reportKey?.trim()) throw new Error("reportKey is required");
  if (!input.reportName?.trim()) throw new Error("reportName is required");

  const { data, error } = await supabaseAdmin
    .from("analytics_report_definitions")
    .insert({
      workspace_id: input.workspaceId,
      report_key: input.reportKey.trim(),
      report_name: input.reportName.trim(),
      active: input.active ?? true,
      report_config: input.reportConfig ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  return data;
}
