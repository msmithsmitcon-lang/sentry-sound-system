import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function run() {
  console.log("PROJECT MEMBERS TEST START")

  const project = await supabase
    .from("projects")
    .select("id, party_id")
    .limit(1)
    .single()

  if (project.error) throw project.error

  const member = await supabase
    .from("project_members")
    .insert({
      project_id: project.data.id,
      party_id: project.data.party_id,
      role: "owner",
    })

  if (member.error) throw member.error

  const duplicate = await supabase
    .from("project_members")
    .insert({
      project_id: project.data.id,
      party_id: project.data.party_id,
      role: "owner",
    })

  if (!duplicate.error) {
    throw new Error("Duplicate project member role was not blocked")
  }

  console.log("Duplicate blocked:", duplicate.error.message)
  console.log("PROJECT MEMBERS TEST PASSED")
}

run().catch((err) => {
  console.error("PROJECT MEMBERS TEST FAILED")
  console.error(err)
  process.exit(1)
})
