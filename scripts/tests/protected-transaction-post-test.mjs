const body = {
  description: "Protected API test transaction",
  amount: 123,
  referenceType: "expense",
}

const res = await fetch("http://localhost:3000/api/protected/finance/transactions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
})

const json = await res.json()

console.log("STATUS:", res.status)
console.log(JSON.stringify(json, null, 2))
