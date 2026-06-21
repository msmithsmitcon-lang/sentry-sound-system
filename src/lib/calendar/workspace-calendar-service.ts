import {
  createWorkspaceCalendarItemRow,
  getWorkspaceCalendarItemRows,
  normalizeWorkspaceCalendarRow,
  updateWorkspaceCalendarItemRow,
} from "./workspace-calendar-repository"
import {
  WORKSPACE_CALENDAR_SOURCE,
  type UpdateWorkspaceCalendarItemInput,
  type WorkspaceActionStatus,
  type CreateWorkspaceCalendarItemInput,
  type WorkspaceCalendarCategory,
  type WorkspaceCalendarItemMutationResponse,
  type WorkspaceCalendarResponse,
  type WorkspaceWorkflowPriority,
  type WorkspaceWorkflowType,
} from "./workspace-calendar.types"

const CATEGORY_VALUES = new Set<WorkspaceCalendarCategory>([
  "onboarding",
  "song_profile",
  "submission",
  "release",
  "finance",
  "crm",
  "general",
])

const ACTION_STATUS_VALUES = new Set<WorkspaceActionStatus>([
  "pending",
  "in_progress",
  "awaiting_approval",
  "completed",
  "overdue",
  "cancelled",
])

const WORKFLOW_TYPE_VALUES = new Set<WorkspaceWorkflowType>([
  "onboarding",
  "song_profile",
  "approval",
  "submission",
  "release",
  "finance",
  "crm",
  "evidence",
  "readiness",
  "general",
])

const PRIORITY_VALUES = new Set<WorkspaceWorkflowPriority>([
  "low",
  "normal",
  "high",
  "urgent",
])

export async function getWorkspaceCalendar(input: {
  workspaceId: string
  currentUserId: string
  startDate?: string
  endDate?: string
}): Promise<WorkspaceCalendarResponse> {
  const rows = await getWorkspaceCalendarItemRows(input)

  return {
    success: true,
    items: rows.map(normalizeWorkspaceCalendarRow),
    current_user_id: input.currentUserId,
    source: WORKSPACE_CALENDAR_SOURCE,
  }
}

export async function createWorkspaceCalendarItem(input: {
  workspaceId: string
  createdByUserId: string
  item: CreateWorkspaceCalendarItemInput
}) {
  const title = normalizeText(input.item.title)
  const requiredByDate = normalizeDate(input.item.required_by_date)
  const itemDate = normalizeDate(input.item.item_date) || requiredByDate

  if (!title) {
    throw new Error("title is required.")
  }

  if (!itemDate && !requiredByDate) {
    throw new Error("required_by_date is required.")
  }

  const category = CATEGORY_VALUES.has(input.item.category as WorkspaceCalendarCategory)
    ? input.item.category
    : "general"
  const workflowType = WORKFLOW_TYPE_VALUES.has(input.item.workflow_type as WorkspaceWorkflowType)
    ? input.item.workflow_type
    : categoryToWorkflowType(category)
  const actionStatus = ACTION_STATUS_VALUES.has(input.item.action_status as WorkspaceActionStatus)
    ? input.item.action_status
    : "pending"
  const priority = PRIORITY_VALUES.has(input.item.priority as WorkspaceWorkflowPriority)
    ? input.item.priority
    : "normal"

  const row = await createWorkspaceCalendarItemRow({
    workspaceId: input.workspaceId,
    createdByUserId: input.createdByUserId,
    item: {
      title,
      item_date: itemDate,
      required_by_date: requiredByDate || itemDate,
      description: normalizeText(input.item.description),
      category,
      workflow_type: workflowType,
      priority,
      action_status: actionStatus,
      approval_required: input.item.approval_required === true,
      assigned_to: normalizeText(input.item.assigned_to) || input.createdByUserId,
    },
  })

  return {
    success: true,
    item: normalizeWorkspaceCalendarRow(row),
    source: WORKSPACE_CALENDAR_SOURCE,
  }
}

export async function updateWorkspaceCalendarItem(input: {
  workspaceId: string
  itemId: string
  item: UpdateWorkspaceCalendarItemInput
}): Promise<WorkspaceCalendarItemMutationResponse> {
  const update = normalizeUpdateInput(input.item)

  const row = await updateWorkspaceCalendarItemRow({
    workspaceId: input.workspaceId,
    itemId: input.itemId,
    item: update,
  })

  if (!row) {
    throw new Error("Calendar item not found.")
  }

  return {
    success: true,
    item: normalizeWorkspaceCalendarRow(row),
    source: WORKSPACE_CALENDAR_SOURCE,
  }
}

function normalizeUpdateInput(
  item: UpdateWorkspaceCalendarItemInput
): UpdateWorkspaceCalendarItemInput {
  return {
    title: item.title === undefined ? undefined : normalizeText(item.title),
    description:
      item.description === undefined ? undefined : normalizeText(item.description),
    item_date: item.item_date === undefined ? undefined : normalizeDate(item.item_date),
    required_by_date:
      item.required_by_date === undefined
        ? undefined
        : normalizeDate(item.required_by_date),
    category: CATEGORY_VALUES.has(item.category as WorkspaceCalendarCategory)
      ? item.category
      : undefined,
    workflow_type: WORKFLOW_TYPE_VALUES.has(item.workflow_type as WorkspaceWorkflowType)
      ? item.workflow_type
      : undefined,
    priority: PRIORITY_VALUES.has(item.priority as WorkspaceWorkflowPriority)
      ? item.priority
      : undefined,
    action_status: ACTION_STATUS_VALUES.has(item.action_status as WorkspaceActionStatus)
      ? item.action_status
      : undefined,
    approval_required:
      typeof item.approval_required === "boolean"
        ? item.approval_required
        : undefined,
    assigned_to:
      item.assigned_to === undefined ? undefined : normalizeText(item.assigned_to),
  }
}

function categoryToWorkflowType(
  category: WorkspaceCalendarCategory | undefined
): WorkspaceWorkflowType {
  if (!category || category === "general") return "general"
  return category
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function normalizeDate(value: unknown) {
  if (typeof value !== "string") return ""
  const trimmed = value.trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return ""
  return trimmed
}
