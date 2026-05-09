import {
  createOperationalIncident
} from "@/lib/submission-dispatch/createOperationalIncident"

async function main() {

  const result =
    await createOperationalIncident({
      type:
        "dispatch_failure",

      severity:
        "high",

      title:
        "High failed dispatch volume",

      description:
        "Simulated operational incident",

      metadata: {
        source:
          "incident-test"
      }
    })

  console.log(result)
}

main()
  .catch(console.error)
