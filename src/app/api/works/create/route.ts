import { NextRequest, NextResponse } from "next/server"
import { createMusicalWork } from "@/lib/registration/services/create-musical-work"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const result = await createMusicalWork(body)

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        message: "Unexpected server error."
      },
      {
        status: 500
      }
    )
  }
}
