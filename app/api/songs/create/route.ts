import { NextResponse } from "next/server"

import { createSongWithContributors } from "@/lib/registration/services/create-song-with-contributors"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const result = await createSongWithContributors(body)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unexpected create song error."
      },
      {
        status: 400
      }
    )
  }
}
