import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function run() {
  console.log("WORKFLOW TEST START")

  // 1. Create party (producer/label)
  const party = await supabase
    .from("parties")
    .insert({
      party_type: "producer_entity",
      display_name: "Test Producer Label",
    })
    .select()
    .single()

  if (party.error) throw party.error

  // 2. Assign roles
  await supabase.from("party_roles").insert([
    { party_id: party.data.id, role: "producer" },
    { party_id: party.data.id, role: "label" },
    { party_id: party.data.id, role: "master_owner" },
    { party_id: party.data.id, role: "payee" },
  ])

  // 3. Create project
  const project = await supabase
    .from("projects")
    .insert({
      party_id: party.data.id,
      project_name: "Test Album Project",
      project_type: "album",
    })
    .select()
    .single()

  if (project.error) throw project.error

  // 4. Create workflow tasks
  await supabase.from("workflow_tasks").insert([
    {
      project_id: project.data.id,
      task_type: "create_song",
    },
    {
      project_id: project.data.id,
      task_type: "add_contributors",
    },
    {
      project_id: project.data.id,
      task_type: "confirm_splits",
    },
  ])

  const tasks = await supabase
    .from("workflow_tasks")
    .select("task_type, status")
    .eq("project_id", project.data.id)

  if (tasks.error) throw tasks.error

  console.log("Tasks:", tasks.data)
  console.log("WORKFLOW TEST PASSED")
}

run().catch((err) => {
  console.error("WORKFLOW TEST FAILED")
  console.error(err)
  process.exit(1)
})
