export async function recalculateContributorBalance({
  supabase,
  contributor_id,
}: {
  supabase: any
  contributor_id: string
}) {
  const { data: balance, error } = await supabase
    .from("contributor_balances")
    .select("contributor_id, full_name, total_earned, total_paid, outstanding_balance")
    .eq("contributor_id", contributor_id)
    .maybeSingle()

  if (error) throw new Error(error.message)

  return {
    contributor_id,
    full_name: balance?.full_name || null,
    total_earned: Number(balance?.total_earned || 0),
    total_paid: Number(balance?.total_paid || 0),
    outstanding_balance: Number(balance?.outstanding_balance || 0),
    balance: Number(balance?.outstanding_balance || 0),
  }
}
