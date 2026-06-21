import { RuntimeInteractionSession }
from "./runtime-interaction-session"

export function detectInteractionFailure(
  learnerResponse: string
): {
  failed: boolean
  trigger?: string
} {

  const response =
    learnerResponse.toLowerCase()

  if (
    response.includes("dont know") ||
    response.includes("not sure")
  ) {
    return {
      failed: true,
      trigger: "low_confidence",
    }
  }

  return {
    failed: false,
  }
}
