import { supabaseServer } from "@/lib/supabase-server"

import {
  CreateSongRequest,
  validateCreateSongInput
} from "@/lib/registration/contracts/create-song-contract"

export async function createSongWithContributors(
  input: CreateSongRequest
) {
  const validated = validateCreateSongInput(input)

  const { data: asset, error: assetError } = await supabaseServer
    .from("assets")
    .insert([{ title: validated.work_title, asset_type: "music" }])
    .select()
    .single()

  if (assetError || !asset) {
    throw new Error(assetError.message)
  }

  const { data: work, error: workError } = await supabaseServer
    .from("musical_works")
    .insert([{
      asset_id: asset.id,
      work_title: validated.work_title,
      genre: validated.genre,
      mood: validated.mood,
      copyright_status: validated.copyright_status,
      registration_status: validated.registration_status
    }])
    .select()
    .single()

  if (workError || !work) {
    throw new Error(workError.message)
  }

  return {
    success: true,
    work,
    contributors_pending: validated.contributors.length
  }
}
async function resolveContributorId(
  contributor: {
    contributor_id?: string
    name: string
    role: string
  }
) {
  if (contributor.contributor_id) {
    return contributor.contributor_id
  }

  const { data: existingContributor } = await supabaseServer
    .from("contributors")
    .select("id")
    .ilike("full_name", contributor.name.trim())
    .maybeSingle()

  if (existingContributor?.id) {
    return existingContributor.id
  }

  const { data: createdContributor, error: contributorError } =
    await supabaseServer
      .from("contributors")
      .insert([
        {
          full_name: contributor.name,
          stage_name: contributor.name,
          role: contributor.role,
          contributor_type: "person"
        }
      ])
      .select("id")
      .single()

  if (contributorError || !createdContributor) {
    throw new Error("Failed to create contributor.")
  }

  return createdContributor.id
}

