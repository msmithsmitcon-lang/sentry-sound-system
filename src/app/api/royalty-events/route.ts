import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAccountContext } from "@/lib/getAccountContext"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const account_id = await getAccountContext(supabase)

    const body = await request.json()
    const { work_id, gross_amount } = body

    if (!work_id || !gross_amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("royalty_events")
      .insert([
        {
          account_id,
          work_id,
          gross_amount: Number(gross_amount),
          source: "manual",
          status: "draft",
        },
      ])
      .select()
      .single()

    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
  console.error("ROYALTY EVENT API ERROR:", err)
  console.error("ROYALTY EVENT API ERROR:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}





