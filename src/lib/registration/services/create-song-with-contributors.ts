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
