import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function run() {
  console.log("PAYOUT TEST START")

  const payout = await supabase.rpc("generate_payout_batch", {
    p_batch_name: "Test Payout Batch",
  })

  if (payout.error) throw payout.error

  console.log("Batch ID:", payout.data)

  const items = await supabase
    .from("payout_items")
    .select("contributor_id, amount, currency, status")
    .eq("payout_batch_id", payout.data)

  if (items.error) throw items.error
  if (!items.data || items.data.length === 0) {
    throw new Error("No payout items generated")
  }

  console.log("Payout items:", items.data)
  console.log("PAYOUT TEST PASSED")
}

run().catch((err) => {
  console.error("PAYOUT TEST FAILED")
  console.error(err)
  process.exit(1)
})
