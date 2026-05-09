import {
  resolveOperationalAlerts
} from "@/lib/submission-dispatch/resolveOperationalAlerts"

async function main() {

  const alerts =
    await resolveOperationalAlerts()

  console.log(alerts)
}

main()
  .catch(console.error)
