export const WORKSPACE_CALENDAR_SOURCE =
  "workspace_calendar_items_v1" as const

export type WorkspaceCalendarCategory =
  | "onboarding"
  | "song_profile"
  | "submission"
  | "release"
  | "finance"
  | "crm"
  | "general"

export type WorkspaceCalendarSourceModule =
  | "workspace_setup"
  | "works"
  | "submissions"
  | "releases"
  | "finance"
  | "crm"
  | "academy"
  | "manual"

export type WorkspaceCalendarStatus =
  | "open"
  | "in_progress"
  | "done"
  | "cancelled"

export type WorkspaceActionStatus =
  | "pending"
  | "in_progress"
  | "awaiting_approval"
  | "completed"
  | "overdue"
  | "cancelled"

export type WorkspaceWorkflowType =
  | "onboarding"
  | "song_profile"
  | "approval"
  | "submission"
  | "release"
  | "finance"
  | "crm"
  | "evidence"
  | "readiness"
  | "general"

export type WorkspaceWorkflowPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent"

export type WorkspaceCalendarItem = {
  id: string
  title: string
  description: string | null
  item_date: string
  required_by_date: string
  status: WorkspaceCalendarStatus
  action_status: WorkspaceActionStatus
  category: WorkspaceCalendarCategory
  workflow_type: WorkspaceWorkflowType
  priority: WorkspaceWorkflowPriority
  approval_required: boolean
  assigned_to: string | null
  completed_at: string | null
  source_module: WorkspaceCalendarSourceModule
  related_entity_type: string | null
  related_entity_id: string | null
  created_by_user_id: string | null
  created_at: string | null
  updated_at: string | null
}

export type WorkspaceCalendarResponse = {
  success: true
  items: WorkspaceCalendarItem[]
  current_user_id: string
  source: typeof WORKSPACE_CALENDAR_SOURCE
}

export type CreateWorkspaceCalendarItemInput = {
  title?: string
  description?: string
  item_date?: string
  category?: WorkspaceCalendarCategory
  assigned_to?: string
  action_status?: WorkspaceActionStatus
  required_by_date?: string
  workflow_type?: WorkspaceWorkflowType
  priority?: WorkspaceWorkflowPriority
  approval_required?: boolean
}

export type UpdateWorkspaceCalendarItemInput = Partial<
  Pick<
    CreateWorkspaceCalendarItemInput,
    | "title"
    | "description"
    | "item_date"
    | "category"
    | "assigned_to"
    | "action_status"
    | "required_by_date"
    | "workflow_type"
    | "priority"
    | "approval_required"
  >
>

export type WorkspaceCalendarItemMutationResponse = {
  success: true
  item: WorkspaceCalendarItem
  source: typeof WORKSPACE_CALENDAR_SOURCE
}
