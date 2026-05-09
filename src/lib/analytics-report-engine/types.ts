export type AnalyticsReportExecutionStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export type AnalyticsReportTriggeredBy =
  | "manual"
  | "scheduled"
  | "workflow"
  | "system";

export type AnalyticsReportOutputFormat =
  | "json"
  | "csv"
  | "xlsx"
  | "pdf";

export interface CreateAnalyticsReportExecutionInput {
  reportDefinitionId: string;

  workflowRunId?: string | null;
  scheduledJobRunId?: string | null;

  triggeredBy: AnalyticsReportTriggeredBy;

  outputFormat?: AnalyticsReportOutputFormat;

  executionParameters?: Record<string, unknown>;
  executionContext?: Record<string, unknown>;

  createdBy?: string | null;
}

export interface AnalyticsReportExecutionRecord {
  id: string;

  report_definition_id: string;

  workflow_run_id: string | null;
  scheduled_job_run_id: string | null;

  status: AnalyticsReportExecutionStatus;

  triggered_by: AnalyticsReportTriggeredBy;

  execution_started_at: string | null;
  execution_completed_at: string | null;

  output_format: AnalyticsReportOutputFormat | null;

  output_storage_path: string | null;

  output_metadata: Record<string, unknown>;

  execution_parameters: Record<string, unknown>;
  execution_context: Record<string, unknown>;

  records_processed: number;

  retry_count: number;

  error_message: string | null;

  created_by: string | null;

  created_at: string;
  updated_at: string;
}
