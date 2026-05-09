import { createClient } from "@/lib/supabase/server";
import { SystemRole } from "@/lib/rbac/types";

interface GetUserRoleInput {
  workspaceId: string;
  userId: string;
}

export async function getUserRole(
  input: GetUserRoleInput
): Promise<SystemRole | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("workspace_user_roles")
    .select("rbac_roles(role_key)")
    .eq("workspace_id", input.workspaceId)
    .eq("user_id", input.userId)
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  const roleKey = data.rbac_roles?.role_key;

  return roleKey as SystemRole;
}
