import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function run() {
  console.log("SETTLEMENT TEST START")

  const payout = await supabase.rpc("generate_payout_batch", {
    p_batch_name: "Settlement Test Batch",
  })

  if (payout.error) throw payout.error

  const settlement = await supabase.rpc("create_settlements_from_payout_batch", {
    p_payout_batch_id: payout.data,
  })

  if (settlement.error) throw settlement.error

  const records = await supabase
    .from("settlements")
    .select("contributor_id, amount, currency, status")
    .eq("payout_batch_id", payout.data)

  if (records.error) throw records.error
  if (!records.data || records.data.length === 0) {
    throw new Error("No settlements created")
  }

  console.log("Settlements:", records.data)
  console.log("SETTLEMENT TEST PASSED")
}

run().catch((err) => {
  console.error("SETTLEMENT TEST FAILED")
  console.error(err)
  process.exit(1)
})
