import { syncCurrentClerkUserToWorkspace } from "@/lib/authz/clerk-sync/sync-clerk-user";
import { getCurrentClerkUser } from "@/lib/authz/get-current-clerk-user";
import { ROLE_PERMISSIONS } from "@/lib/rbac/permissions";
import { createClient } from "@/lib/supabase/server";

type WorkspaceContextRow = {
  workspace_id: string;
  user_id: string;
  rbac_roles:
    | {
        role_key: string;
        display_name: string | null;
      }
    | Array<{
        role_key: string;
        display_name: string | null;
      }>
    | null;
  workspaces:
    | {
        id: string;
        name: string | null;
        legal_name: string | null;
        country_code: string | null;
        base_currency: string | null;
        status: string | null;
      }
    | Array<{
        id: string;
        name: string | null;
        legal_name: string | null;
        country_code: string | null;
        base_currency: string | null;
        status: string | null;
      }>
    | null;
};

export async function getAuthenticatedWorkspaceContext() {
  const user = await getCurrentClerkUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  const supabase = await createClient();
  let data = await findWorkspaceContextForUser(supabase, user.clerkUserId);

  if (!data) {
    await syncCurrentClerkUserToWorkspace();
    data = await findWorkspaceContextForUser(supabase, user.clerkUserId);
  }

  if (!data) {
    throw new Error("No workspace context found for authenticated user.");
  }

  const role = Array.isArray(data.rbac_roles) ? data.rbac_roles[0] : data.rbac_roles;
  const workspace = Array.isArray(data.workspaces) ? data.workspaces[0] : data.workspaces;

  if (!role || !workspace) {
    throw new Error("Workspace context is incomplete for authenticated user.");
  }

  const permissions =
    ROLE_PERMISSIONS.find((entry) => entry.role === role.role_key)?.permissions ?? [];

  return {
    user,
    workspace,
    role,
    permissions,
  };
}

async function findWorkspaceContextForUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
  clerkUserId: string
): Promise<WorkspaceContextRow | null> {
  const { data, error } = await supabase
    .from("workspace_user_roles")
    .select(
      `
      workspace_id,
      user_id,
      rbac_roles (
        role_key,
        display_name
      ),
      workspaces (
        id,
        name,
        legal_name,
        country_code,
        base_currency,
        status
      )
    `
    )
    .eq("user_id", clerkUserId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Workspace context lookup failed: ${error.message}`);
  }

  return data as WorkspaceContextRow | null;
}
