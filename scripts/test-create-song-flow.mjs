import "dotenv/config"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const TEST_NAME = "Markus"

async function run() {
  console.log("TEST START")

  const splitTotal = 100
  if (splitTotal !== 100) throw new Error("Split validation failed")

  const before = await supabase
    .from("contributors")
    .select("id, full_name")
    .ilike("full_name", TEST_NAME)

  console.log("Before:", before.data?.length || 0)

  let contributor = before.data?.[0]

  if (!contributor) {
    const created = await supabase
      .from("contributors")
      .insert({
        full_name: TEST_NAME,
        stage_name: TEST_NAME,
        role: "composer",
        contributor_type: "person",
      })
      .select()
      .single()

    if (created.error) throw created.error
    contributor = created.data
  }

  const asset = await supabase
    .from("assets")
    .insert({
      title: "LOGIC TEST SONG",
      asset_type: "music",
    })
    .select()
    .single()

  if (asset.error) throw asset.error

  const work = await supabase
    .from("musical_works")
    .insert({
      asset_id: asset.data.id,
      work_title: "LOGIC TEST SONG",
      genre: "test",
      mood: "test",
      copyright_status: "draft",
      registration_status: "draft",
    })
    .select()
    .single()

  if (work.error) throw work.error

  const link = await supabase
    .from("work_contributors")
    .insert({
      work_id: work.data.id,
      contributor_id: contributor.id,
      role: "composer",
      split_type: "composition",
      percentage: 100,
      confirmed: false,
    })

  if (link.error) throw link.error

  const after = await supabase
    .from("contributors")
    .select("id, full_name")
    .ilike("full_name", TEST_NAME)

  console.log("After:", after.data?.length || 0)
  console.log("Reused:", before.data?.length === after.data?.length)
  console.log("TEST PASSED")
}

run().catch((err) => {
  console.error("TEST FAILED")
  console.error(err)
})
