import { validateCreateFinanceTransactionInput } from "../../src/lib/finance/validation/create-transaction-validation.ts"

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

const valid = validateCreateFinanceTransactionInput({
  description: "Test transaction",
  amount: 100,
  referenceType: "expense",
})

assert(valid.description === "Test transaction", "description should validate")
assert(valid.amount === 100, "amount should validate")
assert(valid.referenceType === "expense", "referenceType should validate")

try {
  validateCreateFinanceTransactionInput({
    description: "",
    amount: 100,
    referenceType: "expense",
  })
  throw new Error("empty description should fail")
} catch (error) {
  assert(error.message === "DESCRIPTION_REQUIRED", "description error expected")
}

try {
  validateCreateFinanceTransactionInput({
    description: "Bad amount",
    amount: 0,
    referenceType: "expense",
  })
  throw new Error("zero amount should fail")
} catch (error) {
  assert(error.message === "VALID_AMOUNT_REQUIRED", "amount error expected")
}

console.log("Create transaction validation tests passed.")
