import { calculateRoyaltyDistribution } from "./calculateRoyaltyDistribution"
import { validateLedgerEntries } from "./validateLedgerEntries"
import { recalculateContributorBalance } from "./recalculateContributorBalance"
import { writeAuditLog } from "../auditLog"
import { getAccountContext } from "../getAccountContext"

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
  const account_id = await getAccountContext(supabase)

  await writeAuditLog({
    supabase,
    action: "ROYALTY_PROCESS_START",
    entity_type: "royalty_event",
    entity_id: royalty_event_id,
  })

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
    account_id,
    royalty_event_id,
    work_id,
    contributor_id: d.contributor_id,
    split_type: "composition",
    percentage: d.percentage,
    amount: d.amount,
    currency: "ZAR",
    status: "calculated",
  }))

  const { data: insertedDistributions, error: distributionError } = await supabase
    .from("royalty_distributions")
    .insert(distributionRows)
    .select("id, contributor_id, amount, work_id")

  if (distributionError) throw new Error(distributionError.message)

  const ledgerRows = []

  for (const d of insertedDistributions || []) {
    ledgerRows.push({
      account_id,
      contributor_id: d.contributor_id,
      work_id: d.work_id,
      royalty_distribution_id: d.id,
      entry_type: "credit" as const,
      amount: Number(d.amount || 0),
      currency: "ZAR",
      description: "Royalty distribution",
    })
  }

  ledgerRows.push({
    account_id,
    contributor_id: insertedDistributions?.[0]?.contributor_id,
    work_id,
    royalty_distribution_id: insertedDistributions?.[0]?.id || null,
    entry_type: "debit" as const,
    amount: result.net_amount,
    currency: "ZAR",
    description: "Royalty payable (system liability)",
  })

  validateLedgerEntries(ledgerRows)

  const { error: ledgerError } = await supabase
    .from("royalty_ledger")
    .insert(ledgerRows)

  if (ledgerError) throw new Error(ledgerError.message)

  for (const d of result.distributions) {
    await recalculateContributorBalance({
      supabase,
      contributor_id: d.contributor_id,
    })
  }

  await writeAuditLog({
    supabase,
    action: "ROYALTY_PROCESS_SUCCESS",
    entity_type: "royalty_event",
    entity_id: royalty_event_id,
    metadata: { distributions: result.distributions.length },
  })

  return result
}

