import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function run() {
  console.log("ROYALTY ENGINE TEST START")

  const work = await supabase
    .from("musical_works")
    .select("id")
    .limit(1)
    .single()

  if (work.error) throw work.error

  const royaltyEvent = await supabase
    .from("royalty_events")
    .insert({
      work_id: work.data.id,
      source: "test_streaming",
      territory: "ZA",
      usage_type: "streaming",
      gross_amount: 1000,
      currency: "ZAR",
    })
    .select()
    .single()

  if (royaltyEvent.error) throw royaltyEvent.error

  const calculation = await supabase.rpc(
    "calculate_royalty_distributions",
    { p_royalty_event_id: royaltyEvent.data.id }
  )

  if (calculation.error) throw calculation.error

  const distributions = await supabase
    .from("royalty_distributions")
    .select("amount, percentage, currency, status")
    .eq("royalty_event_id", royaltyEvent.data.id)

  if (distributions.error) throw distributions.error
  if (!distributions.data || distributions.data.length === 0) {
    throw new Error("No royalty distributions created")
  }

  console.log("Distributions:", distributions.data)
  console.log("ROYALTY ENGINE TEST PASSED")
}

run().catch((err) => {
  console.error("ROYALTY ENGINE TEST FAILED")
  console.error(err)
  process.exit(1)
})
