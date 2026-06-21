import { supabaseAdmin } from "@/lib/supabaseAdmin"

import { ContributorAdminRepository } from "./contributor-admin"
import {
  CONTRIBUTOR_GOVERNANCE_TEST_MODE,
  ContributorIdentity,
} from "./contributor-governance"

type WorkspaceActivityRow = {
  id: string
  workspace_id: string
  activity_type: string
  entity_type: string | null
  entity_id: string | null
  message: string
  performed_by: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export const contributorAdminSupabaseRepository: ContributorAdminRepository = {
  async listContributors(input) {
    const { data, error } = await supabaseAdmin
      .from("workspace_activity")
      .select(
        "id,workspace_id,activity_type,entity_type,entity_id,message,performed_by,metadata,created_at"
      )
      .eq("workspace_id", input.workspaceId)
      .eq("activity_type", "contributor_governance_event")
      .order("created_at", { ascending: false })
      .limit(input.limit)

    if (error) throw new Error(error.message)

    return (data ?? []).map(mapWorkspaceActivityRowToContributor)
  },

  async createContributor(contributor) {
    const { data, error } = await supabaseAdmin
      .from("workspace_activity")
      .insert({
        workspace_id: contributor.workspaceId,
        activity_type: "contributor_governance_event",
        entity_type: "contributor",
        entity_id: contributor.contributorId,
        message: `Contributor governance event: ${contributor.displayName}`,
        performed_by: contributor.email ?? contributor.displayName,
        metadata: {
          contributorEvent: contributor,
          operationalAuditEvent: contributor.auditEvent,
          lifecycleEvent: contributor.lifecycleEvent,
          routeMode: CONTRIBUTOR_GOVERNANCE_TEST_MODE,
          productionActivation: false,
          persistenceTable: "workspace_activity",
        },
      })
      .select(
        "id,workspace_id,activity_type,entity_type,entity_id,message,performed_by,metadata,created_at"
      )
      .single()

    if (error) throw new Error(error.message)

    return mapWorkspaceActivityRowToContributor(data)
  },
}

function mapWorkspaceActivityRowToContributor(row: WorkspaceActivityRow): ContributorIdentity {
  const contributor = row.metadata?.contributorEvent

  if (contributor && typeof contributor === "object") {
    return {
      ...(contributor as ContributorIdentity),
      contributorId: row.entity_id ?? (contributor as ContributorIdentity).contributorId,
      createdAt: row.created_at,
    }
  }

  throw new Error(`Workspace activity row ${row.id} does not contain contributorEvent.`)
}
