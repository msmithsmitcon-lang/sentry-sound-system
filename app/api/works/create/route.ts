import { NextResponse } from "next/server"

import { createMusicalWork } from "@/lib/registration/services/create-musical-work"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const result = await createMusicalWork(body)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unexpected create work error."
      },
      {
        status: 400
      }
    )
  }
}
