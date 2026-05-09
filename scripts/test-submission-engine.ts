import { runSubmissionEngineTest } from "../src/lib/registration/submission-engine/services/run-submission-engine-test.service"

async function main() {
  const result = await runSubmissionEngineTest()

  console.log(JSON.stringify(result, null, 2))
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
