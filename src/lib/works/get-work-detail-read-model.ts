import {
  getCanonicalWorkContributorRows,
  getCanonicalWorkDetailRow,
} from "./work-detail-read-repository"
import {
  WORK_DETAIL_READ_MODEL_MODE,
  WORK_DETAIL_READ_MODEL_SOURCE,
  type WorkDetail,
  type WorkDetailReadModelResponse,
} from "./work-detail-read-model.types"

export async function getWorkDetailReadModel(
  workId: string,
  workspaceId: string
): Promise<WorkDetailReadModelResponse | null> {
  const row = await getCanonicalWorkDetailRow(workId, workspaceId)

  if (!row) return null

  const contributors = await getCanonicalWorkContributorRows(workId, workspaceId)

  return {
    success: true,
    work: normalizeWorkDetail({
      ...row,
      contributors,
    }),
    source: WORK_DETAIL_READ_MODEL_SOURCE,
    mode: WORK_DETAIL_READ_MODEL_MODE,
  }
}

function normalizeWorkDetail(
  row: Omit<WorkDetail, "created_at"> & {
    created_at: Date | string | null
  }
): WorkDetail {
  return {
    ...row,
    created_at:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : row.created_at,
  }
}
