import { recalculateContributorBalance } from "./recalculateContributorBalance"

export async function processPayoutBatch({
  supabase,
  payout_batch_id,
}: {
  supabase: any
  payout_batch_id: string
}) {
  const { data: payoutItems, error: itemsError } = await supabase
    .from("payout_items")
    .select("id, contributor_id, amount")
    .eq("payout_batch_id", payout_batch_id)

  if (itemsError) throw new Error(itemsError.message)
  if (!payoutItems || payoutItems.length === 0) throw new Error("No payout items found")

  for (const item of payoutItems) {
    const { error: ledgerError } = await supabase.from("royalty_ledger").insert([
      {
        contributor_id: item.contributor_id,
        entry_type: "debit",
        amount: Number(item.amount || 0),
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

  return {
    payout_batch_id,
    processed_items: payoutItems.length,
  }
}
