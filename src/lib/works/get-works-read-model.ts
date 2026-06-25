import { getCanonicalWorkSummaryRows } from "./works-read-repository"
import {
  WORKS_READ_MODEL_MODE,
  WORKS_READ_MODEL_SOURCE,
  type WorkSummary,
  type WorksReadModelResponse,
} from "./works-read-model.types"

export async function getWorksReadModel(input: {
  limit?: number
  workspaceId: string
}): Promise<WorksReadModelResponse> {
  const rows = await getCanonicalWorkSummaryRows({
    limit: input.limit,
    workspaceId: input.workspaceId,
  })

  return {
    success: true,
    works: rows.map(normalizeWorkSummary),
    source: WORKS_READ_MODEL_SOURCE,
    mode: WORKS_READ_MODEL_MODE,
  }
}

function normalizeWorkSummary(
  row: Omit<WorkSummary, "created_at"> & {
    created_at: Date | string | null
  }
): WorkSummary {
  return {
    ...row,
    created_at:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : row.created_at,
  }
}
