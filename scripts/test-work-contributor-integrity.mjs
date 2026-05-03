import "dotenv/config"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function run() {
  console.log("TEST: duplicate work_contributor link should be blocked")

  const works = await supabase.from("musical_works").select("id").limit(1).single()
  const contributors = await supabase.from("contributors").select("id").limit(1).single()

  if (works.error) throw works.error
  if (contributors.error) throw contributors.error

  const payload = {
    work_id: works.data.id,
    contributor_id: contributors.data.id,
    role: "composer",
    split_type: "composition",
    percentage: 100,
    confirmed: false,
  }

  const first = await supabase.from("work_contributors").insert(payload)
  console.log("First insert:", first.error ? first.error.message : "OK")

  const second = await supabase.from("work_contributors").insert(payload)
  console.log("Second insert:", second.error ? second.error.message : "OK")

  if (!second.error) throw new Error("Duplicate link was NOT blocked")

  console.log("TEST PASSED")
}

run().catch((err) => {
  console.error("TEST FAILED")
  console.error(err)
})
