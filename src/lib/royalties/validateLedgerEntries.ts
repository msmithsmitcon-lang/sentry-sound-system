export type LedgerEntry = {
  entry_type: "debit" | "credit"
  amount: number
}

export function validateLedgerEntries(entries: LedgerEntry[]) {
  const totalDebits = entries
    .filter((entry) => entry.entry_type === "debit")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0)

  const totalCredits = entries
    .filter((entry) => entry.entry_type === "credit")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0)

  if (Number(totalDebits.toFixed(2)) !== Number(totalCredits.toFixed(2))) {
    throw new Error("Ledger entries must balance")
  }

  return {
    totalDebits: Number(totalDebits.toFixed(2)),
    totalCredits: Number(totalCredits.toFixed(2)),
    balanced: true,
  }
}
