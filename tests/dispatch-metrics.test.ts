import {
  getDispatchMetricsSnapshot
} from "@/lib/submission-dispatch/getDispatchMetricsSnapshot"

async function main() {

  const snapshot =
    await getDispatchMetricsSnapshot()

  console.log(snapshot)
}

main()
  .catch(console.error)
