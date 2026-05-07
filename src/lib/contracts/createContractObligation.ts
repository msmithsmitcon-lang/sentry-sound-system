import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createContractObligation(input: {
  workspaceId: string;
  contractId: string;

  obligationType: string;
  obligationSummary: string;

  dueDate?: string | null;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (!input.contractId) {
    throw new Error("contractId is required");
  }

  if (!input.obligationType?.trim()) {
    throw new Error("obligationType is required");
  }

  if (!input.obligationSummary?.trim()) {
    throw new Error("obligationSummary is required");
  }

  const { data, error } = await supabaseAdmin
    .from("contract_obligations")
    .insert({
      workspace_id: input.workspaceId,
      contract_id: input.contractId,

      obligation_type: input.obligationType.trim(),
      obligation_summary: input.obligationSummary.trim(),

      due_date: input.dueDate ?? null,

      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin
    .from("contract_audit_events")
    .insert({
      workspace_id: input.workspaceId,
      contract_id: input.contractId,
      event_type: "contract.obligation.created",
      event_summary: `Contract obligation created: ${input.obligationType}`,
      event_payload: {
        contractObligation: data,
      },
    });

  return data;
}
