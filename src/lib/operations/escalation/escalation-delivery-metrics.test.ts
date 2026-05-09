import { getEscalationDeliveryMetrics } from "./escalation-delivery-metrics.service"

async function main() {
  const metrics = await getEscalationDeliveryMetrics()

  if (metrics.totalNotifications < 1) {
    throw new Error("Expected at least one notification in metrics.")
  }

  if (metrics.successRate < 0) {
    throw new Error("Expected valid success rate.")
  }

  console.log("Escalation Delivery Metrics V1 test passed", metrics)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
