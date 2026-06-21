import { supabaseServer } from "@/lib/supabase-server"

import {
  CreateSongRequest,
  validateCreateSongInput
} from "@/lib/registration/contracts/create-song-contract"

export async function createSongWithContributors(
  input: CreateSongRequest,
  context: {
    workspaceId: string
    createdByUserId: string
  }
) {
  const validated = validateCreateSongInput(input)

  const { data, error } = await supabaseServer.rpc(
    "rpc_create_song_with_contributors",
    {
      payload: {
        ...validated,
        workspace_id: context.workspaceId,
        created_by_user_id: context.createdByUserId,
      },
    }
  )

  if (error) {
    throw new Error(error.message)
  }

  return data
}
