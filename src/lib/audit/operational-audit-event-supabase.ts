import { supabaseAdmin } from "@/lib/supabaseAdmin"

import {
  OPERATIONAL_AUDIT_TEST_MODE,
  OperationalAuditEvent,
  OperationalAuditEventRepository,
} from "./operational-audit-event"

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

export const operationalAuditEventSupabaseRepository: OperationalAuditEventRepository =
  {
    async listEvents(input) {
      const { data, error } = await supabaseAdmin
        .from("workspace_activity")
        .select(
          "id,workspace_id,activity_type,entity_type,entity_id,message,performed_by,metadata,created_at"
        )
        .eq("workspace_id", input.workspaceId)
        .eq("activity_type", "operational_audit_event")
        .order("created_at", { ascending: false })
        .limit(input.limit)

      if (error) {
        throw new Error(error.message)
      }

      return (data ?? []).map(mapWorkspaceActivityRowToEvent)
    },

    async createEvent(event) {
      const { data, error } = await supabaseAdmin
        .from("workspace_activity")
        .insert({
          workspace_id: event.workspaceId,
          activity_type: "operational_audit_event",
          entity_type: event.resourceType,
          entity_id: event.resourceId,
          message: event.resourceLabel
            ? `${event.action}: ${event.resourceLabel}`
            : event.action,
          performed_by:
            event.actorDisplayName ?? event.actorEmail ?? event.actorUserId,
          metadata: {
            operationalAuditEvent: event,
            routeMode: OPERATIONAL_AUDIT_TEST_MODE,
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

      return mapWorkspaceActivityRowToEvent(data)
    },
  }

function mapWorkspaceActivityRowToEvent(row: WorkspaceActivityRow): OperationalAuditEvent {
  const persistedEvent = row.metadata?.operationalAuditEvent

  if (persistedEvent && typeof persistedEvent === "object") {
    return {
      ...(persistedEvent as OperationalAuditEvent),
      eventId: row.id,
    }
  }

  return {
    eventId: row.id,
    workspaceId: row.workspace_id,
    actorUserId: row.performed_by,
    actorDisplayName: row.performed_by,
    actorEmail: null,
    action: row.message,
    resourceType: row.entity_type ?? "system",
    resourceId: row.entity_id,
    resourceLabel: row.message,
    category: "system",
    severity: "info",
    status: "success",
    ipAddress: null,
    userAgent: null,
    metadata: row.metadata ?? {},
    occurredAt: row.created_at,
    mode: OPERATIONAL_AUDIT_TEST_MODE,
    productionActivation: false,
  }
}
