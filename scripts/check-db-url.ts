import "dotenv/config"

const url = process.env.DATABASE_URL ?? ""

console.log({
  startsWith: url.slice(0, 30),
  containsLocalhost: url.includes("localhost"),
  containsSupabase: url.includes("supabase.com"),
  containsPooler: url.includes("pooler"),
})
