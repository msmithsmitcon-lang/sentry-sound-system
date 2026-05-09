import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { ROLE_PERMISSIONS } from "../../src/lib/rbac/permissions";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase environment variables.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seedRbac() {
  for (const roleSet of ROLE_PERMISSIONS) {
    const { data: role, error: roleError } = await supabase
      .from("rbac_roles")
      .upsert(
        {
          role_key: roleSet.role,
          display_name: roleSet.role.charAt(0).toUpperCase() + roleSet.role.slice(1),
          is_system_role: true,
        },
        { onConflict: "role_key" }
      )
      .select("*")
      .single();

    if (roleError) throw roleError;

    for (const permission of roleSet.permissions) {
      const { data: permissionRecord, error: permissionError } = await supabase
        .from("rbac_permissions")
        .upsert(
          {
            resource: permission.resource,
            action: permission.action,
          },
          { onConflict: "resource,action" }
        )
        .select("*")
        .single();

      if (permissionError) throw permissionError;

      const { error: linkError } = await supabase
        .from("rbac_role_permissions")
        .upsert(
          {
            role_id: role.id,
            permission_id: permissionRecord.id,
          },
          { onConflict: "role_id,permission_id" }
        );

      if (linkError) throw linkError;
    }
  }

  console.log("RBAC seed completed successfully.");
}

seedRbac().catch((error) => {
  console.error("RBAC seed failed:", error);
  process.exit(1);
});
