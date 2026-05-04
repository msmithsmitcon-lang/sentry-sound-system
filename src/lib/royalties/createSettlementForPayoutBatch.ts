import { writeAuditLog } from "../auditLog"

export async function createSettlementForPayoutBatch({
  supabase,
  payout_batch_id,
}: {
  supabase: any
  payout_batch_id: string
}) {
  const { data: batch, error: batchError } = await supabase
    .from("payout_batches")
    .select("id, status")
    .eq("id", payout_batch_id)
    .maybeSingle()

  if (batchError) throw new Error(batchError.message)
  if (!batch) throw new Error("Payout batch not found")
  if (batch.status !== "processed") throw new Error("Payout batch must be processed before settlement")

  const { data: existingSettlement, error: existingError } = await supabase
    .from("settlements")
    .select("id")
    .eq("payout_batch_id", payout_batch_id)
    .maybeSingle()

  if (existingError) throw new Error(existingError.message)
  if (existingSettlement) throw new Error("Settlement already exists for payout batch")

  const { data: settlement, error: settlementError } = await supabase
    .from("settlements")
    .insert([
      {
        payout_batch_id,
        status: "settled",
        settled_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (settlementError) throw new Error(settlementError.message)

  await writeAuditLog({
    supabase,
    action: "SETTLEMENT_CREATED",
    entity_type: "settlement",
    entity_id: settlement.id,
    metadata: { payout_batch_id },
  })

  return settlement
}
