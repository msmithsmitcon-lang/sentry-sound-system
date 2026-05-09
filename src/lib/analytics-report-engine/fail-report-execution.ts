import { createClient } from "@/lib/supabase/server";

interface FailReportExecutionInput {
  executionId: string;
  errorMessage: string;
}

export async function failReportExecution(
  input: FailReportExecutionInput
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("analytics_report_executions")
    .update({
      status: "failed",
      execution_completed_at: new Date().toISOString(),
      error_message: input.errorMessage,
      retry_count: 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.executionId);

  if (error) {
    throw new Error(
      `Failed to fail report execution: ${error.message}`
    );
  }
}
