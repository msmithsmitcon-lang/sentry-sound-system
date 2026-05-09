export type CreateFinanceTransactionInput = {
  description: string
  amount: number
  referenceType: "income" | "expense" | "transfer"
  debitAccountId?: string
  creditAccountId?: string
}

export type ValidatedCreateFinanceTransaction = {
  description: string
  amount: number
  referenceType: "income" | "expense" | "transfer"
  debitAccountId?: string
  creditAccountId?: string
}

const allowedReferenceTypes = ["income", "expense", "transfer"]

export function validateCreateFinanceTransactionInput(
  input: Partial<CreateFinanceTransactionInput>
): ValidatedCreateFinanceTransaction {
  const description =
    typeof input.description === "string"
      ? input.description.trim().slice(0, 200)
      : ""

  const amount =
    Number(input.amount)

  const referenceType =
    allowedReferenceTypes.includes(input.referenceType as string)
      ? input.referenceType
      : undefined

  if (!description) {
    throw new Error("DESCRIPTION_REQUIRED")
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("VALID_AMOUNT_REQUIRED")
  }

  if (!referenceType) {
    throw new Error("VALID_REFERENCE_TYPE_REQUIRED")
  }

  return {
    description,
    amount,
    referenceType,
    debitAccountId: input.debitAccountId,
    creditAccountId: input.creditAccountId,
  }
}
