import { createClient } from "@/lib/supabase/server";
import { getCurrentClerkUser } from "@/lib/authz/get-current-clerk-user";
import { ROLE_PERMISSIONS } from "@/lib/rbac/permissions";

export async function getAuthenticatedWorkspaceContext() {
  const user = await getCurrentClerkUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("workspace_user_roles")
    .select(`
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
    `)
    .eq("user_id", user.clerkUserId)
    .limit(1)
    .single();

  if (error || !data) {
    throw new Error("No workspace context found for authenticated user.");
  }

  const roleKey = data.rbac_roles?.role_key;

  const permissions =
    ROLE_PERMISSIONS.find((entry) => entry.role === roleKey)?.permissions ?? [];

  return {
    user,
    workspace: data.workspaces,
    role: data.rbac_roles,
    permissions,
  };
}
