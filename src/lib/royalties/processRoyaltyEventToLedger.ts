import { calculateRoyaltyDistribution } from "./calculateRoyaltyDistribution"

export async function processRoyaltyEventToLedger({
  supabase,
  royalty_event_id,
  work_id,
  gross_amount,
  platform_fee_percentage = 0,
}: {
  supabase: any
  royalty_event_id: string
  work_id: string
  gross_amount: number
  platform_fee_percentage?: number
}) {
  const { data: splits, error: splitsError } = await supabase
    .from("work_contributors")
    .select("contributor_id, percentage")
    .eq("work_id", work_id)

  if (splitsError) throw new Error(splitsError.message)
  if (!splits || splits.length === 0) throw new Error("No contributor splits found")

  const result = calculateRoyaltyDistribution({
    gross_amount,
    platform_fee_percentage,
    splits,
  })

  const distributionRows = result.distributions.map((d) => ({
    royalty_event_id,
    contributor_id: d.contributor_id,
    percentage: d.percentage,
    amount: d.amount,
  }))

  const { error: distributionError } = await supabase
    .from("royalty_distributions")
    .insert(distributionRows)

  if (distributionError) throw new Error(distributionError.message)

  const ledgerRows = result.distributions.map((d) => ({
    royalty_event_id,
    contributor_id: d.contributor_id,
    entry_type: "credit",
    amount: d.amount,
    description: "Royalty distribution generated from royalty event",
  }))

  const { error: ledgerError } = await supabase
    .from("royalty_ledger")
    .insert(ledgerRows)

  if (ledgerError) throw new Error(ledgerError.message)

  return result
}
