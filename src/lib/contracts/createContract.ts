import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createContract(input: {
  workspaceId: string;

  contractType:
    | "artist"
    | "distribution"
    | "publishing"
    | "licensing"
    | "management"
    | "producer"
    | "sync"
    | "label"
    | "service";

  title: string;

  contractNumber?: string | null;

  effectiveFrom?: string | null;
  effectiveTo?: string | null;

  governingCountryCode?: string | null;
  governingRegion?: string | null;

  autoRenew?: boolean;

  royaltyTerms?: Record<string, unknown>;
  paymentTerms?: Record<string, unknown>;

  metadata?: Record<string, unknown>;
}) {
  if (!input.workspaceId) {
    throw new Error("workspaceId is required");
  }

  if (!input.contractType) {
    throw new Error("contractType is required");
  }

  if (!input.title?.trim()) {
    throw new Error("title is required");
  }

  const { data, error } = await supabaseAdmin
    .from("contracts")
    .insert({
      workspace_id: input.workspaceId,

      contract_type: input.contractType,

      title: input.title.trim(),

      contract_number: input.contractNumber ?? null,

      effective_from: input.effectiveFrom ?? null,
      effective_to: input.effectiveTo ?? null,

      governing_country_code:
        input.governingCountryCode ?? null,

      governing_region:
        input.governingRegion ?? null,

      auto_renew: input.autoRenew ?? false,

      royalty_terms: input.royaltyTerms ?? {},
      payment_terms: input.paymentTerms ?? {},

      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabaseAdmin
    .from("contract_audit_events")
    .insert({
      workspace_id: input.workspaceId,
      contract_id: data.id,
      event_type: "contract.created",
      event_summary: `Contract created: ${data.title}`,
      event_payload: {
        contract: data,
      },
    });

  return data;
}
