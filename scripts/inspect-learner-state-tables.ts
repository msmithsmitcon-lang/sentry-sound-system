import "dotenv/config"
import { supabaseAdmin } from "../src/lib/supabaseAdmin"

async function main() {
  const tables = [
    "learner_competency_states",
    "academy_learner_competency_states",
    "runtime_learner_states",
    "learner_runtime_profiles",
    "learner_progression_memory",
    "runtime_sessions"
  ]

  for (const table of tables) {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select("*")
      .limit(1)

    console.log(JSON.stringify({
      table,
      exists: !error,
      error: error?.message || null,
      sample: data || null,
    }, null, 2))
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
