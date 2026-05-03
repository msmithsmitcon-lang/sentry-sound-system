import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function run() {
  console.log("BALANCES TEST START")

  const result = await supabase
    .from("contributor_balances")
    .select("full_name, total_earned, total_paid, outstanding_balance")
    .limit(10)

  if (result.error) throw result.error

  console.log(result.data)
  console.log("BALANCES TEST PASSED")
}

run().catch((err) => {
  console.error("BALANCES TEST FAILED")
  console.error(err)
  process.exit(1)
})
