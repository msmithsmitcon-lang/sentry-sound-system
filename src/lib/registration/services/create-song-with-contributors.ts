import { supabaseServer } from "@/lib/supabase-server"

import {
  CreateSongRequest,
  validateCreateSongInput
} from "@/lib/registration/contracts/create-song-contract"

export async function createSongWithContributors(
  input: CreateSongRequest
) {
  const validated = validateCreateSongInput(input)

  const { data, error } = await supabaseServer.rpc(
    "rpc_create_song_with_contributors",
    {
      payload: validated
    }
  )

  if (error) {
    throw new Error(error.message)
  }

  return data
}
