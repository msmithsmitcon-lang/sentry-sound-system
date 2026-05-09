import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { createFinanceAuditEvent } from "@/lib/finance/audit/create-finance-audit-event"
import type { ValidatedUpdateFinanceTransaction } from "@/lib/finance/validation/update-transaction-validation"

export type UpdateFinanceTransactionResult = {
  id: string
  description: string
  amount: number
  reconciliationStatus: string
  updatedAt: string
}

export async function updateFinanceTransaction(
  transactionId: string,
  input: ValidatedUpdateFinanceTransaction,
  context: {
    actorId: string
    workspaceId: string
  }
): Promise<UpdateFinanceTransactionResult> {

  const { data: before } = await supabaseAdmin
    .from("finance_transactions")
    .select("*")
    .eq("id", transactionId)
    .single()

  const updatePayload: Record<string, any> = {}

  if (input.description !== undefined) {
    updatePayload.description = input.description
  }

  if (input.amount !== undefined) {
    updatePayload.amount = input.amount
  }

  if (input.reconciliationStatus !== undefined) {
    updatePayload.reconciliation_status =
      input.reconciliationStatus
  }

  const { data, error } = await supabaseAdmin
    .from("finance_transactions")
    .update(updatePayload)
    .eq("id", transactionId)
    .select(`
      id,
      description,
      amount,
      reconciliation_status,
      updated_at
    `)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const result: UpdateFinanceTransactionResult = {
    id: data.id,
    description: data.description,
    amount: Number(data.amount),
    reconciliationStatus: data.reconciliation_status,
    updatedAt: data.updated_at ?? new Date().toISOString(),
  }

  await createFinanceAuditEvent({
    eventType: "transaction.updated",
    entityType: "finance_transaction",
    entityId: result.id,
    actorId: context.actorId,
    workspaceId: context.workspaceId,
    before,
    after: result,
    metadata: {
      source: "protected_finance_api",
    },
  })

  return result
}
