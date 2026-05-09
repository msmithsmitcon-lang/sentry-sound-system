const transactionId = "47aa6bcb-2139-4406-bb6b-544da807c73d"

const body = {
  description: "Updated via protected PATCH test",
}

const res = await fetch(
  `http://localhost:3000/api/protected/finance/transactions/${transactionId}`,
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }
)

const json = await res.json()

console.log("STATUS:", res.status)
console.log(JSON.stringify(json, null, 2))
