import {
  resolveWorkspacePlanFromAssignment,
  ResolveWorkspacePlanFromAssignmentInput,
} from "./resolve-workspace-plan-from-assignment"
import { WorkspacePlanAssignmentRow } from "./workspace-plan-assignment-row"
import { WorkspacePlanContext } from "./workspace-plan-status"

export type WorkspacePlanAssignmentFetcherInput = {
  workspaceId: string
}

export type WorkspacePlanAssignmentFetcher = (
  input: WorkspacePlanAssignmentFetcherInput
) => Promise<readonly WorkspacePlanAssignmentRow[]>

export type ResolveWorkspacePlanDbAdapterInput = Omit<
  ResolveWorkspacePlanFromAssignmentInput,
  "assignmentRows"
> & {
  assignmentRows?: readonly WorkspacePlanAssignmentRow[] | null
  fetchAssignmentRows?: WorkspacePlanAssignmentFetcher
}

export async function resolveWorkspacePlanDbAdapter(
  input: ResolveWorkspacePlanDbAdapterInput
): Promise<WorkspacePlanContext> {
  const workspaceId = input.workspace?.id ?? null

  if (input.assignmentRows) {
    return resolveWorkspacePlanFromAssignment({
      workspace: input.workspace,
      assignmentRows: input.assignmentRows,
      now: input.now,
    })
  }

  if (!workspaceId || !input.fetchAssignmentRows) {
    return resolveWorkspacePlanFromAssignment({
      workspace: input.workspace,
      assignmentRows: [],
      now: input.now,
    })
  }

  try {
    const assignmentRows = await input.fetchAssignmentRows({ workspaceId })

    return resolveWorkspacePlanFromAssignment({
      workspace: input.workspace,
      assignmentRows,
      now: input.now,
    })
  } catch {
    return resolveWorkspacePlanFromAssignment({
      workspace: input.workspace,
      assignmentRows: [],
      now: input.now,
    })
  }
}
