import { createClient } from "@/lib/supabase/server";

export async function startReportExecution(
  executionId: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("analytics_report_executions")
    .update({
      status: "processing",
      execution_started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", executionId);

  if (error) {
    throw new Error(
      `Failed to start report execution: ${error.message}`
    );
  }
}
