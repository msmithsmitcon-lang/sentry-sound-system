import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("contributor_balances")
      .select("contributor_id, full_name, total_earned, total_paid, outstanding_balance")
      .order("full_name")

    if (error) throw new Error(error.message)

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (err: any) {
    console.error("CONTRIBUTOR BALANCES API ERROR:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
