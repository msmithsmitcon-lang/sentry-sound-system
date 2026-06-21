import { supabaseAdmin } from "@/lib/supabaseAdmin"

import { EvidenceReadinessActivity, EvidenceReadinessRepository } from "./evidence-readiness"

type WorkspaceActivityRow = {
  id: string
  workspace_id: string
  activity_type: string
  entity_type: string | null
  entity_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

type FileVaultItemRow = {
  id: string
  workspace_id: string
  metadata: Record<string, unknown> | null
  created_at: string
}

export const evidenceReadinessSupabaseRepository: EvidenceReadinessRepository = {
  async listReadinessActivities(input) {
    const activityLimit = Math.max(1, Math.ceil(input.limit / 2))
    const fileLimit = Math.max(1, input.limit - activityLimit)

    const [{ data: activities, error: activityError }, { data: files, error: fileError }] =
      await Promise.all([
        supabaseAdmin
          .from("workspace_activity")
          .select("id,workspace_id,activity_type,entity_type,entity_id,metadata,created_at")
          .eq("workspace_id", input.workspaceId)
          .order("created_at", { ascending: false })
          .limit(activityLimit),
        supabaseAdmin
          .from("file_vault_items")
          .select("id,workspace_id,metadata,created_at")
          .eq("workspace_id", input.workspaceId)
          .contains("metadata", { routeMode: "TEST_INTERNAL_ADMIN_ONLY" })
          .order("created_at", { ascending: false })
          .limit(fileLimit),
      ])

    if (activityError) throw new Error(activityError.message)
    if (fileError) throw new Error(fileError.message)

    return [
      ...(activities ?? []).map(mapWorkspaceActivityRow),
      ...(files ?? []).map(mapFileVaultItemRow),
    ].sort((left, right) => right.createdAt.localeCompare(left.createdAt))
  },
}

function mapWorkspaceActivityRow(row: WorkspaceActivityRow): EvidenceReadinessActivity {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    activityType: row.activity_type,
    entityType: row.entity_type,
    entityId: row.entity_id,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
  }
}

function mapFileVaultItemRow(row: FileVaultItemRow): EvidenceReadinessActivity {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    activityType: "file_vault_item",
    entityType: readString(row.metadata?.linkedEntityType) ?? "file",
    entityId: readString(row.metadata?.linkedEntityId) ?? row.id,
    metadata: row.metadata ?? {},
    createdAt: row.created_at,
  }
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}
