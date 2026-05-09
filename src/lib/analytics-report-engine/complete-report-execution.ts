import { createClient } from "@/lib/supabase/server";

interface CompleteReportExecutionInput {
  executionId: string;

  outputStoragePath?: string | null;

  outputMetadata?: Record<string, unknown>;

  recordsProcessed?: number;
}

export async function completeReportExecution(
  input: CompleteReportExecutionInput
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("analytics_report_executions")
    .update({
      status: "completed",
      execution_completed_at: new Date().toISOString(),
      output_storage_path: input.outputStoragePath ?? null,
      output_metadata: input.outputMetadata ?? {},
      records_processed: input.recordsProcessed ?? 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.executionId);

  if (error) {
    throw new Error(
      `Failed to complete report execution: ${error.message}`
    );
  }
}
