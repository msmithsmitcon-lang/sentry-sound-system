import { NextResponse } from "next/server"

import { orchestrateTestCreateSong } from "@/lib/songs/test-create-song-orchestration"
import { testCreateSongOrchestrationSupabaseRepository } from "@/lib/songs/test-create-song-orchestration-supabase"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      {
        ok: false,
        mode: "TEST_INTERNAL_ADMIN_ONLY",
        error: {
          code: "INVALID_JSON",
          message: "Request body must be JSON.",
        },
      },
      { status: 400 }
    )
  }

  const result = await orchestrateTestCreateSong({
    repository: testCreateSongOrchestrationSupabaseRepository,
    payload: body,
  })

  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}
