const endpoints = [
  "http://localhost:3000/api/protected/finance-contract-test",
  "http://localhost:3000/api/protected/finance/dashboard-summary",
  "http://localhost:3000/api/protected/finance/transactions?page=1&pageSize=20",
]

async function run() {
  for (const url of endpoints) {
    const res = await fetch(url)
    const json = await res.json()

    console.log("\n" + url)
    console.log(JSON.stringify(json, null, 2))

    if (typeof json.success !== "boolean") {
      throw new Error(`Missing success field: ${url}`)
    }

    if (!json.success && !json.error) {
      throw new Error(`Missing error contract: ${url}`)
    }

    if (json.success && !json.meta?.generatedAt) {
      throw new Error(`Missing meta.generatedAt: ${url}`)
    }
  }

  console.log("\nProtected finance API contract tests passed.")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
