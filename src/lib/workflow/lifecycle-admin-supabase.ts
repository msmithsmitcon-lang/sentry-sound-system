import { supabaseAdmin } from "@/lib/supabaseAdmin"

import { LIFECYCLE_TEST_MODE } from "./lifecycle-state"
import { LifecycleAdminRepository } from "./lifecycle-admin"
import { LifecycleEvent } from "./lifecycle-event-builder"

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

export const lifecycleAdminSupabaseRepository: LifecycleAdminRepository = {
  async listLifecycleEvents(input) {
    const { data, error } = await supabaseAdmin
      .from("workspace_activity")
      .select(
        "id,workspace_id,activity_type,entity_type,entity_id,message,performed_by,metadata,created_at"
      )
      .eq("workspace_id", input.workspaceId)
      .eq("activity_type", "lifecycle_transition")
      .eq("entity_type", input.entityType)
      .eq("entity_id", input.entityId)
      .order("created_at", { ascending: false })
      .limit(input.limit)

    if (error) {
      throw new Error(error.message)
    }

    return (data ?? []).map(mapWorkspaceActivityRowToLifecycleEvent)
  },

  async createLifecycleEvent(event) {
    const { data, error } = await supabaseAdmin
      .from("workspace_activity")
      .insert({
        workspace_id: event.workspaceId,
        activity_type: "lifecycle_transition",
        entity_type: event.entityType,
        entity_id: event.entityId,
        message: `${event.transitionKey}: ${event.currentState} -> ${event.nextState}`,
        performed_by: event.actorUserId,
        metadata: {
          lifecycleEvent: event,
          operationalAuditEvent: event.auditEvent,
          routeMode: LIFECYCLE_TEST_MODE,
          productionActivation: false,
          persistenceTable: "workspace_activity",
        },
      })
      .select(
        "id,workspace_id,activity_type,entity_type,entity_id,message,performed_by,metadata,created_at"
      )
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return mapWorkspaceActivityRowToLifecycleEvent(data)
  },
}

function mapWorkspaceActivityRowToLifecycleEvent(row: WorkspaceActivityRow): LifecycleEvent {
  const persistedEvent = row.metadata?.lifecycleEvent

  if (persistedEvent && typeof persistedEvent === "object") {
    return {
      ...(persistedEvent as LifecycleEvent),
      eventId: row.id,
    }
  }

  throw new Error(
    `Workspace activity row ${row.id} does not contain metadata.lifecycleEvent.`
  )
}
