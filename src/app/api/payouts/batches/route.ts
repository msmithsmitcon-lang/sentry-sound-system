import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAccountContext } from "@/lib/getAccountContext"

export async function POST() {
  try {
    const supabase = await createClient()
    const account_id = await getAccountContext(supabase)

    const { data: balances, error: balanceError } = await supabase
      .from("contributor_balances")
      .select("contributor_id, outstanding_balance")
      .gt("outstanding_balance", 0)

    if (balanceError) throw new Error(balanceError.message)

    if (!balances || balances.length === 0) {
      return NextResponse.json(
        { error: "No payable contributor balances found" },
        { status: 400 }
      )
    }

    const totalAmount = balances.reduce(
      (sum, item) => sum + Number(item.outstanding_balance || 0),
      0
    )

    const { data: batch, error: batchError } = await supabase
      .from("payout_batches")
      .insert([
        {
          account_id,
          batch_name: "Test Payout Batch",
          status: "draft",
          total_amount: Number(totalAmount.toFixed(2)),
        },
      ])
      .select()
      .single()

    if (batchError) throw new Error(batchError.message)

    const payoutItems = balances.map((item) => ({
      account_id,
      payout_batch_id: batch.id,
      contributor_id: item.contributor_id,
      amount: Number(item.outstanding_balance || 0),
      status: "pending",
    }))

    const { error: itemsError } = await supabase
      .from("payout_items")
      .insert(payoutItems)

    if (itemsError) throw new Error(itemsError.message)

    return NextResponse.json({
      success: true,
      batch,
      items_created: payoutItems.length,
    })
  } catch (err: any) {
    console.error("PAYOUT BATCH API ERROR:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

