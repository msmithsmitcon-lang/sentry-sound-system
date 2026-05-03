import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function run() {
  console.log("DASHBOARD TEST START")

  const metrics = await supabase
    .from("dashboard_metrics")
    .select("*")
    .single()

  if (metrics.error) throw metrics.error

  const songs = await supabase
    .from("recent_songs")
    .select("*")

  if (songs.error) throw songs.error

  const activity = await supabase
    .from("recent_activity")
    .select("*")

  if (activity.error) throw activity.error

  console.log("Metrics:", metrics.data)
  console.log("Recent songs:", songs.data)
  console.log("Recent activity:", activity.data)
  console.log("DASHBOARD TEST PASSED")
}

run().catch((err) => {
  console.error("DASHBOARD TEST FAILED")
  console.error(err)
  process.exit(1)
})
