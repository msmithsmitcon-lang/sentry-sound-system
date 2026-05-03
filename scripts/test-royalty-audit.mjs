import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const result = await supabase
  .from("audit_logs")
  .select("entity_type, action")
  .eq("entity_type", "royalty_distribution")
  .limit(5)

console.log(result.error || result.data)
