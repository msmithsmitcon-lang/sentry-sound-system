import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const result = await supabase
  .from("royalty_ledger")
  .select("amount, entry_type, description")
  .limit(5)

console.log(result.error || result.data)
