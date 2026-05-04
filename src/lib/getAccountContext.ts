export async function getAccountContext(supabase: any) {
  // TEMP: hardcoded account (replace later with auth)
  const { data, error } = await supabase
    .from("accounts")
    .select("id")
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) throw new Error("No account found")

  return data.id
}
