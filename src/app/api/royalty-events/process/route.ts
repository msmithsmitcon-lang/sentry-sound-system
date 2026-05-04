import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { processRoyaltyEventToLedger } from "@/lib/royalties/processRoyaltyEventToLedger"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { royalty_event_id, work_id, gross_amount } = body

    if (!royalty_event_id || !work_id || !gross_amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const result = await processRoyaltyEventToLedger({
      supabase,
      royalty_event_id,
      work_id,
      gross_amount: Number(gross_amount),
    })

    return NextResponse.json({ success: true, result })
  } catch (err: any) {
    console.error("ROYALTY PROCESS API ERROR:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
