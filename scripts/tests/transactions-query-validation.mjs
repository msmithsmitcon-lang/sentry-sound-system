import { validateTransactionsQuery } from "../../src/lib/finance/validation/transactions-query-validation.ts"

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${expected}, got ${actual}`)
  }
}

let q = validateTransactionsQuery({ page: "1", pageSize: "20" })
assertEqual(q.page, 1, "page should parse")
assertEqual(q.pageSize, 20, "pageSize should parse")

q = validateTransactionsQuery({ page: "-5", pageSize: "0" })
assertEqual(q.page, 1, "invalid page should default")
assertEqual(q.pageSize, 20, "invalid pageSize should default")

q = validateTransactionsQuery({ page: "2", pageSize: "500" })
assertEqual(q.page, 2, "page should parse")
assertEqual(q.pageSize, 100, "pageSize should cap at 100")

console.log("Transactions query validation tests passed.")
