type ContributorLedgerEntry = {
  entry_type: "debit" | "credit"
  amount: number
}

export async function recalculateContributorBalance({
  supabase,
  contributor_id,
}: {
  supabase: any
  contributor_id: string
}) {
  const { data: entries, error: ledgerError } = await supabase
    .from("royalty_ledger")
    .select("entry_type, amount")
    .eq("contributor_id", contributor_id)

  if (ledgerError) throw new Error(ledgerError.message)

  const ledgerEntries = (entries || []) as ContributorLedgerEntry[]

  const credits = ledgerEntries
    .filter((entry) => entry.entry_type === "credit")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0)

  const debits = ledgerEntries
    .filter((entry) => entry.entry_type === "debit")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0)

  const balance = Number((credits - debits).toFixed(2))

  const { error: balanceError } = await supabase
    .from("contributor_balances")
    .upsert(
      {
        contributor_id,
        total_credits: Number(credits.toFixed(2)),
        total_debits: Number(debits.toFixed(2)),
        balance,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "contributor_id" }
    )

  if (balanceError) throw new Error(balanceError.message)

  return {
    contributor_id,
    total_credits: Number(credits.toFixed(2)),
    total_debits: Number(debits.toFixed(2)),
    balance,
  }
}
