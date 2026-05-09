import { createClient } from "@/lib/supabase/server";
import {
  AnalyticsReportExecutionRecord,
  CreateAnalyticsReportExecutionInput,
} from "./types";

export async function createAnalyticsReportExecution(
  input: CreateAnalyticsReportExecutionInput
): Promise<AnalyticsReportExecutionRecord> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("analytics_report_executions")
    .insert({
      report_definition_id: input.reportDefinitionId,
      workflow_run_id: input.workflowRunId ?? null,
      scheduled_job_run_id: input.scheduledJobRunId ?? null,
      triggered_by: input.triggeredBy,
      output_format: input.outputFormat ?? "json",
      execution_parameters: input.executionParameters ?? {},
      execution_context: input.executionContext ?? {},
      created_by: input.createdBy ?? null,
      status: "queued",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create analytics report execution: ${error.message}`);
  }

  return data as AnalyticsReportExecutionRecord;
}
