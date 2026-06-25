import { supabaseAdmin } from "@/lib/supabaseAdmin"

import {
  WorkspacePlanAssignmentWriteRecord,
  WorkspaceSubscriptionAdminRepository,
} from "./workspace-subscription-admin"

export const workspaceSubscriptionAdminSupabaseRepository: WorkspaceSubscriptionAdminRepository =
  {
    async getWorkspace(workspaceId) {
      const { data, error } = await supabaseAdmin
        .from("workspaces")
        .select("id,name,status")
        .eq("id", workspaceId)
        .maybeSingle()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },

    async listWorkspacePlanAssignments(workspaceId) {
      const { data, error } = await supabaseAdmin
        .from("workspace_plan_assignments")
        .select(
          "id,workspace_id,plan_key,subscription_status,source,is_production_eligible,effective_from,effective_until,reason,created_by,updated_by,metadata,created_at,updated_at"
        )
        .eq("workspace_id", workspaceId)
        .order("effective_from", { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data ?? []
    },

    async insertWorkspacePlanAssignment(record) {
      const { data, error } = await supabaseAdmin
        .from("workspace_plan_assignments")
        .insert(record)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },

    async updateWorkspacePlanAssignment(assignmentId, record) {
      const { data, error } = await supabaseAdmin
        .from("workspace_plan_assignments")
        .update({
          ...record,
          updated_at: new Date().toISOString(),
        } satisfies Partial<WorkspacePlanAssignmentWriteRecord> & {
          updated_at: string
        })
        .eq("id", assignmentId)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
  }
