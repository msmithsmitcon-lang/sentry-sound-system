import "dotenv/config"
import { supabaseAdmin } from "../src/lib/supabaseAdmin"

async function main() {
  const { data, error } = await supabaseAdmin
    .from("runtime_telemetry_events")
    .select("*")
    .limit(1)

  console.log(JSON.stringify({
    success: !error,
    error,
    sample: data,
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
