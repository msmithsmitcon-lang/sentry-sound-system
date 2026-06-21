import "dotenv/config"
import { supabaseAdmin } from "../src/lib/supabaseAdmin"

async function main() {
  const { data, error } = await supabaseAdmin.rpc("exec_sql", {
    sql: `
      select conname, pg_get_constraintdef(oid) as definition
      from pg_constraint
      where conname = 'chk_runtime_learner_states_mastery_level';
    `
  })

  console.log(JSON.stringify({ data, error }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
