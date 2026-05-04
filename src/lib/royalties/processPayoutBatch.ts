import { recalculateContributorBalance } from "./recalculateContributorBalance"
import { writeAuditLog } from "../auditLog"

export async function processPayoutBatch({
  supabase,
  payout_batch_id,
}: {
  supabase: any
  payout_batch_id: string
}) {
    await writeAuditLog({
    supabase,
    action: "PAYOUT_PROCESS_START",
    entity_type: "payout_batch",
    entity_id: payout_batch_id,
  })

  const { data: batch, error: batchLookupError } = await supabase
    .from("payout_batches")
    .select("id, status")
    .eq("id", payout_batch_id)
    .maybeSingle()

  if (batchLookupError) throw new Error(batchLookupError.message)
  if (!batch) throw new Error("Payout batch not found")
  if (batch.status === "processed") throw new Error("Payout batch already processed")

  const { data: payoutItems, error: itemsError } = await supabase
    .from("payout_items")
    .select("id, contributor_id, amount")
    .eq("payout_batch_id", payout_batch_id)

  if (itemsError) throw new Error(itemsError.message)
  if (!payoutItems || payoutItems.length === 0) throw new Error("No payout items found")

  for (const item of payoutItems) {
    const payoutAmount = Number(item.amount || 0)

    if (payoutAmount <= 0) {
      throw new Error("Payout amount must be greater than 0")
    }

    const currentBalance = await recalculateContributorBalance({
      supabase,
      contributor_id: item.contributor_id,
    })

    if (currentBalance.balance < payoutAmount) {
      throw new Error("Insufficient contributor balance")
    }
  }

  for (const item of payoutItems) {
    const payoutAmount = Number(item.amount || 0)

    const { error: ledgerError } = await supabase.from("royalty_ledger").insert([
      {
        contributor_id: item.contributor_id,
        entry_type: "debit",
        amount: payoutAmount,
        description: "Payout deduction",
      },
    ])

    if (ledgerError) throw new Error(ledgerError.message)

    await recalculateContributorBalance({
      supabase,
      contributor_id: item.contributor_id,
    })
  }

  const { error: batchError } = await supabase
    .from("payout_batches")
    .update({ status: "processed", processed_at: new Date().toISOString() })
    .eq("id", payout_batch_id)

  if (batchError) throw new Error(batchError.message)

  await writeAuditLog({
    supabase,
    action: "PAYOUT_PROCESS_SUCCESS",
    entity_type: "payout_batch",
    entity_id: payout_batch_id,
    metadata: { processed_items: payoutItems.length },
  })

  return {
    payout_batch_id,
    processed_items: payoutItems.length,
  }
}

