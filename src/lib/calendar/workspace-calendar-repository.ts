import { prisma } from "@/lib/db/prisma"

import type {
  CreateWorkspaceCalendarItemInput,
  UpdateWorkspaceCalendarItemInput,
  WorkspaceCalendarItem,
} from "./workspace-calendar.types"

type WorkspaceCalendarItemRow = Omit<
  WorkspaceCalendarItem,
  "item_date" | "required_by_date" | "created_at" | "updated_at" | "completed_at"
> & {
  item_date: Date | string
  required_by_date: Date | string
  created_at: Date | string | null
  updated_at: Date | string | null
  completed_at: Date | string | null
}

export async function getWorkspaceCalendarItemRows(input: {
  workspaceId: string
  startDate?: string
  endDate?: string
}): Promise<WorkspaceCalendarItemRow[]> {
  return prisma.$queryRaw<WorkspaceCalendarItemRow[]>`
    SELECT
      id,
      title,
      description,
      item_date,
      required_by_date,
      status,
      action_status,
      category,
      workflow_type,
      priority,
      approval_required,
      assigned_to,
      completed_at,
      source_module,
      related_entity_type,
      related_entity_id,
      created_by_user_id,
      created_at,
      updated_at
    FROM workspace_calendar_items
    WHERE workspace_id = ${input.workspaceId}::uuid
      AND (${input.startDate ?? null}::date IS NULL OR required_by_date >= ${input.startDate ?? null}::date)
      AND (${input.endDate ?? null}::date IS NULL OR required_by_date <= ${input.endDate ?? null}::date)
    ORDER BY required_by_date ASC, created_at ASC
  `
}

export async function createWorkspaceCalendarItemRow(input: {
  workspaceId: string
  createdByUserId: string
  item: Required<Pick<CreateWorkspaceCalendarItemInput, "title" | "item_date">> &
    CreateWorkspaceCalendarItemInput
}): Promise<WorkspaceCalendarItemRow> {
  const rows = await prisma.$queryRaw<WorkspaceCalendarItemRow[]>`
    INSERT INTO workspace_calendar_items (
      workspace_id,
      created_by_user_id,
      title,
      description,
      item_date,
      required_by_date,
      category,
      workflow_type,
      priority,
      action_status,
      approval_required,
      assigned_to,
      source_module,
      status,
      metadata
    )
    VALUES (
      ${input.workspaceId}::uuid,
      ${input.createdByUserId},
      ${input.item.title},
      NULLIF(${input.item.description ?? ""}, ''),
      ${input.item.item_date}::date,
      ${input.item.required_by_date ?? input.item.item_date}::date,
      ${input.item.category ?? "general"},
      ${input.item.workflow_type ?? "general"},
      ${input.item.priority ?? "normal"},
      ${input.item.action_status ?? "pending"},
      ${input.item.approval_required ?? false},
      NULLIF(${input.item.assigned_to ?? input.createdByUserId}, ''),
      'manual',
      ${toLegacyStatus(input.item.action_status ?? "pending")},
      '{}'::jsonb
    )
    RETURNING
      id,
      title,
      description,
      item_date,
      required_by_date,
      status,
      action_status,
      category,
      workflow_type,
      priority,
      approval_required,
      assigned_to,
      completed_at,
      source_module,
      related_entity_type,
      related_entity_id,
      created_by_user_id,
      created_at,
      updated_at
  `

  const row = rows[0]
  if (!row) {
    throw new Error("Calendar item was not created.")
  }

  return row
}

export async function updateWorkspaceCalendarItemRow(input: {
  workspaceId: string
  itemId: string
  item: UpdateWorkspaceCalendarItemInput
}): Promise<WorkspaceCalendarItemRow | null> {
  const rows = await prisma.$queryRaw<WorkspaceCalendarItemRow[]>`
    UPDATE workspace_calendar_items
    SET
      title = COALESCE(NULLIF(${input.item.title ?? null}, ''), title),
      description = CASE
        WHEN ${input.item.description ?? null}::text IS NULL THEN description
        ELSE NULLIF(${input.item.description ?? ""}, '')
      END,
      item_date = COALESCE(${input.item.item_date ?? null}::date, item_date),
      required_by_date = COALESCE(${input.item.required_by_date ?? input.item.item_date ?? null}::date, required_by_date),
      category = COALESCE(${input.item.category ?? null}, category),
      workflow_type = COALESCE(${input.item.workflow_type ?? null}, workflow_type),
      priority = COALESCE(${input.item.priority ?? null}, priority),
      action_status = COALESCE(${input.item.action_status ?? null}, action_status),
      approval_required = COALESCE(${input.item.approval_required ?? null}::boolean, approval_required),
      assigned_to = CASE
        WHEN ${input.item.assigned_to ?? null}::text IS NULL THEN assigned_to
        ELSE NULLIF(${input.item.assigned_to ?? ""}, '')
      END,
      status = COALESCE(${input.item.action_status ? toLegacyStatus(input.item.action_status) : null}, status),
      completed_at = CASE
        WHEN ${input.item.action_status ?? null} = 'completed' AND completed_at IS NULL THEN now()
        WHEN ${input.item.action_status ?? null} IN ('pending', 'in_progress', 'awaiting_approval', 'overdue', 'cancelled') THEN NULL
        ELSE completed_at
      END,
      updated_at = now()
    WHERE id = ${input.itemId}::uuid
      AND workspace_id = ${input.workspaceId}::uuid
    RETURNING
      id,
      title,
      description,
      item_date,
      required_by_date,
      status,
      action_status,
      category,
      workflow_type,
      priority,
      approval_required,
      assigned_to,
      completed_at,
      source_module,
      related_entity_type,
      related_entity_id,
      created_by_user_id,
      created_at,
      updated_at
  `

  return rows[0] ?? null
}

export function normalizeWorkspaceCalendarRow(
  row: WorkspaceCalendarItemRow
): WorkspaceCalendarItem {
  return {
    ...row,
    item_date: normalizeDate(row.item_date),
    required_by_date: normalizeDate(row.required_by_date),
    created_at: normalizeDateTime(row.created_at),
    updated_at: normalizeDateTime(row.updated_at),
    completed_at: normalizeDateTime(row.completed_at),
  }
}

function toLegacyStatus(actionStatus: string) {
  if (actionStatus === "completed") return "done"
  if (actionStatus === "cancelled") return "cancelled"
  if (actionStatus === "in_progress") return "in_progress"
  return "open"
}

function normalizeDate(value: Date | string) {
  if (value instanceof Date) {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, "0")
    const day = String(value.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }
  return String(value).slice(0, 10)
}

function normalizeDateTime(value: Date | string | null) {
  if (!value) return null
  return value instanceof Date ? value.toISOString() : value
}
