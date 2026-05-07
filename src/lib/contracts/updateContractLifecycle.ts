import { supabaseAdmin } from "@/lib/supabase/admin";

export const CONTRACT_LIFECYCLE_STATUSES = [
  "draft",
  "review",
  "signed",
  "active",
  "suspended",
  "expired",
  "terminated",
  "archived",
] as const;

export type ContractLifecycleStatus =
  typeof CONTRACT_LIFECYCLE_STATUSES[number];

export async function updateContractLifecycle(input: {
  workspaceId: string;
  contractId: string;
  lifecycleStatus: ContractLifecycleStatus;
}) {
  if (!input.workspaceId) throw new Error("workspaceId is required");
  if (!input.contractId) throw new Error("contractId is required");

  if (!CONTRACT_LIFECYCLE_STATUSES.includes(input.lifecycleStatus)) {
    throw new Error("Invalid contract lifecycle status");
  }

  const { data, error } = await supabaseAdmin
    .from("contracts")
    .update({ lifecycle_status: input.lifecycleStatus })
    .eq("id", input.contractId)
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin.from("contract_audit_events").insert({
    workspace_id: input.workspaceId,
    contract_id: input.contractId,
    event_type: "contract.lifecycle.updated",
    event_summary: `Contract lifecycle updated to ${input.lifecycleStatus}`,
    event_payload: { lifecycleStatus: input.lifecycleStatus },
  });

  return data;
}
