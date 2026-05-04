import { validateLedgerEntries } from "./validateLedgerEntries"
import { recalculateContributorBalance } from "./recalculateContributorBalance"
import { writeAuditLog } from "../auditLog"
import { getAccountContext } from "../getAccountContext"

export async function reverseRoyaltyEvent({
  supabase,
  royalty_event_id,
  reason,
}: {
  supabase: any
  royalty_event_id: string
  reason: string
}) {
  const account_id = await getAccountContext(supabase)
  if (!reason || reason.trim().length < 3) {
    throw new Error("Reversal reason is required")
  }

  const { data: originalEntries, error: entriesError } = await supabase
    .from("royalty_ledger")
    .select("contributor_id, entry_type, amount, description")
    .eq("royalty_event_id", royalty_event_id)

  if (entriesError) throw new Error(entriesError.message)
  if (!originalEntries || originalEntries.length === 0) {
    throw new Error("No ledger entries found for royalty event")
  }

  const reversalEntries = originalEntries.map((entry: any) => ({ account_id,
    royalty_event_id,
    contributor_id: entry.contributor_id,
    entry_type: entry.entry_type === "credit" ? "debit" as const : "credit" as const,
    amount: Number(entry.amount || 0),
    description: `REVERSAL: ${reason}`,
  }))

  validateLedgerEntries(reversalEntries)

  const { error: insertError } = await supabase
    .from("royalty_ledger")
    .insert(reversalEntries)

  if (insertError) throw new Error(insertError.message)

  const contributorIds = Array.from(
    new Set(
      reversalEntries
        .map((entry: any) => entry.contributor_id)
        .filter(Boolean)
    )
  ) as string[]

  for (const contributor_id of contributorIds) {
    await recalculateContributorBalance({ supabase, contributor_id })
  }

  await writeAuditLog({
    supabase,
    action: "ROYALTY_EVENT_REVERSED",
    entity_type: "royalty_event",
    entity_id: royalty_event_id,
    metadata: { reason, reversal_entries: reversalEntries.length },
  })

  return {
    royalty_event_id,
    reversed: true,
    reversal_entries: reversalEntries.length,
  }
}




