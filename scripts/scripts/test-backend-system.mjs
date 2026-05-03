import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function expectBlocked(label, fn) {
  const result = await fn()
  if (!result.error) throw new Error(label + " was NOT blocked")
  console.log("BLOCKED:", label)
}

async function run() {
  console.log("SENTRY SOUND BACKEND TEST START")

  const contributorName = "Backend Test Composer"

  const existing = await supabase
    .from("contributors")
    .select("id")
    .eq("full_name", contributorName)
    .maybeSingle()

  let contributorId = existing.data?.id

  if (!contributorId) {
    const created = await supabase
      .from("contributors")
      .insert({
        full_name: contributorName,
        stage_name: contributorName,
        role: "composer",
        contributor_type: "person",
      })
      .select()
      .single()

    if (created.error) throw created.error
    contributorId = created.data.id
  }

  await expectBlocked("duplicate contributor", async () =>
    supabase.from("contributors").insert({
      full_name: contributorName,
      stage_name: contributorName,
      role: "composer",
      contributor_type: "person",
    })
  )

  const asset = await supabase
    .from("assets")
    .insert({
      title: "BACKEND FULL TEST SONG",
      asset_type: "music",
    })
    .select()
    .single()

  if (asset.error) throw asset.error

  const work = await supabase
    .from("musical_works")
    .insert({
      asset_id: asset.data.id,
      work_title: "BACKEND FULL TEST SONG",
      genre: "test",
      mood: "test",
      copyright_status: "draft",
      registration_status: "draft",
      registration_stage: "draft",
    })
    .select()
    .single()

  if (work.error) throw work.error

  const link = await supabase
    .from("work_contributors")
    .insert({
      work_id: work.data.id,
      contributor_id: contributorId,
      role: "composer",
      split_type: "composition",
      percentage: 100,
      confirmed: false,
    })

  if (link.error) throw link.error
  console.log("OK: valid composer split inserted")

  await expectBlocked("duplicate work contributor link", async () =>
    supabase.from("work_contributors").insert({
      work_id: work.data.id,
      contributor_id: contributorId,
      role: "composer",
      split_type: "composition",
      percentage: 100,
      confirmed: false,
    })
  )

  const registration = await supabase
    .from("musical_works")
    .update({ registration_stage: "ready" })
    .eq("id", work.data.id)

  if (registration.error) throw registration.error
  console.log("OK: registration readiness passed")

  const logs = await supabase
    .from("audit_logs")
    .select("id")
    .eq("entity_type", "work_contributor")
    .limit(1)

  if (logs.error) throw logs.error
  if (!logs.data || logs.data.length === 0) {
    throw new Error("audit log not created")
  }

  console.log("OK: audit logs exist")
  console.log("SENTRY SOUND BACKEND TEST PASSED")
}

run().catch((err) => {
  console.error("SENTRY SOUND BACKEND TEST FAILED")
  console.error(err)
  process.exit(1)
})
