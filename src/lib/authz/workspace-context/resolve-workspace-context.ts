import { createClient } from "@/lib/supabase/server";
import { getCurrentClerkUser } from "@/lib/authz/get-current-clerk-user";
import { ROLE_PERMISSIONS } from "@/lib/rbac/permissions";

export async function resolveWorkspaceContext() {
  const user = await getCurrentClerkUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  const supabase = await createClient();

  const { data: membership, error: membershipError } = await supabase
    .from("workspace_user_roles")
    .select(`
      workspace_id,
      role_id,
      workspaces (
        id,
        name,
        legal_name,
        country_code,
        base_currency,
        status
      ),
      rbac_roles (
        id,
        role_key,
        display_name
      )
    `)
    .eq("user_id", user.clerkUserId)
    .limit(1)
    .single();

  if (membershipError || !membership) {
    throw new Error("Workspace membership not found.");
  }

  const role = Array.isArray(membership.rbac_roles)
    ? membership.rbac_roles[0]
    : membership.rbac_roles;

  const workspace = Array.isArray(membership.workspaces)
    ? membership.workspaces[0]
    : membership.workspaces;

  const permissions =
    ROLE_PERMISSIONS.find((entry) => entry.role === role.role_key)?.permissions ?? [];

  return {
    user,
    workspace,
    role,
    permissions,
  };
}
