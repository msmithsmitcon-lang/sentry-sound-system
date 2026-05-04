import { calculateRoyaltyDistribution } from "./calculateRoyaltyDistribution"
import { validateLedgerEntries } from "./validateLedgerEntries"

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
  const { data: existingDistributions, error: existingError } = await supabase
    .from("royalty_distributions")
    .select("id")
    .eq("royalty_event_id", royalty_event_id)
    .limit(1)

  if (existingError) throw new Error(existingError.message)

  if (existingDistributions && existingDistributions.length > 0) {
    throw new Error("Royalty event already processed")
  }

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

    const ledgerRows = []

  // CREDIT entries (contributors earn)
  for (const d of result.distributions) {
    ledgerRows.push({
      royalty_event_id,
      contributor_id: d.contributor_id,
      entry_type: "credit" as const,
      amount: d.amount,
      description: "Royalty distribution",
    })
  }

  // DEBIT entry (system outflow)
  ledgerRows.push({
    royalty_event_id,
    contributor_id: null,
    entry_type: "debit" as const,
    amount: result.net_amount,
    description: "Royalty payable (system liability)",
  })

    validateLedgerEntries(ledgerRows)

  const { error: ledgerError } = await supabase
    .from("royalty_ledger")
    .insert(ledgerRows)

  if (ledgerError) throw new Error(ledgerError.message)

  return result
}



