import { completeReportExecution } from "./complete-report-execution";
import { failReportExecution } from "./fail-report-execution";
import { startReportExecution } from "./start-report-execution";

interface ExecuteReportInput {
  executionId: string;
}

export async function executeReport(
  input: ExecuteReportInput
) {
  try {
    await startReportExecution(input.executionId);

    // Phase 1 placeholder:
    // Actual analytics query execution will be added next.
    const outputMetadata = {
      engineVersion: "analytics-report-engine-v1",
      note: "Execution lifecycle completed. Report query processing pending.",
    };

    await completeReportExecution({
      executionId: input.executionId,
      outputMetadata,
      recordsProcessed: 0,
    });
  } catch (error) {
    await failReportExecution({
      executionId: input.executionId,
      errorMessage:
        error instanceof Error ? error.message : "Unknown report execution error",
    });

    throw error;
  }
}
