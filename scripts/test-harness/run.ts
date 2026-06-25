const BASE_URL = "http://localhost:3000"

async function run() {
  console.log("TEST HARNESS START")

  const worksResponse = await fetch(`${BASE_URL}/api/test/get-work`)
  const workList = await worksResponse.json()

  const work = workList?.[0]

  if (!work) {
    console.log("No test work found")
    return
  }

  console.log("Work selected:", work.id)

  const readinessResponse = await fetch(
    `${BASE_URL}/api/submissions/readiness?work_id=${work.id}`
  )
  const readinessData = await readinessResponse.json()

  console.log("Readiness:")
  console.log(JSON.stringify(readinessData, null, 2))

  const submissionResponse = await fetch(
    `${BASE_URL}/api/submissions/create-from-work`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        work_id: work.id,
      }),
    }
  )

  const submissionData = await submissionResponse.json()

  console.log("Submission:")
  console.log(JSON.stringify(submissionData, null, 2))

  console.log("TEST HARNESS COMPLETE")
}

run().catch(console.error)
