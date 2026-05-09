import { supabaseAdmin } from "@/lib/supabaseAdmin"

import type {
  CreateFinanceAuditEventInput,
  FinanceAuditEvent,
} from "@/lib/finance/audit/finance-audit-types"

export async function createFinanceAuditEvent(
  input: CreateFinanceAuditEventInput
): Promise<FinanceAuditEvent> {

  const metadata = {
    before:
      input.before,

    after:
      input.after,

    ...input.metadata,
  }

  const { data, error } =
    await supabaseAdmin
      .from("finance_audit_events")
      .insert({
        event_type:
          input.eventType,

        entity_type:
          input.entityType,

        entity_id:
          input.entityId,

        action:
          input.eventType,

        performed_by:
          input.actorId,

        metadata,
      })
      .select(`
        id,
        event_type,
        entity_type,
        entity_id,
        performed_by,
        metadata,
        created_at
      `)
      .single()

  if (error) {
    throw new Error(error.message)
  }

  return {
    id:
      data.id,

    eventType:
      data.event_type,

    entityType:
      data.entity_type,

    entityId:
      data.entity_id,

    actorId:
      data.performed_by,

    workspaceId:
      input.workspaceId,

    metadata:
      data.metadata,

    createdAt:
      data.created_at,
  }
}



