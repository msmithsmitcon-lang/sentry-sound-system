async function run() {
  const response = await fetch(
    "http://localhost:3000/api/submissions/create-from-work",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        work_id:
          "1d6de1ff-540d-4ad4-8212-2a3371d4bb66",
      }),
    }
  )

  const result =
    await response.json()

  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  )
}

run().catch(console.error)
