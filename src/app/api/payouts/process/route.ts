import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { processPayoutBatch } from "@/lib/royalties/processPayoutBatch"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { payout_batch_id } = body

    if (!payout_batch_id) {
      return NextResponse.json({ error: "Missing payout_batch_id" }, { status: 400 })
    }

    const result = await processPayoutBatch({
      supabase,
      payout_batch_id,
    })

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (err: any) {
    console.error("PAYOUT PROCESS API ERROR:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
